
//sValidation=nyfjs
//sCaption=Custom page margin ...
//sHint=Change values of margin attributes of the page
//sCategory=MainMenu.Paragraph
//sPosition=
//sCondition=CURDB; DBRW; CURINFOITEM; EDITING
//sID=p.CustomPageMargins
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

//11:20 9/24/2015 initial commit by wjj;
//This plugin is used to set margin-left/right for <body> element of the current HTML content;

var _lc=function(sTag, sDef){return plugin.getLocaleMsg(sTag, sDef);};
var _lc2=function(sTag, sDef){return _lc(plugin.getLocaleID()+'.'+sTag, sDef);};

var _trim=function(s){return (s||'').replace(/^\s+|\s+$/g, '');};
var _trim_cr=function(s){return (s||'').replace(/\r+$/g, '');};

//try{
	var xNyf=new CNyfDb(-1);
	if(xNyf.isOpen()){

		if(!xNyf.isReadonly()){
			if(plugin.isContentEditable()){
				var sEditor=plugin.getCurEditorType().toLowerCase();
				if(sEditor==='htmledit'){

					var _unit_of=function(s){
						//return (s||'').replace(/^([e\d\s]+)(?=em|px|pt|%$)/i, '');
						return (s||'').replace(/^([e\d\s]+)(?=[a-z%]{0,2}$)/i, '');
					};

					var sCfgKey1='Html.BodyMargin.Top', sCfgKey2='Html.BodyMargin.Right', sCfgKey3='Html.BodyMargin.Bottom', sCfgKey4='Html.BodyMargin.Left';

					var vVals=[
						'|'+_lc('p.Common.Initial', 'Initial')
						, '0.2em', '0.4em', '0.6em', '0.8em', '1em', '1.2em', '1.4em', '1.6em', '1.8em', '2em', '3em', '4em', '5em', '8em', '10em'
						, '5px', '10px', '15px', '20px', '25px', '30px', '35px', '40px', '45px', '50px'
						];

					var sTop0=plugin.getDocumentMargin(-1, 'margin-top');
					var sRight0=plugin.getDocumentMargin(-1, 'margin-right');
					var sBottom0=plugin.getDocumentMargin(-1, 'margin-bottom');
					var sLeft0=plugin.getDocumentMargin(-1, 'margin-left');

					var vFields = [
						{sField: "comboedit", sLabel: _lc2('Top', 'margin-top'), vItems: vVals, sInit: sTop0||localStorage.getItem(sCfgKey1)||'', bReq: false}
						, {sField: "comboedit", sLabel: _lc2('Right', 'margin-right'), vItems: vVals, sInit: sRight0||localStorage.getItem(sCfgKey2)||'', bReq: false}
						, {sField: "comboedit", sLabel: _lc2('Bottom', 'margin-bottom'), vItems: vVals, sInit: sBottom0||localStorage.getItem(sCfgKey3)||'', bReq: false}
						, {sField: "comboedit", sLabel: _lc2('Left', 'margin-left'), vItems: vVals, sInit: sLeft0||localStorage.getItem(sCfgKey4)||'', bReq: false}
						];

					var vRes = input(plugin.getScriptTitle(), vFields, {nMinSize: 400, vMargins: [8, 0, 30, 0]});
					if(vRes && vRes.length>=4){

						var sTop=vRes[0], sRight=vRes[1], sBottom=vRes[2], sLeft=vRes[3];

						localStorage.setItem(sCfgKey1, sTop);
						localStorage.setItem(sCfgKey2, sRight);
						localStorage.setItem(sCfgKey3, sBottom);
						localStorage.setItem(sCfgKey4, sLeft);

						if(sTop !== '' && _unit_of(sTop)==='') sTop+='px';
						if(sRight !== '' && _unit_of(sRight)==='') sRight+='px';
						if(sBottom !== '' && _unit_of(sBottom)==='') sBottom+='px';
						if(sLeft !== '' && _unit_of(sLeft)==='') sLeft+='px';

						plugin.setDocumentMargin(-1, sTop, sRight, sBottom, sLeft);
					}

				}else if(sEditor==='richedit' || sEditor==='plainedit'){

					var sCfgKey1='Rich.DocumentMargin.Value';

					var vVals=['0', '4', '6', '8', '10', '16', '24', '32', '40', '48', '56', '64', '80', '90', '100'];

					var m0=plugin.getDocumentMargin(-1, '')||'8';

					var vFields = [
						{sField: "comboedit", sLabel: _lc2('Margin', 'Margin'), vItems: vVals, sInit: m0||localStorage.getItem(sCfgKey1)||'', bReq: false}
						];

					var vRes = input(plugin.getScriptTitle(), vFields, {nMinSize: 400, vMargins: [8, 0, 30, 0]});
					if(vRes && vRes.length>=1){
						var sMargin=vRes[0];
						localStorage.setItem(sCfgKey1, sMargin);
						plugin.setDocumentMargin(-1, sMargin);
					}

				}

			}else{
				alert(_lc('Prompt.Warn.ReadonlyContent', 'Cannot modify the content opened as Readonly.'));
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
