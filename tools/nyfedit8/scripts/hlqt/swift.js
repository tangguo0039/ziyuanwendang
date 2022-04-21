
/////////////////////////////////////////////////////////////////////
// Extension scripts for Mybase Desktop v8.x
// Copyright 2010-2020 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////

var sTitle="Swift";

//2015.6.18 added for Swift by wjj;
https://developer.apple.com/library/ios/documentation/Swift/Conceptual/Swift_Programming_Language/LexicalStructure.html
var sTags_Swift=
		'class,deinit,enum,extension,func,import,init,internal,let,operator,private,protocol,public'
		+ ',static,struct,subscript,typealias,var,break,case,continue,default,do,else,fallthrough'
		+ ',for,if,in,return,switch,where,while,as,dynamicType,false,is,nil,self,Self,super,true'
		+ ',associativity,convenience,dynamic,didSet,final,get,infix,inout,lazy,left,mutating,none,nonmutating'
		+ ',optional,override,postfix,precedence,prefix,Protocol,required,right,set,Type,unowned,weak,willSet'
		+ ',__COLUMN__,__FILE__,__FUNCTION__,__LINE__'
		;

var sTags_Func=
		//'\\b\\w+?(?=\\()'  //2018.1.5 the '+?' non-greedy mode seemed redundant and actually not to work!
		'\\b\\w+(?=\\()'
		;

//https://developer.apple.com/library/ios/navigation/
var sTags_Swift_Lib=
		'\\b(NS[A-Z][a-zA-Z]+'
		+ '|UI[A-Z][a-zA-Z]+'
		+ '|CI[A-Z][a-zA-Z]+'
		+ '|CK[A-Z][a-zA-Z]+'
		+ '|CF[A-Z][a-zA-Z]+'
		+ '|AV[A-Z][a-zA-Z]+'
		+ '|AU[A-Z][a-zA-Z]+'
		+ '|MK[A-Z][a-zA-Z]+'
		+ '|MT[A-Z][a-zA-Z]+'
		+ '|SC[A-Z][a-zA-Z]+'
		+ '|GC[A-Z][a-zA-Z]+)\\b'
		//...
		;

var vTags=[
	{tags: sTags_Swift, nocase: false, classname: 'tag'}
	, {pattern: sTags_Func, nocase: false, classname: 'tag1'}
	, {pattern: sTags_Swift_Lib, nocase: false, classname: 'tag2'}

	, {pattern: "\\b([0-9.]+|0x[0-9a-f]+)\\b", nocase: true, classname: 'num'}
	, {pattern: "(\"[^\"]*\"|'[^']*')", nocase: false, classname: 'string'}

	, {pattern: "//.*$", nocase: false, classname: 'rem'} //single line comments
];

var vComments=[
	{start: '/*', end: '*/', regexp: false, nocase: false, classname: 'rem'} //multi-line comments
];
