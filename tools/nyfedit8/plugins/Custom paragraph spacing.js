
//sValidation=nyfjs
//sCaption=Custom paragraph spacing ...
//sHint=Custom spacing for the selected paragraph
//sCategory=MainMenu.Paragraph
//sPosition=PAR-12
//sCondition=CURDB; DBRW; CURINFOITEM; FORMATTED; EDITING;
//sID=p.CustomParSpacing
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

			if(plugin.isContentEditable()){

				var sEditor=plugin.getCurEditorType().toLowerCase();
				if(sEditor==='htmledit'){

					var _unit_of=function(s){
						return (s||'').replace(/^([e\d\s]+)(?=[a-z%]{0,2}$)/i, '');
					};

					var sCfgKey0 = 'Html.ParaSpacing.Before', sCfgKey1 = 'Html.ParaSpacing.After';

					var vVals=[
						'|'+_lc('p.Common.Initial', 'Initial')
						, '0px'
						, '0.1em', '0.2em', '0.3em', '0.4em', '0.5em', '0.6em', '0.7em', '0.8em', '0.9em'
						, '1em', '2em', '3em', '4em', '5em', '6em', '7em', '8em', '9em', '10em', '11em', '12em'
						, '1pt', '2pt', '3pt', '4pt', '5pt', '8pt', '10pt', '16pt', '20pt', '24pt', '32pt', '40pt'
						, '1px', '2px', '3px', '4px', '5px', '8px', '10px', '16px', '20px', '24px', '32px', '40px'
					];

					var vFields = [
						{sField: "comboedit", sLabel: _lc2('Before', 'Before'), vItems: vVals, sInit: localStorage.getItem(sCfgKey0)||'', bReq: false}
						, {sField: "comboedit", sLabel: _lc2('After', 'After'), vItems: vVals, sInit: localStorage.getItem(sCfgKey1)||'', bReq: false}
					];

					var vRes = input(plugin.getScriptTitle(), vFields, {nMinSize: 400});
					if(vRes && vRes.length >= 2){

						var sBefore=_trim(vRes[0]); if(sBefore === '0') sBefore='';
						var sAfter=_trim(vRes[1]); if(sAfter === '0') sAfter='';

						localStorage.setItem(sCfgKey0, sBefore);
						localStorage.setItem(sCfgKey1, sAfter);

						if(sBefore !== '' && _unit_of(sBefore) === '') sBefore+='pt';
						if(sAfter !== '' && _unit_of(sAfter) === '') sAfter+='pt';

						plugin.setParagraphSpacing(-1, sBefore, sAfter);
					}

				}else if(sEditor==="richedit"){

					var sCfgKey0 = 'Rich.ParaSpacing.Before', sCfgKey1 = 'Rich.ParaSpacing.After';

					var vVals=['0', '4', '6', '8', '10', '16', '24', '32', '40', '48', '56', '64', '80', '90', '100'];

					var vFields = [
						{sField: "comboedit", sLabel: _lc2('Before', 'Before'), vItems: vVals, sInit: localStorage.getItem(sCfgKey0)||'0', bReq: false}
						, {sField: "comboedit", sLabel: _lc2('After', 'After'), vItems: vVals, sInit: localStorage.getItem(sCfgKey1)||'0', bReq: false}
					];

					var vRes = input(plugin.getScriptTitle(), vFields, {nMinSize: 400});
					if(vRes && vRes.length >= 2){

						var sBefore=_trim(vRes[0]); if(sBefore === '0') sBefore='';
						var sAfter=_trim(vRes[1]); if(sAfter === '0') sAfter='';

						localStorage.setItem(sCfgKey0, sBefore);
						localStorage.setItem(sCfgKey1, sAfter);

						plugin.setParagraphSpacing(-1, sBefore, sAfter);
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
