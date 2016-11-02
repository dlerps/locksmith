import { Injectable } from '@angular/core';
import { PasswordUtils } from "../../assets";

@Injectable()
export class PasswordGenService 
{
  private _utils: PasswordUtils;

  private _specialCharsV1 = [ '(', ')', '-', '=', '$', '@', '!', '.', ':', '*', '/', '\\',
    '&', ',', '"', ';', '{', ']', '|', '?', '>', '%', '~', '#', '+', '[', '}', '_', '<', '^', "'" ];

  constructor() 
  {
    this._utils = new PasswordUtils();
  }

  public generatePassword(key: string, passphrase: string, genMethod: number): string
  {
      var pass: string = "";

      switch(genMethod)
      {
          case 0:
            pass = this.generateEnhancedPassword(key, passphrase);
            break;
        
          case 1:
            pass = this.generateAlternativePassword(key, passphrase);
            break;
      }
      
      return pass;
  }

 private generateEnhancedPassword(key: string, masterPassword: string) : string
 {
    var pwBuilder: string = "";
    var pw: PasswordArrays = new PasswordArrays(key, masterPassword);

    for(var n = 0; n < pw.combined.length; n++)
    {
      pw.combined[n] = pw.combined[n] % (36 + this._specialCharsV1.length);

      var c: string = (pw.combined[n] < 36) ? pw.combined[n].toString(36) : this._specialCharsV1[(pw.combined[n] - 36) % this._specialCharsV1.length];

      if(this._utils.isLowerCase(c) && (pw.pwHash[pw.combined[n] % pw.pwHash.length] % 2) == 0)
      {
        c = c.toUpperCase();
      }

      pwBuilder += c;
    }

    return pwBuilder.substring(0, 12 + (key.length % 3));
 }

  private generateAlternativePassword(key: string, passphrase: string): string
  {
      var pwBuilder: string = "";

    	var lowerCase: boolean = false;
    	var upperCase: boolean = false;
    	var numeric: boolean = false;

      var masterPassword: number[] = this._utils.stringToBytes(passphrase);

    	for(var i = 1; i < masterPassword.length - 1; i++)
    	{
    		var off1: number  = 2 + masterPassword[i] * 2;
    		off1 = Math.pow(off1, key.charCodeAt(i % key.length));

    		var offset2: number = 0;

    		try
    		{
    			offset2 = (masterPassword[i] + masterPassword[i - 2] * 7);
    		}
    		catch(exc)
    		{
    			offset2 = (masterPassword[i] + masterPassword[passphrase.length - 1] * 7);
    		}

    		var offset1: number = off1 % 93;
    		offset1 += 33;
    		offset2 %= 93;
    		offset2 += 33;

    		lowerCase = lowerCase || this._utils.isLowerCase(offset1.toString(36));
    		upperCase = upperCase || this._utils.isUpperCase(offset1.toString(36));
            lowerCase = lowerCase || this._utils.isLowerCase(offset2.toString(36));
    		upperCase = upperCase || this._utils.isUpperCase(offset2.toString(36));
    		numeric = numeric || this._utils.isNumeric(offset1.toString(36));
    		numeric = numeric || this._utils.isNumeric(offset2.toString(36));

    		pwBuilder += offset1.toString(36) + offset2.toString(36);
    	}

    	if(!numeric)
    	{
            pwBuilder = this._utils.replaceAt(pwBuilder, pwBuilder.length - 1, "7");
    	}
    	if(!upperCase)
    	{
            pwBuilder = this._utils.replaceAt(pwBuilder, 0, "L");
    	}
    	if(!lowerCase)
    	{
            pwBuilder = "x" + pwBuilder;
    	}

    	return pwBuilder;
  }

}

class PasswordArrays
{
  public pwHash: number[];
  public keyHash: number[];
  public combined: number[];

  private _utils: PasswordUtils;
  
  constructor(key: string, masterPassword: string)
  {
    this._utils = new PasswordUtils();

    var sha = require('sha1');

    this.pwHash = this._utils.stringToBytes(sha(masterPassword));
    this.keyHash = this._utils.stringToBytes(sha(key));

    this.combined = new Array(this.pwHash.length);
    
    for(var i = 0; i < this.pwHash.length; i++)
    {
      this.combined[i] = Math.abs(this.pwHash[i] + this.keyHash[this.keyHash.length - (i + 1)]);
    }

  }
}