
//sValidation=nyfjs
//sCaption=Move up
//sHint=Move the current attachment up one row
//sCategory=MainMenu.Attachments; Context.Attachments
//sPosition=MOVE_1
//sCondition=CURDB; DBRW; CURINFOITEM; FILESELECTED
//sID=p.Attachment.MoveUp
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
	if(xNyf){

		if(!xNyf.isReadonly()){

			var bFullPath=true;
			var vFiles=plugin.getSelectedAttachments(-1, bFullPath);
			if(vFiles && vFiles.length>0){

				for(var j in vFiles){
					var xFn=new CLocalFile(vFiles[j]);
					var sSsgPath=xFn.getDirectory(), sSsgName=xFn.getLeafName();
					if(sSsgPath && sSsgName){
						var vVisible=xNyf.listFiles(sSsgPath, false);
						var iPos=vVisible.indexOf(sSsgName);
						if(iPos>0 && iPos<vVisible.length){
							//2014.1.14 The previous file may be a trashed entry;
							var sPrev=vVisible[iPos-1];
							var xSsgFn=new CLocalFile(sSsgPath, sPrev);
							iPos=xNyf.getEntryPos(xSsgFn.toStr());
							if(iPos>=0){
								xSsgFn=new CLocalFile(sSsgPath, sSsgName);
								iPos=xNyf.setEntryPos(xSsgFn.toStr(), iPos);
								if(iPos>=0){
									if(plugin.refreshRelationPane) plugin.refreshRelationPane(-1, sSsgPath);
									else plugin.refreshDocViews(-1, sSsgPath);
									break;
								}else{
									alert('Failed to move the attachment up.');
								}
							}
						}
					}
				}

			}else{
				alert('No attachments currently selected.');
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
