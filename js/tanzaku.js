//XMLHttpRequestオブジェクトを生成
var xhr = new XMLHttpRequest();
var lns = [];
var lst = [];
var pre = 0, idc = 1;
var unit = 0;

//--------------------------------------------------
//
//
//--------------------------------------------------
function requestFile(method, fname, async) {
	//openメソッドでXMLファイルを開く
	xhr.open(method, fname, async);
	
	//無名functionによるイベント処理
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			buildQuestion(xhr);
		}
	}
	xhr.send(null);
	
	itemDrag();
	//dropAction();
	canvasAction();
}

//--------------------------------------------------
//
//
//--------------------------------------------------
function buildQuestion(HttpObj){
	var resHTTP = HttpObj.responseXML.documentElement;
	list = resHTTP.getElementsByTagName('question');
	textList = resHTTP.getElementsByTagName('text');
	itemList = resHTTP.getElementsByTagName('item');
	
	//問題文領域
	document.getElementById("question").innerHTML += "<h1>問題</h1>";
	document.getElementById("question").innerHTML += "<p>" + textList[0].childNodes[0].nodeValue + " </p>";
	
	//選択肢領域
	document.getElementById("choices").innerHTML += "<h3>選択肢</h3>";
	for(i = 0; i < itemList.length; i++) {
		var str = "<div id= \"i"+ i +"\" draggable = \"true\"  ondragstart=\"itemDragStart(event)\">" ;
		str += buildChoicesParts(itemList[i]);
		str += "</div>";
		document.getElementById("choices").innerHTML += str;
		
		lst[i] = buildChoicesParts(itemList[i]);
	}
}

function buildChoicesParts(item){
	str = item.childNodes[0].nodeValue;
	
	//正規表現を使ってTagを識別する予定
	//再帰的に呼び出すメソッドも必要か
	//var regexp = /&lt;+.!+&gt/i;
	//if(item.getElementsByTagName('stdio.h') !=  null){
	//	str += "&lt;stdio.h&gt;";
	//}
	return str;
}

//--------------------------------------------------
//
//
//--------------------------------------------------
function buildAnswerArea(){
	
	
	
}

var bdy;
function itemDrag(){
	bdy = document.getElementById('d');
	bdy.ondragover = prev;
	bdy.ondrop = function(e) {
		var id = e.dataTransfer.getData('text');
		var elt = document.getElementById(id);
		//if(id[0] == 'x') {
		//	rmelt(elt); adjindent(); prev(e);
		//}
	}
}

//選択肢をドラッグした時に
//データを渡す
function itemDragStart(e) {
  e.dataTransfer.setData('text',e.target.id);
}

//キャンバスに追加する
function canvasAction(){
	canvas = document.getElementById('canvas');
	
	canvas.ondragover = prev;
	canvas.ondrag=prev;
	canvas.ondrop = function(e){
		id = e.dataTransfer.getData('text');
		var elt = document.getElementById(id)
		alert(document.getElementById(id));
		canvas.appendChild(document.getElementById(id));
	}
}

function prev(e) {
	if(e.preventDefault) {
		e.preventDefault();
	}
}