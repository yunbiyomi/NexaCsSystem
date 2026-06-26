//==============================================================================	
//	Define the EventInfo.
//==============================================================================	
//==============================================================================	
// Object : nexacro.TransactionSuccessEventInfo	
// Group : Object	
//==============================================================================	
if (!nexacro.TransactionSuccessEventInfo)	
{	
    nexacro.TransactionSuccessEventInfo = function(obj, id, serviceid, errorcode, errormsg)	
    {	
        nexacro.ActionEventInfo.call(this, obj, id);	
		this.set_serviceid(serviceid);
		this.set_errorcode(errorcode);
		this.set_errormsg(errormsg);
    };	
        	
    nexacro.TransactionSuccessEventInfo.prototype = nexacro._createPrototype(nexacro.ActionEventInfo, nexacro.TransactionSuccessEventInfo);	
    nexacro.TransactionSuccessEventInfo.prototype._type_name = "TransactionSuccessEventInfo";	
	
	nexacro.TransactionSuccessEventInfo.prototype.serviceid = "";
	nexacro.TransactionSuccessEventInfo.prototype.set_serviceid = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toString(v);
		if (this.serviceid != v) {
			this.serviceid = v;
		}
	};	
	
	nexacro.TransactionSuccessEventInfo.prototype.errorcode = 0;
	nexacro.TransactionSuccessEventInfo.prototype.set_errorcode = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._parseInt(v);
		if (this.errorcode != v) {
			this.errorcode = v;
		}
	};	
	
	nexacro.TransactionSuccessEventInfo.prototype.errormsg = "";
	nexacro.TransactionSuccessEventInfo.prototype.set_errormsg = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toString(v);
		if (this.errormsg != v) {
			this.errormsg = v;
		}
	};	

}	
	