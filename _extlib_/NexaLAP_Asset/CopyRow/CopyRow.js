//==============================================================================
//	Define the Action.
//==============================================================================
//==============================================================================		
// Object : nexacro.CopyRow		
// Group : Action		
//==============================================================================		
if (!nexacro.CopyRow)		
{		
    nexacro.CopyRow = function(id, parent)		
    {		
        nexacro.Action.call(this, id, parent);
		this.addEvent("canrun");
    };		
        		
    nexacro.CopyRow.prototype = nexacro._createPrototype(nexacro.Action, nexacro.CopyRow);		
    nexacro.CopyRow.prototype._type_name = "CopyRow";		
	
	//===============================================================		
    // nexacro.CopyRow : Create & Destroy		
    //===============================================================		
    nexacro.CopyRow.prototype.destroy = function()		
	{	
		nexacro.Action.prototype.destroy.call(this);
	};	
		
    //===============================================================		
    // nexacro.CopyRow : Method		
    //===============================================================		
    nexacro.CopyRow.prototype.run = function()		
	{	
		//If the canrun event return value is not false			
		if(this.on_fire_canrun()!=false)			
		{
			//Import the object set as TargetView			
			var objView = this.getTargetView();	
			var sTargetDs = this.targetdataset;
			var nTargetRow;
			var objFromView = this._findViewObject(this.fromview);
			var sFromDs = this.fromdataset;
			var nFromRow;
		
			var objToDs 	= this._targetdataset;
			var objFormDs	= this._fromdataset;
			
			if (this.gfnIsNull(objToDs))	objToDs 	= this.gfnGetDataset(objView,sTargetDs);
			if (this.gfnIsNull(objFormDs))	objFormDs	= this.gfnGetDataset(objFromView,sFromDs);
			
			if (this.gfnIsNull(objToDs))
			{
				this.gfnLog("Dataset does not found.","info");
				this.on_fire_onerror("error");
				return;
			}
			
			if (this.gfnIsNull(objFormDs))
			{
				this.gfnLog("Dataset does not found.","info");
				this.on_fire_onerror("error");
				return;
			}
			
			// 모델정보에 따라 복사할 컬럼값 설정
			var strColInfo = this.gfnSetModelArgument(objView);
			
 			// Call Function
 			this.gfnCopyRowData(objToDs,objFormDs,nTargetRow,nFromRow,strColInfo);
		}	
	};	
	
	nexacro.CopyRow.prototype._targetdataset = null;
	nexacro.CopyRow.prototype.set_targetdataset = function (v)				
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
	
	nexacro.CopyRow.prototype.fromview = "";
	nexacro.CopyRow.prototype._fromview = null;
	nexacro.CopyRow.prototype.set_fromview = function (v) {
		if (this.fromview !== v) {
			this.fromview = v;
			this._fromview = null;
		}
	};
	
	nexacro.CopyRow.prototype._fromdataset = null;
	nexacro.CopyRow.prototype.set_fromdataset = function (v)				
	{				
		if (v instanceof nexacro.NormalDataset) {
			if (this.fromdataset != v.name) {			
				this.fromdataset = v.name;
				this._fromdataset = v;
			}		
		} else {
			v = nexacro._toString(v);
			
			if (this.fromdataset != v) {
				this.fromdataset = v;
				this._fromdataset = null;
				
				var objView = this._findViewObject(this.fromview);
				if (objView)
				{
					var objForm = objView.form;
					var objDs = objForm._findDataset(v);
					
					if (objDs != undefined) {
						this._fromdataset = objDs;
		 			}
				}
			}
		}
	};
	
	nexacro.CopyRow.prototype.targetrow = -1;
	nexacro.CopyRow.prototype.set_targetrow = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._parseInt(v);
		if (this.targetrow != v) {
			this.targetrow = v;
		}
	};
	
	nexacro.CopyRow.prototype.fromrow = -1;
	nexacro.CopyRow.prototype.set_fromrow = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._parseInt(v);
		if (this.fromrow != v) {
			this.fromrow = v;
		}
	};
	
	//===============================================================		
    // nexacro.CopyRow : Event		
    //===============================================================
	nexacro.CopyRow.prototype.on_fire_canrun = function (userdata)
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
	
	nexacro.CopyRow.prototype.on_fire_onsuccess = function (userdata)
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
	  
	nexacro.CopyRow.prototype.on_fire_onerror = function (userdata)
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
    // nexacro.CopyRow : 공통함수 전환부분
    //===============================================================
	/**
	 * @class 데이터를 복사
	 * @param {Object} objToDs - 복사 될 Dataset
	 * @param {Object} objFormDs - 복사 할 Dataset
	 * @param {String} nToRow - 복사 될 Row
	 * @param {String} nFromRow - 복사 할 Row
	 * @return N/A
	 */   
	nexacro.CopyRow.prototype.gfnCopyRowData = function (objToDs,objFormDs,nToRow,nFromRow,strColInfo)
	{
		if (this.gfnIsNull(nToRow))			nToRow = objToDs.rowposition;
		if (this.gfnIsNull(nFromRow))		nFromRow = objFormDs.rowposition;
		
		if (nFromRow < 0 || objFormDs.rowcount == 0)
		{
			this.gfnLog("No Selected row(s).","info");
			this.on_fire_onerror();
			return;
		}
		
		// To Dataset 처리
		if (nToRow < 0)
		{
			if (objToDs.rowcount == 0)		// To Dataset에 데이터 없는 경우 행 1개 추가
			{
				nToRow = objToDs.addRow();
			}
			else
			{
				nToRow = 0;
			}
		}
		
		var rtn = objToDs.copyRow(nToRow, objFormDs, nFromRow, strColInfo);
		
		if (rtn == false)
		{
			this.on_fire_onerror();
		}
		else
		{
			this.on_fire_onsuccess();
		}
	};
	
	// Model Argument 처리 : 설정된 모델정보만 복사
	nexacro.CopyRow.prototype.gfnSetModelArgument = function(oTargetView)
	{
		var strColInfo = "";
		
		// Model Argument 있는지 확인
		var oModelList = this.getContents("model");		// Action 내 model 정보 
		
		// 설정한 Model Argument가 있는 경우 복사할 컬럼정보설정
		if (oModelList)
		{
			var arrColInfo = new Array();
			var oFieldList;
			
			// targetview에 해당하는 Model Argument만 처리
			var oModel = oModelList.find(oModel => oModel["viewid"] = oTargetView.id);
			
			// fieldlist정보로 strColInfo 설정 : "fieldid1=value1,fieldid2=value2" 형식
			if (oModel)
			{
				oFieldList	= oModel["fieldlist"];
				oFieldList.forEach(oField => arrColInfo.push(oField["fieldid"] + "=" + oField["value"]));
				strColInfo = arrColInfo.join(",");
			}
		}
		
		return strColInfo;
	};
}
	