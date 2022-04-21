
//sValidation=nyfjs
//sCaption=Remove unwanted spaces ...
//sHint=Remove unwanted spaces from in selected text
//sCategory=MainMenu.TxtUtils
//sCondition=CURDB; DBRW; CURINFOITEM; CONTENTSELECTED
//sID=p.RemoveSpaces
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

//try{
	var xNyf=new CNyfDb(-1);
	if(xNyf.isOpen()){

		if(!xNyf.isReadonly()){

			if(plugin.isContentEditable()){

				var sTxt=plugin.getSelectedText(-1, false);
				sTxt=sTxt.replace(/[\r\n]$/g, '');
				if(sTxt){

					var vOpts=[
						  _lc2('LeadingSpaces', 'Remove leading spaces (Blank spaces & Tabs)')
						, _lc2('TrailingSpaces', 'Remove trailing spaces (Blank spaces & Tabs)')
						, _lc2('ExtraSpaces', 'Remove extra spaces (Blank spaces & Tabs)')
						, _lc2('AllSpaces', 'Remove ALL spaces (Blank spaces & Tabs)')
						, _lc2('AllReturns', 'Remove all Returns (CR/LF)')
						, _lc2('ExtraReturns', 'Remove extra Returns (CR/LF)')
					];

					var sCfgKey1='RemoveSpaces.iOption';
					var vFields = [
						{sField: "combolist", sLabel: _lc2('Options', 'Options'), vItems: vOpts, sInit: localStorage.getItem(sCfgKey1)||''}
					];

					var vRes = input(plugin.getScriptTitle(), vFields, {nMinSize: 400, vMargins: [8, 0, 30, 0]});
					if(vRes && vRes.length>=1){

						var iSel=vRes[0];

						localStorage.setItem(sCfgKey1, iSel);

						switch(iSel){
							case 0:
								//LeadingSpaces
								var v=sTxt.split('\n'), r='';
								for(var i in v){
									if(r) r+='\n';
									r+=v[i].replace(/^\s+/g, '');
								}
								sTxt=r;
								break;
							case 1:
								//TrailingSpaces
								var v=sTxt.split('\n'), r='';
								for(var i in v){
									if(r) r+='\n';
									r+=v[i].replace(/\s+$/g, '');
								}
								sTxt=r;
								break;
							case 2:
								//ExtraSpaces
								var v=sTxt.split('\n'), r='';
								for(var i in v){
									if(r) r+='\n';
									r+=v[i].replace(/\s{2,}/g, ' ');
								}
								sTxt=r;
								break;
							case 3:
								//AllSpaces
								var v=sTxt.split('\n'), r='';
								for(var i in v){
									if(r) r+='\n';
									r+=v[i].replace(/\s/g, '');
								}
								sTxt=r;
								break;
							case 4:
								//AllReturns
								var v=sTxt.split('\n'), r='';
								for(var i in v){
									r+=v[i].replace(/[\r\n]/g, '');
								}
								sTxt=r;
								break;
							case 5:
								//ExtraReturns
								var r=_trim(sTxt);
								r=r.replace(/\r\n/g, '\n');
								r=r.replace(/\n{2,}/g, '\n');
								sTxt=r;
								break;
						}
						plugin.replaceSelectedText(-1, sTxt, false);
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
