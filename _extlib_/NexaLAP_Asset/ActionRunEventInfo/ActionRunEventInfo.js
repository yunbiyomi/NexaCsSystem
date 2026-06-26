//==============================================================================	
//	Define the EventInfo.
//==============================================================================	
//==============================================================================	
// Object : nexacro.ActionRunEventInfo	
// Group : Object	
//==============================================================================	
if (!nexacro.ActionRunEventInfo)	
{	
    nexacro.ActionRunEventInfo = function(obj, id, userdata)	
    {	
        nexacro.ActionEventInfo.call(this, obj, id);
		this.set_userdata(userdata);
    };	
        	
    nexacro.ActionRunEventInfo.prototype = nexacro._createPrototype(nexacro.ActionEventInfo, nexacro.ActionRunEventInfo);	
    nexacro.ActionRunEventInfo.prototype._type_name = "ActionRunEventInfo";	
	
	nexacro.ActionRunEventInfo.prototype.userdata = "";
	nexacro.ActionRunEventInfo.prototype.set_userdata = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toString(v);
		if (this.userdata != v) {
			this.userdata = v;
		}
	};	

}	
	