import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';
import { ContactModel } from '../../model/contact/contact.model';
import { ContactsProvider } from '../../providers/contacts/contacts';

import { HomePage } from '../home/home';
import { OpenPageDirective } from '../../components/open-page/open-page';


/**
 * Generated class for the Contacts page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html',
})
export class ContactsPage {
  public myContacts: Array<any> = [];
  public show_skip_button: false;
  public homepage = HomePage;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private contacts: Contacts,
    private contactsProvider: ContactsProvider,
    private toastCtrl: ToastController
  ) {
      this.load_contacts();
      this.show_skip_button = this.navParams.data.first_time;
  }

  registerContact() {
    this.contacts.pickContact().then(
      (contact) => {
        this.save(contact);
      }
    ).catch(
      (e) => this.presentToast(JSON.stringify(e))
    );
  }

  removeContact(contact) {
    this.contactsProvider.drop_contact(contact).subscribe(
      (contacts) => this.reload_contacts(contacts.list),
      (error) => {
        let data = error.json();
        this.presentToast(data.errors.message);
      }
    );
  }

  private presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 9000
    });
    toast.present();
  }

  private save(contact) {
    contact = contact._objectInstance;
    let params = this.contact_params();
    params.name = contact.displayName;
    params.display_name = contact.displayName;
    params.kind = "contact_request";

    for(let info of contact.phoneNumbers) {
      params.numbers.push({value: info.value, type: info.type});
    }

    this.contactsProvider.create(params).subscribe(
      (contacts) => {
        this.presentToast(contacts.message);
        this.reload_contacts(contacts.list);
      },
      (error) => {
        let data = error.json();
        this.presentToast(data.errors.message);
      }
    );
  }

  private contact_params() {
    return {
      name: "",
      display_name: "",
      kind: "",
      numbers: []
    };
  }

  private reload_contacts(contacts_list) {
    localStorage.setItem('emergency_contacts', contacts_list);
    this.myContacts = contacts_list;
  }

  private load_contacts() {
    this.contactsProvider.index().subscribe(
      (contacts) => this.reload_contacts(contacts.list),
      (error) => {
        let data = error.json();
        this.presentToast(data.errors.message);
      }
    );
  }

}
