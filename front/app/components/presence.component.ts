import {Component} from 'angular2/core';
import {SubscriptionsService} from "../services/subscriptions.service";
import {Subscriptions} from "../models/subscriptions";
import {AfterViewInit} from "angular2/core";
import {OnInit} from "angular2/core";
import {Subscription} from "../interfaces/subscription";
import {MessagesService} from "../services/messages.service";
import {Envelope} from "../interfaces/envelope";
import {EnvelopeComponent} from "./envelope.component";
import {SingleEventService} from "../services/single-event.service";

declare var $;

@Component({
    selector: 'presence',
    templateUrl: 'templates/presence.html',
    providers: [SubscriptionsService, SingleEventService],
    directives: [EnvelopeComponent]
})

export class PresenceComponent implements AfterViewInit, OnInit {
    public _subscriptions: Subscriptions;
    //private _subscriptionService: SubscriptionsService;
    //private _messagesService: MessagesService;

    public presenceEnvelopes: Envelope[] = [];
    public displayedPresenceEnvelopes: Envelope[] = [];

    constructor(private _subscriptionService: SubscriptionsService,
                private _messagesService: MessagesService,
                private _singleEventService: SingleEventService){
        this._subscriptions = new Subscriptions;
    }

    ngAfterViewInit() {
        $('#p-cg-select').dropdown({direction: 'upward'});
    }

    ngOnInit() {
        this.getSubscriptions();
        this.getMessages();
    }

    presence(channel) {
        this._singleEventService.hereNow(channel);
    }

    subscribeTo(name: string, channelGroup: string) {
        this._subscriptionService.presence(name, channelGroup);
    }

    leave(subscription: Subscription){
        this._subscriptionService.leavePresence(subscription);
    }

    private getSubscriptions() {
        this._subscriptionService.presenceSubscriptions$.subscribe(presenceSubscriptions => this._subscriptions = presenceSubscriptions);
        this._subscriptionService.fetchCurrentPresence();

        console.log(this._subscriptions);
    }

    private getMessages() {
        this._messagesService.presence$.subscribe(envelopes => {
            this.presenceEnvelopes = envelopes;
            this.displayedPresenceEnvelopes = this.presenceEnvelopes.slice(0, 100);
        });
        this.presenceEnvelopes = this._messagesService.loadPresenceMessages();
    }
}