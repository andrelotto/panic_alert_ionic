import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { JwtHelper } from 'angular2-jwt';
import { AuthHttp } from 'angular2-jwt';
import { RoutesProvider } from '../routes/routes';

/*
  Generated class for the ContactProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ContactsProvider {

  jwtHelper: JwtHelper = new JwtHelper();
  private host: string;
  private contacts_path: string;
  private open_requests_path: string;

  constructor(
    public http: Http,
    public authHttp: AuthHttp,
    public routesProvider: RoutesProvider
  ) {
    console.log('Hello ContactProvider Provider');
    this.host = this.routesProvider.host();
    this.setRoutes(this.host);
  }

  setRoutes(host){
    this.contacts_path = host + 'contacts';
    this.open_requests_path = this.contacts_path + '/open_requests';
  }

  create(contact_params) {
    return this.authHttp.post(this.contacts_path + '.json', {contact: contact_params})
      .map(res => res.json());
  }

  index() {
    return this.authHttp.get(this.contacts_path + '.json')
      .map(res => res.json());
  }

  pending_dependent_requests() {
    return this.authHttp.get(this.open_requests_path + '.json')
      .map(res => res.json());
  }

  accept_emergency_contact_of(contact) {
    return this.authHttp.get(this.accept_emergency_contact_path(contact))
      .map(res => res.json());
  }

  refuse_emergency_contact_of(contact) {
    return this.authHttp.get(this.refuse_emergency_contact_path(contact) + '.json')
      .map(res => res.json());
  }

  drop_contact(contact) {
    return this.authHttp.get(this.drop_contact_path(contact) + '.json')
      .map(res => res.json());
  }

  accept_emergency_contact_path(contact) {
    return this.contacts_path + '/' + contact.id + '/accept_request.json?kind=accept_request';
  }

  refuse_emergency_contact_path(contact) {
    return this.contacts_path + '/' + contact.id + '/refuse_request';
  }

  drop_contact_path(contact) {
    return this.contacts_path + '/' + contact.id + '/drop_contact';
  }
}
