import {Component} from 'angular2/core';
import {Envelope} from "../interfaces/envelope";
import {EnvelopeComponent} from "./envelope.component";
import {Http, HTTP_PROVIDERS} from 'angular2/http';
import {AfterViewInit} from "angular2/core";
import {SingleEventService} from "../services/single-event.service";

@Component({
    selector: 'client-init-dialog',
    templateUrl: 'templates/client-init-dialog.html',
    providers: [SingleEventService],
    inputs: ['_pubnubClient']
})

export class ClientInitDialog {
    public _pubnubClient: {};

    constructor(private _singleEventService: SingleEventService){ }

    initClient() {
        this._singleEventService.initClient(this._pubnubClient).subscribe(
            data => this._pubnubClient = JSON.parse(data.text()),
            err => console.log(err),
            () => console.log("inited client")
        );
    }
}