
/////////////////////////////////////////////////////////////////////
// Extension scripts for Mybase Desktop v8.x
// Copyright 2010-2020 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////

var sTitle="Java";

var sTags_Keywords=
	'abstract,boolean,break,byte,case,catch,char,class,continue,default'
	+ ',do,double,else,enum,extends,false,final,finally,float,for'
	+ ',if,implements,import,instanceof,int,interface,long,native,new,null'
	+ ',package,private,protected,public,return,short,static,strictfp,super,switch'
	+ ',synchronized,this,throw,throws,transient,true,try,void,volatile,while'
	+ ',const,goto'
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
