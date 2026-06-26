//==============================================================================	
//	Define the EventInfo.
//==============================================================================	
//==============================================================================	
// Object : nexacro.ActionErrorEventInfo	
// Group : Object	
//==============================================================================	
if (!nexacro.ActionErrorEventInfo)	
{	
    nexacro.ActionErrorEventInfo = function(obj, id, userdata)	
    {	
        nexacro.ActionEventInfo.call(this, obj, id);
		this.set_userdata(userdata);
    };	
        	
    nexacro.ActionErrorEventInfo.prototype = nexacro._createPrototype(nexacro.ActionEventInfo, nexacro.ActionErrorEventInfo);	
    nexacro.ActionErrorEventInfo.prototype._type_name = "ActionErrorEventInfo";	
	
	nexacro.ActionErrorEventInfo.prototype.userdata = "";
	nexacro.ActionErrorEventInfo.prototype.set_userdata = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toString(v);
		if (this.userdata != v) {
			this.userdata = v;
		}
	};	

}	
	