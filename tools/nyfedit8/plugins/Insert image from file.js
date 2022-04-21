
//sValidation=nyfjs
//sCaption=Insert image from file ...
//sHint=Insert image files as attachments
//sCategory=MainMenu.Insert; ToolBar.Insert
//sCondition=CURDB; DBRW; CURINFOITEM; EDITING;
//sID=p.Ins.ImgFiles
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

			var sCfgKey1='InsImgFiles.sDir', sCfgKey2='InsImgFiles.iSave';
			var vSave=[
				_lc2('Attachment', 'Attachments')
				, _lc2('Base64', 'Image data (Base64) embedded into current document')
				, _lc2('Hyperlink', 'Hyperlinks pointing to original image files')
				];
			var vFields = [
				{sField: 'openfiles', sLabel: _lc2('GetFiles', 'Image files'), sTitle: plugin.getScriptTitle(), sInit: localStorage.getItem(sCfgKey1)||'', sFilter: 'Images (*.jpg *.jpeg *.png *.gif *.bmp *.svg);;All files(*.*)'}
				, {sField: 'combolist', sLabel: _lc2('SaveAs', 'Save as'), vItems: vSave, sInit: localStorage.getItem(sCfgKey2)||''}
				];
			var vRes=input(plugin.getScriptTitle(), vFields, {nMinSize: 500, vMargins: [8, 0, 30, 0], bVert: false});
			if(vRes && vRes.length>=2){

				var vFiles=vRes[0], iSave=vRes[1];

				if(vFiles && vFiles.length>0 && iSave>=0){

					localStorage.setItem(sCfgKey1, vFiles.length>1 ? (new CLocalFile(vFiles[0]).getDirectory(false)) : vFiles[0]);
					localStorage.setItem(sCfgKey2, iSave);

					var vDone=[], vFail=[];
					var sSsgPath=plugin.getCurDocPath(-1), sCurDocFn=plugin.getCurDocName(-1);
					var bMd=(new CLocalFile(sCurDocFn).getSuffix(false)==='md');

					if(iSave===0){

						//import image files as attachments;
						for(var j in vFiles){
							var sDskFn=vFiles[j];
							var sName=new CLocalFile(sDskFn).getLeafName();
							var xSsgFn=new CLocalFile(sSsgPath, sName);
							
							var bProceed=true;
							if(xNyf.fileExists(xSsgFn.toStr())){
								bProceed=confirm(_lc2('Overwrite', 'Attachment file already exists; Overwrite it?')+'\n\n'+sName);
							}

							if(bProceed){
								if(xNyf.createFile(xSsgFn.toStr(), sDskFn)>0){
									if(bMd){
										sMd='![](%FN% "%FN%")'.replace(/%FN%/g, sName);
									}else{
										sMd='<img src="'+sName+'" />';
									}
									plugin.replaceSelectedText(-1, sMd, true);
									vDone.push(sDskFn);
								}else{
									vFail.push(sDskFn);
								}
							}
						}

						if(vDone.length>0){
							plugin.refreshRelationPane(-1);
						}

					}else if(iSave===1){

						//embed image files into HTML;
						for(var j in vFiles){
							var sDskFn=vFiles[j];
							var xFn=new CLocalFile(sDskFn);
							var sExt=xFn.getExtension(false).toLowerCase()||'png';
							var v=xFn.readBytes();
							if(v && v.size()>0){
								plugin.replaceSelectedText(-1, '<img src="data:image/'+sExt+';base64,'+v.base64()+'" />', true);
								vDone.push(sDskFn);
							}else{
								vFail.push(sDskFn);
							}
						}

					}else if(iSave===2){

						//make hyperlins to image files;
						//var sDbPath=new CLocalFile(xNyf.getDbFile()).getDirectory(true).replace(/\\/g, '/');
						for(var j in vFiles){
							var sDskFn=vFiles[j].replace(/\\/g, '/');
							
							//2015.1.7 Relative path doesn't work;
							//var sRel=sDskFn;
							//if(sDskFn.indexOf(sDbPath)==0){
							//	sRel=sDskFn.replace(sDbPath, '%DBPATH%/');
							//}

							//file:///${HOME}/Desktop/Screen%20Shot%202020-03-12%20at%2017.26.34.png
							var sUri=xNyf.makeFileLinkWithRelativePath(sDskFn); //'file:///'+sDskFn;
							plugin.replaceSelectedText(-1, '<img src="'+sUri+'" />', true);
							vDone.push(sDskFn);
						}

					}

					if(vFail.length>0){
						alert('Failed to insert the following image file(s);'+'\n\n'+vFail.join('\n'));
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
