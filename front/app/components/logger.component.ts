import {Component} from 'angular2/core';
import {OnInit} from "angular2/core";
import {LoggerService} from "./../services/logger.service";

@Component({
    selector: 'logger',
    templateUrl: 'templates/logger.html',
    styles: [`
        .logger-wrap {
            max-height: 100%;
            overflow-y: scroll;
        }
        .logger {
            font-size: 8;
            font-family: monospace;
            padding: 12px;
            background-color: #eee;
       }
    `],
    providers: [LoggerService]
})

export class LoggerComponent implements OnInit {
    public logMessages: String[] = [];

    constructor(private _loggerService: LoggerService){ }

    getLogs() {
        this._loggerService.messages$.subscribe(messages => this.logMessages = messages);
        this.logMessages = this._loggerService.loadMessages();
    }

    ngOnInit() {
        //this.getLogs();
    }
}