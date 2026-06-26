//==============================================================================
//	Define the Action.
//==============================================================================
//==============================================================================		
// Object : nexacro.ExcelExport		
// Group : Action		
//==============================================================================		
if (!nexacro.ExcelExport)		
{		
    nexacro.ExcelExport = function(id, parent)		
    {		
        nexacro.Action.call(this, id, parent);
		this.addEvent("canrun");
    };		
        		
    nexacro.ExcelExport.prototype = nexacro._createPrototype(nexacro.Action, nexacro.ExcelExport);		
    nexacro.ExcelExport.prototype._type_name = "ExcelExport";	
	
	//===============================================================		
    // nexacro.ExcelExport : Create & Destroy		
    //===============================================================		
    nexacro.ExcelExport.prototype.destroy = function()		
	{	
		nexacro.Action.prototype.destroy.call(this);
	};	
		
    //===============================================================		
    // nexacro.ExcelExport : Method
    //===============================================================		
    nexacro.ExcelExport.prototype.run = function()		
	{	
		//If the canrun event return value is not false			
		if(this.on_fire_canrun()!=false)			
		{
			//Import the object set as TargetView			
			var objView = this.getTargetView();
			var objForm;
			
			var sTarget = this.targetgrid;
				
			var sSheetName = this.sheetname;			
			var sFileName = this.filename;			
			var sExportType = this.exporttype;
			var objGrid;
			var objComp;
		
			//If the TargetView is set as View, not Form		
			if(objView)objForm = objView.form;		
			else objForm = this.parent;
			
			// Grid 객체 찾기
			if (sTarget) {				// targetgrid 설정시 해당 그리드
				objComp = objView.form.components[sTarget];
				
				if (objComp instanceof nexacro.Grid) {
					objGrid = objComp;
				} else {
					this.gfnLog("Specify grid component for property value of 'targetgrid'.");
					this.on_fire_onerror();
					return;
				}
			} else {						// targetgrid 미설정시 View에 있는 Grid
				var arrComp = objView.form.components;
				var arrGrid = new Array();
				
				for(var i=0; i< arrComp.length; i++) {
					objComp = arrComp[i];
				
					if (objComp instanceof nexacro.Grid) {
						arrGrid.push(objComp);
					}
				}
				
				if (arrGrid.length == 1) {
					objGrid = arrGrid[0];
				} else {
					objGrid = arrGrid;
				}
				
				if (this.gfnIsNull(objGrid)){
					this.gfnLog("Specify grid component for property value of 'targetgrid'.");
					this.on_fire_onerror();
					return;
				}
			}
			
			// Call Export
			this.gfnExcelExport(objForm, objGrid,  sSheetName, sFileName, sExportType);	
		}	
	};
	
	nexacro.ExcelExport.prototype._targetgrid = null;				// 그리드 객체
	nexacro.ExcelExport.prototype.set_targetgrid = function (v)				
	{				
		// TODO : enter your code here.
		if (v instanceof nexacro.Grid) {
			if (this._targetgrid != v) {			
				this.targetgrid = v.name;
				this._targetgrid = v;
			}		
		} else {
			v = nexacro._toString(v);			
			if (this.targetgrid != v) {
				this.targetgrid = v;
				this._targetgrid = v;			// TODO
			}
		}
	};
		
	nexacro.ExcelExport.prototype.set_sheetname = function (v)				
	{				
		// TODO : enter your code here.			
		v = nexacro._toString(v);			
		if (this.sheetname != v) {			
			this.sheetname = v;		
		}			
	};
				
	nexacro.ExcelExport.prototype.set_filename = function (v)				
	{	
		// TODO : enter your code here.			
		v = nexacro._toString(v);			
		if (this.filename != v) {			
			this.filename = v;		
		}			
	};
				
	nexacro.ExcelExport.prototype.set_exporttype = function (v)				
	{	
		var exporttype_enum = ["excel", "excel2007", "hancell2010", "hancell2014", "csv"];
		if (v && exporttype_enum.indexOf(v) == -1) {
			return;
		}
		
		// TODO : enter your code here.			
		v = nexacro._toString(v);			
		if (this.exporttype != v) {			
			this.exporttype = v;		
		}			
	};
	
	//===============================================================		
    // nexacro.ExcelExport : Event		
    //===============================================================
	nexacro.ExcelExport.prototype.on_fire_canrun = function (userdata)
	{
		var event = this.canrun;
		
		//이벤트가 존재하고 사용자가 정의한 이벤트 핸들러 함수가 있을 경우
		if (event && event._has_handlers)
		{
		  //ActionRunEventInfo 생성
		  var evt = new nexacro.ActionRunEventInfo(this, "canrun", userdata); //TODO
		  
		  //true/false 리턴값을 받기 위해 _fireCheckEvent 함수 실행
		  return this.canrun._fireCheckEvent(this, evt);
		}
		return true;
	};
	
	nexacro.ExcelExport.prototype.on_fire_onsuccess = function (userdata)
	{
		var event = this.onsuccess;
		
		//이벤트가 존재하고 사용자가 정의한 이벤트 핸들러 함수가 있을 경우
		if (event && event._has_handlers)
		{
		  //ActionSuccessEventInfo 생성
		  var evt = new nexacro.ActionSuccessEventInfo(this, "onsuccess", userdata); //TODO
		  
		  //리턴값이 필요 없으므로 _fireEvent 함수 실행
		  event._fireEvent(this, evt);
		}
	};
	  
	nexacro.ExcelExport.prototype.on_fire_onerror = function (userdata)
	{
		var event = this.onerror;
		
		//이벤트가 존재하고 사용자가 정의한 이벤트 핸들러 함수가 있을 경우
		if (event && event._has_handlers)
		{
		  //ActionErrorEventInfo 생성
		  var evt = new nexacro.ActionErrorEventInfo(this, "onerror", userdata); //TODO
		  
		  //리턴값이 필요 없으므로 _fireEvent 함수 실행
		  event._fireEvent(this, evt);
		}
	};
	
	//===============================================================		
    // nexacro.ExcelExport : 공통함수(Util)
    //===============================================================
	nexacro.ExcelExport.prototype.gfnIsNull = function (Val)				
	{				
		if (new String(Val).valueOf() == "undefined") return true;			
		if (Val == null) return true;			
		if (("x" + Val == "xNaN") && (new String(Val.length).valueOf() == "undefined")) return true;			
		if (Val.length == 0) return true;			
					
		return false;			
	};
	
	//===============================================================		
    // nexacro.ExcelExport : 공통함수 전환부분
    //===============================================================
	nexacro.ExcelExport.prototype.gfnExcelExport = function(objForm, objGrid,  sSheetName, sFileName, sExportType)
	{
		if(this.gfnIsNull(objForm))			return;
		if(this.gfnIsNull(objGrid))			return;
		if(this.gfnIsNull(sSheetName))		sSheetName = "Sheet1";
		if(this.gfnIsNull(sFileName))		sFileName = "";
		if(this.gfnIsNull(sExportType))		sExportType = "EXCEL2007";
		
		var nExportType = eval("nexacro.ExportTypes." + sExportType.toUpperCase());
		
		//this.setWaitCursor(true);
		var objGrid_excel = objGrid;
		
		var regExp = /[?*:\/\[\]]/g;  				// (엑셀에서 지원하지않는 모든 문자)
		sFileName = sFileName.replace(regExp, "");	// 파일명에 특수문자 제거
		//sFileName = this.gfnIsNull(sFileName) ? "ExcelExport_" + this.gfn_getArgument("menuNm") + "_" + this.gfn_getDate() : sFileName;		// fileName nullcheck
		if (this.gfnIsNull(sFileName)) {
			var d = new Date();
			var sDate = d.getFullYear()
					  + ((d.getMonth() + 1) + "").padLeft(2, "0")
					  + (d.getDate() + "").padLeft(2, "0")
					  + (d.getHours() + "").padLeft(2, "0")
					  + (d.getMinutes() + "").padLeft(2, "0")
					  + (d.getSeconds() + "").padLeft(2, "0")
					  + (d.getMilliseconds() + "").padLeft(3, "0");
					  
			sFileName = "ExcelExport" + "_" + sDate;
		}
		
		var sType	= objGrid.toString().toUpperCase();
		
		objForm.objExport = null
		objForm.objExport = new ExcelExportObject();
		objForm.objExport.set_exporturl(this._COM_EXCEL_URL);
		
		if(sType == "[OBJECT GRID]")
		{
			sSheetName = this.gfnGetSheetName(sSheetName);
			
			objForm.objExport.addExportItem(nexacro.ExportItemTypes.GRID, objGrid_excel, sSheetName + "!A1","allband","allrecord","nosuppress","allstyle","image","","width", "cellline");
			
			objForm.objExport.objgrid = objGrid_excel;
		}
		else
		{
			sExportType = "EXCEL2007";			// Sheet여러개일때는 xlsx로 Export
			
			var arrGridExcel = new Array();
			
			for(var i=0; i<objGrid.length; i++)
			{
				strSheetNm = sSheetName[i];
				strSheetNm = this.gfnIsNull(strSheetNm) ? "Sheet" + (i+1) : strSheetNm;
				strSheetNm = this.gfnGetSheetName(strSheetNm);
				
				objGrid_excel = objGrid[i];

				arrGridExcel.push(objGrid_excel);
				
				objForm.objExport.addExportItem(nexacro.ExportItemTypes.GRID, objGrid_excel, strSheetNm + "!A1","allband","allrecord","nosuppress","allstyle","image","","width", "cellline");
			}
			objForm.objExport.objgrid = arrGridExcel;
		}
		
		objForm.objExport.set_exporttype(nExportType);	//내보내기 할 엑셀 형식 지정
		objForm.objExport.set_exportfilename(sFileName);	
		//objForm.objExport.set_exportuitype("none");
		//objForm.objExport.set_exportmessageprocess("");
		objForm.objExport.set_exportuitype("exportprogress");
		objForm.objExport.set_exporteventtype("itemrecord");
		objForm.objExport.set_exportmessageprocess("%d[%d/%d]");
		objForm.objExport.set_exportactivemode('active');
		
		objForm.objExport.addEventHandler("onsuccess", this.gfnExportOnsuccess, this);	
		objForm.objExport.addEventHandler("onerror", this.gfnExportOnerror, this);	
			
		var result = objForm.objExport.exportData();
	};
	
	nexacro.ExcelExport.prototype.gfnExportOnsuccess = function(obj, e)
	{	
		this.on_fire_onsuccess();
	};

	/**
	 * @class  excel export on error <br>
	 * @param {Object} obj	
	 * @param {Event} e		
	 * @return N/A
	 * @example
	 */
	nexacro.ExcelExport.prototype.gfnExportOnerror = function(obj,  e)
	{
		trace("Excel Export Error!! : " + e.errormsg);
		this.on_fire_onerror();	
	};
	
	/**
	* gfn_getSheetName : Sheet명 반환
	* @param  : sSheetName	- [String] Sheet명
	* @return : [String] Sheet명
	* @example : 
	*/
	nexacro.ExcelExport.prototype.gfnGetSheetName = function(sSheetName, sNullNm)
	{
		if (this.gfnIsNull(sNullNm))	sNullNm = "Sheet1";
		
		var regExp = /[?*:\/\[\]]/g;
		var sRetuenNm;
		
		if (this.gfnIsNull(sSheetName))	sSheetName = sNullNm;
		
		sRetuenNm = sSheetName.replace(regExp,""); //시트명에 특수문자 제거
		sRetuenNm = this.gfnIsNull(sRetuenNm) ?sNullNm : sRetuenNm;
		
		//sheetName 30이상일경우 기본시트명
		if( String(sRetuenNm).length > 30 ){
			sRetuenNm =  sNullNm;
		}
		
		return sRetuenNm;
	};
}
	