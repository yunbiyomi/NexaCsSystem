//==============================================================================
//
//  Copyright 2021 TOBESOFT Co., Ltd.
//  All Rights Reserved.
//
//  NOTICE: TOBESOFT permits you to use, modify, and distribute this file 
//          in accordance with the terms of the license agreement accompanying it.
//
//  Readme URL: http://www.nexacro.com/legal/license/tobesoft/ko/NexacroN-public-license-readme-1.1.html
//
//==============================================================================

if (nexacro.Div) {
	var _pDiv = nexacro.Div.prototype;
	_pDiv.createCssDesignContents = function () {
		this.set_text("Div");
	};
	_pDiv.resetScroll = function () {
		var form = this._p_form;
		if (form) {
			form.resetScroll();
		}
	};
	_pDiv.set_url = function (v) {
		var init = nexacro.Component.prototype.set_initvalueid;
		nexacro.Component.prototype.set_initvalueid = function (initvalueid) {
			if (!this._is_created) {
				this._p_initvalueid = initvalueid;
				var fn = this._type_name + initvalueid;
				if (nexacro_init[fn]) {
					nexacro_init[fn].call(this, this);
				}
			}
		};
		if (this._p_url != v) {
			this._p_url = v;
			this.on_apply_url();
		}
		nexacro.Component.prototype.set_initvalueid = init;
	};
	_pDiv.design_set_fittocontents = function (v) {
		var fittocontents_enum = ["none", "width", "height", "both"];
		if (fittocontents_enum.indexOf(v) == -1) {
			return;
		}
		if (this._design_fittocontents != v) {
			this._design_fittocontents = v;
		}
	};
	_pDiv.design_get_fittocontents = function () {
		return this._design_fittocontents;
	};
	_pDiv._on_getFluidHorizontalContainerSize = function () {
		var c_w = this._adjust_width;
		var c_h = this._adjust_height;
		var minwidth = this._minwidth;
		var maxwidth = this._maxwidth;
		var minheight = this._minheight;
		var maxheight = this._maxheight;
		if (minwidth != null && (c_w < minwidth)) {
			c_w = (minwidth < 0) ? 0 : minwidth;
		}
		else if (maxwidth != null && (c_w > maxwidth)) {
			c_w = (maxwidth < 0) ? 0 : maxwidth;
		}
		if (minheight != null && (c_h < minheight)) {
			c_h = (minheight < 0) ? 0 : minheight;
		}
		else if (maxheight != null && (c_h > maxheight)) {
			c_h = (maxheight < 0) ? 0 : maxheight;
		}
		return [c_w, c_h];
	};
	_pDiv.on_apply_text = function (text) {
		var form = this._p_form;
		if (form && ((form._child_list && form._child_list.length > 0) || this._p_url) || !this._is_alive) {
			return;
		}
		var control_elem = form.getElement();
		if (control_elem) {
			if (!text) {
				text = this._displaytext;
			}
			var cell_elem = this._cell_elem;
			if (!cell_elem && text) {
				var win = this._getWindow();
				cell_elem = this._cell_elem = new nexacro.TextBoxElement(control_elem);
				cell_elem.create(win);
			}
			if (cell_elem) {
				cell_elem.setElementSize(this._getClientWidth(), this._getClientHeight());
				cell_elem.setElementVerticalAlign(this._p_verticalAlign);
				cell_elem.setElementTextAlign(this._p_textAlign);
				cell_elem.setElementText(text);
			}
		}
	};
	_pDiv._on_getFluidVerticalContainerSize = _pDiv._on_getFluidHorizontalContainerSize;
	_pDiv._on_getFluidTableContainerSize = _pDiv._on_getFluidHorizontalContainerSize;
	delete _pDiv;
}
if (nexacro._InnerForm) {
	var _pInnerForm = nexacro._InnerForm.prototype;
	_pInnerForm.loadForm = nexacro.FormBase.prototype.loadForm;
	delete _pInnerForm;
}
