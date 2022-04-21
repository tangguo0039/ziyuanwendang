
/////////////////////////////////////////////////////////////////////
// Extension scripts for Mybase Desktop v8.x
// Copyright 2010-2020 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////

var sTitle="SQL";

var sTags_Keywords=
		'add,exit,primary'
		+ ',all,fetch,print'
		+ ',alter,file,privileges'
		+ ',and,fillfactor,proc'
		+ ',any,floppy,procedure'
		+ ',as,for,processexit'
		+ ',asc,foreign,public'
		+ ',authorization,freetext,raiserror'
		+ ',avg,freetexttable,read'
		+ ',backup,from,readtext'
		+ ',begin,full,reconfigure'
		+ ',between,goto,references'
		+ ',break,grant,repeatable'
		+ ',browse,group,replication'
		+ ',bulk,having,restore'
		+ ',by,holdlock,restrict'
		+ ',cascade,identity,return'
		+ ',case,identity_insert,revoke'
		+ ',check,identitycol,right'
		+ ',checkpoint,if,rollback'
		+ ',close,in,rowcount'
		+ ',clustered,index,rowguidcol'
		+ ',coalesce,inner,rule'
		+ ',column,insert,save'
		+ ',commit,intersect,schema'
		+ ',committed,into,select'
		+ ',compute,is,serializable'
		+ ',confirm,isolation,session_user'
		+ ',constraint,join,set'
		+ ',contains,key,setuser'
		+ ',containstable,kill,shutdown'
		+ ',continue,left,some'
		+ ',controlrow,level,statistics'
		+ ',convert,like,sum'
		+ ',count,lineno,system_user'
		+ ',create,load,table'
		+ ',cross,max,tape'
		+ ',current,min,temp'
		+ ',current_date,mirrorexit,temporary'
		+ ',current_time,national,textsize'
		+ ',current_timestamp,nocheck,then'
		+ ',current_user,nonclustered,to'
		+ ',cursor,not,top'
		+ ',database,null,tran'
		+ ',dbcc,nullif,transaction'
		+ ',deallocate,of,trigger'
		+ ',declare,off,truncate'
		+ ',default,offsets,tsequal'
		+ ',delete,on,uncommitted'
		+ ',deny,once,union'
		+ ',desc,only,unique'
		+ ',disk,open,update'
		+ ',distinct,opendatasource,updatetext'
		+ ',distributed,openquery,use'
		+ ',double,openrowset,user'
		+ ',drop,option,values'
		+ ',dummy,or,varying'
		+ ',dump,order,view'
		+ ',else,outer,waitfor'
		+ ',end,over,when'
		+ ',errlvl,percent,where'
		+ ',errorexit,perm,while'
		+ ',escape,permanent,with'
		+ ',except,pipe,work'
		+ ',exec,plan,writetext'
		+ ',execute,precision'
		+ ',exists,prepare'
		;


var vTags=[
	{tags: sTags_Keywords, nocase: true, classname: 'tag'}

	, {pattern: "\\b([0-9.]+|0x[0-9a-f]+)\\b", nocase: true, classname: 'num'}
	, {pattern: "(\"[^\"]*\"|'[^']*')", nocase: false, classname: 'string'}

	, {pattern: "--.*$", nocase: false, classname: 'rem'} //single line comments
];

var vComments=[
	//{start: '/*', end: '*/', regexp: false, nocase: false, classname: 'rem'} //multi-line comments
];
