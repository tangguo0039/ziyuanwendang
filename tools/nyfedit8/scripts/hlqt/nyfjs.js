
/////////////////////////////////////////////////////////////////////
// Extension scripts for Mybase Desktop v8.x
// Copyright 2010-2020 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////

//var sTitle="Mybase Javascript APIs"; //Comment out to delist from UI menus;

var sTags_JS=
		//js keywords
		'break,case,catch,continue,default,delete,do,else,finally,for,function'
		+ ',if,in,instanceof,new,return,switch,this,throw,try,typeof,var,void,while,with'

		//js reserved
		+ ',abstract,boolean,byte,char,class,const,debugger,double,enum,export'
		+ ',extends,final,float,goto,implements,import,int,interface,long,native'
		+ ',package,private,protected,public,short,static,super,synchronized'
		+ ',throws,transient,volatile'

		//js classes
		+ ',Array,Boolean,Date,Math,Number,Object,String,RegExp,Functions,Events'

		//js functions
		+ ',parseInt,parseFloat,setTimeout,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,escape,isFinite,isNaN'
		;

var sTags_JSConst=
		//JS window constants
		'null,undefined,NaN,E,PI,SQRT2,SQRT1_2,LN2,LN10,LOG2E,LOG10E'
		+ ',true,false'
		;

var sTags_JSDom=
		//JS DOM objects
		'window,self,document,navigator,screen,history,location,alert,confirm,prompt,Infinity,java,Packages'
		;

var sTags_JSEvent=
		//JS DOM events
		'onabort,onblur,onchange,onclick,ondblclick,onerror,onfocus,onkeydown,onkeypress,onkeyup,onload'
		+ ',onmousedown,onmousemove,onmouseout,onmouseover,onmouseup,onreset,onresize,onselect,onsubmit,onunload'
		;

var sTags_JSAPI=
		//Mybase plugins jsapi
		'_gc,beep,sleep,log,logd,loge,logw,alert,confirm,prompt,dropdown,textbox,input,form,adler32,about,aboutQt,exit,quit'
		+ ',plugin,platform,localStorage'
		+ ',ui,app,sys,backend,config,prefs'
		+ ',CNyfDb,CDbItem,CLocalFile,CLocalDir,CXmlDoc,CXmlDocument,CByteArray,CCanvas,CZip,CZipFile,CMpz,CBigInt,CAppWord,CAppOutlook,CSqlDatabase,CSqlDriver,CSqlQuery,CSqlRecord,CSqlField,CImage'
		;


var vTags=[
	{tags: sTags_JS, nocase: false, classname: 'tag'}
	, {tags: sTags_JSConst, nocase: false, classname: 'num'}
	, {tags: sTags_JSDom, nocase: false, classname: 'tag1'}
	, {tags: sTags_JSEvent, nocase: false, classname: 'tag2'}
	, {tags: sTags_JSAPI, nocase: false, classname: 'tag3'}

	, {pattern: "\\bC[A-Z][a-zA-Z0-9]+\\b", nocase: false, classname: 'tag3'} //class names starting with C...

	, {pattern: "\\b([0-9.]+|0x[0-9a-f]+)\\b", nocase: true, classname: 'num'}
	, {pattern: "(\"[^\"]*\"|'[^']*')", nocase: false, classname: 'string'}

	, {pattern: "//.*$", nocase: false, classname: 'rem'} //single line comments
];

var vComments=[
	{start: '/*', end: '*/', regexp: false, nocase: false, classname: 'rem'} //multi-line comments
];
