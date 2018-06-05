/**
 * Created by PC-LHF on 2017-02-06.
 */

function getCurrnetMonthDays() {
	var d = new Date();
	var m = parseInt(d.getMonth() + 1);
	var res = new Date(d.getYear(), m, 0);
	return res.getDate();
}

var NORMAL = 1;
var EXPERT = 2;
var CLASS = 3;


/**
 * 需求单状态
 */
	//合同创建完成，未提交审核
let ORDER_INITIAL = 0;
//审核中
let ORDER_CHECKING = 1;
//审核完成
let ORDER_CHECKING_FINISHED = 2;
//已改单
let ORDER_CHANGED = 3;
//已拆单
let ORDER_SPLITED = 4;
//已驳回
let ORDER_REJECTED = 5;
//已取消
let ORDER_CANCELED = 6;

/**
 * 合同状态
 */
	//合同创建完成，未提交审核
let CONTRACT_INITIAL = 0;
//审核中
let CONTRACT_CHECKING = 1;
//审核完成
let CONTRACT_CHECKING_FINISHED = 2;
//已改单
let CONTRACT_CHANGED = 3;
//已拆单
let CONTRACT_SPLITED = 4;
//已驳回
let CONTRACT_REJECTED = 5;
//已取消
let CONTRACT_CANCELED = 6;

/**
 * 签核结果：“0”-->初始化；“1”-->接受； “2”-->驳回
 */
let SIGN_INITIAL = 0;
let SIGN_APPROVE = 1;
let SIGN_REJECT = 2;

/**
 *计划方式: 日计划、弹性计划
 */
let DAILY_PLAN = 1;
let FLEX_PLAN = 2;

Date.prototype.toJSON = function () {
	return this.format("yyyy-MM-dd hh:mm:ss");
}

// reset the value of object
function resetObject(obj) {
	if (obj == null || obj.length == 0) {
		return;
	}
	for (let k of Object.keys(obj)) {
		let typeName = typeof(obj[k]);
		switch (typeName) {
			case 'string':
				obj[k] = '';
				break;
			case 'number':
				obj[k] = null;
				break;
			case 'object':
				resetObject(obj[k]);
				break;
			case 'array':
				resetArray(obj[k]);
				break;
			default:
				break;
		}

	}
}

// reset the value of array
function resetArray(obj) {
	if (obj == null || obj.length == 0) {
		return;
	}
	for (let item of obj) {
		let typeName = typeof(item);
		switch (typeName) {
			case 'string':
				item = '';
				break;
			case 'number':
				item = null;
				break;
			case 'object':
				resetObject(item);
				break;
			case 'array':
				resetArray(item);
				break;
			default:
				break;
		}
	}
}

function loadXMLDoc(xml_name) {
	var xmlDoc;
	try {
		xmlDoc = new ActiveXObject("Microsoft.XMLDOM"); // Support IE
	}
	catch (e) {
		try {
			// Support Firefox, Mozilla, Opera, etc
			xmlDoc = document.implementation.createDocument("", "", xml_name);// 创建一个空的 XML 文档对象。
		} catch (e) {
			// alert(e.message);
		}
	}
	// 加载XML文档
	try {
		xmlDoc.async = false; // 关闭异步加载
		xmlDoc.load(xml_name);
	} catch (e) {
		// alert(e.message) 如果浏览器是Chrome，则会catch这个异常：Object # (a Document) has no method "load"，所以，以下实现支持chrome加载XML文档（只是粗略的写下）
		var xhr = new XMLHttpRequest();
		xhr.open("GET", xml_name, false);
		xhr.send(null);
		xmlDoc = xhr.responseXML.documentElement;
	}
	return xmlDoc;
}

