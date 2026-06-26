//==============================================================================	
//	Define the EventInfo.
//==============================================================================	
//==============================================================================	
// Object : nexacro.TransactionErrorEventInfo	
// Group : Object	
//==============================================================================	
if (!nexacro.TransactionErrorEventInfo)	
{	
    nexacro.TransactionErrorEventInfo = function(obj, id, serviceid, errorcode, errormsg)	
    {	
        nexacro.ActionEventInfo.call(this, obj, id);
		this.set_serviceid(serviceid);
		this.set_errorcode(errorcode);
		this.set_errormsg(errormsg);
    };	
        	
    nexacro.TransactionErrorEventInfo.prototype = nexacro._createPrototype(nexacro.ActionEventInfo, nexacro.TransactionErrorEventInfo);	
    nexacro.TransactionErrorEventInfo.prototype._type_name = "TransactionErrorEventInfo";	
	
	nexacro.TransactionErrorEventInfo.prototype.serviceid = "";
	nexacro.TransactionErrorEventInfo.prototype.set_serviceid = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toString(v);
		if (this.serviceid != v) {
			this.serviceid = v;
		}
	};	
	
	nexacro.TransactionErrorEventInfo.prototype.errorcode = "";
	nexacro.TransactionErrorEventInfo.prototype.set_errorcode = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._parseInt(v);
		if (this.errorcode != v) {
			this.errorcode = v;
		}
	};	
	
	nexacro.TransactionErrorEventInfo.prototype.errormsg = "";
	nexacro.TransactionErrorEventInfo.prototype.set_errormsg = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toString(v);
		if (this.errormsg != v) {
			this.errormsg = v;
		}
	};	

}	
	