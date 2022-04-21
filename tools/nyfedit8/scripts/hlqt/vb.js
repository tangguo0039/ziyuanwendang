
/////////////////////////////////////////////////////////////////////
// Extension scripts for Mybase Desktop v8.x
// Copyright 2010-2020 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////

var sTitle="Visual Basic";

var sTags_VB_Reserved=
	'AddHandler,AddressOf,Alias,And,AndAlso,As,Boolean,ByRef,Byte,ByVal'
	+ ',Call,Case,Catch,CBool,CByte,CChar,CDate,CDec,CDbl,Char,CInt,Class'
	+ ',CLng,CObj,Const,Continue,CSByte,CShort,CSng,CStr,CType,CUInt,CULng'
	+ ',CUShort,Date,Decimal,Declare,Default,Delegate,Dim,DirectCast,Do'
	+ ',Double,Each,Else,ElseIf,End,EndIf,Enum,Erase,Error,Event,Exit,False'
	+ ',Finally,For,Friend,Function,Get,GetType,Global,GoSub,GoTo,Handles,If'
	+ ',Implements,Imports,In,Inherits,Integer,Interface,Is,IsNot,Let,Lib,Like'
	+ ',Long,Loop,Me,Mod,Module,MustInherit,MustOverride,MyBase,MyClass,Namespace'
	+ ',Narrowing,New,Next,Not,Nothing,NotInheritable,NotOverridable,Object,Of,On'
	+ ',Operator,Option,Optional,Or,OrElse,Overloads,Overridable,Overrides,ParamArray'
	+ ',Partial,Private,Property,Protected,Public,RaiseEvent,ReadOnly,ReDim,REM,RemoveHandler'
	+ ',Resume,Return,SByte,Select,Set,Shadows,Shared,Short,Single,Static,Step,Stop'
	+ ',String,Structure,Sub,SyncLock,Then,Throw,To,True,Try,TryCast,TypeOf,Variant'
	+ ',Wend,UInteger,ULong,UShort,Using,When,While,Widening,With,WithEvents,WriteOnly'
	+ ',Xor,#Const,#Else,#ElseIf,#End,#If'
	;

var sTags_VB_Unreserved=
	'Ansi,Assembly,Auto,Binary,Compare,Custom,Explicit,IsFalse,IsTrue,Mid,Off'
	+ ',Preserve,Strict,Text,Unicode,Until,#ExternalSource,#Region'
	;
var vTags=[
	{tags: sTags_VB_Reserved, nocase: true, classname: 'tag'}
	, {tags: sTags_VB_Unreserved, nocase: true, classname: 'tag1'}

	, {pattern: "\\b([0-9.]+|0x[0-9a-f]+)\\b", nocase: true, classname: 'num'}
	, {pattern: "(\"[^\"]*\"|'[^']*')", nocase: false, classname: 'string'}

	, {pattern: "REM.*$", nocase: false, classname: 'rem'} //single line comments
	, {pattern: "'.*$", nocase: false, classname: 'rem'} //single line comments
];

var vComments=[
	//{start: '/*', end: '*/', regexp: false, nocase: false, classname: 'rem'} //multi-line comments
];
