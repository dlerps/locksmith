import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Component({
  selector: 'settings-list',
  templateUrl: './settings-list.component.html',
  styleUrls: ['./settings-list.component.scss']
})
export class SettingsListComponent implements OnInit {

  @Output("onSettingSelect") selected: EventEmitter<any> = new EventEmitter<any>();

  _loggedIn: boolean = false;
  _user: any;
  _uid;
  _settings: any[];

  constructor(
    private _db: AngularFireDatabase,
    private _auth: AngularFireAuth) { }

  ngOnInit() {

    this._auth.authState
      .subscribe(a => {
        this._loggedIn = a !== null;

        if(this._loggedIn) {
          this._user = a.displayName;
          this._uid = a.uid;
        }
        else {
          this._user = null;
          this._uid = null;
        }

        this._db.database
          .ref(this.getDbRef())
          .on('value', res => this.refreshSettingsList(res.val()))
      })
  }

  getKeyUri(name: string) {
    let key = encodeURI(name.toLowerCase());
    key = key.split('.').join('');
    key = key.split('/').join('');
    key = key.split('\\').join('');
    key = key.split('%').join('');
    key = key.split('^').join('');
    key = key.split('@').join('');
    key = key.split('*').join('');
    key = key.split('#').join('');
    key = key.split('&').join('');
    key = key.split(',').join('');
    key = key.split('=').join('');
    key = key.split('!').join('');
    key = key.split('$').join('');
    key = key.split('"').join('');
    key = key.split('`').join('');
    key = key.split('~').join('');
    key = key.split("'").join('');
    key = key.split('}').join('');
    key = key.split('{').join('');
    key = key.split(';').join('');
    key = key.split(':').join('');
    key = key.split('[').join('');
    key = key.split(']').join('');
    key = key.split('|').join('');
    key = key.split('>').join('');
    key = key.split('<').join('');
    key = key.split('?').join('');
     
    return this.getDbRef() + '/' + key;
  }

  saveSetting(inputElem, algorithm: number) {

    if(!inputElem.value)
      return;

    let setting = {
      name: inputElem.value,
      algorithm: algorithm
    }

    this._db.database
      .ref(this.getKeyUri(inputElem.value))
      .set(setting);

    inputElem.value = null;
  }
  
  googleSignOut() {
    this._auth.auth.signOut();
  }

  googleSignIn(event) {
    this._auth.auth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  refreshSettingsList(settings) {
    if(!this._loggedIn || !settings){
      this._settings = [];
    }
    else {
      //console.log(settings);
      this._settings = [];

      let keys = Object.keys(settings);
      keys.sort();

      for(let i: number = 0; i < keys.length; i++){
        this._settings.push(settings[keys[i]]);
      }
    }
  }

  removeSetting(name: string) {
    if(name) {
      this._db.database
        .ref(this.getKeyUri(name))
        .remove();
    }
  }

  getBadgeText(algorithm: number): string {
    if(algorithm === 0) {
      return "Enh.";
    }
    else if(algorithm === 2) {
      return "Normal";
    }
    else if(algorithm === 3) {
      return "Simple"
    }

    return "";
  }

  selectSetting(name, a) {
    this.selected.emit({
      name: name,
      algorithm: a
    });
  }

  getBadgeClass(algorithm: number): string {
    let cssClass: string = "badge badge-";

    if(algorithm === 0) {
      cssClass += "primary";
    }
    else if(algorithm === 2) {
      cssClass += "danger";
    }
    else if(algorithm === 3) {
      cssClass += "success";
    }
    else {
       cssClass += "secondary";
    }

    return cssClass;
  }

  getDbRef(): string {
    return "locksmith/" + this._uid;
  }

  replaceAll(target, search, replacement) {
    return target.replace(new RegExp(search, 'g'), replacement);
};

}
