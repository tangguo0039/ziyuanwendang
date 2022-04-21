
/////////////////////////////////////////////////////////////////////
// Essential scripts for Mybase Desktop v8.x
// Copyright 2010-2020 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////

g_xUndoStack={

	vUndoStack: [ ]

	, vActionGroup: [ ]

	, iPos: Number(-1)

	, size: function(){return this.vUndoStack.length;}

	, isDirty: function(){
		return this.vActionGroup.length>0;
	}

	, clear: function(){
		//2019.3.4 in order to maintain the 'dirty' state, needs to immediately clear the stack after changes were successfully commited;
		//console.debug('<UndoStack/clear> iPos=' + this.iPos + ' nSize=' + this.vUndoStack.length + ' nRedo=' + (this.vUndoStack.length-(this.iPos+1)));
		this.vActionGroup.length=0;
		this.vUndoStack.length=0;
		this.iPos=-1;
		nyf.notifyCanRedo(this.canRedo());
		nyf.notifyCanUndo(this.canUndo());
	}

	, push: function(d){
		if(d.type === 'childList'){
			if(d.removedNodes.length>0){
				//console.debug('>>> childList: [' + d.target.nodeName + ']; nAdd='+d.addedNodes.length + ' nDel='+d.removedNodes.length);
				//for(let x of d.removedNodes){
				//	console.debug('removed:' + x.nodeName + ' txt=' + x.textContent);
				//}
			}
			if(d.addedNodes.length>0){
				//console.debug('>>> childList: [' + d.target.nodeName + ']; nAdd='+d.addedNodes.length + ' nDel='+d.removedNodes.length);
				//for(let x of d.addedNodes){
				//	console.debug('added:' + x.nodeName + ' txt=' + x.textContent);
				//}
			}
		}else if(d.type === 'attributes'){
			//console.debug('>>> attributes: [' + d.attributeName + ']; '+d.oldValue + ' --> ' + d.target.getAttribute(d.attributeName));
			d.newValue=d.target.getAttribute(d.attributeName)
		}else if(d.type === 'characterData'){
			//console.debug('>>> characterData: [' + d.target.nodeName + ']' + d.oldValue + ' --> ' + d.target.textContent);
			d.newValue=d.target.textContent;
		}

		this.vActionGroup.push(d);
	}

	, commit: function(nMsec){

		let THIS=this;
		let _commit=function(){
			//console.debug('<UndoStack/commit/start> iPos=' + THIS.iPos + ' nSize=' + THIS.vUndoStack.length + ' nRedo=' + (THIS.vUndoStack.length-(THIS.iPos+1)));

			if(THIS.canRedo()){
				THIS.vUndoStack.splice(THIS.iPos+1, THIS.vUndoStack.length-(THIS.iPos+1));
			}

			if(THIS.vActionGroup.length>0){

				THIS.vUndoStack.push(THIS.vActionGroup); THIS.iPos++;

				nyf.notifyCanRedo(THIS.canRedo());
				nyf.notifyCanUndo(THIS.canUndo());
				nyf.notifyDomDirty(THIS.canUndo());
				nyf.notifyDomEmpty(dom.checkIfEmpty());
			}
			THIS.vActionGroup=[];
			//console.debug('<UndoStack/commit/end> iPos=' + THIS.iPos + ' nSize=' + THIS.vUndoStack.length + ' nRedo=' + (THIS.vUndoStack.length-(THIS.iPos+1)));
		};

		nMsec=parseInt(nMsec || '0');
		if(nMsec>0){
			//console.debug('<setTimeout/commit> nMsec=' + nMsec);
			setTimeout(_commit, nMsec);
		}else{
			_commit();
		}
	}

	, canRedo: function(){
		return this.vUndoStack.length>0 && this.iPos<this.vUndoStack.length-1;
	}

	, canUndo: function(){
		return this.iPos>=0 && this.iPos<this.vUndoStack.length;
	}

	, redo: function(){
		if(this.canRedo()){
			//console.debug('<UndoStack/redo/start> iPos=' + this.iPos + ' nSize=' + this.vUndoStack.length + ' nRedo=' + (this.vUndoStack.length-(this.iPos+1)));
			g_xObserver.stop();
			let vActs=this.vUndoStack[this.iPos+1];
			for(let d of vActs){
				if(d.type === 'childList'){
					if(d.removedNodes.length>0){
						for(let i=0; i<d.removedNodes.length; ++i){
							let x=d.removedNodes[i];
							//console.debug('<redo/removedNodes/remove> nodeName=' + x.nodeName + ' txt=' + x.textContent);
							d.target.removeChild(x);
						}
					}
					if(d.addedNodes.length>0){
						for(let i=0; i<d.addedNodes.length; ++i){
							let x=d.addedNodes[i];
							if(d.nextSibling){
								//console.debug('<redo/addedNodes/insertBefore> nodeName=' + x.nodeName + ' prev=' + d.previousSibling + ' next=' + d.nextSibling + ' txt=' + x.textContent);
								d.target.insertBefore(x, d.nextSibling);
							}else{
								//console.debug('<redo/addedNodes/appendChild> nodeName=' + x.nodeName + ' prev=' + d.previousSibling + ' next=' + d.nextSibling + ' txt=' + x.textContent);
								d.target.appendChild(x);
							}
						}
					}
				}else if(d.type === 'attributes'){
					d.target.setAttribute(d.attributeName, d.newValue);
				}else if(d.type === 'characterData'){
					d.target.textContent=d.newValue;
				}
			}
			this.iPos++;

			nyf.notifyCanRedo(this.canRedo());
			nyf.notifyCanUndo(this.canUndo());
			nyf.notifyDomDirty(this.canUndo());
			nyf.notifyDomEmpty(dom.checkIfEmpty());

			g_xObserver.start();
			//console.debug('<UndoStack/redo/end> iPos=' + this.iPos + ' nSize=' + this.vUndoStack.length + ' nRedo=' + (this.vUndoStack.length-(this.iPos+1)));
		}
	}

	, undo: function(){
		if(this.canUndo()){
			//console.debug('<UndoStack/undo/start> iPos=' + this.iPos + ' nSize=' + this.vUndoStack.length + ' nRedo=' + (this.vUndoStack.length-(this.iPos+1)));
			g_xObserver.stop();
			let vActs=this.vUndoStack[this.iPos];
			for(let j=vActs.length-1; j>=0; --j){ //in reversed order for UNDO;
				let d=vActs[j];
				//console.debug('===> '+ d.type);
				if(d.type === 'childList'){
					//console.debug('removedNodes: '+ d.removedNodes.length);
					if(d.removedNodes.length>0){
						for(let i=0; i<d.removedNodes.length; ++i){
							let x=d.removedNodes[i];
							if(d.nextSibling){
								//console.debug('<undo/removedNodes/insertBefore> nodeName=' + (x.nodeName||'') + ' prev=' + (d.previousSibling||'NULL') + ' next=' + (d.nextSibling||'NULL') + ' target=' + (d.target||'NULL')  + ' txt=' + (x.textContent||'--'));
								d.target.insertBefore(x, d.nextSibling);
							}else{
								//console.debug('<undo/removedNodes/appendChild> nodeName=' + (x.nodeName||'') + ' prev=' + (d.previousSibling||'NULL') + ' next=' + (d.nextSibling||'NULL') + ' target=' + (d.target||'NULL')  + ' txt=' + (x.textContent||'--'));
								d.target.appendChild(x);
							}
						}
					}
					//console.debug('addedNodes: '+ d.addedNodes.length);
					if(d.addedNodes.length>0){
						for(let i=0; i<d.addedNodes.length; ++i){
							let x=d.addedNodes[i];
							//console.debug('<undo/addedNodes/removeChild> nodeName=' + (x.nodeName||'') + ' prev=' + (d.previousSibling||'NULL') + ' next=' + (d.nextSibling||'NULL') + ' target=' + (d.target||'NULL') + ' txt=' + (x.textContent||'--'));
							d.target.removeChild(x);
						}
					}
				}else if(d.type === 'attributes'){
					d.target.setAttribute(d.attributeName, d.oldValue);
				}else if(d.type === 'characterData'){
					//console.debug(d.target.textContent);
					d.target.textContent=d.oldValue;
					//console.debug(d.target.textContent);
				}
			}
			this.iPos--;

			nyf.notifyCanRedo(this.canRedo());
			nyf.notifyCanUndo(this.canUndo());
			nyf.notifyDomDirty(this.canUndo());
			nyf.notifyDomEmpty(dom.checkIfEmpty());

			g_xObserver.start();
			//console.debug('<UndoStack/undo/end> iPos=' + this.iPos + ' nSize=' + this.vUndoStack.length + ' nRedo=' + (this.vUndoStack.length-(this.iPos+1)));
		}
	}

	, undoStackTimer: null

	, clearTimer: function(){
		if(typeof(this.undoStackTimer)==='number'){
			clearInterval(this.undoStackTimer);
			this.undoStackTimer=null;
		}
	}

	, commitOnTyping: function(nMsec){
		let THIS=this;
		this.clearTimer();
		this.undoStackTimer=setInterval(function(){
			THIS.commit(0);
			THIS.clearTimer();
		}, nMsec);
	}

};
