
//sValidation=nyfjs
//sCaption=Import MindMap items ...
//sHint=Import items from .mmap document
//sCategory=MainMenu.Capture
//sCondition=CURDB; DBRW; OUTLINE; CURINFOITEM
//sID=p.ImportMindMap
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

		if(!xNyf.isReadonly()){

			var sCfgKey = 'ImportMindMap.sSrcFn';

			var sSrcFn=platform.getOpenFileName(
				{ sTitle: plugin.getScriptTitle()
				, sInitDir: localStorage.getItem(sCfgKey)||''
				, sFilter: 'MindMap Documents (*.mmap);;All files (*.*)'
				});

			if(sSrcFn){

				localStorage.setItem(sCfgKey, new CLocalFile(sSrcFn).getDirectory(false));

				plugin.initProgressRange(plugin.getScriptTitle());

				var sCurItem=plugin.getCurInfoItem(-1), nDone=0;

				if(!sCurItem) sCurItem=plugin.getDefRootContainer();

				var _find_unique_id=function(sSsgPath){
					return xNyf.getChildEntry(sSsgPath, 0);
				};

				var z=new CZip();
				if(z.open(sSrcFn, true)){

					var _unzip_entry=function(sEntryName, sFnDst){
						var bSucc = z.extractEntry(sEntryName, sFnDst);
						/*var bSucc=false;
						var vLines=z.listEntries();
						for(var i in vLines){
							var v=vLines[i].split('\t');
							if(v && v.length>1){
								if(v[1]==sEntryName){
									var x=parseInt(v[0]);
									if(z.extractEntry(x, sFnDst)){
										bSucc=true;
									}
									break;
								}
							}
						}*/
						return bSucc;
					};

					var _load_xml_document=function(){
						var sEntryName='Document.xml', sXml='';
						var xTmpFn=new CLocalFile(platform.getTempFile()); plugin.deferDeleteFile(xTmpFn);
						if(_unzip_entry(sEntryName, xTmpFn.toStr())){
							sXml=xTmpFn.loadText('auto');
						}
						xTmpFn.remove();
						return sXml;
					};

					var _import_branch=function(sSsgPath, xElm){
						var sTitle='Untitled';
						var xTxt=xElm.getElementByTagName('ap:Text');
						if(xTxt){
							sTitle=xTxt.getAttrValue('PlainText');
						}

						plugin.ctrlProgressBar(sTitle);

						var xPathSub=new CLocalFile(sSsgPath); xPathSub.append(_find_unique_id(sSsgPath));

						if(xNyf.createFolder(xPathSub.toStr())){

							xNyf.setFolderHint(xPathSub.toStr(), sTitle);

							//2012.6.13 for item notes
							var xGrp=xElm.getElementByTagName('ap:NotesGroup');
							if(xGrp){
								var xDat=xGrp.getElementByTagName('ap:NotesXhtmlData');
								if(xDat){
									var sHtm=xDat.serialize()||''; sHtm=sHtm.replace(/src=\"mmnotes:\/\//i, 'src="');
									var xSsgFn=new CLocalFile(xPathSub.toStr()); xSsgFn.append('index.html');
									var nBytes=xNyf.createTextFile(xSsgFn.toStr(), sHtm);
									if(nBytes>0){
									}
								}

								//for linked images;
								var n=xGrp.getElementCount();
								for(var i=0; i<n; ++i){
									var xDat=xGrp.getElementByIndex(i);
									if(xDat.getTagName()==='ap:NotesData'){
										var sUri=xDat.getAttrValue('ImageUri')||''; sUri=sUri.replace(/^mmnotes:\/\//i, '');
										if(sUri){
											var xBin=xDat.getElementByTagName('cor:Uri');
											if(xBin){
												var sBin=xBin.getText()||''; sBin=sBin.replace(/^mmarch:\/\//i, '');
												if(sBin){
													var xTmpFn=new CLocalFile(platform.getTempFile()); plugin.deferDeleteFile(xTmpFn.toStr());
													if(_unzip_entry(sBin, xTmpFn.toStr())){
														var xSsgFn=new CLocalFile(xPathSub.toStr(), sUri);
														if(xNyf.createFile(xSsgFn.toStr(), xTmpFn.toStr())>0){
														}
													}
													xTmpFn.remove();
												}
											}
										}
									}
								}
							}

							var xSub=xElm.getElementByTagName('ap:SubTopics');
							if(xSub) _import_subitems(xPathSub.toStr(), xSub);
						}
					};

					var _import_subitems=function(sSsgPath, xElm){
						var nChild=xElm.getElementCount();
						for(var i=0; i<nChild; ++i){
							var xSub=xElm.getElementByIndex(i);
							if(xSub.getTagName()==='ap:Topic'){
								_import_branch(sSsgPath, xSub);
							}
						}
					};

					//var nDone=0;
					var sXml=_load_xml_document();
					if(sXml){
							var xml=new CXmlDocument();

							xml.initWith(sXml);

							var xElm=xml.getElement('ap:Map/ap:OneTopic');

							_import_subitems(sCurItem, xElm);

							//if(nDone>0)
							{
								plugin.refreshOutline(-1, sCurItem);
							}
					}else{
						var sMsg=_lc2('Fail.ParseDoc', 'Failed to parse the Mindmap document.');
						alert(sMsg+'\n\n'+sSrcFn);
					}

				}else{
					var sMsg=_lc2('Fail.LoadDoc', 'Failed to load the Mindmap document.');
					alert(sMsg+'\n\n'+sSrcFn);
				}

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
