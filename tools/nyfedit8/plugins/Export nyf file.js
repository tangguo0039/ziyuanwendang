
//sValidation=nyfjs
//sCaption=Export .nyf file ...
//sHint=Export info items in the branch to another .nyf file
//sCategory=MainMenu.Share
//sCondition=CURDB; OUTLINE; CURINFOITEM
//sID=p.ExportNyf
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

		var sCurItem=plugin.getCurInfoItem(-1);
		var sItemTitle=xNyf.getFolderHint(sCurItem)||'untitled';

		var sCfgKey='ExportNyf.Dir';

		var xInitFn = new CLocalFile(localStorage.getItem(sCfgKey)||platform.getHomePath()||'', _validate_filename(sItemTitle) + '.nyf');

		var sDbDst=platform.getSaveFileName(
			{ sTitle: plugin.getScriptTitle()
			, sInitDir: xInitFn.toStr()
			, sFilter: 'Mybase database files (*.nyf);;All files (*.*)'
			, bDontConfirmOverwrite: true
			});

		if(sDbDst){

			if(plugin.getDbIndex(sDbDst)<0){

				var sDir=new CLocalFile(sDbDst).getDirectory();
				localStorage.setItem(sCfgKey, sDir);

				var sPathDst='', sDefRoot=plugin.getDefRootContainer();

				var f=new CLocalFile(sDbDst);
				if(f.exists()){
					var sMsg=_lc2('DstPath', 'Select the destination location');
					var xDbDst=new CNyfDb();
					if(xDbDst.open(sDbDst, false)){
						sPathDst=xDbDst.browseOutline(sMsg, sDefRoot);
						xDbDst.close();
					}else{
						alert(_lc('Prompt.Failure.OpenDb', 'Failed to open the database.')+'\n\n'+sDbDst);
					}
				}else{
					if(f.createFile()){
						sPathDst=sDefRoot;
					}else{
						alert(_lc2('Fail.CreateFile', 'Failed to create the .nyf file.')+'\n\n'+sDbDst);
					}
				}

				if(sPathDst){
					var bSucc=plugin.exportNyfFile(-1, sDbDst, sPathDst);
					if(bSucc){
						alert(_lc2('Done', 'Successfully exported data to the .nyf file.')+'\n\n'+sDbDst);
					}else{
						alert(_lc2('Fail.ExportNyf', 'Failed to export data to the .nyf file.')+'\n\n'+sDbDst);
					}
				}
			}else{
				alert('Cannot export data to the database that is in use. Please be sure first to close it before operation.'+'\n\n'+sDbDst);
			}

		}

	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}

//}catch(e){
//	alert(e);
//}
