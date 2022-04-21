
/////////////////////////////////////////////////////////////////////
// Extension scripts for Mybase Desktop v8.x
// Copyright 2010-2020 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////

var sTitle="Rust";

var sTags_Keywords=
		'abstract,alignof,as,become,box,break,const,continue,crate'
		+ ',do,else,enum,extern,false,final,fn,for,if,impl,in,let'
		+ ',loop,macro,match,mod,move,mut,offsetof,override,priv'
		+ ',proc,pub,pure,ref,return,Self,self,sizeof,static,struct'
		+ ',super,trait,true,type,typeof,unsafe,unsized,use,virtual'
		+ ',where,while,yield'
		;


var vTags=[
	{tags: sTags_Keywords, nocase: false, classname: 'tag3'}

	, {pattern: "\\b([0-9.]+|0x[0-9a-f]+)\\b", nocase: true, classname: 'num'}
	, {pattern: "(\"[^\"]*\"|'[^']*')", nocase: false, classname: 'string'}

	, {pattern: "//.*$", nocase: false, classname: 'rem'} //single line comments
];

var vComments=[
	{start: '/*', end: '*/', regexp: false, nocase: false, classname: 'rem'} //multi-line comments
];
