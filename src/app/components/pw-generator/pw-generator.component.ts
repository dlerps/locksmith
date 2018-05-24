import { Component, OnInit } from "@angular/core";
import { PasswordGenService } from "../../services";

@Component({
  selector: "pw-generator",
  templateUrl: "./pw-generator.component.html",
  styleUrls: [
    "./pw-generator.component.scss"
    ]
})
export class PwGeneratorComponent implements OnInit {

  generatedPassword: string = "";
  alertClass: string = "info";

  _key: string = "";
  _selectedAlgorithm: number = -1;

  constructor(private _pwGen: PasswordGenService) { }

  ngOnInit() {}

  generatePw(keyInputElem, pwInputElem, algorithm: number)
  {
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

    this.generatedPassword = this._pwGen
      .generatePassword(keyInputElem.value.toLowerCase(), pwInputElem.value, algorithm);

    pwInputElem.value = "";
    keyInputElem.value = "";

    this._selectedAlgorithm = -1;
    this._key = null;
  }

  copyAndClear(divElem: Node)
  {
    let selection: Selection = window.getSelection();        
    let range: Range = document.createRange();

    divElem.textContent = divElem.textContent.trim();

    range.selectNodeContents(divElem);
    
    selection.removeAllRanges();
    selection.addRange(range);

    document.execCommand("copy");

    this.generatedPassword = "";
  }

  getButtonClass(algorithm: number) {
    let css = "btn btn-";

    if(algorithm === this._selectedAlgorithm || this._selectedAlgorithm === -1){
      switch(algorithm) {
        case 0:
          return css += "primary";
        case 2:
          return css += "danger";
        case 3:
          return css += "success";
      }
    }

    return css += "secondary";
  }

  public setSetting(setting: any) {
    if(setting && setting.name) {
      this._key = setting.name;
      this._selectedAlgorithm = setting.algorithm;
    }
  }
}
