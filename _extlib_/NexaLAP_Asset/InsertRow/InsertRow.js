////==============================================================================
//	Define the Action.
//==============================================================================
//==============================================================================		
// Object : nexacro.InsertRow		
// Group : Action		
//==============================================================================		
if (!nexacro.InsertRow)		
{		
    nexacro.InsertRow = function(id, parent)		
    {		
        nexacro.Action.call(this, id, parent);
		this.addEvent("canrun");
    };		
        		
    nexacro.InsertRow.prototype = nexacro._createPrototype(nexacro.Action, nexacro.InsertRow);		
    nexacro.InsertRow.prototype._type_name = "InsertRow";		
	
	//===============================================================		
    // nexacro.InsertRow : Create & Destroy		
    //===============================================================		
    nexacro.InsertRow.prototype.destroy = function()		
	{	
		nexacro.Action.prototype.destroy.call(this);
	};	
		
    //===============================================================		
    // nexacro.InsertRow : Method		
    //===============================================================		
    nexacro.InsertRow.prototype.run = function()		
	{			
		//If the canrun event return value is not false			
		if(this.on_fire_canrun()!=false)			
		{
			//Import the object set as TargetView			
			var objView = this.getTargetView();	
			
			var sTargetDs = this.targetdataset;
				
			var objDataset;
			var objComp;
			var nRowIndex = this._rowindex;
			
			var objDs = this._targetdataset;
			
			if (this.gfnIsNull(objDs))		objDs 	= this.gfnGetDataset(objView,sTargetDs);
			
			if (this.gfnIsNull(objDs))
			{
				this.gfnLog("Dataset does not found.","info");
				this.on_fire_onerror("error");
				return;
			}
			
 			// Call Function
 			var nAddRow = this.gfnInsertRow(objDs, nRowIndex);
		
			// Model Argument 처리 : 해당 데이터셋에 value값 설정
			var ret1 = this.gfnSetModelArgument(objDs, nAddRow);
			
			// User Argument 처리 : 해당 데이터셋에 value값 설정
			var ret2 = this.gfnSetUserArgument(objDs, nAddRow);
			
			if (nAddRow >= 0 && ret1 && ret2)
			{
				this.on_fire_onsuccess(nAddRow);
				return;
			}
			else
			{
				this.on_fire_onerror(nAddRow);
				return;
			}
		}		
	};	
	
	nexacro.InsertRow.prototype._targetdataset = null;
	nexacro.InsertRow.prototype.set_targetdataset = function (v)				
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
	
	nexacro.InsertRow.prototype._rowindex = -1;
	nexacro.InsertRow.prototype.set_rowindex = function (v)				
	{
		var nRow = nexacro.toNumber(v,-1,-1,-1);
		
		// TODO : enter your code here.
		if (nRow < 0) {
			this._rowindex = -1;
		} else {
			this._rowindex = nRow;
		}
	};
	
	//===============================================================		
    // nexacro.InsertRow : Event		
    //===============================================================
	nexacro.InsertRow.prototype.on_fire_canrun = function (userdata)
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
	
	nexacro.InsertRow.prototype.on_fire_onsuccess = function (userdata)
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
	  
	nexacro.InsertRow.prototype.on_fire_onerror = function (userdata)
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
    // nexacro.InsertRow : 공통함수 전환부분
    //===============================================================
		/**
	 * @class dataSet에 행추가
	 * @param {Object} objDs - 확인 대상 Dataset
	 * @param {Number} nRowIndex - 
	 * @return {Number} 추가된 행 Index
	 */   
	nexacro.InsertRow.prototype.gfnInsertRow = function (objDs, nRowIndex)
	{
		var nRow;
		var nARow;
		
		// 행 추가 위치 계산
		if (nRowIndex >= 0) {
			nARow = nRowIndex;
		} else if (objDs.rowposition < 0) {
			nARow = 0;
		} else {
			nARow = objDs.rowposition;
		}
		
		// 행추가
		nRow = objDs.insertRow(nARow);
		
		return nRow;
	};
	
	// Model Argument 처리 : 해당 데이터셋에 value값 설정(viewdataset용)
	nexacro.InsertRow.prototype.gfnSetModelArgument = function(objDs, nAddRow)
	{
		if (!objDs)							return false;
		if (nAddRow < 0)					return false;
		
		var oModelList = this.getContents("model");		// Action 내 model 정보 
		
		//this.gfnLog("model >>> ");
		//this.gfnLog(oModelList);
		
		if (!oModelList)					return true;
		
		// if (objDs.id != "viewdataset")
		// {
		// 	this.gfnLog("Only 'viewdataset' can be set.","info");
		// 	return true;
		// }
		
		var sViewId;
		var sModelId;
		var sIOType;
		var oFieldList;
		
		var oModel;
		var oField;
		
		var nRow;
		var sFieldValue;
		
		var oParent = objDs.parent.parent;
		var sParentId = oParent.id;
		
		for (var i = 0; i < oModelList.length; i++)
        {
			oModel		= oModelList[i];
			
			sViewId		= oModel["viewid"];
			sModelId	= oModel["modelid"];
			sIOType		= oModel["iotype"];
			oFieldList	= oModel["fieldlist"];
			
			if (sParentId == sViewId)
			{
				// 컬럼 셋팅
				for (var j = 0; j < oFieldList.length; j++)
				{
					oField = oFieldList[j];
					
					// Field의 value값 반환
					sFieldValue = this.gfnGetFieldValue(oField, oParent);
					
					// 데이터 셋팅
					objDs.setColumn(nAddRow, oField["fieldid"], sFieldValue);
				}
				
				break;
			}
		}
		
		return true;
	};
	
	// User Argument 처리 : 해당 데이터셋에 value값 설정
	nexacro.InsertRow.prototype.gfnSetUserArgument = function(objDs, nAddRow)
	{
		if (!objDs)							return false;
		if (nAddRow < 0)					return false;
		
		var oExtraList = this.getContents("extra");		// Action 내 extra 정보 
		
		//this.gfnLog("extra >>> ");
		//this.gfnLog(oExtraList);
		
		if (!oExtraList)		return true;
		
		var oExtra;
		var sExtraName;
		var sExtraValue;
		
		// oExtraList객체값을 transaction argument 형식으로 변환
		//oExtraList.forEach(oExtra => sReturnValue += " " + oExtra["name"] + "=" + nexacro.wrapQuote(oExtra["value"]));
		for (var i = 0; i < oExtraList.length; i++)
		{
			oExtra = oExtraList[i];
			sExtraName = oExtra["name"];
			
			// Field의 value값 반환
			sExtraValue = this.gfnGetFieldValue(oExtra);
			
			// 데이터 셋팅
			objDs.setColumn(nAddRow, sExtraName, sExtraValue);
		}
		
		return true;
	};
}
	