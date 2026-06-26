/**
*  @FileName 	Grid.js 
*  @Creator 	TOBESOFT
*  @CreateDate 	2024/08/01
*  @Desction   
************** 소스 수정 이력 ***********************************************
*  date          		Modifier                Description
*******************************************************************************
* 2023/10/30			TOBESOFT				Grid Library
*******************************************************************************
*/

var pForm = nexacro.Form.prototype;
// 

pForm.GridConfig = {
	"defaultmenulist" : ["sort"],	// default 메뉴	
	"sort" : 	{
					sortTogleCancel		: true ,	// 헤더 클릭시 정렬 false= 오름/내림 true= 오름/내림/없음
					ascText  			: "▲"  ,	// ascending text
					descText 			: "▼"  ,	// descending text
					cellInfo			: []		// 내부용
				}
};

/**
* @class  그리드 설정 내부함수<br>
	   그리드에 유저프로퍼티를 Array형태로 반환한다.
* @param  {Object}objGrid	- 대상그리드
* @return {Array} user property
* @example this._getGridUserProperty(this.grdMain);	
*/
pForm._getGridUserProperty = function (objGrid)
{
	var sProp = objGrid.uFunction;
	
	var arrdefault = this.GridConfig.defaultmenulist.slice();
	var arrprop = [];
	
	if (!this.gfnIsNull(sProp)) {
		arrprop = sProp.split(",");
		for (var i=0; i<arrprop.length; i++) {
			if (arrprop[i].indexOf("!") == 0 ) {
				//DEFAULT에서 제거
				for (var j=0; j<arrdefault.length; j++){
					if (arrdefault[j] == arrprop[i].substr(1) ) {
						arrdefault[j] = "";
					}
				}
				arrprop[i] = "";
			}
		}
	}
	
	var arrmyprop = [];
	for (var i=0; i< arrdefault.length; i++) {
		if (!this.gfnIsNull(arrdefault[i])) {
			arrmyprop.push(arrdefault[i]);
		}
	}
	
	for (var i=0; i< arrprop.length; i++) {
		if (!this.gfnIsNull(arrprop[i])) {
			arrmyprop.push(arrprop[i]);
		}
	}
	
	//trace(objGrid.name + " - arrmyprop : " + arrmyprop);
	return arrmyprop;
};

/**
* @class  그리드헤드클릭 이벤트 [Sort, Checkbox]
* @param {Object} objGrid - 대상그리드
* @param {Evnet}  e	   - 헤드클릭이벤트
* @return  N/A
* @example objGrid.addEventHandler("onheadclick", this.gfnGrid_onheadclick, this);
*/
pForm.gfnGrid_onheadclick = function(objGrid, e)
{
	if (this.gfnGridSelectAllCheckbox(objGrid, e)) return;	// 체크박스인 경우
	
	// sort
	if (objGrid.uFun_sort === true) {
		if(objGrid._appendHeadRowIndex == e.subrow) return;	// find용 row

		var multiple = false;
		if (e.ctrlkey) multiple = true; // Ctrl 키
		var rtn = this._gfnGridSetSortStatus(objGrid, e.cell, multiple);
		if (rtn) {
			this._gfnGridExecuteSort(objGrid);
		}
	}
};

