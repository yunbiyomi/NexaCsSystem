//	Define the EventInfo.
//==============================================================================
//	Define the Action.
//==============================================================================
//==============================================================================		
// Object : nexacro.ExcelImport		
// Group : Action		
//==============================================================================		
if (!nexacro.ExcelImport)		
{		
    nexacro.ExcelImport = function(id, parent)		
    {		
        nexacro.Action.call(this, id, parent);
		this.addEvent("canrun");
    };		
        		
    nexacro.ExcelImport.prototype = nexacro._createPrototype(nexacro.Action, nexacro.ExcelImport);		
    nexacro.ExcelImport.prototype._type_name = "ExcelImport";	
	
	//===============================================================		
    // nexacro.ExcelImport : Create & Destroy		
    //===============================================================		
    nexacro.ExcelImport.prototype.destroy = function()		
	{	
		nexacro.Action.prototype.destroy.call(this);
	};	
		
    //===============================================================		
    // nexacro.ExcelImport : Method		
    //===============================================================		
    nexacro.ExcelImport.prototype.run = function()		
	{			
		//If the canrun event return value is not false			
		if(this.on_fire_canrun()!=false)			
		{
			//Import the object set as TargetView			
			var objView = this.getTargetView();	
			var objForm = this.gfnGetForm();
			
			var sTargetDs = this.targetdataset;
				
			var sSheetName = this.sheetname;			
			var sStartCell = this.startcell;			
			var sImportType = this.importtype;
			var objDataset;
			var objComp;
			var objDs = this._targetdataset;
			
			if (this.gfnIsNull(objDs))	objDs 	= this.gfnGetDataset(objView,sTargetDs);
			
			if (this.gfnIsNull(objDs))
			{
				objDs = new nexacro.NormalDataset("importdataset", objForm);
				this.gfnLog("Create Dataset : " + objDs.name);
			}
			
 			// Call Import
 			this.gfnExcelImport(objForm, objDs, sSheetName, sStartCell, sImportType);
		}		
	};	
	
	nexacro.ExcelImport.prototype._targetdataset = null;
	nexacro.ExcelImport.prototype.set_targetdataset = function (v)				
	{				
		if (v instanceof nexacro.NormalDataset) {
			if (this.targetdataset != v.name) {			
				this.targetdataset = v.name;
				this._targetdataset = v;
			}		
		} else {
			v = nexacro._toString(v);
			
			if (this.targetdataset != v) {
				this.targetdataset = v;
				this._targetdataset = null;
				
				var objView = this.getTargetView();	
				if (objView)
				{
					var objForm = objView.form;
					var objDs = objForm._findDataset(v);
					
					if (objDs != undefined) {
						this._targetdataset = objDs;
		 			}
				}
			}
		}
	};
				
	nexacro.ExcelImport.prototype.set_sheetname = function (v)				
	{				
		// TODO : enter your code here.			
		v = nexacro._toString(v);			
		if (this.sheetname != v) {			
			this.sheetname = v;		
		}			
	};
				
	nexacro.ExcelImport.prototype.set_startcell = function (v)				
	{				
		// TODO : enter your code here.			
		v = nexacro._toString(v);			
		if (this.startcell != v) {			
			this.startcell = v;		
		}			
	};
				
	nexacro.ExcelImport.prototype.set_importtype = function (v)				
	{
		var importtype_enum = ["excel", "excel2007", "hancell2014", "csv"];
		if (v && importtype_enum.indexOf(v) == -1) {
			return;
		}
		
		// TODO : enter your code here.			
		v = nexacro._toString(v);			
		if (this.importtype != v) {			
			this.importtype = v;		
		}			
	};
	
	//===============================================================		
    // nexacro.ExcelImport : Event		
    //===============================================================
	nexacro.ExcelImport.prototype.on_fire_canrun = function (userdata)
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
	
	nexacro.ExcelImport.prototype.on_fire_onsuccess = function (userdata)
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
	  
	nexacro.ExcelImport.prototype.on_fire_onerror = function (userdata)
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
    // nexacro.ExcelImport : 공통함수 전환부분
    //===============================================================
	/**
	 * @class  excel import( 데이터 헤더제외 ) <br>
	 * @param {String} sDataset - dataset	
	 * @param {String} [sSheet]	- sheet name
	 * @param {String} [sBody] - body 영역지정	
	 * @return N/A
	 * @example
	 * this.gfnExcelImport("dsList","SheetName","A2");
	 */
	nexacro.ExcelImport.prototype.gfnExcelImport = function(objForm, objDataset, sSheet, sBody, sImportType)
	{
		//this.setWaitCursor(true);    	
		if(this.gfnIsNull(objForm))			return;
		if(this.gfnIsNull(objDataset))		return;
		if(this.gfnIsNull(sSheet))			sSheet = "Sheet1";
		if(this.gfnIsNull(sBody))			sBody = "A2";
		if(this.gfnIsNull(sImportType))		sImportType = "EXCEL2007";
		
		var sFilefilter = this.gfnGetFileFilter(sImportType);
		var sDataset = objDataset.name;
		
		var objImport;	
		objImport = new nexacro.ExcelImportObject(sDataset + "_ExcelImport", objForm);				
		objImport.set_importurl(this._COM_EXCEL_URL);						
		objImport.set_importtype(eval("nexacro.ExportTypes." + sImportType.toUpperCase()));	
		objImport.set_filefilter(sFilefilter);
		
		//out dataset 생성(차후 onsucess 함수에서 헤더생성하기 위한)
		var sOutDsName = sDataset + "_outds";	
		if (objForm.isValidObject(sOutDsName)) {
			objForm.removeChild(sOutDsName);			
		}
		
		var objOutDs = new Dataset();
		objOutDs.name = sOutDsName;
		objForm.addChild(objOutDs.name, objOutDs);
		
		objImport.outds = objDataset;
		objImport.outdstemp = objOutDs;
		
		objImport.addEventHandler("onsuccess", this.gfnImportOnsuccess, this);
		objImport.addEventHandler("onerror", this.gfnImportAllOnerror, this);
		
		var sParam = "[command=getsheetdata;output=outDs;body=" + sSheet + "!" + sBody +";]";
		var sParam2 = "[" + sOutDsName + "=outDs]";
		
		objImport.importData("", sParam, sParam2);						
		objImport = null;	
		
		//this.setWaitCursor(false);
	};

	/**
	 * @class excel import on success <br>
	 * @param {Object} obj	
	 * @param {Event} e		
	 * @return N/A
	 * @example
	 */
	nexacro.ExcelImport.prototype.gfnImportOnsuccess = function(obj,  e)
	{
		var objOutDs = obj.outdstemp;
		var objOrgDs = obj.outds;
		var sColumnId;

		//기존 데이터셋의 내용으로 헤더복사
		for (var i = 0, s = objOrgDs.getColCount(); i < s; i++) {
			sColumnId = "Column" + i;
			if (sColumnId != objOrgDs.getColID(i)) {
				objOutDs.updateColID(sColumnId, objOrgDs.getColID(i))
			}
		}
		
		objOrgDs.clearData();
		objOrgDs.copyData(objOutDs);
		
		var objForm = objOutDs.parent;
		objForm.removeChild(objOutDs.name);
		objOutDs.destroy();
		objOutDs = null;

		// onsuccess 이벤트 호출
		this.on_fire_onsuccess();
	};

	/**
	 * @class  excel import on error <br>
	 * @param {Object} obj	
	 * @param {Event} e		
	 * @return N/A
	 * @example
	 */
	nexacro.ExcelImport.prototype.gfnImportAllOnerror = function(obj,  e)
	{
		trace("Excel Import Error!! : " + e.errormsg);
		this.on_fire_onerror();	
	};
	
	nexacro.ExcelImport.prototype.gfnGetFileFilter = function(sImportType)
	{
		var strFilefilter = "";
		
		switch(sImportType)
		{
			case "EXCEL":
				strFilefilter = "Worksheet 97 - 2003 Files (*.xls)|*.xls|";
				break;
			case "EXCEL2007":
				strFilefilter = "Worksheet Files (*.xlsx)|*.xlsx|";
				break;
			case "HANCELL2014":
				strFilefilter = "Hancell Files (*.cell)|*.cell|";
				break;
			case "CSV":
				strFilefilter = "CSV (*.csv)|*.csv|";
				break;
			default : break;
		}
		
		strFilefilter += "All (*.xls;*.xlsx;*.cell;*.csv)|*.xls;*.xlsx;*.cell;*.csv|";
		
		return strFilefilter;
	};
}
	