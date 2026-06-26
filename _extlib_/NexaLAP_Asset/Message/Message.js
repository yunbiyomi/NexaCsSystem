//==============================================================================
//	Define the Action.
//==============================================================================
//==============================================================================
// Object : nexacro.Message
// Group : Action
//==============================================================================
if (!nexacro.Message)
{
	nexacro.Message = function(id, parent)
	{
		nexacro.Action.call(this, id, parent);
		this.addEvent("canrun");
	};
	
	nexacro.Message.prototype = nexacro._createPrototype(nexacro.Action, nexacro.Message);
	nexacro.Message.prototype._type_name = "Message";
	
	//===============================================================
	// nexacro.Message : Create & Destroy
	//===============================================================
	nexacro.Message.prototype.destroy = function()
	{
		nexacro.Action.prototype.destroy.call(this);
	};
	
	//===============================================================
	// nexacro.Message : Method
	//===============================================================
	nexacro.Message.prototype.run = function()
	{
		//TODO
		//canrun 이벤트의 리턴값이 false가 아닐경우
		if(this.on_fire_canrun()!=false)
		{
			//messagetype이 confirm일 경우
			if(this.messagetype=="confirm")
			{
				//Confirm 호출
				var rtn = confirm(this.message);
				
				//리턴값에 따라 onsuccess or onerror 이벤트 호출
				if(rtn==true)
				{
					this.on_fire_onsuccess("userdata");
				}else
				{
					this.on_fire_onerror("userdata");
				}
			}
			//messagetype이 alert일 경우
			else
			{
				//Alert 호출
				alert(this.message);
				
				//onsuccess 이벤트 호출
				this.on_fire_onsuccess();
			}
		}
	};
	
	nexacro.Message.prototype.message = "";
	nexacro.Message.prototype.set_message = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toString(v);
		if (this.message != v) {
			this.message = v;
		}
	};
	
	nexacro.Message.prototype.messagetype = "";
	nexacro.Message.prototype.set_messagetype = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toString(v);
		if (this.messagetype != v) {
			this.messagetype = v;
		}
	};	
	
	nexacro.Message.prototype.on_fire_canrun = function (userdata)
	{
		if (this.canrun && this.canrun._has_handlers)
		{
			var evt = new nexacro.ActionRunEventInfo(this, "canrun", userdata); //TODO
			return this.canrun._fireCheckEvent(this, evt);
		}
		return true;
	};
	
	nexacro.Message.prototype.on_fire_onsuccess = function (userdata)
	{
		var event = this.onsuccess;
		if (event && event._has_handlers)
		{
			var evt = new nexacro.ActionSuccessEventInfo(this, "onsuccess", userdata); //TODO
			event._fireEvent(this, evt);
		}
	};
	
	nexacro.Message.prototype.on_fire_onerror = function (userdata)
	{
		var event = this.onerror;
		if (event && event._has_handlers)
		{
			var evt = new nexacro.ActionErrorEventInfo(this, "onerror", userdata); //TODO
			event._fireEvent(this, evt);
		}
	};
	
}
	