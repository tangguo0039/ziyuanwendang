
//sValidation=nyfjs
//sCaption=Insert quick text ...
//sHint=Insert quick text into current content
//sCategory=MainMenu.Insert
//sCondition=CURDB; DBRW; CURINFOITEM; EDITING;
//sID=p.Ins.QuickText
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


//11:34 6/10/2015
//Plugin/Insert quick text:
//Quick text is customizable, simply save quick text as *.q.txt files in either the program's install folder, 
//or the script's folder './plugins', or the current database's folder, and or the special sub folder './quicktext' under the program's folder;

//For end-users to define a keyboard shortcut to this function, select 'View - Options - Keyboard', 
//find the 'Quick text' item in the list, and then press a shortcut key for the item.


var _lc=function(sTag, sDef){return plugin.getLocaleMsg(sTag, sDef);};
var _lc2=function(sTag, sDef){return _lc(plugin.getLocaleID()+'.'+sTag, sDef);};

//try{
	var xNyf=new CNyfDb(-1);

	if(xNyf.isOpen()){

		if(!xNyf.isReadonly()){

			if(plugin.isContentEditable()){

				var vDisp=[], t='~!@#$%^&*-+_=|:<>?\\/';
				for(var i=0; i<t.length; ++i){
					var n=40, s=''; while(n-- > 0) s+=t[i];
					vDisp.push(s);
				}

				var nStart=vDisp.length;

				var xRE, sEditor=plugin.getCurEditorType().toLowerCase();
				if(sEditor==="htmledit" || sEditor==="richedit"){
					xRE=/^(.+)(\.q\.txt|\.q\.html)$/i;
				}else if(sEditor==="plainedit"){
					xRE=/^(.+)(\.q\.txt)$/i;
				}

				if(xRE){
					var vDirs=[];
					{
						vDirs.push(platform.getHomePath());
						vDirs.push(plugin.getAppWorkingDir());
						vDirs.push(plugin.getAppWorkingDir()+'/quicktext');
						vDirs.push(new CLocalFile(plugin.getScriptFile()).getDirectory());
						vDirs.push(new CLocalFile(xNyf.getDbFile()).getDirectory());
					}

					var vFiles=[];
					for(var j in vDirs){
						var xDir=new CLocalDir(vDirs[j]);
						if(xDir.exists()){
							var v=xDir.listFiles('*.q.*', 'NoDot, NoDotDot', 'Name');
							for(var i in v){
								var xFn=new CLocalFile(xDir.toStr(), v[i]);
								var sName=xFn.getLeafName();
								if(sName){
									if(sName.search(xRE)===0){
										var sFmt=''; if(sName.search(/\.html$/i)>0) sFmt=" (HTML)";
										sTitle = sName.replace(xRE, '$1') + ' ('+xDir.toStr()+')';
										vDisp.push(sTitle + sFmt);
										vFiles.push(xFn.toStr());
									}
								}
							}
						}
					}

					var sDir=new CLocalFile(plugin.getScriptFile()).getDirectory();

					var sCfgKey1='InsQuickText.iSel';
					var sDescr=_lc2('Descr', 'Quick text list (Customizable by saving text as .q.txt or .q.html files in either program or database folder)');
					var vFields = [
								{sField: 'combolist', sLabel: sDescr, vItems: vDisp, sInit: localStorage.getItem(sCfgKey1)||''}
							];

					var vRes=input(plugin.getScriptTitle(), vFields, {nMinSize: 500, vMargins: [8, 0, 50, 0], bVert: true});

					if(vRes && vRes.length===1){

						var iSel=vRes[0];

						localStorage.setItem(sCfgKey1, iSel);

						var sTxt, bHtml=false;
						if(iSel<nStart){
							sTxt=vDisp[iSel];
						}else{
							var sFn=vFiles[iSel-nStart]; if(sFn.search(/\.html$/i)>0) bHtml=true;
							var xFn=new CLocalFile(sFn);
							sTxt=xFn.loadText('auto');

							//2018.4.11 Certain text editors (e.g. vi on Mac) always append a '\n' at end of file;
							if(!bHtml){
								sTxt=sTxt.replace(/(\r\n|\n)$/, '');
							}
						}

						if(sTxt){
							plugin.replaceSelectedText(-1, sTxt, bHtml);
						}
					}
				}

			}else{
				alert(_lc('Prompt.Warn.ReadonlyContent', 'Cannot modify the content opened as Readonly.'));
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
