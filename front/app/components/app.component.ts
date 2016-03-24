import {Component} from 'angular2/core';

import {NavigationComponent} from "./navigation.component";
import {ChannelGroupsComponent} from "./channel-groups.component";
import {HistoryComponent} from "./history.component";
import {PAMComponent} from "./pam.component";
import {PubSubComponent} from "./pubsub.component";
import {StateComponent} from "./state.component";
import {WhereNow} from "./where-now.component";
import {LoggerComponent} from "./logger.component";
import {AfterViewInit} from "angular2/core";
import {PresenceComponent} from "./presence.component";
import {ClientInitDialog} from "./client-init-dialog.component";
import {OnInit} from "angular2/core";
import {SingleEventService} from "../services/single-event.service";

@Component({
    selector: 'console-app',
    templateUrl: 'templates/app.html',
    providers: [SingleEventService],
    directives: [
        ChannelGroupsComponent,
        HistoryComponent,
        NavigationComponent,
        PAMComponent,
        PubSubComponent,
        StateComponent,
        WhereNow,
        LoggerComponent,
        PresenceComponent,
        ClientInitDialog
    ]
})

export class AppComponent implements OnInit{
    public title = 'Tour of Heroes';

    public pubnubClient:{} = {
        subscribe_key: 'demo',
        publish_key: 'demo',
        secret_key: '',
        auth_key: '',
        uuid: '',
        initialized: false
    };

    constructor(private _singleEventService:SingleEventService){}

    ngOnInit(){
        this._singleEventService.getClient().subscribe(
            data => this.pubnubClient = JSON.parse(data.text()),
            err => console.log(err),
            () => console.log("got client")
        );
    }
}
