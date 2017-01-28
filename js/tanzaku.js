//XMLHttpRequestオブジェクトを生成
var xhr = new XMLHttpRequest();
//問題数
var num = 0;

//--------------------------------------------------
//
//
//--------------------------------------------------
function requestFile(method, fname, async) {
	//openメソッドでXMLファイルを開く
	xhr.open(method, fname, async);
	//xhr.setRequestHeader("content-type",'text/xml');
	
	//無名functionによるイベント処理
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			buildQuestions(xhr);
		}
	}
	xhr.send();
	
	//buildQuestions呼び出し前の可能性があり、
	//canvasなどが取得できない
// 	for(i=0;i<num;i++){
// 		canvasAction(i);
// 		removeItem(i);
// 	}
}

//--------------------------------------------------
//ページ全体に問いを配置する関数
//
//--------------------------------------------------
function buildQuestions(HttpObj){
	var resHTTP = HttpObj.responseXML;
	var question = resHTTP.getElementsByTagName('question');
	
	for(num; num < question.length;num++){
		buildQuestion(question[num]);
		//canvasAction(num);
		//removeItem(num);
	}
}

//--------------------------------------------------
//一つの問いを作成する関数
//
//--------------------------------------------------
function buildQuestion(question){
	textList = question.getElementsByTagName('text');
	itemList = question.getElementsByTagName('item');
	
	//問題要素を表示する領域の生成
	buildArea();
	
	//問題文埋め込み
	document.getElementById("text"+num).innerHTML += "<p>" + textList[0].childNodes[0].nodeValue + "</p>";
	
	//選択肢埋め込み
	for(i = 0; i < itemList.length; i++) {
		var str = "<div id= \"i"+ i +"\"";
		str += "class = \""+num+"\"";
		str += "draggable = \"true\"";
		str += "ondragstart=\"itemDragStart(event)\">" ;
		str += buildChoicesParts(itemList[i]);
		str += "</div>";
		document.getElementById("choices"+num).innerHTML += str;
	}
}

//--------------------------------------------------
//一つの問いの構成要素を設置する
//
//--------------------------------------------------
function buildArea(){
	var area = document.getElementById("area");
	
	//問題文領域の生成
	var question = "<h3>問題 ("+(num+1)+")</h3>";
	question+= "<div id=\"waku1\">";
	question+= "<div id=\"text"+num+"\"></div>";
	question+= "</div>";
	area.innerHTML += question;
	
	//解答欄領域の生成
	var answer = "<h3>解答欄</h3>";
	answer+= "<div id=\"waku2\">";
	answer+= "<div id=\"canvas\" class=\""+num+"\"></div>";
	answer+= "</div>";
	area.innerHTML += answer;
	
	//選択肢領域の生成
	var choices = "<h3>選択肢</h3>";
	choices+= "<div id=\"waku3\">";
	choices+= "<div id=\"choices\" class=\""+num+"\"></div>";
	choices+= "</div>";
	area.innerHTML += choices;
	
	//区切り
	area.innerHTML+= "<hr>";
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
function canvasAction(numb){
	canvas = document.getElementById('canvas'+numb);
	
	canvas.ondragover = prev;
	canvas.ondrag=prev;
	
	// キャンバスにドロップされた場合に発火
	canvas.ondrop = function(e){
		
		// ドロップされた選択肢の取得
		id = e.dataTransfer.getData('text');
		var elt = document.getElementById(id);
		
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
function removeItem(numb){
	bdy = document.getElementById('choices'+numb);
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