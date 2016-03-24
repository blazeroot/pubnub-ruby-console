require 'rubygems'
require 'logger'
require 'pubnub'

require 'sinatra/base'
require 'sinatra/sse'
require 'thin'

require 'json'

require 'pry'

require './log_duper'

MESSAGE_STORE_LIMIT = 1000

# Let's extend Pubnub::Envelope for our usage here
module Pubnub
  class Envelope
    def to_json
      %w(id response parsed_response status channel message payload service
         timetoken response_message error action uuid uuids group
         wildcard_channel).map do|attr|
        { attr => instance_variable_get("@#{attr}") }
      end.reduce({}, :merge)
    end
  end
end

class ConsoleServer < Sinatra::Base
  include Sinatra::SSE

  logfile = File.open('pubnub.log', 'a')

  @@pubnub         = nil

  @@connections    = {}
  @@last_push_time = 0

  @@log_array      = []
  @@envelope_array = []

  custom_logger    = Logger.new(LogDuper.new(@@log_array, logfile))

  @@publish_callback     = -> (envelope) { @@envelope_array << [:publish,    envelope, (Time.now.to_f * 1000).to_i.to_s]}
  @@subscribe_callback   = -> (envelope) { @@envelope_array << [:subscribe,  envelope, (Time.now.to_f * 1000).to_i.to_s]}
  @@presence_callback    = -> (envelope) { @@envelope_array << [:presence,   envelope, (Time.now.to_f * 1000).to_i.to_s]}
  @@pam_callback         = -> (envelope) { @@envelope_array << [:pam,        envelope, (Time.now.to_f * 1000).to_i.to_s]}
  @@history_callback     = -> (envelope) { @@envelope_array << [:history,    envelope, (Time.now.to_f * 1000).to_i.to_s]}
  @@leave_callback       = -> (envelope) { @@envelope_array << [:leave,      envelope, (Time.now.to_f * 1000).to_i.to_s]}
  @@where_now_callback   = -> (envelope) { @@envelope_array << [:whereNow,   envelope, (Time.now.to_f * 1000).to_i.to_s]}
  @@check_state_callback = -> (envelope) { @@envelope_array << [:checkState, envelope, (Time.now.to_f * 1000).to_i.to_s]}
  @@set_state_callback   = -> (envelope) { @@envelope_array << [:setState,   envelope, (Time.now.to_f * 1000).to_i.to_s]}
  @@cg_action_callback   = -> (envelope) { @@envelope_array << [:cgAction,   envelope, (Time.now.to_f * 1000).to_i.to_s]}
  @@cg_list_callback     = -> (envelope) { @@envelope_array << [:listGroup,  envelope, (Time.now.to_f * 1000).to_i.to_s]}

  def self.remove_excess_messages
    return unless @@envelope_array.size > MESSAGE_STORE_LIMIT
    shift = @@envelope_array.size - MESSAGE_STORE_LIMIT
    @@envelope_array.shift(shift)
  end

  def self.envelopes_after(envelopes, time)
    envelopes.select do |event_response|
      event_response[2].to_i > time.to_i
    end
  end

  def self.keep_pushing_envelopes
    Thread.new do
      begin
        loop do
          sleep 0.1

          event_responses = envelopes_after(@@envelope_array, @@last_push_time)

          @@last_push_time = (Time.now.to_f * 1000).to_i if event_responses.size > 0
          while event_responses.size > 0

            event_response = event_responses.pop

            event          = event_response[0]
            envelope       = event_response[1]
            time           = event_response[2]

            @@connections.each_value do |v|
              v[:sse].push id: time,
                           event: event.to_s,
                           data: { envelope: envelope.to_json }.to_json
            end

            remove_excess_messages if @@envelope_array.size > MESSAGE_STORE_LIMIT
          end
        end
      rescue => error
        puts error
        puts error.backtrace
      end
    end
  end

  before '*' do
    pass if request.path_info == '/messages'

    headers['Content-Type'] = 'application/json'
    headers['Access-Control-Allow-Origin'] = '*'
    headers['Access-Control-Allow-Methods'] = '*'
  end

  before '*' do
    pass if ['/client.json', '/init.json', '/messages'].include? request.path_info

    raise 'Pubnub Client not initialized!' unless @@pubnub
  end

  post '/init.json' do
    request.body.rewind

    opts = JSON.parse(request.body.read)

    @@pubnub = Pubnub.new(opts)

    {
        subscribe_key: @@pubnub.env[:subscribe_key],
        publish_key:   @@pubnub.env[:publish_key],
        secret_key:    @@pubnub.env[:secret_key],
        auth_key:      @@pubnub.env[:auth_key],
        uuid:          @@pubnub.env[:uuid],
        initialized:   true
    }.to_json
  end

  get '/client.json' do
    if @@pubnub

      {
          subscribe_key: @@pubnub.env[:subscribe_key],
          publish_key:   @@pubnub.env[:publish_key],
          secret_key:    @@pubnub.env[:secret_key],
          auth_key:      @@pubnub.env[:auth_key],
          uuid:          @@pubnub.env[:uuid],
          initialized:   true
      }.to_json
    else
      { initiazed: false }.to_json
    end
  end

  get '/' do
    haml :index
  end

  post '/publish/:channel' do
    request.body.rewind

    message  = request.body.read
    envelope = @@pubnub.publish(channel: params[:channel], message: message, callback: @@publish_callback).value.first

    envelope.to_json

    'Published'
  end

  get '/subscriptions.json' do
    { channels: @@pubnub.subscriber.channels.select { |c| !c.index('-pnpres') },
      groups: @@pubnub.subscriber.groups.select { |c| !c.index('-pnpres') } }.to_json
  end

  post '/where_now.json' do

    request.body.rewind

    where_now_options = JSON.parse(request.body.read)

    enve = @@pubnub.where_now(where_now_options.merge(callback: @@where_now_callback))

    enve.value
    'ok'
  end

  get '/presence.json' do
    { channels: @@pubnub.subscriber.channels.select { |c| c.index('-pnpres') },
      groups: @@pubnub.subscriber.groups.select { |c| c.index('-pnpres') } }.to_json
  end

  post '/history.json' do
    request.body.rewind

    history_options = JSON.parse(request.body.read)

    enve = @@pubnub.history(history_options.merge(callback: @@history_callback))

    enve.value
    'ok'
  end

  get '/subscribe/channel/:channel' do
    enve = @@pubnub.subscribe(channel: params['channel'], callback: @@subscribe_callback) if params['channel']

    enve.value.first.status
  end

  get '/presence/channel/:channel' do
    enve = @@pubnub.subscribe(channel: params['channel'], callback: @@presence_callback) if params['channel']

    enve.value.first.status
  end

  get '/leave/channel/:channel' do
    @@pubnub.leave(channel: params['channel'], callback: @@leave_callback).value

    'ok'
  end

  get '/subscribe/channel-group/:channel_group' do
    @@pubnub.subscribe(channel_group: params['channel_group'], callback: @@subscribe_callback) if params['channel_group']
  end

  get '/leave/channel-group/:channel_group' do
    @@pubnub.leave(channel_group: params['channel_group'], callback: @@leave_callback).value

    'ok'
  end

  get '/messages', provides: 'text/event-stream' do
    headers['Content-Type'] = 'application/json'
    headers['Access-Control-Allow-Origin'] = '*'
    headers['Access-Control-Allow-Methods'] = '*'

    sse_stream do |sse|
      conn_id = Pubnub::UUID.generate
      @@connections[conn_id] = {
        sse: sse,
        last_activity: Time.now
      }
      sse.callback do
        puts 'Removing connection'
        @@connections.delete(conn_id)
        puts @@connections
      end
    end
  end

  get '/presence/:channel' do
    @@pubnub.here_now(channel: params[:channel], callback: @@presence_callback).value

    'ok'
  end

  post '/getState.json' do
    request.body.rewind

    check_state_opts = JSON.parse(request.body.read).delete_if {|_k,v| v.empty? }

    @@pubnub.state(check_state_opts.merge(callback: @@check_state_callback)).value

    'ok'
  end

  post '/setState.json' do
    request.body.rewind
    state = JSON.parse(request.body.read)

    state.each_key do |channel|
      @@pubnub.set_state(channel: channel, state: state[channel], callback: @@set_state_callback)
    end

    'ok'
  end

  post '/cgAdd.json' do
    request.body.rewind
    opts = JSON.parse(request.body.read)

    @@pubnub.channel_registration(opts.merge({action: :add, callback: @@cg_action_callback})).value

    'ok'
  end

  post '/cgRemove.json' do
    request.body.rewind
    opts = JSON.parse(request.body.read)

    @@pubnub.channel_registration(opts.merge({action: :remove, callback: @@cg_action_callback})).value

    'ok'
  end

  post '/listChannels.json' do
    request.body.rewind
    opts = JSON.parse(request.body.read)

    @@pubnub.channel_registration(opts.merge({action: :get, callback: @@cg_list_callback})).value

    'ok'
  end

  post '/listGroups.json' do
    @@pubnub.channel_registration(action: :list_groups, callback: @@cg_list_callback).value

    'ok'
  end

  post '/pam.json' do
    request.body.rewind
    opts = JSON.parse(request.body.read)

    action = opts.delete('action').to_sym

    opts.delete_if do |_k, v|
      v.respond_to?(:empty?) ? v.empty? : false
    end

    opts['ttl'] = opts['ttl'].to_i if opts['ttl']

    case action
    when :grant
      @@pubnub.grant(opts.merge(callback: @@pam_callback))
    when :revoke
      @@pubnub.revoke(opts.merge(callback: @@pam_callback))
    when :audit
      @@pubnub.audit(opts.merge(callback: @@pam_callback))
    end
  end

  get '/log' do
    sse_stream do |out|
      loop do
        sleep 0.01
        until @@log_array.empty?
          val = @@log_array.pop
          out.push event: 'logMessage',
                   data: { message: val.chop }.to_json if val
        end
      end
    end
  end

  get '/pry' do
    binding.pry
  end
end
