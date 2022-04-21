
//sValidation=nyfjs
//sCaption=Make into table ...
//sHint=Make selected text fields into table
//sCategory=MainMenu.TxtUtils; /MainMenu.Table
//sPosition=TBL-00-INS-01
//sCondition=CURDB; DBRW; CURINFOITEM; FORMATTED; CONTENTSELECTED
//sID=p.MakeIntoTable
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

//var _html_encode=function(s)
//{
//	//http://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references
//	s=s.replace(/&/g,	'&amp;');
//	s=s.replace(/</g,	'&lt;');
//	s=s.replace(/>/g,	'&gt;');
//	s=s.replace(/\"/g,	'&quot;');
//	s=s.replace(/\'/g,	'&apos;');
//	s=s.replace(/\xA0/g,	'&nbsp;'); //http://www.fileformat.info/info/unicode/char/a0/index.htm
//	s=s.replace(/  /g,	'&nbsp; ');
//	s=s.replace(/\t/g,	'&nbsp; &nbsp; &nbsp; &nbsp; '); //&emsp;
//	//and more ...
//	return s;
//};

//try{
	var xNyf=new CNyfDb(-1);
	if(xNyf.isOpen()){

		if(!xNyf.isReadonly()){

			if(plugin.isContentEditable()){

				var sTxt=plugin.getSelectedText(-1, false);
				if(sTxt){

					var sCfgKey1='MakeIntoTable.sDelimiter';
					var vSep=[',|Comma ( , )', ';|Semicolon ( ; )', '||Vertical bar ( | )', ' |Blankspace (single or multiple)', '\t|Tab character( \\t )'];
					var sDescr=_lc2('Descr', 'Select or enter a text seperator to divide selected text into table cells;');
					var vFields = [
						{sField: 'comboedit', sLabel: sDescr, vItems: vSep, sInit: localStorage.getItem(sCfgKey1)||''}
						];
					var vRes=input(plugin.getScriptTitle(), vFields, {nMinSize: 500, vMargins: [6, 0, 30, 0], bVert: true});
					if(vRes && vRes.length>=1){

						var sDelimiter=vRes[0];
						if(sDelimiter){

							localStorage.setItem(sCfgKey1, sDelimiter);

							if(!_trim(sDelimiter) && sDelimiter.search('\t')<0){
								sDelimiter=' ';
							}

							var vLines=sTxt.split('\n'), vRows=[], nColMax=0;
							for(var i in vLines){
								//2015.3.28 '\xA0' stands for &nbsp; in html;
								var sLine=_trim(vLines[i].replace(/\xA0/g, ' '));
								if(sLine){

									if(sDelimiter===' ') sLine=sLine.replace(/\s{2,}/g, ' ');

									var vCells=sLine.split(sDelimiter);
									if(vCells.length>0){
										if(nColMax<vCells.length) nColMax=vCells.length;
										vRows.push(vCells);
									}
								}
							}

							var sHtml;
							if(nColMax>0){
								sHtml='<table border="1" cellpadding="5" cellspacing="0">';
								for(var j in vRows){
									var vCells=vRows[j];
									sHtml+='<tr>';
									for(var i=0; i<nColMax; ++i){
										var sVal=''; if(i<vCells.length) sVal=_trim(vCells[i]);
										sHtml+='<td>'+platform.htmlEncode(sVal)+'</td>';
									}
									sHtml+='</tr>';
								}
								sHtml+='</table>';
							}

							if(sHtml){
								plugin.replaceSelectedText(-1, sHtml, true);
							}
						}else{
							alert(_lc2('BadInput', 'Invalid field delimiter.'));
						}
					}

				}else{

					alert(_lc('Prompt.Warn.NoTextSelected', 'No text content is currently selected.'));
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
