
//sValidation=nyfjs
//sCaption=Capture webpages with Webcollect
//sHint=Capture webpages from within Chrome/Firefox and save as info items within Mybase
//sCategory=
//sCondition=CURDB; DBRW; CURINFOITEM
//sID=p.CaptureWebpages
//sAppVerMin=8.0
//sAuthor=wjjsoft

/////////////////////////////////////////////////////////////////////
// Extension scripts for Mybase Desktop v8.x
// Copyright 2010-2021 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////

var _lc=function(sTag, sDef){return plugin.getLocaleMsg(sTag, sDef);};
var _lc2=function(sTag, sDef){return _lc(plugin.getLocaleID()+'.'+sTag, sDef);};

var _trim=function(s){return (s||'').replace(/^\s+|\s+$/g, '');};
var _trim_cr=function(s){return (s||'').replace(/\r+$/g, '');};

var _percentDecode=function(s){
	var v=new CByteArray(s.replace(/([0-9a-f]{2})/gi, '%$1'), 'utf-8');
	return v.percentDecoded();
}

//try{
	var xNyf=new CNyfDb(-1);
	if(xNyf.isOpen()){

		if(!xNyf.isReadonly()){

			var sCurItem=plugin.getCurInfoItem();
			var sOs=platform.getOsType();
			var bLinux=sOs.search(/linux/i)>=0, bMac=sOs.search(/mac/i)>=0, bWin=sOs.search(/win/i)>=0;
			var bLinux32=bLinux && sOs.search(/i386/i)>0, bLinux64=bLinux && sOs.search(/amd64/i)>0;

			var sDir=plugin.argument();

			//if(!sDir){
			//	if(plugin.getWebcollectCacheDir){
			//		sDir=plugin.getWebcollectCacheDir(false);
			//	}else{
			//		sDir=platform.getHomePath();
			//		if(bWin) sDir+='/Documents/webcollect';
			//		else sDir+='/.webcollect';
			//	}
			//}

			if(sDir){

				log('Webcollect: ' + sDir);

				var _parse_keyvals=function(sLines){
					var vLines=sLines.split('\n'), xRes={};
					for(var i in vLines){
						var sLine=_trim(vLines[i]);
						var p=sLine.indexOf('=');
						if(p>0){
							var k=_trim(sLine.substring(0, p));
							var v=sLine.substring(p+1);
							if(k && v){
								xRes[k]=v;
							}
						}
					}
					return xRes;
				};

				var xFn0=new CLocalFile(sDir, '__wjjsoft_webcollect.ready'), nDone=0, sParentItem=sCurItem, sItemToOpen;
				if(xFn0.exists()){

					//2016.9.8 with a 400msec delay for the '*.ready' file to finish writing whole contents,
					//as the filesystem watcher immediately emits events just on file-creation/opening, rather than on file-closing;
					sleep(400);

					beep(); //comment out this line if annoying;

					var tMod0=xFn0.getModifyTime();
					var sLines=xFn0.loadText('auto'); xFn0.remove(); //2016.10.20 Removing files causes re-entering of this script;
					var xKV=_parse_keyvals(sLines);

					var nFiles=parseInt(xKV['Fn.Count']);
					if(nFiles>0){

						//2016.9.10 test and see if or not to save as child items;
						var bSub=((xKV['Sub']||xKV['Child']||'').search(/^(true|yes|ok|1)/i)>=0);
						if(sCurItem){
							if(bSub){
								sParentItem=sCurItem;
							}else{
								sParentItem=new CLocalFile(sCurItem).getParent();
							}
						}else{
							sParentItem=sCurItem=plugin.getDefRootContainer();
						}

						var sNewItem=new CLocalFile(sParentItem, xNyf.getChildEntry(sCurItem)).toStr();
						if(xNyf.createFolder(sNewItem)){

							var sTitle=xKV['Title[0]'];
							if(sTitle) xNyf.setFolderHint(sNewItem, sTitle);

							for(var i=0; i<nFiles; ++i){

								var k='Fn['+i+']';
								var sName=_trim(xKV[k]); if(!sName) continue;

								log('Webcollect: ' + sName);

								if(sName.search(/^__wjjsoft_webcollect_chrome_[0-9a-f]{8}.json$/i)>=0){

									//2016.9.8 json from google chrome;
									var xFnJson=new CLocalFile(sDir, sName);
									if(xFnJson.exists() && tMod0 >= xFnJson.getModifyTime()){
										var sJson=xFnJson.loadText('utf-8'); xFnJson.remove();
										if(sJson){
											sJson="var xObj=%JSON%;".replace(/%JSON%/, sJson);
											eval.call(null, sJson);
											if(xObj && xObj.sTitle){
												var sTitle=xObj.sTitle, vObjs=xObj.vFiles;
												if(sTitle.length>128) sTitle=sTitle.substr(0, 128);
												if(xNyf.setFolderHint(sNewItem, sTitle)){
													for(var i in vObjs){
														var o=vObjs[i];
														if(o && o.sFn && o.sData){
															var xSsgFn=new CLocalFile(sNewItem, o.sFn);
															if(o.bEncoded){
																var vBin=_percentDecode(o.sData);
																if(vBin){
																	var nBytes=xNyf.saveBytes(xSsgFn.toStr(), vBin, true);
																	if(nBytes>0) nDone++;
																}
															}else{
																var sHtml=o.sData.replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\\\/g, '\\');
																if(sHtml){
																	var nBytes=xNyf.saveUtf8(xSsgFn.toStr(), sHtml, true, true);
																	if(nBytes>0) nDone++;
																}
															}
														}
													}
													//break;
												}
											}
										}
									}

								}else if(sName.search(/[^\\\/?*]+\.(html|htm|xml|css|png|jpg|gif|bmp|tif|tiff|svg|swf|avi|mp3)$/i)>=0){

									//2016.9.8 html/css/img files from mozilla firefox;
									var xSsgFn=new CLocalFile(sNewItem, sName);
									var xDskFn=new CLocalFile(sDir, sName);
									if(xDskFn.exists()){
										var nBytes=xNyf.createFile(xSsgFn.toStr(), xDskFn.toStr(), true); xDskFn.remove();
										if(nBytes>0){
											nDone++;
										}
									}

								}
							}

							sItemToOpen=sNewItem;
						}
					}
				}

				if(nDone>0){
					plugin.refreshOutline(-1, sParentItem);
					if(sItemToOpen && plugin.openInfoItem){
						plugin.openInfoItem(-1, sItemToOpen, '', true);
					}
				}

				log('Webcollect: ' + sDir + ' [Done:' + nDone + ']');

			}else{
				alert('Path to Webcollect cache folder not supplied.');
			}

		}else{
			alert(_lc('Prompt.Warn.ReadonlyDb', 'Cannot modify the database opened as Readonly.'));
		}

	}else{
		//alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}

//}catch(e){
//	alert(e);
//}
