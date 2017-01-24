//XMLHttpRequestオブジェクトを生成
var xhr = new XMLHttpRequest();
var lns = [];
var lst = [];
var pre = 0;
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
	
	canvasAction();
	removeItem();
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
	document.getElementById("question").innerHTML += "<p>" + textList[0].childNodes[0].nodeValue + "</p>";
	
	//選択肢領域
	for(i = 0; i < itemList.length; i++) {
		var str = "<div id= \"i"+ i +"\" draggable = \"true\"  ondragstart=\"itemDragStart(event)\">" ;
		str += buildChoicesParts(itemList[i]);
		str += "</div>";
		document.getElementById("choices").innerHTML += str;
		
		lst[i] = buildChoicesParts(itemList[i]);
	}
}

//--------------------------------------------------
//
//
//--------------------------------------------------
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

//選択肢をドラッグした時に
//データを渡す
function itemDragStart(e) {
  e.dataTransfer.setData('text',e.target.id);
}

//キャンバスの処理
idc = 0;
function canvasAction(){
	canvas = document.getElementById('canvas');
	
	canvas.ondragover = prev;
	canvas.ondrag=prev;
	
	// キャンバスにドロップされた場合に発火
	canvas.ondrop = function(e){
		
		// ドロップされた選択肢の取得
		id = e.dataTransfer.getData('text');
		var elt = document.getElementById(id)
		
		// idが 'i' で始まる要素(選択肢欄からのドロップ)か調べる
		if(id[0] == 'i'){
			
			//元選択肢のクローンを生成
			//クローンのidを新しく設定
			//設定するidは c+ドロップされた番号+元id
			elt = elt.cloneNode(true);
			elt.id = 'c' + idc++ + id;
			
			//キャンバスへ要素を追加
			canvas.appendChild(elt);
		}
	}
}

//--------------------------------------------------
//
//
//--------------------------------------------------
function removeItem(){
	bdy = document.getElementById('waku3');
	bdy.ondragover = prev;
	bdy.ondrop = function(e) {
		var id = e.dataTransfer.getData('text');
		var elt = document.getElementById(id);
		
		if(id[0]=='c'){
			elt.parentElement.removeChild(elt);
		}
	}	
}

function prev(e) {
	if(e.preventDefault) {
		e.preventDefault();
	}
}