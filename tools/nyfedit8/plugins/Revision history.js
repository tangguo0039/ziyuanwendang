
//sValidation=nyfjs
//sCaption=Revision history ...
//sHint=Revert to one of revisions in history
//sCategory=MainMenu.Edit; Context.HtmlEdit; Context.HtmlView; Context.RichEdit; Context.RichView; Context.PlainEdit; Context.PlainView; Context.Action.Edit;
//sCondition=CURDB; DBRW; CURINFOITEM; CURDOC;
//sID=p.RevHistory
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

			var xFnCurDoc=new CLocalFile(plugin.getCurDocFile());

			var sCurDocPath=xFnCurDoc.getDirectory(false), sCurDocName=xFnCurDoc.getLeafName();
			if(sCurDocPath && sCurDocName){

				if(plugin.isContentEditable()) plugin.commitCurrentChanges();

				var vRev=[], vDisp=[];
				{
					var vFiles=xNyf.listFiles(sCurDocPath, true);
					for(var i in vFiles){
						var sFn=vFiles[i];
						if(sFn===sCurDocName){
							vRev.push(sFn);
						}else if(sFn.indexOf(sCurDocName+'.~.')===0){
							vRev.push(sFn);
						}
					}

					var _compare_timestamp=function(x, y){

						var xFn=new CLocalFile(sCurDocPath, x);
						var tx=xNyf.getModifyTime(xFn.toStr());

						xFn=new CLocalFile(sCurDocPath, y);
						var ty=xNyf.getModifyTime(xFn.toStr());

						if(tx < ty) return 1;
						else if(tx > ty) return -1;
						else return 0;
					};

					vRev.sort(_compare_timestamp);

					var _format_time=function(t){
						var y=t.getFullYear(), mon=t.getMonth()+1, d=t.getDate();
						var h=t.getHours(), min=t.getMinutes(), s=t.getSeconds();
						return y + '-' + (mon>9?mon:'0'+mon) + '-' + (d>9?d:'0'+d)
							+ ' '
							+ (h>9?h:'0'+h) + ':' + (min>9?min:'0'+min) + ':' + (s>9?s:'0'+s)
							;
					};

					//var c=vRev.length;
					//var nDigit= (c<10) ? 1 : ( c<100 ? 2 : ( c<1000 ? 3 : 4) );

					for(var i in vRev){
						var sFn=vRev[i];
						if(sFn){
							var xFn=new CLocalFile(sCurDocPath, sFn);
							var tMod=xNyf.getModifyTime(xFn.toStr()), nLen=xNyf.getFileSize(xFn.toStr());
							var sTmp=_lc2('RevNo', 'Rev.') + ' ' + (vRev.length-parseInt(i)) + '  '
								+ _lc2('Timestamp', 'Date modified:') + ' ' + _format_time(tMod)//tMod.toString()
								+ '  '
								+ _lc2('Size', 'Size:') + ' ' + nLen + ' ' + _lc2('Bytes', 'bytes');
							if(sFn===sCurDocName) sTmp += '  ' + _lc2('Current', '(Current)');
							vDisp.push(sTmp);
						}
					}
				}

				if(vDisp.length>0){

					var vFields = [
						{sField: "combolist", sLabel: _lc2('Descr', 'Revert to one of the history revisions'), vItems: vDisp, sInit: 0}
					];

					var vRes = input(plugin.getScriptTitle(), vFields, {nMinSize: 500, vMargins: [8, 0, 80, 0], bVert: true});
					if(vRes && vRes.length>0){

						var iSel=vRes[0];

						if(vRev[iSel]!==sCurDocName){
							var xFn=new CLocalFile(sCurDocPath, sCurDocName);

							if(xNyf.fileExists(xFn.toStr())){
								xNyf.trashEntry(xFn.toStr(), false);
							}

							var sNewName=xNyf.undeleteEntry(sCurDocPath, vRev[iSel]);
							if(sNewName){
								plugin.refreshDocViews(-1, xFnCurDoc.toStr());
							}
						}
					}
				}else{
					alert(_lc2('NoRev', 'No revision history found for the current content.'));
				}
			}else{
				alert(_lc2('NoDocOpen', 'No content is currently opened in the HTML editor.'));
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
