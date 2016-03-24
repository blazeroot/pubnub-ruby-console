import {Injectable} from 'angular2/core';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/share';
import {Envelope} from '../interfaces/envelope';

declare var EventSource;

@Injectable()
export class MessagesService {
    messages$:   Observable<Array<Envelope>>;
    presence$:   Observable<Array<Envelope>>;
    history$:    Observable<Array<Envelope>>;
    whereNow$:   Observable<Array<Envelope>>;
    setState$:   Observable<Array<Envelope>>;
    checkState$: Observable<Array<Envelope>>;
    cgAction$:   Observable<Array<Envelope>>;
    listGroup$:  Observable<Array<Envelope>>;
    pam$:        Observable<Array<Envelope>>;

    private _messagesObserver:  any;
    private _presenceObserver:  any;
    private _historyObserver:   any;
    private _whereNowObserver:  any;
    private _setStateObserver:  any;
    private _checkStateObserver:any;
    private _cgActionObserver:  any;
    private _listGroupObserver: any;
    private _pamObserver:       any;

    private dataSource:any;
    private _dataStore:{ subscribeMessages:  Array<Envelope>,
                         presenceMessages:   Array<Envelope>,
                         historyMessages:    Array<Envelope>,
                         whereNowMessages:   Array<Envelope>,
                         setStateMessages:   Array<Envelope>,
                         checkStateMessages: Array<Envelope>,
                         cgActionMessages:   Array<Envelope>,
                         listGroupMessages:  Array<Envelope>,
                         pamMessages:        Array<Envelope>
    };

    constructor() {
        this.dataSource  = new EventSource("http://localhost:9292/messages");
        this.messages$   = new Observable(observer => this._messagesObserver   = observer).share();
        this.presence$   = new Observable(observer => this._presenceObserver   = observer).share();
        this.history$    = new Observable(observer => this._historyObserver    = observer).share();
        this.whereNow$   = new Observable(observer => this._whereNowObserver   = observer).share();
        this.setState$   = new Observable(observer => this._setStateObserver   = observer).share();
        this.checkState$ = new Observable(observer => this._checkStateObserver = observer).share();
        this.cgAction$   = new Observable(observer => this._cgActionObserver   = observer).share();
        this.listGroup$  = new Observable(observer => this._listGroupObserver  = observer).share();
        this.pam$        = new Observable(observer => this._pamObserver        = observer).share();
        this._dataStore = { subscribeMessages:  [],
                            presenceMessages:   [],
                            historyMessages:    [],
                            whereNowMessages:   [],
                            setStateMessages:   [],
                            checkStateMessages: [],
                            cgActionMessages:   [],
                            listGroupMessages:  [],
                            pamMessages:        []
        };
    }

    loadSubscribeMessages() : any {

        // SUBSCRIBE
        this.dataSource.addEventListener("subscribe", e => {
            var data = JSON.parse(e.data);
            var envelope: Envelope = this.formEnvelope(data);
            this._dataStore.subscribeMessages = [envelope].concat(this._dataStore.subscribeMessages);
            this._messagesObserver.next(this._dataStore.subscribeMessages);
        }, false);

        // LEAVE
        this.dataSource.addEventListener("leave", e => {
            var data = JSON.parse(e.data);
            var envelope: Envelope = this.formEnvelope(data);
            this._dataStore.subscribeMessages = [envelope].concat(this._dataStore.subscribeMessages);
            this._messagesObserver.next(this._dataStore.subscribeMessages);
        }, false);

        // PUBLISH
        this.dataSource.addEventListener("publish", e => {
            var data = JSON.parse(e.data);
            var envelope: Envelope = this.formEnvelope(data);
            this._dataStore.subscribeMessages = [envelope].concat(this._dataStore.subscribeMessages);
            this._messagesObserver.next(this._dataStore.subscribeMessages);
        }, false);
    }

