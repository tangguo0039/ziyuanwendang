
//sValidation=nyfjs
//sCaption=Edit stylesheet for Html/Markdown documents ...
//sHint=Edit stylesheet for HTML/Markdown rendering
//sCategory=MainMenu.Tools; Context.Action.Markdown; Context.Markdown; Context.HtmlEdit; Context.HtmlView
//sCondition=
//sID=p.CssForHtmlDoc
//sAppVerMin=8.0
//sAuthor=wjjsoft

/////////////////////////////////////////////////////////////////////
// Extension scripts for Mybase Desktop v8.x
// Copyright 2010-2022 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////


let _lc=function(sTag, sDef){return plugin.getLocaleMsg(sTag, sDef);};
let _lc2=function(sTag, sDef){return _lc(plugin.getLocaleID()+'.'+sTag, sDef);};

//try{

	let vCssFiles=[], bCommonFiles=false;
	if(1){
		let sFilter='htmldoc*.css', sAttr='files+readable+writable', sSort='name';
		let xDir=new CLocalDir(plugin.getPathToCurUITheme());
		if(xDir.isDirectory()){
			let v=xDir.listFiles(sFilter, sAttr, sSort);
			if(v && v.length>0){
				//vCssFiles=vCssFiles.concat(v);
				for(let s of v){
					if(s){
						s=new CLocalFile(xDir.toStr(), s).toStr();
						if(vCssFiles.indexOf(s)<0){
							vCssFiles.push(s);
						}
					}
				}
			}
			if(xDir.equals(plugin.getPathToCommonUITheme())) bCommonFiles=true;
		}
		xDir=new CLocalDir(plugin.getPathToBaseUITheme());
		if(xDir.isDirectory()){
			let v=xDir.listFiles(sFilter, sAttr, sSort);
			if(v && v.length>0){
				//vCssFiles=vCssFiles.concat(v);
				for(let s of v){
					if(s){
						s=new CLocalFile(xDir.toStr(), s).toStr();
						if(vCssFiles.indexOf(s)<0){
							vCssFiles.push(s);
						}
					}
				}
			}
			if(xDir.equals(plugin.getPathToCommonUITheme())) bCommonFiles=true;
		}
	}

	let sCfgKey1='CssForHtmlDoc.iSel';

	while(1){

		let vFields = [
			    {sField: "combolist", sLabel: _lc2('Files', 'List of stylesheet files customizable for Html/Markdown rendering under current UI theme:'), vItems: vCssFiles, nInit: localStorage.getItem(sCfgKey1)||0}
		    ];

		if(bCommonFiles){
			vFields.push({sField: 'label', sText: _lc2('Notes', 'If any changes made to the common theme files that will apply to all descendant themes which inherits from the common theme settings. It is recommended to create a new UI theme for customization rather than modifying the inbuilt theme files.'), bWordwrap: true});
		}

		let vRes = input(plugin.getScriptTitle(), vFields, {nMinSize: 500, vMargins: [8, 0, 80, 0], bVert: true});
		if(vRes && vRes.length>0){
			let iSel=vRes[0];

			localStorage.setItem(sCfgKey1, iSel);

			if(iSel>=0 && iSel<vCssFiles.length){
				let sFn=vCssFiles[iSel];
				let xFn=new CLocalFile(sFn);
				if(xFn.exists()){
					let sCss=xFn.loadText('auto');
					let sMsg=_lc2('Stylesheet', 'Stylesheet for Html/Markdown rendering') + ": " + xFn.toStr();
					sCss=textbox({
							     sTitle: plugin.getScriptTitle()
							     , sDescr: sMsg
							     , sDefTxt: sCss
							     , bReadonly: false
							     , bWordwrap: false
							     , bFind: true
							     , bFont: true
							     , bRich: false
							     , nWidth: 85
							     , nHeight: 80
							     , sBtnOK: _lc('p.Common.SaveChanges', 'Save changes')
							     , sSyntax: 'css'
						     });

					if(sCss){
						if(xFn.saveUtf8(sCss)>0){
							plugin.refreshDocViews(-1, '');
						}else{
							alert('Failed to save changes to the stylesheet file.' + '\n\n' + xFn.toStr());
						}
					}
				}else{
					alert(_lc('Prompt.Failure.FileNotFound', 'File not found.') + '\n\n' + xFn.toStr());
				}
			}
		}else break;
	}

//}catch(e){
//	alert(e);
//}
