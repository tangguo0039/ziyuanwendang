
function curTable____()
{
	var xTable = null;
	var xSel= document.getSelection();
	if(xSel){
		var xEle = xSel.getRangeAt(0).endContainer;
		while(xEle){
			if(xEle.nodeName.toUpperCase() == "TABLE"){
				xTable = xEle;
				break;
			}
			xEle = xEle.parentNode;
		}
	}
	return xTable;
}

function curTable()
{
    //2014.8.5 look at both the startContainer and endContainer;
    var xTable=null, xRng=getSelRange();
    if(xRng){
        var t=seekOuterElementByName(xRng.startContainer, 'table');
        if(t){
            xTable=t;
        }else{
            t=seekOuterElementByName(xRng.endContainer, 'table');
            if(t){
                xTable=t;
            }
        }
    }
    return xTable;
}

function focusOnTable(){return curTable() ? true : false;}

function posOfFirstCellSelected()
{
    var xPos = {iRow : -1, iCol : -1};
    var xSel= document.getSelection();
    if(xSel){
        var xEle = xSel.getRangeAt(0).startContainer;
        while(xEle){
            if(xEle.nodeName.toUpperCase() == "TD"){
                xPos.iRow = xEle.parentElement.rowIndex;
                xPos.iCol = xEle.cellIndex;
                break;
            }
            xEle = xEle.parentNode;
        }
    }
    return xPos;
}

function posOfLastCellSelected()
{
    var xPos = {iRow : -1, iCol : -1};
    var xSel= document.getSelection();
    if(xSel){
        var xEle = xSel.getRangeAt(0).endContainer;
        while(xEle){
            if(xEle.nodeName.toUpperCase() == "TD"){
                xPos.iRow = xEle.parentElement.rowIndex;
                xPos.iCol = xEle.cellIndex;
                break;
            }
            xEle = xEle.parentNode;
        }
    }
    return xPos;
}

//function currentCellIndex()
//{
//    var xPos = {iRow : -1, iCol : -1};
//	var xSel= document.getSelection();
//	if(xSel){
//		var xEle = xSel.getRangeAt(0).endContainer;
//		while(xEle){
//			if(xEle.nodeName.toUpperCase() == "TD"){
//                xPos.iRow = xEle.parentElement.rowIndex;
//                xPos.iCol = xEle.cellIndex;
//				break;
//			}

//			xEle = xEle.parentNode;
//		}
//	}
//    return xPos;
//}

/*function selectedTableCellIndex()
{
	var xSelectedCell = {m_nStartRowIndex : -1, m_nStartColIndex : -1, m_nEndRowIndex : -1, m_nEndColIndex : -1};
	var xSel= document.getSelection();
	if(xSel){
		var xStartEle = xSel.getRangeAt(0).startContainer;
		while(xStartEle){
			if(xStartEle.tagName.toUpperCase() == "TD"){
				xSelectedCell.m_nStartRowIndex = xStartEle.parentElement.rowIndex;
		 		xSelectedCell.m_nStartColIndex = xStartEle.cellIndex;
				break;
			}

			xStartEle = xStartEle.parentElement;
		}

		var xEndEle = xSel.getRangeAt(0).endContainer;
		while(xEndEle){
			if(xEndEle.tagName.toUpperCase() == "TD"){
				xSelectedCell.m_nEndRowIndex = xEndEle.parentElement.rowIndex;
		 		xSelectedCell.m_nEndColIndex = xEndEle.cellIndex;
				break;
			}

			xEndEle = xEndEle.parentElement;
		}
	}
	return xSelectedCell;
}*/

var sDefCellTxt = "<br />"; //<br> ensures the normal height for newly inserted cells;

function insertRowBefore()
{
    var bSucc = false, xElmTbl = curTable();
    if(xElmTbl){
        var xPos = posOfFirstCellSelected();
        var nRows = xElmTbl.rows.length;
        if(xPos.iRow >= 0 && xPos.iRow < nRows){
            var nCols = xElmTbl.rows[0].cells.length;
            xElmTbl.insertRow(xPos.iRow);
            for(var i = 0; i < nCols; i++){
                xElmTbl.rows[xPos.iRow].insertCell(i);
                xElmTbl.rows[xPos.iRow].cells[i].innerHTML = sDefCellTxt;
			}
			bSucc = true;
        }
	}
	return bSucc;
}

function insertRowAfter()
{
    var bSucc = false, xElmTbl = curTable();
    if(xElmTbl){
        var xPos = posOfLastCellSelected();
        var nRows = xElmTbl.rows.length;
        if(xPos.iRow >= 0 && xPos.iRow < nRows){
            var nCols = xElmTbl.rows[0].cells.length;
            xElmTbl.insertRow(xPos.iRow + 1);
            for(var i = 0; i < nCols; i++){
                xElmTbl.rows[xPos.iRow + 1].insertCell(i);
                xElmTbl.rows[xPos.iRow + 1].cells[i].innerHTML = sDefCellTxt;
			}
			bSucc = true;
		}
	}
	return bSucc;
}

