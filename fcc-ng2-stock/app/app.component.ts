import {Component} from 'angular2/core';
import {handled} from './server/getStocks'
@Component({
    selector: 'my-app',
    template: '<h1>My First Angular 2 App</h1>'
})
export class AppComponent {
    constructor () {
    }
    ngOnInit() {
        console.log('here');
        console.log(handled)
    }
}