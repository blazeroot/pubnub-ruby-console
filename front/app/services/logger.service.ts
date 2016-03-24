import {Injectable} from 'angular2/core';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/share';


// Type definitions for Server-Sent Events
// Specification: http://dev.w3.org/html5/eventsource/
// Definitions by: Yannik Hampe <https://github.com/yankee42>

declare var EventSource;

@Injectable()
export class LoggerService {
    messages$:Observable<Array<String>>;

    private _messagesObserver:any;
    private dataSource: any;
    private _dataStore:{ messages: Array<String> };

    constructor() {
        this.dataSource = new EventSource("http://localhost:9292/log");
        this.messages$ = new Observable(observer => this._messagesObserver = observer).share();
        this._dataStore = { messages: []};
    }

    loadMessages() : any {
        this.dataSource.addEventListener("logMessage", e => {
            var data = JSON.parse(e.data);
            this._dataStore = {messages: this._dataStore.messages.concat(data.message)};
            this._messagesObserver.next(this._dataStore.messages);
        }, false);
    }
}