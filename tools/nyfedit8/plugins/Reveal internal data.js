
//sValidation=nyfjs
//sCaption=Reveal internal data ...
//sHint=Reveal internal data for reference or fixing broken links
//sCategory=MainMenu.Tools
//sCondition=CURDB;
//sID=p.RevealInternals
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

		var bRO=xNyf.isReadonly(), sRootContainer=plugin.getDefRootContainer();

		var vFiles=xNyf.listFiles(sRootContainer), vTxtFiles=[];
		for(var i in vFiles){
			var xSsgFn=new CLocalFile(sRootContainer); xSsgFn.append(vFiles[i]);
			var sExt=xSsgFn.getExtension(false).toLowerCase();
			if(sExt==='txt'){
				vTxtFiles.push(xSsgFn.toStr());
			}
		}

		if(vTxtFiles.length>0){

			var sCfgKey1='RevealInternals.iFile';
			var vFields = [
				{sField: "combolist", sLabel: _lc2('Descr', 'Select one of internal data files from the list'), vItems: vTxtFiles, sInit: localStorage.getItem(sCfgKey1)||''}
			];

			var vRes = input(plugin.getScriptTitle(), vFields, {nMinSize: 400, vMargins: [2, 0, 30, 0], bVert: true});
			if(vRes && vRes.length>0){

				var iSel=vRes[0];

				localStorage.setItem(sCfgKey1, iSel);

				var sSsgFn=vTxtFiles[iSel];
				var sTxt=xNyf.loadText(sSsgFn, 'auto');

				var sRes=textbox({
					sTitle: plugin.getScriptTitle()
					, sDescr: _lc2('Caution', 'CAUTION: Do not manually modify the internal data file unless you have to fix broken links.') + '  (' + sSsgFn + ')'
					, sDefTxt: sTxt
					, bReadonly: bRO
					, bWordwrap: false
					, nWidth: 60
					, nHeight: 80
					, sBtnOK: bRO ? '' : _lc2('Save', 'Save')
				});

				if(sRes){
					//2015.5.15 nyf7 uses CR/LF in data files for backward compatibility;
					var vLines=sRes.split('\n');
					sRes='';
					for(var i in vLines){
						if(sRes) sRes+='\r\n';
						sRes+=_trim_cr(vLines[i]);
					}
				}

				if(!bRO && sRes){
					if(sRes===sTxt){
						var sMsg=_lc2('Unchanged', 'No changes detected.');
						alert(sMsg);
					}else{
						var sMsg=_lc2('ConfirmToSave', 'Saving changes to the internal data file; Are you sure?');
						sMsg+='\n\n'+sSsgFn;
						if(confirm(sMsg)){
							var bRecycle=true, bBOM=true;
							if(xNyf.saveUtf8(sSsgFn, sRes, bRecycle, bBOM)>=0){
								sMsg=_lc2('NeedReOpen', 'Successfully saved the changes. Please be sure to save and reopen the database for the changes to take effect. Without reopening, the changes can be overwritten by subsequent operations.');
								alert(sMsg);
							}
						}
					}
				}

			}
		}else{
			alert(_lc2('NoDataFn', 'No internal data files detected.'));
		}

	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}

//}catch(e){
//	alert(e);
//}
