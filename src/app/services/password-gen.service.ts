import { Injectable } from '@angular/core';

@Injectable()
export class PasswordGenService {

  private _specialCharsV1 = [ '(', ')', '-', '=', '$', '@', '!', '.', ':', '*', '/', '\\',
    	'&', ',', '"', ';', '{', ']', '|', '?', '>', '%', '~', '#', '+', '[', '}', '_', '<', '^', "'" ];

  private _pwGen;

  constructor() 
  {
    this._pwGen = document.getElementById('PasswordGeniusApplet');
  }

  public generatePassword(key: string, passphrase: string, genMethod: number): string
  {
    return this.generateEnhancedPassword(key, passphrase);
    //return this._pwGen.generatePassword(key, passphrase, 1);
  }

 private generateEnhancedPassword(key: string, masterPassword: string) : string
 {
    var pwBuilder: string = "";

    var sha = require('sha1');

    

    var pwHash: string = sha(masterPassword);
    // var keyHash: string = sha(key);

    var pwHashChars = this.stringToBytes(sha(masterPassword));
    var keyHashChars = this.stringToBytes(sha(key));

    var combined = new Array(pwHashChars.length);
    
    console.log(pwHashChars[1] >>> 0);

    for(var i = 0; i < pwHashChars.length; i++)
    {
      combined[i] = Math.abs(pwHashChars[i] + keyHashChars[keyHashChars.length - (i + 1)]);
    }

    for(var n = 0; n < combined.length; n++)
    {
      combined[n] = combined[n] % (36 + this._specialCharsV1.length);

      var c: string = (combined[n] < 36) ? String.fromCharCode(combined[n]) : this._specialCharsV1[(combined[n] - 36) % this._specialCharsV1.length];

      if(this.isLowerCase(c) && (pwHashChars[combined[n] % pwHashChars.length] % 2) == 0)
      {
        var c1: number = c.charCodeAt(0) - 32;
        c = String.fromCharCode(c1);
      }

      pwBuilder += c;
    }

    return pwBuilder.substring(0, 12 + (key.length % 3));
 }

  private generateAlternativePassword(key: string, masterPassword: string): string
  {
      var pwBuilder: string = "";

    	var lowerCase: boolean = false;
    	var upperCase: boolean = false;
    	var numeric: boolean = false;

    	for(var i = 1; i < masterPassword.length - 1; i++)
    	{
        //BigInteger.valueOf(2 + (int) masterPassword[i] * 2);
    		var off1: number  = 2 + masterPassword.charCodeAt(i) * 2;
    		off1 = Math.pow(off1, key.charCodeAt(i % key.length));

    		var offset2: number = 0;

    		try
    		{
    			offset2 = (masterPassword.charCodeAt(i) + masterPassword.charCodeAt(i - 2) * 7);
    		}
    		catch(e)
    		{
    			offset2 = (masterPassword.charCodeAt(i) + masterPassword.charCodeAt(masterPassword.length - 1) * 7);
    		}

    		var offset1: number = off1 % 93;
    		offset1 += 33;
    		offset2 %= 93;
    		offset2 += 33;

    		lowerCase = lowerCase || this.isLowerCase(String.fromCharCode(offset1));
    		upperCase = upperCase || this.isUpperCase(String.fromCharCode(offset1));
        lowerCase = lowerCase || this.isLowerCase(String.fromCharCode(offset2));
    		upperCase = upperCase || this.isUpperCase(String.fromCharCode(offset2));
    		numeric = numeric || this.isNumeric(String.fromCharCode(offset1));
    		numeric = numeric || this.isNumeric(String.fromCharCode(offset2));

    		pwBuilder += String.fromCharCode(offset1) + String.fromCharCode(offset2);
    	}

    	if(!numeric)
    	{
    		//pwBuilder.replace(pwBuilder.length() - 1, pwBuilder.length(), "7");
        pwBuilder = this.replaceAt(pwBuilder, pwBuilder.length - 1, "7");
    	}
    	if(!upperCase)
    	{
    		//pwBuilder.replace(0, 1, "L");
        pwBuilder = this.replaceAt(pwBuilder, 0, "L");
    	}
    	if(!lowerCase)
    	{
    		//pwBuilder.insert(0, 'x');
        pwBuilder = "x" + pwBuilder;
    	}

    	return pwBuilder;
  }

