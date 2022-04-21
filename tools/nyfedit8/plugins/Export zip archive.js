
//sValidation=nyfjs
//sCaption=Export .zip archive ...
//sHint=Export files & folders to a .zip archive
//sCategory=MainMenu.Share
//sCondition=CURDB; OUTLINE; CURINFOITEM
//sID=p.ExportZip
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

var _validate_filename=function(s){
	s=s||'';
	s=s.replace(/[\*\?\.\(\)\[\]\{\}\<\>\\\/\!\$\^\&\+\|,;:\"\'`~@]/g, ' ');
	s=s.replace(/\s{2,}/g, ' ');
	s=_trim(s);
	if(s.length>64) s=s.substr(0, 64);
	s=_trim(s);
	s=s.replace(/\s/g, '_');
	return s;
};

try{
	var xNyf=new CNyfDb(-1);
	if(xNyf.isOpen()){

		if(plugin.isContentEditable()) plugin.commitCurrentChanges();

		var sCfgKey='ExportZip.Dir';

		var sItemTitle=xNyf.getFolderHint(plugin.getCurInfoItem(-1))||'untitled';

		var xInitFn=new CLocalFile(localStorage.getItem(sCfgKey)||platform.getHomePath()||'', _validate_filename(sItemTitle) + '.zip');

		var sZipFn=platform.getSaveFileName(
			{ sTitle: plugin.getScriptTitle()
			, sInitDir: xInitFn.toStr()
			, sFilter: 'Zip archives (*.zip);;All files (*.*)'
			, bDontConfirmOverwrite: false
			});

		if(sZipFn){

			plugin.initProgressRange(plugin.getScriptTitle(), 0);

			var vSsgEntries=[];
			var _act_on_treeitem=function(sSsgPath, iLevel){

				var sTitle=xNyf.getFolderHint(sSsgPath); if(!sTitle) sTitle='== Untitled ==';

				if(!plugin.showProgressMsg(sTitle, true)) throw 'User abort by Esc.';

				if(vSsgEntries.indexOf(sSsgPath)<0){
					//vSsgEntries.push(sSsgPath);
				}

				var vFiles=xNyf.listFiles(sSsgPath, false);
				for(var i=0; i<vFiles.length; ++i){
					vSsgEntries.push(new CLocalFile(sSsgPath, vFiles[i]).toStr());
				}
			};

			var vSelItems=plugin.getSelectedInfoItems(), vAncestors=[];

			vSelItems.sort(); //2020.7.15 be sure to sort the ssg paths in ascending order, or it may not filter out of descendant items;

			for(var j=0; j<vSelItems.length; ++j){
				var s=vSelItems[j].replace(/[\\/]+/g, '/').replace(/[\\/]+$/, '') + '/'; //normalize the ssg path;
				for(var i=0; i<vAncestors.length; ++i){
					if(s.indexOf(vAncestors[i])===0){
						break; //an ancestor already listed;
					}
				}
				if(i===vAncestors.length){
					vAncestors.push(s);
				}
			}

			if(vAncestors.length>0){

				var _dest_dir=function(sAncestor, sSsgPath){
					var v=[];
					do{
						var sHint=xNyf.getFolderHint(sSsgPath);
						sHint=_validate_filename(sHint)||(Math.round(Math.random()*0xffffFFFF).toString(16));
						v.unshift(sHint);
						sSsgPath=new CLocalFile(sSsgPath).getParent()+'/';
					}while(sAncestor<=sSsgPath);
					return v.join('/');
				};

				var z=new CZip();
				if(z && z.create(sZipFn)){

					var sTmpFn=platform.getTempFile(); plugin.deferDeleteFile(sTmpFn);

					var nDone=0, vFail=[];
					for(var j=0; j<vAncestors.length; ++j){
						var sAncestor=vAncestors[j];

						vSsgEntries=[];
						xNyf.traverseOutline(sAncestor, true, _act_on_treeitem);

						for(var i=0; i<vSsgEntries.length; ++i){
							var xSsgFn=new CLocalFile(vSsgEntries[i]);
							var sSsgPath=xSsgFn.getDirectory(true), sSsgName=xSsgFn.getLeafName(), sExt=xSsgFn.getSuffix();
							var sDstDir=_dest_dir(sAncestor, sSsgPath);
							var sDefNote='__defnote';
							var xDstFn=new CLocalFile(sDstDir, plugin.isReservedNoteFn(sSsgName) ? (sDefNote + '.' + sExt) : sSsgName);
							if(xNyf.exportFile(xSsgFn.toStr(), sTmpFn)>=0){
								if(z.addEntry(sTmpFn, xDstFn.toStr())>=0){
									nDone++;
								}else{
									nFail++;
									loge('Failed to add zip entry: ' + xDstFn.toStr());
								}
							}else{
								vFail.push(xDstFn.toStr());
								loge('Failed to export file: ' + xSsgFn.toStr());
							}
						}
					}

					z.close();
					new CLocalFile(sTmpFn).remove();

					var vMsg=['%nDone% files exported to the zip archive.'.replace(/%nDone%/gi, nDone), '', sZipFn, ''];
					if(vFail.length>0) vMsg.push('But failed to export the following %nFail% files.'.replace(/%nFail%/gi, vFail.length), '', vFail.join('\n'));
					alert(vMsg.join('\n'));
				}
			}else{
				alert('No info items selected to export.');
			}

			plugin.destroyProgressBar();
		}

	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}

}catch(e){
	plugin.destroyProgressBar();
	alert(e);
}
