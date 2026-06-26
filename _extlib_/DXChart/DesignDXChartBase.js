//==============================================================================
//	Define the code to be applied in the Form Design of nexacrostudio.
//==============================================================================
//==============================================================================
// Object : nexacro.DXChart
// Group : Component
//==============================================================================
if (nexacro.DXChart)
{
	//==============================================================================
	// nexacro.DXChart
	//==============================================================================
	var _pDXChart = nexacro.DXChart.prototype;

	nexacro.isNexaLapStudio = true; // nexalapstudio 환경 플레그
	
	//__setCanvasElementHandleGlobalAlpha override
	nexacro.__setCanvasElementHandleGlobalAlpha = function (handle, alpha) {

		if (!handle) return;

		var a = Number(alpha);
		if (!isFinite(a)) a = 1;
		if (a < 0) a = 0;
		if (a > 1) a = 1;
		
		//alpha 값 저장
		handle._applyGlobalAlpha = a;
	};
	
	//__plotCanvasElementHandleArcPath override
	nexacro.__plotCanvasElementHandleArcPath = function(handle, x, y, radius, startAngle, endAngle, counterclockwise) {
		if (handle && handle._draw_ctx) {
			var ctx = handle._draw_ctx;

			var sa = +startAngle;
			var ea = +endAngle;
			if (sa !== sa || ea !== ea) return;

			// -PI/2 만큼 회전
			var OFFSET = Math.PI / 2;
			sa += OFFSET;
			ea += OFFSET;

			ctx.arc(x, y, radius, sa, ea, !!counterclockwise);
		}
	};

	_pDXChart._setContents = function (v, b) {
		var targetFormObject = this.parent;
		
		var oContents = v;
		if (oContents) {
		
			// {{ 샘플 데이터셋 생성
			var dsSample = new Dataset();
			var dsSampleId = "_dsSample_" + this.parent.parent.id;
			dsSample.set_name(dsSampleId);

			if (targetFormObject[dsSampleId]) {
				return;
			}

			targetFormObject.addChild(dsSampleId, dsSample);

			var createdColumnMap = {};
			var createdColumnTypeMap = {};
			if (oContents && oContents.templateList && oContents.templateList.length) {
		
				for (var tplIndex = 0; tplIndex < oContents.templateList.length; tplIndex++) {
					var templateDef = oContents.templateList[tplIndex];
					if (!templateDef || !templateDef.data || !templateDef.data.bindInfo) 
						continue;
					
					var bindInfoList = templateDef.data.bindInfo;
					for (var bindIndex = 0; bindIndex < bindInfoList.length; bindIndex++) {
						var bindInfoItem = bindInfoList[bindIndex];

						var colId = bindInfoItem.colid;
						if (!colId) 
							continue;

						// bindInfoItem.id가 'data'이면 Int 타입, 아니면 String 타입으로 생성
						var columnType = (bindInfoItem.id === "data") ? "Int" : "String";

						if (Array.isArray(colId)) {
							for (var colIndex = 0; colIndex < colId.length; colIndex++) {
								var colName = colId[colIndex];
								if (!colName || createdColumnMap[colName]) 
									continue;

								dsSample.addColumn(colName, columnType);
								createdColumnMap[colName] = true;
								createdColumnTypeMap[colName] = columnType;
							}
						} else {
							var colName = colId;
							if (!colName || createdColumnMap[colName]) 
								continue;

							dsSample.addColumn(colName, columnType);
							createdColumnMap[colName] = true;
							createdColumnTypeMap[colName] = columnType;
						}
					}
				}
			}

			// 기본 빈 행 3개 추가 및 생성된 컬럼에 랜덤값 채우기
			for (var rowIndex = 0; rowIndex < 3; rowIndex++) {
				var nRow = dsSample.addRow();
				
				for (var colName in createdColumnTypeMap) {
					if (!createdColumnTypeMap.hasOwnProperty(colName)) 
						continue;
					
					var colType = createdColumnTypeMap[colName];
					if (colType === "Int" || colType === "int") {
						var rnd = Math.floor(Math.random() * 1000);
						dsSample.setColumn(nRow, colName, rnd);
					} else {
						var rndStr = "Data_" + (rowIndex + 1);
						dsSample.setColumn(nRow, colName, rndStr);
					}
				}
			}
			// }}

			// design time에서 oContents 원본을 변경하지 않고 binddataset을 덮어씌움
			if (oContents && oContents.templateList && oContents.templateList.length) {

				for (var tplSetIndex = 0; tplSetIndex < oContents.templateList.length; tplSetIndex++) {
					var templateDef2 = oContents.templateList[tplSetIndex];
						templateDef2.binddataset = dsSampleId; // sample dataset 적용
				}
			}

			v = oContents;
		}

		// 기존코드
		if (v) this.contents = v;

		if (this._control_element) {
			this.on_apply_contents();
		}
	};
	
	delete _pDXChart;
}
