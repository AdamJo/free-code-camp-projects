import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {TimeChange} from '../components/time/time.component.ts';

@Component({
    selector: 'my-app',
    templateUrl: 'main/app.component.html',
    directives : [ROUTER_DIRECTIVES]
})
@RouteConfig([
  { path : '/:id', name : 'Time', component: TimeChange }
])

export class AppComponent {}
