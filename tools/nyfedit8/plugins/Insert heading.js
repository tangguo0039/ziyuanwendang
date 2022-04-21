
//sValidation=nyfjs
//sCaption=Insert heading ...
//sHint=Insert heading into current Html/Markdown content
//sCategory=MainMenu.Insert; Context.HtmlEdit; Context.PlainEdit.Markdown; Context.Action.Edit.Html; Context.Action.Edit.Plain.Markdown
//sCondition=CURDB; DBRW; CURINFOITEM; EDITING
//sID=p.Ins.Heading
//sAppVerMin=8.0
//sAuthor=wjjsoft

/////////////////////////////////////////////////////////////////////
// Extension scripts for Mybase Desktop v8.x
// Copyright 2010-2021 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////


var _lc=function(sTag, sDef){return plugin.getLocaleMsg(sTag, sDef);};
var _lc2=function(sTag, sDef){return _lc(plugin.getLocaleID()+'.'+sTag, sDef);};

var _trim=function(s){return (s||'').replace(/^\s+|\s+$/g, '');};
var _trim_cr=function(s){return (s||'').replace(/\r+$/g, '');};

//var _html_encode=function(s){
//	//http://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references
//	//http://www.utf8-chartable.de/unicode-utf8-table.pl?utf8=dec
//	s=s.replace(/&/g,	'&amp;');
//	s=s.replace(/</g,	'&lt;');
//	s=s.replace(/>/g,	'&gt;');
//	s=s.replace(/\"/g,	'&quot;');
//	s=s.replace(/\'/g,	'&apos;');
//	s=s.replace(/\xA0/g,	'&nbsp;'); //http://www.fileformat.info/info/unicode/char/a0/index.htm
//	s=s.replace(/  /g,	'&nbsp; ');
//	s=s.replace(/\t/g,	'&nbsp; &nbsp; &nbsp; &nbsp; '); //&emsp;
//	//more ...
//	return s;
//};

//try{
	var xNyf=new CNyfDb(-1);
	if(xNyf.isOpen()){

		if(!xNyf.isReadonly()){

			if(plugin.isContentEditable()){

				var _is_markdown_doc=()=>{
					let sCurDocFn=ui.getCurDocFile(), sExt=new CLocalFile(sCurDocFn).getSuffix(false);
					return (sExt.toLowerCase()==='md');
				};

				var sEditor=plugin.getCurEditorType().toLowerCase();
				if(sEditor==='htmledit' || (sEditor==='plainedit' && _is_markdown_doc())){

					var sSel=_trim(plugin.getSelectedText(-1, false)); if(_is_markdown_doc()) sSel=sSel.replace(/^[#\s]+|[#\s]+$/g, '');

					var sCfgKey1='InsHeading.iLevel', sCfgKey2='InsHeading.sText';

					var vLevels=[]; for(let i=0; i<6; ++i) vLevels.push('<h' + (i+1) + '>');

					var vFields = [
								{sField: 'combolist', sLabel: _lc2('Level', 'Level'), vItems: vLevels, sInit: parseInt(localStorage.getItem(sCfgKey1)), bReq: true}
								, {sField: 'lineedit', sLabel: _lc2('Text', 'Text'), sInit: sSel||localStorage.getItem(sCfgKey2)||'', bReq: true}
							];

					var vRes=input(plugin.getScriptTitle(), vFields, {nMinSize: 500, nSpacing: 10, vMargins: [2, 0, 30, 0], bVert: true});
					if(vRes && vRes.length>=2){

						var iLvl=vRes[0], sTxt=_trim(vRes[1]).replace(/[\s\t\r\n]+/g, ' ');
						if(sTxt && iLvl>=0){

							localStorage.setItem(sCfgKey1, iLvl);
							localStorage.setItem(sCfgKey2, sTxt);

							var sEditor=plugin.getCurEditorType().toLowerCase();
							if(sEditor==='htmledit'){

								let sHtml='<h' + (iLvl+1) + '>' + platform.htmlEncode(sTxt) + '</h' + (iLvl+1) + '>';
								plugin.replaceSelectedText(-1, sHtml, true);

								logd('Heading inserted: ' + sHtml);

								plugin.runDomScript(-1, "dom.updateToc();", 2000);


							}else if(sEditor==='plainedit'){

								if(_is_markdown_doc()){

									let sSharps=''; while( (iLvl --) >= 0 ) sSharps+='#';
									let sMd=sSharps + ' ' + sTxt;
									plugin.replaceSelectedText(-1, '\n' + sMd, false);

									logd('Heading inserted: ' + sMd);

								}

							}

						}else{
							alert('Bad parameters supplied.');
						}

					}else{
						//cancelled;
					}

				}else{
					alert('Operation applies only to Html/Markdown contents.');
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
