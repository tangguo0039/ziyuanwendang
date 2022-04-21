
//sValidation=nyfjs
//sCaption=Duplicate info item
//sHint=Make a copy of the current info item (including child items)
//sCategory=MainMenu.Organize; Context.Outline
//sCondition=CURDB; DBRW; CURINFOITEM; OUTLINE
//sID=p.DuplicateItem
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

try{
	var xNyf=new CNyfDb(-1);
	if(xNyf.isOpen()){

		if(!xNyf.isReadonly()){

			var sCurItem=plugin.getCurInfoItem(-1);
			if(sCurItem && plugin.getCurNavigationTab()==='Outline'){

				plugin.initProgressRange(plugin.getScriptTitle());

				var _copy_entry_attr=function(xDbSrc, xDbDst, sPathSrc, sPathDst){
					xDbDst.setFolderHint(sPathDst, xDbSrc.getFolderHint(sPathSrc));
					xDbDst.setEntryAttr(sPathDst, xDbSrc.getEntryAttr(sPathSrc));
					xDbDst.setEntryAppAttr(sPathDst, xDbSrc.getEntryAppAttr(sPathSrc));

					var n=xDbSrc.getEntryAppDataCount(sPathSrc);
					for(var i=0; i<n; ++i){
						var x=xDbSrc.getEntryAppDataAt(sPathSrc, i, -1);
						xDbDst.setEntryAppDataAt(sPathDst, i, x);
					}

					//xDbDst.setCreateTime(sPathDst, xDbSrc.getCreateTime(sPathSrc));
					xDbDst.setModifyTime(sPathDst, xDbSrc.getModifyTime(sPathSrc));
				};

				var _copy_files=function(xDbSrc, xDbDst, sPathSrc, sPathDst){
					var v=xDbSrc.listFiles(sPathSrc, false);
					for(var i in v){
						var sSsgName=v[i];
						var xFnSrc=new CLocalFile(sPathSrc, sSsgName);
						var xFnDst=new CLocalFile(sPathDst, sSsgName);

						var sMsg=sSsgName;
						if(plugin.isReservedNoteFn(sSsgName)){
							sMsg=xDbSrc.getFolderHint(sPathSrc)||'....';
						}
						var bContinue=plugin.ctrlProgressBar(sMsg, 1, true);
						if(!bContinue) throw 'User abort by Esc.';

						var sTmpFn=platform.getTempFile(); plugin.deferDeleteFile(sTmpFn);
						if(xNyf.exportFile(xFnSrc.toStr(), sTmpFn)>=0){
							if(xDbDst.createFile(xFnDst.toStr(), sTmpFn)>=0){
								_copy_entry_attr(xDbSrc, xDbDst, xFnSrc.toStr(), xFnDst.toStr());
							}
						}
						var xTmpFn=new CLocalFile(sTmpFn); xTmpFn.remove();
					}
				};

				var _copy_branch=function(xDbSrc, xDbDst, sPathSrc, sPathDst){
					var sNewName=xDbDst.getChildEntry(sPathDst, 0);
					if(sNewName){
						var xSub=new CLocalFile(sPathDst, sNewName);
						if(xDbDst.createFolder(xSub.toStr())){
							_copy_entry_attr(xDbSrc, xDbDst, sPathSrc, xSub.toStr());
							_copy_files(xDbSrc, xDbDst, sPathSrc, xSub.toStr());
							_copy_children(xDbSrc, xDbDst, sPathSrc, xSub.toStr());
							return xSub.toStr();
						}
					}
				};

				var _copy_children=function(xDbSrc, xDbDst, sPathSrc, sPathDst){
					var v=xDbSrc.listFolders(sPathSrc);
					for(var i in v){
						var xSub=new CLocalFile(sPathSrc, v[i]);
						_copy_branch(xDbSrc, xDbDst, xSub.toStr(), sPathDst);
					}
				};

				//var _act_on_treeitem=function(sSsgPath, iLevel){};
				//xNyf.traverseOutline(sCurItem, true, _act_on_treeitem);

				try{
					var sParent=new CLocalFile(sCurItem).getParent();
					var sPathNew=_copy_branch(xNyf, xNyf, sCurItem, sParent);
					if(sPathNew){
						var iPos=xNyf.getEntryPos(sCurItem);
						if(iPos>=0){
							xNyf.setEntryPos(sPathNew, iPos+1);

							var sTitle=xNyf.getFolderHint(sCurItem);
							if(sTitle){
								xNyf.setFolderHint(sPathNew, sTitle+' - '+_lc2('Copy', 'Copy'));
							}
						}
					}
				}catch(e){
					alert(e);
				}

				plugin.refreshOutline(-1, sParent);

			}else{
				alert(_lc('Prompt.Warn.OutlineNotSelected', 'The outline tree view is currently not selected.'));
			}

		}else{
			alert(_lc('Prompt.Warn.ReadonlyDb', 'Cannot modify the database opened as Readonly.'));
		}

	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}

}catch(e){
	plugin.destroyProgressBar();
	alert(e);
}
