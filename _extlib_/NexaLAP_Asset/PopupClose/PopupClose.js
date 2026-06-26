//==============================================================================
//	Define the Action.
//==============================================================================
//==============================================================================		
// Object : nexacro.PopupClose		
// Group : Action		
//==============================================================================		
if (!nexacro.PopupClose)		
{		
    nexacro.PopupClose = function(id, parent)		
    {		
        nexacro.Action.call(this, id, parent);
		this.addEvent("canrun");
    };
        		
    nexacro.PopupClose.prototype = nexacro._createPrototype(nexacro.Action, nexacro.PopupClose);		
    nexacro.PopupClose.prototype._type_name = "PopupClose";
	
	//===============================================================		
    // nexacro.PopupClose : Create & Destroy		
    //===============================================================		
    nexacro.PopupClose.prototype.destroy = function()		
	{	
		nexacro.Action.prototype.destroy.call(this);
	};	
		
    //===============================================================		
    // nexacro.PopupClose : Method		
    //===============================================================		
    nexacro.PopupClose.prototype.run = function()		
	{			

		//If the canrun event return value is not false			
		if(this.on_fire_canrun()!=false)			
		{
			//Import the object set as TargetView			
			var objForm = this.gfnGetForm();
			var sRet = "";
			
			var objChildFrame	= objForm.getOwnerFrame();
			var objChildForm	= objChildFrame.form;
			
			// 팝업창 닫기
			if (!this.gfnIsNull(objChildForm.opener))
			{
				objChildForm.close(sRet);
			}
		}		
	};
	
	//===============================================================		
    // nexacro.PopupClose : Event		
    //===============================================================
	nexacro.PopupClose.prototype.on_fire_canrun = function (userdata)
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
	
	nexacro.PopupClose.prototype.on_fire_onsuccess = function (userdata)
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
	  
	nexacro.PopupClose.prototype.on_fire_onerror = function (userdata)
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
}
	