  private isLowerCase(a: any): boolean
  {
    return (a === a.toLowerCase() && a !== a.toUpperCase());
  }

  private isUpperCase(a: any): boolean
  {
    return (a === a.toUpperCase() && a !== a.toLowerCase());
  }

  private isNumeric(n: any) : boolean
  {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  private replaceAt(input: string, index: number, replaceWith: string): string
  {
    return input.substr(0, index) + replaceWith + input.substr(replaceWith.length + index);
  }

  private stringToBytes(str: string) 
  {
    var ch, st, re = [];

    for (var i = 0; i < str.length; i++ ) 
    {
      ch = str.charCodeAt(i);
      st = []; 

      do 
      {
        st.push(ch & 0xFF);
        ch = ch >> 8;
      } while (ch);

      // add stack contents to result
      // done because chars have "wrong" endianness
      re = re.concat( st.reverse() );
    }
    
    return Int8Array.from(re);
  }

  private getSha1(input): string
  {
    var SHA1Generator = {

        hex_chr: "0123456789abcdef",

        hex: function (num) {
            var str = "";
            for (var j = 7; j >= 0; j--)
                str += this.hex_chr.charAt((num >> (j * 4)) & 0x0F);
            return str;
        },


        str2blks_SHA1: function (str) {
            var nblk = ((str.length + 8) >> 6) + 1;
            var blks = new Array(nblk * 16);
            for (var i = 0; i < nblk * 16; i++) blks[i] = 0;
            for (i = 0; i < str.length; i++)
                blks[i >> 2] |= str.charCodeAt(i) << (24 - (i % 4) * 8);
            blks[i >> 2] |= 0x80 << (24 - (i % 4) * 8);
            blks[nblk * 16 - 1] = str.length * 8;
            return blks;
        },


        add: function (x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        },


        rol: function (num, cnt) {
            return (num << cnt) | (num >>> (32 - cnt));
        },


        ft: function (t, b, c, d) {
            if (t < 20) return (b & c) | ((~b) & d);
            if (t < 40) return b ^ c ^ d;
            if (t < 60) return (b & c) | (b & d) | (c & d);
            return b ^ c ^ d;
        },


        kt: function (t) {
            return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 :
            (t < 60) ? -1894007588 : -899497514;
        },

        calcSHA1FromByte: function(byteArr) {
            var str = '';
            for(var i=0; i<byteArr.length; i++)
                str += String.fromCharCode(byteArr[i]);
            return this.calcSHA1(str);
        },

        calcSHA1: function (str) {
            if (str != '') {
                var x = this.str2blks_SHA1(str);
                var w = new Array(80);

                var a = 1732584193;
                var b = -271733879;
                var c = -1732584194;
                var d = 271733878;
                var e = -1009589776;

                for (var i = 0; i < x.length; i += 16) {
                    var olda = a;
                    var oldb = b;
                    var oldc = c;
                    var oldd = d;
                    var olde = e;

                    for (var j = 0; j < 80; j++) {
                        if (j < 16) w[j] = x[i + j];
                        else w[j] = this.rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
                        var t = this.add(this.add(this.rol(a, 5), this.ft(j, b, c, d)), this.add(this.add(e, w[j]), this.kt(j)));
                        e = d;
                        d = c;
                        c = this.rol(b, 30);
                        b = a;
                        a = t;
                    }

                    a = this.add(a, olda);
                    b = this.add(b, oldb);
                    c = this.add(c, oldc);
                    d = this.add(d, oldd);
                    e = this.add(e, olde);
                }
                return this.hex(a) + this.hex(b) + this.hex(c) + this.hex(d) + this.hex(e);
            }
            else {
                return '';
            }
        }
    };

    var bArray = this.stringToBytes(input);

    return SHA1Generator.calcSHA1FromByte(bArray);
  }

}
