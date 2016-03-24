import {Component} from 'angular2/core';
import {SingleEventService} from "../services/single-event.service";
import {AfterViewInit} from "angular2/core";
import {OnInit} from "angular2/core";
import {MessagesService} from "../services/messages.service";
import {EnvelopeComponent} from "./envelope.component";
import {Envelope} from "../interfaces/envelope";

declare var $;

@Component({
    selector: 'history',
    templateUrl: 'templates/history.html',
    providers: [SingleEventService],
    directives: [EnvelopeComponent]
})

export class HistoryComponent implements AfterViewInit, OnInit {
    public _historyEnvelopes: Array<Envelope>;

    public _historyOpts:{} = {
        channel: '',
        count: null,
        start: null,
        end: null,
        reversed: 0
    };

    constructor(private _singleEventService:SingleEventService,
                private _messagesService:MessagesService) { }

    ngOnInit(){
        this._messagesService.history$.subscribe(historyEnvelopes => this._historyEnvelopes = historyEnvelopes);
        this._messagesService.loadHistoryMessages();
    }

    ngAfterViewInit(){
        $('#h-reverse').dropdown({direction: 'upward'});
    }

    history() {
        this._singleEventService.history(
            this._historyOpts['channel'],
            this._historyOpts['count'],
            this._historyOpts['reversed'],
            this._historyOpts['start'],
            this._historyOpts['end']
        );
    }

}