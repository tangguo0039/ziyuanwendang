
//sValidation=nyfjs
//sCaption=List all related items
//sHint=List out all info items associated with the current one
//sCategory=MainMenu.Search
//sID=p.ListAllRelated
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

		if(plugin.getCurNavigationTab()=='Outline'){

			var sCurItem=plugin.getCurInfoItem();
			if(sCurItem){

				var vRelated=[];

				var _add=function(s){
					var bAdded=false;
					if(s && s!=sCurItem && vRelated.indexOf(s)<0){
						vRelated[vRelated.length]=s;
						bAdded=true;
					}
					return bAdded;
				};
				var _list_related=function(sSsgPath){
					var v=xNyf.listRelated(sSsgPath);
					if(v){
						var v2=[];
						for(var i in v){
							var s=v[i];
							if(_add(s)){
								v2[v2.length]=s;
							}
						}
						for(var i in v2){
							_list_related(v2[i]);
						}
					}
				};

				_list_related(sCurItem);

				if(vRelated.length>0){
					vRelated[vRelated.length]=sCurItem;
				}

				plugin.showResultsPane(true, true);
				plugin.setResultsPaneTitle(plugin.getScriptTitle());

				var nFound=0;
				for(var i in vRelated){
					var s=vRelated[i];
					plugin.appendToResults(xNyf.getDbFile(), s, '', '');
					nFound++;
				}

				plugin.setResultsPaneTitle(plugin.getScriptTitle() + ';  '+_lc('p.Common.Found', 'Found: (%nFound%)').replace(/%nFound%/g, ''+nFound));

			}else{
				alert(_lc('Prompt.Warn.NoInfoItemSelected', 'No info item is currently selected.'));
			}

		}else{
			alert(_lc('Prompt.Warn.OutlineNotSelected', 'The outline tree view is currently not selected.'));
		}

	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}
}catch(e){
	alert(e);
}
