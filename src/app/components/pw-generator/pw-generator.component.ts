import { Component, OnInit } from '@angular/core';
import { PasswordGenService } from "../../services";

@Component({
  selector: 'pw-generator',
  templateUrl: './pw-generator.component.html',
  styleUrls: ['./pw-generator.component.css']
})
export class PwGeneratorComponent implements OnInit {

  public generatedPassword: string = "";
  public alertClass: string = "info";

  constructor(private _pwGen: PasswordGenService) { }

  ngOnInit() {
  }

  generatePw(keyInputElem, pwInputElem, algorithm: number)
  {
    console.log(keyInputElem.value);
    console.log(pwInputElem.value);

    switch(algorithm)
    {
      case 0:
        this.alertClass = "info";
        break;
      
      case 1:
        this.alertClass = "warning";
        break;

      case 2:
        this.alertClass = "danger";
        break;

      case 3:
        this.alertClass = "success";
        break;

      default:
        this.alertClass = "info";
    }

    this.generatedPassword = this._pwGen.generatePassword(keyInputElem.value, pwInputElem.value, algorithm);

    pwInputElem.value = "";
    keyInputElem.value = "";
  }
}
