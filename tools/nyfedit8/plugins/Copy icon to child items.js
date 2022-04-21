
//sValidation=nyfjs
//sCaption=Copy icon to child items ...
//sHint=Copy the current tree icon to all its child items
//sCategory=MainMenu.Organize; Context.Outline
//sCondition=CURDB; DBRW; OUTLINE; CURINFOITEM
//sID=p.CopyTreeIcon
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

			if(plugin.getCurNavigationTab()==='Outline'){

				var sCurItem=plugin.getCurInfoItem(-1);
				if(sCurItem){

					if(confirm(_lc2('Confirm', 'Applying the current tree icon to all its child items; Proceed?'))){

						var sItemTitle=xNyf.getFolderHint(sCurItem)||'untitled';

						var iIcon0=xNyf.getInfoItemIcon(sCurItem);

						var nDone=0;
						var _act_on_treeitem=function(sSsgPath, iLevel){
							var n=xNyf.getInfoItemIcon(sSsgPath);
							if(n!==iIcon0){
								xNyf.setInfoItemIcon(sSsgPath, iIcon0);
							}
						};

						var bCurBranch=false;
						xNyf.traverseOutline(sCurItem, bCurBranch, _act_on_treeitem);

						plugin.refreshOutline(-1);

					}
				}else{
					alert('No info item currently selected.');
				}
			}else{
				alert(_lc('Prompt.Warn.OutlineNotSelected', 'The outline tree view is currently not selected.'));
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
