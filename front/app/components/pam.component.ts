import {Component} from 'angular2/core';
import {AfterViewInit} from "angular2/core";
import {SingleEventService} from "../services/single-event.service";
import {MessagesService} from "../services/messages.service";
import {Envelope} from "../interfaces/envelope";
import {OnInit} from "angular2/core";
import {EnvelopeComponent} from "./envelope.component";

declare var $;

@Component({
    selector: 'pam',
    templateUrl: 'templates/pam.html',
    directives: [EnvelopeComponent]
})

export class PAMComponent implements AfterViewInit, OnInit{
    public _pamOpts: {} = {
        action: 'audit',
        channel: '',
        auth_key: '',
        ttl: '',
        read: true,
        write: true,
        manage: true
    };

    public _pamEnvelopes: Array<Envelope>;

    constructor(private _singleEventService:SingleEventService,
                private _messagesService:MessagesService) { }

    ngOnInit(){
        this._messagesService.pam$.subscribe(envelopes => this._pamEnvelopes = envelopes);
        this._messagesService.loadPAMMessages();
    }

    ngAfterViewInit(){
        $('#pam-action').dropdown({direction: 'upward'});
    }

    firePAM(){
        this._singleEventService.pamAction(this._pamOpts);
    }

}