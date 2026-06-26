//==============================================================================
//	Define the Action.
//==============================================================================
//==============================================================================		
// Object : nexacro.RunScript		
// Group : Action		
//==============================================================================		
if (!nexacro.RunScript) {
	nexacro.RunScript = function (id, parent) {
		nexacro.Action.call(this, id, parent);
		this.addEvent("canrun");
	};

	var _pRunScript = nexacro._createPrototype(nexacro.Action, nexacro.RunScript);
	nexacro.RunScript.prototype = _pRunScript;
	_pRunScript._type_name = "RunScript";

	/* default properties */
	_pRunScript._p_contents = "";

	//===============================================================		
	// nexacro.RunScript : Create & Destroy		
	//===============================================================		
	_pRunScript.destroy = function () {
		this._p_contents = "";

		nexacro.Action.prototype.destroy.call(this);
	};

	//===============================================================		
	// nexacro.RunScript : Method		
	//===============================================================		
	_pRunScript.run = function () {
		var objForm = this.parent;
		if (!objForm) {
			this.on_fire_onerror("userdata");
			return;
		}

		try {
			var objFunc = new Function(this._p_contents);
			var sRet = objFunc.call(objForm);
			if (sRet == false) {
				this.on_fire_onerror("userdata");
			} else {
				this.on_fire_onsuccess("userdata");
			}
		} catch (e) {
			if (e && e.message && trace)
			{
				trace(e.message);
			}
			this.on_fire_onerror("userdata");
		}
	};

	_pRunScript.on_fire_onsuccess = function (userdata) {
		var event = this.onsuccess;
		if (this.parent) {
			this.parent.resetScroll();
		}
		
		if (event && event._has_handlers) {
			var evt = new nexacro.ActionSuccessEventInfo(this, "onsuccess", userdata);
			event._fireEvent(this, evt);
		}
	};

	_pRunScript.on_fire_onerror = function (userdata) {
		var event = this.onerror;
		if (event && event._has_handlers) {
			var evt = new nexacro.ActionErrorEventInfo(this, "onerror", userdata);
			event._fireEvent(this, evt);
		}
	};

	_pRunScript._setContents = function (contents) {
		this._p_contents = contents || "";
	};

	delete _pRunScript;
}
	