/**
* @class 정렬가능여부리턴
* @param {Object} grid - 대상그리드
* @param {Number} headCellIndex - 대상셀INDEX
* @param {Boolean} multiple - 멀티소트여부 
* @param {Number} sortStatus - 소트상태  
* @return{Boolean} sort 가능/불가능 여부
* @example this._gfnGridSetSortStatus(obj, e.cell, multiple);	
*/
pForm._gfnGridSetSortStatus = function(grid, headCellIndex, isMultiple, sortStatus, bodyCellIndex)
{
	// head cell index 에 해당하는 body cell index
	if( this.gfnIsNull(bodyCellIndex)){
		bodyCellIndex = this._gfnGridGetBodyCellIndex(grid, headCellIndex);
	}
	if ( bodyCellIndex < 0 ) return false;
	
	// body cell index 에 해당하는 바인드 컬럼명
	var columnName = this.gfnGetBindColName(grid, bodyCellIndex);
	if (this.gfnIsNull(columnName)) {
		trace("bind가 되지 않은 cell은 sort가 되지 않습니다.");
		return false;
	}
	
	if ( this.gfnIsNull(isMultiple) ) isMultiple = false;
	if ( this.gfnIsNull(sortStatus) ) sortStatus = -1;
	
	// 대상 grid 에 정렬정보를 가지는 사용자 속성 확인/추가
	if ( this.gfnIsNull(grid.sortInfos) ){
		grid.sortInfos = {};
	}
	
	// 정렬대상컬럼 (순서중요)
	if ( this.gfnIsNull(grid.sortItems) ){
		grid.sortItems = [];
	}
	
	var sortInfos = grid.sortInfos,
		sortItems = grid.sortItems,
		sortInfo = sortInfos[columnName],
		sortItem,
		status;
	
	if (this.gfnIsNull(sortInfo)) {
		var headText = grid.getCellText(-1, headCellIndex);
		
		// executeSort에서 정렬 표시를 위해 cell index 가 필요한데
		// cell moving 될 경우 index는 변하므로 cell object 를 참조하여 값을 얻어온다. 		
		var refCell = this._gfnGridGetGridCellObject(grid, "head", headCellIndex);
		sortInfo = sortInfos[columnName] = { status: 0, text: headText, refCell: refCell};
	}
	// set sort status
	if ( isMultiple ) {		
		status = sortInfo.status;
		if ( sortStatus == -1 ) {
			if ( status == 0 ) {
				sortInfo.status = 1;
			} 
			else if ( status == 1 ) {
				sortInfo.status = 2;
			} 
			else if ( status == 2 ) {
				sortInfo.status = ( this.GridConfig.sort.sortTogleCancel ? 0 : 1);
			}
		}
		else {
			sortInfo.status = sortStatus;
		}
	}
	else {
		for (var p in sortInfos) {
			if ( sortInfos.hasOwnProperty(p) )
			{
				sortInfo = sortInfos[p];
				if ( p == columnName ) {
					status = sortInfo.status;
					if ( sortStatus == -1 ) {
						if ( status == 0 ) {
							sortInfo.status = 1;
						} 
						else if ( status == 1 ) {
							sortInfo.status = 2;
						} 
						else if ( status == 2) {
							sortInfo.status = ( this.GridConfig.sort.sortTogleCancel ? 0 : 1);
						}
					}else {
						sortInfo.status = sortStatus;
					}
				}else {
					sortInfo.status = 0;
				}
				if ( sortInfo.status == 0 ){
					for (var j=0, len2=sortItems.length; j<len2; j++) {
						if ( sortItems[j] !== columnName ) {
							sortItems.splice(j, 1);
							break;
						}
					}
				}
			}
		}
	}
	
	// 컬럼정보 등록
	var hasItem = false;
	for (var i=0, len=sortItems.length; i<len; i++) {
		if ( sortItems[i] == columnName ) {
			hasItem = true;
			break;
		}
	}	
	if (!hasItem) {
		sortItems.push(columnName);
	}
	return true;
}; 

