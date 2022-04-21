
//sValidation=nyfjs
//sCaption=Custom line spacing ...
//sHint=Set line-height attribute (line-spacing) for selected paragraphs
//sCategory=MainMenu.Paragraph
//sPosition=PAR-11
//sCondition=CURDB; DBRW; CURINFOITEM; FORMATTED; EDITING;
//sID=p.CustomLineSpacing
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
						//return (s||'').replace(/^([e\d\s]+)(?=em|px|pt|%$)/i, '');
						return (s||'').replace(/^([e\d\s]+)(?=[a-z%]{0,2}$)/i, '');
					};

					var sCfgKey='Html.LineHeight.Value';

					var vVals=[
								'|'+_lc('p.Common.Initial', 'Initial')
								, '100%|' + _lc2('Single', 'Single line-spacing (1x)')
								, '150%|' + _lc2('OneHalf', 'One and half line-spacing (1.5x)')
								, '200%|' + _lc2('Double', 'Double line-spacing (2x)')
								, '80%', '85%', '90%', '95%'
								, '100%', '110%', '120%', '130%', '140%', '150%', '180%', '200%', '250%', '300%', '400%', '500%'
								, '1em', '1.1em', '1.2em', '1.3em', '1.4em', '1.5em', '1.8em', '2em', '2.5em', '3em', '4em', '5em'
							];

					var vFields = [
								{sField: "comboedit", sLabel: _lc2('Descr', 'Line spacing'), vItems: vVals, sInit: localStorage.getItem(sCfgKey)||'', bReq: false}
							];

					var vRes = input(plugin.getScriptTitle(), vFields, {nMinSize: 400, vMargins: [8, 0, 30, 0]});
					if(vRes && vRes.length>0){

						var sVal=vRes[0];

						localStorage.setItem(sCfgKey, sVal);

						if(sVal !== '' && _unit_of(sVal)==='') sVal+='pt';

						plugin.setLineHeight(-1, sVal);
					}

				}else if(sEditor==="richedit"){

					var sCfgKey='Rich.LineHeight.Value';

					var vVals=[
						'100%|' + _lc2('Single', 'Single line-spacing (1x)')
						, '150%|' + _lc2('OneHalf', 'One and half line-spacing (1.5x)')
						, '200%|' + _lc2('Double', 'Double line-spacing (2x)')
						, '80%', '85%', '90%', '95%'
						, '100%', '110%', '120%', '130%', '140%', '150%', '180%', '200%', '250%', '300%', '400%', '500%'
					];

					var vFields = [
						{sField: "comboedit", sLabel: _lc2('Descr', 'Line spacing'), vItems: vVals, sInit: localStorage.getItem(sCfgKey)||'100%', bReq: false}
					];

					var vRes = input(plugin.getScriptTitle(), vFields, {nMinSize: 400, vMargins: [8, 0, 30, 0]});
					if(vRes && vRes.length>0){

						var sVal=vRes[0];

						localStorage.setItem(sCfgKey, sVal);

						plugin.setLineHeight(-1, sVal);
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