function addCommandsForToolBox(docXML, command, type) {
	if (docXML == null) return docXML;
	var found = false;
	for (var i = 0; i < docXML.childNodes.length && !found; i++) {
		if (docXML.childNodes[i].childNodes.length > 0) {
			for (var j = 0; j < docXML.childNodes[i].childNodes.length; j++) {

				//添加到高级控制
				if (type == EXPERT && docXML.childNodes[i].childNodes[j].className == "expert_control") {
					var element = document.createElement("block");
					element.setAttribute("type", command);
					docXML.childNodes[i].childNodes[j].appendChild(element);
					found = true;
				}
				//添加到基本控制
				if (type == NORMAL && docXML.childNodes[i].childNodes[j].className == "normal_control") {
					var element = document.createElement("block");
					element.setAttribute("type", command);
					docXML.childNodes[i].childNodes[j].appendChild(element);
					found = true;
				}

				//添加到class控制
				if (type == CLASS && docXML.childNodes[i].childNodes[j].className == "class_control") {
					var element = document.createElement("block");
					element.setAttribute("type", command);
					docXML.childNodes[i].childNodes[j].appendChild(element);
					found = true;
				}
			}
		}
	}
	return docXML;
}


String.prototype.replaceAll = function (s1, s2) {
	return this.replace(new RegExp(s1, "gm"), s2);
}

Array.prototype.getMaxValue = function () {

	if (this == null) {
		return 0;
	}
	this.sort(function (a, b) {
		if (typeof(a) != 'number' || typeof(b) != 'number') {
			return 0;
		}
		return b - a;
	});
	return this[0];
}

Array.prototype.getMinValue = function () {

	if (this == null) {
		return 0;
	}
	this.sort(function (a, b) {
		if (typeof(a) != 'number' || typeof(b) != 'number') {
			return 0;
		}
		return a - b;
	});
	return this[0];
}

function objValueIsEmpty(obj) {
	for (var key in obj) {
		if (typeof(obj[key]) == 'object') {
			return objValueIsEmpty(obj[key]);
		}
		if (typeof(obj[key]) == 'string') {
			if (isStringEmpty(obj[key])) {
				return key;
			}
		}
	}
	return "";
}

function isNull(obj) {
	if (typeof (obj) != 'number') {
		return obj == null;
	}
	return false;
}

function isUndefined(obj) {
	return typeof (obj) == "undefined";
}

function numberFormat(numObj, intBit) {
	var val = numObj;
	var str = "";
	var i = 0;
	if (val != "") {
		for (i = 0; i < intBit; i++)
			str = str + "0";
		val = str + val;
		val = val.substring(val.length - intBit, val.length);
	}
	return val;
}

String.prototype.endsWith = function (str) {
	var reg = new RegExp(str + "$");
	return reg.test(this);
}


function getCurrentDay() {
	var cdata = new Date();
	var DAYS = ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
	return DAYS[cdata.getDay()];
}


//验证数据是否改动过
function validateIsDifferent(obj1, obj2) {
	var isDifferent = false;
	for (var i in obj1) {
		var item = obj1[i];
		if (typeof(obj1[item]) == "function") {
			continue;
		}
		else if (typeof(obj1[item]) == "number") {
			if (obj1[item].toString() != obj2[item].toString()) {
				isDifferent = true;
				break;
			}
		}
		else if (obj1[item] != obj2[item]) {
			isDifferent = true;
			break;
		}
	}
	return isDifferent;
}

function isInteger(obj) {
	return (obj | 0) === obj;
}

function isStringEmpty(data) {
	if (data == null)
		return true;
	if (typeof(data) == "number") {
		data = data.toString();
	}
	return data.replace(/(^s*)|(s*$)/g, "").length == 0;
}

//验证Email是否正确
function regIsEmail(fData) {
	var reg = new RegExp("^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$");
	return reg.test(fData);
}

//判断手机号是否正确
function regIsPhone(fData) {
	var reg = /^1\d{10}$/;
	return reg.test(fData);
}

function getAudioType(fileName) {
	var voiceExt = fileName.substr(fileName.lastIndexOf(".")).toLowerCase();
	var audioType = "audio/mp3";
	switch (voiceExt) {
		case  ".mp3": {
			audioType = "audio/mp3";
			break;
		}
		case ".wav": {
			audioType = "audio/wav";
			break;
		}
		case ".wma": {
			audioType = "audio/wma";
			break;
		}
		case ".mid":
		case ".midi": {
			audioType = "audio/mid";
			break;
		}
		case ".ogg": {
			audioType = "audio/ogg";
			break;
		}
		default:
			break;
	}
	return audioType;
}


