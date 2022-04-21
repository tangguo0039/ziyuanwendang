
//sValidation=nyfjs
//sCaption=Open folder location
//sHint=Open folder location for shortcut or hyperlink
//sCategory=Context.Relation.Attachment; Context.Hyperlink
//sCondition=CURDB; CURINFOITEM;
//sID=p.OpenFolderLocation
//sAppVerMin=8.0
//sShortcutKey=
//sAuthor=wjjsoft

/////////////////////////////////////////////////////////////////////
// Extension scripts for Mybase Desktop v8.x
// Copyright 2010-2021 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////

//17:44 9/18/2015 initial commit by wjj;
//This plugin tries to open the folder location where the current shortcut file resides;
//Usage: right-click on a 'shortcut' within the attachment pane, then select 'Open folder location' menu item;

var _lc=function(sTag, sDef){return plugin.getLocaleMsg(sTag, sDef);};
var _lc2=function(sTag, sDef){return _lc(plugin.getLocaleID()+'.'+sTag, sDef);};

var _trim=function(s){return (s||'').replace(/^\s+|\s+$/g, '');};
var _trim_cr=function(s){return (s||'').replace(/\r+$/g, '');};

//try{

	var xNyf=new CNyfDb(-1);
	if(xNyf.isOpen()){

		include('comutils');

		let sCurInputFocus=ui.getFocusPane();

		let relationFocus=()=>{return (/^Relation$/i).test(sCurInputFocus);};
		let htmlEditFocus=()=>{return (/^Html(Edit|View)$/i).test(sCurInputFocus);};
		let richEditFocus=()=>{return (/^Rich(Edit|View)$/i).test(sCurInputFocus);};
		let plainEditFocus=()=>{return (/^(Text|Plain)(Edit|View)$/i).test(sCurInputFocus);};

		let vDirs=[];
		if(relationFocus()){

			var bFullPath=true;
			var vFiles=plugin.getSelectedAttachments(-1, bFullPath);
			if(vFiles && vFiles.length>0){
				for(var i in vFiles){
					var sSsgFn=vFiles[i];
					if(xNyf.isShortcut(sSsgFn)){
						var bResolve=true, sFn=xNyf.getShortcutFile(sSsgFn, bResolve);
						var sDir=new CLocalFile(sFn).getDirectory(false);
						if(sDir){
							vDirs.push(sDir);
						}
					}
				}
			}

		}else if(htmlEditFocus() || richEditFocus() || plainEditFocus){

			let sLink=ui.getCurrentHyperlink(-1, true), sFn=localFileFromUrl(sLink, true);
			if(sFn){
				let s=xNyf.evalRelativePath(sFn), sDir;
				if(s){
					let xFn=new CLocalFile(s);
					if(xFn.isFile()){
						sDir=xFn.getDirectory(false);
					}else if(xFn.isDir()){
						sDir=s;
					}
					if(sDir) vDirs.push(sDir);
				}
			}

		}

		if(vDirs.length>0){
			let sDir=vDirs[0], xDir=new CLocalDir(sDir);
			if(xDir.exists()){
				xDir.launch();
			}else{
				alert(_lc2('DirNotFound', 'Folder location not found.')+'\n\n'+sDir);
			}
		}else{
			alert(_lc2('NoDirAvail', 'No folder location available.'));
		}

	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}

//}catch(e){
//	alert(e);
//}
