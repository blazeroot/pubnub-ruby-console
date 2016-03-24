import {Component} from 'angular2/core';
import {AfterViewInit} from "angular2/core";

declare var $;

@Component({
    selector: 'navigation',
    templateUrl: 'templates/navigation.html',
    styles: [`
        .client-info .key {
            color: rgba(255,255,255,.5);
            background: 0 0;
            padding: .5em 0;
            font-size: .85714286em;
        }
        .client-info .key .value {
            color: rgba(255,255,255,.9);
        }
    `],
    inputs: ['_pubnubClient']
})

export class NavigationComponent implements AfterViewInit{
    public _pubnubClient:{};

    ngAfterViewInit(){
        $('.menu .item').tab();
    }
}