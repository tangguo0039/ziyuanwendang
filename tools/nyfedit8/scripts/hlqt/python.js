
/////////////////////////////////////////////////////////////////////
// Extension scripts for Mybase Desktop v8.x
// Copyright 2010-2020 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////

var sTitle="Python";

//https://docs.python.org/2/library/functions.html

//https://www.programiz.com/python-programming/keyword-list
//>>> import keyword
//>>> print(keyword.kwlist)
//['False', 'None', 'True', 'and', 'as', 'assert', 'break', 'class', 'continue', 'def', 'del'
//, 'elif', 'else', 'except', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is'
//, 'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield']

var sTags_Python0=
		'False,None,True,and,as,assert,break,class,continue,def,del'
		+ ',elif,else,except,finally,for,from,global,if,import,in,is'
		+ ',lambda,nonlocal,not,or,pass,raise,return,try,while,with,yield'
		;

var sTags_Python1=
		'abs,all,any,apply,basestring,bin,bool,buffer,callable'
		+ ',chr,classmethod,cmp,coerce,compile,complex,delattr,dict,dir'
		+ ',divmod,enumerate,eval,execfile,file,filter,float,format,frozenset'
		+ ',getattr,globals,hasattr,hash,help,hex,id,input,int,intern'
		+ ',isinstance,issubclass,iter,len,list,locals,long,map,max,min,next'
		+ ',object,oct,open,ord,pow,print,property,range,raw_input,reduce'
		+ ',reload,repr,reversed,round,set,setattr,slice,sorted,staticmethod'
		+ ',str,sum,super,tuple,type,type,unichr,unicode,vars,xrange,zip,__import__'
		+ ',self'
		;

var vTags=[
	{tags: sTags_Python0, nocase: false, classname: 'tag'}
	, {tags: sTags_Python1, nocase: false, classname: 'tag1'}

	, {pattern: "\\b([0-9.]+|0x[0-9a-f]+)\\b", nocase: true, classname: 'num'}
	, {pattern: "(\"[^\"]*\"|'[^']*')", nocase: false, classname: 'string'}

	, {pattern: "#.*$", nocase: false, classname: 'rem'} //single line comments
];

var vComments=[
	//{start: "'''", end: "'''", regexp: false, nocase: false, classname: 'rem'} //multi-line comments
];
