
//sValidation=nyfjs
//sCaption=Edit plain text ...
//sHint=Edit or view selected attachment as plain text
//sCategory=MainMenu.Attachments; Context.Attachments
//sID=p.EditPlainText
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

		var sFnSel;
		var vExts='html;htm;txt;ini;log;csv;css;js;xml;pl;php;asp;c;h;cpp;hpp;cxx;hxx;pas;cs;java;py;rb;go;erl;asm;sql;bat;sh;bas'.split(';');
		var sRes=plugin.getSelectedAttachments('\t')||'';
		if(sRes){
			var vLines=sRes.split('\n');
			for(var i in vLines){
				var v=(vLines[i]||'').split('\t');
				var sDbPath=v[0], sSsgPath=v[1], sSsgName=v[2];
				var xFn=new CLocalFile(sSsgPath); xFn.append(sSsgName);
				if(vExts.indexOf(xFn.getExtension(false).toLowerCase())>=0){
					sFnSel=xFn.toString();
				}
			}
		}else{
			var xFn=new CLocalFile(plugin.getCurDocFile());
			if(vExts.indexOf(xFn.getExtension(false).toLowerCase())>=0){
				sFnSel=xFn.toString();
			}
		}

		if(sFnSel){

			if(plugin.getCurDocFile()==sFnSel){
				if(plugin.isEditable()) plugin.commitCurrentChanges();
			}

			var xSsgFn=new CLocalFile(sFnSel);
			var sSsgPath=xSsgFn.getDirectory(false), sSsgName=xSsgFn.getLeafName();
			var sTitle=xNyf.getFolderHint(sSsgPath); if(!sTitle) sTitle='....';

			var sTxt='', xShortcutFn, sDocDispName;
			var bShortcut=xNyf.isShortcut(sFnSel);
			if(bShortcut){
				var sFnSrc=xNyf.getShortcutFile(sFnSel);
				if(sFnSrc){
					xShortcutFn=new CLocalFile(sFnSrc);
					if(xShortcutFn.exists()){
						sDocDispName=sFnSrc;
						sTxt=xShortcutFn.loadText('');
					}else{
						alert(_lc('Prompt.Failure.FileNotFound', 'File not found.')+'\n\n'+sFnSrc);
					}
				}
			}else{
				sTxt=xNyf.loadText(sFnSel, '');
				sDocDispName=sTitle+'/'+sSsgName;
			}

                        var bRO=xNyf.isReadonly();

			if(sDocDispName){
				var sMsg=_lc2('Descr', 'Text file: %sDocName%').replace('%sDocName%', sDocDispName);
				sTxt=textbox({
					sTitle: plugin.getScriptTitle()
					, sDescr: sMsg
					, sDefTxt: sTxt
					, bReadonly:bRO 
					, bWordwrap: false
					, bRich: false
					, nWidth: 80
					, nHeight: 80
					, sBtnOK: bRO ? '' : _lc('p.Common.SaveChanges', 'Save changes')
				});

				if(sTxt && !bRO){
					if(bShortcut){
						if(xShortcutFn){
							xShortcutFn.saveUtf8(sTxt);
						}
					}else{
						xNyf.saveUtf8(xSsgFn, sTxt, true, true);
					}
					plugin.refreshDocViews(-1, sSsgPath);
				}
			}
		}else{
			alert(_lc2('', 'No text document available to edit/view.'));
		}

	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}
}catch(e){
	alert(e);
}
