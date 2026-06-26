//==============================================================================
//	Define the Action.
//==============================================================================
//==============================================================================		
// Object : nexacro.CopyData		
// Group : Action		
//==============================================================================		
if (!nexacro.CopyData)		
{		
    nexacro.CopyData = function(id, parent)		
    {		
        nexacro.Action.call(this, id, parent);
		this.addEvent("canrun");
    };		
        		
    nexacro.CopyData.prototype = nexacro._createPrototype(nexacro.Action, nexacro.CopyData);		
    nexacro.CopyData.prototype._type_name = "CopyData";
	
	//===============================================================		
    // nexacro.CopyData : Create & Destroy		
    //===============================================================		
    nexacro.CopyData.prototype.destroy = function()		
	{	
		nexacro.Action.prototype.destroy.call(this);
	};	
		
    //===============================================================		
    // nexacro.CopyData : Method		
    //===============================================================		
    nexacro.CopyData.prototype.run = function()		
	{			
		//If the canrun event return value is not false			
		if(this.on_fire_canrun()!=false)			
		{
			//Import the object set as TargetView			
			var objView = this.getTargetView();	
			var sTargetDs = this.targetdataset;
			var objFromView = this._findViewObject(this.fromview);
			var sFromDs = this.fromdataset;
			var sCopyType = this.copytype;
			var sFilter = this.filter;
		
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
			
 			// Call Function
 			var rtn = this.gfnCopyData(objToDs,objFormDs,sCopyType,sFilter);
			
			if(rtn==0)
			{
				this.on_fire_onerror();
			}
			else
			{
				this.on_fire_onsuccess(rtn);
			}
		}
	};
	
	nexacro.CopyData.prototype._targetdataset = null;
	nexacro.CopyData.prototype.set_targetdataset = function (v)				
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
	
	nexacro.CopyData.prototype.fromview = "";
	nexacro.CopyData.prototype._fromview = null;
	nexacro.CopyData.prototype.set_fromview = function (v) {
		if (this.fromview !== v) {
			this.fromview = v;
			this._fromview = null;
		}
	};
	
	nexacro.CopyData.prototype._fromdataset = null;
	nexacro.CopyData.prototype.set_fromdataset = function (v)				
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
	
	nexacro.CopyData.prototype.set_copytype = function (v)				
	{
		var copytype_enum = ["replace", "append"];
		if (v && copytype_enum.indexOf(v) == -1) {
			return;
		}
		
		// TODO : enter your code here.			
		v = nexacro._toString(v);			
		if (this.copytype != v) {			
			this.copytype = v;		
		}			
	};
	
	nexacro.CopyData.prototype.filter = "";
	nexacro.CopyData.prototype.set_filter = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toString(v);
		if (this.filter != v) {
			this.filter = v;
		}
	};
	//===============================================================		
    // nexacro.CopyData : Event		
    //===============================================================
	nexacro.CopyData.prototype.on_fire_canrun = function (userdata)
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
	
	nexacro.CopyData.prototype.on_fire_onsuccess = function (userdata)
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
	  
	nexacro.CopyData.prototype.on_fire_onerror = function (userdata)
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
    // nexacro.CopyData : 공통함수 전환부분
    //===============================================================
	/**
	 * @class 데이터를 복사
	 * @param {Object} objToDs - 복사 될 Dataset
	 * @param {Object} objFormDs - 복사 할 Dataset
	 * @param {String} sCopyType - 복사타입(기본값:replace)
	 * @param {String} sFilter - 필터 String
	 * @return N/A
	 */   
	nexacro.CopyData.prototype.gfnCopyData = function (objToDs,objFormDs,sCopyType,sFilter)
	{
		var sOrgFilter = objFormDs.filterstr;
		var nCnt = 0;
		var sFilterStr = "";
		
		if (this.gfnIsNull(sOrgFilter))		sOrgFilter = "";
		
		objFormDs.set_enableevent(false);
		
		if (!this.gfnIsNull(sFilter))
		{
			sFilterStr = this.gfnGetFieldValue(sFilter, this.targetview, false,"this.parent.parent.parent");
			
			objFormDs.filter("");
			objFormDs.filter(sFilterStr);
		}
		
		if (sCopyType == "append")
		{
			nCnt = objToDs.appendData(objFormDs, true, true);
		}
		else
		{
			nCnt = objToDs.copyData(objFormDs, true);
		}
		
		if (!this.gfnIsNull(sFilter))
		{
			objFormDs.filter(sOrgFilter);
		}
		
		objFormDs.set_enableevent(true);
		
		return nCnt;
	};
}
	