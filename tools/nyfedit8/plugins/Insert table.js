
//sValidation=nyfjs
//sCaption=Insert Table ...
//sHint=Insert a custom table into the text content
//sCategory=MainMenu.Insert; MainMenu.Table; ToolBar.Insert; ToolBar.Table
//sPosition=TBL-00-INS-00
//sCondition=CURDB; DBRW; CURINFOITEM; FORMATTED; EDITING;
//sID=p.Ins.Table
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

					var sCfgKey1='InsertTable.Html.nRows', sCfgKey2='InsertTable.Html.nCols', sCfgKey3='InsertTable.Html.sWidth';

					var vWidths=[
								'|'+_lc('p.Common.Initial', 'Initial')
								, '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%'
								, '100%|'+'100% (Full)'
								, '10pt', '20pt', '30pt', '40pt', '50pt', '60pt', '70pt', '80pt', '90pt'
								, '100pt', '150pt', '200pt', '250pt', '300pt', '350pt', '400pt', '450pt'
								, '500pt', '550pt', '600pt', '650pt', '700pt', '750pt', '800pt', '850pt'
								, '900pt', '950pt', '1000pt'
								, '10px', '20px', '30px', '40px', '50px', '60px', '70px', '80px', '90px'
								, '100px', '150px', '200px', '250px', '300px', '350px', '400px', '450px'
								, '500px', '550px', '600px', '650px', '700px', '750px', '800px', '850px'
								, '900px', '950px', '1000px'
							];

					var vNums=[], nMax=30;
					for(var i=0; i<nMax; ++i){
						vNums.push(i+1);
					}

					var vFields = [
								{sField: 'comboedit', sLabel: _lc2('RowNum', 'Number of rows'), vItems: vNums, sInit: localStorage.getItem(sCfgKey1)||'3'}
								, {sField: 'comboedit', sLabel: _lc2('ColNum', 'Number of columns'), vItems: vNums, sInit: localStorage.getItem(sCfgKey2)||'4'}
								, {sField: "comboedit", sLabel: _lc2('Width', 'Width of table'), vItems: vWidths, sInit: localStorage.getItem(sCfgKey3)||'60%', bReq: false}
							];

					var vRes=input(plugin.getScriptTitle(), vFields, {nMinSize: 500, nSpacing: 10, vMargins: [6, 0, 30, 0], bVert: true});
					if(vRes && vRes.length>=3){

						var nRows=parseInt(vRes[0]), nCols=parseInt(vRes[1]), sWidth=_trim(vRes[2]||'');

						var sAttr=''; //2015.8.5 prefer using CSS in <table>, rather than HTML properties: sAttr='border=1 cellpadding=5 cellspacing=0';
						//var sCustom='empty-cells: show; margin-left: 0px; background-color:#EAF2D3;'; //2015.9.16 'margin-left: 1em' conflicts with width=100%;
						var sCustom='border-collapse: collapse; border: 1px solid gray; border-width: 2px 1px 2px 1px;' //2016.7.23 add essential style in case of its absence in <style>
								+ ' table-layout: automatic; empty-cells: show; word-break: break-all; margin-left: 0px;'
								+ ' background-color: transparent;' //2016.7.13 bgcolor;
						;

						if(nRows>0 && nCols>0){

							localStorage.setItem(sCfgKey1, nRows);
							localStorage.setItem(sCfgKey2, nCols);
							localStorage.setItem(sCfgKey3, sWidth);

							var sTBody='';
							for(var i=0; i<nRows; ++i){
								var sCells='';
								for(var j=0; j<nCols; ++j){
									sCells+='<td style="border: 1px solid gray; padding: 4px;"><br /></td>';
								}
								sTBody+='<tr>'+sCells+'</tr>';
							}

							//2015.8.7 The table/col/row specific utilities don't work with <thead>;
							//var sTHead='';
							//for(var j=0; j<nCols; ++j){
							//	sTHead+='<th><br /></th>';
							//}

							var sHtml='<table %ATTR% style="%WIDTH% %CUSTOM%">'
							.replace(/%ATTR%/gi, sAttr)
							.replace(/%CUSTOM%/gi, sCustom)
							.replace(/%WIDTH%/gi, sWidth ? 'width: '+sWidth+';' : '')
							//+ '<thead>' + sTHead + '</thead>'
							 + '<tbody>' + sTBody + '</tbody>'
							 + '</table>'
							;

							plugin.replaceSelectedText(-1, sHtml, true);

						}else{
							alert('Bad input of row/column numbers.');
						}
					}

				}else if(sEditor==='richedit'){


					var sCfgKey1='InsertTable.Rich.nRows', sCfgKey2='InsertTable.Rich.nCols', sCfgKey3='InsertTable.Rich.nWidth';

					var vWidths=[
								'200px', '300px', '400px', '500px', '600px', '700px', '800px', '900px'
								, '1000px', '1200px', '1500px', '1800px', '2000px', '2500px', '3000px'
							];

					var vNums=[], nMax=30;
					for(var i=0; i<nMax; ++i){
						vNums.push(i+1);
					}

					var vFields = [
								{sField: 'comboedit', sLabel: _lc2('RowNum', 'Number of rows'), vItems: vNums, sInit: localStorage.getItem(sCfgKey1)||'3'}
								, {sField: 'comboedit', sLabel: _lc2('ColNum', 'Number of columns'), vItems: vNums, sInit: localStorage.getItem(sCfgKey2)||'4'}
								, {sField: "comboedit", sLabel: _lc2('Width', 'Width of table'), vItems: vWidths, sInit: localStorage.getItem(sCfgKey3)||'400px', bReq: false}
							];

					var vRes=input(plugin.getScriptTitle(), vFields, {nMinSize: 500, nSpacing: 10, vMargins: [6, 0, 30, 0], bVert: true});
					if(vRes && vRes.length>=3){

						var nRows=parseInt(vRes[0]), nCols=parseInt(vRes[1]), nWidth=parseInt((vRes[2]||'').replace(/[a-zA-Z]+$/, ''));

						if(nRows>0 && nCols>0){

							localStorage.setItem(sCfgKey1, nRows);
							localStorage.setItem(sCfgKey2, nCols);
							localStorage.setItem(sCfgKey3, nWidth);

							var w=Math.floor(nWidth/nCols);

							var sTBody='';
							for(var i=0; i<nRows; ++i){
								var sCells='';
								for(var j=0; j<nCols; ++j){
									sCells+='<td %WIDTH%></td>'.replace(/%WIDTH%/g, (w>0 ? 'width='+w : ''));
								}
								sTBody+='<tr>'+sCells+'</tr>';
							}

							var sHtml='<table border=1 cellpadding=3 cellspacing=0 %WIDTH%>'.replace(/%WIDTH%/g, (nWidth>0 ? 'width='+nWidth : ''))
									+ sTBody
									+ '</table>'
							;

							plugin.replaceSelectedText(-1, sHtml, true);

						}
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