/**
* @class 소트를 실행한다
* @param {Object}  grid 대상 Grid Component
* @return{String}  N/A
* @example this._gfnGridExecuteSort(obj);	
*/  
pForm._gfnGridExecuteSort = function(grid) 
{
	var sortInfo, 
		sortItem,
		sortInfos = grid.sortInfos,
		sortItems = grid.sortItems,
		columnName,
		status,
		cell,
		sortString = "";
		
	if ( this.gfnIsNull(sortInfos) || this.gfnIsNull(sortItems) ) return;

	// keystring 조합
	for (var i=0; i<sortItems.length; i++) {
		columnName = sortItems[i];
		sortInfo = sortInfos[columnName];
		status = sortInfo.status;
		cell = sortInfo.refCell;
		
		// 컬럼삭제 등으로 제거될 수 있으므로 실제 column 이 존재하는지
		// 확인하여 없으면 제거해 준다.
		if ( this.gfnIsNull(cell) || grid.getBindCellIndex("body", columnName) < 0 ){
			// 컬럼정보제거
			sortItems.splice(i, 1);
			sortInfos[columnName] = null;
			delete sortInfos[columnName];
			
			i--;
		}
		else if ( status > 0 ) {
			sortString += (status == 1 ? "+" : "-") + columnName;
		}
	}
	
	var ds = grid.getBindDataset();
	
	// keystring 확인
	var curKeyString = ds.keystring;
	var groupKeyString = "";
	
	if (curKeyString.length > 0 && curKeyString.indexOf(",") < 0) {
		var sIndex = curKeyString.indexOf("S:");
		var gIndex = curKeyString.indexOf("G:");

		if (sIndex > -1) {
			groupKeyString = "";
		}
		else {
			if (gIndex < 0) {
				groupKeyString = "G:"+curKeyString;
			}
			else {
				groupKeyString = curKeyString;
			}
		}
	}
	else {
		var temps = curKeyString.split(",");
		var temp;
		for (var i=0,len=temps.length; i<len; i++) {
			temp = temps[i];
			if (temp.length > 0 && temp.indexOf("S:") < 0) {
				if (temp.indexOf("G:") < 0) {
					groupKeyString = "G:"+temp;
				}
				else {
					groupKeyString = temp;
				}
			}
		}
	}
	
	grid.set_enableevent(false);
	grid.set_enableredraw(false);
	
	if (sortString.length > 0) {
		var sortKeyString = "S:"+sortString;
		
		if ( groupKeyString.length > 0 ) {
			ds.set_keystring(groupKeyString + "," +  sortKeyString);
		} 
		else {
			ds.set_keystring(sortKeyString);
		}
		
		grid.sortKeyString = sortKeyString;
	}
	else {
		ds.set_keystring(groupKeyString);
		grid.sortKeyString = "";
	}

	// 정렬표시
	var index, marker;
	for (var p in sortInfos) {
		if ( sortInfos.hasOwnProperty(p) )
		{
			sortInfo = sortInfos[p];			
			cell = sortInfo.refCell;
			if ( cell )
			{
				index = cell._cellidx;
				marker = this.gfnDecode(sortInfo.status, 1, this.GridConfig.sort.ascText, 2, this.GridConfig.sort.descText, "");
				grid.setCellProperty( "head", index, "text", sortInfo.text + marker);
			}
		}
	}
	
	// rowposition을 최상단으로 이동 필요시
	//ds.set_rowposition(0);
	
	grid.set_enableevent(true);
	grid.set_enableredraw(true);
};

/**
* @class Grid에 기능 추가
* @param {Object} objGrid	- 대상그리드
* @return N/A
* @example this.gfnSetGrid(this.grdMain);	
*/
pForm.gfnSetGrid = function(objGrid)
{
	var objApp = nexacro.getApplication();
	if(objApp.gvUseGridContextMenu != true) return;
	
	// Grid의 UserProperty 설정
	var arrProp = this._getGridUserProperty(objGrid);
	// 설정할 속성이 없을땐 리턴
	if(this.gfnIsNull(arrProp)) return;
	
	objGrid.arrprop = arrProp;
	if(arrProp.indexOf("sort")>=0) objGrid.uFun_sort = true;
	
	objGrid.addEventHandler("onheadclick", this.gfnGrid_onheadclick, this);
};	

/**
* @class Grid에 Sort 취소
* @param {Object} objGrid	- 대상그리드
* @param {Number} nCell - 컬럼인덱스
* @return N/A
* @example this.gfnClearSortMark(this.grdMain, 0);	
*/
pForm.gfnClearSortMark = function (objGrid, nCell) {
	var nColCnt = objGrid.getCellCount("head");
	var sText , sRepText;
	
	if(nCell === null || nCell === undefined) this._issortmark = false;

	for (var ii=0; ii < nColCnt; ii++) 
	{
		if (objGrid.getCellProperty("head", ii, "displaytype") == "checkboxcontrol" ||
			objGrid.getCellProperty("head", ii, "edittype") == "checkbox") continue;
		
		sText = objGrid.getCellProperty("head", ii, "text");
		if(sText) {
			sRepText = objGrid.getCellProperty("head",ii,"text").replace(this.GridConfig.sort.ascText,"").replace(this.GridConfig.sort.descText, "");
			objGrid.setCellProperty("head", ii, "text", sRepText);
		}
	}
};

