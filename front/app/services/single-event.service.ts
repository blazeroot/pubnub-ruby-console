import {Injectable} from 'angular2/core';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/share';
import {Subscription} from "../interfaces/subscription";
import {Subscriptions} from "../models/subscriptions";
import {OnInit} from "angular2/core";
import {Http, HTTP_PROVIDERS} from 'angular2/http';

@Injectable()
export class SingleEventService {
    private _http:Http;

    constructor(http:Http) {
        this._http = http;
    }

    publish(message:string, channel:string) {
        if (message.length == 0 || channel.length == 0) {
            return
        }

        this._http.post('http://localhost:9292/publish/' + channel, message)
            .subscribe(
                data => console.log(data),
                err => console.log(err),
                () => console.log('published')
            );
    }

    hereNow(channel:string) {
        if (channel.length == 0) {
            return
        }

        this._http.get('http://localhost:9292/presence/' + channel)
            .subscribe(
                data => console.log(data),
                err => console.log(err),
                () => console.log('published')
            );
    }

    whereNow(uuid:string) {
        if (uuid.length == 0) {
            return
        }

        this._http.post('http://localhost:9292/where_now.json', JSON.stringify({uuid: uuid}))
            .subscribe(
                data => console.log(data),
                err => console.log(err),
                () => console.log("whereNow'ed")
            );
    }

    history(channel:string, count:number, reversed:boolean, start:number, end:number) {
        var _request_body = {
            channel: channel,
            count: count,
            reversed: reversed,
            start: start,
            end: end
        };


        console.log(_request_body);

        this._http.post('http://localhost:9292/history.json', JSON.stringify(_request_body))
            .subscribe(
                data => console.log(data),
                err => console.log(err),
                () => console.log("history'ed")
            );
    }

    setState(state){
        console.log(state.state);
        this._http.post('http://localhost:9292/setState.json', JSON.stringify(JSON.parse(state.state)))
            .subscribe(
                data => console.log(data),
                err => console.log(err),
                () => console.log("setState'ed")
            );
    }

    getState(opts){
        this._http.post('http://localhost:9292/getState.json', JSON.stringify(opts))
            .subscribe(
                data => console.log(data),
                err => console.log(err),
                () => console.log("getState'ed")
            );
    }

    addChannelToGroup(opts){
        this._http.post('http://localhost:9292/cgAdd.json', JSON.stringify(opts))
            .subscribe(
                data => console.log(data),
                err => console.log(err),
                () => console.log("added")
            );
    }

    removeChannelToGroup(opts){
        this._http.post('http://localhost:9292/cgRemove.json', JSON.stringify(opts))
            .subscribe(
                data => console.log(data),
                err => console.log(err),
                () => console.log("removed")
            );
    }

    listChannels(group){
        this._http.post('http://localhost:9292/listChannels.json', JSON.stringify({group: group}))
            .subscribe(
                data => console.log(data),
                err => console.log(err),
                () => console.log("listed")
            );
    }

    listGroups(){
        this._http.post('http://localhost:9292/listGroups.json','')
            .subscribe(
                data => console.log(data),
                err => console.log(err),
                () => console.log("listed")
            );
    }

    pamAction(pamOpts){
        this._http.post('http://localhost:9292/pam.json', JSON.stringify(pamOpts))
            .subscribe(
                data => console.log(data),
                err => console.log(err),
                () => console.log("pam'ed")
            );
    }

    initClient(opts){
        return this._http.post('http://localhost:9292/init.json', JSON.stringify(opts))
    }

    getClient(){
        return this._http.get('http://localhost:9292/client.json')
    }
}