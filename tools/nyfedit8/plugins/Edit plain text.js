
//sValidation=nyfjs
//sCaption=Edit plain text ...
//sHint=Edit/view the selected attachment or current document as plain text
//sCategory=MainMenu.Attachments; Context.Attachment
//sCondition=CURDB; CURINFOITEM
//sID=p.EditPlainText
//sAppVerMin=8.0
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

		var reTxt=/^(html|htm|qrich|txt|rtf|ini|log|cgi|csv|css|qss|js|xml|svg|pl|php|asp|c|h|cpp|hpp|cxx|hxx|pas|cs|java|py|rb|rs|go|erl|asm|sql|bat|sh|bas|m|mm|swift|md)$/i;
		var _is_text_file=function(sExt){
			return (sExt||'').search(reTxt)===0;
		};

		var sFnSel;
		{
			var bFullPath=true;
			var v=plugin.getSelectedAttachments(-1, bFullPath);

			if(v && v.length>0){
				for(var i in v){
					var xFn=new CLocalFile(v[i]);
					if(_is_text_file(xFn.getExtension(false))){
						sFnSel=xFn.toStr();
						break;
					}
				}

				if(!sFnSel){
					sFnSel=v[0]; //select the first one if no matches;
				}

			}else{
				sFnSel=plugin.getCurDocFile();
			}
		}

		if(sFnSel){

			var xFn=new CLocalFile(sFnSel), bProceed=true;
			if(!_is_text_file(xFn.getExtension(false))){
				var sMsg=_lc2('GoAnyway', 'Editing a random file as plain text may destroy the file; Proceed anyway?');
				bProceed=confirm(sMsg+'\n\n'+xFn.getLeafName());
			}

			if(bProceed){

				if(plugin.getCurDocFile()===sFnSel){
					if(plugin.isContentEditable()) plugin.commitCurrentChanges();
				}

				var xSsgFn=new CLocalFile(sFnSel);
				var sSsgPath=xSsgFn.getDirectory(false), sSsgName=xSsgFn.getLeafName();
				var sTitle=xNyf.getFolderHint(sSsgPath); if(!sTitle) sTitle='....';

				var sTxt='', xShortcutFn, sDocDispName;
				var bShortcut=xNyf.isShortcut(sFnSel);
				if(bShortcut){
					var sFnSrc=xNyf.getShortcutFile(sFnSel, true);
					if(sFnSrc){
						xShortcutFn=new CLocalFile(sFnSrc);
						if(xShortcutFn.exists()){
							sDocDispName=sFnSrc;
							sTxt=xShortcutFn.loadText('auto');
						}else{
							alert(_lc('Prompt.Failure.FileNotFound', 'File not found.')+'\n\n'+sFnSrc);
						}
					}
				}else{
					sTxt=xNyf.loadText(sFnSel, 'auto');
					sDocDispName=sTitle+'/'+sSsgName;
				}

				if(sDocDispName){

					var bRO=xNyf.isReadonly();

					var sMsg=_lc2('Descr', 'Text file') + ": " + sDocDispName;
					sTxt=textbox({
						sTitle: plugin.getScriptTitle()
						, sDescr: sMsg
						, sDefTxt: sTxt
						, bReadonly: bRO
						, bWordwrap: false
						, bFind: true
						, bFont: true
						, bRich: false
						, nWidth: 95
						, nHeight: 80
						, sSyntax: xFn.getExtension(false)
						, sBtnOK: bRO ? '' : _lc('p.Common.SaveChanges', 'Save changes')
					});

					if(sTxt && !bRO){
						if(bShortcut){
							if(xShortcutFn){
								xShortcutFn.saveUtf8(sTxt);
							}
						}else{
							xNyf.saveUtf8(xSsgFn.toStr(), sTxt, true, true);
						}

						if(sFnSel===plugin.getCurDocFile()){
							plugin.refreshDocViews(-1, '');
						}else{
							plugin.refreshRelationPane(-1, sSsgPath);
						}
					}
				}
			}

		}else{
			alert(_lc2('', 'No text document available to edit/view.'));
		}

	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}

//}catch(e){
//	alert(e);
//}
