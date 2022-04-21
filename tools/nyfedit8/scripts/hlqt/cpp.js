
/////////////////////////////////////////////////////////////////////
// Extension scripts for Mybase Desktop v8.x
// Copyright 2010-2020 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////

var sTitle="C C++ STL Qt";

var sTags_Cpp=
	//c
	'null,defined'

	//for C (ISO/ANSI C90)
	+ ',auto,break,case,char,const,continue,default,do,double,else,enum,extern'
	+ ',float,for,goto,if,inline,int,long,register,restrict,return'
	+ ',short,signed,sizeof,static,struct,switch,typedef'
	+ ',union,unsigned,void,volatile,while'

	//for C (ISO/ANSI C99 appendix)
	+ ',_Bool,_Complex,_Imaginary'

	//for C++
	+ ',and,and_eq,asm,bitand,bitor,bool,catch,class,compl'
	+ ',const_cast,delete,dynamic_cast,explicit,export,false,friend'
	+ ',mutable,namespace,new,not,not_eq,operator,or,or_eq'
	+ ',private,protected,public,reinterpret_cast,static_cast'
	+ ',template,this,throw,true,try,typeid,typename,using'
	+ ',wchar_t,virtual,xor,xor_eq'

	//for C++0x
	+ ',alignof,char16_t,char32_t,constexpr,decltype,noexcept,nullptr'
	+ ',static_assert,thread_local'
	;

var sTags_Stl=
	'std,exception'
	+ ',string,list,vector,stack,pair,map,set,multimap,multiset,queue,deque'
	+ ',priority_queue,bitset,valarray'
	+ ',cin,cout,cerr,clog,wcin,wcout,wcerr,wclog'
	+ ',ios,fstream,wfstream,ifstream,wifstream,ofstream,wofstream'
	+ ',istream,wistream,ostream,wostream,streambuf,wstreambuf'
	+ ',stringstream,wstringstream,istringstream,wistringstream,ostringstream,wostringstream'
	+ ',strstream,istrstream,wistrstream,ostrstream,wostrstream'
	+ ',iterator,const_iterator,reverse_iterator,const_reverse_iterator'
	+ ',back_insert_iterator,front_insert_iterator,insert_iterator'
	+ ',istream_iterator,ostream_iterator,istreambuf_iterator,ostreambuf_iterator'
	;

var sTags_Qt=
	'\\b('
	+ 'qint8|qint16|qint32|qint64|qlonglong|qptrdiff|qreal|quint8|quint16|quint32|quint64|quintptr|qulonglong|uchar|uint|ulong|ushort'
	+ '|foreach|Q_FOREACH'
	+ '|QT_\\w\+|Q_\\w\+' //global Macros
	+ '|q[A-Z]\\w\+|qgetenv|qputenv|qrand|qsrand|qtTrId' //gloabl Functions
	+ '|Q\\w\+' //Qt widgets/classes
	+ ')\\b'
	;

var vTags=[
	{tags: sTags_Cpp, nocase: false, classname: 'tag'}
	, {tags: sTags_Stl, nocase: false, classname: 'stl'}
	, {pattern: sTags_Qt, nocase: false, classname: 'qt'}

	, {pattern: "\\b([0-9.]+|0x[0-9a-f]+)\\b", nocase: true, classname: 'num'}
	, {pattern: "(\"[^\"]*\"|'[^']*')", nocase: false, classname: 'string'}
	//, {pattern: "(\\b[a-zA-Z:]+)\\s*([&~%\\|\\^\\*\\!\\+\\-]?=)", nocase: true, classname: 'lvalue'}

	, {pattern: "#(include|if|elif|else|endif|ifdef|ifndef|define|defined|undef|error|line|pragma)\\b", nocase: true, classname: 'directive'}
	, {pattern: "//.*$", nocase: false, classname: 'rem'} //single line comments
];

var vComments=[
	{start: '/*', end: '*/', regexp: false, nocase: false, classname: 'rem'} //multi-line comments
];
