
/////////////////////////////////////////////////////////////////////
// Essential scripts for Mybase Desktop v8.x
// Copyright 2010-2021 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////

var __xTb1={

	curTable: function(){
		let xTb, xRng=dom.getSelRange();
		if(xRng){
			xTb=this.tableOf(xRng.startContainer) || this.tableOf(xRng.endContainer);
		}
		return xTb;
	}

	, tableOf: function(e){ return dom.seekOuterElementByName(e, 'table'); }

	, tableRowOf: function(e){ return dom.seekOuterElementByName(e, 'tr'); }

	, posOfCell: function(xTd){
		let p = {iRow : -1, iCol : -1};
		if(xTd && (xTd.nodeName||'').toLowerCase()==='td'){
			let xTr=this.tableRowOf(xTd);
			if(xTr){
				p.iRow = xTr.rowIndex;
				p.iCol = xTd.cellIndex;
				console.debug('<posOfCell>: row='+p.iRow+', col='+p.iCol);
			}
		}
		return p;
	}

	, firstCellSelected: function(){
		let xTd, xRng=dom.getSelRange();
		if(xRng){
			let xElm=xRng.startContainer;
			xTd=dom.seekOuterElementByName(xElm, 'td');
		}
		return xTd;
	}

	, lastCellSelected: function(){
		let xTd, xRng=dom.getSelRange();
		if(xRng){

			let xElm=xRng.endContainer;
			xTd=dom.seekOuterElementByName(xElm, 'td');

			//2019.3.1 consider of the case that multiple cells selected && endOffset===0, the previous cell should be picked;
			if(xTd && xRng.endOffset===0 && xRng.startContainer!==xRng.endContainer){
				let xTr=dom.seekOuterElementByName(xTd, 'tr'), xTb1=dom.seekOuterElementByName(xTd, 'table');
				if(xTr && xTb1){
					let nCols=xTr.cells.length;
					if(nCols>0){
						let iCol=xTd.cellIndex, iRow=xTr.rowIndex;
						if(iCol===0 && iRow>0){
							//2019.3.4 when right-clicking in the right-most cell, the first cell in next row will be included in the selection range;
							xTr=xTb1.rows[iRow-1]; //seek to previous row;
							xTd=xTr.cells[nCols-1]; //pick the right-most cell of prev-row;
							console.debug('<lastCellSelected> Seeked to previous <td> at right-most cell of upper row @[' + xTr.rowIndex + ',' + xTd.cellIndex + ']');
						}else{
							iCol--;
							if(iCol>=0 && iCol<nCols){
								xTd=xTr.cells[iCol];
								console.debug('<lastCellSelected> Seeked to previous <td> of same row @[' + xTr.rowIndex + ',' + xTd.cellIndex + ']');
							}else{
								console.debug('<lastCellSelected> Failed to seek previous <td>');
							}
						}
					}
				}
			}
		}
		return xTd;
	}

	, insertRowBefore: function(){
		let bSucc = false;
		let xTd=this.firstCellSelected(), xTr=this.tableRowOf(xTd), xTb=this.tableOf(xTd);
		if(xTd && xTr && xTb){
			let iRow=xTr.rowIndex;
			let nCols=xTr.cells.length;
			let xTrNew=xTb.insertRow(iRow);
			for(let i=0; i<nCols; ++i){
				let e=xTrNew.insertCell(0);
				e.appendChild(document.createElement('br'));
			}
			bSucc = true;
		}
		return bSucc;
	}

	, insertRowAfter: function(){
		let bSucc = false;
		let xTd=this.lastCellSelected(), xTr=this.tableRowOf(xTd), xTb=this.tableOf(xTd);
		if(xTd && xTr && xTb){
			let iRow=xTr.rowIndex;
			let nCols=xTr.cells.length;
			let xTrNew=xTb.insertRow(iRow+1);
			for(let i=0; i<nCols; ++i){
				let e=xTrNew.insertCell(0);
				e.appendChild(document.createElement('br'));
			}
			bSucc = true;
		}
		return bSucc;
	}

	, insertColumnBefore: function(){
		let bSucc = false;
		let xTd=this.firstCellSelected(), xTb=this.tableOf(xTd);
		if(xTd && xTb){
			let iCol=xTd.cellIndex;
			let nRows=xTb.rows.length;
			for(let i=0; i<nRows; ++i){
				let xTr=xTb.rows[i];
				let e=xTr.insertCell(iCol);
				e.appendChild(document.createElement('br'));
			}
			bSucc = true;
		}
		return bSucc;
	}

	, insertColumnAfter: function(){
		let bSucc = false;
		let xTd=this.lastCellSelected(), xTb=this.tableOf(xTd);
		if(xTd && xTb){
			let iCol=xTd.cellIndex;
			let nRows=xTb.rows.length;
			for(let i=0; i<nRows; ++i){
				let xTr=xTb.rows[i];
				let e=xTr.insertCell(iCol+1);
				e.appendChild(document.createElement('br'));
			}
			bSucc = true;
		}
		return bSucc;
	}

	, deleteRow: function(){
		let nDel=0;
		let xTd1=this.firstCellSelected(), xTd2=this.lastCellSelected(), xTb1=this.tableOf(xTd1), xTb2=this.tableOf(xTd2);
		if(xTd1 && xTd2 && xTb1 && xTb2 && xTb1===xTb2){

			let p1 = this.posOfCell(xTd1);
			let p2 = this.posOfCell(xTd2);

			let iRow1 = p1.iRow, iRow2 = p2.iRow, nRows = xTb1.rows.length;
			if(iRow1>=0 && iRow2>=0 && nRows>0){
				if(iRow1>iRow2){
					let x=iRow1; iRow1=iRow2; iRow2=x; //swap;
				}

				let _delRows=function(xTb, iRow, nDel){
					while(iRow>=0 && iRow<xTb.rows.length && nDel-- >0){
						let xTr=xTb.rows[iRow];
						if(xTr) xTr.parentNode.removeChild(xTr);
					}
				};

				let nToDel=iRow2-iRow1+1;
				if(nToDel>0){
					if(nToDel>=nRows){
						xTb1.parentNode.removeChild(xTb1);
					}else{
						_delRows(xTb1, iRow1, nToDel);
					}
					nDel=nToDel;
				}
			}
		}
		return nDel>0;
	}

	, deleteColumn: function(){
		let xTd1=this.firstCellSelected(), xTd2=this.lastCellSelected(), xTb1=this.tableOf(xTd1), xTb2=this.tableOf(xTd2);
		if(xTd1 && xTd2 && xTb1 && xTb2 && xTb1===xTb2){

			let p1 = this.posOfCell(xTd1);
			let p2 = this.posOfCell(xTd2);

			let iRow1 = p1.iRow, iRow2 = p2.iRow;
			let iCol1 = p1.iCol, iCol2 = p2.iCol;

			let nCols=(xTb1.rows.length>0) ? xTb1.rows[0].cells.length : 0;

			if(iRow1>=0 && iRow2>=0 && iCol1>=0 && iCol2>=0 && nCols>0){

				let _delCols=function(xTb, iCol, nDel){
					let v=[];
					for(let j=0; j<xTb.rows.length; ++j){
						let xTr=xTb.rows[j];
						for(let i=iCol; i<xTr.cells.length; ++i){
							if(i>=iCol+nDel) break;
							//????????????? consider of colspan (merged cells);
							let xTd=xTr.cells[i];
							v.push(xTd);
						}
					}
					for(let j=0; j<v.length; ++j){
						let xTd=v[j];
						if(xTd) xTd.parentNode.removeChild(xTd);
					}
				};

				if(iRow2-iRow1==0){

					//only columns in one row;
					let nToDel=iCol2-iCol1+1;
					_delCols(xTb1, iCol1, nToDel);

				}else if(iRow2-iRow1==1){

					if(iCol1<=iCol2){
						//selected columns have overlapped;
						xTb1.parentNode.removeChild(xTb1);
					}else{
						_delCols(xTb1, iCol1, nCols-iCol1);
						_delCols(xTb1, 0, iCol2+1);
					}

				}else if(iRow2-iRow1>1){

					//two or more rows selected, that's to say, all columns selected;
					xTb1.parentNode.removeChild(xTb1);

				}
			}
		}else{
			console.warn('Bad table columns range in selection.');
		}
	}

	, deleteTable: function(){
		let vTb=dom.selectedTables();
		for(let i=0; i<vTb.length; ++i){
			let xTb=vTb[i];
			try{
				//console.debug('<deleteTable>: ' + xTb);
				xTb.parentNode.removeChild(xTb); //Tables may be nested and already deleted;
			}catch(e){
				console.debug('<deleteTable> Exception: ' + e);
			}
		}
	}

	, tableCssUtil: function(k, v){
		console.debug('<tableCssUtil> k=' + k + (v!==undefined?('=' + v + ' [Modify]'):' [Query]') );
		if(k){
			if(v===undefined){
				let vTb=dom.selectedTables(1);
				if(vTb.length>0){
					return dom.cssUtil(vTb[0], k);
				}
			}else{
				let vTb=dom.selectedTables();
				for(let i=0; i<vTb.length; ++i){
					let xTb=vTb[i];
					dom.cssUtil(xTb, k, v);
				}
			}
		}
	}

	, columnCssUtil: function(k, v){
		console.debug('<columnCssUtil> k=' + k + (v!==undefined?('=' + v + ' [Modify]'):' [Query]'));
		let xTd1=this.firstCellSelected(), xTd2=this.lastCellSelected(), xTb1=this.tableOf(xTd1), xTb2=this.tableOf(xTd2);
		if(k && xTd1 && xTd2 && xTb1 && xTb2 && xTb1===xTb2){

			let p1 = this.posOfCell(xTd1);
			let p2 = this.posOfCell(xTd2);

			let iRow1 = p1.iRow, iRow2 = p2.iRow;
			let iCol1 = p1.iCol, iCol2 = p2.iCol;

			let nRows=xTb1.rows.length;
			let nCols=xTb1.rows[0].cells.length;

			if(iRow1>=0 && iRow2>=0 && iCol1>=0 && iCol2>=0 && nCols>0){
				let nSel=iRow2-iRow1+1; //2015.6.12 for any rows;
				if(nSel>0){

					//2015.6.11 enabled to handle multiple columns if selected;
					let _is_col_selected=function(c){
						if(iRow2-iRow1===0 && c>=iCol1 && c<=iCol2) return true;
						if(iRow2-iRow1===1 && (c>=iCol1 || c<=iCol2)) return true;
						if(iRow2-iRow1>1) return true; //two or more rows selected, that's to say, all columns selected;
						return false;
					};

					if(v!==undefined){

						//2015.6.18 forcedly set the attribute;
						dom.cssUtil(xTb1, 'table-layout', 'fixed');
						dom.cssUtil(xTb1, 'word-break', 'break-all');

						for(let iRow=0; iRow<nRows; ++iRow){
							for(let iCol=0; iCol<nCols; ++iCol){
								if(_is_col_selected(iCol)){
									let xTd = xTb1.rows[iRow].cells[iCol];
									if(xTd){
										dom.cssUtil(xTd, k, v);
									}
								}
							}
						}

						return true;

					}else{

						for(let iRow=0; iRow<nRows; ++iRow){
							for(let iCol=0; iCol<nCols; ++iCol){
								if(_is_col_selected(iCol)){
									let xTd = xTb1.rows[iRow].cells[iCol];
									if(xTd){
										let sRes=dom.cssUtil(xTd, k);
										if(sRes) return sRes; //2015.6.17 returns the first non-empty value;
									}
								}
							}
						}
					}
				}
			}
		}
	}

	, cellCssUtil: function(k, v){
		console.debug('<cellCssUtil> k=' + k + (v!==undefined?('=' + v + ' [Modify]'):' [Query]'));
		let xTd1=this.firstCellSelected(), xTd2=this.lastCellSelected(), xTb1=this.tableOf(xTd1), xTb2=this.tableOf(xTd2);
		if(k && xTd1 && xTd2 && xTb1 && xTb2 && xTb1===xTb2){

			let p1 = this.posOfCell(xTd1);
			let p2 = this.posOfCell(xTd2);

			let iRow1 = p1.iRow, iRow2 = p2.iRow;
			let iCol1 = p1.iCol, iCol2 = p2.iCol;

			let nRows=xTb1.rows.length;
			let nCols=xTb1.rows[0].cells.length;

			if(iRow1>=0 && iRow2>=0 && iCol1>=0 && iCol2>=0 && nCols>0){
				let nSel=iRow2-iRow1+1; //2015.6.12 for any one or more rows;
				if(nSel>0){

					let _is_cell_selected=function(r, c){
						if(r<iRow1) return false;
						if(r>iRow2) return false;
						if(r===iRow1 && c<iCol1) return false;
						if(r===iRow2 && c>iCol2) return false;
						return true;
					};

					if(v!==undefined){

						//2015.6.18 forcedly set the attribute;
						//cssUtil(xTb1, 'table-layout', 'fixed');
						//cssUtil(xTb1, 'word-break', 'break-all');

						for(let iRow=iRow1; iRow<nRows; ++iRow){
							for(let iCol=0; iCol<nCols; ++iCol){
								if(_is_cell_selected(iRow, iCol)){
									let xTd = xTb1.rows[iRow].cells[iCol];
									if(xTd){
										dom.cssUtil(xTd, k, v);
									}
								}
							}
						}

						return true;

					}else{

						for(let iRow=0; iRow<nRows; ++iRow){
							for(let iCol=0; iCol<nCols; ++iCol){
								if(_is_cell_selected(iRow, iCol)){
									let xTd = xTb1.rows[iRow].cells[iCol];
									if(xTd){
										let sRes=dom.cssUtil(xTd, k);
										if(sRes) return sRes; //2015.6.17 returns the first non-empty value;
									}
								}
							}
						}
					}
				}
			}
		}
	}

};

if(dom) dom.extend(__xTb1, 'table');