/**
* @class  그리드헤드클릭시 체크박스인 경우 전체 선택
* @param {Object} objGrid - 대상그리드
* @param {Evnet}  e	   - 헤드클릭이벤트
* @return  N/A
* @example objGrid.gfnGridSelectAllCheckbox(obj, e);
*/
pForm.gfnGridSelectAllCheckbox = function(objGrid, e)
{
	if (objGrid.readonly == true) return true;
	var nCell = e.cell;
	var nCol = e.col;
	if (objGrid.getCellProperty("head", nCell, "edittype") != "checkbox") return false;
	if (objGrid.getCellProperty("body", nCol, "edittype") != "checkbox") return false;
	
	var dsObj = objGrid.getBindDataset();
	var strChkCol = objGrid.getCellProperty("body", nCol, "text");
	if(!strChkCol || strChkCol == "" || (strChkCol.indexOf("bind:") < 0)) return false;
	strChkCol = strChkCol.split("bind:").join("");
	
	var strVal;
	var sTxt = objGrid.getCellProperty("head", nCell, "text");
	if(	!sTxt || sTxt == "" || sTxt == "0" ) {
		strVal = "1";
	} else {
		strVal = "0";
	}
	objGrid.setCellProperty( "head", nCell, "text", strVal);
	dsObj.set_enableevent(false); 
	for ( var r = 0 ; r < dsObj.getRowCount() ; r++ ) {
		dsObj.setColumn(r, strChkCol, strVal);  
	}
	/*
	if(!dsObj._ischeckevent) {
		// check column이 uncheck되면 head check도 변경한다.	- check box는 1개만 있다는 가정임
		dsObj._ischeckevent = true;
		dsObj.addEventHandler("oncolumnchanged",
								function(obj,e) {
									if(e.columnid == strChkCol && e.newvalue!="1") {
										objGrid.setCellProperty( "head", nCell, "text", e.newvalue);
									}
								},
								this);
	}
	*/
	dsObj.set_enableevent(true);	
	dsObj = null;
	
	return true;
};

