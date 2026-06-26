var pAction = nexacro.Action.prototype;

//===============================================================
// nexacro.Action : Variable declaration (change per project)
//===============================================================
// Debug level. Debug logs below the set level are not output.
// (-1 : not checked) [0:"debug", 1:"info", 2:"warn", 3:"error"]
pAction._LOG_LEVEL		= -1;
// Target Action : Transaction
pAction._TRAN_CALLBACK_NM = "fnTransactionCallback";			// Action common Callback function name

pAction._POPUP_CALLBACK = "fnPopupActionCallback";			// 팝업 Callback함수(Action 내부에서 사용)
//===============================================================
// nexacro.Action : Common functions (Util)
//===============================================================
/**
 * @class Check if the value exists
 * @param {String} sValue	
 * @return {Boolean} true/false
 * @example
 * var bNull = this.gfnIsNull("aaa");	// false
 */
pAction.gfnIsNull = function (Val)				
{				
	if (new String(Val).valueOf() == "undefined") return true;			
	if (Val == null) return true;			
	if (("x" + Val == "xNaN") && (new String(Val.length).valueOf() == "undefined")) return true;			
	if (Val.length == 0) return true;			
				
	return false;			
};

/**
 * create random id
 * @param {String} sBaseID 
 */
pAction.gfnRandomID = function (sBaseID)				
{				
	var nMin = 0, nMax = 100000;
	var nRandom = Math.floor(Math.random() * (nMax - nMin + 1)) + nMin;
	return sBaseID + nRandom;
};

/**
 * Output log
 * @param {String} sMsg Output log string
 * @param {String} sType Log type("debug","info","warn","error")	
 */
pAction.gfnLog = function(sMsg, sType)
{
	var arrLogLevel = ["debug","info","warn","error"];

	if(sType == undefined)	sType = "debug";
	var nLvl = arrLogLevel.indexOf(sType);
	
	if (nLvl < nexacro.toNumber(this._LOG_LEVEL,-1))		return;
	
	var sLog = "";
	
	if (sMsg instanceof Object) {
		sLog = "[" + sType + "] " + this.name + " > " + JSON.stringify(sMsg, null, "\t");
	} else {
		sLog = "[" + sType + "] " + this.name + " > " + sMsg;
	}
	
	if (system.navigatorname == "nexacro DesignMode"
		|| system.navigatorname == "nexacro") {
		trace(sLog);
	} else {
		console.log(sLog);
	}
};

//===============================================================
// nexacro.Action : Common functions related to Action
//===============================================================
/**
 * Return form based on targetview in Action
 * @return {Object} Form object
 */
// Only works in run()
pAction.gfnGetForm = function ()				
{				
	//var objView 		= this._findViewObject(this.targetview);
	var objView 		= this.getTargetView();
	var objForm;
	
	if(objView)objForm = objView.form;		
	else objForm = this.parent;
				
	return objForm;			
};

/**
 * Return targetcomp
 * @param {String} sCompId Component ID
 * @return {Object} Component object
 */
// Only works in run()
pAction.gfnGetTargetComp = function (sCompId)				
{
	if (this._targetcomp) {
		return this._targetcomp;
	}
	
	var objForm = this.gfnGetForm();
	var objComp = null;
	
	if (objForm)
	{
		objComp = objForm._findComponentForArrange(sCompId);
	}
				
	return this._targetcomp = objComp;			
};

/**
 * Return dataset(if sDatasetId is not input, return viewdataset of objView)
 * @param {Object} objView View object
 * @param {String} sDatasetId Dataset ID
 * @return {Object} Dataset object
 */
// Only works in run()
pAction.gfnGetDataset = function (objView, sDatasetId)
{
	var objForm;
	var objDs;
	var objDsNm;
	
	if(objView)objForm = objView.form;		
	else objForm = this.parent;
	
	// Find dataset object
	if (sDatasetId instanceof nexacro.NormalDataset) {				// When targetgrid is set, find the corresponding grid
		objDs = sDatasetId;
	} else if (sDatasetId) {				// When targetgrid is set, find the corresponding grid
		objDsNm = sDatasetId.replace("@", "");
		objDs = objForm._findDataset(objDsNm);
	} else if(objView instanceof nexacro.View){						// When targetgrid is not set, find the grid in the View
		objDs = objView.getViewDataset();
	}

	return objDs;
};

/**
 * Return the value of the field
 * @param {Object} oField - model Field object
 * @param {Object} oView - View object (if targetview is not the case)
 * @param {Boolean} bEval - Whether to return the result of eval
 * @return Field's value
 */
