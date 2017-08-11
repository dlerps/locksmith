import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: "pw-footer",
  templateUrl: "./footer.component.html",
  styleUrls: [
    "./footer.component.scss"
    ]
})
export class FooterComponent implements OnInit {

  @Input("owner")
  public _copyrightName: string = "Test";

  @Input("year")
  public _copyrightYear: string = "2016";

  @Input("left-info")
  public _leftInfo: string = null;

  constructor() { }

  ngOnInit() {
  }

}
