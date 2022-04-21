
//sValidation=nyfjs
//sCaption=Insert Tab character
//sHint=Insert Tab character into current content
//sCategory=MainMenu.Insert
//sCondition=CURDB; DBRW; CURINFOITEM; EDITING;
//sID=p.Ins.TabChar
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

				var sTxt;
				var sEditor=plugin.getCurEditorType().toLowerCase();
				if(sEditor==='htmledit'){

					//2014.12.20 EM SPACE (U+8195) UTF-8 character belongs to the CJK Unified Ideographs subset;
					//HTML Entity [&emsp;] => &#8195, or &#x2003; [&nbsp;] ==> &#160
					//http://www.fileformat.info/info/unicode/char/2003/index.htm
					//var sHtml="&nbsp; &nbsp; &nbsp; &nbsp; "; //"&emsp;"
					//plugin.replaceSelectedText(-1, sHtml, true);

					sTxt="        "; //"\t"

					let xArg=plugin.argument();
					if(xArg){
						//2021.8.15 custom tabwidth user-defined in app/preferences;
						let n=parseInt(xArg['nTabWidth']||'0'), s='';
						if(n>0){
							while( n-- > 0 ) s+=' ';
							sTxt=s;
						}
					}


				}else if(sEditor==='richedit' || sEditor==='plainedit'){
					sTxt='\t';
				}

				if(sTxt) plugin.replaceSelectedText(-1, sTxt, false);

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
