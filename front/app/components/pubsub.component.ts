import {Component} from 'angular2/core';
import {MessagesService} from "./../services/messages.service";
import {Envelope} from "../interfaces/envelope";
import {EnvelopeComponent} from "./envelope.component";
import {SubscribeComponent} from "./subscribe.component";
import {PublishComponent} from "./publish.component";

@Component({
    selector: 'pubsub',
    templateUrl: 'templates/pubsub.html',
    providers: [],
    directives: [EnvelopeComponent, SubscribeComponent, PublishComponent]
})

export class PubSubComponent {
    public subscribeEnvelopes: Envelope[] = [];
    public displayedSubscribeEnvelopes: Envelope[] = [];

    constructor(private _messagesService: MessagesService){ }

    getMessages() {
        this._messagesService.messages$.subscribe(envelopes => {
            this.subscribeEnvelopes = envelopes;
            this.displayedSubscribeEnvelopes = this.subscribeEnvelopes.slice(0, 100);
        });
        this.subscribeEnvelopes = this._messagesService.loadSubscribeMessages();
    }

    ngOnInit() {
        this.getMessages();
    }
}