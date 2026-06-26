/**
*  @FileName 	Comp.js 
*  @Creator 	TOBESOFT
*  @CreateDate 	2024/08/01
*  @Desction   
************** 소스 수정 이력 ***********************************************
*  date          		Modifier                Description
*******************************************************************************
* 2023/10/30			TOBESOFT				Component Library
*******************************************************************************
*/

var pForm = nexacro.Form.prototype;
/**
* @class dataSet object에서 키에 해당되는 Row를 찾아서 rowpostion 전달
* @param {Object} objDs - 대상 dataset
* @param {String} sIdCol - 키칼럼
* @param {String} sId - 키값
* @param {String} sSubCol - 서브키칼럼
* @param {String} sSubId - 서브 키값
* @return {Number} rowpostion
* @example this.gfnFindData(this.dsMenu, "MENUID", "1000");
*/ 
pForm.gfnFindData = function (objDs, sIdCol, sId, sSubCol, sSubId)
{
	var arrArgument = this.gfnFindData.arguments;
	
	if (this.gfnIsNull(sSubCol)) 
	{
		return objDs.findRow(sIdCol, sId);
	}
	
	return objDs.findRowExpr(sIdCol + " == '" + sId + "' && " + sSubCol + " == '" + sSubId + "'");	
};

/**
* @class dataSet object에서 키에 해당되는 Row를 찾아서 칼럼값을 전달
* @param {Object} objDs - 대상 dataset
* @param {String} sIdCol - 키칼럼
* @param {String} strId - 키값
* @param {String} sInfo - dataSet 칼럼
* @param {String} sSubCol - 서브키칼럼
* @param {String} sSubId - 서브 키값
* @return {Object} 칼럼값
* @example this.gfnGetLookupData(this.dsMenu, "MENUID", "1000", "WINID");
*/ 
pForm.gfnGetLookupData = function (objDs, sIdCol, strId, sInfo, sSubCol, sSubId)
{
	var sVal;
	var nCurRow = this.gfnFindData(objDs, sIdCol, strId, sSubCol, sSubId);
	if (nCurRow < 0) 
	{
		return "";
	}
	
	sVal = objDs.getColumn(nCurRow, sInfo);
	if (this.gfnIsNull(sVal)) 
	{
		return "";
	}



	return sVal;
};

/**
* @class text 넓이 및 높이를 구하는 함수
* @param {String} sText - text
* @return {Array} text 넓이 및 높이 배열
* @example this.gfnGetTextSize("타이틀1");
*/ 
pForm.gfnGetTextSize = function(sText) 
{
	var objStatic  = new nexacro.Static();
	objStatic.init("objStatic", 0, 0, 0, 0);
	this.addChild("objStatic", objStatic); 
	objStatic.set_text(sText);
	objStatic.set_fittocontents("both");
	objStatic.set_visible(false);
	objStatic.show(); 
	
	var width = 0, height = 0;
	
	width  = objStatic.getOffsetWidth();
	height = objStatic.getPixelHeight();
	
	this.removeChild("objStatic"); 
	objStatic.destroy();
	objStatic = null;
	
	return [width, height];
};

pForm = null;