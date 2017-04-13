//XMLHttpRequestオブジェクトを生成
var xhr = new XMLHttpRequest();

//問題数
var num = 0;
//選択肢数
var cnum = 0;
var cnums = [];

//解答欄に設置済みの選択肢
var dropped = [];

//選択肢の記号セット
var initial1 = ["あ","い","う","え","お","か","き","く","け","こ","さ","し","す","せ","そ"];
var initial2 = ["ア","イ","ウ","エ","オ","カ","キ","ク","ケ","コ","サ","シ","ス","セ","ソ"];
var initial3 = ["い","ろ","は","に","ほ","へ","と","ち","り","ぬ","る","を","わ","か","よ"];
var initial4 = ["a.","b.","c.","d.","e.","f.","g.","h.","i.","j.","k.","l.","m.","n.","o."];
var initial5 = ["1.","2.","3.","4.","5.","6.","7.","8.","9.","10.","11.","12.","13.","14.","15."];

//解答中問題番号
var currentQuestion = 0;

//問題一覧
var question;

//文字サイズ（入れ替えに使う）
var blank = 5;
var offsetX = 0;
var offsetY = 0;

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

}

//--------------------------------------------------
//ページ全体に問いを配置する関数
//
//--------------------------------------------------
function buildQuestions(HttpObj){
	var resHTTP = HttpObj.responseXML;
	question = resHTTP.getElementsByTagName('question');

	//問題要素を表示する領域の生成
	buildArea();

	//問題セットの初期化
	setSelectQuestion(1);

	//問題数に応じた多次元配列の作成
	for(var i = 0; i < question.length ; i++){
		dropped[i] = [];
	}

	canvasAction();
	removeItem();
	getPosition();
}


//--------------------------------------------------
//選択した番号の問題に変える
//
//--------------------------------------------------
function setSelectQuestion(select){

	var textList = question[select].getElementsByTagName('text');
	var itemList = question[select].getElementsByTagName('item');

	//1)変える前の問題の解答情報を保持する動作************************************************
	//2)選択した問題に解答情報があれば、呼び出す**********************************************

	//問題文を選択中のものへ
	document.getElementById("text").innerHTML = "<p>" + textList[0].childNodes[0].nodeValue + "</p>";


	//選択肢埋め込み
	document.getElementById("choices").innerHTML = "";//一旦クリア
	for(i = 0; i < itemList.length; i++) {
		var str = "<div id= \"i-"+ cnum++ +"\"";
		str += "draggable = \"true\""; //ドラッグできるように
		str += "ondragstart=\"itemDragStart(event)\">" ;
		str += buildChoicesParts(itemList[i]);
		str += "</div>";
		document.getElementById("choices").innerHTML += str;
	}

	currentQuestion = select;
}

//--------------------------------------------------
//一つの問いの構成要素を設置する
//
//--------------------------------------------------
function buildArea(){
	var area = document.getElementById("area");

	//問題文領域の生成
	var question = "<h3>問題 ("+(currentQuestion+1)+")</h3>";
	question+= "<div id=\"waku1\">";
	question+= "<div id=\"text\"></div>";
	question+= "</div>";
	area.innerHTML += question;

	//解答欄領域の生成
	var answer = "<h3>解答欄</h3>";
	answer+= "<div id=\"waku2\">";
	answer+= "<div id=\"canvas\"></div>";
	answer+= "</div>";
	answer+= "</div>";
	area.innerHTML += answer;

	//選択肢領域の生成
	var choices = "<h3>選択肢</h3>";
	choices+= "<div id=\"waku3\">";
	choices+= "<div id=\"choices\"></div>";
	choices+= "</div>";
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
	var str = item.childNodes[0].nodeValue;

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
	e.dataTransfer.setData('text/html',e.target.id);
}

//キャンバスの処理
var idc = 0;
function canvasAction(){
	var canvas = document.getElementById('canvas');

	canvas.ondragover = prev;
	canvas.ondrag=prev;

	// キャンバスにドロップされた場合に発火
	canvas.ondrop = function(e){
		// ドロップされた選択肢の取得
		// Stringの"親の親id,選択肢id"状態なので、","で分割

		var id = e.dataTransfer.getData('text/html').split("-");
		var elt = document.getElementById(id[0]+"-"+id[1]);

		// idが 'i' で始まる要素(選択肢欄からのドロップ)か調べる
		if(id[0] == 'i'){

			//元選択肢のクローンを生成
			//クローンのidを新しく設定
			//設定するidは c+ドロップされた番号+元id

			elt = elt.cloneNode(true);
			elt.id = 'c-' + idc++ + id[0]+"-"+id[1];

			//キャンバスへ要素を追加
			canvas.appendChild(elt);
		}else{
			// idが 'i' で始まらない要素、つまり、
			// 'c'の場合(解答欄からのドロップ)
			alert(Math.floor( offsetY ));
		}
	}
}

//整列
function tuneLine(){

}

//要素の入れ替え
function swapElement(){

}

//--------------------------------------------------
//
//
//--------------------------------------------------
function removeItem(){
	var choices = document.getElementById('choices');

	choices.ondragover = prev;
	choices.ondrop = function(e) {

		var id = e.dataTransfer.getData('text/html').split("-");
		var elt = document.getElementById(id[0]+"-"+id[1]+"-"+id[2]);

		if(id[0]=='c'){
			elt.parentElement.removeChild(elt);
		}
	}
}

function getPosition(){
// マウスイベントを設定
var mouseEvent = function( e ) {
	// 動作を停止
	e.preventDefault() ;

	// マウス位置を取得する
	var mouseX = e.pageX ;	// X座標
	var mouseY = e.pageY ;	// Y座標

	// 要素の位置を取得
	var element = document.getElementById( "canvas" ) ;
	var rect = element.getBoundingClientRect() ;

	// 要素の位置座標を計算
	var positionX = rect.left + window.pageXOffset ;	// 要素のX座標
	var positionY = rect.top + window.pageYOffset ;	// 要素のY座標

	// 要素の左上からの距離を計算
	offsetX = mouseX - positionX ;
	offsetY = mouseY - positionY ;
}

var element = document.getElementById( "canvas" ) ;
//element.addEventListener( "mouseup", mouseEvent ) ;
element.addEventListener( "mousemove", mouseEvent ) ;
}

function prev(e) {
	if(e.preventDefault) {
		e.preventDefault();
	}
}
