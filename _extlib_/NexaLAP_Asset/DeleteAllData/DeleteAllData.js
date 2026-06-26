//==============================================================================
//	Define the Action.
//==============================================================================
//==============================================================================		
// Object : nexacro.DeleteAllData		
// Group : Action		
//==============================================================================		
if (!nexacro.DeleteAllData)		
{		
    nexacro.DeleteAllData = function(id, parent)		
    {		
        nexacro.Action.call(this, id, parent);
		this.addEvent("canrun");
    };		
        		
    nexacro.DeleteAllData.prototype = nexacro._createPrototype(nexacro.Action, nexacro.DeleteAllData);		
    nexacro.DeleteAllData.prototype._type_name = "DeleteAllData";		
	
	//===============================================================		
    // nexacro.DeleteAllData : Create & Destroy		
    //===============================================================		
    nexacro.DeleteAllData.prototype.destroy = function()		
	{	
		nexacro.Action.prototype.destroy.call(this);
	};	
		
    //===============================================================		
    // nexacro.DeleteAllData : Method		
    //===============================================================		
    nexacro.DeleteAllData.prototype.run = function()		
	{	
		//If the canrun event return value is not false			
		if(this.on_fire_canrun()!=false)			
		{
			//Import the object set as TargetView			
			var objView = this.getTargetView();	
			var objForm;
			
			var sTargetDs = this.targetdataset;
			var sDeleteType = this.deletetype;
				
			var objDataset;
			var objComp;
		
			var objDs = this._targetdataset;
			
			if (this.gfnIsNull(objDs))	objDs 	= this.gfnGetDataset(objView,sTargetDs);
			
			// 데이터셋이 지정되지 않은 경우 error
			if (this.gfnIsNull(objDs))
			{
				this.gfnLog("Dataset does not found.","info");
				this.on_fire_onerror("error");
				return;
			}
			
 			// Call Function
 			var rtn = this.gfnDeleteAll(objDs,sDeleteType);
			
			if(rtn==0)
			{
				this.on_fire_onerror(rtn);
				
			}
			else
			{
				this.on_fire_onsuccess(rtn);
			}
		}
	};	
	
	nexacro.DeleteAllData.prototype._targetdataset = null;
	nexacro.DeleteAllData.prototype.set_targetdataset = function (v)				
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
	
	nexacro.DeleteAllData.prototype.set_deletetype = function (v)				
	{
		var deletetype_enum = ["delete", "clear"];
		if (v && deletetype_enum.indexOf(v) == -1) {
			return;
		}
		
		// TODO : enter your code here.			
		v = nexacro._toString(v);			
		if (this.deletetype != v) {			
			this.deletetype = v;		
		}			
	};
	
	//===============================================================		
    // nexacro.DeleteAllData : Event		
    //===============================================================
	nexacro.DeleteAllData.prototype.on_fire_canrun = function (userdata)
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
	
	nexacro.DeleteAllData.prototype.on_fire_onsuccess = function (userdata)
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
	  
	nexacro.DeleteAllData.prototype.on_fire_onerror = function (userdata)
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
    // nexacro.DeleteAllData : 공통함수 전환부분
    //===============================================================
		/**
	 * @class dataSet 전체삭제
	 * @param {Object} objDs - 대상 Dataset
	 * @param {String} sDeleteType - 삭제타입(기본값:delete)
	 * @return {Number} 삭제된 데이터(Row) 의 갯수를 반환
	 */   
	nexacro.DeleteAllData.prototype.gfnDeleteAll = function (objDs, sDeleteType)
	{
		var nDeleteCnt = 0;
		
		if (sDeleteType == "clear") {
			nDeleteCnt = objDs.clearData();
		} else {
			nDeleteCnt = objDs.deleteAll();
		}
		
		return nDeleteCnt;
	};
}
	