
//sValidation=nyfjs
//sCaption=Copy tree icon ...
//sHint=Copy the current tree icon to all child items
//sCategory=MainMenu.Tools; Context.Outline
//sID=p.CopyTreeIcon
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

		if(!xNyf.isReadonly()){

			if(plugin.getCurNavigationTab()=='Outline'){

				var sCurItem=plugin.getCurInfoItem(-1);
				if(sCurItem){

					if(confirm(_lc2('Confirm', 'Copying the current tree icon to all its child items. Proceed?'))){

						var sItemTitle=xNyf.getFolderHint(sCurItem)||'untitled';

						var iIcon0=xNyf.getInfoItemIcon(sCurItem);

						var nDone=0;
						var _act_on_treeitem=function(sSsgPath, iLevel){
							var n=xNyf.getInfoItemIcon(sSsgPath);
							if(n!=iIcon0){
								xNyf.setInfoItemIcon(sSsgPath, iIcon0);
							}
						};

						var bCurBranch=false;
						xNyf.traverseOutline(sCurItem, bCurBranch, _act_on_treeitem);

						plugin.refreshOutline(-1, sCurItem);

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
}catch(e){
	alert(e);
}
