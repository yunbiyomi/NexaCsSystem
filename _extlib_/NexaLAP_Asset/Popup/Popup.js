//==============================================================================
//	Define the Action.
//==============================================================================
//==============================================================================
// Object : nexacro.Popup
// Group : Action
//==============================================================================
if (!nexacro.Popup)
{
	nexacro.Popup = function(id, parent)
	{
		nexacro.Action.call(this, id, parent);
		this.addEvent("canrun");
	};
	
	nexacro.Popup.prototype = nexacro._createPrototype(nexacro.Action, nexacro.Popup);
	nexacro.Popup.prototype._type_name = "Popup";
	
	//===============================================================
	// nexacro.Popup : Create & Destroy
	//===============================================================
	nexacro.Popup.prototype.destroy = function()
	{
		nexacro.Action.prototype.destroy.call(this);
	};
	
	//===============================================================
	// nexacro.Popup : Method
	//===============================================================
	nexacro.Popup.prototype.run = function()
	{
		//canrun 이벤트의 리턴값이 false가 아닐경우
		if(this.on_fire_canrun("userdata")!=false)
		{
			//TargetView로 설정된 오브젝트 가져오기
			var objView = this.getTargetView();
			
			//팝업 호출시 사용할 Param정보 가져오기
			// sPopupId random값으로 자동발급
			var sPopupId = this.gfnRandomID(this.id);
			var sFormUrl = this.formurl;
			var sTitle = this.title;
			var sPopupStyle = this.popupstyle;
		
			if (this.gfnIsNull(sPopupId))
			{
				this.gfnLog("A popupid is required.","error");
				this.on_fire_onerror("error");
				return;
			}
			if (this.gfnIsNull(sFormUrl))
			{
				this.gfnLog("Select the form you want to pop up.","error");
				this.on_fire_onerror("error");
				return;
			}
			
			var objForm = this.gfnGetForm();

			//Action Scope에 있는 CallBack 함수가 호출되도록 설정
			objForm.fnPopupCallback = this.fnPopupCallback;

			// Action정보를 폼에 설정
			if (this.gfnIsNull(objForm.targetPopup))		objForm.targetPopup = {};
			objForm.targetPopup[sPopupId] = this;

			// 팝업 호출
			this.fnOpenPopup(sPopupStyle, sPopupId, sTitle, sFormUrl, "", objForm, this._POPUP_CALLBACK);
		}
	};
	
	nexacro.Popup.prototype.formurl = "";
	nexacro.Popup.prototype.set_formurl = function (v)
	{
		v = nexacro._toString(v);
		if (this.formurl != v) {
			this.formurl = v;
		}
	};
		
	nexacro.Popup.prototype.title = "";
	nexacro.Popup.prototype.set_title = function (v)
	{
		v = nexacro._toString(v);
		if (this.title != v) {
			this.title = v;
		}
	};
	
	nexacro.Popup.prototype.popupstyle = "";
	nexacro.Popup.prototype.set_popupstyle = function (v)
	{
		v = nexacro._toString(v);
		if (this.popupstyle != v) {
			this.popupstyle = v;
		}
	};
	
	//===============================================================		
    // nexacro.Popup : Event		
    //===============================================================
	nexacro.Popup.prototype.on_fire_canrun = function (userdata)
	{
		if (this.canrun && this.canrun._has_handlers)
		{
			var evt = new nexacro.ActionRunEventInfo(this, "canrun", userdata); //TODO
			return this.canrun._fireCheckEvent(this, evt);
		}
		return true;
		
	};
	
	nexacro.Popup.prototype.on_fire_onsuccess = function (userdata)
	{
		var event = this.onsuccess;
		if (event && event._has_handlers)
		{
			var evt = new nexacro.ActionSuccessEventInfo(this, "onsuccess", userdata); //TODO
			event._fireEvent(this, evt);
		}
	};
	
	nexacro.Popup.prototype.on_fire_onerror = function (userdata)
	{
		var event = this.onerror;
		if (event && event._has_handlers)
		{
			var evt = new nexacro.ActionErrorEventInfo(this, "onerror", userdata); //TODO
			event._fireEvent(this, evt);
		}
	};
	
	//===============================================================		
    // nexacro.Popup : 공통함수 전환부분
    //===============================================================
	nexacro.Popup.prototype.fnOpenPopup = function (sPopupStyle, sPopupId, sTitle, sFormUrl, objArgs, objForm, sCallback)
	{
		var objApp = nexacro.getApplication();
		
		//부모 Frame 정보 가져오기
		var objOwnerFrame = objForm.getOwnerFrame();
		var sOpenAlignType = "";
		var bAutoSize = false;
		var bTitle = true;
		
		var nLeft = -1;
		var nTop = -1;
		var nWidth = -1;
		var nHeight = -1;
		
		// 중복팝업 체크
		var arrPopFrame = nexacro.getPopupFrames();
		if (arrPopFrame[sPopupId]) {	
			if (system.navigatorname == "nexacro") {
				arrPopFrame[sPopupId].setFocus();
			} else {	
				arrPopFrame[sPopupId]._getWindowHandle().focus();
			}
			return;
		}
	
		// 모바일인 경우 팝업사이즈 모두 입력하지 않았을때 full사이즈로 호출되도록 처리
		if (nexacro._getCurrentScreenType() != "desktop")
		{
			//l,t,w,h 모두 기입하지 않으면 full
			if (nLeft == -1 && nTop == -1 && nWidth == -1 && nHeight == -1)
			{
				bAutoSize = false;
				bTitle = false;
				
				if (nWidth == -1 || nWidth > objApp.mainframe.width)
				{	
					nWidth = objApp.mainframe.width;
				}
				
				if (nHeight == -1 || nHeight > nexacro.getApplication().mainframe.height)
				{
					nHeight = objApp.mainframe.height;
				}            
			}
			
			// 런타임 접속시 modal로만 동작되도록 수정(모바일 NRE에서는 open미지원)
			if (system.navigatorname == "nexacro") 
			{
				sPopupStyle = "modal";
			}
		}
		
		if(nLeft == -1 && nTop == -1) 
		{		
			sOpenAlignType = "center middle";
			
			if (system.navigatorname == "nexacro") {
// 				var curX = objApp.mainframe.left;
// 				var curY = objApp.mainframe.top;
				var curX = system.clientToScreenX(objApp.mainframe, 0);
				var curY = system.clientToScreenY(objApp.mainframe, 0);
			}else{
				var curX = window.screenLeft;
				var curY = window.screenTop;
			}
			
			nLeft	= curX + (objApp.mainframe.width / 2) - Math.round(nWidth / 2);
			nTop	= curY + (objApp.mainframe.height / 2) - Math.round(nHeight / 2) ;		
		}else{
			nLeft	=  this.parent.getOffsetLeft() + nLeft;
			nTop	=  this.parent.getOffsetTop() + nTop;
		}
		
		if (nWidth == -1 || nHeight == -1) {
			bAutoSize = true;
		}
			
		//this.gfnLog("nLeft : " + nLeft + " nTop : " + nTop + " nWidth : " + nWidth + " nHeight : " + nHeight);
		
		if(sPopupStyle == "modeless")
		{
			var sOpenStyle= "showtitlebar=true showstatusbar=false showontaskbar=true showcascadetitletext=false resizable=true autosize=" + bAutoSize +" titletext="+sTitle;
			
			nexacro.open(sPopupId, sFormUrl, objOwnerFrame, objArgs, sOpenStyle, nLeft, nTop, nWidth, nHeight, objForm);
		}
		else
		{
			var newChild = new nexacro.ChildFrame;		
			newChild.init(sPopupId, nLeft, nTop, nWidth, nHeight, null, null, sFormUrl);
			
			//newChild.set_dragmovetype("none");
			newChild.set_showtitlebar(bTitle);
			newChild.set_autosize(bAutoSize);	
			newChild.set_resizable(false);			//resizable 안됨
			if(!this.gfnIsNull(sTitle)) newChild.set_titletext(sTitle);
			newChild.set_showstatusbar(false);		//statusbar는 안보임
			newChild.set_openalign(sOpenAlignType);
			newChild.showModal(objOwnerFrame, objArgs, objForm, sCallback, true);
		}
	};
	// PopupCallback 함수
	nexacro.Popup.prototype.fnPopupCallback = function (sId, sParam) {
		var objTarget = this.targetPopup[sId];
		if (objTarget == undefined || objTarget == null) return;

		objTarget.gfnSetPopupReturn(sParam);
	};

	// 리턴값 설정
	nexacro.Popup.prototype.gfnSetPopupReturn = function (sParam) {
		this.on_fire_onsuccess(sParam);
	}
}
	