function insertColumnBefore()
{
    var bSucc = false, xElmTbl = curTable();
    if(xElmTbl){
        var xPos = posOfFirstCellSelected();
        var nCols = xElmTbl.rows[0].cells.length;
        if(xPos.iCol >= 0 && xPos.iCol < nCols){
            var nRows = xElmTbl.rows.length;
            for(var i=0; i < nRows; i++){
                xElmTbl.rows[i].insertCell(xPos.iCol);
                xElmTbl.rows[i].cells[xPos.iCol].innerHTML = sDefCellTxt;
			}
			bSucc = true;
		}
	}
	return bSucc;
}

function insertColumnAfter()
{
    var bSucc = false, xElmTbl = curTable();
    if(xElmTbl){
        var xPos = posOfLastCellSelected();
        var nCols = xElmTbl.rows[0].cells.length;
        if(xPos.iCol >= 0 && xPos.iCol < nCols){
            var nRows = xElmTbl.rows.length;
            for(var i=0; i < nRows; i++){
                xElmTbl.rows[i].insertCell(xPos.iCol + 1);
                xElmTbl.rows[i].cells[xPos.iCol + 1].innerHTML = sDefCellTxt;
			}
			bSucc = true;
		}
	}
	return bSucc;
}

function deleteRow()
{
    var nDel=0, xElmTbl = curTable();
    if(xElmTbl){
        var nRows = xElmTbl.rows.length;
        if(nRows>0){
            var xPos1 = posOfFirstCellSelected();
            var xPos2 = posOfLastCellSelected();

            var iRow1 = xPos1.iRow, iRow2 = xPos2.iRow;
            if(iRow1>iRow2){
                var x=iRow1; iRow1=iRow2; iRow2=x; //swap;
            }

            if(iRow1>=0 && iRow2>=0 && iRow1 < nRows && iRow2 < nRows){
                for(var i=iRow2; i>=iRow1; --i){ //delete from below to upper, for consistent index of rows;
                    xElmTbl.deleteRow(i);
                    nDel++;
                }
            }
        }
    }
    return nDel>0;
}

function deleteColumn()
{
    var nDel=0, xElmTbl = curTable();
    if(xElmTbl){
        var nRows = xElmTbl.rows.length;
        if(nRows>0){
            var xPos1 = posOfFirstCellSelected();
            var xPos2 = posOfLastCellSelected();

            var iCol1 = xPos1.iCol, iCol2 = xPos2.iCol;
            if(iCol1>iCol2){
                var x=iCol1; iCol1=iCol2; iCol2=x; //swap;
            }

            var nCols = xElmTbl.rows[0].cells.length;
            if(iCol1>=0 && iCol2>=0 && iCol1<nCols && iCol2<nCols){
                for(var j=iCol2; j>=iCol1; --j){ //delete from right to left, for consistent index of columns;
                    for(var i = 0; i < nRows; i++){
                        xElmTbl.rows[i].deleteCell(j);
                        nDel++;
                    }
                }
            }
        }
    }
    return nDel>0;
}

function deleteTable()
{
    var bSucc = false, xElmTbl = curTable();
    if(xElmTbl){
        if(xElmTbl.parentNode.removeChild(xElmTbl)){
            bSucc=true;
        }
    }
    return bSucc;
}

function widenTable(n)
{
    var bSucc = false, xElmTbl = curTable();
    if(xElmTbl){
        var sWid=xElmTbl.getAttribute('width');
        if(sWid){
            var w=parseFloat(sWid);
            if(w>0 && w<5000){

                if(n>-1 && n<1){
                    //n incidates a percent number;
                    w+=w*n;
                }else{
                    //n incidates a number in pixels;
                    w+=n;
                }

                xElmTbl.setAttribute('width', ''+w);

                bSucc=true;
            }
        }
    }
    return bSucc;
}

/*function canMergeCells()
{
	var bSucc = false;
	var xSelectedCell = selectedTableCellIndex();
	if(xSelectedCell.m_nStartRowIndex >= 0 && xSelectedCell.m_nStartColIndex >= 0 && xSelectedCell.m_nEndRowIndex >= 0 && xSelectedCell.m_nEndColIndex >= 0){
		bSucc = true;
	}
	return bSucc;
}

function mergeCells()
{
	if(focusOnTable()){
        var xElmTbl = curTable();
		var xSelectedCell = selectedTableCellIndex();
		if(xSelectedCell.m_nStartRowIndex >= 0 && xSelectedCell.m_nStartColIndex >= 0 && xSelectedCell.m_nEndRowIndex >= 0 && xSelectedCell.m_nEndColIndex >= 0){
			var nRowIndex = Math.min(xSelectedCell.m_nStartRowIndex, xSelectedCell.m_nEndRowIndex);
			var nColIndex = Math.min(xSelectedCell.m_nStartColIndex, xSelectedCell.m_nEndColIndex);

            var xCell = xElmTbl.rows[nRowIndex].cells[nColIndex];
			xCell.rowSpan = Math.abs(xSelectedCell.m_nStartRowIndex - xSelectedCell.m_nEndRowIndex) + 1;
			xCell.colSpan = Math.abs(xSelectedCell.m_nStartColIndex - xSelectedCell.m_nEndColIndex) + 1;
		}
	}
}

function unmergeCells()
{
	if(focusOnTable()){
        var xElmTbl = curTable();
        var xPos = currentCellIndex();
        if(xPos.iRow >= 0 && xPos.iCol >= 0){
            var xCell = xElmTbl.rows[xPos.iRow].cells[xPos.iCol];
			xCell.rowSpan = 1;
			xCell.colSpan = 1;
		}
	}
}*/
