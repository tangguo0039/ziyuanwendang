
//sValidation=nyfjs
//sCaption=Move up
//sHint=Move the current attachment up one row
//sCategory=MainMenu.Attachments; Context.Attachments
//sID=p.MoveFileUp
//sAppVerMin=7.0
//sShortcutKey=
//sAuthor=wjjsoft

var _lc=function(sTag, sDef){return plugin.getLocaleMsg(sTag, sDef);};
var _lc2=function(sTag, sDef){return _lc(plugin.getLocaleID()+'.'+sTag, sDef);};

var _trim=function(s){return (s||'').replace(/^\s+|\s+$/g, '');};
var _trim_cr=function(s){return (s||'').replace(/\r+$/g, '');};

try{

	var sLines=plugin.getSelectedAttachments('\t');
	if(sLines){
		var vLines=sLines.split('\n');
		for(var j in vLines){
			var v=vLines[j].split('\t');
			var sDbPath=v[0], sSsgPath=v[1], sSsgName=v[2];
			var iDb=plugin.getDbIndex(sDbPath);
			if(iDb>=0 && iDb<plugin.getDbCount() && sSsgPath && sSsgName){
				var xNyf=new CNyfDb(iDb);
				if(xNyf && xNyf.isOpen()){
					if(!xNyf.isReadonly()){
						var vVisible=xNyf.listFiles(sSsgPath, false);
						var iPos=vVisible.indexOf(sSsgName);
						if(iPos>0 && iPos<vVisible.length){
							//2014.1.14 The previous file may be a trashed entry;
							var sPrev=vVisible[iPos-1];
							var xSsgFn=new CLocalFile(sSsgPath); xSsgFn.append(sPrev);
							iPos=xNyf.getEntryPos(xSsgFn);
							if(iPos>=0){
								xSsgFn=new CLocalFile(sSsgPath); xSsgFn.append(sSsgName);
								iPos=xNyf.setEntryPos(xSsgFn, iPos);
								if(iPos>=0){
									plugin.refreshDocViews(iDb, sSsgPath);
									break;
								}else{
									alert('Failed to move the attachment up.');
								}
							}
						}
					}else{
						alert(_lc('Prompt.Warn.ReadonlyDb', 'Cannot modify the database opened as Readonly.'));
					}
				}else{
					alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
				}
			}
		}
	}else{
		alert('No attachments currently selected.');
	}

}catch(e){
	alert(e);
}
