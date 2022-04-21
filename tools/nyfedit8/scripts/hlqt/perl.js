
/////////////////////////////////////////////////////////////////////
// Extension scripts for Mybase Desktop v8.x
// Copyright 2010-2020 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////

var sTitle="Perl";

var sTags_Perl=
		'abs,accept,alarm,atan2,bind,binmode,chdir,chmod,chomp,chop,chown,chr'
		+ ',chroot,close,closedir,connect,cos,crypt,defined,delete,each,endgrent'
		+ ',endhostent,endnetent,endprotoent,endpwent,endservent,eof,exec,exists'
		+ ',exp,fcntl,fileno,flock,fork,format,formline,getc,getgrent,getgrgid'
		+ ',getgrnam,gethostbyaddr,gethostbyname,gethostent,getlogin,getnetbyaddr'
		+ ',getnetbyname,getnetent,getpeername,getpgrp,getppid,getpriority'
		+ ',getprotobyname,getprotobynumber,getprotoent,getpwent,getpwnam,getpwuid'
		+ ',getservbyname,getservbyport,getservent,getsockname,getsockopt,glob'
		+ ',gmtime,grep,hex,index,int,ioctl,join,keys,kill,lc,lcfirst,length,link'
		+ ',listen,localtime,lock,log,lstat,map,mkdir,msgctl,msgget,msgrcv,msgsnd'
		+ ',oct,open,opendir,ord,pack,pipe,pop,pos,print,printf,prototype,push'
		+ ',quotemeta,rand,read,readdir,readline,readlink,readpipe,recv,rename'
		+ ',reset,reverse,rewinddir,rindex,rmdir,scalar,seek,seekdir,select,semctl'
		+ ',semget,semop,send,setgrent,sethostent,setnetent,setpgrp,setpriority'
		+ ',setprotoent,setpwent,setservent,setsockopt,shift,shmctl,shmget,shmread'
		+ ',shmwrite,shutdown,sin,sleep,socket,socketpair,sort,splice,split,sprintf'
		+ ',sqrt,srand,stat,study,substr,symlink,syscall,sysopen,sysread,sysseek'
		+ ',system,syswrite,tell,telldir,time,times,tr,truncate,uc,ucfirst,umask'
		+ ',undef,unlink,unpack,unshift,utime,values,vec,wait,waitpid,warn,write'
		;

var sTags_Perl2=
		'bless,caller,continue,dbmclose,dbmopen,die,do,dump,else,elsif,eval,exit'
		+ ',for,foreach,goto,if,import,last,local,my,next,no,our,package,redo,ref'
		+ ',require,return,sub,tie,tied,unless,untie,until,use,wantarray,while'
		;

var vTags=[
	{tags: sTags_Perl, nocase: false, classname: 'tag'}
	, {tags: sTags_Perl2, nocase: false, classname: 'tag1'}

	, {pattern: "\\b([0-9.]+|0x[0-9a-f]+)\\b", nocase: true, classname: 'num'}
	, {pattern: "(\"[^\"]*\"|'[^']*')", nocase: false, classname: 'string'}

	, {pattern: "#.*$", nocase: false, classname: 'rem'} //single line comments
];

var vComments=[
	{start: '=pod', end: '=cut', regexp: false, nocase: false, classname: 'rem'} //multi-line comments
];
