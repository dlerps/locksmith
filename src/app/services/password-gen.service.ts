import { Injectable } from '@angular/core';
import * as sha1 from 'js-sha1';

@Injectable()
export class PasswordGenService 
{
  private _utils: PasswordUtils;
  private _radix: number = 36;

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

          case 2:
            pass = this.generateNormalPassword(key, passphrase);
            break;

          case 3:
            pass = this.generateSimplePassword(key, passphrase);
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
      pw.combined[n] = pw.combined[n] % (this._radix + this._specialCharsV1.length);

      var c: string = (pw.combined[n] < this._radix) ? pw.combined[n].toString(this._radix) : this._specialCharsV1[(pw.combined[n] - this._radix) % this._specialCharsV1.length];

      if(this._utils.isLowerCase(c) && (pw.pwHash[pw.combined[n] % pw.pwHash.length] % 2) == 0)
      {
        c = c.toUpperCase();
      }

      pwBuilder += c;
    }

    return pwBuilder.substring(0, 12 + (key.length % 3));
  }

  private generateNormalPassword(key: string, masterPassword: string) : string
  {
    var pwBuilder: string = "";
    var pw: PasswordArrays = new PasswordArrays(key, masterPassword);

    for(var n = 0; n < pw.combined.length; n++)
    {
      pw.combined[n] = pw.combined[n] % this._radix;

      var c: string = pw.combined[n].toString(this._radix);

      if(this._utils.isLowerCase(c) && (pw.pwHash[pw.combined[n] % pw.pwHash.length] % 2) == 0)
      {
        c = c.toUpperCase();
      }

      pwBuilder += c;
    }

    return pwBuilder.substring(0, 12 + (key.length % 3));
  }

  private generateSimplePassword(key: string, masterPassword: string) : string
  {
    var pwBuilder: string = "";
    var pw: PasswordArrays = new PasswordArrays(key, masterPassword);

    for(var n = 0; n < pw.combined.length; n++)
    {
      pw.combined[n] = pw.combined[n] % this._radix;
      pwBuilder += pw.combined[n].toString(this._radix);
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

    		lowerCase = lowerCase || this._utils.isLowerCase(offset1.toString(this._radix));
    		upperCase = upperCase || this._utils.isUpperCase(offset1.toString(this._radix));
        lowerCase = lowerCase || this._utils.isLowerCase(offset2.toString(this._radix));
    		upperCase = upperCase || this._utils.isUpperCase(offset2.toString(this._radix));
    		numeric = numeric || this._utils.isNumeric(offset1.toString(this._radix));
    		numeric = numeric || this._utils.isNumeric(offset2.toString(this._radix));

    		pwBuilder += offset1.toString(this._radix) + offset2.toString(this._radix);
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

    //var sha = require('sha1');

    this.pwHash = this._utils.stringToBytes(sha1(masterPassword));
    this.keyHash = this._utils.stringToBytes(sha1(key));

    this.combined = new Array(this.pwHash.length);
    
    for(var i = 0; i < this.pwHash.length; i++)
    {
      this.combined[i] = Math.abs(this.pwHash[i] + this.keyHash[this.keyHash.length - (i + 1)]);
    }

  }
}

