
//sValidation=nyfjs
//sCaption=Change content type ...
//sHint=Change content type of the current info item
//sCategory=MainMenu.Edit; Context.Action.Edit;
//sCondition=CURDB; DBRW; CURINFOITEM; CURDOC;
//sID=p.ChgContentType
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

			var sSsgPath=plugin.getCurDocPath() || plugin.getCurInfoItem() || '', sOldNoteFn;

			if(plugin.isContentEditable()) plugin.commitCurrentChanges();

			var vRev=[], vNew=[], vDisp=[], iInit=0;
			{
				var vFiles=xNyf.listFiles(sSsgPath, false);
				for(var i in vFiles){
					var sName=vFiles[i]||'';
					if(sName.search(/.+\.(html|qrich|txt|md)$/i)===0){ //only these 4 suffix names accepted;
						vRev.push(sName);
						if(!sOldNoteFn && plugin.isReservedNoteFn(sName)){ //use the first match for consistency with nyf7;
							sOldNoteFn=sName;
						}
					}
				}

				var _format_time=function(t){
					var y=t.getFullYear(), mon=t.getMonth()+1, d=t.getDate();
					var h=t.getHours(), min=t.getMinutes(), s=t.getSeconds();
					return y + '-' + (mon>9?mon:'0'+mon) + '-' + (d>9?d:'0'+d)
							+ ' '
							+ (h>9?h:'0'+h) + ':' + (min>9?min:'0'+min) + ':' + (s>9?s:'0'+s)
					;
				};

				for(var i in vRev){
					var sName=vRev[i];
					if(sName){
						var sTmp=sName;
						if(plugin.isReservedNoteFn(sName)){
							if(sName.search(/\.html$/i)>0) sTmp=_lc2('DefHtmlDoc', 'Default HTML document');
							else if(sName.search(/\.qrich$/i)>0) sTmp=_lc2('DefRichText', 'Default Rich text document');
							else if(sName.search(/\.txt$/i)>0) sTmp=_lc2('DefPlainText', 'Default Plain text document');
							else if(sName.search(/\.md$/i)>0) sTmp=_lc2('DefMarkdown', 'Default Markdown document');
						}
						if(sName===sOldNoteFn){
							sTmp += '  ' + _lc2('Current', '(Current)');
							iInit=i;
						}
						vDisp.push(sTmp);
					}
				}

				vNew.push({sExt: 'html', sCaption: _lc2('NewHtmlDoc', 'New HTML document')});
				vNew.push({sExt: 'qrich', sCaption: _lc2('NewRichText', 'New Rich text document')});
				vNew.push({sExt: 'txt', sCaption: _lc2('NewPlainText', 'New Plain text document')});
				vNew.push({sExt: 'md', sCaption: _lc2('NewMarkdown', 'New Markdown document')});

				for(var i in vNew){
					vDisp.push(vNew[i].sCaption);
				}
			}

			var _makeUniqueSsgFileName=function(sBaseName, sSuffix){
				var i=1, sName;
				do{
					sName=sBaseName + '_' + i + '.' + sSuffix;
					var xFn=new CLocalFile(sSsgPath, sName);
					if(!xNyf.fileExists(xFn.toStr())) break;
					i++;
				}while(1);
				return sName;
			};

			if(vDisp.length>0){

				var vFields = [
					{sField: "combolist", sLabel: _lc2('Descr', 'Set one of existing attachments as default content, or create a new one'), vItems: vDisp, sInit: iInit}
				];

				var vRes = input(plugin.getScriptTitle(), vFields, {nMinSize: 500, vMargins: [8, 0, 80, 0], bVert: true});
				if(vRes && vRes.length>0){

					var iSel=vRes[0], sSsgName, sNewNoteFn;

					if(iSel>=0 && iSel<vRev.length){
						sSsgName=vRev[iSel];
						sNewNoteFn=plugin.getDefNoteFn(new CLocalFile(sSsgName).getSuffix(false));
					}else if(iSel>=vRev.length){
						iSel-=vRev.length;
						if(iSel>=0 && iSel<vNew.length){
							sNewNoteFn=plugin.getDefNoteFn(vNew[iSel].sExt);
						}
					}

					var bSucc=true;
					if(sSsgName!==sOldNoteFn){

						if(sOldNoteFn){
							var xFn=new CLocalFile(sSsgPath, sOldNoteFn);
							if(xNyf.fileExists(xFn.toStr())){
								var sBakName=_makeUniqueSsgFileName('defnote_bak', xFn.getSuffix(false));
								bSucc=xNyf.renameFile(xFn.toStr(), sBakName);
							}
						}

						if(bSucc){
							if(sSsgName && sNewNoteFn){
								var xFn=new CLocalFile(sSsgPath, sSsgName);
								bSucc=xNyf.renameFile(xFn.toStr(), sNewNoteFn);
							}
						}
					}

					//plugin.refreshDocViews(-1, sSsgPath);
					plugin.refreshRelationPane(-1, sSsgPath);

					if(bSucc){
						var xFn=new CLocalFile(sSsgPath, sNewNoteFn), sEditor='auto';
						if(xFn.getSuffix(false).toLowerCase()==='md'){
							sEditor='plain';
						}
						plugin.clearContentEditors();
						bSucc=plugin.openSsgFileInplace(-1, xFn.toStr(), sEditor, '');
					}

					if(!bSucc){
						alert('Failed to change content type of  the info tiem.');
					}
				}
			}else{
				//alert(_lc2('NoRev', 'No entries found for the current content.'));
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
