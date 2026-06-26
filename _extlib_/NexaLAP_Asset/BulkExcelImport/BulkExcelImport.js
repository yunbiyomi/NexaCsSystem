
//==============================================================================
//	Define the Action.
//==============================================================================
//==============================================================================		
// Object : nexacro.BulkExcelImport		
// Group : Action		
//==============================================================================		
if (!nexacro.BulkExcelImport)		
{		
    nexacro.BulkExcelImport = function(id, parent)		
    {		
        nexacro.Action.call(this, id, parent);		
		this.addEvent("canrun");
    };		
    
	var _pBulkExcelImport = nexacro._createPrototype(nexacro.Action, nexacro.BulkExcelImport);
    nexacro.BulkExcelImport.prototype = _pBulkExcelImport;
    _pBulkExcelImport._type_name = "BulkExcelImport";
	
	/* default properties */
	_pBulkExcelImport.servicemodel = "";
	_pBulkExcelImport.serviceurl = "";

	/* internal variable */
	_pBulkExcelImport._contents = null;
	
	//===============================================================		
    // nexacro.BulkExcelImport : Create & Destroy		
    //===============================================================		
    _pBulkExcelImport.destroy = function()		
	{	
		this._contents = null;
		nexacro.Action.prototype.destroy.call(this);
	};	
		
    //===============================================================		
    // nexacro.BulkExcelImport : Method		
    //===============================================================		
    _pBulkExcelImport.run = function()		
	{
		if(this.on_fire_canrun("userdata") != false)
		{
			var sInputDatasetStr = "";
			var sOutputDatasetStr = "";
			var sArgumentsStr = "";

			// Contents Parameters
			var objContents = this._contents;
			if (objContents) {
				sInputDatasetStr = this.fnBuildInputDatasetString(objContents.inputdatasets || []);
				sOutputDatasetStr = this.fnBuildOutputDatasetString(objContents.outputdatasets || []);
				sArgumentsStr = this.fnBuildArgumentsString(objContents.arguments || []);
			}

			// Get Parameters for Transaction
			// sSvcId is a random value generated automatically
			var objAction		= this;
			var sSvcId 			= this.gfnRandomID(this.id);
			var sServiceUrl    	= this.serviceurl;	
			var sInDs 			= sInputDatasetStr;
			var sOutDs 			= sOutputDatasetStr;
			var sArgs 			= sArgumentsStr;
			var sCallback = this._TRAN_CALLBACK_NM;

			var fileDialog00 = new FileDialog("fileDialog");
			fileDialog00.addEventHandler("onclose", function(obj, e) {
	 			
	 			var oFileList = e.virtualfiles;
				var oFile = oFileList[0];
	 			var aFileName = oFile.filename.split(".");
	 			var aFileExt  = aFileName[1];
 
			    // 지원 확장자
			    var excelExtList = ["xls", "xlsx", "csv"];

			    // 확장자 체크
			    if (excelExtList.indexOf(aFileExt) < 0) {
			        alert("엑셀 형식 파일 업로드만 가능합니다.");
			        return;
			    }

				var f = new nexacro.FileUpTransfer();				
	 			f.addFile("files",oFile);
				
				f.addEventHandler("onsuccess", function(obj, e) {				
					var _fileMetaInfo = e.datasets[0];		
					sInDs += ' _FileMetaInfo=_FileMetaInfo';					
					objAction.fnTransaction(sSvcId, objAction, _fileMetaInfo, sServiceUrl, sInDs, sOutDs, sArgs, sCallback);					 
				});

				f.addEventHandler("onerror", function(obj, e) {
					trace("=== 업로드 실패처리 필요.===" + e.errormsg);
				});

				//NexaLAP Server 파일업로드 엔드포인트
				f.upload("NexaLAPServer::/file/upload");	
			});
			fileDialog00.open("파일 선택", FileDialog.LOAD);
		}
		
	};
	
	_pBulkExcelImport.set_servicemodel = function (v)
	{
		v = nexacro._toString(v);
		if (this.servicemodel != v) {
			this.servicemodel = v;
		}
	};
	
	_pBulkExcelImport.set_serviceurl = function (v)
	{
		v = nexacro._toString(v);
		if (this.serviceurl != v) {
			this.serviceurl = v;
		}
	};
	
	_pBulkExcelImport.on_fire_canrun = function (userdata)
	{
		var event = this.canrun;
		if (event && event._has_handlers)
		{
			var evt = new nexacro.ActionRunEventInfo(this, "canrun", userdata); //TODO
			return event._fireCheckEvent(this, evt);
		}
		return true;	
	};
	
	_pBulkExcelImport.on_fire_onsuccess = function (sSvcId, nErrorCd, sErrorMsg)
	{
		var event = this.onsuccess;
		if (event && event._has_handlers)
		{
			var evt = new nexacro.TranActionSuccessEventInfo(this, "onsuccess", sSvcId, nErrorCd, sErrorMsg); //TODO
			event._fireEvent(this, evt);
		}
	};
	
	_pBulkExcelImport.on_fire_onerror = function (sSvcId, nErrorCd, sErrorMsg)
	{
		var event = this.onerror;
		if (event && event._has_handlers)
		{
			var evt = new nexacro.TranActionErrorEventInfo(this, "onerror", sSvcId, nErrorCd, sErrorMsg); //TODO
			event._fireEvent(this, evt);
		}
	};

	_pBulkExcelImport.fnBuildInputDatasetString = function (arrInputDatasets) {
		var arrInputs = [];
		for (var i = 0; i < arrInputDatasets.length; i++) {
			var objInputDataset = arrInputDatasets[i];
			var sModelId = objInputDataset.modelid;
			var sDatasetId = objInputDataset.datasetid;
			var sType = objInputDataset.type;

			if (!sModelId || !sDatasetId) {
				continue;
			}

			var sInputStr = sModelId + "=" + sDatasetId;
			if (sType) {
				sInputStr += ":" + sType;
			}
			arrInputs.push(sInputStr);
		}
		return arrInputs.join(" ");
	};

	_pBulkExcelImport.fnBuildOutputDatasetString = function (arrOutputDatasets) {
		var arrOutputs = [];
		for (var i = 0; i < arrOutputDatasets.length; i++) {
			var objOutputDataset = arrOutputDatasets[i];
			var sModelId = objOutputDataset.modelid;
			var sDatasetId = objOutputDataset.datasetid;

			if (!sModelId || !sDatasetId) {
				continue;
			}

			arrOutputs.push(sDatasetId + "=" + sModelId);
		}
		return arrOutputs.join(" ");
	};

	_pBulkExcelImport.fnBuildArgumentsString = function (arrArguments) {
		var arrArgs = [];
		for (var i = 0; i < arrArguments.length; i++) {
			var objArgument = arrArguments[i];
			var arrKeys = [];

			for (var key in objArgument) {
				if (objArgument.hasOwnProperty(key)) {
					var value = objArgument[key];
					if (value != null && value !== "") {
						arrKeys.push(key + "=" + value);
					}
				}
			}

			if (arrKeys.length > 0) {
				arrArgs.push(arrKeys.join(" "));
			}
		}
		return arrArgs.join(" ");
	};

	_pBulkExcelImport.fnTransaction = function (sSvcId, sService, _fileMetaInfo, sInDs, sOutDs, sArgs, sCallback, bAsync) {
		if (this.gfnIsNull(sSvcId)) {
			this.gfnLog("Please check the service. : fnTransaction()", "error");
			return false;
		}

		if (this.gfnIsNull(sService)) {
			this.gfnLog("Please check the service url. : fnTransaction()", "error");
			return false;
		}

		// Set default value for callback function
		if (this.gfnIsNull(sCallback)) {
			sCallback = this._TRAN_CALLBACK_NM;
		}

		// Async
		if ((bAsync != true) && (bAsync != false)) {
			bAsync = true;
		}

		var objForm = this.gfnGetForm();

		// Log
		var dStartDate = new Date();
		var sStartTime = dStartDate.getTime();

		// Save service information for callback
		var objSvcId = {
			svcId: sSvcId
			, svcUrl: sService
			, callback: sCallback
			, isAsync: bAsync
			, startTime: sStartTime
		};

		// Set callback function
		objForm.fnTransactionCallback = this.fnTransactionCallback;

		// Set Action information to the form
		if (this.gfnIsNull(objForm.targetTranAction)) objForm.targetTranAction = {};
		objForm.targetTranAction[sSvcId] = this;

		// Create DataSet for NexacroLAPServer Service call
		var sServiceInfoDataset = this.gfnMakeBackendServiceInfoDataset(objForm, this.servicemodel);
		sInDs += ' _BackendServiceInfo=' + sServiceInfoDataset;

		if (objForm._FileMetaInfo == undefined || objForm._FileMetaInfo == null) {
			objForm._FileMetaInfo = _fileMetaInfo;
		}

		// Call Transaction
		objForm.transaction(JSON.stringify(objSvcId), sService, sInDs, sOutDs, sArgs, sCallback, bAsync);
	};

	// Transaction Callback
	_pBulkExcelImport.fnTransactionCallback = function (svcId, nErrorCd, sErrorMsg) {
		var objSvcId = JSON.parse(svcId);
		var sSvcId = objSvcId.svcId;

		var dEndDate = new Date();
		var nElapseTime = (dEndDate.getTime() - objSvcId.startTime) / 1000;

		var objTarget = this.targetTranAction[sSvcId];
		if (objTarget == undefined || objTarget == null) return;

		// Transaction Log
		objTarget.gfnLog("ElapseTime >> " + nElapseTime + ", ErrorCd >> " + nErrorCd + ", ErrorMsg >> " + sErrorMsg);

		// If ErrorCode is greater than -1, call onsuccess event
		if (nErrorCd > -1) {
			objTarget.on_fire_onsuccess(sSvcId, nErrorCd, sErrorMsg);
		}
		// If ErrorCode is less than 0, call onerror event
		else {
			objTarget.on_fire_onerror(sSvcId, nErrorCd, sErrorMsg);
		}
	};

	delete _pBulkExcelImport;
}
  