Date.prototype.format = function (format) {
	var o = {
		"M+": this.getMonth() + 1, //month
		"d+": this.getDate(),    //day
		"h+": this.getHours(),   //hour
		"m+": this.getMinutes(), //minute
		"s+": this.getSeconds(), //second
		"q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
		"S": this.getMilliseconds() //millisecond
	}
	if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
		(this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)if (new RegExp("(" + k + ")").test(format))
		format = format.replace(RegExp.$1,
			RegExp.$1.length == 1 ? o[k] :
				("00" + o[k]).substr(("" + o[k]).length));
	return format;
}

//返回一个对象的副本，以免直接赋值，引起对象引用问题
//深浅赋值
/*
 var y = $.extend({}, x),          //shallow copy
 z = $.extend(true, {}, x);    //deep copy

 y.b.f === x.b.f       // true
 z.b.f === x.b.f       // false
 */
function copyObject(item) {
	return $.extend(true, {}, item);
}

function copyObjectByJSON(obj) {
	return JSON.parse(JSON.stringify(obj));
}

//success/warning/info/error
function showMessage(obj, msg, msgType) {

	var dialogType = 'success';
	switch (msgType) {
		case 0:
			dialogType = 'error';
			break;
		case 1:
			dialogType = 'success';
			break;
		case 2:
			dialogType = 'warning';
			break;
		case 3:
			dialogType = 'info';
			break;
	}
	var dialog = obj.$notify({
		showClose: true,
		message: msg,
		type: dialogType,
	});
}


function downloadFile(document, url) {
	try {
		var elemIF = document.createElement("iframe");
		elemIF.src = url;
		elemIF.style.display = "none";
		document.body.appendChild(elemIF);
	} catch (e) {
		console.log(e);
		return e;
	}
	return true;
}

function isIE() {
	var agent = navigator.userAgent.toLowerCase();

	var regStr_ie = /msie [\d.]+;/gi;
	//IE
	if (agent.indexOf("msie") > 0) {
		return agent.match(regStr_ie);
	}
}

function requestFullScreen() {
	var doc = document.documentElement;
	var i = 0;
	if (doc.requestFullScreen) {//W3C
		doc.requestFullScreen();
	}
	else if (doc.webkitRequestFullScreen) {//Chrome
		doc.webkitRequestFullScreen();
		i = 1;
	}
	else if (doc.msRequestFullscreen) {//IE
		doc.msRequestFullscreen();
		i = 2;
	}
	else if (doc.mozRequestFullScreen) {//firefox
		doc.mozRequestFullScreen();
		i = 3;
	}
	console.log(i);
}


function exitFullScreen() {
	var el = document,
		cfs = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.exitFullScreen,
		wscript;

	if (typeof cfs != "undefined" && cfs) {
		cfs.call(el);
		return;
	}

	if (typeof window.ActiveXObject != "undefined") {
		wscript = new ActiveXObject("WScript.Shell");
		if (wscript != null) {
			wscript.SendKeys("{F11}");
		}
	}
}

function saveFile(imgUrl) {
	var oPop = window.open(imgUrl, "", "width=1, height=1, top=5000, left=5000");
	for (; oPop.document.readyState != "complete";) {
		if (oPop.document.readyState == "complete")break;
	}
	oPop.document.execCommand("SaveAs");
	oPop.close();
}

function getFileExtension(filename) {

	var ext = /\.[^\.]+$/.exec(filename);
	return ext;
	var index1 = filename.lastIndexOf(".");
	var index2 = filename.length;
	var extname = filename.substring(index1, index2);//后缀名
	return extname;
}

function compareDate(dStart, dEnd) {
	if (isUndefined(dStart) || isStringEmpty(dStart)) {
		return true;
	}
	if (isUndefined(dEnd) || isStringEmpty(dEnd)) {
		return false;
	}
	start_at = new Date(dStart.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1/$2/$3"));
	end_at = new Date(dEnd.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1/$2/$3"));
	return end_at > start_at;
}
