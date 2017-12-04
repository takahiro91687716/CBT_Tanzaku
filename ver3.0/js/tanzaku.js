//XMLHttpRequestオブジェクトを生成
var xhr = new XMLHttpRequest();

//問題ファイル
var question = null;


//--------------------------------------------------
//xmlのopen ページロードで発火させる
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
//--------------------------------------------------
function buildQuestions(HttpObj){
	//xmlからquestion tagのついている内容を取得
	var resHTTP = HttpObj.responseXML;
	question = resHTTP.getElementsByTagName('question');

	for(var number = 0; number < question.length;number++){
		buildQuestion(number);
	}

	// document.getElementById("answerArea-0").ondragover = prev;
	// document.getElementById("answerArea-0").ondrag = prev;
	// document.getElementById("answerArea-0").ondrop = dropToAnswerArea;

	for(var i = 0; i < question.length; i ++){
		document.getElementById("answerArea-"+i).ondragover = prev;
		document.getElementById("answerArea-"+i).ondrag = prev;
		document.getElementById("answerArea-"+i).ondrop = dropToAnswerArea;
	}

	var area = document.getElementById("area");
	area.ondragover = prev;
	area.ondrag = prev;
	area.ondrop = trashItem;
}

//--------------------------------------------------
// "(number)問目"を作成する関数
//--------------------------------------------------
var tanzakuOrigin = document.createElement("div");
tanzakuOrigin.draggable = true;

function buildQuestion(number){
	var textList = question[number].getElementsByTagName('text');
	var itemList = question[number].getElementsByTagName('item');

	//問題要素を表示する領域の生成
	buildArea(number);

	//問題文埋め込み
	document.getElementById("question-"+number).innerHTML += "<p>" + textList[0].childNodes[0].nodeValue + "</p>";

	//選択肢埋め込み
	for(i = 0; i < itemList.length; i++) {
		// var newTanzaku = tanzakuOrigin.cloneNode(true);
		// newTanzaku.id = "i-" + number + "-" + i;
		// newTanzaku.classList.add("tanzaku");
		// newTanzaku.ondragstart = itemDragStart;
		// newTanzaku.innerHTML += buildChoiceParts(itemList[i],number,i);
		// document.getElementById("tanzakuArea-"+number).appendChild(newTanzaku);
		var tanzakuArea = document.getElementById("tanzakuArea-"+number);
		var newBox = document.createElement("div");
		newBox.id = "box-" + number + "-" + i;
		newBox.classList.add("box");

		//
		// var str = "";
		// str += "<div id= \"i-" + number + "-" + i + "\" class=\"tanzaku\" ";
		// str += "draggable=\"true\" ";
		// str += "ondragstart=\"itemDragStart(event)\">";
		// str += buildChoiceParts(itemList[i],number,i);
		// str += "</div>\n";
		// newBox.innerHTML += str;
		//

		tanzakuArea.appendChild(newBox);
		newBox.innerHTML += createTanzaku2(itemList[i],number,i)
	}
}

//DOMだとドラッグ処理が受け継がれない？？
function createTanzaku(item,number,i){
	var newTanzaku = document.createElement("div");
	var unique = item.getAttributeNode("unique")
	if(unique != null && unique.value == "true"){
		newTanzaku.id = "ii-" + number + "-" + i;
		newTanzaku.classList.add("tanzaku");
		newTanzaku.classList.add("unique");
	}else{
		newTanzaku.id = "i-" + number + "-" + i;
		newTanzaku.classList.add("tanzaku");
		newTanzaku.classList.add("normal");
	}
	newTanzaku.innerHTML += buildChoiceParts(item,number,i);
	newTanzaku.draggable = true;
	newTanzaku.ondragstart = itemDragStart;
	return newTanzaku;
}

