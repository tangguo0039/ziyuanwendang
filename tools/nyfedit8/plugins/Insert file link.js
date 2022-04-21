
//sValidation=nyfjs
//sCaption=Insert file link ...
//sHint=Insert file links into current HTML content
//sCategory=MainMenu.Insert; ToolBar.Insert
//sCondition=CURDB; DBRW; CURINFOITEM; FORMATTED; EDITING;
//sID=p.Ins.FileLink
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

		if(!xNyf.isReadonly() && plugin.isContentEditable()){

			var sCfgKey='InsertFileLink.Dir';

			var vFiles=platform.getOpenFileNames({
				sTitle: plugin.getScriptTitle()
				, sInitDir: localStorage.getItem(sCfgKey)||''
				, sFilter: 
					  'All files (*)'
					+ ';;HTML files (*.htm;*.html)'
					+ ';;Text files (*.txt)'
					+ ';;MS-Office (*.doc;*.docx;*.xls;*.xlsx;*.ppt;*.pptx)'
					+ ';;OpenOffice (*.odf);;RTF documents (*.rtf)'
					+ ';;Archives (*.zip;*.rar;*.7z;*.tar;*.gz;*.bz2;*.xz;*.lzma)'
					+ ';;Pictures (*.jpg;*.jpeg;*.png;*.gif;*.bmp;*.svg)'
					+ ';;PDF documents(*.pdf)'
					+ ';;Sound clips (*.wav;*.wma;*.mp3)'
					+ ';;Movies (*.mov;*.mp4;*.rmvb;*.wmv;*.avi;*.mpeg)'
					+ ';;Disk images (*.iso;*.dmg;*.img;*.io)'
					+ ';;Drawings (*.dwg)'
			});

			if(vFiles && vFiles.length>0){

				localStorage.setItem(sCfgKey, new CLocalFile(vFiles[0]).getDirectory(false));

				var sHtml='', sDbPath=new CLocalFile(xNyf.getDbFile()).getDirectory(true).replace(/\\/g, '/');
				for(var j in vFiles){
					var xFn=new CLocalFile(vFiles[j]);
					var sName=xFn.getLeafName();

					var sPath=xFn.toStr().replace(/\\/g, '/'), sUri;
					if(0){
						//2015.1.7 use relative path;
						if(sPath.indexOf(sDbPath)===0){
							sPath=sPath.replace(sDbPath, './');
							sUri='file://'+sPath;
						}else{
							sUri='file://';
							//2015.1.15 add a slash for DOS local file path;
							//2015.3.2 consider of UNC path: file://///servername/share/file.txt
							//http://rubenlaguna.com/wp/2007/04/20/firefox-and-file-windows-unc-paths/
							//http://en.wikipedia.org/wiki/File_URI_scheme
							if(sPath.match(/^\/\/[\w\d]+/) || !sPath.match(/^[\/\\]/)) sUri+='/';
							sUri+=sPath;
						}
					}else if(0){
						//2016.3.30 support of relative path variables, e.g. ${DB}, ${HOME}, ${CWD}, & user-defined vars;
						sPath=xNyf.applyRelativePath(sPath);
						sUri='file://';
						if(sPath.indexOf("${")===0){
							//2016.3.30 an extra Slash is required to be inserted infront of ${xxx},
							//for end-users to read the hyperlink from on status-bar;
							//the extra Slash will be handled when the hyperlink is triggered;
							//e.g.  file:///${DB}/test.txt
							sUri+='/';
						}else{
							//2016.3.30 contains no any of relative-path vars;
							//2015.1.15 add a slash for DOS local file path;
							//2015.3.2 consider of UNC path: file://///servername/share/file.txt
							//http://rubenlaguna.com/wp/2007/04/20/firefox-and-file-windows-unc-paths/
							//http://en.wikipedia.org/wiki/File_URI_scheme
							if(sPath.match(/^\/\/[\w\d]+/) || !sPath.match(/^[\/\\]/)) sUri+='/';
						}
						sUri+=sPath;
					}else{
						//2016.3.31 invoke the inbuilt function to compose the file hyperlink for consistency;
						sUri=xNyf.makeFileLinkWithRelativePath(sPath);
					}

					var sLine='<a href="'+sUri+'">'+sName+'</a>';

					if(vFiles.length>1){
						//make into multiple lines;
						sLine='<div>'+sLine+'</div>';
					}

					if(sHtml) sHtml+='\n';
					sHtml += sLine;

				}

				plugin.replaceSelectedText(-1, sHtml, true);
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
