
/////////////////////////////////////////////////////////////////////
// Extension scripts for Mybase Desktop v8.x
// Copyright 2010-2020 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////

var sTitle="Ruby";

var sTags_Ruby=
	'alias,and,BEGIN,begin,break,case,class,def,define_method,defined,do,each,else,elsif'
	+ ',END,end,ensure,false,for,if,in,module,new,next,nil,not,or,raise,redo,rescue,retry,return'
	+ ',self,super,then,throw,true,undef,unless,until,when,while,yield'
	;

var sTags_RubyBI=
	'Array,Bignum,Binding,Class,Continuation,Dir,Exception,FalseClass,File::Stat,File,Fixnum,Fload'
	+',Hash,Integer,IO,MatchData,Method,Module,NilClass,Numeric,Object,Proc,Range,Regexp,String,Struct::TMS,Symbol'
	+',ThreadGroup,Thread,Time,TrueClass'
	;

var vTags=[
	{tags: sTags_Ruby, nocase: false, classname: 'tag'}
	, {tags: sTags_RubyBI, nocase: false, classname: 'tag1'}

	, {pattern: "\\b([0-9.]+|0x[0-9a-f]+)\\b", nocase: true, classname: 'num'}
	, {pattern: "(\"[^\"]*\"|'[^']*')", nocase: false, classname: 'string'}

	, {pattern: "#.*$", nocase: false, classname: 'rem'} //single line comments
];

var vComments=[
	{start: '=begin', end: '=end', regexp: false, nocase: false, classname: 'rem'} //multi-line comments
];
