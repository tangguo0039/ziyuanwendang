
//sValidation=nyfjs
//sCaption=Install Webcollect host for Google Chrome
//sHint=Install Webcollect host for Mybase to capture webpages from Google Chrome
//sCategory=MainMenu.Tools
//sCondition=
//sID=p.InstWebcHostChrome
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

//try{
	var sOs=platform.getOsType();
	var bLinux=sOs.search(/linux/i)>=0, bMac=sOs.search(/mac/i)>=0, bWin=sOs.search(/win/i)>=0;
	var bWin32=sOs.search(/win32/i)>=0, bWin64=sOs.search(/win64/i)>=0;
	var bLinux32=bLinux && sOs.search(/i386/i)>0, bLinux64=bLinux && sOs.search(/amd64/i)>0;

	var sDirHome=platform.getHomePath();
	var sDirPlugins=new CLocalFile(plugin.getScriptFile()).getParent();

	var sNameHost;
	{
		if(bLinux32){
			sNameHost='webcollect_host_linux386.run';
		}else if(bLinux64){
			sNameHost='webcollect_host_linux64.run';
		}else if(bMac){
			sNameHost='webcollect_host_mac.run';
		}else if(bWin64){
			sNameHost='webcollect_host_win64.exe';
		}else if(bWin32){
			sNameHost='webcollect_host_win32.exe';
		}
	}

	if(sNameHost){

		var xFnHost=new CLocalFile(sDirPlugins, sNameHost);
		if(xFnHost.exists()){

			if(plugin.watchWebcollectCacheDir(true)){

				var sIdOfExtension='oelfkekhpcninmpedocgakolepcflfko'; //constant ID of v2.0.0.0 manifest.json installed from webstore;

				var sNameManifestTempl='com.wjjsoft.webcollect.chrome.json.0';

				var sUrlWebStore='https://chrome.google.com/webstore/detail/mybasewebcollect/oelfkekhpcninmpedocgakolepcflfko';

				var _reinstall_host=function(){
					var bOK=confirm(_lc2('Reinstall', 'Re-installing Webcollect host for Google Chrome; Proceed?'));
					return bOK;
				};

				var _done_install_host=function(){
					if(confirm(_lc2('Done', 'Successfully installed Webcollect host for Google Chrome.\n\nIf you have previously not added Webcollect extension into Google Chrome, you will need to add it from WebStore.\n\nProceed to WebStore now?'))){
						platform.openUrl(sUrlWebStore);
					}
				};

				var _failed_install_host=function(){
					alert(_lc2('FailedHost', 'Failed to install webcollect host for Google Chrome.'));
				};

				if(bLinux || bMac){

					var sNameManifestDst='com.wjjsoft.webcollect.json'; //2018.4.9 on Unix, the file name must be addon ID, which will be installed in their own folders;

					var _install_manifest_unix=function(sDirNavtiveMsg){
						var nBytes=-1;
						var xFnManifest0=new CLocalFile(sDirPlugins, sNameManifestTempl);
						if(xFnManifest0.exists()){

							var sManifest=xFnManifest0.loadText('auto')
								.replace(/%PathToHost%/i, xFnHost.toStr())
								.replace(/%IdOfExtension%/i, sIdOfExtension)
								;

							if(sManifest){

								var xFnManifestDst=new CLocalFile(sDirNavtiveMsg, sNameManifestDst);

								var bProceed=true;
								if(xFnManifestDst.exists()){
									bProceed=_reinstall_host();
								}

								nBytes=0;
								if(bProceed){
									nBytes=xFnManifestDst.saveUtf8(sManifest, true);
								}
							}
						}else{
							alert('File not found.' + '\n\n' + xFnManifest0.toStr());
						}

						return nBytes;
					};

					//https://developer.chrome.com/extensions/nativeMessaging#native-messaging-host-location
					//https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Native_manifests#Manifest_location
					var vDirNativeMsg=[];
					if(bLinux){
						vDirNativeMsg.push({appname: 'Google Chrome', appdir: '.config/google-chrome', subdir: 'NativeMessagingHosts'});
					}else if(bMac){
						vDirNativeMsg.push({appname: 'Google Chrome', appdir: 'Library/Application Support/Google/Chrome', subdir: 'NativeMessagingHosts'});
					}

					for(var i in vDirNativeMsg){
						var d=vDirNativeMsg[i];
						var sDirNativeMsg=d.appdir;
						var xDirNativeMsg=new CLocalDir(sDirHome, sDirNativeMsg);
						if(sDirNativeMsg && xDirNativeMsg && xDirNativeMsg.exists()){
							//2016.8.15 consider to create the 'NativeMessagingHosts' sub-dir if not present;
							xDirNativeMsg.append(d.subdir);
							if(!xDirNativeMsg.exists()){
								xDirNativeMsg.create();
							}
							if(xDirNativeMsg.exists()){
								var nBytes=_install_manifest_unix(xDirNativeMsg.toStr());
								if(nBytes>0){
									_done_install_host();
								}else if(nBytes<0){
									_failed_install_host();
								}
							}else{
								alert(_lc2('FailedNativeMsgDir', 'Failed to create the sub-directory.') + '\n\n' + xDirNativeMsg.toStr());
							}
						}else{
							alert(_lc2('ChromeNotAvail', 'Please be sure to first have Google Chrome properly installed before installing Webcollect host.'));
						}
					}

				}else if(bWin){

					var sNameManifestDst='com.wjjsoft.webcollect.chrome.json'; //2018.4.9 for Win32, use different names for chrome/firefox, which will be installed in the plugin folder;

					var _install_manifest_windows=function(){
						var bSucc=false;
						var xFnManifest0=new CLocalFile(sDirPlugins, sNameManifestTempl);
						if(xFnManifest0.exists()){

							var sManifest=xFnManifest0.loadText('auto')
							.replace(/%PathToHost%/i, xFnHost.toStr().replace(/\\/g, '\\\\'))
							.replace(/%IdOfExtension%/i, sIdOfExtension)
							;

							if(sManifest){
								var xFnManifestDst=new CLocalFile(sDirPlugins, sNameManifestDst);

								var bProceed=true;
								if(xFnManifestDst.exists()){
									bProceed=_reinstall_host();
								}

								nBytes=0;
								if(bProceed){
									nBytes=xFnManifestDst.saveUtf8(sManifest, true);
								}

								if(nBytes>0){

									if(0){
										var sNameRegDst='webcollect_host_windows.reg';
										var sNameRegTemp='webcollect_host_windows.reg.0';
										var xFnReg0=new CLocalFile(sDirPlugins, sNameRegTemp);
										if(xFnReg0.exists()){
											var sReg=xFnReg0.loadText('auto').replace(/%PathToManifest%/i, xFnManifestDst.toStr().replace(/\\/g, '\\\\'));
											if(sReg){
												var xFnRegDst=new CLocalFile(sDirPlugins, sNameRegDst);
												nBytes=xFnRegDst.saveAnsi(sReg);
												if(nBytes>0){
													bSucc=xFnRegDst.exec();
												}
											}
										}
									}else{
										bSucc=platform.registrySetValue('HKCU', 'Software\\Google\\Chrome\\NativeMessagingHosts\\com.wjjsoft.webcollect', '', xFnManifestDst.toStr());
										if(!bSucc){
											alert(_lc2('FailedRegistry', 'Failed to install the manifest in Windows Registry.'));
										}
									}
								}
							}
						}else{
							alert('File not found.' + '\n\n' + xFnManifest0.toStr());
						}
						return bSucc;
					};

					if(_install_manifest_windows()){
						_done_install_host();
					}else{
						_failed_install_host();
					}
				}

			}else{
				alert(_lc2('FailedCacheDir', 'Failed to create the cache directory for webcollect.') + '\n\n' + plugin.getWebcollectCacheDir(false).toString());
			}
		}else{
			alert('Webcollect host not found.' + '\n\n' + xFnHost.toStr());
		}
	}

//}catch(e){
//	alert(e);
//}
