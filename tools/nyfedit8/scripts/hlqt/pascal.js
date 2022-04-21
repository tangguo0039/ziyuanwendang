
/////////////////////////////////////////////////////////////////////
// Extension scripts for Mybase Desktop v8.x
// Copyright 2010-2020 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////

var sTitle="Pascal";

var sTags_Keywords=
		'absolute,abstract,and,array,as,asm,assembler,at,automated,begin,case,cdecl,class,const,constructor,contains'
		+ ',default,destructor,dispid,dispinterface,div,do,downto,dynamic,else,end,except,export,exports,external,far'
		+ ',file,finalization,finally,for,forward,function,goto,if,implementation,implements,in,index,inherited'
		+ ',initialization,inline,interface,is,label,library,message,mod,name,near,nil,nodefault,not,object,of,on,or'
		+ ',out,overload,override,package,packed,pascal,private,procedure,program,property,protected,public,published'
		+ ',raise,read,readonly,record,register,reintroduce,repeat,requires,resident,resourcestring,safecall,set,shl'
		+ ',shr,stdcall,stored,string,then,threadvar,to,try,type,unit,until,uses,var,virtual,while,with,write,writeonly,xor'
		;

var vTags=[
	{tags: sTags_Keywords, nocase: false, classname: 'tag'}

	, {pattern: "\\b([0-9.]+|0x[0-9a-f]+)\\b", nocase: true, classname: 'num'}
	, {pattern: "(\"[^\"]*\"|'[^']*')", nocase: false, classname: 'string'}

	, {pattern: "\/\/.*$", nocase: false, classname: 'rem'} //single line comments
];

var vComments=[
	{start: '{', end: '}', regexp: false, nocase: false, classname: 'rem'} //multi-line comments
	, {start: '(*', end: '*)', regexp: false, nocase: false, classname: 'rem'}
];
