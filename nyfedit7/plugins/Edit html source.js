
//sValidation=nyfjs
//sCaption=Edit HTML source ...
//sHint=Edit or view HTML source of the currently working document
//sCategory=MainMenu.Edit; Context.HtmlEdit
//sID=p.EditHtmlSrc
//sAppVerMin=7.0
//sShortcutKey=
//sAuthor=wjjsoft

var _lc=function(sTag, sDef){return plugin.getLocaleMsg(sTag, sDef);};
var _lc2=function(sTag, sDef){return _lc(plugin.getLocaleID()+'.'+sTag, sDef);};

var _trim=function(s){return (s||'').replace(/^\s+|\s+$/g, '');};
var _trim_cr=function(s){return (s||'').replace(/\r+$/g, '');};

try{
	var xNyf=new CNyfDb(-1);

	if(xNyf.isOpen()){

		var xSsgFn=new CLocalFile(plugin.getCurDocFile(-1));
		var sSsgPath=xSsgFn.getDirectory(), sSsgName=xSsgFn.getLeafName(), sExt=xSsgFn.getExtension(false).toLowerCase();
		var sTitle=xNyf.getFolderHint(sSsgPath); if(!sTitle) sTitle='....';
		var vExts='html;htm'.split(';');
		if(vExts.indexOf(sExt)>=0){

			if(plugin.isEditable()) plugin.commitCurrentChanges();

			var _cleanup_html_tag=function(sHtml, sTag, bDel){
				var p1=sHtml.toUpperCase().indexOf('<'+sTag.toUpperCase());
				if(p1>=0){
					var p2=sHtml.indexOf('>', p1);
					if(p2>p1){
						if(bDel){
							sHtml=sHtml.substr(0, p1)+sHtml.substr(p2+1);
						}else{
							sHtml=sHtml.substr(0, p1)+'<'+sTag+'>'+sHtml.substr(p2+1);
						}
					}
				}
				return sHtml;
			};

			var _downgrade_xhtml=function(sHtml){
				sHtml=_cleanup_html_tag(sHtml, '!DOCTYPE html', true);
				sHtml=_cleanup_html_tag(sHtml, 'meta', true);
				sHtml=_cleanup_html_tag(sHtml, 'html', false);
				sHtml=_cleanup_html_tag(sHtml, 'body', false);
				return sHtml;
			};

			var sHtml='', xShortcutFn, sDocDispName;
			var bShortcut=xNyf.isShortcut(xSsgFn);
			if(bShortcut){
				var sFnSrc=xNyf.getShortcutFile(xSsgFn);
				if(sFnSrc){
					xShortcutFn=new CLocalFile(sFnSrc);
					if(xShortcutFn.exists()){
						sDocDispName=sFnSrc;
						sHtml=xShortcutFn.loadText('');
					}else{
						alert(_lc('Prompt.Failure.FileNotFound', 'File not found.')+'\n\n'+sFnSrc);
					}
				}
			}else{
				sHtml=xNyf.loadText(xSsgFn, '');
				sDocDispName=sTitle+'/'+sSsgName;
			}

			if(sDocDispName){
				if(sHtml){
					sHtml=_downgrade_xhtml(sHtml);
					var sTmp=platform.indentHtml(sHtml, 8);
					var sCause=platform.indentHtmlErrCause();
					if(sCause){
						var sMsg=_lc2('ProblemParsing', 'Failed to parse the HTML source code.\n\nCause: %sErrCause%\n\nPress Yes button to view the parsing results, or No to load the original HTML source.')
							.replace('%sErrCause%', sCause)
							;
						if(confirm(sMsg)){
							sHtml=sTmp;
						}
					}else{
						sHtml=sTmp;
					}
				}

				var bRO=xNyf.isReadonly() || !plugin.isEditable();
				var sMsg=_lc2('Descr', 'HTML document: %sDocName%').replace('%sDocName%', sDocDispName);
				sHtml=textbox({
					sTitle: plugin.getScriptTitle()
					, sDescr: sMsg
					, sDefTxt: sHtml
					, bReadonly: bRO
					, bWordwrap: false
					, bRich: false
					, nWidth: 80
					, nHeight: 80
					, sBtnOK: bRO ? '' : _lc('p.Common.SaveChanges', 'Save changes')
				});

				if(sHtml && !bRO){
					if(xShortcutFn){
						xShortcutFn.saveUtf8(sHtml);
					}else{
						xNyf.saveUtf8(xSsgFn, sHtml, true, true);
					}
					plugin.refreshDocViews(-1, sSsgPath);
				}
			}
		}else{
			alert(_lc2('', 'Can not edit random contents other than HTML documents.')+'\n\n'+sTitle+'/'+sSsgName);
		}

	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}
}catch(e){
	alert(e);
}
