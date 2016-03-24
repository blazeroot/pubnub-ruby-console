import {Component} from 'angular2/core';
import {Envelope} from "../interfaces/envelope";

declare var $;

@Component({
    selector: 'envelope',
    templateUrl: 'templates/envelope.html',
    inputs: ['envelope']
})

export class EnvelopeComponent{
    public envelope: Envelope;

    showModal(){
        $('#envelope-' + this.envelope.id).modal('show');
    }
}