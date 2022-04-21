
//sValidation=nyfjs
//sCaption=Label matched info items ...
//sHint=Search for label text and automatically label matched info items
//sCategory=MainMenu.Organize
//sCondition=CURDB; DBRW
//sID=p.AutoLabel
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

try{
	var xNyf=new CNyfDb(-1);

	if(xNyf.isOpen()){

		if(!xNyf.isReadonly()){

			var sCfgKey_Rng='AutoLabel.iRange', sCfgKey_Titles='AutoLabel.bTitles', sCfgKey_Contents='AutoLabel.bContents', sCfgKey_Attachments='AutoLabel.bAttachments';

			var sHint=_lc2('Description', 'This utility searches the database for existing label text and then label matched info items respectively; You may want first to build up a label tree before this operation.');

			var vRange=[
						_lc('p.Common.CurBranch', 'Current branch')
						, _lc('p.Common.CurDB', 'Current database')
					];

			var vScope=[
						(localStorage.getItem(sCfgKey_Titles)||'true')+'|'+_lc2('ItemTitles', 'Item titles')
						, (localStorage.getItem(sCfgKey_Contents)||'true')+'|'+_lc2('TextContents', 'Text contents')
						, (localStorage.getItem(sCfgKey_Attachments)||'true')+'|'+_lc2('Attachments', 'Attachments')
					];

			var vFields = [
						{sField: 'label', sText: sHint, bWordwrap: true}
						, {sField: "combolist", sLabel: _lc2('OutlineScope', 'Outline scope:'), vItems: vRange, nInit: localStorage.getItem(sCfgKey_Rng)||'0', bReq: true}
						, {sField: 'check', sLabel: _lc2('ContentScope', 'Content scope:'), vItems: vScope}
					];

			var vRes = input(plugin.getScriptTitle(), vFields, {nMinSize: [540, 200], vMargins: [8, 0, 30, 0], bVert: true});
			if(vRes && vRes.length>=2){

				var j=0, iRng=vRes[j++], vChk=vRes[j++];
				var bTitles=vChk[0], bContents=vChk[1], bAttachments=vChk[2], bCurBranch=(iRng===0);

				localStorage.setItem(sCfgKey_Rng, iRng);
				localStorage.setItem(sCfgKey_Titles, bTitles);
				localStorage.setItem(sCfgKey_Contents, bContents);
				localStorage.setItem(sCfgKey_Attachments, bAttachments);

				if(bTitles || bContents || bAttachments){

					var xLabel0={};
					var _traverse_label=function(sLabelPath){
						var vSub=xNyf.listSubLabels(sLabelPath||'/');
						for(var j in vSub){
							var sLabel=vSub[j];
							var sFindStr=_trim(sLabel.replace(/[._]+/g, ' '));
							if(sFindStr){
								var sSubLabel=(sLabelPath+'/'+sLabel).replace(/^\//, ''); //2019.11.8 make sure there're no leading slashes in the label path;
								var vLabeledItems=xNyf.listLabelledInfoItems(sSubLabel);
								var vSsgPaths=[], q=plugin.runQuery({sFindStr: sFindStr, bFindInTitles: bTitles, bFindInNotes: bContents, bFindInAttachments: bAttachments, bFindPartialWords: false, bCurBranch: bCurBranch, bDeepScan: true, bListOut: false, sDelimiter: '\t'});
								if(typeof(q)==='undefined') throw 'Failure running queries with index data.';
								var vRes=(q||'').split('\n');
								for(var i in vRes){
									var v=vRes[i].split('\t');
									if(v && v.length>=3){
										var sSsgPath=v[1];
										if(sSsgPath && vSsgPaths.indexOf(sSsgPath)<0 && xNyf.folderExists(sSsgPath)){
											if(vLabeledItems && vLabeledItems.indexOf(sSsgPath)<0){ //ignore info items already having the label;
												vSsgPaths.push(sSsgPath);
											}
										}
									}
								}
								if(vSsgPaths.length>0){
									xLabel0[sSubLabel]=vSsgPaths;
								}
								_traverse_label(sSubLabel);
							}
						}
					};

					_traverse_label('');

					var _makeIntoText=function(xList){
						var s='';
						for(var k in xList){
							if(s) s+='\n\n';
							s+='{'+k+'}';
							var v=xList[k];
							for(var i in v){
								var sSsgPath=v[i];
								if(sSsgPath){
									var sTitle=xNyf.getFolderHint(sSsgPath) || '....';
									s+='\n    ' + _trim(sTitle);
								}
							}
						}
						return s;
					};

					var s=_makeIntoText(xLabel0);
					if(s){
						s=textbox({
								  sTitle: plugin.getScriptTitle()
								  , sDescr: _lc2('ChanceToExclude', 'The following info items matched existing label text and will be labelled. Unwanted lines can be removed from the list before preceeding.')
								  , sDefTxt: s
								  , bReadonly: false
								  , bWordwrap: false
								  , bFind: true
								  , bFont: true
								  , bRich: false
								  , nWidth: 70
								  , nHeight: 80
								  , sBtnOK: _lc('p.Common.Proceed', 'Proceed')
							  });
						if(s){
							var vLines=_trim(s||'').split('\n');
							if(vLines && vLines.length>0){
								var sLabel, vItems=[], xLabel2={};
								for(var j in vLines){
									var sLine=vLines[j];
									if(_trim(sLine)){
										var re=/^\{(.+)\}$/, m=_trim(sLine).match(re);
										if(m){
											s=RegExp.$1;
											if(s){
												if(sLabel && vItems.length>0){
													xLabel2[sLabel]=vItems;
												}
												sLabel=s;
												vItems=[];
											}
										}else{
											if(sLabel){
												vItems.push(_trim(sLine));
											}
										}
									}
								}

								//remember to save the last section;
								if(sLabel && vItems.length>0){
									xLabel2[sLabel]=vItems;
								}

								var xLabel3={};
								for(var L0 in xLabel0){
									var v0=xLabel0[L0], v2=xLabel2[L0], vSucc=[];
									if(v2 && v2.length>0){
										for(var j in v0){
											var sSsgPath=v0[j];
											//2019.11.8 look at item title text and see if it's still present, those items having the same title text can make confusion;
											var sTitle=xNyf.getFolderHint(sSsgPath) || '....'; //log(L0 + ' => ' + sTitle);
											if(v2.indexOf(sTitle)>=0){
												if(xNyf.labelInfoItem(L0, sSsgPath)){
													vSucc.push(sSsgPath);
												}
											}
										}
										if(vSucc.length>0){
											xLabel3[L0]=vSucc;
										}
									}
								}

								plugin.refreshLabels(-1);
								plugin.refreshTagResList(-1);
								plugin.refreshRelationPane(-1);

								s=_makeIntoText(xLabel3);
								textbox({
										sTitle: plugin.getScriptTitle()
										, sDescr: _lc2('Done', 'Successfully applied labels to the following info items.')
										, sDefTxt: s
										, bReadonly: true
										, bWordwrap: false
										, bFind: true
										, bFont: true
										, bRich: false
										, nWidth: 70
										, nHeight: 80
									});
							}
						}
					}else{
						alert(_lc2('NoMore', 'No more info items matched the existing label text.'));
					}

				}
			}

		}else{
			alert(_lc('Prompt.Warn.ReadonlyDb', 'Cannot modify the database opened as Readonly.'));
		}

	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}

}catch(e){
	alert(e);
}