pAction.gfnGetFieldValue = function(oField, oView, bEval, sTargetForm)
{
	var sReturnValue;
	var sFieldValue;
	
	if (this.gfnIsNull(oField))				return;
	if (this.gfnIsNull(bEval))				bEval = true;
	
	if (oField instanceof Object) {
		sFieldValue	= oField["value"];
	} else {
		sFieldValue	= oField;
	}
	
	if (this.gfnIsNull(sFieldValue))		return;
	
	var sType = sFieldValue.toString().substr(0,5).toLowerCase();
	
	switch (sType)
	{
		case "expr:":
			var sExprText = sFieldValue.toString().substr(5);
			
			// View name to be used when converting expr
			var sViewNm = oView ? oView.name : this.targetview;
			
			// expr Text processing
			sReturnValue = this.gfnGetExprText(sExprText, sViewNm, sTargetForm);
			
			// Execute dataset value and get value
			if (!this.gfnIsNull(sReturnValue) && bEval) {
				sReturnValue = eval(sReturnValue);
			}
			
			break;
		default:
			sReturnValue = sFieldValue;
			break;
	}
	
	return sReturnValue;
};

/**
 * processing reserved words and shortcuts
 * @param {String} sExprText - expr processing target text
 * @param {String} sViewNm - Default value of the View ID
 * @return Processed text value with reserved words and shortcuts
 */
pAction.gfnGetExprText = function(sExprText, sViewNm, sForm)
{
	if (this.gfnIsNull(sExprText))			return sExprText;
	if (this.gfnIsNull(sForm))				sForm = "this.parent";
	
	var sRetText = sExprText;
	
	
	// 1) Extract values between '[' and ']'
	// [field] format: return the value of the field of the viewdataset of the targetview
	// [view:field] format: return the value of the field of the viewdataset of the view
	// [view:datasetid:field] format: return the value of the field of the datasetid of the view
	// [view:datasetid:row:field] format: return the value of the field of the row of the datasetid of the view
	//var regEx = /(?<=\[)(.*?)(?=\])/g;
	//var regEx = new RegExp('(?<=\\[)(.*?)(?=\\])','g');
	var regEx = /\[.*?\]/g;
	var sMatch;
	var sView;
	var sViewDataset;
	var sColumnId;
	var sRow;
	var sReText;
	var sValue;
	
	// Conversion processing
	while ((m = regEx.exec(sRetText)) !== null)
	{
		// This is necessary to avoid infinite loops with zero-width matches
		if (m.index === regEx.lastIndex) {
			regEx.lastIndex++;
		}
		
		sMatch = m[0].substring(1,  m[0].length-1);
		
		var arrMatch = sMatch.split(":");
		
		if (arrMatch.length == 1) {				// [field] format
			sView			= sViewNm;
			sViewDataset	= sForm + "." + sView + ".form.viewdataset";
			sRow			= sViewDataset + ".rowposition";
			sColumnId		= arrMatch[0];
		} else if (arrMatch.length == 2) {		// [view:field] format
			sView			= arrMatch[0];
			sViewDataset	= sForm + "." + sView + ".form.viewdataset";
			sRow			= sViewDataset + ".rowposition";
			sColumnId		= arrMatch[1];
		} else if (arrMatch.length == 3) {		// [view:datasetid:field] format
			sView			= arrMatch[0];
			sViewDataset	= sForm + "." + sView + ".form." + arrMatch[1];
			sRow			= sViewDataset + ".rowposition";
			sColumnId		= arrMatch[2];
		} else if (arrMatch.length == 4) {		// [view:datasetid:row:field] format
			sView			= arrMatch[0];
			sViewDataset	= sForm + "." + sView + ".form." + arrMatch[1];
			sRow			= arrMatch[2];
			sColumnId		= arrMatch[3];
		} else {
			continue;
		}
		
		// Conversion processing : this.parent.[view].form.viewdataset.getColumn(this.parent.[view].form.viewdataset.rowposition,'[field]')
		sReplace = sViewDataset + ".getColumn(" + sRow + ",'" + sColumnId + "')";
		sRetText = sRetText.replace("[" + sMatch + "]",sReplace);
	}
	
	return sRetText;
};

/**
 * Return form based on targetview in Action
 * @return {Object} Dataset ID
 */
// Only works in run()
pAction.gfnMakeBackendServiceInfoDataset = function (objForm, sWorkflowId)				
{
	var prjName = nexacro.getApplication().projectName;
	prjName = nexacro.NexaLAP._projectNo ?? prjName;
	
	if (objForm._BackendServiceInfo == undefined || objForm._BackendServiceInfo == null) {
		objForm._BackendServiceInfo = new Dataset();
		objForm._BackendServiceInfo.set_name("_BackendServiceInfo");
		objForm._BackendServiceInfo.addColumn("name", "STRING", "256");
		objForm._BackendServiceInfo.addColumn("project", "STRING", "256");
	}

	objForm._BackendServiceInfo.clearData();

	// NexacroLAPServer Workflow(Service) ID
	// model::domain/service -> domain/service 변환
	sWorkflowId = sWorkflowId.replace(/::/g, '/');

	objForm._BackendServiceInfo.addRow();
	objForm._BackendServiceInfo.setColumn(0, "name", sWorkflowId);
	objForm._BackendServiceInfo.setColumn(0, "project", prjName);

	return '_BackendServiceInfo';
};