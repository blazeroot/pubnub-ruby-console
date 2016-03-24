import {Injectable} from 'angular2/core';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/share';
import {Subscription} from "../interfaces/subscription";
import {Subscriptions} from "../models/subscriptions";
import {OnInit} from "angular2/core";
import {Http, HTTP_PROVIDERS} from 'angular2/http';

@Injectable()
export class SubscriptionsService {
    subscriptions$:Observable<Subscriptions>;
    presenceSubscriptions$:Observable<Subscriptions>;

    private _subscriptionsObserver:any;
    private _presenceSubscriptionsObserver:any;

    private _subscriptions: Subscriptions;
    private _presenceSubscriptions: Subscriptions;

    private _http: Http;

    constructor(http: Http) {
        this.presenceSubscriptions$ = new Observable(observer => this._presenceSubscriptionsObserver = observer).share();
        this._presenceSubscriptions = new Subscriptions;

        this.subscriptions$ = new Observable(observer => this._subscriptionsObserver = observer).share();
        this._subscriptions = new Subscriptions;

        this._http = http;
    }

    subscribe(name: string, channelGroup: string) {
        var isChannelGroup = channelGroup == "channelGroup";

        if(name.length == 0 || this._subscriptions.isSubscribedTo({name: name, channelGroup: isChannelGroup})){ return }

        if(isChannelGroup){
            this.subscribeToChannelGroup(name)
        }else{
            this.subscribeToChannel(name)
        }
    }

    presence(channelName: string, channelGroup: string) {
        var isChannelGroup = channelGroup == "channelGroup";

        var name:string = channelName + '-pnpres';

        if(name.length == 0 || this._presenceSubscriptions.isSubscribedTo({name: name, channelGroup: isChannelGroup})){ return }

        if(isChannelGroup){
            this.presenceToChannelGroup(name)
        }else{
            this.presenceToChannel(name)
        }
    }

    leave(subscription) {
        if(subscription.channelGroup){
            var url:string = '/leave/channel-group/' + subscription.name
        }else{
            var url:string = '/leave/channel/' + subscription.name
        }

        this._http.get('http://localhost:9292' + url)
            .subscribe(
                data => console.log(data),
                err => console.log(err),
                () => console.log('left channel' + subscription.name)
            );
        this.removeSubscription(subscription);
    }

    leavePresence(subscription) {
        if(subscription.channelGroup){
            var url:string = '/leave/channel-group/' + subscription.name
        }else{
            var url:string = '/leave/channel/' + subscription.name
        }

        this._http.get('http://localhost:9292' + url)
            .subscribe(
                data => console.log(data),
                err => console.log(err),
                () => console.log('left channel' + subscription.name)
            );
        this.removePresence(subscription);
    }


    fetchCurrentSubscriptions() {
        this._http.get('http://localhost:9292/subscriptions.json')
            .subscribe(data => this.addSubscriptions(JSON.parse(data.text())));
        this._subscriptionsObserver.next(this._subscriptions);
    }

    fetchCurrentPresence(){
        this._http.get('http://localhost:9292/presence.json')
            .subscribe(data => this.addPresenceSubscriptions(JSON.parse(data.text())));
        this._presenceSubscriptionsObserver.next(this._presenceSubscriptions);
    }

    private addSubscription(name, channelGroup){
        this._subscriptions.addSubscription({name: name, channelGroup: channelGroup})
    }

    private addPresenceSubscription(name, channelGroup){
        this._presenceSubscriptions.addSubscription({name: name, channelGroup: channelGroup})
    }

    private removeSubscription(subscription: Subscription) {
        this._subscriptions.removeSubscription(subscription);
        this._subscriptionsObserver.next(this._subscriptions);
    }

    private removePresence(subscription: Subscription) {
        this._presenceSubscriptions.removeSubscription(subscription);
        this._presenceSubscriptionsObserver.next(this._presenceSubscriptions);
    }

    private subscribeToChannel(name: string) {
        var url: string = '/subscribe/channel/' + name;
        this._http.get('http://localhost:9292' + url)
            .subscribe(
                data => console.log(data),
                err => console.log(err),
                () => console.log('subscribed to channel')
            );
        this._subscriptions.addSubscription({name: name, channelGroup: false});
        this._subscriptionsObserver.next(this._subscriptions);
    }

    private subscribeToChannelGroup(name: string) {
        var url: string = '/subscribe/channel-group/' + name;
        this._http.get('http://localhost:9292' + url)
            .subscribe(
                data => console.log(data),
                err => console.log(err),
                () => console.log('subscribed to channel group')
            );
        this._subscriptions.addSubscription({name: name, channelGroup: true});
        this._subscriptionsObserver.next(this._subscriptions);
    }

    private presenceToChannel(name: string) {
        var url: string = '/presence/channel/' + name;
        this._http.get('http://localhost:9292' + url)
            .subscribe(
                data => console.log(data),
                err => console.log(err),
                () => console.log('subscribed to channel presence')
            );
        this._presenceSubscriptions.addSubscription({name: name, channelGroup: false});
        this._presenceSubscriptionsObserver.next(this._presenceSubscriptions);
    }

    private presenceToChannelGroup(name: string) {
        var url: string = '/presence/channel-group/' + name;
        this._http.get('http://localhost:9292' + url)
            .subscribe(
                data => console.log(data),
                err => console.log(err),
                () => console.log('subscribed to channel group presence')
            );
        this._presenceSubscriptions.addSubscription({name: name, channelGroup: true});
        this._presenceSubscriptionsObserver.next(this._presenceSubscriptions);
    }

    private addPresenceSubscriptions(subscriptions: JSON){
        if(subscriptions["channels"]) {
            for (var channel of subscriptions["channels"]) {
                this.addPresenceSubscription(channel, false)
            }
        }
        if(subscriptions["groups"]) {
            for(var channelGroup of subscriptions["groups"]){
                this.addPresenceSubscription(channelGroup, true)
            }}
    }


    private addSubscriptions(subscriptions: JSON){
        if(subscriptions["channels"]) {
            for (var channel of subscriptions["channels"]) {
                this.addSubscription(channel, false)
            }
        }
        if(subscriptions["groups"]) {
            for(var channelGroup of subscriptions["groups"]){
            this.addSubscription(channelGroup, true)
        }}
    }
}