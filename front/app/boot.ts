import { bootstrap }                from 'angular2/platform/browser'
import { DebugElementViewListener } from 'angular2/platform/common_dom';
import { bind }                     from 'angular2/core';

import { AppComponent }       from './components/app.component'
import { HTTP_PROVIDERS }     from "angular2/http";
import { MessagesService }    from "./services/messages.service";
import { SingleEventService } from "./services/single-event.service";

bootstrap(AppComponent, [
    MessagesService,
    SingleEventService,
    HTTP_PROVIDERS
]);
