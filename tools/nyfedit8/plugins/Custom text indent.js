
//sValidation=nyfjs
//sCaption=Custom indent ...
//sHint=Custom indent for the selected paragraphs
//sCategory=MainMenu.Paragraph
//sPosition=PAR-10
//sCondition=CURDB; DBRW; CURINFOITEM; FORMATTED; EDITING;
//sID=p.CustomIndent
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

					var sCfgKey0 = 'Html.Indent.Start', sCfgKey1 = 'Html.Indent.Left', sCfgKey2 = 'Html.Indent.Right';

					var vVals=[
								'|'+_lc('p.Common.Initial', 'Initial')
								, '0px'
								, '0.5em', '1em', '2em', '3em', '4em', '5em', '6em', '7em', '8em', '9em', '10em', '11em', '12em'
								, '5pt', '10pt', '15pt', '20pt', '30pt', '40pt', '50pt', '60pt', '70pt', '80pt', '90pt'
								, '5px', '10px', '15px', '20px', '30px', '40px', '50px', '60px', '70px', '80px', '90px'
							];

					var vFields = [
								{sField: "comboedit", sLabel: _lc2('FirstLine', 'First-line indent'), vItems: vVals, sInit: localStorage.getItem(sCfgKey0)||'', bReq: false}
								, {sField: "comboedit", sLabel: _lc2('Left', 'Left indent'), vItems: vVals, sInit: localStorage.getItem(sCfgKey1)||'', bReq: false}
								, {sField: "comboedit", sLabel: _lc2('Right', 'Right indent'), vItems: vVals, sInit: localStorage.getItem(sCfgKey2)||'', bReq: false}
							];

					var vRes = input(plugin.getScriptTitle(), vFields, {nMinSize: 400});
					if(vRes && vRes.length >= 3){

						var sStart=vRes[0];
						var sLeft=vRes[1];
						var sRight=vRes[2];

						localStorage.setItem(sCfgKey0, sStart);
						localStorage.setItem(sCfgKey1, sLeft);
						localStorage.setItem(sCfgKey2, sRight);

						if(sStart !== '' && _unit_of(sStart)==='') sStart+='pt';
						if(sLeft !== '' && _unit_of(sLeft)==='') sLeft+='pt';
						if(sRight !== '' && _unit_of(sRight)==='') sRight+='pt';

						plugin.setIndent(-1, sStart, sLeft, sRight);
					}

				}else if(sEditor==="richedit"){

					var sCfgKey0 = 'Rich.Indent.Start', sCfgKey1 = 'Rich.Indent.Left', sCfgKey2 = 'Rich.Indent.Right';

					var vVals=['0', '4', '6', '8', '10', '16', '24', '32', '40', '48', '56', '64', '80', '90', '100'];

					var vFields = [
						{sField: "comboedit", sLabel: _lc2('FirstLine', 'First-line indent'), vItems: vVals, sInit: localStorage.getItem(sCfgKey0)||'', bReq: false}
						, {sField: "comboedit", sLabel: _lc2('Left', 'Left indent'), vItems: vVals, sInit: localStorage.getItem(sCfgKey1)||'', bReq: false}
						, {sField: "comboedit", sLabel: _lc2('Right', 'Right indent'), vItems: vVals, sInit: localStorage.getItem(sCfgKey2)||'', bReq: false}
					];

					var vRes = input(plugin.getScriptTitle(), vFields, {nMinSize: 400});
					if(vRes && vRes.length >= 3){

						var sStart=vRes[0];
						var sLeft=vRes[1];
						var sRight=vRes[2];

						localStorage.setItem(sCfgKey0, sStart);
						localStorage.setItem(sCfgKey1, sLeft);
						localStorage.setItem(sCfgKey2, sRight);

						plugin.setIndent(-1, sStart, sLeft, sRight);
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
