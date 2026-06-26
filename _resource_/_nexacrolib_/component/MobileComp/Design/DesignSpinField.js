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

if (nexacro.SpinField) {
	var _pSpinField = nexacro.SpinField.prototype;
	_pSpinField.createCssDesignContents = function () {
	};
	_pSpinField._on_apply_expr = nexacro._emptyFn;
	delete _pSpinField;
}
