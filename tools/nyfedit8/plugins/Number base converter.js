
//sValidation=nyfjs
//sCaption=Number base converter ...
//sHint=Convert numbers between different bases (eg. decimal, binary, hexadecimal)
//sCategory=MainMenu.Tools
//sCondition=
//sID=p.NumBaseConv
//sAppVerMin=8.0
//sShortcutKey=
//sAuthor=wjjsoft

/////////////////////////////////////////////////////////////////////
// Extension scripts for Mybase Desktop v8.x
// Copyright 2010-2020 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////

var _lc=function(sTag, sDef){return plugin.getLocaleMsg(sTag, sDef);};
var _lc2=function(sTag, sDef){return _lc(plugin.getLocaleID()+'.'+sTag, sDef);};

var _trim=function(s){return (s||'').replace(/^\s+|\s+$/g, '');};
var _trim_cr=function(s){return (s||'').replace(/\r+$/g, '');};

var _makeIntoSingleLine=function(s){
	if(s){
		var ba=new CByteArray(s, 'utf8');
		if(ba && !ba.isEmpty()){
			ba=ba.compress('zlib', 9);
			if(ba && !ba.isEmpty()){
				s=ba.base64();
			}
		}
	}
	return s;
};

var _restoreFromSingleLine=function(s){
	if(s){
		var ba=new CByteArray(s, 'base64');
		if(ba && !ba.isEmpty()){
			ba=ba.decompress();
			if(ba && !ba.isEmpty()){
				s=ba.toStr('utf8');
			}
		}
	}
	return s;
};

//try{

	var sCK_Num='NumBaseConv.sNum', sCK_From='NumBaseConv.iBaseFrom', sCK_To='NumBaseConv.iBaseTo', sCK_Sym='NumBaseConv.sSymbols';

	var vNamed={
		2: _lc2('Term.Binary', 'Binary')
		, 3: _lc2('Term.Ternary', 'Ternary')
		, 4: _lc2('Term.Quaternary', 'Quaternary')
		, 5: _lc2('Term.Quinary', 'Quinary')
		, 6: _lc2('Term.Senary', 'Senary')
		, 7: _lc2('Term.Septenary', 'Septenary')
		, 8: _lc2('Term.Octal', 'Octal')
		, 9: _lc2('Term.Nonary', 'Nonary')
		, 10: _lc2('Term.Decimal', 'Decimal')
		, 11: _lc2('Term.Undecimal', 'Undecimal')
		, 12: _lc2('Term.Duodecimal', 'Duodecimal')
		, 16: _lc2('Term.Hexadecimal', 'Hexadecimal')
		, 20: _lc2('Term.Vigesimal', 'Vigesimal')
		};
	var nMaxBase=CBigInt.maxNumberBaseSupported();
	var vFrom=[_lc2('Detect', 'Auto-detect number base: [ 2 - %nMaxBase% ]').replace(/%nMaxBase%/gi, nMaxBase)
		   , _lc2('Common', 'Common: 0b/Binary, 0/Octal, 0x/Hex, Decimal if base<=10, Hex if base<=16, otherwise [17-62]')
	];
	var vTo=[];
	for(var j=2; j<=nMaxBase; ++j){
		var s=_lc2('Base', 'Base %nBASE%%sNAME%').replace(/%nBASE%/gi, j.toString(10)).replace(/%sNAME%/gi, (vNamed[j] ? ('\t('+vNamed[j]+')') : ''));
		vFrom.push(s);
		vTo.push(s);
	}

	var vFields = [
				{sField: 'textarea', sLabel: _lc2('Descr', 'Convert a big integer number: (case-sensitive for base 37-62, insensitive for 11-36)'), bReadonly: false, bWordwrap: true, sInit: _restoreFromSingleLine(localStorage.getItem(sCK_Num))||''}
				, {sField: 'combolist', sLabel: _lc2('From', 'From base') + ':', vItems: vFrom, iInit: parseInt(localStorage.getItem(sCK_From))}
				, {sField: 'combolist', sLabel: _lc2('To', 'To base') + ':', vItems: vTo, iInit: parseInt(localStorage.getItem(sCK_To))}
				, {sField: 'lineedit', sLabel: _lc2('Symbols', 'With default numerical symbols') + ':', bReadonly: true, sInit: CBigInt.defaultSymbolsForNumberBase(nMaxBase)||'', bReq: false}
			];

	var vRes=input(plugin.getScriptTitle(), vFields, {nMinSize: [600, 200], nSpacing: 10, vMargins: [6, 0, 30, 0], bVert: true, bReq: true});
	if(vRes && vRes.length>=3){

		var j=0, sNum=vRes[j++], iFrom=vRes[j++], iTo=vRes[j++]; //, sSym=vRes[j++];

		if(sNum){

			localStorage.setItem(sCK_Num, _makeIntoSingleLine(sNum));
			localStorage.setItem(sCK_From, iFrom);
			localStorage.setItem(sCK_To, iTo);
			//localStorage.setItem(sCK_Sym, _makeIntoSingleLine(sSym));

			//validate the number string;
			sNum=sNum.replace(/[\s\r\n\t]+/g, '');

			//validate the number base;
			if(iFrom>=2) iFrom+=0; //iFrom=parseInt(vFrom[iFrom]);
			if(iTo>=0) iTo+=2; //iTo=parseInt(vTo[iTo]);

			var x=CBigInt.numberBaseOf(sNum), b=0;
			if(x){
				if(iFrom===0){
					//auto-detect: 2-62
					b=x.base;
					if(b>0){
						iFrom=b;
					}
				}else if(iFrom===1){
					//2020.7.25 auto-detect, but Only 0x - Hex, 0b - Binary, 0 - Octal, or Decimal if base<10
					b=x.base;
					if(b>0){
						if(b<10){
							if(b!==8 || b!==2){
								b=10;
							}
						}else if(b>10 && b<16){
							b=16;
						}
					}
				}else{
					//specified number base;
					b=iFrom;
					if(b!==x.base){
						if(b<x.base){
							b=x.base;
						}
						alert(_lc2('Conflicts', 'The number base auto-detected: %nAutoDetected%\n\nwhile you specified a different one: %nUserSpecified%\n\nThe larger one is accepted: %nAccepted%')
						      .replace(/%nAutoDetected%/gi, x.base)
						      .replace(/%nUserSpecified%/gi, iFrom)
						      .replace(/%nAccepted%/g, b)
						      );
					}
				}
			}

			if(b>=2){
				var n=new CBigInt(sNum, b);
				if(n){
					var s=n.toStr(iTo);
					if(s){
						textbox({
								sTitle: plugin.getScriptTitle()
								, sDescr: _lc2('Results', 'The resulting number from base %nFrom% to %nTo%:').replace(/%nFrom%/gi, b).replace(/%nTo%/gi, iTo)
								, sDefTxt: s //.replace(/(.{70})/g, function(m, m1){return m1+'\n';}).replace(/\s+$/, '')
								, bReadonly: true
								, bWordwrap: true
								, bFind: false
								, bFont: true
								, bRich: false
								, nWidth: 50
								, nHeight: 50
								, sBtnOK: ''
							});
					}
				}
			}else{
				alert('Bad or invalid big integer.' + '\n\n' + sNum);
			}
		}
	}

//}catch(e){
//	alert(e);
//}
