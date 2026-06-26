//==============================================================================	
//	Define the EventInfo.
//==============================================================================	
//==============================================================================	
// Object : nexacro.ActionSuccessEventInfo	
// Group : Object	
//==============================================================================	
if (!nexacro.ActionSuccessEventInfo)	
{	
    nexacro.ActionSuccessEventInfo = function(obj, id, userdata)	
    {	
        nexacro.ActionEventInfo.call(this, obj, id);
		this.set_userdata(userdata);
    };	
        	
    nexacro.ActionSuccessEventInfo.prototype = nexacro._createPrototype(nexacro.ActionEventInfo, nexacro.ActionSuccessEventInfo);	
    nexacro.ActionSuccessEventInfo.prototype._type_name = "ActionSuccessEventInfo";	

	nexacro.ActionSuccessEventInfo.prototype.userdata = "";
	nexacro.ActionSuccessEventInfo.prototype.set_userdata = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toString(v);
		if (this.userdata != v) {
			this.userdata = v;
		}
	};
}	