export class PasswordUtils
{
      private hexDict = { '00' : 0, '01' : 1, '02' : 2, '03' : 3, '04' : 4, '05' : 5, '06' : 6, '07' : 7, '08' : 8, '09' : 9, '0a' : 10, '0b' : 11, '0c' : 12, '0d' : 13, '0e' : 14, '0f' : 15, 
            '10' : 16, '11' : 17, '12' : 18, '13' : 19, '14' : 20, '15' : 21, '16' : 22, '17' : 23, '18' : 24, '19' : 25, '1a' : 26, '1b' : 27, '1c' : 28, '1d' : 29, '1e' : 30, '1f' : 31, 
            '20' : 32, '21' : 33, '22' : 34, '23' : 35, '24' : 36, '25' : 37, '26' : 38, '27' : 39, '28' : 40, '29' : 41, '2a' : 42, '2b' : 43, '2c' : 44, '2d' : 45, '2e' : 46, '2f' : 47, 
            '30' : 48, '31' : 49, '32' : 50, '33' : 51, '34' : 52, '35' : 53, '36' : 54, '37' : 55, '38' : 56, '39' : 57, '3a' : 58, '3b' : 59, '3c' : 60, '3d' : 61, '3e' : 62, '3f' : 63, 
            '40' : 64, '41' : 65, '42' : 66, '43' : 67, '44' : 68, '45' : 69, '46' : 70, '47' : 71, '48' : 72, '49' : 73, '4a' : 74, '4b' : 75, '4c' : 76, '4d' : 77, '4e' : 78, '4f' : 79, 
            '50' : 80, '51' : 81, '52' : 82, '53' : 83, '54' : 84, '55' : 85, '56' : 86, '57' : 87, '58' : 88, '59' : 89, '5a' : 90, '5b' : 91, '5c' : 92, '5d' : 93, '5e' : 94, '5f' : 95, 
            '60' : 96, '61' : 97, '62' : 98, '63' : 99, '64' : 100, '65' : 101, '66' : 102, '67' : 103, '68' : 104, '69' : 105, '6a' : 106, '6b' : 107, '6c' : 108, '6d' : 109, '6e' : 110, '6f' : 111, 
            '70' : 112, '71' : 113, '72' : 114, '73' : 115, '74' : 116, '75' : 117, '76' : 118, '77' : 119, '78' : 120, '79' : 121, '7a' : 122, '7b' : 123, '7c' : 124, '7d' : 125, '7e' : 126, '7f' : 127, 
            '80' : -128, '81' : -127, '82' : -126, '83' : -125, '84' : -124, '85' : -123, '86' : -122, '87' : -121, '88' : -120, '89' : -119, '8a' : -118, '8b' : -117, '8c' : -116, '8d' : -115, '8e' : -114, '8f' : -113, 
            '90' : -112, '91' : -111, '92' : -110, '93' : -109, '94' : -108, '95' : -107, '96' : -106, '97' : -105, '98' : -104, '99' : -103, '9a' : -102, '9b' : -101, '9c' : -100, '9d' : -99, '9e' : -98, '9f' : -97, 
            'a0' : -96, 'a1' : -95, 'a2' : -94, 'a3' : -93, 'a4' : -92, 'a5' : -91, 'a6' : -90, 'a7' : -89, 'a8' : -88, 'a9' : -87, 'aa' : -86, 'ab' : -85, 'ac' : -84, 'ad' : -83, 'ae' : -82, 'af' : -81, 
            'b0' : -80, 'b1' : -79, 'b2' : -78, 'b3' : -77, 'b4' : -76, 'b5' : -75, 'b6' : -74, 'b7' : -73, 'b8' : -72, 'b9' : -71, 'ba' : -70, 'bb' : -69, 'bc' : -68, 'bd' : -67, 'be' : -66, 'bf' : -65, 
            'c0' : -64, 'c1' : -63, 'c2' : -62, 'c3' : -61, 'c4' : -60, 'c5' : -59, 'c6' : -58, 'c7' : -57, 'c8' : -56, 'c9' : -55, 'ca' : -54, 'cb' : -53, 'cc' : -52, 'cd' : -51, 'ce' : -50, 'cf' : -49, 
            'd0' : -48, 'd1' : -47, 'd2' : -46, 'd3' : -45, 'd4' : -44, 'd5' : -43, 'd6' : -42, 'd7' : -41, 'd8' : -40, 'd9' : -39, 'da' : -38, 'db' : -37, 'dc' : -36, 'dd' : -35, 'de' : -34, 'df' : -33, 
            'e0' : -32, 'e1' : -31, 'e2' : -30, 'e3' : -29, 'e4' : -28, 'e5' : -27, 'e6' : -26, 'e7' : -25, 'e8' : -24, 'e9' : -23, 'ea' : -22, 'eb' : -21, 'ec' : -20, 'ed' : -19, 'ee' : -18, 'ef' : -17, 
            'f0' : -16, 'f1' : -15, 'f2' : -14, 'f3' : -13, 'f4' : -12, 'f5' : -11, 'f6' : -10, 'f7' : -9, 'f8' : -8, 'f9' : -7, 'fa' : -6, 'fb' : -5, 'fc' : -4, 'fd' : -3, 'fe' : -2, 'ff' : -1 }


      constructor(){}

      public isLowerCase(a: string): boolean
      {
      return (a === a.toLowerCase() && a !== a.toUpperCase());
      }

      public isUpperCase(a: string): boolean
      {
      return (a === a.toUpperCase() && a !== a.toLowerCase());
      }

      public isNumeric(n: any) : boolean
      {
      return !isNaN(parseFloat(n)) && isFinite(n);
      }

      public replaceAt(input: string, index: number, replaceWith: string): string
      {
      return input.substr(0, index) + replaceWith + input.substr(replaceWith.length + index);
      }

      public stringToBytes(str: string) 
      {
      var chars: string[] = str.split("");
      var bytes: number[] = new Array(chars.length / 2);

      if(chars.length % 2 == 1)
      {
            console.log("Warning: Odd number of characters in hash!");
      }

      for(var i = 0; i < chars.length; i += 2)
      {
            bytes[i / 2] = this.hexDict[chars[i] + chars[i + 1]];
      }

      return bytes;
      }
}