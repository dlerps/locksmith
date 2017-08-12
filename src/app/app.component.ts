import { Component, OnInit } from '@angular/core';
import { PwGeneratorComponent } from './components/pw-generator';

@Component({
  selector: "locksmith-root",
  templateUrl: "./app.component.html",
  styleUrls: [
    "./app.component.scss"
    ]
})
export class AppComponent {

  _bodyStyle: any;
  _backgroundColour: string;
  _useDarkHeader: boolean = true;

  _now = new Date();

  _colours: any[] = [
    { color: 'aliceblue', dark: true },
    { color: 'aquamarine', dark: true },
    { color: 'azure', dark: true },
    { color: 'darkcyan', dark: false },
    { color: 'darkslateblue', dark: false },
    { color: 'darkslategrey', dark: false },
    { color: 'ghostwhite', dark: true },
    { color: 'honeydew', dark: true },
    { color: 'ivory', dark: true },
    { color: 'lavender', dark: true },
    { color: 'lightcyan', dark: true },
    { color: 'mediumaquamarine', dark: true },
    { color: 'mediumpurple', dark: false },
    { color: 'mediumseagreen', dark: false },
    { color: 'mediumturquoise', dark: true },
    { color: 'lightseagreen', dark: true },
    { color: 'mediumslateblue', dark: false },
    { color: 'mintcream', dark: true },
    { color: 'powderblue', dark: true },
    { color: 'rebeccapurple', dark: false },
    { color: 'royalblue', dark: false },
    { color: 'seagreen', dark: false },
    { color: 'skyblue', dark: true },
    { color: 'slateblue', dark: false },
    { color: 'snow', dark: true },
    { color: 'steelblue', dark: false },
    { color: 'teal', dark: false },
    { color: 'white', dark: true }
  ];

  ngOnInit()
  {
    let index: number = Math.floor(this._colours.length * Math.random());

    this._backgroundColour = this._colours[index].color;
    this._useDarkHeader = this._colours[index].dark;

    this._bodyStyle = {
      "background-color" : this._backgroundColour
    }
  }

  selectSetting(setting: any, dest: PwGeneratorComponent) {
    console.log(setting, dest);
    dest.setSetting(setting);
  }
}
