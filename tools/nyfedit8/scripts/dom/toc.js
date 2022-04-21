
/////////////////////////////////////////////////////////////////////
// Essential scripts for Mybase Desktop v8.x
// Copyright 2010-2022 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////

var __xToc={

	internalTagForTocPane: function(){return 'ID_NYF_TOC_PANE';} //2020.1.22 hard-coded 'id' to identify the pane so it can be ignored when exporting contents;

	, tocExists: function(){return document.getElementById(this.internalTagForTocPane());}

	, makeToc: function(sCaption){

		//console.debug('dom.makeToc: ' + sCaption);

		//this.sCaption=sCaption||'Table of Contents';

		var _create_pane=function(id){

			if(id){
				//2021.9.9 remove existing toc if any;
				let e=document.getElementById(id);
				if(e) e.parentNode.removeChild(e);
				console.debug('updateToc: ' + sCaption + ' id=' + id);
			}else{
				console.debug('createToc: ' + sCaption + ' id=' + id);
			}

			var xDiv=document.createElement('div');
			xDiv.id=id;
			xDiv.style.display='flex';
			xDiv.style.position='fixed';
			xDiv.style.flexDirection='column';
			xDiv.style.flexWrap='nowrap';
			xDiv.style.justifyContent='flex-start';
			//xDiv.style.margin='0px';
			//xDiv.style.border='1px solid black';
			//xDiv.style.borderRadius='3px';
			////xDiv.style.paddingBottom='4px';
			//xDiv.style.backgroundColor='#fafafa';
			//xDiv.style.opacity=0.8;
			return xDiv;
		};

		var _create_titlebar=function(){
			var xDiv=document.createElement('div');
			xDiv.id='ID_NYF_TOC_TITLEBAR';
			xDiv.style.display='flex';
			xDiv.style.flexDirection='row';
			xDiv.style.flexWrap='nowrap';
			xDiv.style.justifyContent='space-between';
			//xDiv.style.backgroundColor='#f5f5f5';
			//xDiv.style.borderRadius='3px';
			//xDiv.style.padding='4px';
			//xDiv.style.borderBottom='1px solid lightgrey';
			return xDiv;
		};

		var _create_caption=function(){
			var elm=document.createElement('div');
			//elm.class='CLS_NYF_TOC_TITLETEXT'; //doesn't work????
			elm.id='ID_NYF_TOC_TITLETEXT';
			elm.append(document.createTextNode(sCaption)); //elm.innerHTML=utils.htmlEncode(sCaption);
			//elm.style.padding='6px 6px 6px 16px';
			//elm.style.fontWeight='bold';
			return elm;
		};

		var _create_button=function(){
			var elm=document.createElement('img');
			//elm.class='CLS_NYF_TOC_BTNCLOSE'; //doesn't work????
			elm.id='ID_NYF_TOC_BTNCLOSE';
			//elm.style.width='16px';
			//elm.style.height='16px';
			//elm.style.cursor='pointer';
			//elm.style.padding='2px';
			return elm;
		};

		var _create_list=function(vToc){
			var sHtml='', iTrack=-1;
			for(var t of vToc){

				if(t.level>iTrack){
					sHtml+='<ul style="padding-left:1.5em; margin-left: 4px; margin-right:0px;">';
				}else if(t.level<iTrack){
					let d=iTrack-t.level;
					while( d-- > 0 ) sHtml+='</ul>';
				}

				let s=utils.trim(t.title).replace(/[\r\n\t\s]+/g, ' ');
				sHtml+=("<li style='padding-left:0em; list-style-position:outside;' class='CLS_NYF_TOC_LISTITEM'><a href='#%ID%' class='CLS_NYF_TOC_HREF'>" + utils.htmlEncode(s) + "</a></li>").replace(/%ID%/g, t.id);

				iTrack=t.level;
			}

			if(sHtml) sHtml+='</ul>';
			var xDiv=document.createElement('div');
			//xDiv.class='CLS_NYF_TOC_LISTVIEW'; //doesn't work????
			xDiv.id='ID_NYF_TOC_LISTVIEW';
			xDiv.style.overflow='auto';
			//xDiv.style.paddingRight='0.5em';
			//xDiv.style.marginBottom='4px';
			xDiv.innerHTML=sHtml;

			//2021.7.21 qtwebengine doesn't need this event listener, it uses nyf:// scheme, that will be handled by nyf-app;
			//however, qtwebkit requires this, as file:// scheme is forcedly applied to html-editor in order to bypass CORS policies;
			dom.traverseDomChildren(xDiv, 0, null, function(xElm, iLvl){
				if(xElm.nodeName.toLowerCase()==='a'){
					xElm.addEventListener('click', function(e){
						var a=e.target, sHref=a.getAttribute('href');
						if(sHref.search(/^#.+/)===0){
							//window.location.hash=sHref;
							dom.triggerBookmarkAnchor(sHref.replace(/[#]+/g, ''));
							e.preventDefault();
							e.stopPropagation();
							e.stopImmediatePropagation();
							return false;
						}
					});
				}
			});

			return xDiv;
		};

		var vToc=[];
		dom.traverseDomBranch(document.body, 0, null, function(e, iLvl){
			var m=e.nodeName.match(/^h([1-6])$/i);
			if(m && m[1]){
				let t=utils.trim(e.textContent||'').replace(/[\r\n\t\s]+/g, ' ');
				if(t){
					//2021.7.21 it seemed that Chinese characters not working with bookmarks in qtwebkit;
					//var id=(e.id||'').replace(/-/g, '');
					var id=(e.id||'').replace(/[^a-zA-Z0-9]+/g, '');
					if(!id || document.getElementById(id)){
						do{
							id='nyf_bkmk_' + Math.floor((Math.random() * 0x7fffFFFF)).toString(16);
						}while(document.getElementById(id));
					}
					if(e.id!==id) e.id=id;
					vToc.push({tag: e.nodeName, level: parseInt(m[1]), title: e.textContent, id: e.id});
				}
			}
		});

		if(vToc.length>0){

			var xPane=_create_pane(this.internalTagForTocPane());
			var xTitle=_create_titlebar();
			var xCaption=_create_caption();
			var xClose=_create_button();
			var xList=_create_list(vToc);

			xTitle.append(xCaption);
			xTitle.append(xClose);

			xPane.append(xTitle);
			xPane.append(xList);

			xPane.style.display='none'; //2019.9.30 keep it invisible to prevent flicker during creation of TOC;

			document.body.append(xPane);

			var _showToc=function(b){
				if(b){
					xList.style.display='';
					xCaption.style.display='';
					xClose.src='nyf://appres?id=icon-by-key&ico=Btn.Close.Pane&width=32&height=32'; //'nyf://localhost/${themes}/light/btn_close_pane.svg?rawfile=1';
					xClose.setAttribute('title', '');
				}else{
					xList.style.display='none';
					xCaption.style.display='none';
					xClose.src='nyf://appres?id=icon-by-key&ico=Btn.Toc&width=32&height=32'; //'nyf://localhost/${themes}/light/btn_toc.svg?rawfile=1';
					xClose.setAttribute('title', sCaption);
					//2020.7.17 shrink size of the toc pane when closed;
					xPane.style.height='';
					xList.style.height='';
				}
			};

			var _relocate=function(n){
				xPane.style.top='4px';
				xPane.style.left=(document.body.clientWidth-xPane.offsetWidth-1) + 'px';
				xPane.style.display='flex'; //2019.9.30 show up after it's correctly located;
			};

			var s_nResize=0, _resize=function(){

				let _shrink=()=>{
					//2020.7.17 restrict size of the toc pane that must be less than the web view;
					var hMax=document.documentElement.clientHeight - 10;
					if(xPane.offsetHeight>hMax){
						xPane.style.height=hMax + 'px';
						xList.style.height=(xPane.offsetHeight-xTitle.offsetHeight) + 'px';
					}
					//2021.9.9 in case of too long headings;
					var wMax=Math.floor(document.documentElement.clientWidth / 2);
					if(xPane.offsetWidth>wMax){
						xPane.style.width=wMax + 'px';
					}
				};

				s_nResize=0;
				var iTimer=setInterval(function(){
					s_nResize++;
					_relocate(s_nResize);
					if(s_nResize>=10){
						clearInterval(iTimer);
						_shrink();
						_relocate(s_nResize); //2021.9.9 need to relocate if width of toc shrinked;
						//console.debug('======== ' + xPane.offsetHeight + ', ' + xTitle.offsetHeight);
					}
				}, 50);
			};

			if(dom.useQwe()){
				nyf.isTocVisible(function(b){
					_showToc(b);
					_resize();
				});
			}else{
				let b=nyf.isTocVisible();
				_showToc(b);
				_resize();
			}

			var _toggle=function(e){

				_showToc(xList.style.display==='none');

				nyf.setTocVisible(xList.style.display!=='none');

				_resize();
			};

			xClose.addEventListener('click', _toggle);

			window.addEventListener('resize', function(e){_relocate(0);});
		}
	}

};

if(dom) dom.extend(__xToc, 'toc');
