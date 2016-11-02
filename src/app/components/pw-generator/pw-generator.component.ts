import { Component, OnInit } from '@angular/core';
import { PasswordGenService } from "../../services";

@Component({
  selector: 'pw-generator',
  templateUrl: './pw-generator.component.html',
  styleUrls: ['./pw-generator.component.css']
})
export class PwGeneratorComponent implements OnInit {

  public generatedPassword: string = "";

  constructor(private _pwGen: PasswordGenService) { }

  ngOnInit() {
  }

  generatePw(keyInputElem, pwInputElem)
  {
    console.log(keyInputElem.value);
    console.log(pwInputElem.value);
    this.generatedPassword = this._pwGen.generatePassword(keyInputElem.value, pwInputElem.value, 0);
  }
}
