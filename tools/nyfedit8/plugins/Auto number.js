﻿
//sValidation=nyfjs
//sCaption=Auto number ...
//sHint=Auto-number child items of the current info item
//sCategory=MainMenu.Organize; Context.Outline
//sCondition=CURDB; DBRW; OUTLINE; CURINFOITEM
//sID=p.AutoNumber
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

				var _detect_number=function(s){
					return s.match(/^\d+[.,)]\s*/);
				};

				var _clear_number=function(s){
					return s.replace(/^\d+[.,)]\s*/, '');
				};

				var sCurItem=plugin.getCurInfoItem(-1);
				if(sCurItem){

					var vNames=xNyf.listFolders(sCurItem), bHavingNumbers=false;
					for(var i in vNames){
						var xSub=new CLocalFile(sCurItem, vNames[i]);
						var sHint=xNyf.getFolderHint(xSub.toStr());
						if(_detect_number(sHint)){
							bHavingNumbers=true;
							break;
						}
					}

					var vRes=[], sMsg;
					if(bHavingNumbers){
						sMsg=_lc2('Clear', 'Clearing numbers (if any) for the child items (as below); Proceed?');
						sMsg+='\n';
						for(var i in vNames){
							var xSub=new CLocalFile(sCurItem, vNames[i]);
							var sHint=xNyf.getFolderHint(xSub.toStr());
							var sNew=_clear_number(sHint);
							vRes[vRes.length]={sPath: xSub.toStr(), sHint: sNew};
						}
					}else{
						sMsg=_lc2('Add', 'Auto-numbering the child items (as below); Proceed?');
						sMsg+='\n';
						for(var i in vNames){
							var xSub=new CLocalFile(sCurItem, vNames[i]);
							var sHint=xNyf.getFolderHint(xSub.toStr());
							var sNew=_clear_number(sHint);
							sNew=''+(parseInt(i)+1)+'.  '+(sNew||'....');
							vRes[vRes.length]={sPath: xSub.toStr(), sHint: sNew};
						}
					}

					if(vRes.length>0){
						var nMax=36, nTmp=0;
						for(var i in vRes){
							var sHint=vRes[i].sHint;
							if(sHint.length>nMax) sHint=sHint.substr(0, nMax)+' ...';
							sMsg+='\n';
							sMsg+=sHint;
							nTmp++;
							if(nTmp>=24){
								sMsg+='\n... ...';
								break;
							}
						}
						
						if(confirm(sMsg)){

							var nDone=0;

							for(var i in vRes){
								if(xNyf.setFolderHint(vRes[i].sPath, vRes[i].sHint)){
									nDone++;
								}
							}

							if(nDone>0){
								plugin.refreshOutline(-1, sCurItem);
							}
						}
					}else{
						alert(_lc('Prompt.Warn.NoChildInfoItems', 'No child info items available to operate.'));
					}

				}else{
					alert(_lc('Prompt.Warn.NoInfoItemSelected', 'No info item is currently selected.'));
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
