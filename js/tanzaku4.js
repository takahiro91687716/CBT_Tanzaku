//XMLHttpRequestオブジェクトを生成
var xhr = new XMLHttpRequest();

//問題数
var num = 0;
//選択肢数
var cnum = 0;
var cnums = [];

//選択肢の記号セット
var initial1 = ["あ","い","う","え","お","か","き","く","け","こ","さ","し","す","せ","そ"];
var initial2 = ["ア","イ","ウ","エ","オ","カ","キ","ク","ケ","コ","サ","シ","ス","セ","ソ"];
var initial3 = ["い","ろ","は","に","ほ","へ","と","ち","り","ぬ","る","を","わ","か","よ"];
var initial4 = ["a.","b.","c.","d.","e.","f.","g.","h.","i.","j.","k.","l.","m.","n.","o."];
var initial5 = ["1.","2.","3.","4.","5.","6.","7.","8.","9.","10.","11.","12.","13.","14.","15."];

//問題ファイル
var question = null;

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

	for(num; num < question.length;num++){
		buildQuestion(num);
	}

	//全解答欄でアクション指定
	var canvas = document.getElementsByClassName("littleCanvas");
	for(var i = 0; i < canvas.length ; i++){
		canvasAction(canvas[i]);
	}

	//全解答欄でアクション指定
	var choices = document.getElementsByClassName("choices");
	for(var i = 0; i < choices.length ; i++){
		removeItem(choices[i]);
	}
}

//--------------------------------------------------
// "(number)問目"を作成する関数
//
//--------------------------------------------------
function buildQuestion(number){
	var textList = question[number].getElementsByTagName('text');
	var itemList = question[number].getElementsByTagName('item');

	//問題要素を表示する領域の生成
	buildArea(number);

	//問題文埋め込み
	document.getElementById("text"+num).innerHTML += "<p>" + textList[0].childNodes[0].nodeValue + "</p>";

//解答欄埋め込み
for(i = 0; i < itemList.length; i++) {
	var str = "<div id= \"a-"+ number + "-" + i + "\"";
	str += "class=\"littleCanvas\">";//クラスはLittleCanvasにしてる***************************************************
	str += "</div>";
	document.getElementById("canvas"+number).innerHTML += str;
}

	//選択肢埋め込み
	for(i = 0; i < itemList.length; i++) {
		var str = "<div id= \"i-"+ number + "-" + i + "\"";//idは(i,問題番号,選択肢何個目)
		str += "draggable = \"true\""; //ドラッグできるように
		str += "ondragstart=\"itemDragStart(event)\">" ;
		str += buildChoicesParts(itemList[i]);
		str += "</div>";
		document.getElementById("choices"+number).innerHTML += str;
	}

	//選択肢数を換算
	cnums[num] = cnum;
}

//--------------------------------------------------
//一つの問いの構成要素を設置する
//
//--------------------------------------------------
function buildArea(number){
	var area = document.getElementById("area");

	//問題文領域の生成
	var question = "<h3>問題 ("+(number+1)+")</h3>";//問目だから+1してる
	question+= "<div id=\"waku1\">";
	question+= "<div id=\"text"+number+"\"></div>";
	question+= "</div>";
	area.innerHTML += question;

	//解答欄領域の生成
	var answer = "<h3>解答欄</h3>";
	answer+= "<div id=\"waku2\">";
	answer+= "<div id=\"canvas"+number+"\" class=\"canvas\"></div>";
	answer+= "</div>";
	answer+= "</div>";
	area.innerHTML += answer;

	//選択肢領域の生成
	var choices = "<h3>選択肢</h3>";
	choices+= "<div id=\"waku3\">";
	choices+= "<div id=\"choices"+number+"\" class=\"choices\"></div>";
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
function canvasAction(canvas){

	canvas.ondragover = prev;
	canvas.ondrag=prev;

	// キャンバスにドロップされた場合に発火
	canvas.ondrop = function(e){

		//canvasId[0]：選択肢識別用 a
		//canvasId[1]：問題番号識別用 問題番号
		//canvasId[2]：解答欄識別用 解答欄番号
		var canvasId = this.id.split("-");

		// ドロップされた選択肢の取得
		// Stringの"親の親id,選択肢id"状態なので、","で分割
		var itemId0 = e.dataTransfer.getData('text/html')

		//itemId1[0]：選択肢識別用 i
		//itemId1[1]：問題番号識別用 問題番号
		//itemId1[2]：選択肢番号識別用 選択肢番号
		//or
		//itemId1[0]：選択肢識別用 c
		//itemId1[1]：解答済み選択肢識別用 idc (重複無しのため)
		//itemId1[2]：問題番号識別用 問題番号
		//itemId1[3]：選択肢番号識別用 選択肢番号
		//itemId1[4]：解答欄識別用 解答欄番号
		var itemId1 = itemId0.split("-");
		var elt = document.getElementById(itemId0);

		// idが 'i' で始まる要素(選択肢欄からのドロップ)か調べる
		if(itemId1[0] == 'i'){
			//問題番号合っているか調べる
			if(canvasId[1] == itemId1[1]){

				//解答済みでないことを調べている
				if(canvas.childElementCount != 0){
					canvas.textContent = null;//子を消す
				}

				//元選択肢のクローンを生成
				//クローンのidを新しく設定
				//設定するidは c+ドロップされた番号+元id
				elt = elt.cloneNode(true);
				elt.id = 'c-' + idc++ +"-"+ itemId1[1]+"-"+itemId1[2]+"-"+canvasId[2];

				//キャンバスへ要素を追加
				canvas.appendChild(elt);
			}
		}else{
			//idが 'i' で始まらない要素、つまり、// 'c'の場合(解答欄からのドロップ)

			//問題番号合っているか調べる
			if(canvasId[1] == itemId1[2]){

				//canvasId[2]とitemId1[4]の要素を入れかえる、つまり
				//a-問題番号-canvasId[2]の子とa-問題番号-itemId1[4]をswap
				var tmpElt = canvas.childNodes[0];

				elt.id = itemId1[0]+"-"+itemId1[1]+"-"+itemId1[2]+"-"+itemId1[3]+"-"+canvasId[2];//解答欄は変えておく
				canvas.appendChild(elt);//移動だからクローンの必要無し

				//落としたところに既に要素が存在していた場合
				if(tmpElt != null){
					var tmpId = tmpElt.id.split("-");//元要素のidを取っておく
					//もってきた選択肢のもともとの解答欄に
					var swapTo = document.getElementById("a"+"-"+itemId1[2]+"-"+itemId1[4]);
					tmpElt.id = tmpId[0]+"-"+tmpId[1]+"-"+tmpId[2]+"-"+tmpId[3]+"-"+itemId1[4];//解答欄は変えておく
					swapTo.appendChild(tmpElt);
				}

			}
			}
		}
	}

//--------------------------------------------------
//
//
//--------------------------------------------------
function removeItem(choice){
	choice.ondragover = prev;
	choice.ondrop = function(e) {
		choiceId = this.id.split("-");
		var itemId0 = e.dataTransfer.getData('text/html');
		var itemId1 = itemId0.split("-");
		var elt = document.getElementById(itemId0);

		if(itemId1[0]=='c'){//解答済みならば
			elt.parentElement.removeChild(elt);
		}
	}
}

function prev(e) {
	if(e.preventDefault) {
		e.preventDefault();
	}
}
