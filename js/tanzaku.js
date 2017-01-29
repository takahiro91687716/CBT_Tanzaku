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
	}
	canvasAction();
	removeItem();
}

//--------------------------------------------------
//一つの問いを作成する関数
//
//--------------------------------------------------
function buildQuestion(question){
	var textList = question.getElementsByTagName('text');
	var itemList = question.getElementsByTagName('item');
	
	//問題要素を表示する領域の生成
	buildArea();
	
	//問題文埋め込み
	document.getElementById("text"+num).innerHTML += "<p>" + textList[0].childNodes[0].nodeValue + "</p>";
	
	//選択肢埋め込み
	for(i = 0; i < itemList.length; i++) {
		var str = "<div id= \"i"+ i +"\"";
		str +=" class= \"i"+ i +"\""; //クラスは、イベントハンドラでidだと同名のものを識別できないから使った
		str += "draggable = \"true\""; //ドラッグできるように
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
	answer+= "<div id=\""+num+"\">";
	answer+= "<div id=\"canvas"+num+"\" class=\"canvas\"></div>";
	answer+= "</div>";
	answer+= "</div>";
	area.innerHTML += answer;
	
	//選択肢領域の生成
	var choices = "<h3>選択肢</h3>";
	choices+= "<div id=\"waku3\">";
	choices+= "<div id=\""+num+"\">"; //問題番号
	choices+= "<div id=\"choices"+num+"\" class=\"choices\"></div>";
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
	var tmp = [e.target.parentElement.parentElement.id,e.target.id];
	e.dataTransfer.setData('text/html',tmp);
}

//キャンバスの処理
idc = 0;
function canvasAction(){
	var canvas = document.getElementsByClassName('canvas');
	
	for(var i =0;i<canvas.length;i++){
		canvas[i].ondragover = prev;
		canvas[i].ondrag=prev;
		
		// キャンバスにドロップされた場合に発火
		canvas[i].ondrop = function(e){
		
			// ドロップされた選択肢の取得
			// Stringの"親の親id,選択肢id"状態なので、","で分割
			var id = e.dataTransfer.getData('text/html').split(",");
			var elt = document.getElementsByClassName(id[1])[id[0]];
			
			//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			//このfor文だと解答欄領域を選ばず
			//ドロップできてしまうので
			//考え直さないといけない
			//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			for(var j =0;j<3;j++){
				if(id[0] == j){
					
					// idが 'i' で始まる要素(選択肢欄からのドロップ)か調べる
					if(id[1][0] == 'i'){
						//元選択肢のクローンを生成
						//クローンのidを新しく設定
						//設定するidは c+ドロップされた番号+元id
						elt = elt.cloneNode(true);
						elt.id = 'c' + idc++ + id[1];
						
						//キャンバスへ要素を追加
						canvas[j].appendChild(elt);
					}
				}
			}
		}
	}
}

//--------------------------------------------------
//
//
//--------------------------------------------------
function removeItem(){
	var choices = document.getElementsByClassName('choices');
	for(var i =0;i<choices.length;i++){
		choices[i].ondragover = prev;
		choices[i].ondrop = function(e) {
			var id = e.dataTransfer.getData('text/html').split(",");
			var elt = document.getElementById(id[1]);
			
			if(id[1][0]=='c'){
				elt.parentElement.removeChild(elt);
			}
		}
	}
}

function prev(e) {
	if(e.preventDefault) {
		e.preventDefault();
	}
}