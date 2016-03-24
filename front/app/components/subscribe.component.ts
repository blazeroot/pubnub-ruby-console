import {Component} from 'angular2/core';
import {Envelope} from "../interfaces/envelope";
import {EnvelopeComponent} from "./envelope.component";
import {Http, HTTP_PROVIDERS} from 'angular2/http';
import {AfterViewInit} from "angular2/core";
import {Subscriptions} from "../models/subscriptions";
import {OnInit} from "angular2/core";
import {SubscriptionsService} from "../services/subscriptions.service";
import {Subscription} from "../interfaces/subscription";

declare var $;

@Component({
    selector: 'subscribe',
    templateUrl: 'templates/subscribe.html',
    providers: [SubscriptionsService]
})

export class SubscribeComponent implements AfterViewInit, OnInit {
    public subscriptions: Subscriptions;
    //private _subscriptionService: SubscriptionsService;

    constructor(private _subscriptionService: SubscriptionsService){
        this.subscriptions = new Subscriptions;
    }

    ngAfterViewInit() {
        $('#c-cg-select').dropdown({direction: 'upward'});
    }

    ngOnInit() {
        this._subscriptionService.subscriptions$.subscribe(subscriptions => this.subscriptions = subscriptions);
        this._subscriptionService.fetchCurrentSubscriptions();
    }

    subscribeTo(name: string, channelGroup: string) {
        this._subscriptionService.subscribe(name, channelGroup);
    }

    leave(subscription: Subscription){
        this._subscriptionService.leave(subscription);
    }
}