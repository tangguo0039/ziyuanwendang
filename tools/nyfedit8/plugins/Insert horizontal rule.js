
//sValidation=nyfjs
//sCaption=Insert horizontal rule
//sHint=Insert horizontal rule into current content
//sCategory=MainMenu.Insert; ToolBar.Insert
//sCondition=CURDB; DBRW; CURINFOITEM; EDITING;
//sID=p.Ins.HoriRule
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
				var sEditor=plugin.getCurEditorType().toLowerCase();
				if(sEditor==='htmledit'){

					var sHtml='<hr noshade style="height: 0px;" />';
					plugin.replaceSelectedText(-1, sHtml, true);

				}else if(sEditor==='richedit'){

					//var sHtml='<hr />';
					//plugin.replaceSelectedText(-1, sHtml, true);

					var sTxt='\n-----------------------------------------------------------\n';
					plugin.replaceSelectedText(-1, sTxt, false);

				}else if(sEditor==='plainedit'){

					var sTxt='\n-----------------------------------------------------------\n';
					plugin.replaceSelectedText(-1, sTxt, false);

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
