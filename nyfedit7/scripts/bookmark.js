/*function createBookmark()
{
	var sBmk, xRng=getSelRange();
	if(xRng){
		var x = xRng.endContainer;
		if(x){
			if(x.id.length == 0){
				var n = 0;
				while(true){
					sBmk = "Bookmark_" + n;
					if(!document.getElementById(sBmk)){
						break;
					}
					n++;
				}
			}else{
				sBmk = x.id;
			}
		}
	}
	return sBmk;
}*/

function isCursorBeginningOfPara()
{
	/*var bRes = false;
	var xRng = getSelRange();
	if(xRng){
		var xContainer = xRng.startContainer;
		if(xContainer){
			bRes = (xContainer.offset == 0);
		}
	}
	return bRes;*/
	return true;
}

function getBkmkId()
{
	var sBkmk;
	var n = 0;
	while(true){
		sBkmk = "bm_" + n;
		if(!document.getElementById(sBkmk)){
			break;
		}
		n++;
	}
	return sBkmk;
}

function jumpToBkmk(sBmk)
{
	var bSucc = false;
	var xEle = document.getElementById(sBmk);
	if(xEle){
		window.location.hash = "";
		window.location.hash = "#" + sBmk;

		bSucc = true
	}
	return bSucc;
}
