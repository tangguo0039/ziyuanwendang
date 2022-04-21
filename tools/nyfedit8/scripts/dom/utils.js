
/////////////////////////////////////////////////////////////////////
// Essential scripts for Mybase Desktop v8.x
// Copyright 2010-2020 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////

utils={

	isMac: function(){
		return navigator.userAgent.search(/(\bMacintosh\b|\bMac\b)/i)>=0;
	}

	, isLinux: function(){
		return navigator.userAgent.search(/(\bLinux\b)/i)>=0;
	}

	, isWin: function(){
		return navigator.userAgent.search(/(\bWindows\b)/i)>=0;
	}

	, uniq: function(a){
		//https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates
		return a.filter((val, ind, arr) => arr.indexOf(val) === ind);
	}

	, isImageDataUrl: function(s){
		return (s||'').search(/data:image\/(png|jpg|jpeg|gif|svg|bmp|tif);base64,[A-Za-z0-9+/=]+/i)===0;
	}

	, trim: function(s){
		return (s||'').replace(/^\s+|\s+$/g, ''); //2020.9.14 '\s' recognizes '\r \n 0x20' as well as '0xA0' usually translated from html entity '&nbsp;'
	}

	, trim_cr: function(s){
		return (s||'').replace(/\r+$/g, '');
	}

	, trim_lf: function(s){
		return (s||'').replace(/\n+$/g, '');
	}

	, trim_crlf: function(s){
		return (s||'').replace(/[\r\n]+$/g, '');
	}

	, ellipsis: function(s, n){
		var p='^([\\s\\S]{64})([\\s\\S]+)$'; n=parseInt(''+n);
		if(n>0) p=p.replace('64', n);
		var re=new RegExp(p);
		return (s||'').replace(re, '$1...');
	}

	, thousandths: function(n){
		return (n||'').toString().replace(/(\d)(?=(\d{3})+$)/g, "$1,");
	}

	, strPadLeft: function(s, w, p){
		s=''+s;
		while( s.length<w ) s=p + s;
		return s;
	}

	//, fillZero: function(n, r){
	//	var s=n.toString(r||16), z=4-s.length;
	//	while( z-- > 0 ) s='0' + s;
	//	return s;
	//}

	, htmlEncode: function(s){
		//http://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references
		//http://www.utf8-chartable.de/unicode-utf8-table.pl?utf8=dec
		s=s.replace(/&/g,		'&amp;');
		s=s.replace(/</g,		'&lt;');
		s=s.replace(/>/g,		'&gt;');
		s=s.replace(/\"/g,		'&quot;');
		s=s.replace(/\'/g,		'&apos;');

		//https://mathiasbynens.be/notes/javascript-escapes
		//http://www.regular-expressions.info/nonprint.html
		//http://www.fileformat.info/info/unicode/char/a0/index.htm
		//http://www.fileformat.info/info/unicode/char/2002/index.htm
		//http://www.fileformat.info/info/unicode/char/2003/index.htm

		s=s.replace(/\xA0/g,		'&nbsp;');
		s=s.replace(/\u2002/g,		'&ensp;');
		s=s.replace(/\u2003/g,		'&emsp;');

		//Do not translate Tabs in 'nodeValue', just keep them there if any;
		//s=s.replace(/\t/g,		'&nbsp; &nbsp; &nbsp; &nbsp; '); //&emsp;

		s=s.replace(/  /g,		'&nbsp; '); //&nbsp; = non-breaking space;

		return s;
	}

	, htmlDecode: function(s){
		s=s.replace(/&lt;/g,		'<');
		s=s.replace(/&gt;/g,		'>');
		s=s.replace(/&quot;/g,		'"');
		s=s.replace(/&apos;/g,		'\'');
		s=s.replace(/&emsp;/g,		'    '); //2015.10.23 bugfix: just 4 spaces, not the '&nbsp; &nbsp; &nbsp; &nbsp; '
		s=s.replace(/&nbsp;/g,		' ');
		s=s.replace(/&circ;/g,		'^');
		s=s.replace(/&tilde;/g,		'~');
		//more ...
		s=s.replace(/&amp;/g,		'&');
		return s;
	}

	//, percentEncode: function(s){
	//	var r='';
	//	for(var i=0; i<s.length; ++i){
	//		var n=s.charCodeAt(i) & 0xff;
	//		var sHex=Number(n).toString(16);
	//		if(sHex.length===1){
	//			sHex='0'+sHex;
	//			r+=sHex;
	//		}else{
	//			console.debug('utils.percentEncode: Bad parameter supplied.');
	//		}
	//	}
	//	return r;
	//}

	, extend: function(d, o, dName, oName){
		if(d && o){
			oName=(oName||o.constructor.name);
			dName=(dName||d.constructor.name);
			//console.debug('<extend>: ' + dName + ' <-- ' + oName);
			for(var k in o){
				if(k){
					if(d.k){
						console.debug('<extend> property already exists: ' + dName + '.' + k + ' <Failed>');
					}else{
						//console.debug('<extend>: ' + dName + '.' + k + ' = ' + oName + '.' + k + ' <OK>');
						d[k]=o[k];
					}
				}
			}
		}
	}

	, viewObj: function(obj){
		var s='NULL';
		if(obj){

			var type=typeof(obj);
			s='TYPE = '+type+'\n';

			if(type === 'object'){
				for(var x in obj){

					if(x==='typeDetail') continue; //weird thing in IE7

					var val=obj[x];
					if(val){
						type=typeof(val);
						if(type==='string' || type==='number'){
							val=obj[x];
						}else if(type==='function'){
							val='{function}';
						}else{
							val='['+type+']';
						}
					}else{
						val='?';
					}

					if(s) s+='\n';

					s+=x;
					s+=' = ';
					s+=val;
				}
			}else if(type==='string'){
				s+='\n';
				s+=obj;
			}else{
			}
		}
		alert(s);
	}

};


