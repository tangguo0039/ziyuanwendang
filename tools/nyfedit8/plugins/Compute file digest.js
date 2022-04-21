
//sValidation=nyfjs
//sCaption=Compute file digest ...
//sHint=Compute digest/checksum/hash values of specified files
//sCategory=MainMenu.Tools
//sCondition=
//sID=p.FileDigest
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

//try{
	var sCfgKey1='FileDigest.sPath', sCfgKey2='FileDigest.sAlgorithm';

	var sFilter='All files (*);;Archives (*.zip *.rar *.bz2 *.tar *.gz);;Documents (*.htm *.html *.pdf *.doc *.docx *.xls *.xlsx *.ppt *.pptx *.pages *.rtf *.txt);;Executables (*.exe *.dll *.dylib *.so);;Images (*.png *.jpg *.jpeg *.gif *.svg *.bmp)';

	var vAlgs=['SHA-1/160', 'SHA-2/224', 'SHA-2/256', 'SHA-2/384', 'SHA-2/512', 'Adler-32'];

	var vFields = [
				{sField: "files", sLabel: _lc2('SelFiles', 'Select files to computer digest values'), sInit: localStorage.getItem(sCfgKey1)||'', sFilter: sFilter}
				, {sField: "combolist", sLabel: _lc2('Algorithm', 'Select one of the digest algorithms'), sInit: localStorage.getItem(sCfgKey2)||'0', vItems: vAlgs}
			];

	var vRes = input(plugin.getScriptTitle(), vFields, {nMinSize: 550, bVert: true});
	if(vRes && vRes.length >= 2){

		var vFiles=vRes[0], iAlg=vRes[1];

		localStorage.setItem(sCfgKey1, new CLocalFile(vFiles[0]).getDirectory(false));
		localStorage.setItem(sCfgKey2, iAlg);

		var _format_date=function(t){
			var s='';
			s+=t.getFullYear()+'-'+(t.getMonth()+1)+'-'+t.getDate();
			s+=' ';
			s+=t.getHours()+':'+t.getMinutes()+':'+t.getSeconds();
			return s;
		};

		var _thousand_separators=function(n){return (n||'').toString().replace(/(\d)(?=(\d{3})+$)/g, "$1,");};

		if(vFiles && vFiles.length>0){

			localStorage.setItem(sCfgKey1, new CLocalFile(vFiles[0]).getDirectory(false));

			plugin.initProgressRange(plugin.getScriptTitle(), vFiles.length);

			var _algorithm_of=function(iAlg){
				var sAlg;
				switch(iAlg){
				case 0: sAlg='SHA160'; break;
				case 1: sAlg='SHA224'; break;
				case 2: sAlg='SHA256'; break;
				case 3: sAlg='SHA384'; break;
				case 4: sAlg='SHA512'; break;
				case 5: sAlg='ADLER32'; break;
				}
				return sAlg;
			};

			var xRes={}, sAlg=_algorithm_of(iAlg);
			for(var i in vFiles){
				var xFn=new CLocalFile(vFiles[i]);

				var bContinue=plugin.ctrlProgressBar(xFn.toStr(), 1, true);
				if(!bContinue) break;

				var sHash=xFn.digest(sAlg, false);
				if(sHash){
					if(xRes[sHash]){
						xRes[sHash].push(xFn.toStr());
					}else{
						xRes[sHash]=[xFn.toStr()];
					}
				}
			}

			var sInfo='', c=0;
			for(var sHash in xRes){
				var vFiles=xRes[sHash];
				if(vFiles && vFiles.length>0){
					c++;
					if(sInfo) sInfo+='\n';
					sInfo+=c.toString() + '. {' + sHash.replace(/_/g, '0') + '}';
					sInfo+='\n';
					for(var i in vFiles){
						var sFn=vFiles[i], xFn=new CLocalFile(sFn);
						sInfo+='    '
							+ sFn
							+ ' ('
							+ _lc('p.Common.DateModified', 'Date modified') + ': ' + _format_date(xFn.getModifyTime())
							+ '  '
							+ _lc('p.Common.FileSize', 'Size') + ': ' + _thousand_separators(xFn.getFileSize()) + ' ' + _lc('p.Common.Bytes', 'bytes')
							+ ')';
						sInfo+='\n';
					}
				}
			}

			plugin.destroyProgressBar();

			if(sInfo){
				textbox(
					{
						sTitle: plugin.getScriptTitle()
						, sDescr: _lc2('Result', 'Digest values of the selected files') + ' (' + vAlgs[iAlg] + ')'
						, sDefTxt: sInfo
						, bReadonly: true
						, bWordwrap: false
						, nWidth: 80
						, nHeight: 80
					}
				);
			}else{
				alert('No digest values available.');
			}
		}

	}

//}catch(e){
//	alert(e);
//}
