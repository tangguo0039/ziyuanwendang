
//sValidation=nyfjs
//sCaption=Export text with delimiter ...
//sHint=Export text content to a file seperated with delimiter
//sCategory=MainMenu.Tools
//sID=p.ExportTextByDelimiter
//sAppVerMin=7.0
//sShortcutKey=Ctrl+Shift+F9
//sAuthor=wjjsoft

var _lc=function(sTag, sDef){return plugin.getLocaleMsg(sTag, sDef);};
var _lc2=function(sTag, sDef){return _lc(plugin.getLocaleID()+'.'+sTag, sDef);};

var _trim=function(s){return (s||'').replace(/^\s+|\s+$/g, '');};
var _trim_cr=function(s){return (s||'').replace(/\r+$/g, '');};

var _validate_filename=function(s){
	s=s||'';
	s=s.replace(/[\*\?\.\(\)\[\]\{\}\<\>\\\/\!\$\^\&\+\|,;:\"\'`~@]/g, ' ');
	s=s.replace(/\s{2,}/g, ' ');
	s=_trim(s);
	if(s.length>64) s=s.substr(0, 64);
	s=_trim(s);
	s=s.replace(/\s/g, '_');
	return s;
};

try{

	var xNyf=new CNyfDb(-1);
	if(xNyf.isOpen()){

		var sCfgKey='ExportTextByDelimiter.sDelimiter';
		var sMsg=_lc2('Delimiter', 'Enter a line delimiter to split text notes in the branch');
		var sDelimiter=prompt(sMsg, localStorage.getItem(sCfgKey)||'----------------------------------------');
		if(sDelimiter){

			localStorage.setItem(sCfgKey, sDelimiter);

			var sCurItem=plugin.getCurInfoItem(-1)||plugin.getDefRootContainer();
			var sItemTitle=xNyf.getFolderHint(sCurItem);

			sCfgKey='ExportTextByDelimiter.Dir';
			var sDstFn=platform.getSaveFileName(
				{ sTitle: plugin.getScriptTitle()
				, sInitDir: localStorage.getItem(sCfgKey)||''
				, sFilter: 'Text files (*.txt)|*.txt|All files (*.*)|*.*'
				, sDefExt: '.txt'
				, bOverwritePrompt: true
				, sFilename: _validate_filename(sItemTitle)||'untitled'
				});

			if(sDstFn){

				var sDir=new CLocalFile(sDstFn).getDirectory();
				localStorage.setItem(sCfgKey, sDir);

				var sRes='', sDefNoteFn=plugin.getDefNoteFn(), nDone=0;
				var _act_on_treeitem=function(sSsgPath, iLevel){

					var sTitle=xNyf.getFolderHint(sSsgPath); if(!sTitle) sTitle='== Untitled ==';

					var sPreferred=xNyf.detectPreferredFile(sSsgPath, "html;htm>txt;ini;log");
					if(sPreferred){
						var xSsgFn=new CLocalFile(sSsgPath); xSsgFn.append(sPreferred);

						var s=xNyf.loadText(xSsgFn);
						s=platform.extractTextFromHtml(s);
						s=_trim(s);
						{
							//eliminates extra blank lines;
							s=s.replace(/\r\n/g, '\n');
							s=s.replace(/\r/g, '\n');
							s=s.replace(/\n{3,}/g, '\n\n');
							s=s.replace(/\n/g, '\r\n');
						}
						if(s){
							if(sRes){
								sRes+='\r\n\r\n\r\n'+sDelimiter+'\r\n\r\n\r\n';
							}
							sRes+=''+(nDone+1)+') ';
							sRes+=sTitle;
							sRes+='\r\n\r\n';
							sRes+=s;
							nDone++;
						}
					}
				};

				xNyf.traverseOutline(sCurItem, true, _act_on_treeitem);

				var nBytes=-1;
				if(sRes){
					nBytes=new CLocalFile(sDstFn).saveUtf8(sRes);
				}
				if(nBytes<=0){
					alert('Failed to export text notes to the file.\n\n'+sDstFn);
				}else{
					sMsg=_lc2('Done', 'Total %nCount% info items successfully exported to the file. View it now?');
					sMsg=sMsg.replace('%nCount%', nDone)+'\n\n'+sDstFn;
					if(confirm(sMsg)){
						new CLocalFile(sDstFn).exec();
					}
				}
			}
		}

	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}

}catch(e){
	alert(e);
}
