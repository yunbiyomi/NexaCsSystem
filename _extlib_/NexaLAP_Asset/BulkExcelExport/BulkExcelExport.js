
//==============================================================================
//	Define the Action.
//==============================================================================
//==============================================================================		
// Object : nexacro.BulkExcelExport		
// Group : Action		
//==============================================================================		
if (!nexacro.BulkExcelExport)		
{		
    nexacro.BulkExcelExport = function(id, parent)		
    {		
        nexacro.Action.call(this, id, parent);		
		this.addEvent("canrun");
    };		
    
	var _pBulkExcelExport = nexacro._createPrototype(nexacro.Action, nexacro.BulkExcelExport);		
    nexacro.BulkExcelExport.prototype = _pBulkExcelExport;
    _pBulkExcelExport._type_name = "BulkExcelExport";
	
	/* default properties */
	_pBulkExcelExport.servicemodel = "";
	_pBulkExcelExport.serviceurl = "";

	/* internal variable */
	_pBulkExcelExport._contents = null;
	
	//===============================================================		
    // nexacro.BulkExcelExport : Create & Destroy		
    //===============================================================		
    _pBulkExcelExport.destroy = function()		
	{	
		this._contents = null;
		nexacro.Action.prototype.destroy.call(this);
	};	
		
    //===============================================================		
    // nexacro.BulkExcelExport : Method		
    //===============================================================		
    _pBulkExcelExport.run = function()		
	{
		if(this.on_fire_canrun("userdata")!=false)
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
			var sSvcId 			= this.gfnRandomID(this.id);
			var sService        = this.serviceurl;
			var sInDs 			= sInputDatasetStr;
			var sOutDs 			= sOutputDatasetStr + " _FileMetaInfo=_FileMetaInfo";
			var sArgs 			= sArgumentsStr;
			var sCallback 		= this._TRAN_CALLBACK_NM;
			// var sInDs    		  = this.inputdatasets;
			// var sOutDs   		  = "_FileMetaInfo=_FileMetaInfo";
			// var sArgs    		  = this.args; 
			// var sCallBackFunction = "fnTransactionCallback";
			
			var objForm = this.gfnGetForm ? this.gfnGetForm() : this.parent;

			/*
			 * _FileMetaInfo : 파일 업 / 다운로드 시 참조 되는 메타 정보가 담기는 데이터셋 정보.
			*/

			// _FileMetaInfo 있으면 재사용 없으면 생성 ===
			var _FileMetaInfo = objForm._FileMetaInfo;
			if (!(_FileMetaInfo instanceof Dataset)) {
				// 없으면 새로 생성
				_FileMetaInfo = new Dataset("_FileMetaInfo", objForm);

				_FileMetaInfo.addColumn("filekey",     "STRING", 256);
				_FileMetaInfo.addColumn("filename",    "STRING", 256);
				_FileMetaInfo.addColumn("filesize",    "INT",    256);
				_FileMetaInfo.addColumn("fileext",     "STRING", 256);
				_FileMetaInfo.addColumn("contenttype", "STRING", 256);

				objForm.addChild(_FileMetaInfo.name, _FileMetaInfo);
			} else {
				// 있으면 데이터만 초기화
				_FileMetaInfo.clearData();
			}

			this.fnTransaction(sSvcId, sService, sInDs, sOutDs, sArgs, sCallback);
		}
	};

	_pBulkExcelExport.set_servicemodel = function (v)
	{
		v = nexacro._toString(v);
		if (this.servicemodel != v) {
			this.servicemodel = v;
		}
	};

	_pBulkExcelExport.serviceurl = "";
	_pBulkExcelExport.set_serviceurl = function (v)
	{
		v = nexacro._toString(v);
		if (this.serviceurl != v) {
			this.serviceurl = v;
		}
	};

	// _pBulkExcelExport.inputdatasets = "";
	// _pBulkExcelExport.set_inputdatasets = function (v)
	// {
	// 	// TODO : enter your code here.
	// 	v = nexacro._toString(v);
	// 	if (this.inputdatasets != v) {
	// 		this.inputdatasets = v;
	// 	}
	// };
	
	// _pBulkExcelExport.outputdatasets = "";
	// _pBulkExcelExport.set_outputdatasets = function (v)
	// {
	// 	// TODO : enter your code here.
	// 	v = nexacro._toString(v);
	// 	if (this.outputdatasets != v) {
	// 		this.outputdatasets = v;
	// 	}
	// };
	
	// _pBulkExcelExport.args = "";
	// _pBulkExcelExport.set_args = function (v)
	// {
	// 	// TODO : enter your code here.
	// 	v = nexacro._toString(v);
		
	// 	if (this.args != v) {
	// 		this.args = v;
	// 	}
	// };
	
	_pBulkExcelExport.on_fire_canrun = function (userdata)
	{
		var event = this.canrun;
		if (event && event._has_handlers)
		{
			var evt = new nexacro.ActionRunEventInfo(this, "canrun", userdata); //TODO
			return event._fireCheckEvent(this, evt);
		}
		return true;	
	};
	
	_pBulkExcelExport.on_fire_onsuccess = function (sSvcId, nErrorCd, sErrorMsg)
	{

		var event = this.onsuccess;
		if (event && event._has_handlers)
		{
			var evt = new nexacro.TranActionSuccessEventInfo(this, "onsuccess", sSvcId, nErrorCd, sErrorMsg); //TODO
			event._fireEvent(this, evt);
		}
	};
	
	_pBulkExcelExport.on_fire_onerror = function (sSvcId, nErrorCd, sErrorMsg)
	{
		var event = this.onerror;
		if (event && event._has_handlers)
		{
			var evt = new nexacro.TranActionErrorEventInfo(this, "onerror", sSvcId, nErrorCd, sErrorMsg); //TODO
			event._fireEvent(this, evt);
		}
	};

	_pBulkExcelExport.fnTransaction = function(sSvcId, sService, sInDs, sOutDs, sArgs, sCallback, bAsync)
	{	
		if (this.gfnIsNull(sSvcId)) {
			this.gfnLog("Please check the service. : fnTransaction()", "error");
			return false;
		}

		if (this.gfnIsNull(sService)) {
			this.gfnLog("Please check the service url. : fnTransaction()", "error");
			return false;
		}
		
		// callback 함수 기본값 설정
		if (this.gfnIsNull(sCallback)) {
			sCallback = this._TRAN_CALLBACK_NM;
		}
		
		// Async
		if ((bAsync != true) && (bAsync != false)) {
			bAsync = true;	
		}
	 
		// Log처리용
		var dStartDate = new Date();
		var sStartTime = dStartDate.getTime();
		
		// callback에서 처리할 서비스 정보 저장
		var objSvcId = { 
			svcId		: sSvcId
		  , svcUrl    	: sService
		  , callback	: sCallback
		  , isAsync   	: bAsync
		  , startTime	: sStartTime
		};

		var objForm = this.gfnGetForm();
		//Action Scope에 있는 CallBack 함수가 호출되도록 설정
		objForm.fnTransactionCallback = this.fnTransactionCallback;
		
		// Action정보를 폼에 설정
		if (this.gfnIsNull(objForm.targetTranAction))		objForm.targetTranAction = {};
		objForm.targetTranAction[sSvcId] = this;
	     
		// NexacroLAPServer Service 호출을 위한 DataSet 생성
		var sServiceInfoDataset = this.gfnMakeBackendServiceInfoDataset(objForm, this.servicemodel);
		sInDs += ' _BackendServiceInfo=' + sServiceInfoDataset;
 
		//Transaction 호출
		objForm.transaction(JSON.stringify(objSvcId), sService, sInDs, sOutDs, sArgs, sCallback, bAsync);
	};
	
	// Transaction Callback
	_pBulkExcelExport.fnTransactionCallback = function(svcId, nErrorCd, sErrorMsg)
	{
		var objSvcId = JSON.parse(svcId);
		var sSvcId = objSvcId.svcId;
		
		var dEndDate = new Date();
		var nElapseTime = (dEndDate.getTime() - objSvcId.startTime) / 1000;
		
		var objTarget = this.targetTranAction[sSvcId];
		if (objTarget == undefined || objTarget == null)		return;
		
		// Transaction Log
		objTarget.gfnLog("ElapseTime >> " + nElapseTime + ", ErrorCd >> " + nErrorCd + ", ErrorMsg >> " + sErrorMsg);
		
		//ErrorCode가 -1보다 클 경우 onsuccess 이벤트 호출
		var objForm = objTarget.gfnGetForm();
		if(nErrorCd>-1)
		{
			objTarget.fnFileDownload(objForm._FileMetaInfo);
			//objTarget.on_fire_onsuccess(sSvcId, nErrorCd, sErrorMsg);
		}
		//ErrorCode가 0보다 작을 경우 onerror 이벤트 호출
		else
		{
			objTarget.on_fire_onerror(sSvcId, nErrorCd, sErrorMsg);
		}
	};
	
	// file download
	_pBulkExcelExport.fnFileDownload = function(_FileMetaInfo)
	{
	    if (this.gfnIsNull(_FileMetaInfo) || _FileMetaInfo.rowcount < 1) {
	        this.gfnLog("다운로드 대상 파일이 존재하지 않습니다.", "error");
	        return false;
	    }
	    
	    var fileKey  = _FileMetaInfo.getColumn(0, "filekey");
	    var fileName = _FileMetaInfo.getColumn(0, "filename");
	    
	    if (this.gfnIsNull(fileKey)) {
	        this.gfnLog("파일 정보가 올바르지 않습니다.", "error");
	        return false;
	    } 
	    var objForm = this.gfnGetForm();
	     
	    var objFileDown = new nexacro.FileDownTransfer("fileDown", objForm);
	    
	    // 현재 Action 객체를 FileDownTransfer에 저장 (이벤트 핸들러에서 사용)
	    objFileDown._action = this;
	    objFileDown._fileName = fileName;
	    
	    //NexaLAP Server 파일다운로드 엔드포인트
	    var sDownloadUrl = "NexaLAPServer::/file/download";
	   
	    //NexaLAP Server 파일다운로드 엔드포인트가 필요로 하는 정보
	    objFileDown.setPostData("filekey", fileKey);
	    objFileDown.setPostData("filename", fileName);
	    
	 
	    objFileDown.set_url(sDownloadUrl);
	    
	    if (!this.gfnIsNull(fileName)) {
	        objFileDown.set_downloadfilename(fileName);
	    }
	    
	    trace("=== 다운로드 요청 ===");
	    trace("URL: " + sDownloadUrl);
	    trace("filekey: " + fileKey);
	    trace("filename: " + fileName);
	    
	    objFileDown.download();
	
	    return true;
	};

	/**
	 * 파일 다운로드 성공
	 */
	_pBulkExcelExport.fileDown_onsuccess = function(obj, e)
	{
	    trace("=== 파일 다운로드 성공 ===");
	    trace("url: " + e.url);
	};

	/**
	 * 파일 다운로드 실패
	 */
	_pBulkExcelExport.fileDown_onerror = function(obj, e)
	{
	    trace("=== 파일 다운로드 실패 ===");
	    trace("errorcode: " + e.errorcode);
	    trace("errormsg: " + e.errormsg);
	    this.gfnLog("파일 다운로드에 실패했습니다. : " + e.errormsg ,"error");
	    return;
	};

	delete _pBulkExcelExport;
}
  