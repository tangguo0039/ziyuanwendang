
//sValidation=nyfjs
//sCaption=List all related items
//sHint=List out all info items associated with the current one
//sCategory=MainMenu.Search
//sCondition=CURDB; CURINFOITEM; OUTLINE
//sID=p.ListAllRelated
//sAppVerMin=8.0
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

		if(plugin.getCurNavigationTab()==='Outline'){

			var sCurItem=plugin.getCurInfoItem();
			if(sCurItem){

				var vRelated=[];
				var _add=function(s){
					var bAdded=false;
					if(s && s!==sCurItem && vRelated.indexOf(s)<0){
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
				plugin.beginUpdateResultsList(plugin.getScriptTitle() + ' [' + (xNyf.getFolderHint(sCurItem)||'New item ...') + ']', true);

				var nFound=0;
				for(var i in vRelated){
					var s=vRelated[i];
					plugin.appendToResults(xNyf.getDbFile(), s, '', '');
					nFound++;
				}

				plugin.endUpdateResultsList('', true);

			}else{
				alert(_lc('Prompt.Warn.NoInfoItemSelected', 'No info item is currently selected.'));
			}

		}else{
			alert(_lc('Prompt.Warn.OutlineNotSelected', 'The outline tree view is currently not selected.'));
		}

	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}

//}catch(e){
//	alert(e);
//}
