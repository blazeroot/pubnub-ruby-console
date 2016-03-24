import {Component} from 'angular2/core';
import {MessagesService} from "../services/messages.service";
import {SingleEventService} from "../services/single-event.service";
import {EnvelopeComponent} from "./envelope.component";
import {Envelope} from "../interfaces/envelope";

@Component({
    selector: 'state',
    templateUrl: 'templates/state.html',
    providers: [SingleEventService],
    directives: [EnvelopeComponent]
})

export class StateComponent {
    public _setState:   {} = {state: ''};
    public _checkState: {} = {uuid: '', channel: ''};

    public _setStateEnvelopes:   Array<Envelope>;
    public _checkStateEnvelopes: Array<Envelope>;

    constructor(private _singleEventService:SingleEventService,
                private _messagesService:MessagesService) { }

    ngOnInit(){
        this._messagesService.setState$.subscribe(setStateEnvelopes => this._setStateEnvelopes = setStateEnvelopes);
        this._messagesService.loadSetStateMessages();

        this._messagesService.checkState$.subscribe(checkStateEnvelopes => this._checkStateEnvelopes = checkStateEnvelopes);
        this._messagesService.loadCheckStateMessages();
    }


    checkState(){
        this._singleEventService.getState(
            this._checkState
        )
    }

    setState(){
        this._singleEventService.setState(
            this._setState
        );
    }
}