    loadPresenceMessages() : any {
        // PRESENCE
        this.dataSource.addEventListener("presence", e => {
            var data = JSON.parse(e.data);
            var envelope: Envelope = this.formEnvelope(data);
            this._dataStore.presenceMessages = [envelope].concat(this._dataStore.presenceMessages);
            this._presenceObserver.next(this._dataStore.presenceMessages);
        }, false);
    }

    loadHistoryMessages() : any {
        // HISTORY
        this.dataSource.addEventListener("history", e => {
            var data = JSON.parse(e.data);
            var envelope: Envelope = this.formEnvelope(data);
            this._dataStore.historyMessages = [envelope].concat(this._dataStore.historyMessages);
            this._historyObserver.next(this._dataStore.historyMessages);
        }, false);
    }

    loadWhereNowMessages() : any {
        // WHERE NOW
        this.dataSource.addEventListener("whereNow", e => {
            var data = JSON.parse(e.data);
            var envelope: Envelope = this.formEnvelope(data);
            this._dataStore.whereNowMessages = [envelope].concat(this._dataStore.whereNowMessages);
            this._whereNowObserver.next(this._dataStore.whereNowMessages);
        }, false);
    }

    loadSetStateMessages() : any {
        // SET STATE
        this.dataSource.addEventListener("setState", e => {
            var data = JSON.parse(e.data);
            var envelope: Envelope = this.formEnvelope(data);
            this._dataStore.setStateMessages = [envelope].concat(this._dataStore.setStateMessages);
            this._setStateObserver.next(this._dataStore.setStateMessages);
        }, false)
    }

    loadCheckStateMessages() : any {
        // CHECK STATE
        this.dataSource.addEventListener("checkState", e => {
            var data = JSON.parse(e.data);
            var envelope: Envelope = this.formEnvelope(data);
            this._dataStore.checkStateMessages = [envelope].concat(this._dataStore.checkStateMessages);
            this._checkStateObserver.next(this._dataStore.checkStateMessages);
        }, false)
    }

    loadCgActionMessages() : any {
        // CHANNEL GROUP ACTIONS
        this.dataSource.addEventListener("cgAction", e => {
            var data = JSON.parse(e.data);
            var envelope: Envelope = this.formEnvelope(data);
            this._dataStore.cgActionMessages = [envelope].concat(this._dataStore.cgActionMessages);
            this._cgActionObserver.next(this._dataStore.cgActionMessages);
        }, false)
    }

    loadListGroupMessages() : any {
        // LIST CHANNEL GROUP
        this.dataSource.addEventListener("listGroup", e => {
            var data = JSON.parse(e.data);
            var envelope: Envelope = this.formEnvelope(data);
            this._dataStore.listGroupMessages = [envelope].concat(this._dataStore.listGroupMessages);
            this._listGroupObserver.next(this._dataStore.listGroupMessages);
        }, false)
    }

    loadPAMMessages() : any {
        // PAM
        this.dataSource.addEventListener("pam", e => {
            var data = JSON.parse(e.data);
            var envelope: Envelope = this.formEnvelope(data);
            this._dataStore.pamMessages = [envelope].concat(this._dataStore.pamMessages);
            this._pamObserver.next(this._dataStore.pamMessages);
        }, false)
    }

    private formEnvelope(data) {
        var envelope: Envelope = {
            id: data.envelope.id,
            response: data.envelope.response,
            parsedResponse: data.envelope.parsed_response,
            status: data.envelope.status,
            channel: data.envelope.channel,
            message: data.envelope.message,
            payload: data.envelope.payload,
            service: data.envelope.service,
            timetoken: data.envelope.timetoken,
            responseMessage: data.envelope.response_message,
            error: data.envelope.error,
            action: data.envelope.action,
            uuid: data.envelope.uuid,
            uuids: data.envelope.uuids,
            group: data.envelope.group,
            wildcardChannel: data.envelope.wildcard_channel,
        };

        return envelope;
    }
}