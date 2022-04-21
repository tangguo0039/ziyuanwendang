
//sValidation=nyfjs
//sCaption=Export text with delimiter ...
//sHint=Export text contents in current branch with delimiter
//sCategory=MainMenu.Share
//sCondition=CURDB; CURINFOITEM; OUTLINE
//sID=p.ExportTextWithDelimiter
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

//try{

	var xNyf=new CNyfDb(-1);
	if(xNyf.isOpen()){

		if(plugin.isContentEditable()) plugin.commitCurrentChanges();

		var sCfgKey1='ExportTextWithDelimiter.sDir', sCfgKey2='ExportTextWithDelimiter.sDelimiter';

		var xInitFn=new CLocalFile(localStorage.getItem(sCfgKey1)||platform.getHomePath()||'', _validate_filename(xNyf.getFolderHint(plugin.getCurInfoItem(-1)))||'untitled');

		var vFields = [
			{sField: "savefile", sLabel: _lc2('DstFn', 'Save as text file'), sTitle: plugin.getScriptTitle(), sFilter: 'Text files (*.txt);;All files (*.*)', sInit: xInitFn.toStr()}
			, {sField: "lineedit", sLabel: _lc2('Delimiter', 'Delimiter to separate text contents'), sInit: localStorage.getItem(sCfgKey2)||'----------------------------------------'}
		];

		var vRes = input(plugin.getScriptTitle(), vFields, {nMinSize: 500, vMargins: [2, 0, 50, 0], bVert: true});
		if(vRes && vRes.length>=2){

			var sDstFn=vRes[0], sDelimiter=vRes[1];
			if(sDstFn && sDelimiter){

				localStorage.setItem(sCfgKey1, new CLocalFile(sDstFn).getDirectory());
				localStorage.setItem(sCfgKey2, sDelimiter);

				var sRes='', nDone=0, bWin=platform.getOsType().search(/win/i)===0, sCRLF=bWin?'\r\n':'\n';
				var _act_on_treeitem=function(sSsgPath, iLevel){

					var sTitle=xNyf.getFolderHint(sSsgPath); if(!sTitle) sTitle='== Untitled ==';

					var sPreferred=xNyf.detectPreferredFile(sSsgPath, "html;qrich;txt;md;rtf>htm;ini;log");
					if(sPreferred){
						var xSsgFn=new CLocalFile(sSsgPath, sPreferred);
						var sExt=xSsgFn.getSuffix(false)||'';

						var s=xNyf.loadText(xSsgFn.toStr(), 'auto');

						if(sExt.search(/^(html|htm|qrich)$/i)===0) s=platform.extractTextFromHtml(s);
						else if(sExt.search(/^rtf$/i)===0) s=platform.extractTextFromRtf(s);

						s=_trim(s);
						{
							//eliminates extra blank lines;
							s=s.replace(/\r\n/g, '\n');
							s=s.replace(/\r/g, '\n');
							s=s.replace(/\n{3,}/g, '\n\n');
							if(bWin) s=s.replace(/\n/g, '\r\n');
						}
						if(s){
							if(sRes){
								sRes+=sCRLF+sCRLF+sCRLF+sDelimiter+sCRLF+sCRLF+sCRLF;
							}
							sRes+=''+(nDone+1)+') ';
							sRes+=sTitle;
							sRes+=sCRLF+sCRLF;
							sRes+=s;
							nDone++;
						}
					}
				};

				var sCurItem=plugin.getCurInfoItem(-1)||plugin.getDefRootContainer();
				xNyf.traverseOutline(sCurItem, true, _act_on_treeitem);

				var nBytes=-1, xDstFn=new CLocalFile(sDstFn);
				if(sRes){
					nBytes=xDstFn.saveUtf8(sRes);
				}

				if(nBytes<=0){
					alert('Failed to export text content to the file.\n\n'+sDstFn);
				}else{
					sMsg=_lc2('Done', 'Total %nDone% info items successfully exported to the file. View it now?');
					sMsg=sMsg.replace('%nDone%', nDone)+'\n\n'+sDstFn;
					if(confirm(sMsg)){
						//xDstFn.exec();
						textbox({
							sTitle: plugin.getScriptTitle()
							, sDescr: _lc2('Descr', 'Text contents exported from in current branch;')
							, sDefTxt: xDstFn.loadText('auto')
							, bReadonly: true
							, bWordwrap: true
							, nWidth: 80
							, nHeight: 80
						});
					}
				}
			}
		}

	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}

//}catch(e){
//	alert(e);
//}
