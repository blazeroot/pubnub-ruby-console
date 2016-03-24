import {Component} from 'angular2/core';
import {Envelope} from "../interfaces/envelope";
import {EnvelopeComponent} from "./envelope.component";
import {Http, HTTP_PROVIDERS} from 'angular2/http';
import {AfterViewInit} from "angular2/core";
import {SingleEventService} from "../services/single-event.service";

@Component({
    selector: 'publish',
    templateUrl: 'templates/publish.html',
    providers: [SingleEventService]
})

export class PublishComponent {
    public to_publish: {} = {message: '', channel: ''};

    constructor(private _singleEventService: SingleEventService){ }

    publish() {
        this._singleEventService.publish(this.to_publish['message'], this.to_publish['channel'])
    }
}