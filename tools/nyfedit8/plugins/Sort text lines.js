
//sValidation=nyfjs
//sCaption=Sort text lines ...
//sHint=Sort the selected text lines by alphabet
//sCategory=MainMenu.TxtUtils
//sCondition=CURDB; DBRW; CURINFOITEM; CONTENTSELECTED
//sID=p.SortTextLines
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

var _trim_crlf=function(s){return (s||'').replace(/[\r\n]/g, '');};

var _compare=function(x, y){
	if(x>y) return 1;
	else if(x<y) return -1;
	else return 0;
};

//try{
	var xNyf=new CNyfDb(-1);
	if(xNyf.isOpen()){

		if(!xNyf.isReadonly()){

			if(plugin.isContentEditable()){

				var sTxt=plugin.getSelectedText(-1, false);
				if(sTxt){

					var vOrder=[
						_lc2('Asc', 'Ascending')
						, _lc2('Desc', 'Descending')
					];

					var vCase=[
						_lc2('NoCase', 'Case insensitive')
						, _lc2('WithCase', 'Case sensitive')
					];

					var sCfgKey1='SortTextLines.iOrder', sCfgKey2='SortTextLines.iCase';
					var vFields = [
						{sField: "combolist", sLabel: _lc2('Order', 'Order'), vItems: vOrder, sInit: localStorage.getItem(sCfgKey1)||''}
						, {sField: "combolist", sLabel: _lc2('Case', 'Case'), vItems: vCase, sInit: localStorage.getItem(sCfgKey2)||''}
					];

					var vRes = input(plugin.getScriptTitle(), vFields, {nMinSize: 400, vMargins: [8, 0, 30, 0]});
					if(vRes && vRes.length>=2){

						var iAsc=vRes[0], iCase=vRes[1];

						localStorage.setItem(sCfgKey1, iAsc);
						localStorage.setItem(sCfgKey2, iCase);

						var bAsc=(iAsc===0), bCase=(iCase===1);

						var v=sTxt.split('\n');
						v.sort(function(x,y){
							var j=bCase ? _compare(x, y) : _compare(x.toLowerCase(), y.toLowerCase());
							return (j===0) ? 0 : (bAsc ? j : -j);
						});

						var r='';
						for(var i in v){
							if(r) r+='\n';
							r+=v[i]; //_trim_crlf(v[i]);
						}

						plugin.replaceSelectedText(-1, r, false);
					}

				}else{

					alert(_lc('Prompt.Warn.NoTextSelected', 'No text content is currently selected.'));

				}

			}else{
				alert(_lc('Prompt.Warn.ReadonlyContent', 'Cannot modify the content opened as Readonly.'));
			}

		}else{
			alert(_lc('Prompt.Warn.ReadonlyDb', 'Cannot modify the database opened as Readonly.'));
		}

	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}

//}catch(e){
//	alert(e);
//}
