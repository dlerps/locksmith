import { Component, OnInit } from '@angular/core';

@Component({
  selector: "locksmith-root",
  templateUrl: "./app.component.html",
  styleUrls: [
    "./app.component.scss"
    ]
})
export class AppComponent {

  private _bodyStyle: any;
  private _backgroundColour: string;

  private _colours: string[] = [
    "aliceblue",
    "aquamarine",
    "azure",
    "darkcyan",
    "darkslateblue",
    "darkslategrey",
    "dodgerblue",
    'ghostwhite',
    "honeydew",
    "ivory",
    "lavender",
    "lightcyan",
    "mediumaquamarine",
    "mediumpurple",
    "mediumseagreen",
    "mediumturquoise",
    "lightseagreen",
    "mediumslateblue",
    "mintcream",
    "paleturquoise",
    "powderblue",
    "rebeccapurple",
    "royalblue",
    "seagreen",
    "skyblue",
    "slateblue",
    "snow",
    "steelblue",
    "teal",
    "black",
    "white"
  ];

  ngOnInit()
  {
    let index: number = Math.floor(this._colours.length * Math.random());

    this._backgroundColour = this._colours[index];

    this._bodyStyle = {
      "background-color" : this._backgroundColour
    }
  }
}
