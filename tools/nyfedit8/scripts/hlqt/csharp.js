
/////////////////////////////////////////////////////////////////////
// Extension scripts for Mybase Desktop v8.x
// Copyright 2010-2020 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////

var sTitle="C#";

var sTags_Keywords=
		'abstract,event,new,struct,as,explicit,null,switch,base,extern,object,this'
		+ ',bool,false,operator,throw,break,finally,out,true,byte,fixed,override,try'
		+ ',case,float,params,typeof,catch,for,private,uint,char,foreach,protected,ulong'
		+ ',class,if,readonly,unsafe,const,implicit,ref,ushort,continue,in,return,using'
		+ ',decimal,int,sbyte,virtual,default,interface,sealed,volatile,delegate,internal,short,void'
		+ ',do,is,sizeof,while,double,lock,stackalloc,else,long,static,enum,namespace,string'
;

var vTags=[
	{tags: sTags_Keywords, nocase: false, classname: 'tag'}

	, {pattern: "\\b([0-9.]+|0x[0-9a-f]+)\\b", nocase: true, classname: 'num'}
	, {pattern: "(\"[^\"]*\"|'[^']*')", nocase: false, classname: 'string'}

	, {pattern: "//.*$", nocase: false, classname: 'rem'} //single line comments
];

var vComments=[
	{start: '/*', end: '*/', regexp: false, nocase: false, classname: 'rem'} //multi-line comments
];
