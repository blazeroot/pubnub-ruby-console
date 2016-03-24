import {Subscription} from "../interfaces/subscription";

export class Subscriptions {
    public subscriptions: Array<Subscription>;

    constructor(){
        this.subscriptions = [];
    }

    isSubscribedTo(subscription: Subscription){
        return this.subscriptions.filter(function (sub) {
            return sub.name === subscription.name && sub.channelGroup === subscription.channelGroup
        })[0];
    }

    getSubscriptions(){
        return this.subscriptions;
    }

    addSubscription(subscription: Subscription){
        this.subscriptions.push(subscription);
    }

    removeSubscription(subscription: Subscription){
        var index: number = this.subscriptions.indexOf(subscription);
        this.subscriptions.splice(index, 1);
    }
}