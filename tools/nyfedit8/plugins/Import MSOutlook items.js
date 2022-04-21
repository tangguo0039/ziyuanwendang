
//sValidation=nyfjs
//sCaption=Import MS-Outlook items ...
//sHint=Import selected items from Microsoft Outlook via OLE-Automation
//sCategory=MainMenu.Capture
//sCondition=CURDB; DBRW; OUTLINE; CURINFOITEM
//sPlatform=Windows
//sID=p.ImportOutlookItems
//sPlatform=Windows
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

			var sCurItem=plugin.getCurInfoItem()||plugin.getDefRootContainer();
			if(sCurItem){

				{
					//2016.4.14 invoke the common functions predefined for plugins;
					var xFn=new CLocalFile(new CLocalFile(plugin.getScriptFile()).getDirectory(false), 'comutils.js');
					if(!xFn.exists()){
						var sTmp=xFn.toStr().replace(/([\/\\]plugins)(_win32)([\/\\].+$)/i, function(s0, s1, s2, s3){return s1+s3;});
						xFn=new CLocalFile(sTmp);
					}
					include(xFn.toStr());
				}

				var _find_unique_id=function(sSsgPath){
					return xNyf.getChildEntry(sSsgPath, 0);
				};

				var _remove_base_tag=function(s){
					return (s||'').replace(/<base[\s\r\n]+.+?>/igm, ''); //2013.11.14 remove all <BASE ...> tags;
				};

				var sTmpDir=platform.getTempFolder(), sTmpName='__nyf7_import_msoutlook_items';
				var xTmpFn=new CLocalFile(sTmpDir, sTmpName+'.html'); if(plugin.deferDeleteFile) plugin.deferDeleteFile(xTmpFn.toStr()); else platform.deferDeleteFile(xTmpFn.toStr());

//var _vLog=[];
				var _clean_up=function(){

					if(xTmpFn.exists()){
						xTmpFn.remove();
					}

					var xImgDir=new CLocalDir(sTmpDir, sTmpName+'_files');
					if(!xImgDir.exists()){
						xImgDir=new CLocalDir(sTmpDir, sTmpName+'.files');
					}
					if(xImgDir.exists()){
						var vFiles=xImgDir.listFiles();
						for(var i in vFiles){
							var xFn=new CLocalFile(xImgDir.toStr(), vFiles[i]);
							xFn.remove();
						}
						xImgDir.remove();
					}
				}

				var _import_selection=function(xSel){
					var nDone=0, nSel=xSel.getCount();
					var olTxt=0, olHTML=5; //Outlook constants;
					for(var j=0; j<nSel; ++j){
						var xItem=xSel.getItem(j+1);
						if(xItem){
							var sSubject=xItem.getSubject();
//if(_vLog.length>0) _vLog.push('===========================');
//_vLog.push('Msg['+j+']='+sSubject);

							var bContinue=plugin.ctrlProgressBar(sSubject || '***', 1, true);
							if(!bContinue) break;

							_clean_up();

							var xChild=new CLocalFile(sCurItem, _find_unique_id(sCurItem));
							if(xNyf.createFolder(xChild.toStr())){

								xNyf.setFolderHint(xChild.toStr(), sSubject); nDone++;

								var vEmbed=[];
								{
									xItem.saveAs(xTmpFn.toStr(), olHTML);
									if(xTmpFn.exists()){
										var sHtml=xTmpFn.loadText('html'), x=0;
										if(1){
//_vLog.push('----------------ACC------------------- sHtml Size= ' + sHtml.length);
											//var xAccDir=new CLocalDir(platform.getTempFolder(), sTmpName+'_files');
											//var vFiles=xAccDir.listFiles();
											//for(var i in vFiles){
											//	var xFn=new CLocalFile(xAccDir.toStr(), vFiles[i]);
//_vLog.push('Acc['+(i)+']='+vFiles[i]+', nSize='+xFn.getFileSize());
											//}
//_vLog.push('----------------SRC-------------------');
											var sNew=importAccompanyingObjsWithinHtml(xNyf, xChild.toStr(), _remove_base_tag(sHtml), xTmpFn.getDirectory(false), null, function(sObj, sTagName, sUriRes, nBytes){
												var u=sUriRes||'';
												//2016.5.12 the o:href='cid:...' stands for files in attachments area of messages;
												if(u.search(/^cid:image\d{3}.(png|gif|jpg|jpeg|png|svg)@[\w\.\-]+$/i)===0){
													//<v:imagedata src="image001.png" o:href="cid:image001.png@01D1A6F1.7A76F300"/>
													//<img width=974 height=883 src="image001.png" v:shapes="Picture_x0020_3">
													//<img width=808 height=517 src="image002.jpg" alt="cid:image008.png@01D1A137.70036940" v:shapes="Picture_x0020_7">
													u=u.replace(/^cid:(image\d{3}\.)(png|gif|jpg|jpeg|png|svg)@[\w\.\-]+$/i, '$1$2');
													if(u) vEmbed.push(u);
												}else if(u.search(/^cid:\d+@[\w\.\-]+$/i)===0){
													//2016.5.6 for back-compatibility with old version of outlook 2000;
													//<IMG src="cid:687392502@12112013-049d">
													//<IMG src="cid:687392502@12112013-04a4">
													u=u.replace(/^cid:(\d+)@([\w\.\-]+$)/i, '$1-$2.bmp');
													if(u) vEmbed.push(u);
												}
//_vLog.push('Src['+(x++)+']='+sObj+' => '+u);
												return u;
											});
											if(sNew!==sHtml){
												sNew=changeHtmlCharset(sNew, 'UTF-8');
												xTmpFn.saveUtf8(sNew);
											}
										}else{
											var xAccDir=new CLocalDir(platform.getTempFolder(), sTmpName+'_files');
											var vFiles=xAccDir.listFiles();
											for(var i=0; i<vFiles.length; ++i){
												var xFn=new CLocalFile(xAccDir.toStr(), vFiles[i]);
												var xSsg=new CLocalFile(xChild.toStr(), vFiles[i]);
												xNyf.createFile(xSsg.toStr(), xFn.toStr());
//_vLog.push('Acc['+(i)+']='+vFiles[i]+', nSize='+xFn.getFileSize());
											}
										}
									}else{
										xItem.saveAs(xTmpFn.toStr(), olTxt);
										if(xTmpFn.exists()){
											var sTxt=xTmpFn.loadText('bom').replace(/\r\n/g, '/n').replace(/\r/g, '/n');
											var vLines=sTxt.split('\n'), sHtml='';
											for(var k=0; k<vLines.length; ++k){
												var sLine=_trim(vLines[k]);
												if(sLine){
													sLine=platform.htmlEncode(vLines[k]);
												}else{
													sLine='<br />';
												}
												if(sHtml) sHtml+='\n';
												sHtml+='<div style="line-height: 1.3em;">'+sLine+'</div>';
											}
											sHtml='<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">'
													+ '<html xmlns="http://www.w3.org/1999/xhtml">'
													+ '<head>'
													+ '<style>\n'
													+ 'body, table{font-family: Tahoma, Verdana}\n'
													//+ 'div{line-height: 1.5em;}\n' //2015.6.23 this may cause confusion to HTML editings;
													+ '</style>'
													+ '</head>'
													+ '<body>'
													+ sHtml
													+ '</body></html>'
											;
											xTmpFn.saveUtf8(sHtml);
										}
									}
								}
							}

							if(xTmpFn.exists()){

								var xSsgFn=new CLocalFile(xChild.toStr(), plugin.getDefNoteFn('html'));
								var nBytes=xNyf.createFile(xSsgFn.toStr(), xTmpFn.toStr());
								if(nBytes>0){
									//try to import attachments if any;
									var xFiles;
									try{
										xFiles=xItem.getAttachments();
									}catch(e){
									}
//_vLog.push('----------------ATT-------------------');
									if(xFiles){
										var nFiles=xFiles.getCount();
										for(var i=0; i<nFiles; ++i){

											var xFile=xFiles.getItem(i+1);
											var sLeaf=xFile ? xFile.getFileName() : '';

											//2013.11.12 embedded images may always return the 'Outlook.bmp' tag;
											if(!sLeaf || sLeaf==='Outlook.bmp'){
												if(i<vEmbed.length){
													sLeaf=vEmbed[i];
												}else{
													sLeaf='Outlook_'+i+'.bmp';
												}
											}

											if(xFile && sLeaf){

												_clean_up(); //safer to clear temp files at first;

												//Seemed that in addition to the specified xTmpFn, MS-Outlook also produces 'attachment.xxx' or for embedded 'Outlook?.bmp' in TEMP folder and auto-removes it at exit;
												xFile.saveAsFile(xTmpFn.toStr());
//_vLog.push('Att['+i+']='+sLeaf+', nSize='+xTmpFn.getFileSize());

												if(xTmpFn.exists()){
													xSsgFn=new CLocalFile(xChild.toStr(), sLeaf);
													if(!xNyf.fileExists(xSsgFn.toStr())){ //|| xNyf.getFileSize(xSsgFn.toStr())!=xTmpFn.getFileSize()
														sLeaf=getUniqueSsgFileName(xNyf, xChild.toStr(), sLeaf);
														if(sLeaf){
															xSsgFn=new CLocalFile(xChild.toStr(), sLeaf);
															xNyf.createFile(xSsgFn.toStr(), xTmpFn.toStr());
														}
													}
												}
											}

										}
									}

								}
							}
						}
					}
//textbox(
//	{
//		sTitle: plugin.getScriptTitle()
//		, sDescr: 'Debug info'
//		, sDefTxt: _vLog.join('\n')
//		, bReadonly: true
//		, bWordwrap: false
//		, nWidth: 50
//		, nHeight: 50
//		, bFind: false
//	}
//);
					return nDone;
				};

				plugin.initProgressRange(plugin.getScriptTitle());

				var xMsol=new CAppOutlook(), bSucc=false;
				if(xMsol && xMsol.init()){

					var bQuit=false;

					try{
						var ns=xMsol.getNameSpace('MAPI');
						ns.logon('', '', true);

						var xExp;
						try{
							xExp=xMsol.getActiveExplorer();
						}catch(e){
							bQuit=true;
						}

						if(xExp){

							var xSel;
							try{
								xSel=xExp.getSelection();
							}catch(e){
							}

							if(xSel){

								var nSel=xSel.getCount(), nDone=0;

								if(nSel>0){

									plugin.initProgressRange(plugin.getScriptTitle(), nSel);

									var sMsg='', nDisp=0, nMaxDisp=20;
									for(var j=0; j<nSel; ++j){
										var xItem=xSel.getItem(j+1);
										if(xItem){
											var sSubject=xItem.getSubject()||'Untitled';
											if(sMsg) sMsg+='\n';
											sMsg+=''+(++nDisp)+'. ';
											if(nDisp<=nMaxDisp){
												sMsg+=sSubject;
											}else{
												sMsg+='... ...';
												break;
											}
										}
									}

									if(sMsg){

										sMsg=_lc2('Confirm', 'Importing the selected item(s) from Microsoft Outlook; Proceed?')+'\n\n'+sMsg;
										if(confirm(sMsg)){

											var nDone=_import_selection(xSel);
											if(nDone>0){
												plugin.refreshOutline(-1, sCurItem);
											}

											_clean_up(); //remove temp files;

											sMsg=_lc2('Done', '%nDone% item(s) successfully imported.');
											sMsg=sMsg.replace(/%nDone%/gi, ''+nDone);
											alert(sMsg);
										}

										bSucc=true;
									}
								}
							}
						}

						ns.logoff();

					}catch(e){
						alert(e);
					}
				}

				if(bQuit && xMsol && xMsol.quit) xMsol.quit();

				if(!bSucc){
					var sMsg=_lc2('Notes', 'Failed to import items from Microsoft Outlook.\n\nIn order to import items from Microsoft Outlook, please be sure first to launch Microsoft Outlook and select one or more items to import.\n\nNote that with certain old versions of Microsoft Outlook on Windows 7+, you may need to re-launch Mybase as administrator for rights performing Inter-Process Communication via OLE.');
					alert(sMsg);
				}

			}else{
				alert(_lc('Prompt.Warn.NoInfoItemSelected', 'No info item is currently selected.'));
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
