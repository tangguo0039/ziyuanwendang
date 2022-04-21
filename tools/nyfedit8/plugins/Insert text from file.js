
//sValidation=nyfjs
//sCaption=Insert text from file ...
//sHint=Insert text files into current content
//sCategory=MainMenu.Insert; ToolBar.Insert
//sCondition=CURDB; DBRW; CURINFOITEM; EDITING;
//sID=p.Ins.TxtFile
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

		if(!xNyf.isReadonly() && plugin.isContentEditable()){

			var sCfgKey='InsertTxtFile.Dir';

			var vFiles=platform.getOpenFileNames({
				sTitle: plugin.getScriptTitle()
				, sInitDir: localStorage.getItem(sCfgKey)||''
				, sFilter: 'Text files (*.txt);;All files (*.*)'
			});

			if(vFiles && vFiles.length>0){

				localStorage.setItem(sCfgKey, new CLocalFile(vFiles[0]).getDirectory(false));

				for(var j in vFiles){
					var xFn=new CLocalFile(vFiles[j]);
					var sTxt=xFn.loadText('auto');
					if(sTxt){
						if(sTxt.search(/\\n$/)<0) sTxt+='\n';
						plugin.replaceSelectedText(-1, sTxt, false);
					}
				}

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
