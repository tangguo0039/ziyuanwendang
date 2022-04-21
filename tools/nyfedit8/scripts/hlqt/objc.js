
/////////////////////////////////////////////////////////////////////
// Extension scripts for Mybase Desktop v8.x
// Copyright 2010-2020 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////

var sTitle="Objective-C";

//http://www.binpress.com/tutorial/objective-c-reserved-keywords/43
//http://www.learn-cocos2d.com/2011/10/complete-list-objectivec-20-compiler-directives/
var sTags_ObjC=
		'auto,break,case,char,const,continue,default,do,double,else,enum,extern,float,for,goto,if,inline,int,long,register'
		+ ',release'
		+ ',restrict,return,short,signed,sizeof,static,struct,switch,typedef,union,unsinged,void,volatile,while,__Bool,__Complex'
		+ ',BOOL,Class,bycopy,byref,id,IMP,in,inout,nil,NO,NULL,oneway,out,Protocol,SEL,self,super,YES'
		+ ',@interface,@end,@implementation,@protocol,@class,@public,@protected,@private,@property,@try,@throw,@catch,@finally,@synthesize,@dynamic,@selector,atomic,nonatomic,retain'
		+ ',@defs,@required,@optional,@end,@package,@end,@synchronized,@autoreleasepool,@selector,@encode,@compatibility_alias'
		+ ',#import'
		;

//https://developer.apple.com/library/prerelease/ios/documentation/Cocoa/Reference/Foundation/ObjC_classic/index.html
var sTags_ObjC_Cocoa=
		'\\b(NS[A-Z][a-zA-Z]+)\\b'
		;

var vTags=[
	{tags: sTags_ObjC, nocase: false, classname: 'tag'}
	, {pattern: sTags_ObjC_Cocoa, nocase: false, classname: 'tag1'}

	, {pattern: "\\b([0-9.]+|0x[0-9a-f]+)\\b", nocase: true, classname: 'num'}
	, {pattern: "(\"[^\"]*\"|'[^']*')", nocase: false, classname: 'string'}

	, {pattern: "//.*$", nocase: false, classname: 'rem'} //single line comments
];

var vComments=[
	{start: '/*', end: '*/', regexp: false, nocase: false, classname: 'rem'} //multi-line comments
];
