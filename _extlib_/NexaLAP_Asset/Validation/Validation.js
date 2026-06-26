//==============================================================================
//	Define the Action.
//==============================================================================
//==============================================================================		
// Object : nexacro.Validation		
// Group : Action		
//==============================================================================		
if (!nexacro.Validation)		
{		
    nexacro.Validation = function(id, parent)		
    {		
        nexacro.Action.call(this, id, parent);		
    };

    var _pValidation = nexacro._createPrototype(nexacro.Action, nexacro.Validation);
    nexacro.Validation.prototype = _pValidation;
    _pValidation._type_name = "Validation";		
	
	//===============================================================		
    // nexacro.Validation : Create & Destroy		
    //===============================================================		
    _pValidation.destroy = function()		
	{	
		nexacro.Action.prototype.destroy.call(this);
	};	
		
    //===============================================================		
    // nexacro.Validation : Method		
    //===============================================================		
    _pValidation.run = function()		
	{	
		//var sParam = JSON.stringify([{"columnId":"CODE_NM","columnNm":"코드명","essential":"1","rule":"","targetCol" : "", "targetValue":""},{"columnId":"USE_YN","columnNm":"사용유무","essential":1,"rule":""}]);
		/*=====check===== 
		 length
		 rangelength
		 maxlength
		 minlength
		 digits
		 min
		 max
		 declimit
		 date
		 dateym
		 range
		 fromto
		 isssn
		 isfrn
		 isbzid
		 isfirmid
		 iscardno
		 isemail
		*/
        //TODO
		var objDs = this._targetds;
		var sTargetRules = this.targetrules; //JSON.stringify([{"columnId":"CODE_NM","columnNm":"코드명","essential":"1","rule":"","targetCol" : "", "targetValue":""},{"columnId":"USE_YN","columnNm":"사용유무","essential":1,"rule":""}]);//this.params;
		
		var sReturn = true;
		var sRowType = "";
		var bOnFireType = true;
		//데이터가 1Row으면 조회로 판단 RowType과 상관없이 검사를 한다.
		if(objDs.getRowCount() == 1){	
			var sReturn = this._gfn_validationCheck(objDs, iRow, sTargetRules);
			if(!this._gfn_isNull(sReturn)){
				//불통
				oReturn = JSON.parse(sReturn);
				this.parent.alert(oReturn["message"]);
				bOnFireType = false;
			} else {
				bOnFireType = true;
			}
		} else if(objDs.getRowCount() > 1) {			
			for(var iRow = 0 ; iRow < objDs.getRowCount(); iRow++){
				sRowType = objDs.getRowType(iRow);
				if(sRowType > 1){
					var sReturn = this._gfn_validationCheck(objDs, iRow, sTargetRules);
					if(!this._gfn_isNull(sReturn)){
						//불통
						oReturn = JSON.parse(sReturn);
						if(objDs.getRowCount() > 1){
							//저장
							this.parent.alert(iRow + "번째 Row의 " + oReturn["message"]);
						} else {
							//조회
							this.parent.alert(oReturn["message"]);
						}
						bOnFireType = false;						
					} else {
						bOnFireType = true;
					}
					break;
				}
			}

		}
		if(bOnFireType == false){
			//불통
			this.on_fire_onerror();
		} else {
			//통과
			this.on_fire_onsuccess();
		}
	};

	_pValidation.on_fire_onsuccess = function (userdata)
	{
		var event = this.onsuccess;
		
		//이벤트가 존재하고 사용자가 정의한 이벤트 핸들러 함수가 있을 경우
		if (event && event._has_handlers)
		{
		  //ActionSuccessEventInfo 생성
		  var evt = new nexacro.ActionSuccessEventInfo(this, "onsuccess", userdata); //TODO
		  
		  //리턴값이 필요 없으므로 _fireEvent 함수 실행
		  event._fireEvent(this, evt);
		}
	};
	  
	_pValidation.on_fire_onerror = function (userdata)
	{
		var event = this.onerror;
		
		//이벤트가 존재하고 사용자가 정의한 이벤트 핸들러 함수가 있을 경우
		if (event && event._has_handlers)
		{
		  //ActionErrorEventInfo 생성
		  var evt = new nexacro.ActionErrorEventInfo(this, "onerror", userdata); //TODO
		  
		  //리턴값이 필요 없으므로 _fireEvent 함수 실행
		  event._fireEvent(this, evt);
		} 
	};
	
	_pValidation._targetds = null;
	_pValidation.targetds = "";
	_pValidation.set_targetds = function (v)
	{
		//값이 없을 경우 초기화
		  if(!v)
		  {
			this._targetds = null;
			this.targetds = "";
		  }
		  //값이 Object 형일 경우 
		  else if (typeof v != "string") {
			if (v instanceof nexacro.Dataset || (typeof v == "object" && v._type_name == "Dataset")) {
			  
			  //Object 담기
			  this._targetds = v;
			  
			  //String 담기
			  this.targetds = v.id;
			}
		  }
		  //값이 String 형일 경우
		  else if (this.targetds != v) {
			//해당 Dataset 찾기
			var objForm = this.parent;
			var _v = objForm._findDataset(v);
			
			//Object 담기
			this._targetds = _v ? _v : "";
			
			//String 담기
			this.targetds = v;
		  }
	};
	
//	_pValidation._targetrules = null;
	_pValidation.targetrules = "";
	_pValidation.set_targetrules = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toString(v);
		if (this.targetrules != v) {
			this.targetrules = v;
//			this._targetrules = JSON.parse(v);
		}
	};
	
	_pValidation._gfn_validationCheck = function(objDs, iRow, sParam){
		var oValidationList = JSON.parse(sParam);
		for(var i = 0 ; i < oValidationList.length ; i++){
			
			var oColumInfo = oValidationList[i];
			//대상 컬럼 값
			var sValue = objDs.getColumn(iRow, oColumInfo["columnId"])+"";
			if(this._gfn_isNull(sValue)){
				sValue = "";
			}
			//필수인 경우 null check를 먼저 한다.
			if(oColumInfo["essential"] =="1"){
				if(this._gfn_isNull(sValue)){
					sReturn = JSON.stringify({"message" : oColumInfo["columnNm"] +"은 필수 항목 입니다."});
					return sReturn;
				}
			}

			//rule이 null이 아니면 validation check를 한다.
			if(!this._gfn_isNull(oColumInfo["rule"])){
				var checkrule = oColumInfo["rule"].toLowerCase();
				var sTargetValue = oColumInfo["targetValue"];
				var sTargetColValue = objDs.getColumn(iRow, oColumInfo["targetCol"]);
				switch (checkrule){
					//길이 체크
					case "length":		
						if(sValue.length != parseInt(sTargetValue)){
							sReturn = JSON.stringify({"message" : oColumInfo["columnNm"] + "의 입력값은 " + sTargetValue + " 자리이어야 합니다."});
							return sReturn;
						}
					break;
					//범위 체크
					case "rangelength":	
						var aTargetValue = sTargetValue.split(",");
						if(sValue.length < parseInt(aTargetValue[0]) || sValue.length > parseInt(aTargetValue[1])){
							sReturn = JSON.stringify({"message" : oColumInfo["columnNm"] + "은(는) " + aTargetValue[0] + " 와(과) " + aTargetValue[1] + " 사이의 자리이어야 합니다."});
							return sReturn;
						}
					break;
					//max 길이 체크
					case "maxlength":
						if (sValue.length > parseInt(sTargetValue)){
							sReturn = JSON.stringify({"message" : oColumInfo["columnNm"] + "의 입력값의 길이는 " + sTargetValue + " 이하이어야 합니다."});
							return sReturn;						
						}
					break;
					//min 길이 체크
					case "minlength":
						if (sValue.length < parseInt(sTargetValue)){
							sReturn = JSON.stringify({"message" : oColumInfo["columnNm"] + "의 입력값의 길이는 " + sTargetValue + " 이상이어야 합니다."});
							return sReturn;						
						}
					break;
					//숫자 체크
					case "digits":		
					if (!this._gfn_isDigit(sValue)){
						sReturn = JSON.stringify({"message" : oColumInfo["columnNm"] + "은(는) 숫자만 입력 가능합니다."});
						return sReturn;						
					}
					break;
					// 해당 숫자 이하
					case "min":
						if (parseFloat(sValue) < parseFloat(sTargetValue)){
							sReturn = JSON.stringify({"message" : oColumInfo["columnNm"] + "은(는) " + sTargetValue + " 이상의 숫자만 입력 가능합니다."});
							return sReturn;												
						}
					break;
					// 해당 숫자 이상
					case "max":
						if (parseFloat(sValue) > parseFloat(sTargetValue)){
							sReturn = JSON.stringify({"message" : oColumInfo["columnNm"] + "은(는)" + sTargetValue + " 이하의 숫자만 입력 가능합니다."});
							return sReturn;												
						}
					break;
					// 소숫점 자리수 비교
					case "declimit":
						var isExistDot = sValue.indexOf(".");
						if (isExistDot == -1){
							sReturn = JSON.stringify({"message" : oColumInfo["columnNm"] + "은(는) 소수점 " + sTargetValue + " 자리로 구성되어야 합니다."});
							return sReturn;																		
						} else {
							var decLen = sValue.substr(isExistDot + 1, sValue.length);
							if (decLen.length != parseInt(sTargetValue)) {
								sReturn = JSON.stringify({"message" : oColumInfo["columnNm"] + "은(는) 소수점" + sTargetValue + " 자리로 구성되어야 합니다."});
								return sReturn;																		
							}
						}
					break;
					// 날짜 년월일 체크 : date
					case "date":
						if (!this._gfn_isYMD_validation(sValue)) {
							sReturn = JSON.stringify({"message" : oColumInfo["columnNm"] + "은(는) 유효하지 않은 날짜 형식입니다."});
							return sReturn;																		
						}
					break;
					// 날짜 년월 체크 : dateym
					case "dateym":
						if (!this_gfn_isYM_validation(sValue)){
							sReturn = JSON.stringify({"message" : oColumInfo["columnNm"] + "은(는) 유효하지 않은 년월 형식입니다."});
							return sReturn;																								
						}
					break;
					// 사이의 값인지 비교 - range:40:100
					case "range":
						var aTargetValue = sTargetValue.split(",");
						if (parseInt(sValue) < parseInt(aTargetValue[0]) || parseInt(sValue) > parseInt(aTargetValue[1])){
							sReturn = JSON.stringify({"message" : oColumInfo["columnNm"] + "은(는) " + aTargetValue[0] + " 와(과) " + aTargetValue[1] + " 사이의 값이어야 합니다."});
							return sReturn;																								
						}
					break;
					// 날짜 from 비교
					case "fromdate":
						if (sValue < sTargetColValue) {
							sReturn = JSON.stringify({"message" : oColumInfo["columnNm"] + "의 날짜가 " + sTargetColValue + " 의 날짜보다 작습니다."});
							return sReturn;
						}
					break;
					// 날짜 to 비교
					case "todate":
						if (sValue > sTargetColValue) {
							sReturn = JSON.stringify({"message" : oColumInfo["columnNm"] + "의 날짜가 " + sTargetColValue + " 의 날짜보다 큰니다."});
							return sReturn;
						}
					break;
					// 주민등록번호 체크 - isssn
					case "isssn":
						if (!this._gfn_isSSN(sValue)) {
							sReturn = JSON.stringify({"message" : oColumInfo["columnNm"] + "은(는) 올바른 주민번호가 아닙니다."});
							return sReturn;
						}
					break;
					// 외국인등록번호 체크 - isfrn
					case "isfrn":
						if (!this._gfn_isFrnrIdNo(sValue)) {
							sReturn = JSON.stringify({"message" : oColumInfo["columnNm"] + "은(는) 올바른 외국인등록번호가 아닙니다."});
							return sReturn;
						}
					break;
					// 사업자등록번호 체크 - isbzid
					case "isbzid":
						if (!this._gfn_isBzIdNo(sValue)) {
							sReturn = JSON.stringify({"message" : oColumInfo["columnNm"] + "은(는) 올바른 사업자등록번호가 아닙니다."});
							return sReturn;
						}
					break;
					// 법인등록번호 체크 - isfirmid
					case "isfirmid":
						if (!this._gfn_isFirmIdNo(sValue)){
							sReturn = JSON.stringify({"message" : oColumInfo["columnNm"] + "은(는) 올바른 법인등록번호가 아닙니다."});
							return sReturn;
						}
					break;
					// 신용카드번호 체크 - iscardno
					case "iscardno":
						if (!this._gfn_isCardNo(sValue)){
							sReturn = JSON.stringify({"message" : oColumInfo["columnNm"] + "은(는) 올바른 신용카드번호가 아닙니다."});
							return sReturn;
						}
					break;
					// 이메일 체크 - isemail
					case "isemail":
						if (!this._gfn_isEmail(sValue)){
							sReturn = JSON.stringify({"message" : oColumInfo["columnNm"] + "은(는) 올바른 이메일이 아닙니다."});
							return sReturn;
						}
					break;
				}
			}
		}
	}
	/************************************************************************************************
	* Validation function List
	************************************************************************************************/

	/**
	 * @class 숫자체크 <br>
	 * @param {String} sValue
	 * @return {Boolean}
	 */
	_pValidation._gfn_isDigit = function(sNum)
	{
		var c;
		var point_cnt=0;
		var ret=true;

		if ( this._gfn_isNull(sNum) )	return false;

		for (var i=0; i<sNum.length; i++){
			c = sNum.charAt(i);
			if (i == 0 && (c == "+" || c == "-")){

			} else if (c >= "0" && c <= "9") {

			} else if (c == ".") {
				point_cnt++;
				if ( point_cnt > 1 )
				{
					ret = false;
					break;
				}
			} else {
				ret = false;
				break;
			}
		}
		return ret;
	};

	/**
	 * @class 날짜 여부를 확인한다. <br>
	 * @param {String} strDate - 8자리의 숫자로 된 날짜(YYYYMMDD)
	 * @return {Boolean}
	 */
	_pValidation._gfn_isYMD_validation = function(strDate)
	{
		if(this._gfn_isNull(strDate)){
			return false;
		} 

		var retVal = this._gfn_getDigit_validation(strDate);
		
		if (retVal.length != 8) {
			return false;
		}

		var strYM = strDate.substr(0,6);	//년월
		if (!this._gfn_isYM_validation(strYM)) {
			return false;
		}
		var nDay   = Number(strDate.substr(6,2));	// 일자
		var nLastDay = Number(this._gfn_getLastDate_validation(strYM).substr(6,2));//gfnGetLastDay에서 전체 20170331값이 넘어와서 .substr(6,2)추가 20170313
		if (nDay < 1 || nDay > nLastDay) {
			return false;
		}
		return true;
	};

	/**
	 * @class 날짜 여부를 확인한다. <br>
	 * @param {String} strDate - 6자리의 숫자로 된 날짜(YYYYMM)
	 * @return {Boolean}
	 */
	_pValidation._gfn_isYM_validation = function(strDate)
	{
	var retVal = this._gfn_getDigit_validation(strDate);
		
		var retVal = this._gfn_getDigit_validation(strDate);

		if (retVal.length != 6) {
			return false;
		}

		var nYear  = Number(strDate.substr(0,4));	//년도값을 숫자로
		var nMonth = Number(strDate.substr(4,2));	//월을 숫자로

		if((nMonth < 1) || (nMonth > 12)) {
			return false;
		}

		return true;
	};

	/**
	 * @class 입력 문자열중 숫자값만 남긴다. <br>
	 * @param {String} strValue - 입력문자열
	 * @return {String} 숫자문자열
	 */
	_pValidation._gfn_getDigit_validation = function(strValue){

		var strRet = strValue.replace(regExp,"");
		var regExp = new RegExp("\\D","g");

		return strRet;
	}

	/**
	 * @class 년월을 입력받아 마지막 일를 반환한다(년월) <br>
	 * @param {String} strDate - 6 / 8 자리의 숫자로 된 날짜(YYYYMM)
	 * @return {String} 해당월의 마지막날 8자리
	 */
	_pValidation._gfn_getLastDate_validation = function(strDate)
	{
		var s = "";
		if (strDate == null) {
			var date = (new Date()).addMonth(1);
		}
		else {
			var date = new Date(parseInt(strDate.substr(0,4)),parseInt(strDate.substr(4,2)),1);
		}

		date = (new Date(date)).addDate((new Date(date)).getDate()*-1);

		s = (new Date(date)).getFullYear()
		  + (((new Date(date)).getMonth() + 1) + "").padLeft(2, '0')
		  + ((new Date(date)).getDate() + "").padLeft(2, '0');

		return (s);
	};

	/**
	 * @class 주민등록번호 여부를 확인한다. <br>
	 * @param {String} sJuminNo - 입력문자열(주민번호 13자리)
	 * @return {Boolean}
	 */
	_pValidation._gfn_isSSN = function(sJuminNo)
	{
		var birthYear = this._gfn_getBirthYear(sJuminNo);
		
		birthYear += sJuminNo.substr(0, 2);
		var birthMonth = sJuminNo.substr(2, 2)-1;
		var birthDate = sJuminNo.substr(4, 2);
		var birth = new Date(birthYear, birthMonth, birthDate);

		if ( birth.getYear() % 100 != sJuminNo.substr(0, 2) ||
			birth.getMonth() != birthMonth ||
			birth.getDate() != birthDate) 
		{
			return false;
		}

		// Check Sum 코드의 유효성 검사
		buf = new Array(13);
		for (i = 0; i < 6; i++) buf[i] = parseInt(sJuminNo.charAt(i));
		for (i = 6; i < 13; i++) buf[i] = parseInt(sJuminNo.charAt(i));
		  
		multipliers = [2,3,4,5,6,7,8,9,2,3,4,5];
		for (i = 0, sum = 0; i < 12; i++) sum += (buf[i] *= multipliers[i]);

		if ((11 - (sum % 11)) % 10 != buf[12]) {
			return false;
		}else{
			return true;
		}
	};

	/**
	 * @class 외국인 등록번호 여부를 확인한다. <br>
	 * @param {String} strNo - 입력문자열(등록번호13자리)
	 * @return {Boolean}
	 */
	_pValidation._gfn_isFrnrIdNo = function(strNo)
	{
		if (strNo.length != 13 || !isNumber(strNo)) return false;
		
		var month = Number(strNo.substr(2, 2));
		var day	  = Number(strNo.substr(4, 2));
			
		if (month < 1 || month > 12) return false;
		if (day < 1 || day > 31) return false;
		
		var sum = 0;
		var odd = 0;
		var buf = array(13);
		var multipliers = [2,3,4,5,6,7,8,9,2,3,4,5];
		
		for (var i=0; i<13; i++) {
			buf[i] = Number(strNo.charAt(i));
		}
		
		if (buf[11] < 6) return false;
		
		odd = buf[7] * 10 + buf[8];
		if((odd%2) != 0) return false;
		
		for (var i=0; i<12; i++) {
			sum += (buf[i] * multipliers[i]);
		}
		
		sum = 11 - (sum % 11);
		
		if (sum >= 10) sum -= 10;
		sum += 2;
		if (sum >= 10) sum -= 10;
		
		if (buf[12] == sum) {
			return true;
		} else {
			return false;
		}
	};

	/**
	 * @class 사업자 등록번호 여부를 확인한다.
	 * @param {String} strCustNo - 입력문자열(등록번호10자리)
	 * @return {Boolean}
	 */
	_pValidation._gfn_isBzIdNo = function(strCustNo)
	{
		if (strCustNo.length != 10) return false;
		else {
			
			var checkID = new Array(1, 3, 7, 1, 3, 7, 1, 3, 5, 1);
			var tmpcustNo, i, chkSum=0, c2, remander;

			for (i=0; i<=7; i++) chkSum += checkID[i] * strCustNo.charAt(i);

			c2 = "0" + (checkID[8] * strCustNo.charAt(8));
			c2 = c2.substring(c2.length - 2, c2.length);

			chkSum += Math.floor(c2.charAt(0)) + Math.floor(c2.charAt(1));

			remander = (10 - (chkSum % 10)) % 10 ;

			if (Math.floor(strCustNo.charAt(9)) == remander) return true; // OK!
			return false;
		}

		return true;
	};

	/**
	 * @class 법인 등록번호 여부를 확인한다. <br>
	 * @param {String} strNo - 입력문자열(법인번호13자리)
	 * @return {Boolean}
	 */
	_pValidation._gfn_isFirmIdNo = function(strNo)
	{
		if (strNo.length != 13 || !isNumber(strNo)) return false;
		
		var sum = 0;
		var buf = new Array(13);
		var multipliers = [1,2,1,2,1,2,1,2,1,2,1,2];
		
		for (var i=0; i<13; i++) {
			buf[i] = Number(strNo.charAt(i));
		}
		
		for (var i=0; i<12; i++) {
			sum += (buf[i] * multipliers[i]);
		}
		
		sum = (10 - (sum % 10)) % 10;
		
		if (buf[12] == sum) {
			return true;
		} else {
			return false;
		}
	};

	/**
	 * @class 신용카드번호 여부를 확인한다. <br>
	 * @param {String} strNo - 카드번호16자리
	 * @return {Boolean}
	 */
	_pValidation._gfn_isCardNo = function(strNo)
	{
		if (strNo.length < 13 || strNo.length > 19 || !nexacro.isNumeric(strNo)) return false;
		
		var sum = 0;
		var buf = new Array();
		
		for (var i=0; i<strNo.length; i++) {
			buf[i] = Number(strNo.charAt(i));
		}
		
		var temp;
		for (var i=buf.length-1, j=0; i>=0; i--, j++) {
			temp = buf[i] * ((j%2) + 1);
			if (temp >= 10) {
				temp = temp - 9;
			}
			sum += temp;
		}
		
		if ((sum % 10) == 0) {
			return true;
		} else {
			return false;
		}
	};

	/**
	 * @class 이메일 형식에 맞는지 Check한다.
	 * @param {String} strValue
	 * @return {Boolean}
	 */
	_pValidation._gfn_isEmail = function(strValue)
	{
		var retVal = false;
		var sTmp = "";
		var sRegExp = "[a-z0-9]+[a-z0-9.,]+@[a-z0-9]+[a-z0-9.,]+\\.[a-z0-9]+";

		var regexp = new RegExp(sRegExp,"ig");
		sTmp = regexp.exec(strValue);

		if (sTmp == null) {
			retVal = false;
		} 
		else {
			if (( sTmp.index == 0 ) && (sTmp[0].length == strValue.length )) {
				retVal = true;
			} else {
				retVal = false;
			}
		}
		return retVal;
	};
	
	/**
	 * @class 값이 존재하는지 여부 체크 <br>
	 * @param {String} sValue	
	 * @return {Boolean} true/false
	 * @example
	 * var bNull = this._gfn_isNull("aaa");	// false
	 */
	_pValidation._gfn_isNull = function(sValue)
	{
		if (new String(sValue).valueOf() == "undefined") return true;
		if (sValue == null) return true;
		
		var ChkStr = new String(sValue);

		if (ChkStr == null) return true;
		if (ChkStr.toString().length == 0 ) return true;
		return false;
	};
}