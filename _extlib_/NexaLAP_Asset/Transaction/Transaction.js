//==============================================================================
//	Define the Action.
//==============================================================================
//==============================================================================		
// Object : nexacro.Transaction
// Group : Action		
//==============================================================================		
if (!nexacro.Transaction) {
	nexacro.Transaction = function (id, parent) {
		nexacro.Action.call(this, id, parent);
	};

	var _pTransaction = nexacro._createPrototype(nexacro.Action, nexacro.Transaction);
	nexacro.Transaction.prototype = _pTransaction;
	_pTransaction._type_name = "Transaction";

	/* default properties */
	_pTransaction.servicemodel = "";
	_pTransaction.serviceurl = "";

	/* internal variable */
	_pTransaction._contents = null;

	//===============================================================		
	// nexacro.Transaction : Create & Destroy		
	//===============================================================		
	_pTransaction.destroy = function () {
		this._contents = null;

		nexacro.Action.prototype.destroy.call(this);
	};

	//===============================================================		
	// nexacro.Transaction : Method		
	//===============================================================		
	_pTransaction.run = function () {

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
		var sSvcId = this.gfnRandomID(this.id);
		var sServiceUrl = this.serviceurl;
		var sInDs = sInputDatasetStr;
		var sOutDs = sOutputDatasetStr;
		var sArgs = sArgumentsStr;
		var sCallback = this._TRAN_CALLBACK_NM;

		this.fnTransaction(sSvcId, sServiceUrl, sInDs, sOutDs, sArgs, sCallback);
	};

	_pTransaction.set_servicemodel = function (v) {
		v = nexacro._toString(v);
		if (this.servicemodel != v) {
			this.servicemodel = v;
		}
	};

	_pTransaction.set_serviceurl = function (v) {
		v = nexacro._toString(v);
		if (this.serviceurl != v) {
			this.serviceurl = v;
		}
	};

	_pTransaction.on_fire_onsuccess = function (sSvcId, nErrorCd, sErrorMsg) {
		var event = this.onsuccess;
		if (event && event._has_handlers) {
			var evt = new nexacro.TransactionSuccessEventInfo(this, "onsuccess", sSvcId, nErrorCd, sErrorMsg); //TODO
			event._fireEvent(this, evt);
		}
	};

	_pTransaction.on_fire_onerror = function (sSvcId, nErrorCd, sErrorMsg) {
		var event = this.onerror;
		if (event && event._has_handlers) {
			var evt = new nexacro.TransactionErrorEventInfo(this, "onerror", sSvcId, nErrorCd, sErrorMsg); //TODO
			event._fireEvent(this, evt);
		}
	};

	_pTransaction.fnBuildInputDatasetString = function (arrInputDatasets) {
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

	_pTransaction.fnBuildOutputDatasetString = function (arrOutputDatasets) {
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

	_pTransaction.fnBuildArgumentsString = function (arrArguments) {
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

	_pTransaction.fnTransaction = function (sSvcId, sService, sInDs, sOutDs, sArgs, sCallback, bAsync) {
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

		// Call Transaction
		objForm.transaction(JSON.stringify(objSvcId), sService, sInDs, sOutDs, sArgs, sCallback, bAsync);
	};

	// Transaction Callback
	_pTransaction.fnTransactionCallback = function (svcId, nErrorCd, sErrorMsg) {
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

	delete _pTransaction;
}
	