//==============================================================================			
//	Define the Component.
//==============================================================================			
//==============================================================================			
// Object : nexacro.DXChart			
// Group : Component			
//==============================================================================			
if (!nexacro.DXChart) {
	//==============================================================================
	//
	//  TOBESOFT Co., Ltd.	
	//  Copyright 2017 TOBESOFT Co., Ltd.
	//  All Rights Reserved.
	//
	//  NOTICE: TOBESOFT permits you to use, modify, and distribute this file 
	//          in accordance with the terms of the license agreement accompanying it.
	//
	//  Readme URL: http://www.nexacro.co.kr/legal/nexacro17-public-license-readme-1.1.html
	//
	//==============================================================================


	//2024-02-01 Jkkim
	String.prototype.format = function () {
		if (0 === arguments.length) {
			if ((t = this).match(/{[a-z0-9]+?}/i))
				var t = this.replace(/{[a-z0-9]+?}/gi, function (t, e) {
					return t = (t = t.substr(1)).substr(0, t.length - 1),
						window[t]
				});
			return t
		}

		if (1 === arguments.length && DxChart.isArray(arguments[0]))
			return this.format.apply(this, arguments[0]);
		var e = arguments;
		for (var i in e)
			DxChart.isNull(e[i]) && (e[i] = "null");
		return (t = (t = (t = this.replace(/{(\d+)}/g, function (t, i) {
			return void 0 !== e[i - 1] ? e[i - 1] : t
		})).replace(/(?:%|\\)%(\d)/g, "__PPEERRCCEENNTT__$1")).replace(/%(\d+)/g, function (t, i) {
			return void 0 !== e[i - 1] ? e[i - 1] : t
		})).replace("__PPEERRCCEENNTT__", "%")
	}

	String.prototype.padLeft = function (_a, _b) {
		var _c = [];
		if (_a > this.length) {
			for (var _d = 0, _e = _a - this.length; _d < _e; _d++) {
				_c.push(_b);
			}
		}
		_c.push(this);
		return _c.join('');
	}
	//nexacro 전용
	//nexaLapStudio check
	var isNexacroRuntime = nexacro && nexacro.isNexaLapStudio ? true : false;
	var isNexacroFramework = (isNexacroRuntime == false && nexacro) ? true : false;
	var initCanvasFlag = false;
	
	nexacro.initCanvas = function () {

		//nexaLapStudio check
		isNexacroRuntime = nexacro && nexacro.isNexaLapStudio ? true : false;

		// nexacro mobile이 webview로 변경된 것 대응
		if (isNexacroRuntime && nexacro._isMobile) {
			if (nexacro._isMobile() || system.navigatorversion == "24") {
				isNexacroRuntime = false;
			}
		}

		if (isNexacroRuntime) {

			var __pCanvasGradient = nexacro._CanvasGradient.prototype;
			__pCanvasGradient.addColorStop = function (_a, _b) {
				var bb = _b;
				_b = DxChart._rgba2hex(_b)[0];
				var _c = nexacro._getWebColorFromXreColor(_b);
				var _d = nexacro._getXreColorAlpha(bb) / 255;
				this.colors.push({
					offset: _a * 100.0,
					color: _c,
					orgcolor: _b,
					alpha: _d
				});
			};

			var _pCanvasComponent = nexacro.CanvasComponent.prototype;
			_pCanvasComponent.getContext = function (v) {
				return this._canvas;
			};

			var _pCanvasElement = nexacro.CanvasElement.prototype;
			_pCanvasElement._globalAlphaColor = 1;
			_pCanvasElement._globalAlphaStroke = 1;
			_pCanvasElement._globalAlphaFill = 1;
			_pCanvasElement._globalAlphaLast = 1;
			_pCanvasElement._hexstr = function (number) {
				number = (typeof nexacro == "undefined") ? Number(number) : nexacro.toNumber(number);
				var chars = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f");
				var low = number & 0xf;
				var high = (number >> 4) & 0xf;
				return "" + chars[high] + chars[low];
			};
			_pCanvasElement._hex2rgb = function (hex) {
				if (!hex || hex.length == 0) return;
				if ((typeof hex) == "object") {
					r = hex[0];
					g = hex[1];
					b = hex[2];
					if (hex[3]) return "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
					else return "rgb(" + r + ", " + g + ", " + b + ")";
				} else {
					if (hex.indexOf("rgb") >= 0) return hex;
					var r, g, b, a;
					if (hex.substr(0, 1) == "#") {
						r = parseInt(hex.slice(1, 3), 16),
							g = parseInt(hex.slice(3, 5), 16),
							b = parseInt(hex.slice(5, 7), 16);

						if (String(hex).length > 7) {
							a = (parseInt(hex.slice(7, 9), 16) / 255).toString();
							return "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
						} else {
							return "rgb(" + r + ", " + g + ", " + b + ")";
						}
					} else {
						return hex;
					}
				}
			};
			_pCanvasElement._rgba2hex = function (acolor) {
				var arr1 = acolor.split("(");
				var arr2 = arr1[1].split(")");
				var arr3 = arr2[0].split(",");
				var str = this._hexstr(arr3[0]);
				str += this._hexstr(arr3[1]);
				str += this._hexstr(arr3[2]);
				//if(arr3[3]) str += this._hexstr(acolor[3]*255.0);
				return ["#" + str, arr3[3]];
			};
			
			//25.12.16 jo nexaLab override
			_pCanvasElement.arc = function (_a, _b, _c, _d, _e, _f) {
				var _g = this.handle;
				if (_g) {
					 nexacro.__plotCanvasElementHandleArcPath(_g, _a, _b, _c, _d, _e, _f);
				}
			};
			
			_pCanvasElement._convertStyle = function (acolor) {
				if (acolor === "" || acolor === true) acolor = "#ffffff";
				
				//25.12.23 sj.jo nexa Lab nexacro._CanvasGradient 아닌 웹 gradient 객체로 넘어옴 예외처리
				if (Object.prototype.toString.call(acolor) === "[object CanvasGradient]") {
					return [acolor, 1];
				}
				
				if (acolor instanceof nexacro._CanvasGradient) {
					return [acolor, 1];
				}
				if (acolor instanceof nexacro._ColorObject) {
					return [acolor, this._globalAlphaColor];
				}
				// 			if(acolor && acolor.value && acolor._sysvalue) {
				// 				return [acolor, this._globalAlphaColor];
				// 			}
				var str = "";
				var c = acolor;
				var a = "";
				if ((typeof acolor) == "string") {
					if (acolor.substring(0, 1) == '#') {
						if (acolor.length > 7) {
							c = new nexacro.ColorObject(acolor.substr(0, 7));
						} else if (acolor.length == 4) {
							c = new nexacro.ColorObject("#" + acolor.substr(1, 1) + acolor.substr(1, 1) + acolor.substr(2, 1) + acolor.substr(2, 1) + acolor.substr(3, 1) + acolor.substr(3, 1));
						} else {
							c = new nexacro.ColorObject(acolor);
						}
						if (acolor.length == 9) {
							var aa = acolor.substring(7);
							a = (parseInt(aa, 16) / 255).toString();
						}
					} else {
						if (acolor.toLowerCase().indexOf("rgb") >= 0) {
							var acolorx = this._rgba2hex(acolor);
							acolor = acolorx[0];
							if (acolorx[1] && acolorx[1] >= 0) a = acolorx[1];
							c = new nexacro.ColorObject(acolor);
						} else if (acolor.toLowerCase().indexOf("gradient") >= 0) {
							c = new nexacro.BackgroundObject(acolor);
						} else {
							c = new nexacro.ColorObject(acolor);
						}
					}
				} else {
					if (acolor.value && acolor._sysvalue) {
						c = acolor;
					} else if (acolor.length == undefined) // gradient
					{
						c = acolor.toString();
					} else {
						if (acolor[3] != 0 && !acolor[3]) acolor[3] = 1;
						str = "#" + this.hexstr(acolor[0]);
						str += this.hexstr(acolor[1]).toString();
						str += this.hexstr(acolor[2]).toString();
						a = acolor[3];
						c = new nexacro.ColorObject(str);
					}
				}
				var _b = this.handle;
				if (_b && a !== "") {
					if (a > 1) {
						a = (parseInt(a, 16) / 255).toString();
					}
					this._globalAlphaColor = a;
					nexacro.__setCanvasElementHandleGlobalAlpha(_b, a);
				} else {
					if (this._globalAlphaColor !== this.globalAlpha) {
						nexacro.__setCanvasElementHandleGlobalAlpha(_b, this.globalAlpha);
					}
				}
				if (a == "") {
					this._globalAlphaColor = 1;
					a = 1;
				}
				return [c, a];
			};
			/*
			 25.12.23 nexa Lab Alpha 값 오류 수정
			_pCanvasElement._changeGlobalAlpha = function (v) {
				var _b = this.handle;
				if (v == "stroke") {
					if (this._globalAlphaStroke !== this.globalAlpha) {
						nexacro.__setCanvasElementHandleGlobalAlpha(_b, this._globalAlphaStroke);
						this._globalAlphaLast = this._globalAlphaStroke;
					}
				} else {
					if (this._globalAlphaFill !== this.globalAlpha) {
						nexacro.__setCanvasElementHandleGlobalAlpha(_b, this._globalAlphaFill);
						this._globalAlphaLast = this._globalAlphaFill;
					}
				}
			};
			_pCanvasElement._resetGlobalAlpha = function (v) {
				var _b = this.handle;
				if (this._globalAlphaLast !== this.globalAlpha) {
					nexacro.__setCanvasElementHandleGlobalAlpha(_b, this.globalAlpha);
				}
			};
			*/
			
			//25.12.23 nexa Lab 전용 Alpha 값 오류 수정
			_pCanvasElement._changeGlobalAlpha = function (v){
				var handle = this.handle;
				if (!handle || !handle._draw_node || !handle._draw_node.getContext) return;

				var ctx = handle._draw_node.getContext("2d");
				if (!ctx) return;

				// 원본 globalAlpha backup
				if (this._prevGlobalAlpha == undefined) {
					this._prevGlobalAlpha = ctx.globalAlpha;
				}
				
				// 기본 globalAlpha
				var baseAlpha = Number(this.globalAlpha);
				if (!isFinite(baseAlpha)) baseAlpha = 1;

				// stroke/fill 별 적용 alpha 계산
				var applyAlpha;
				if (v == "stroke") {
					applyAlpha = Number(this._globalAlphaStroke);
					if (!isFinite(applyAlpha)) applyAlpha = baseAlpha;
				} else {
					applyAlpha = Number(this._globalAlphaFill);
					if (!isFinite(applyAlpha)) applyAlpha = baseAlpha;
				}

				// 기존 로직 유지 (alpha 값 비교)
				if (applyAlpha !== baseAlpha) {
					nexacro.__setCanvasElementHandleGlobalAlpha(handle, applyAlpha);
					this._globalAlphaLast = applyAlpha;
				} else {
					handle._applyGlobalAlpha = baseAlpha;
					this._globalAlphaLast = baseAlpha;
				}

				// alpha 값 적용
				var a = Number(handle._applyGlobalAlpha);
				if (!isFinite(a)) a = baseAlpha;
				if (a < 0) a = 0;
				if (a > 1) a = 1;

				ctx.globalAlpha = a;
			};

			_pCanvasElement._resetGlobalAlpha = function (){
				var handle = this.handle;
				if (!handle || !handle._draw_node || !handle._draw_node.getContext) return;

				var ctx = handle._draw_node.getContext("2d");
				if (!ctx) return;

				// 원본 globalAlpha 복구
				if (this._prevGlobalAlpha !== undefined) {
					ctx.globalAlpha = this._prevGlobalAlpha;
					delete this._prevGlobalAlpha;
				} else {
					ctx.globalAlpha = Number(this.globalAlpha) || 1;
				}
			};

			_pCanvasElement._orgSetElementFillStyle = _pCanvasElement.setElementFillStyle;
			_pCanvasElement.setElementFillStyle = function (_a) {
				if (!_a) return;
				var arr = this._convertStyle(_a);
				_a = arr[0];
				this._globalAlphaFill = arr[1];
				return this._orgSetElementFillStyle(_a);
			};
			_pCanvasElement._orgSetElementStrokeStyle = _pCanvasElement.setElementStrokeStyle;
			_pCanvasElement.setElementStrokeStyle = function (_a) {
				if (!_a) return;
				if (_a instanceof nexacro._CanvasGradient) {
					_a = _a.colors[0].orgcolor;
				}
				if ((typeof _a) == "number") _a += "";
				var arr = this._convertStyle(_a);
				_a = arr[0];
				this._globalAlphaStroke = arr[1];
				return this._orgSetElementStrokeStyle(_a);
			};
			_pCanvasElement._orgSetElementShadowColor = _pCanvasElement.setElementShadowColor;
			_pCanvasElement.setElementShadowColor = function (_a) {
				if (!_a) return;
				var arr = this._convertStyle(_a);
				_a = arr[0];
				return this._orgSetElementShadowColor(_a);
			};
			_pCanvasElement._orgCreateLinearGradient = _pCanvasElement.createLinearGradient;
			_pCanvasElement.createLinearGradient = function (_a, _b, _c, _d) {
				return this._orgCreateLinearGradient(_a, _b, _c, _d);
			};
			_pCanvasElement._orgCreateRadialGradient = _pCanvasElement.createRadialGradient;
			_pCanvasElement.createRadialGradient = function (_a, _b, _c, _d, _e, _f) {
				return this._orgCreateRadialGradient(_a, _b, _c, _d, _e, _f);
			};
			_pCanvasElement._orgFill = _pCanvasElement.fill;
			_pCanvasElement.fill = function () {
				this._changeGlobalAlpha("fill");
				this._orgFill();
				this._resetGlobalAlpha();
			};
			_pCanvasElement._orgFillRect = _pCanvasElement.fillRect;
			_pCanvasElement.fillRect = function (_a, _b, _c, _d) {
				this._changeGlobalAlpha("fill");
				this._orgFillRect(_a, _b, _c, _d);
				this._resetGlobalAlpha();
			};
			_pCanvasElement._orgFillText = _pCanvasElement.fillText;
			_pCanvasElement.fillText = function (_a, _b, _c, _d) {
				this._changeGlobalAlpha("fill");
				this._orgFillText(_a, _b, _c, _d);
				this._resetGlobalAlpha();
			};
			_pCanvasElement._orgStroke = _pCanvasElement.stroke;
			_pCanvasElement.stroke = function () {
				this._changeGlobalAlpha("stroke");
				this._orgStroke();
				this._resetGlobalAlpha();
			};
			_pCanvasElement._orgStrokeRect = _pCanvasElement.strokeRect;
			_pCanvasElement.strokeRect = function (_a, _b, _c, _d) {
				this._changeGlobalAlpha("stroke");
				this._orgStrokeRect(_a, _b, _c, _d);
				this._resetGlobalAlpha();
			};
			_pCanvasElement._orgStrokeText = _pCanvasElement.strokeText;
			_pCanvasElement.strokeText = function (_a, _b, _c, _d) {
				this._changeGlobalAlpha("stroke");
				this._orgStrokeText(_a, _b, _c, _d);
				this._resetGlobalAlpha();
			};
			_pCanvasElement._orgsetTransform = _pCanvasElement.setTransform;
			_pCanvasElement.setTransform = function (_a, _b, _c, _d, _e, _f, _g) {
				this.changSetTransform = { "a": _a, "b": _b, "c": _c, "d": _d, "e": _e, "f": _f, "g": _g };
				this._orgsetTransform(_a, _b, _c, _d, _e, _f, _g);
			};
		}
	}

	nexacro.DXChart = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent) {
		nexacro.Div.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
		this.userbuttonmenu = true;
		this.autoresize = true;
		this.contents = null;
		this._binddataset = null;

		if (!initCanvasFlag) {
			initCanvasFlag = true;
			nexacro.initCanvas();
		}
	};

	var _pChartJS = nexacro._createPrototype(nexacro.Div, nexacro.DXChart);
	nexacro.DXChart.prototype = _pChartJS;
	_pChartJS._type_name = "DXChart";
	_pChartJS.enableevent = true;
	_pChartJS._event_list = {
		"onclick": 1, "ondblclick": 1,
		"onkillfocus": 1, "onsetfocus": 1,
		"onlbuttondown": 1, "onlbuttonup": 1, "onrbuttondown": 1, "onrbuttonup": 1,
		"onmouseenter": 1, "onmouseleave": 1, "onmousemove": 1,
		"ondrag": 1, "ondragenter": 1, "ondragleave": 1, "ondragmove": 1, "ondrop": 1,
		"onmove": 1, "onsize": 1, "onmousewheel": 1,
		//added event
		"onmouseup": 1, "onmousedown": 1, "oncontextmenu": 1,

		// scroll event
		"onhscroll": 1, "onvscroll": 1,

		// Touch,TouchGesture
		"ontouchstart": 1, "ontouchmove": 1, "ontouchend": 1,
		"onrangezoomed": 1, "onlongpress": 1
	};

	_pChartJS._DXChart_event_list = [
		"onadjust", "onadjustbegin", "onadjustend",
		"onafterinteractivekey",
		"onannotate", "onannotatebegin", "onannotateclear", "onannotateend",
		"onbeforeclear", "onbeforecontextmenu", "onbeforedraw", "onbeforeinteractivekey", "onbeforetooltip",
		"onclick", "onchange", "onchangebegin", "onclear", "oncontextmenu", "onenddraw", "onfirstdraw",
		"onkeyclick", "onmouseout",
		"ontooltip"
	];

	_pChartJS._append_DXChartEvent = function () {
		var sKey;
		for (var i = 0; i < this._DXChart_event_list.length; i++) {
			sKey = this._DXChart_event_list[i];
			this._event_list[sKey] = 1;
		}
	}

	//Dxchart 관련 event 추가
	_pChartJS._append_DXChartEvent();

	_pChartJS.on_notify_vscroll_onscroll = function (_a, _b) {
		trace("_pChartJS.on_notify_vscroll_onscroll : ");
		this._scrollTo(this._hscroll_pos, _b.pos, false, false, _b.type, _b._evtkind);
	}

	_pChartJS._scrollTo = function (_a, _b) {
		trace("_pChartJS._scrollTo : ");
		//this._scrollTo(this._hscroll_pos, _b.pos, false, false, _b.type, _b._evtkind);
	}


	_pChartJS._on_bubble_mousewheel = function (_a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p) {
		if (this.canvas && this.canvas.__object__ && (this.canvas.__object__.type == "tree" || this.canvas.__object__.type == "org" || this.canvas.__object__.type == "map")) {
			if (this.canvas.__object__.properties.scaleZoom == true) return;
		}
		return this.parent._on_bubble_mousewheel(_a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, false, _m, _n, _o, _p);
	}

	_pChartJS.on_create_contents = function () {
		if (!this.url) {
			this.form.createComponent(true);

		}

	};

	_pChartJS.on_change_containerRect = function (width, height) {
		//console.log("on_change_containerRect",width, height);
		if (this._cell_elem) {
			this._cell_elem.setElementSize(width, height);
		}

		this._recalcLayout();

		if (this.canvas && this.autoresize == true) {
			var control_elem = this.getElement();
			if (isNexacroRuntime) {
				this.canvas.set_width(width);
				this.canvas.set_height(height);
				this.form.resetScroll();
			} else {
				this._static.set_width(width);
				this._static.set_height(height);
				this.canvas.width = width;
				this.canvas.height = height;
			}
			var objChart = this.canvas.__object__;
			if (objChart) {
				var func = objChart.onsize;
				if (func) {
					var e = {};
					func(objChart, e);
				}
			}
			DxChart._resizeCanvas(this.canvas);
			DxChart.redrawCanvas(this.canvas);
		}

	};

	_pChartJS.on_created_contents = function (win) {
		if (isNexacroRuntime) {
			this.on_attach_contents_handle();
		};
	};

	_pChartJS.on_attach_contents_handle = function (win) {
		this.set_enableevent(true);
		this.set_text("");

		var form = this.form;
		if (!this.url) {
			form.createComponent();
		}
		else {
			if (this.url && form._is_loaded && !form._is_created) {
				form.createComponent();
				form.set_scrolltype("none");
			}
		}
		this.set_formscrolltype("none");

		this.on_apply_text();
		this._recalcLayout();

		if (!this.canvas) {
			var control_elem = this.getElement();
			var elem = control_elem.handle;
			var canvas;
			var sid = "";
			if (isNexacroRuntime) {
				sid = DxChart.createUID();	//this.name + "_canvas";	
				canvas = new nexacro.CanvasComponent(sid, 0, 0, control_elem.client_width, control_elem.client_height);
				canvas.set_name(sid);
				canvas.id = sid;
				this.form.addChild(sid, canvas);
				canvas.show();
				canvas.bringToFront();
				canvas.set_enableevent(true);
			} else {
				sid = this.name + "_static";
				var sta = new nexacro.Static(sid, 0, 0, control_elem.client_width, control_elem.client_height);
				sta.set_width(control_elem.client_width);
				sta.set_height(control_elem.client_height);
				this.form.addChild(sid, sta);
				sta.show();
				this._static = sta;

				var control_elem2 = sta.getElement();
				var elem2 = control_elem2.handle;

				sid = DxChart.createUID();	//control_elem2.id + "_canvas";
				canvas = document.createElement('canvas');
				canvas.id = sid;
				canvas.width = control_elem.client_width;
				canvas.height = control_elem.client_height;
				elem2.appendChild(canvas);
				canvas.parent = this;
				canvas._refform = this._refform;
			}
			this.canvas = canvas;
		}
		var pThis = this;
		try {
			this.addEventHandler("onmousemove", function (obj, e) {
				if (e.canvasx < 20 || e.canvasy < 20) {
					try {
						DxChart._timerHideTooltip();
					} catch (e) {
					}
				} else {
					var x = pThis.canvas.width;
					var y = pThis.canvas.height;
					if (e.canvasx > (x - 20) || e.canvasy > (y - 20)) {
						try {
							DxChart._timerHideTooltip();
						} catch (e) {
						}
					}
				}
			}, this);
			this.addEventHandler("onmouseleave", function (obj, e) {
				try {
					DxChart._timerHideTooltip();
				} catch (e) {
				}
			}, this);
			this.addEventHandler("onrbuttondown", this._onrbuttondown, this);
		} catch (e) {
		}


		if (nexacro.isDesignMode) return;
		this.set_userbuttonmenu(this.userbuttonmenu);
		this.on_apply_contents();

	};

	_pChartJS.on_apply_text = function (text) {
		if (this.contents) return;

		var control_elem = this.getElement();
		if (control_elem) {
			if (!text)
				text = this._displaytext;

			var cell_elem = this._cell_elem;
			if (!cell_elem && text) {
				var win = this._getWindow();
				cell_elem = this._cell_elem = new nexacro.TextBoxElement(control_elem);
				cell_elem.create(win);
			}

			if (cell_elem) {
				cell_elem.setElementSize(this._getClientWidth(), this._getClientHeight());
				cell_elem.setElementVerticalAlign("middle");
				cell_elem.setElementTextAlign("center");
				cell_elem.setElementText(text);
			}
		}
	};

	_pChartJS.set_autoresize = function (v) {
		v = nexacro._toBoolean(v);
		this.autoresize = v;

		if (v == false) {
			this.set_formscrolltype("");
			this.form.set_scrolltype("both");
			this.form.resetScroll();
		} else {
			this.set_formscrolltype("none");
			this.form.set_scrolltype("none");
		}
	};

	_pChartJS.set_userbuttonmenu = function (v) {
		v = nexacro._toBoolean(v);
		this.userbuttonmenu = v;

		if (v == true && !this.userbuttonmenumake) {
			var ds = new Dataset();
			ds.set_name("_canvasPopupDs");
			this.form.addChild("_canvasPopupDs", ds);

			ds.addColumn("IDCOL", "string");
			ds.addColumn("LEVELCOL", "int");
			ds.addColumn("CAPTIONCOL", "string");

			var nRow = ds.addRow();
			ds.setColumn(nRow, "IDCOL", "ID0");
			ds.setColumn(nRow, "LEVELCOL", 0);
			ds.setColumn(nRow, "CAPTIONCOL", "Redraw");

			nRow = ds.addRow();
			ds.setColumn(nRow, "IDCOL", "ID1");
			ds.setColumn(nRow, "LEVELCOL", 0);
			ds.setColumn(nRow, "CAPTIONCOL", "Save Image");

			nRow = ds.addRow();
			ds.setColumn(nRow, "IDCOL", "ID2");
			ds.setColumn(nRow, "LEVELCOL", 0);
			ds.setColumn(nRow, "CAPTIONCOL", "Print Canvas");

			var objPopupMenu = new PopupMenu("_canvaPopupMenu", 0, 0, 90, 90, null, null);
			this.form.addChild("_canvaPopupMenu", objPopupMenu);
			objPopupMenu.show();
			objPopupMenu.set_innerdataset(ds.name);
			objPopupMenu.set_captioncolumn("CAPTIONCOL");
			objPopupMenu.set_idcolumn("IDCOL");
			objPopupMenu.set_levelcolumn("LEVELCOL");
			objPopupMenu.set_itemheight(30);

			objPopupMenu.addEventHandler("onmenuclick", this._rbuttonmenuclick, this);

			this.___popupmenu = objPopupMenu;
			this.___popupds = ds;

			this.userbuttonmenumake = true;
		}
	};

	_pChartJS._rbuttonmenuclick = function (obj, e) {
		if (e.id == "ID0") {	// redraw
			if (this.canvas.__object__) {
				DxChart.redrawCanvas(this.canvas);
			}
		} else if (e.id == "ID1") {	// save image
			if (isNexacroRuntime) {
				var rtn = system.saveToImageFile(this.form, "DxChart.png", "PNG");
				if (rtn) {
					alert("내문서에 저장되었습니다.");
				}
			} else {
				var canvas = this.canvas;
				let canvasUrl = canvas.toDataURL();
				var createEl = document.createElement('a');
				createEl.href = canvasUrl;
				createEl.download = "DxChart";
				createEl.click();
				createEl.remove();
			}
		} else if (e.id == "ID2") {	// print
			system.print(this.form, true);
		}
	};


	_pChartJS._onrbuttondown = function (obj, e) {
		this.___popupmenu.trackPopupByComponent(obj, e.clientx, e.clienty);
	};

	_pChartJS.on_destroy_contents = function () {
		if (this._binddataset)
			this._removeDSEventHandlers(this._binddataset);

		if (this.___popupmenu) {
			try {
				this.form.removeChild(this.___popupmenu.name);
				this.___popupmenu.destroy();
			} catch (e) { }

			this.___popupmenu = null;

			try {
				this.form.removeChild(this.___popupds.name);
			} catch (e) { }
			this.___popupds = null;
		}
		if (this._static) {
			if (this.canvas) {
				try {
					DxChart.reset(this.canvas);
				} catch (e) { }
				this.canvas.parentNode.removeChild(this.canvas);
				this.canvas = null;
			}
			this.form.removeChild(this._static.name, this._static);
			this._static.destroy();
			this._static = null;
		}
		if (this.canvas && isNexacroRuntime) {
			try {
				DxChart.reset(this.canvas);
			} catch (e) { }
			this.form.removeChild(this.canvas.name);
			this.canvas.destroy();
			this.canvas = null;
		}

		this._destroyTextElement();
		this._destroyFormControl();

		this._user_property_list = null;
	};

	_pChartJS._onmouseleave = function (obj, e) {
		return this.canvas;
	};

	_pChartJS.getCanvas = function () {
		return this.canvas;
	};

	_pChartJS.getDiv = function () {
		var control_elem = this.getElement();
		if (control_elem) {
			return control_elem.handle;
		}
	};

	_pChartJS.removeCanvas = function () {
		if (this.canvas) {
			if (system.navigatorname == "nexacro") {
				this._refform.removeChild(this.canvas);
				this.canvas.destroy();
			} else {
				if (this.canvas.parentNode) {
					this.canvas.parentNode.removeChild(this.canvas);
				}
			}
			this.canvas = null;
		}
	};


	_pChartJS.setChartType = function (v) {
		this.charttype = v;
	};

	_pChartJS.setLabel = function (v) {
		this.labels = v;
	};

	_pChartJS.setDatasetData = function (idx, sType, v) {
		if (!this.datasets[idx]) this.datasets[idx] = {};
		var dataset = this.datasets[idx];
		switch (sType) {
			case "label": dataset.label = v; break;
			case "data": dataset.data = v; break;
			case "bgcolor": dataset.backgroundColor = v; break;
			case "bdcolor": dataset.borderColor = v; break;
			case "bdwidth": dataset.borderWidth = v; break;
			default:
		}
	};
	_pChartJS.getDatasetData = function (index) {
		if (!this.datasets[idx]) this.datasets[idx] = {};
		return this.datasets[idx];
	};
	_pChartJS.clearDataset = function (index) {
		this.datasets = null;
		this.datasets = [];
	};
	_pChartJS.setOption = function (v) {
		this.options = v;
	};

	_pChartJS.createCanvas = function () {
		///
	};

	// contextmenu의 TEXT를 변경한다.
	// obj : [object] ChartJS object(DIV)
	// v   : [array] 변경할 contextmenu의 텍스트의 배열(["Redraw","Save Image","Print Canvas"])
	_pChartJS.changeContextmenu = function (obj, v) {

		// contextmenu 데이터셋이 만들어지지않았으면 처리를 중단
		if (obj.___popupds && v) {
			var objDs = obj.___popupds;

			for (var i = 0; i < objDs.rowcount; i++) {
				// array 갯수를 초과하면 처리를 중단
				if (i > v.length) break;

				objDs.setColumn(i, "CAPTIONCOL", v[i]);
			}
		}
	};

	_pChartJS._p_contents = "";
	_pChartJS.set_contents = function (v) {
		if (this._p_contents != v) {
			this._p_contents = v;
			this._setContents(this._p_contents);
		}

	};

	Object.defineProperty(_pChartJS, "contents", {
		get: new Function("return this._p_contents"),
		set: nexacro.DXChart.prototype["set_contents"],
		enumerable: true,
		configurable: true
	});


	_pChartJS._setContents = function (v, b) {
		if (v) this.contents = v;
		if (this._control_element) {
			this.on_apply_contents();
		}
	};

	_pChartJS.on_apply_contents = function () {
		if (!this.contents) return;

		if (this.contents && this.contents.templateList) {
			var canvas = this.getCanvas();
			if (!canvas) return;

			DxChart.reset(canvas);

			if (this.contents.templateList.length < 0) {
				return;
			}
			var arrTempList = this.contents.templateList;
			var oChart;

			//text destroy
			this._destroyTextElement();

			for (var i = 0; i < arrTempList.length; i++) {
				oChart = arrTempList[i];

				if (!oChart) continue;
				try{
					this._DXChartDraw(oChart);
				}catch(e){
			
				}
			}

		}
	};

	_pChartJS._DXChartDraw = function (oConfig) {

		if (!oConfig) return;

		var oChartClass = {
			"bar": DxChartBar,
			"line": DxChartLine,
			"hbar": DxChartHBar,
			"pie": DxChartPie,
			"radar": DxChartRadar,
			"scatter": DxChartScatter,
			"bipolar": DxChartBipolar,
			"gauge": DxChartGauge,
			"hprogress": DxChartHProgress,
			"vprogress": DxChartVProgress
		};

		var sType = oConfig["chartType"];
		var oClass = oChartClass[sType]
		if (!oClass) return;

		var canvas = this.getCanvas();
		if (!canvas) return;

		var cvs = canvas.id;
		DxChart.reset(canvas);

		var oDrawOptions = {
			"id": cvs,
			"elem": canvas,
			"data": [],
			"options": {}
		}

		//binddataset
		try {
			if (oConfig["binddataset"]) {
				if (this._binddataset) {
					oDrawOptions.binddataset = this._binddataset;
				} else {
					//comp binddataset 없을 때, contents의 binddata id로 dataset object찾아 bind
					this.set_binddataset(oConfig["binddataset"]);
					var bindDs = this.getBindDataset();
					if (bindDs) {
						oDrawOptions.binddataset = bindDs;
					} 
				}
			}
		} catch (e_bindds) {

		}

		//options
		var objAdvancedInfo = oConfig["advancedInfo"];
		var sValue;
		for (var sKey in objAdvancedInfo) {
			sValue = objAdvancedInfo[sKey];
			oDrawOptions.options[sKey] = sValue;
		}
		
		//Data && bindinfo
		if (oConfig["data"] && oConfig["data"].bindInfo) {
			var arrBindInfo = oConfig["data"].bindInfo;
			var sBindId;
			for (var i = 0; i < arrBindInfo.length; i++) {
				var bindInfo = arrBindInfo[i];
				if (!bindInfo) continue;

				var sBindId = bindInfo.id;
				var sColId = bindInfo.colid;
				var bindValue = bindInfo.value;
				if (!sBindId) continue;

				//data
				if (sBindId == "data") {

					if (!sColId) continue;

					if (Array.isArray(sColId)) {
						for (var j in sColId) {
							oDrawOptions.data.push("bind:" + sColId[j]);
						}
					} else if (typeof sBindId == "string" && sBindId) {
						oDrawOptions.data = ["bind:" + sColId];
					}
					continue;
				}

				//특정 차트 data bind처리
				//bipolar
				if (sType === "bipolar") {
					if (sBindId === "right" || sBindId === "left") {
						if (sColId){
							oDrawOptions[sBindId] = "bind:" + sColId;
						}else if("value" in bindInfo){
							oDrawOptions[sBindId] = bindValue;
						}
						continue;
					}	
				}else if (sType === "gauge" || sType === "hprogress" || sType === "vprogress") {
					 //gauge, hprogress, vprogress
					if (sBindId === "value" || sBindId === "max" || sBindId === "min") {
						if (sColId){
							oDrawOptions[sBindId] = "bind:" + sColId;
						}else if("value" in bindInfo){
							oDrawOptions[sBindId] = bindValue;
						}
						continue;
					}
				}
				
				//bindinfo
				if (sColId && typeof sColId == "string") {
					oDrawOptions.options[sBindId] = ["bind:" + sColId];
				}else if("value" in bindInfo){
					oDrawOptions.options[sBindId] = bindValue;
				}


			}
		};

		//effcet 
		var sEffect = "draw";
		if (!nexacro.isDesignMode) {
			if (oConfig["effect"]) {
				sEffect = oConfig["effect"].type;
			}
		}
		
		//create chart class
		var oDrawChart = new oClass(oDrawOptions);
		
		//chart event register
		this.on_apply_chartEvent(oDrawChart);
		
		//chart draw
		try {
			oDrawChart[sEffect]();
		} catch (e) {
			if(nexacro && nexacro.trace){
				var name = (e && e.name) ? e.name : "Error";
				var msg  = (e && e.message) ? e.message : String(e);
				var stack = (e && e.stack) ? e.stack : "(no stack)";
				
				nexacro.trace("========================================");
				nexacro.trace("[DXChart Draw ERROR]");
				nexacro.trace("name   : " + name);
				nexacro.trace("message: " + msg);
				nexacro.trace("stack  : " + stack);
				nexacro.trace("========================================");
			}
		}
	}

	//chart event register
	_pChartJS.on_apply_chartEvent = function (oDrawChart) {
		if (!oDrawChart) return;

		var evtList = this._DXChart_event_list;

		var evtList = _pChartJS._DXChart_event_list;

		for (var i = 0; i < evtList.length; i++) {
			var key = evtList[i];
			var fn = this["on_fire_" + key];
			if (fn) {
				oDrawChart.on(key, fn.bind(this));
			}
		}
	}

	//binddatset set
	_pChartJS.setBindDataset = function (obj) {
		if (obj instanceof nexacro.Dataset) {
			if (this._binddataset)
				this._removeDSEventHandlers(this._binddataset);

			if (!obj) {
				this._binddataset = null;
				this.binddataset = "";
			}
			else {
				this._binddataset = obj;
				this.binddataset = obj.id;
			}
			this._setDSEventHandlers(this._binddataset);
		}
	};

	//binddatset get 
	_pChartJS.getBindDataset = function () {
		return this._binddataset;
	};

	//binddatset set_binddataset 
	_pChartJS.set_binddataset = function (str) {
		if (str && typeof str != "string") {
			this.setBindDataset(str);
			return;
		}
		if (str != this.binddataset || this.binddataset && !this._binddataset) {

			if (this._binddataset)
				this._removeDSEventHandlers(this._binddataset);

			if (!str) {
				this._binddataset = null;
				this.binddataset = "";
			}
			else {
				str = str.replace("@", "");
				this._binddataset = this._findDataset(str);
				this.binddataset = str;
			}
			this._setDSEventHandlers(this._binddataset);
		}
		//apply contents
		this.on_apply_contents();

		return this.binddataset;
	};

	//Dataset Event Handler add
	_pChartJS._setDSEventHandlers = function (objDs) {
		if (objDs && objDs instanceof nexacro.Dataset) {
			objDs._setEventHandler("onload", this._on_updateInnerDs, this);
			objDs._setEventHandler("onvaluechanged", this._on_updateInnerDs, this);
            objDs._setEventHandler("onrowsetchanged", this._on_updateInnerDs, this);
		}
	};

	//Dataset Event Handler remove
	_pChartJS._removeDSEventHandlers = function (objDs) {
		if (objDs && objDs instanceof nexacro.Dataset) {
			objDs._removeEventHandler("onload", this._on_updateInnerDs, this);
			objDs._removeEventHandler("onvaluechanged", this._on_updateInnerDs, this);
            objDs._removeEventHandler("onrowsetchanged", this._on_updateInnerDs, this);
		}
	};

	//Dataset oncolumnchanged event
	_pChartJS._on_updateInnerDs = function (obj, e) {
		this.on_apply_contents();
	};

	//===============================================================
	// nexacro.DXChart : Events
	//===============================================================

	_pChartJS._fireChartEvent = function (evtName, obj, e) {
		if (!this.visible || !this._isEnable() || !this.enableevent)
			return;

		var evtFunc = this[evtName];
		if (!evtFunc || !evtFunc._has_handlers) return;

		var evt = new nexacro.DXChartEventInfo(this, evtName, obj, e);
		return evtFunc._fireEvent(this, evt);
	};

	// 1. onadjust
	_pChartJS.on_fire_onadjust = function (obj) {
		return this._fireChartEvent("onadjust", obj);
	};

	// 2. onadjustbegin
	_pChartJS.on_fire_onadjustbegin = function (obj) {
		return this._fireChartEvent("onadjustbegin", obj);
	};

	// 3. onadjustend
	_pChartJS.on_fire_onadjustend = function (obj) {
		return this._fireChartEvent("onadjustend", obj);
	};

	// 4. onafterinteractivekey
	_pChartJS.on_fire_onafterinteractivekey = function (obj) {
		return this._fireChartEvent("onafterinteractivekey", obj);
	};

	// 5. onannotate
	_pChartJS.on_fire_onannotate = function (obj) {
		return this._fireChartEvent("onannotate", obj);
	};

	// 6. onannotatebegin
	_pChartJS.on_fire_onannotatebegin = function (obj) {
		return this._fireChartEvent("onannotatebegin", obj);
	};

	// 7. onannotateclear
	_pChartJS.on_fire_onannotateclear = function (obj) {
		return this._fireChartEvent("onannotateclear", obj);
	};

	// 8. onannotateend
	_pChartJS.on_fire_onannotateend = function (obj) {
		return this._fireChartEvent("onannotateend", obj);
	};

	// 9. onbeforeclear
	_pChartJS.on_fire_onbeforeclear = function (obj) {
		return this._fireChartEvent("onbeforeclear", obj);
	};

	// 10. onbeforecontextmenu
	_pChartJS.on_fire_onbeforecontextmenu = function (obj) {
		return this._fireChartEvent("onbeforecontextmenu", obj);
	};

	// 11. onbeforedraw
	_pChartJS.on_fire_onbeforedraw = function (obj) {
		return this._fireChartEvent("onbeforedraw", obj);
	};

	// 12. onbeforeinteractivekey
	_pChartJS.on_fire_onbeforeinteractivekey = function (obj) {
		return this._fireChartEvent("onbeforeinteractivekey", obj);
	};

	// 13. onbeforetooltip
	_pChartJS.on_fire_onbeforetooltip = function (obj) {
		return this._fireChartEvent("onbeforetooltip", obj);
	};

	// 14. onclick
	_pChartJS.on_fire_onclick = function (e, obj) {
		return this._fireChartEvent("onclick", obj, e);
	};

	// 15. onchange
	_pChartJS.on_fire_onchange = function (obj) {
		return this._fireChartEvent("onchange", obj);
	};

	// 16. onchangebegin
	_pChartJS.on_fire_onchangebegin = function (obj) {
		return this._fireChartEvent("onchangebegin", obj);
	};

	// 17. onclear
	_pChartJS.on_fire_onclear = function (obj) {
		return this._fireChartEvent("onclear", obj);
	};

	// 18. oncontextmenu
	_pChartJS.on_fire_oncontextmenu = function (obj) {
		return this._fireChartEvent("oncontextmenu", obj);
	};

	// 19. onenddraw
	_pChartJS.on_fire_onenddraw = function (obj) {
		return this._fireChartEvent("onenddraw", obj);
	};

	// 20. onfirstdraw
	_pChartJS.on_fire_onfirstdraw = function (obj) {
		return this._fireChartEvent("onfirstdraw", obj);
	};

	// 21. onkeyclick
	_pChartJS.on_fire_onkeyclick = function (obj) {
		return this._fireChartEvent("onkeyclick", obj);
	};

	// 22. onmouseout
	_pChartJS.on_fire_onmouseout = function (obj, e) {
		return this._fireChartEvent("onmouseout", obj, e);
	};

	// 23. ontooltip
	_pChartJS.on_fire_ontooltip = function (obj) {
		return this._fireChartEvent("ontooltip", obj);
	};


}	
