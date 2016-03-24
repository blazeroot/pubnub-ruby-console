import {Component} from 'angular2/core';
import {EnvelopeComponent} from "./envelope.component";
import {MessagesService} from "../services/messages.service";
import {SingleEventService} from "../services/single-event.service";
import {OnInit} from "angular2/core";
import {Envelope} from "../interfaces/envelope";

@Component({
    selector: 'where-now',
    templateUrl: 'templates/where-now.html',
    providers: [SingleEventService],
    directives: [EnvelopeComponent]
})

export class WhereNow implements OnInit {
    public _whereNowEnvelopes: Array<Envelope>;

    public _whereNowOpts:{} = {
        uuid: ''
    };

    constructor(private _singleEventService:SingleEventService,
                private _messagesService:MessagesService) { }

    ngOnInit(){
        this._messagesService.whereNow$.subscribe(whereNowEnvelopes => this._whereNowEnvelopes = whereNowEnvelopes);
        this._messagesService.loadWhereNowMessages();
    }

    whereNow(){
        this._singleEventService.whereNow(
            this._whereNowOpts["uuid"]
        );
    }
}