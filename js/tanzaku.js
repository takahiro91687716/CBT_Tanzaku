//XMLHttpRequestオブジェクトを生成
var xhr = new XMLHttpRequest();

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
	document.getElementById("choices").innerHTML += "<h3>選択肢<h3>";
	for(i = 0; i < itemList.length; i++) {
		document.getElementById("choices").innerHTML += "<div id= item"+ i +">";
		document.getElementById("choices").innerHTML += itemList[i].childNodes[0].nodeValue + "</div>";
	}
}

//--------------------------------------------------
//
//
//--------------------------------------------------
function buildAnswerArea(){
	
	
	
}