function createTanzaku2(item,number,i){
	var str = "<div id= \"";
	var unique = item.getAttributeNode("unique")
	if(unique != null && unique.value == "true"){
		str += "ii-" + number + "-" + i +"\" ";
		str += "class=\"tanzaku unique\" ";
	}else{
		str += "i-" + number + "-" + i + "\" ";
		str += "class=\"tanzaku normal\" ";
	}
	str += "draggable=\"true\" ";
	str += "ondragstart=\"itemDragStart(event)\">";
	str += buildChoiceParts(item,number,i);
	str += "</div>";

	return str;
}

//--------------------------------------------------
// １題の構成要素を設置する
//--------------------------------------------------
function buildArea(number){
	var area = document.getElementById("area");

	//問題文領域の生成
	area.innerHTML += buildQuestionArea(number);

	//解答欄領域の生成
	area.innerHTML += buildAnswerArea(number);
	console.log("--"+(number+1)+"問目のイベント設定");
	// document.getElementById("answerArea-"+number).ondragover = prev;
	// document.getElementById("answerArea-"+number).ondrag = prev;
	// document.getElementById("answerArea-"+number).ondrop = dropToAnswerArea;

	//選択肢領域の生成
	area.innerHTML += buildTanzakuArea(number);

	//問題区切り
	area.innerHTML+= "<br>";
}

