
/////////////////////////////////////////////////////////////////////
// Extension scripts for Mybase Desktop v8.x
// Copyright 2010-2020 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////

var sTitle="Bash";

var sTags_BASH=
		'if,fi,then,elif,else,for,do,done,until,while,break,continue,case,function,return,in,eq,ne,ge,le'
		;

var sTags_BASHBI=
		'alias,apropos,awk,basename,bash,bc,bg,builtin,bzip2,cal,cat,cd,cfdisk,chgrp,chmod,chown,chroot'
		+',cksum,clear,cmp,comm,command,cp,cron,crontab,csplit,cut,date,dc,dd,ddrescue,declare,df'
		+',diff,diff3,dig,dir,dircolors,dirname,dirs,du,echo,egrep,eject,enable,env,ethtool,eval'
		+',exec,exit,expand,export,expr,false,fdformat,fdisk,fg,fgrep,file,find,fmt,fold,format'
		+',free,fsck,ftp,gawk,getopts,grep,groups,gzip,hash,head,history,hostname,id,ifconfig'
		+',import,install,join,kill,less,let,ln,local,locate,logname,logout,look,lpc,lpr,lprint'
		+',lprintd,lprintq,lprm,ls,lsof,make,man,mkdir,mkfifo,mkisofs,mknod,more,mount,mtools'
		+',mv,netstat,nice,nl,nohup,nslookup,open,op,passwd,paste,pathchk,ping,popd,pr,printcap'
		+',printenv,printf,ps,pushd,pwd,quota,quotacheck,quotactl,ram,rcp,read,readonly,renice'
		+',remsync,rm,rmdir,rsync,screen,scp,sdiff,sed,select,seq,set,sftp,shift,shopt,shutdown'
		+',sleep,sort,source,split,ssh,strace,su,sudo,sum,symlink,sync,tail,tar,tee,test,time'
		+',times,touch,top,traceroute,trap,tr,true,tsort,tty,type,ulimit,umask,umount,unalias'
		+',uname,unexpand,uniq,units,unset,unshar,useradd,usermod,users,uuencode,uudecode,v,vdir'
		+',vi,watch,wc,whereis,which,who,whoami,Wget,xargs,yes'
		;

var vTags=[
	{tags: sTags_BASH, nocase: false, classname: 'tag'}
	, {tags: sTags_BASHBI, nocase: false, classname: 'tag1'}

	, {pattern: "\\b([0-9.]+|0x[0-9a-f]+)\\b", nocase: true, classname: 'num'}
	, {pattern: "(\"[^\"]*\"|'[^']*')", nocase: false, classname: 'string'}

	, {pattern: "#.*$", nocase: false, classname: 'rem'} //single line comments
];

var vComments=[
	//{start: '/*', end: '*/', regexp: false, nocase: false, classname: 'rem'} //multi-line comments
];
