//==============================================================================
//	Define the Action.
//==============================================================================
//==============================================================================		
// Object : nexacro.OpenBrowser		
// Group : Action		
//==============================================================================		
if (!nexacro.OpenBrowser)		
{		
    nexacro.OpenBrowser = function(id, parent)		
    {		
        nexacro.Action.call(this, id, parent);
		this.addEvent("canrun");
    };		
        		
    nexacro.OpenBrowser.prototype = nexacro._createPrototype(nexacro.Action, nexacro.OpenBrowser);		
    nexacro.OpenBrowser.prototype._type_name = "OpenBrowser";		
	
	//===============================================================		
    // nexacro.OpenBrowser : Create & Destroy		
    //===============================================================		
    nexacro.OpenBrowser.prototype.destroy = function()		
	{	
		nexacro.Action.prototype.destroy.call(this);
	};	
		
    //===============================================================		
    // nexacro.OpenBrowser : Method		
    //===============================================================		
    nexacro.OpenBrowser.prototype.run = function()		
	{
        //canrun 이벤트의 리턴값이 false가 아닐경우
		if(this.on_fire_canrun()!=false)
		{
			var sUrl = this.url;
			var bNewWindow = this.newwindow;
		
			if (this.gfnIsNull(sUrl))
			{
				this.gfnLog("Enter a 'url'.","info");
				this.on_fire_onerror("error");
				return;
			}
			
			// expr 처리
			var sExprText = this.gfnGetFieldValue(sUrl);
			
			//this.gfnLog(this.gfnCheckUrl(sExprText));
			
			// url 형태를 체크
			if (!this.gfnCheckUrl(sExprText))
			{
				this.gfnLog("Please check the 'url'.","info");
				this.on_fire_onerror("error");
				return;
			}
			
			// 전달된 URL을 기본앱으로 지정한 웹브라우저에서 실행
			system.execDefaultBrowser(sExprText, bNewWindow);
			
			this.on_fire_onsuccess("");
		}
	};	
	
	nexacro.OpenBrowser.prototype.set_url = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toString(v);
		if (this.url != v) {
			this.url = v;
		}
	};
	
	nexacro.OpenBrowser.prototype.set_newwindow = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toBoolean(v);
		
		if(this.newwindow != v)
		{
			this.newwindow = v;
		}
	};
	
	//===============================================================		
    // nexacro.OpenBrowser : Event		
    //===============================================================
	nexacro.OpenBrowser.prototype.on_fire_canrun = function (userdata)
	{
		if (this.canrun && this.canrun._has_handlers)
		{
			var evt = new nexacro.ActionRunEventInfo(this, "canrun", userdata); //TODO
			return this.canrun._fireCheckEvent(this, evt);
		}
		return true;
	};
	
	nexacro.OpenBrowser.prototype.on_fire_onsuccess = function (userdata)
	{
		var event = this.onsuccess;
		if (event && event._has_handlers)
		{
			var evt = new nexacro.ActionSuccessEventInfo(this, "onsuccess", userdata); //TODO
			event._fireEvent(this, evt);
		}
	};
	
	nexacro.OpenBrowser.prototype.on_fire_onerror = function (userdata)
	{
		var event = this.onerror;
		if (event && event._has_handlers)
		{
			var evt = new nexacro.ActionErrorEventInfo(this, "onerror", userdata); //TODO
			event._fireEvent(this, evt);
		}
	};
	
	//===============================================================		
    // nexacro.OpenBrowser : 공통함수 전환부분
    //===============================================================
	// 도메인 url 형태를 체크하는 함수(도메인 형태, http:// https:// 포함)
	nexacro.OpenBrowser.prototype.gfnCheckUrl = function(sUrl)
	{
		var regEx = /^((http(s?))\:\/\/)([0-9a-zA-Z\-]+\.)+[a-zA-Z]{2,6}(\:[0-9]+)?(\/\S*)?$/g;
		
		return regEx.test(sUrl);
	}
}
	