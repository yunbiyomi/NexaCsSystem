//==============================================================================	
//	Define the EventInfo.
//==============================================================================	
//==============================================================================	
// Object : nexacro.DXChartEventInfo	
// Group : Object	
//==============================================================================	
if (!nexacro.DXChartEventInfo)	
{	
    nexacro.DXChartEventInfo = function(obj,id,chartObj,e)	
    {	
		this.id = this.eventid = id;
		this.chartobject = chartObj;
		this.fromobject = this.fromreferenceobject = obj;
		this.pointer = e;
		
		if(e){
			this.altkey = e.altKey;
			this.clientx = e.clientX;
			this.clienty  = e.clientY;
			this.screenx  = e.screenX;
			this.screeny  = e.screenY;
			this.shiftkey = e.shiftKey;
			this.type  = e.type;
		}
    };	
        	
    nexacro.DXChartEventInfo.prototype = nexacro._createPrototype(nexacro.EventInfo, nexacro.DXChartEventInfo);	
    nexacro.DXChartEventInfo.prototype._type_name = "DXChartEventInfo";	
}	
