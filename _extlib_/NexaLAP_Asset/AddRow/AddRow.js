//==============================================================================
//	Define the Action.
//==============================================================================
//==============================================================================		
// Object : nexacro.AddRow		
// Group : Action		
//==============================================================================		
if (!nexacro.AddRow)		
{		
    nexacro.AddRow = function(id, parent)		
    {		
        nexacro.Action.call(this, id, parent);
		this.addEvent("canrun");
    };		
        		
    nexacro.AddRow.prototype = nexacro._createPrototype(nexacro.Action, nexacro.AddRow);		
    nexacro.AddRow.prototype._type_name = "AddRow";		
	
	//===============================================================		
    // nexacro.AddRow : Create & Destroy		
    //===============================================================		
    nexacro.AddRow.prototype.destroy = function()		
	{	
		nexacro.Action.prototype.destroy.call(this);
	};	
		
    //===============================================================		
    // nexacro.AddRow : Method		
    //===============================================================		
    nexacro.AddRow.prototype.run = function()		
	{	
		//If the canrun event return value is not false			
		if(this.on_fire_canrun()!=false)			
		{
			//Import the object set as TargetView			
			var objView = this.getTargetView();	
			
			var sTargetDs = this.targetdataset;
				
			var objDataset;
			var objComp;
		
			var objDs = this._targetdataset;
			
			if (this.gfnIsNull(objDs))		objDs 	= this.gfnGetDataset(objView,sTargetDs);
			
			if (this.gfnIsNull(objDs))
			{
				this.gfnLog("Dataset does not found.","info");
				this.on_fire_onerror("error");
				return;
			}
			
 			// Call Function
 			var nAddRow = this.gfnAddRow(objDs);
			
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
	
	nexacro.AddRow.prototype._targetdataset = null;
	nexacro.AddRow.prototype.set_targetdataset = function (v)				
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
	
	//===============================================================		
    // nexacro.AddRow : Event		
    //===============================================================
	nexacro.AddRow.prototype.on_fire_canrun = function (userdata)
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
	
	nexacro.AddRow.prototype.on_fire_onsuccess = function (userdata)
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
	  
	nexacro.AddRow.prototype.on_fire_onerror = function (userdata)
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
    // nexacro.AddRow : 공통함수 전환부분
    //===============================================================
	/**
	 * @class Dataset에 행추가
	 * @param {Object} objDs - 대상 Dataset
	 * @return {Number} 추가된 행 Index
	 */   
	nexacro.AddRow.prototype.gfnAddRow = function (objDs)
	{
		var nRow;
		
		// 행추가
		nRow = objDs.addRow();
		
		return nRow;
	};
	
	// Model Argument 처리 : 해당 데이터셋에 value값 설정(viewdataset용)
	nexacro.AddRow.prototype.gfnSetModelArgument = function(objDs, nAddRow)
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
	nexacro.AddRow.prototype.gfnSetUserArgument = function(objDs, nAddRow)
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
	