/**
* @class body cell index로 binding 된 컬럼명을 얻어온다.
* @param {Object}  objGrid - 대상 Grid Component
* @param {Number}  nIndex - grid cell index
* @return{String} column id
* @example this.gfnGetBindColName(obj, e.cell);	
*/  
pForm.gfnGetBindColName = function(objGrid, nIndex) 
{
	var text = "";
	var columnid = "";
	var subCell = objGrid.getCellProperty("body", nIndex, "subcell");
	if ( subCell > 0 )
	{
		text = objGrid.getSubCellProperty("body", nIndex, 0, "text");
	} else 
	{
		text = objGrid.getCellProperty("body", nIndex, "text");
	}
	
	if (!this.gfnIsNull(text) )
	{
		if ( text.search(/^BIND\(/) > -1 ) 
		{	
			columnid = text.replace(/^BIND\(/, "");
			columnid = columnid.substr(0, columnid.length-1);
		} else if ( text.search(/^bind:/) > -1 ) 
		{
			columnid = text.replace(/^bind:/, "");
		}
	}
	return columnid;
};

/**
* @class head cell에 match되는 body cell을 얻어온다
* @param {Object}  objGrid - 대상 Grid Component
* @param {Number} nHeadCellIndex - head cell index
* @param {Number} bUseColspan - Colsapn 사용여부
* @return{Number}  body cell index
* @example this._gfnGridGetBodyCellIndex(this.grid, 0);
*/ 
pForm._gfnGridGetBodyCellIndex = function(objGrid, nHeadCellIndex, bUseColspan) 
{
	if (this.gfnIsNull(bUseColspan)) bUseColspan=false;
	
	// Max Head Row Index
	var nMaxHeadRow = 0;
	for (var i=0, len=objGrid.getCellCount("head"); i<len; i++) 
	{
		var row = objGrid.getCellProperty("head", i, "row");
		if (nMaxHeadRow < row) 
		{
			nMaxHeadRow = row;
		}
	}
	
	// Max Body Row Index
	var nMaxBodyRow = 0;
	for (var i=0, len=objGrid.getCellCount("body"); i<len; i++) 
	{
		var row = objGrid.getCellProperty("body", i, "row");
		if (nMaxBodyRow < row) 
		{
			nMaxBodyRow = row;
		}
	}
	
	if (nMaxHeadRow == 0 && nMaxBodyRow == 0) 
	{
		bUseColspan = true;
	}
	
	// Body Row 가 1개 이상일 경우
	// Head의 row 가 Body의 row 보다 클 경우 차이 row 를 뺀 것을 대상으로 찾고
	// Body의 row 가 Head의 row 보다 크거나 같을 경우 row index가 같은 대상을 찾는다.			
	var nCellIndex = -1;
	var sRow = -1;
	var nRow = parseInt(objGrid.getCellProperty("head", nHeadCellIndex, "row"));
	var nCol = parseInt(objGrid.getCellProperty("head", nHeadCellIndex, "col"));
	var nColspan = parseInt(objGrid.getCellProperty("head", nHeadCellIndex, "colspan"));				
	
	if (nMaxHeadRow > nMaxBodyRow) 
	{
		sRow = nRow - (nMaxHeadRow - nMaxBodyRow);
		sRow = (sRow < 0 ? 0 : sRow);
	} else 
	{
		sRow = nRow;
	}
	
	var cRow, cCol, cColspan, cRowspan;
	
	for (var i=0, len=objGrid.getCellCount("body"); i<len; i++) 
	{
		cRow = parseInt(objGrid.getCellProperty("body", i, "row"));
		cCol = parseInt(objGrid.getCellProperty("body", i, "col"));	
		cColspan = parseInt(objGrid.getCellProperty("body", i, "colspan"));					
		cRowspan = parseInt(objGrid.getCellProperty("body", i, "rowspan"));
		if( cRowspan > 1 ) 
		{
			if (bUseColspan) 
			{
				if (sRow >= cRow && nCol <= cCol && cCol < (nCol + nColspan)) 
				{		
					nCellIndex = i;
					break;
				}		
			} else 
			{
				if (sRow >= cRow && nCol == cCol && nColspan == cColspan) 
				{		
					nCellIndex = i;
					break;
				}
			}
		} else 
		{	
			if (bUseColspan) 
			{
				if (sRow == cRow && nCol <= cCol && cCol < (nCol + nColspan)) 
				{		
					nCellIndex = i;
					break;
				}		
			} else 
			{
				if (sRow == cRow && nCol == cCol && nColspan == cColspan) 
				{		
					nCellIndex = i;
					break;
				}
			}
		}
	}
	return nCellIndex;
};

/**
* @class Cell object 를 반환 (Grid 내부 속성이므로 get 용도로만 사용)
* @param {Object} objGrid - 대상 Grid Component
* @param {String} sBand - 얻고자 하는 cell 의 band (head/body/summ);
* @param {Number} nIndex - 얻고자 하는 cell 의 index
* @return {Object} cell object
* @example this._gfnGridGetGridCellObject(grid, "head", headCellIndex);
*/
pForm._gfnGridGetGridCellObject = function(objGrid, sBand, nIndex)
{
	// 내부속성을 통해 얻어온다.
	var objCell;
	
	var format = objGrid._curFormat;
	if (format) 
	{
		if (sBand == "head") 
		{
			objCell = format._headcells[nIndex];
		} else if (sBand == "body") 
		{
			objCell = format._bodycells[nIndex];
		} else if (sBand == "summ" || sBand == "summary") 
		{
			objCell = format._summcells[nIndex];
		}
	}
	return objCell;
};



pForm = null;
