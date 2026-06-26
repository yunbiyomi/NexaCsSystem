//==============================================================================
//	Define the Action.
//==============================================================================
//==============================================================================		
// Object : nexacro.DeleteRow		
// Group : Action		
//==============================================================================		
if (!nexacro.DeleteRow)		
{		
    nexacro.DeleteRow = function(id, parent)		
    {		
        nexacro.Action.call(this, id, parent);
		this.addEvent("canrun");
    };		
        		
    nexacro.DeleteRow.prototype = nexacro._createPrototype(nexacro.Action, nexacro.DeleteRow);		
    nexacro.DeleteRow.prototype._type_name = "DeleteRow";
	
	//===============================================================		
    // nexacro.DeleteRow : Create & Destroy		
    //===============================================================		
    nexacro.DeleteRow.prototype.destroy = function()		
	{	
		nexacro.Action.prototype.destroy.call(this);
	};	
		
    //===============================================================		
    // nexacro.DeleteRow : Method		
    //===============================================================		
    nexacro.DeleteRow.prototype.run = function()		
	{	
        
		//If the canrun event return value is not false			
		if(this.on_fire_canrun()!=false)			
		{	
			//Import the object set as TargetView			
			var objView = this.getTargetView();	
			var objForm;
			
			var sTargetDs = this.targetdataset;
				
			var objDataset;
			var objComp;
			var objDs = this._targetdataset;
			
			if (this.gfnIsNull(objDs))	objDs 	= this.gfnGetDataset(objView,sTargetDs);
			
			if (this.gfnIsNull(objDs))
			{
				this.gfnLog("Dataset does not found.","info");
				this.on_fire_onerror("error");
				return;
			}
			
 			// Call Function
 			var rtn = this.gfnDeleteRow(objDs);
			
			if(rtn==false)
			{
				this.on_fire_onerror();
				
			}
			else
			{
				this.on_fire_onsuccess();
			}
		}	
	};	
	
	nexacro.DeleteRow.prototype._targetdataset = null;
	nexacro.DeleteRow.prototype.set_targetdataset = function (v)				
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
	
	nexacro.DeleteRow.prototype._rowindex = -1;
	nexacro.DeleteRow.prototype.set_rowindex = function (v)				
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
    // nexacro.DeleteRow : Event		
    //===============================================================
	nexacro.DeleteRow.prototype.on_fire_canrun = function (userdata)
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
	
	nexacro.DeleteRow.prototype.on_fire_onsuccess = function (userdata)
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
	  
	nexacro.DeleteRow.prototype.on_fire_onerror = function (userdata)
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
    // nexacro.DeleteRow : 공통함수 전환부분
    //===============================================================
		/**
	 * @class dataSet에 행삭제
	 * @param {Object} objDs - 확인 대상 Dataset
	 * @param {Number} nRowIndex - 필터된 데이터 체크여부(기본값:false)
	 * @return {Boolean} 삭제 성공실패여부
	 */   
	nexacro.DeleteRow.prototype.gfnDeleteRow = function (objDs)
	{
		var bSucc = objDs.deleteRow(objDs.rowposition);
		
		return bSucc;
	};
}
	