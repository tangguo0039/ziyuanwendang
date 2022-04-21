
//sValidation=nyfjs
//sCaption=Comment ...
//sHint=Add comments on the currently selected HTML content (paragraph)
//sCategory=MainMenu.Edit; Context.HtmlEdit;
//sCondition=CURDB; DBRW; CURINFOITEM; HTMLEDIT
//sID=p.CommentOnPar
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

				var sInit;
				{
					var sCode = 'dom.parAttrUtil("%sKey%");'.replace(/%sKey%/g, 'title');
					var vOld=plugin.runDomScript(-1, sCode, 3000);
					if(vOld && vOld.length>0){
						for(var i in vOld){
							sInit=vOld[i];
							if(sInit) break;
						}
					}
				}

				var vFields = [
					{sField:  'lineedit', sLabel: _lc2('Comment', 'Comment on the selected HTML content (paragraph)'), sInit:  sInit||'', bReq: false}
				];

				var vRes = input(plugin.getScriptTitle(), vFields, {nMinSize: 560, vMargins: [6, 0, 30, 0], bVert: true});
				if(vRes && vRes.length >= 1){

					var sComment = vRes[0];

					var sCode = 'dom.beginEdit();'

						+ 'dom.parAttrUtil("title", "%sTitle%");'.replace(/%sTitle%/g, sComment)

						+ 'dom.parCssUtil([{key:"text-decoration", val:"%sStyle%"}]);'.replace(/%sStyle%/g, (sComment?'underline':''))

						+ 'dom.endEdit(500);'

					;

					plugin.runDomScript(-1, sCode, 3000);
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