function setAnswerAreaAction(answerArea){
	answerArea.ondragover = prev;
	answerArea.ondrag = prev;
	answerArea.ondrop = dropToAnswerArea;
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// １題を構成するＨＴＭＬ要素を作成する
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//-----------------------------
// 問題文の表示を行う領域を作成する
//-----------------------------
function buildQuestionArea(number){
	var str = "";
	str += "<div class=\"waku titleWaku\">";
	str +=  "<div class=\"caption captionForTitle\">";
	str +=   "<h3>問題 "+ ( number + 1 ) +"</h3>";
	str +=   "<button type=\"button\" class=\"executeButton\" onclick=\"runCode("+number+")\">プログラム実行</button>";
	str +=  "</div>";
	str +=  "<div id=\"question-"+number+"\">";
	str +=  "</div>";
	str += "</div>";
	console.log("問題"+(number+1)+"の問題文");
	console.log(str);
	return str;
}

//-----------------------------
// 解答欄の表示を行う領域を作成する
//-----------------------------
function buildAnswerArea(number){
	var str = "";
	str += "<div class=\"waku answerWaku\">";
	str +=  "<div class=\"caption captionForAnswer\">";
	str +=   "<h3>解答欄</h3>";
	str +=  "</div>";
	str +=  "<div class=\"fixedAnswerArea\">";
	str +=   "<div id=\"answerArea-"+number+"\" class=\"answerArea\" >";
	str +=   "</div>";
	str +=  "</div>";
	str += "</div>";
	console.log("問題"+(number+1)+"の解答欄");
	console.log(str);
	return str;
}

//-----------------------------
// 選択肢の表示を行う領域を作成する
//-----------------------------
function buildTanzakuArea(number){
	var str = "";
	str += "<div class=\"waku tanzakuWaku\">";
	str +=  "<div class=\"caption captionForTanzaku\">";
	str +=   "<h3>選択肢欄</h3>";
	str +=  "</div>";
	str +=  "<div id=\"tanzakuArea-"+number+"\">";
	str +=  "</div>";
	str += "</div>";
	console.log("問題"+(number+1)+"の選択肢欄");
	console.log(str);
	return str;
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ＸＭＬで記述された短冊をＨＴＭＬ表示形式に変換する
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function buildChoiceParts(item,number,j){
	var str = item.childNodes[0].nodeValue;
	//return pickBrace(str,number,j);
	return pickNormal(str);
}

var numOfForm = 0;
function pickNormal(str){
	var numOfNormal = 0;
	var numOfBrace = 0;

	var brace = str.match(/\{text\:.*?\}|\{number\:.*?\}|\{pullDown\:.*?\}/g);
	console.log(brace);
	if(brace){
		numOfBrace = brace.length;
	}

	for(var i = 0; i < numOfBrace; i++){
		str = str.replace(brace[i],"(@brace"+i+")");
	}

	//普通の文字をDOMにする ******braceより先にやらないと"="などに対応できない
	var normal = str.split(/\(@brace\d\)/);
	if(normal){
		numOfNormal = normal.length;
	}

	for(var i = 0; i < str.length ; i++){
		str = str.replace(normal[i],"<span>"+normal[i]+"</span>");
	}

	//braceを変換していく
	for(var i = 0; i < numOfBrace; i++){
		// { }を取り除く
		var target = brace[i].substring(1, brace[i].length - 1).split(":");
		var tmp = "<form name = \""+ numOfForm++ +"\"  style=\"display: inline\">";
		if(target[0].includes("text")){
			tmp += "<input type=text name=\"keyboard\" style=\"width:30px;\""
			if(target[1]){
				tmp += " value=" + target[1];
			}
			tmp += ">";
		}else if(target[0].includes("number")){
			console.log("hit");
			tmp += "<input type=number name=\"keyboard\" style=\"width:30px;\""
			if(target[1]){
				tmp += " value=" + target[1];
			}
			tmp += ">";
		}else{
			var selectList = target[1].split(",");
			tmp += "<select name=\"pd\">";
			for(var j = 0; j < selectList.length;j++){
				tmp += "<option value = \""+selectList[j]+"\">"+selectList[j]+"</option>";
			}
			tmp += "</select>";
		}
		tmp += "</form>"
		console.log(str);
		str = str.replace("(@brace"+i+")",tmp);
	}

	return str;
}

function searchNormal(str){
	var normal = [];
	var braceFlug = false;

	//alert(str.length);
	for(var i = 0; i < str.length;i++){
		//alert();
		if(str.charAt(i) != "{"){
			//console.log();(i);
			var tmp = "";
			for(var j = i; j < str.length;j++){
				//console.log(j);
				if(str.charAt(j) == "{"){
					//console.log("break")
					break;
				}
				tmp += str.charAt(j);
				i = j;
			}
			normal.push(tmp);
		}else{
			for(var j = i; j < str.length;j++){
				if(str.charAt(j) == "}"){
					i = j++;
					break;
				}
				// "{あいうえお"みたいな時にも対応するようにしなければならない！！！！！！！！！！！！！！！！！！！！！！
			}
		}
	}
	return normal;
}

function pickBrace(str,number,j){
	//最短マッチで探す
	var seq = str.match(/\{(.*?)\}/g);
	var regExp = null;

	//普通のも探す
	var normal = searchNormal(str).concat();

	//普通の文字をDOMにする ******braceより先にやらないと"="などに対応できない
	//console.log(normal);
	if(normal){
		for(var i = 0; i < normal.length;i++){
			//console.log(i +",,,,,,,"+ normal[i]);
			//console.log(str.includes(normal[i])+"...."+str);
			//gいらんかも
			//regExp = new RegExp(normal[i], "g");
			str = str.replace(normal[i],"<span>"+normal[i]+"</span>");
			//str.replace("整数","<span>"+normal[i]+"</span>");
		}
	}

	//{}を置き換える
	if(seq){
		for(var i = 0; i < seq.length;i++){
			var target = seq[i].substring(1, seq[i].length - 1);
			var pull = target.split(",");
			var result = "";

			if(1 < pull.length){
				result = buildBrace(pull,number,j);
			}else if(target == ""){
				result = "<form name = \""+number+"-"+j+"\"  style=\"display: inline\"><input type=text name=\"keyboard\" style=\"width:30px;\"></form>";
			}else if(target == "number"){
				result = "<form name = \""+number+"-"+j+"\"  style=\"display: inline\"><input type=number name=\"keyboard\" style=\"width:30px;\"></form>";
			}else{//いらんかも↓
				result = "<span>"+ seq[i]+"</span>";
			}
			regExp = new RegExp("{"+target+"}", "g");
			str = str.replace( regExp , result) ;
		}
	}

	return str;
}

//フォームの区別用
var forms = 0;
function buildBrace(choices,number,j){

	var text = "<form name = \""+number+"-"+j+"-"+forms++ +"\"  style=\"display: inline\"><select name=\"pd\">";

	for(var i = 0; i < choices.length;i++){
		text += "<option value = \""+choices[i]+"\">"+choices[i]+"</option>";
	}

	text += "</select></form>";
	return text;
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ドラッグドロップによる解答イベント処理
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//-----------------------------
// ドラッグ開始処理
// ・要素のＩＤをセットする
//-----------------------------
function itemDragStart(e) {
	console.log(e.target);
	e.dataTransfer.setData('text/html',e.target.id);
}

//-----------------------------
// 解答欄へドロップされた時の処理
// ・新規追加（最下）と最下への挿入
//-----------------------------
var trashFlug = true;
function dropToAnswerArea(e){
	trashFlug = false;
	if(!canvasCall){
		console.log("ドロップ：解答欄");
		var id = e.dataTransfer.getData("text/html",e.target.id);
		var idElm = id.split("-");

		// (1) 選択肢欄からの要素の場合
		// idElm[0] ： 識別子 "i"
		// idElm[1] ： 問題番号
		// idElm[2] ： 選択肢番号

		// (2) 解答欄からの要素の場合
		// idElm[0] ： 識別子 "c"
		// idElm[1] ： 問題番号
		// idElm[2] ： 選択肢番号
		// idElm[3] ： 解答済み番号

		var to = document.getElementById("answerArea-"+idElm[1]).childElementCount;

		if(idElm[0] == "i"||idElm[0] == "ii"){
			// 選択肢欄からの要素の処理
			console.log("新規追加："+ "answerArea-"+idElm[1]);
			addAnswer(id,to);
		}else if(idElm[0] == "c"||idElm[0] == "ci"){
			// 解答欄からの要素の処理
			var insert = document.getElementById(id);
			var from = insert.parentElement.id.split("-")[2];
			// 要素増えないので to は -1 しておく
			insertLower(from,(to-1),idElm[1]);
		}
		indent(idElm[1]);
	}else{
		canvasCall = false;
	}
}

//-----------------------------
// キャンバスへドロップされた時の処理
// ・新規追加（挿入）と並び替え
//-----------------------------
var canvasCall = false;
function dropToCanvas(e){
	canvasCall =true;
	console.log("ドロップ：キャンバス");
	var id = e.dataTransfer.getData("text/html",e.target.id);
	var idElm = id.split("-");

	// (1) 選択肢欄からの要素の場合
	// idElm[0] ： 識別子 "i"
	// idElm[1] ： 問題番号
	// idElm[2] ： 選択肢番号

	// (2) 解答欄からの要素の場合
	// idElm[0] ： 識別子 "c"
	// idElm[1] ： 問題番号
	// idElm[2] ： 選択肢番号
	// idElm[3] ： 解答済み番号

	var canvasId = this.id;
	var canvasIdElm = canvasId.split("-");

	// (3) canvasの情報
	// canvasIdElm[0] 識別子 "canvas"
	// canvasIdElm[1] 問題番号
	// canvasIdElm[2] 解答番号

	var to = canvasIdElm[2];

	// 置いた時点のカーソル位置
	var mouseY = e.clientY;
	// 置かれた canvas での評価基準座標
	var divClientRect = this.getBoundingClientRect();
	var harfOfdiv = divClientRect.height/2;
	var elmY = divClientRect.top+harfOfdiv;

	if(idElm[0] == "i"||idElm[0] == "ii"){
		// 選択肢欄からの要素の処理
		console.log("新規追加");

		if(mouseY<elmY){
	    //上半分に落とされた時

	    console.log("上半分に落とされました");
	    addAnswer(id,this.id.split("-")[2]);
	  }else if(elmY<=mouseY){
	    //下半分に落とされた時

			console.log("下半分に落とされました");
	    addAnswer(id,(Number(this.id.split("-")[2])+1));
	  }
	}else if(idElm[0] == "c"||idElm[0] == "ci"){
		// 解答欄からの要素の処理
		console.log("要素移動");

		var insert = document.getElementById(id);
		var from = insert.parentElement.id.split("-")[2];

		if(mouseY<elmY){
	    //上半分に落とされた時
	    console.log("上半分に落とされました");
	    insertUpper(from,to,idElm[1]);
	  }else if(elmY<=mouseY){
	    console.log("下半分に落とされました");
	    //下半分に落とされた時
	    insertLower(from,to,idElm[1]);

	  }
	}
	indent(idElm[1]);
}

//-----------------------------
// 解答欄への要素の追加
// id     ： 追加要素の id
// number ： 追加場所
//-----------------------------
var idc = 0;
var canvasOrigin = document.createElement("div");
function addAnswer(id,number){
	var idElm = id.split("-");

	if(idElm[0] == "i"){
		var newAnswer = document.getElementById(id).cloneNode(true);
		newAnswer.id = "c-" + idElm[1] + "-" + idElm[2] + "-" + idc++;
	}else if(idElm[0] == "ii"){
		var newAnswer = document.getElementById(id);
		newAnswer.id = "ci-" + idElm[1] + "-" + idElm[2] + "-" + idc++;
	}
	newAnswer.classList.add("answer");

	var answerArea = document.getElementById("answerArea-"+idElm[1]);

	// 解答済み選択肢数
	var numOfAnswer = answerArea.childElementCount;

	// 追加場所をつくる
	var newCanvas = canvasOrigin.cloneNode(true);
	newCanvas.id = "canvas-" + idElm[1] + "-" + numOfAnswer;
	newCanvas.ondragover = prev;
	newCanvas.ondrag = prev;
	newCanvas.ondrop = dropToCanvas;
	answerArea.appendChild(newCanvas);

	// number以降をずらしていく
	console.log(number+"番から"+(numOfAnswer-1)+"をずらして");
	for(var i = number; i < numOfAnswer ; i++){
		var to = document.getElementById("canvas-" + idElm[1] + "-" + ( Number(i) + 1 ));
		var elm = document.getElementById("canvas-" + idElm[1] + "-" + i).childNodes[0];
		to.appendChild(elm);
	}

	// 新しい解答の追加
	console.log("canvas-" + idElm[1] + "-" + number);
	document.getElementById("canvas-" + idElm[1] + "-" + number).appendChild(newAnswer);
}

//-----------------------------
// 解答欄への要素の追加
// id     ： 追加要素の id
// number ： 追加場所
//-----------------------------
function insertUpper(from,to,number){
  console.log(from+"から"+to);
  var insert = document.getElementById("canvas-"+number+"-"+from).childNodes[0];

  if(from<to){
    //上から下へ持ってきた時
    to--;
    for(var i = from; i < to ; i++){
      console.log("上から下へ持ってきました");
      console.log(i+"を動かす：to"+to+",from"+from);
      var tmpElt = document.getElementById("canvas-"+number+"-"+(Number(i)+1)).childNodes[0];

      document.getElementById("canvas-"+number+"-"+Number(i)).appendChild(tmpElt);
    }
  }else{
    //下から上へ持ってきた時、または同値
    for(var i = from; to < i; i--){
      console.log("下から上へ持ってきました");
      console.log(i+"を動かす：to"+to+",from"+from);
      var tmpElt = document.getElementById("canvas-"+number+"-"+(Number(i)-1)).childNodes[0];
      document.getElementById("canvas-"+number+"-"+Number(i)).appendChild(tmpElt);
    }
  }
  document.getElementById("canvas-"+number+"-"+to).appendChild(insert);
}

//-----------------------------
// 解答欄への要素の追加
// id     ： 追加要素の id
// number ： 追加場所
//-----------------------------
function insertLower(from,to,number){
  console.log(from+"から"+to);
  var insert = document.getElementById("canvas-"+number+"-"+from).childNodes[0];

  if(to<from){
    //下から上へ持ってきた時
    to++;
    for(var i = from; to < i; i--){
      console.log("下から上へ持ってきました");
      console.log(i+"を動かす：to"+to+",from"+from);
      var tmpElt = document.getElementById("canvas-"+number+"-"+(Number(i)-1)).childNodes[0];
      document.getElementById("canvas-"+number+"-"+Number(i)).appendChild(tmpElt);
    }
  }else{
    //上から下へ持ってきた時、または同値
    for(var i = from; i < to ; i++){
      console.log("上から下へ持ってきました");
      console.log(i+"を動かす：to"+to+",from"+from);
      var tmpElt = document.getElementById("canvas-"+number+"-"+(Number(i)+1)).childNodes[0];
      document.getElementById("canvas-"+number+"-"+Number(i)).appendChild(tmpElt);
    }
  }
  document.getElementById("canvas-"+number+"-"+to).appendChild(insert);
}

//-----------------------------
// 解答欄への要素の追加
// id     ： 追加要素の id
// number ： 追加場所
//-----------------------------
function trashItem(e){
	var id = e.dataTransfer.getData("text/html",e.target.id);
	var elmId = id.split("-");
	if(trashFlug){

		if(elmId[0] == "ci"){
			returnItem(document.getElementById(id));
		}else if(elmId[0] == "c"){
			removeItem(document.getElementById(id));
		}
		indent(elmId[1]);
	}else{
		trashFlug = true;
	}
}

//-----------------------------
// 解答欄への要素の追加
// id     ： 追加要素の id
// number ： 追加場所
//-----------------------------
function removeItem(rmElt){
	var rmNum = rmElt.parentElement.id.split("-");
	var answerArea = document.getElementById("answerArea-"+rmNum[1])
	console.log(rmNum[2]+"番を削除");
	rmElt.parentElement.removeChild(rmElt);

	for(var i = rmNum[2]; i < answerArea.childElementCount-1;i++){
		var elt = document.getElementById("canvas-"+rmNum[1]+"-"+(Number(i)+1)).childNodes[0];
		document.getElementById("canvas-"+rmNum[1]+"-"+i).appendChild(elt);
	}
	//余分な欄を消す
	console.log("canvas-"+rmNum[1]+"-"+(answerArea.childElementCount-1));
  answerArea.removeChild(document.getElementById("canvas-"+rmNum[1]+"-"+(answerArea.childElementCount-1)));
}

//-----------------------------
// 解答欄への要素の追加
// id     ： 追加要素の id
// number ： 追加場所
//-----------------------------
function returnItem(rtElt){
	var rtNum = rtElt.parentElement.id.split("-");
	var rtEltId = rtElt.id.split("-");
	var answerArea = document.getElementById("answerArea-"+rtNum[1])
	console.log(rtEltId[2]+"番を戻す");
	rtElt.id = "ii-" +rtEltId[1] +"-"+ rtEltId[2];
	rtElt.style.left = "0px";
	rtElt.classList.remove("answer");
	document.getElementById("box-"+rtEltId[1]+"-"+rtEltId[2]).appendChild(rtElt);

	for(var i = rtNum[2]; i < answerArea.childElementCount-1;i++){
		var elt = document.getElementById("canvas-"+rtNum[1]+"-"+(Number(i)+1)).childNodes[0];
		document.getElementById("canvas-"+rtNum[1]+"-"+i).appendChild(elt);
	}
	//余分な欄を消す
  answerArea.removeChild(document.getElementById("canvas-"+rtNum[1]+"-"+(answerArea.childElementCount-1)));
}

//-----------------------------
// 解答欄への要素の追加
// id     ： 追加要素の id
// number ： 追加場所
//-----------------------------
function prev(e) {
	if(e.preventDefault) {
		e.preventDefault();
	}
}

//-----------------------------
// 解答欄への要素の追加
// id     ： 追加要素の id
// number ： 追加場所
//-----------------------------
function indent(number){
	//インデントレベル
	var level = 0;
	//何問目か取得
	var answerArea = document.getElementById("answerArea-"+number);

	for(var i = 0; i < answerArea.childElementCount; i++){
		var canvas = answerArea.childNodes[i];
		level -= (canvas.textContent.match(/を実行する|を繰り返す|を実行し/g)||[]).length
		if(0 < level){
			canvas.childNodes[0].style.position = 'relative';
			canvas.childNodes[0].style.left = (level * 20)+ 'px';
		}else {
			canvas.childNodes[0].style.position = 'relative';
			canvas.childNodes[0].style.left = '0px';
			level = 0;
		}
		//次のレベルを増やしておく
		level += (canvas.textContent.match(/もし|の間|そうでなければ|そうでなければ|そうでなければ|そうでなければ|増やしながら|増やしながら|減らしながら|減らしながら/g)||[]).length;
	}
}



/**
number 問題番号
*/

function runCode(number){
	var counter = 0;
	var source = "";

	//input()の数を数える
  //「 } 」の数になるから重要
  var inputNum = 0;

	var htmlsource = window.open("", "", "scrollbars=yes, width=600, height=400");
	htmlsource.document.open();

	//実行コード配置位置までの script[] を設置
	for(var i = 0; i < scriptBefore.length; i++){
		source += scriptBefore[i];
	}

	// 実行コードを改行で分割する
	// 短冊の方では行で取得するのでいらない
	var codes = makeJS(number).split("\n");

	//実行コードの配置
	for(var i = 0; i < codes.length; i++){
		var tmpLine = "";

		//inputの処理
		if(codes[i].includes("input()")){
			tmpLine += "yield inputValueVirPage;\n";
			tmpLine += codes[i]+"\n";
			tmpLine += "console.log(\"fin\");"//コンソールで確認中！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
		}else{
			//inputが含まれない場合の処理
			tmpLine += codes[i];
		}
		source += tmpLine;
	}

	//残りのスクリプト配置
	for(var i = 0; i < scriptAfter.length; i++){
		source += scriptAfter[i];
	}

	htmlsource.document.write(source);
	htmlsource.document.close();
}

//canvasからコードにして取得する
function getElememtOfTanzaku (canvas){
	var ans = canvas.childNodes[0];
	var f = 1;//なんやこれ
	var line = "";

	for(var i = 0; i < ans.childElementCount; i++){
		if(typeof ans.childNodes[i].innerHTML != "undefined"){
			if(ans.childNodes[i].outerHTML.includes("<select")){
				line += ans.childNodes[i].pd.value + " ";
			}else if(ans.childNodes[i].outerHTML.includes("<input")){
				line += ans.childNodes[i].keyboard.value+ " ";
			}else if(ans.childNodes[i].outerHTML.includes("<span")){
				line += ans.childNodes[i].textContent+ " ";
			}
		}
	}
	return line;
}

function makeJS(number){
	var answerArea = document.getElementById("answerArea-"+number);
	//解答プログラムの取得（xDNCL）
	var code = "";
	for(var i = 0; i < answerArea.childElementCount; i++){
		var elt = getElememtOfTanzaku(answerArea.childNodes[i]);
		code += toJS(elt) +"\n";
	}
	return code;

}

//1行ごとに変換を行う
function toJS(line){
	//xDNCL→JavaScript

	//代入
	line = line.replace(/←/g,"=");

	//変数
	line = line.replace(/「|」/g,"\"");

	//文字列は変えといて最後に戻す
	var strs = line.match(/\".+?\"/);
	if(strs != null){
	for(var i = 0; i < strs.length ; i++){
		//console.log(strs[i]+",,,,mojiretsu"+i);
		line = line.replace(strs[i],"mojiretsu"+i);
	}
}
	line = line.replace(/整数|実数|文字列|変数/g,"var");

	//出力
	if(line.includes("を表示する")){
		line = "outputWithReturn("+ line.replace(/を表示する/g,"")+")";
	}

	if(line.includes("を改行なしで表示する")){
		line = "outputLessReturn("+ line.replace(/を改行なしで表示する/g,"")+")";
	}

	if(line.includes("を実行する"||"を繰り返す")){
		line = "}";
	}

	if(line.includes("を実行し、そうでなければ")){
		line = "} else {";
	}

	if(line.includes("を実行し，そうでなくもし")){
		line = line.replace(/を実行し，そうでなくもし/g,"");
		line = "} else if("+ line.replace(/ならば/g,""); +"){";
	}

	if(line.includes("もし")){
		line = line.replace(/もし/g,"");
		// for(var i = 0; i < line.length; i ++ ){
		// 	alert(line.charAt(i));
		// }
		line = "if("+line.replace(/ならば/g,"")+"){";//注意！！ 「ならは+ ゙」
		//alert(line);
	}

	if(line.includes("の間，")){
		line = "while(" + line.replace(/の間，/g,"") + "){";
	}

	if(line.includes("まで 1 ずつ増やしながら，")){
		var equation =  line.replace(/を|から|まで/g,",").replace(/ずつ増やしながら，/g,"").split(",");
		line = "for("+ equation[0] + " = " +  equation[1] + ";" + equation[0] + "<"+ equation[2] + ";" + equation[0] + "+" +equation[3];
	}

	if(line.includes("まで 1 ずつ減らしながら，")){
		var equation =  line.replace(/を|から|まで/g,",").replace(/ずつ減らしながら，/g,"").split(",");
		line = "for(" + equation[0] + " = " + equation[1] + ";" + equation[0] + "<"+ equation[2] + ";" + equation[0] + "-" +equation[3];
	}

	if(strs!=null){
	for(var i = 0; i < strs.length ; i++){
		line = line.replace("mojiretsu"+i,strs[i]);
	}}

	if(line.charAt(line.length - 1) != "{" && line.charAt(line.length - 1) != "}"){
		line += ";";
	}

	return line+"\n";
}

var scriptBefore = [
  "<html>\n",

  " <head>\n",
  "   <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" />\n",
  "   <title>\n",
  "    runProg\n",
  "   </title>\n",
  " </head>\n",

  " <body onLoad = \"start()\">\n",
  "   <form name=\"in\">\n",
  "    <input type=\"text\" name=\"keyboard\">\n",
  "    <input type=\"button\" value=\"入力\" onclick=\"setInputValue()\">\n",
  "    <input type=\"button\" value=\"リセット\" onclick=\"clean()\">\n",
  "   </form>\n",

  "   <form name=\"program\">\n",
  "    <textarea name=\"out\" readonly rows=\"8\" cols=\"40\"></textarea>\n",
  "   </form>\n",

  "   <script type=\"text/javascript\">\n",
  "    \/\/ 改行あり出力\n",
  "    function outputWithReturn(res){\n",
  "      program.out.value += res+\"\\n\";\n",
  "    }\n",

  "    \/\/ 改行なし出力\n",
  "    function outputLessReturn(res){\n",
  "      program.out.value += res;\n",
  "    }\n",

  "    \/\/ 入力値の取得を行う\n",
  "    \/\/ 「入力ボタン」で呼び出す\n",
	"    var inputValueVirPage;\n",
  "    function setInputValue(){\n",
  "     inputValueVirPage = document.in.keyboard.value;",
  "     document.in.keyboard.value = \"\";",
  "     outputWithReturn(\"＜入力＞　：\"+inputValueVirPage);\n",
  "     gen.next(inputValueVirPage);\n",
  "    }\n",

	"    \/\/ 入力値の取得\n",
  "    function input(){\n",
  "     return inputValueVirPage;",
  "    }\n",

  "    \/\/ 入力値の初期化を行う\n",
  "    \/\/ 「リセットボタン」で呼び出す\n",
  "    function clean(){\n",
  "     program.out.value = \"\";\n",
  "     gen = result(0);\n",
	"     gen.next(0);\n",
  "    }\n",

  "    function* result(inputValueVirPage){\n",
];

        //！！！！！！！！！！！！！//
        //ここに生成したコードが入る//
        //！！！！！！！！！！！！！//

var scriptAfter = [
  "    }\n",

  "    var gen = result(0);\n",

  "    function start(){\n",
  "     gen.next(0);\n",
  "    }\n",

  "   </script>\n",
  " </body>\n",
  "</html>\n",
];
