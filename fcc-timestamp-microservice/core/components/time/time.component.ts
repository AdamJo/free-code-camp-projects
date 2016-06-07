import {Component,  OnInit}  from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';

@Component({
    template: `
      <h3>Natural date : <span [class.null-val]="!naturalDate">{{naturalDate | json}}</span></h3>
      <h3>Unix date : <span [class.null-val]="!naturalDate">{{unixDate | json}}</span></h3>
    `,
    styles : ['.null-val {color : #ababab}']
})

export class TimeChange implements OnInit {
  naturalDate : any;
  unixDate : any;
  givenDate : string;
  constructor(
    private _router: Router,
    private routeParams: RouteParams) {
  }

  ngOnInit() {
    this.givenDate = this.routeParams.get('id').replace(/%20/g, ' ');

    if (parseInt(this.givenDate).toString().length === this.givenDate.length) {
      this.naturalDate = new Date(parseInt(this.givenDate)*1000).toDateString();
      this.unixDate = this.givenDate
    } else {
      this.unixDate = new Date(this.givenDate).getTime() / 1000;
      this.naturalDate = new Date(this.givenDate).toDateString();
    }

    if (!this.unixDate || this.naturalDate === 'Invalid Date') {
      this.unixDate = null;
      this.naturalDate = null;
    }
  }
}
