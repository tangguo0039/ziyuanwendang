
//sValidation=nyfjs
//sCaption=Define relative path variable ...
//sHint=Define relative path variables for local file:// hyperlinks
//sCategory=MainMenu.RelativePath
//sPosition=
//sCondition=CURDB; DBRW
//sID=p.DefineRelativePath
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

			var sVars='';
			{
				var vTmp=xNyf.listRelativePaths('predefined, userdefined').split('\n');
				for(var i in vTmp){
					var sLine=_trim(vTmp[i]);
					if(sLine){
						var f=sLine.split('\t');
						if(f.length>=2){
							var k=_trim(f[0]), v=_trim(f[1]);
							if(k){
								if(sVars) sVars+='\n';
								sVars+=(k+'\t'+v);
							}
						}
					}
				}
			}
			var vInbuilt=[];
			{
				var vTmp=xNyf.listRelativePaths('predefined, miscaliases').split('\n');
				for(var i in vTmp){
					var sLine=_trim(vTmp[i]);
					if(sLine){
						var f=sLine.split('\t');
						if(f.length>=1){
							var k=_trim(f[0]);
							if(k){
								vInbuilt.push(k);
							}
						}
					}
				}
			}

			var sCfgKey1='DefineRelativePath.sKey', sCfgKey2='DefineRelativePath.sVal', sCfgKey3='DefineRelativePath.sRem';

			var vFields = [
				       {sField: 'lineedit', sLabel: _lc2('Name', 'Name of variable [ A-Z, 0-9, _ ]'), sInit: localStorage.getItem(sCfgKey1)||'', bReq: true}
				       , {sField: 'folder', sLabel: _lc2('Path', 'Value (path to a local directory, or leave blank to remove)'), sTitle: _lc2('SelDir', 'Select a directory'), bEditable: true, sInit: localStorage.getItem(sCfgKey2)||'', bReq: false}
				       //, {sField: 'lineedit', sLabel: 'Comments', sInit: localStorage.getItem(sCfgKey3)||'', bReq: false}
				       , {sField: 'textarea', sLabel: _lc2('VarList', 'Existing variables'), sInit: sVars, bReadonly: true, bWordwrap: false, bReq: false}
				       ];

			var vRes=input(plugin.getScriptTitle(), vFields, {nMinSize: 650, vMargins: [6, 0, 30, 0], bVert: true});
			if(vRes && vRes.length>=2){

				var sKey=_trim(vRes[0]).replace(/[\r\n]/g, ''), sVal=_trim(vRes[1]).replace(/[\r\n]/g, ''), sRem=''; //_trim(vRes[2]).replace(/[\r\n]/g, '');

				sKey=sKey.replace(/[\W]/g, ''); //get rid of invalid charecters;
				sVal=sVal.replace(/\\/g, '/'); //only slashes, rather than backslashes;

				if(sKey){

					if(vInbuilt.indexOf(sKey.toUpperCase())>=0){
						alert(_lc2('Unchangeable', 'Cannot modify the inbuilt variable.') + '\n\n' + '${' + sKey.toUpperCase() + '}');
					}else{

						localStorage.setItem(sCfgKey1, sKey);
						localStorage.setItem(sCfgKey2, sVal);
						localStorage.setItem(sCfgKey3, sRem);

						if(xNyf.setRelativePath(sKey, sVal, sRem)){
							var sMsg='';
							if(sVal) sMsg=('Successfully defined the relative path variable.');
							else sMsg=('Successfully removed the relative path variable.');
							sMsg+='\n\n'+'${'+sKey.toUpperCase()+'}';
							if(sVal) sMsg+=' = '+sVal;
							alert(sMsg);
						}else{
							alert('Failed to set the relative path.');
						}
					}
					
				}else{
					alert('Bad input of variable name. \n\nAccepted characters: A-Z, 0-9, _');
				}
			}
		}
	}

//}catch(e){
//	alert(e);
//}
