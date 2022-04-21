
//sValidation=nyfjs
//sCaption=Word count ...
//sHint=Count words and paragraphs for text contents
//sCategory=MainMenu.Edit.TxtUtils;
//sCondition=CURDB; CURINFOITEM;
//sID=p.WordCount
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

//try{

	var xNyf=new CNyfDb(-1);
	if(xNyf.isOpen()){

		var xRes={nWestern: 0, nEastern: 0, nParagraphs: 0};

		var A=0x41, Z=0x5a, D0=0x30, D9=0x39, CR=0x0d, LF=0x0a;

		var _wc=function(sTxt){

			var nWest=0, nEast=0, nPara=0;

			var s=sTxt.toUpperCase(), sTrackWord='', sTrackPara='';

			for(var i=0; i<s.length; ++i){

				var c=s.charCodeAt(i);

				if( (c>=A && c<=Z) || (c>=D0 && c<=D9) || (c>=0x7f && c<=0xff) ){
					sTrackWord=c;
					sTrackPara=c; //+=String.fromCharCode(c);
				}else if(c>0xff){
					sTrackPara=c; //+=String.fromCharCode(c);
					nEast++;
					if(sTrackWord){
						nWest++;
						sTrackWord='';
					}
				}else{
					if(c===LF){
						if(sTrackPara){
							nPara++;
							sTrackPara='';
						}
					}
					if(sTrackWord){
						nWest++;
						sTrackWord='';
					}
				}
			}

			if(sTrackPara){
				nPara++;
			}
			if(sTrackWord){
				nWest++;
			}

			xRes.nWestern+=nWest;
			xRes.nEastern+=nEast;
			xRes.nParagraphs+=nPara;
		};

		var _wc_on_infoitem=function(sSsgPath){
			if(sSsgPath){
				var vFiles=xNyf.listFiles(sSsgPath);
				for(var i in vFiles){
					var sSsgName=vFiles[i];
					if(plugin.isReservedNoteFn(sSsgName)){
						var xFn=new CLocalFile(sSsgPath, sSsgName);
						var sExt=xFn.getSuffix(false).toLowerCase();

						var sTxt=xNyf.loadText(xFn.toStr(), 'auto');
						if(sTxt){
							if(sExt==='html' || sExt==='qrich'){
								sTxt=platform.extractTextFromHtml(sTxt);
							}else if(sExt==='rtf'){
								sTxt=platform.extractTextFromRtf(sTxt);
							}else if(sExt==='txt' || sExt==='md'){
								;//
							}
						}

						if(sTxt) _wc(sTxt, xRes);
					}
				}
			}
		};

		var vOpts=[
			  _lc2('ForItem', '1. Count words for text in the current info item')
			, _lc2('ForBranch', '2. Count words for text in the current branch')
			, _lc2('ForDatabase', '3. Count words for text in the whole database')
		];

		sCfgKey='WordCount.iRange';

		var vFields = [
			{sField: 'combolist', sLabel: _lc2('Range', 'Range'), vItems: vOpts, sInit: localStorage.getItem(sCfgKey)||'0'}
		];

		var vRes=input(plugin.getScriptTitle(), vFields, {nMinSize: 400, vMargins: [6, 0, 30, 0], bVert: false});
		if(vRes && vRes.length>=1){

			var iSel=vRes[0];

			localStorage.setItem(sCfgKey, iSel);

			var bBranch=(iSel===1);
			var sCurItem=(iSel===0 || iSel===1) ? plugin.getCurInfoItem(-1) : plugin.getDefRootContainer();

			if(iSel===0){
				//2015.9.9 for current item content, it'd be better to retrieve from webkit, than load from the default HTML content file;
				//as the current content may be loaded from another HTML attachment instead of the default one;
				//_wc_on_infoitem(sCurItem);
				var sTxt=plugin.getTextContent(-1, false);
				_wc(sTxt||'', xRes);
			}else{
				plugin.initProgressRange(plugin.getScriptTitle());
				xNyf.traverseOutline(sCurItem, bBranch, function(sSsgPath, iLevel){
					var sHint=xNyf.getFolderHint(sSsgPath); if(!sHint) sHint='....';
					plugin.ctrlProgressBar(sHint);
					_wc_on_infoitem(sSsgPath);
				});
			}

			var sMsg=_lc2('Done', 'Western words: %nWestern%\n\nEastern words: %nEastern%\n\nParagraphs: %nParagraphs%');
			sMsg=sMsg.replace(/\\n/gi, '\n');
			sMsg=sMsg.replace(/%nWestern%/gi, xRes.nWestern);
			sMsg=sMsg.replace(/%nEastern%/gi, xRes.nEastern);
			sMsg=sMsg.replace(/%nParagraphs%/gi, xRes.nParagraphs);

			plugin.destroyProgressBar();

			alert(sMsg);
		}

	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}

//}catch(e){
//	alert(e);
//}
