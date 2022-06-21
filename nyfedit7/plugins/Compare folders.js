
//sValidation=nyfjs
//sCaption=Compare folders ...
//sHint=Compare two specified folders and report difference
//sCategory=MainMenu.Tools
//sID=p.CompareFolders
//sAppVerMin=7.0
//sShortcutKey=
//sAuthor=wjjsoft

var _lc=function(sTag, sDef){return plugin.getLocaleMsg(sTag, sDef);};
var _lc2=function(sTag, sDef){return _lc(plugin.getLocaleID()+'.'+sTag, sDef);};

var _trim=function(s){return (s||'').replace(/^\s+|\s+$/g, '');};
var _trim_cr=function(s){return (s||'').replace(/\r+$/g, '');};

var sCfgKey='CompareFolders.Dir1';
var sMsg=_lc2('SelDir1', 'Select the first folder to compare:');
var sDir1=platform.browseForFolder(sMsg, localStorage.getItem(sCfgKey)||'');
if(sDir1){

	localStorage.setItem(sCfgKey, sDir1);

	sCfgKey='CompareFolders.Dir2';
	sMsg=_lc2('SelDir2', 'Select the second folder to compare with:');
	var sDir2=platform.browseForFolder(sMsg, localStorage.getItem(sCfgKey)||'');
	if(sDir2){

		localStorage.setItem(sCfgKey, sDir2);

		var _load_file_entries=function(sDir, xRes, xMisc){
			var xFld=new CLocalDir(sDir);
			var v=xFld.listFiles(), nBytes=0;
			for(var i in v){
				var sName=v[i];
				var xFn=new CLocalFile(sDir); xFn.append(sName);
				var nSize=xFn.getFileSize();
				xRes[sName]={nSize: nSize, tMod: xFn.getModifyTime()};
				nBytes+=nSize;
			}
			xMisc['nBytes']=nBytes;
			xMisc['nFiles']=v.length;
		};

		var _format_date=function(t){
			var s='';
			s+=t.getFullYear()+'-'+t.getMonth()+'-'+t.getDate();
			s+=' ';
			s+=t.getHours()+':'+t.getMinutes()+':'+t.getSeconds();
			return s;
		};

		var iMissing=0, iDiffSize=1, iDiffDate=2;

		var _compare_existence=function(v1, v2){
			var vDiff=[];
			for(var j in v1){
				plugin.showProgressMsg(j);
				if(!v2[j]){
					vDiff[vDiff.length]={sTag: j, iType: iMissing};
				}
			}
			return vDiff;
		};

		var _compare_filesize=function(v1, v2){
			var vDiff=[];
			for(var j in v1){
				plugin.showProgressMsg(j);
				if(v2[j]){
					var r1=v1[j], r2=v2[j];
					if(r1.nSize != r2.nSize){
						vDiff[vDiff.length]={sTag: j, iType: iDiffSize, nSize1: r1.nSize, nSize2: r2.nSize};
					}
				}
			}
			return vDiff;
		};

		var _compare_filedate=function(v1, v2){
			var vDiff=[];
			for(var j in v1){
				plugin.showProgressMsg(j);
				if(v2[j]){
					var r1=v1[j], r2=v2[j];
					var t1=_format_date(r1.tMod), t2=_format_date(r2.tMod);
					if(t1 != t2){
						vDiff[vDiff.length]={sTag: j, iType: iDiffDate, tMod1: t1, tMod2: t2};
					}
				}
			}
			return vDiff;
		};

		var _format_msg=function(vDiff){
			var s='';
			for(var i in vDiff){
				var d=vDiff[i];
				s+='\n';
				switch(d.iType){
					case iMissing:
						s+='    '; //'\t';
						s+=d.sTag;
						break;
					case iDiffSize:
						s+='    '; //'\t';
						s+=d.sTag;
						s+='    '; //'\t';
						s+=d.nSize1+' <--> '+d.nSize2;
						break;
					case iDiffDate:
						s+='    '; //'\t';
						s+=d.sTag;
						s+='    '; //'\t';
						s+=d.tMod1+' <--> '+d.tMod2;
						break;
				}
			}
			return s;
		};

		var _compare_folder=function(v1, v2, bLookAtAttr){

			var s='', vDiff;

			vDiff=_compare_existence(v1, v2);
			if(vDiff.length>0){
				s+='\n\nFiles missing in the latter:';
				s+=_format_msg(vDiff);
			}else{
				//s+='\n\t';
				//s+='** All looks fine **';
			}

			if(bLookAtAttr){
				vDiff=_compare_filesize(v1, v2);
				if(vDiff.length>0){
					s+='\n\nDifference in file size:';
					s+=_format_msg(vDiff);
				}else{
					//s+='\n\t';
					//s+='** All looks fine **';
				}

				vDiff=_compare_filedate(v1, v2);
				if(vDiff.length>0){
					s+='\n\nDifference in date modified:';
					s+=_format_msg(vDiff);
				}else{
					//s+='\n\t';
					//s+='** All looks fine **';
				}
			}

			return s;
		};

		var _do_compare=function(d1, d2){

			var res1={}, res2={}, misc1={}, misc2={};
			_load_file_entries(d1, res1, misc1);
			_load_file_entries(d2, res2, misc2);

			var s='';

			s+='Comparing <'+d1+'> to <'+d2+'>';
			s+=_compare_folder(res1, res2, true);

			s+='\n\n';
			s+='Comparing <'+d2+'> to <'+d1+'>';
			s+=_compare_folder(res2, res1, false);

			return s;
		};

		var sInfo=_do_compare(sDir1, sDir2);

		plugin.destroyProgressBar();
		textbox(
			{
				sTitle: plugin.getScriptTitle()
				, sDescr: _lc2('Descr', 'Difference between the 2 folders;')
				, sDefTxt: sInfo
				, bReadonly: true
				, bWordwrap: false
				, nWidth: 50
				, nHeight: 80
			}
		);
	}
}
