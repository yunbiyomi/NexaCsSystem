//==============================================================================
//	Define the Action.
//==============================================================================
//==============================================================================		
// Object : nexacro.CommInitAction		
// Group : Action		
//==============================================================================		
if (!nexacro.CommInitAction)		
{		
    nexacro.CommInitAction = function(id, parent)		
    {		
        nexacro.Action.call(this, id, parent);		
    };		
        		
    nexacro.CommInitAction.prototype = nexacro._createPrototype(nexacro.Action, nexacro.CommInitAction);		
    nexacro.CommInitAction.prototype._type_name = "CommInitAction";		
	
	//===============================================================		
    // nexacro.CommInitAction : Create & Destroy		
    //===============================================================		
    nexacro.CommInitAction.prototype.destroy = function()		
	{	
		nexacro.Action.prototype.destroy.call(this);
	};	
		
    //===============================================================		
    // nexacro.CommInitAction : Method		
    //===============================================================		
    nexacro.CommInitAction.prototype.run = function()		
	{	
        //TODO
		var objForm = this.parent;
		
		this.fnCallOnLoadView(objForm);
	};	
	
	nexacro.CommInitAction.prototype.fnCallOnLoadView = function(objForm)
	{
		var objComps = objForm.components;
		var nLength = objComps.length;
		var objTargetComp;
		
		for(var i=0;i<nLength;i++)
		{
			objTargetComp = objComps[i];
			
			if(objTargetComp instanceof nexacro.View)
			{
				if(objTargetComp.form._fnViewOnLoad)
				{
					objTargetComp.form._fnViewOnLoad(objForm);
				}
			}
		}
		
		
	}
}
