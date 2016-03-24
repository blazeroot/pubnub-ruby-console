import {Component} from 'angular2/core';
import {Envelope} from "../interfaces/envelope";
import {MessagesService} from "../services/messages.service";
import {SingleEventService} from "../services/single-event.service";
import {EnvelopeComponent} from "./envelope.component";

@Component({
    selector: 'channel-groups',
    templateUrl: 'templates/channel-groups.html',
    providers: [SingleEventService],
    directives: [EnvelopeComponent]
})

export class ChannelGroupsComponent {
    public _cgAction:{} = {
        channel: '',
        group: '',
    };

    public _cgActionEnvelopes: Array<Envelope>;
    public _listingEnvelopes:  Array<Envelope>;

    public _group:string = '';

    constructor(private _singleEventService:SingleEventService,
                private _messagesService:MessagesService) { }

    ngOnInit(){
        this._messagesService.cgAction$.subscribe(envelopes => this._cgActionEnvelopes = envelopes);
        this._messagesService.loadCgActionMessages();

        this._messagesService.listGroup$.subscribe(envelopes => this._listingEnvelopes = envelopes);
        this._messagesService.loadListGroupMessages();
    }

    add(){
        this._singleEventService.addChannelToGroup(this._cgAction);
    }

    remove(){
        this._singleEventService.removeChannelToGroup(this._cgAction);
    }

    listChannels(){
        this._singleEventService.listChannels(this._group);
    }

    listGroups(){
        this._singleEventService.listGroups();
    }

}