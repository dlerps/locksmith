import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'pw-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  @Input("owner")
  public copyrightName: string = "Test";

  @Input("year")
  public copyrightYear: string = "2016";

  constructor() { }

  ngOnInit() {
  }

}
