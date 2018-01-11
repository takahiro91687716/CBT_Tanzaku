//XMLHttpRequestオブジェクトを生成
var xhr = new XMLHttpRequest();

//問題のDOM
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
			buildQuestions();
		}
	}
	xhr.send();
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ページに問題を配置する
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//--------------------------------------------------
//ページ全体に問いを配置する関数
//--------------------------------------------------
function buildQuestions(){
	//xmlからquestion tagのついている内容を取得
	var resHTTP = xhr.responseXML;
	question = resHTTP.getElementsByTagName('question');

	for(var number = 0; number < question.length;number++){
		buildQuestion(number);
	}

	//関数にしたい！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
	for(var i = 0; i < question.length; i ++){
		document.getElementById("answerArea-"+i).ondragover = prev;
		document.getElementById("answerArea-"+i).ondrag = prev;
		document.getElementById("answerArea-"+i).ondrop = dropToAnswerArea;
		setActionForAnswerAreaContainer(i);
	}

	var area = document.getElementById("area");
	area.ondragover = prev;
	area.ondrag = prev;
	area.ondrop = trashItem;
}

//--------------------------------------------------
// "(number)問目"を作成する関数
//--------------------------------------------------
function buildQuestion(number){
	var textarea = question[number].getElementsByTagName('textarea');
	var answerarea = question[number].getElementsByTagName('answerarea');
	var itemsarea = question[number].getElementsByTagName('itemsarea');

	//問題要素を表示する領域の生成
	buildArea(number);

	//問題文要素埋め込み
	buildTextarea(textarea, number);
	//解答欄要素埋め込み
	buildAnswerarea(answerarea, number);
	//選択肢欄要素埋め込み
	buildItemsarea(itemsarea, number);
}

function setActionForAnswerAreaContainer(number){
	var numOfItems = document.getElementById('answerArea-'+number).childElementCount;
	for(i = 0; i < numOfItems; i++) {
			var container = document.getElementById('canvas-'+number+'-'+i);
			container.ondrop = dropToCanvas;
			container.ondragover = prev;
			container.ondrag = prev;

	}
}

function setActionForAnswerArea(number){
	var answerArea = document.getElementById('answerArea-'+number);
	answerArea.ondrop = dropToAnswerArea;
	answerArea.ondragover = prev;
	answerArea.ondrag = prev;
}

function setTrashActionForArea(){
	var area = document.getElementById("area");
	area.ondragover = prev;
	area.ondrag = prev;
	area.ondrop = trashItem;
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// １題を構成するHTML要素を作成する
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//--------------------------------------------------
// １題の構成要素を設置する
//--------------------------------------------------
function buildArea(number){
	var area = document.getElementById("area");

	//問題文領域の生成
	area.innerHTML += buildTextareaHTML(number);
	//解答欄領域の生成
	area.innerHTML += buildAnswerareaHTML(number);
	//選択肢領域の生成
	area.innerHTML += buildItemsareaHTML(number);
	//問題区切り
	area.innerHTML+= "<br>";
}

//-----------------------------
// 問題文の表示を行う領域を作成する
//-----------------------------
function buildTextareaHTML(number){
	var str = "";
	str += "<div class='waku titleWaku'>";
	str +=  "<div class='caption captionForTitle'>";
	str +=   "<h3>問題 "+ ( number + 1 ) +"</h3>";
	str +=  "</div>";
	str +=  "<div id='question-"+number+"'>";
	str +=  "</div>";
	str += "</div>";
	return str;
}

//-----------------------------
// 解答欄の表示を行う領域を作成する
//-----------------------------
function buildAnswerareaHTML(number){
	var str = "";
	str += "<div class='waku answerWaku'>";
	str +=  "<div class='caption captionForAnswer'>";
	str +=   "<h3>解答欄</h3>";
	str +=   "<button type='button' class='executeButton' onclick='runCode("+number+")'>実行</button>";
	str +=  "</div>";
	str +=  "<div class='fixedAnswerArea'>";
	str +=   "<div id='answerArea-"+number+"' class='answerArea' >";
	str +=   "</div>";
	str +=  "</div>";
	str += "</div>";
	return str;
}

//-----------------------------
// 選択肢の表示を行う領域を作成する
//-----------------------------
function buildItemsareaHTML(number){
	var str = "";
	str += "<div class='waku tanzakuWaku'>";
	str +=  "<div class='caption captionForTanzaku'>";
	str +=   "<h3>選択肢欄</h3>";
	str +=  "</div>";
	str +=  "<div id='tanzakuArea-"+number+"'>";
	str +=  "</div>";
	str += "</div>";
	return str;
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// １題を構成するDOM要素の埋め込み
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//--------------------------------------------------
// "(number)問目"の問題文要素を埋め込む関数
//--------------------------------------------------
function buildTextarea(textarea, number){
	var text = textarea[0].getElementsByTagName('text')[0].childNodes[0].nodeValue;
	document.getElementById("question-"+number).innerHTML += "<p>" + text + "</p>";
}

//--------------------------------------------------
// "(number)問目"の解答欄要素を埋め込む関数
//--------------------------------------------------
function buildAnswerarea(answerarea, number){
	var items = answerarea[0].getElementsByTagName('item');

	//選択肢埋め込み
	for(i = 0; i < items.length; i++) {
		var answerareaElm = document.getElementById("answerArea-"+number);
		var newBox = document.createElement("div");
		newBox.id = "canvas-" + number + "-" + i;
		newBox.classList.add("box");

		answerareaElm.appendChild(newBox);
		// (function(j){
		// 	makeContainer(number,j);}(i));
		// makeContainer(number,i);
		document.getElementById("canvas-"+number+"-"+i).innerHTML += buildAnswerareaItemHTML(items[i],number,i);
	}
}

//--------------------------------------------------
// "(number)問目"の選択肢欄要素を埋め込む関数
//--------------------------------------------------
function buildItemsarea(itemsarea, number){
	var items = itemsarea[0].getElementsByTagName('item');

	//選択肢埋め込み
	for(i = 0; i < items.length; i++) {
		var tanzakuArea = document.getElementById("tanzakuArea-"+number);
		var newBox = document.createElement("div");
		newBox.id = "box-" + number + "-" + i;
		newBox.classList.add("box");
		tanzakuArea.appendChild(newBox);
		newBox.innerHTML += buildItemsareaItemHTML(items[i],number,i)
	}
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// １選択肢（DOM）からHTML形式の選択肢形成
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function buildAnswerareaItemHTML(item, numOfQuestion, numOfItems){
	var itemHTML = "<div id= '";

	// IDなどをどうするか考えなければいけない！！！！！！！！！！！！！！！！！！！！！！！！！！
	itemHTML += "c-" + numOfQuestion + "-" + numOfItems + "-" + idc++ +"' ";
	itemHTML += "class='tanzaku fix answer' data-type='fixed' draggable='true' ondragstart='itemDragStart(event)'>";//とりあえずfixのクラスを追加
	itemHTML += buildItemIncludesParts(item);
	itemHTML += "</div>";

	return itemHTML;
}

function buildItemsareaItemHTML(item, numOfQuestion, numOfItems){
	//使用回数１回の属性指定がされているか調べる
	var unique = item.getAttributeNode("unique");

	var itemHTML = "<div id= '";
	if(unique != null && unique.value == "true"){
		itemHTML += "i-" + numOfQuestion + "-" + numOfItems +"' ";
		itemHTML += "class='tanzaku unique' data-type='unique' ";
	}else{
		itemHTML += "i-" + numOfQuestion + "-" + numOfItems + "' ";
		itemHTML += "class='tanzaku normal' data-type='normal'";
	}
	itemHTML += "draggable='true' ";
	itemHTML += "ondragstart='itemDragStart(event)'>";
	itemHTML += buildItemIncludesParts(item);
	itemHTML += "</div>";

	return itemHTML;
}

// フォーム重複を防ぐためにフィールドで変数を持つ
var numOfForm = 0;
function buildItemIncludesParts(item){
	// <item> ~~~~~~ </item>の
	// ~~~~~~部分を取得する
	var str = item.childNodes[0].nodeValue;

	// 特殊部品 ex) {number:200} とそうでない部分を分解してHTML表示形式に組み替える
	var numOfNormal = 0;
	var numOfBrace = 0;

	// 正規表現で特殊部品を探す
	var brace = str.match(/\{text\:.*?\}|\{number\:.*?\}|\{pullDown\:.*?\}/g);
	if(brace){
		numOfBrace = brace.length;
	}

	// 特殊部品の部分を一旦わかりやすい形に置き換えておく
	// ここでは (@brace番号) の形
	for(var i = 0; i < numOfBrace; i++){
		str = str.replace(brace[i],"(@brace"+i+")");
	}

	// (@brace番号)を区切り文字として使用することで特殊部品以外を取得する
	var normal = str.split(/\(@brace\d\)/);
	if(normal){
		numOfNormal = normal.length;
	}

	// 特殊部品以外を <span> ~~~~~ </span>という形に置き換える
	// この置き換えを行わないと，あとで解答を取得するときに面倒になる
	for(var i = 0; i < str.length ; i++){
		str = str.replace(normal[i],"<span>"+normal[i]+"</span>");
	}

	//braceを変換していく
	for(var i = 0; i < numOfBrace; i++){
		// { }を取り除く
		var target = brace[i].substring(1, brace[i].length - 1).split(":");
		var tmp = "<form name = '"+ numOfForm++ +"'  style='display: inline'>";
		if(target[0].includes("text")){
			tmp += "<input type=text name='keyboard' style='width:50px;'";
			if(target[1]){
				tmp += " value=" + target[1];
			}
			tmp += ">";
		}else if(target[0].includes("number")){
			console.log("hit");
			tmp += "<input type=number name='keyboard' style='width:50px;'";
			if(target[1]){
				tmp += " value=" + target[1];
			}
			tmp += ">";
		}else{
			var selectList = target[1].split(",");
			tmp += "<select name='pd'>";
			for(var j = 0; j < selectList.length;j++){
				tmp += "<option value = '"+selectList[j]+"'>"+selectList[j]+"</option>";
			}
			tmp += "</select>";
		}
		tmp += "</form>";
		str = str.replace("(@brace"+i+")",tmp);
	}

	return str;
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

		if(idElm[0] == "i"){
			// 選択肢欄からの要素の処理
			console.log("新規追加："+ "answerArea-"+idElm[1]);
			addAnswer(id,to);
		}else if(idElm[0] == "c"){
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
	console.log(this.id);
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

	if(idElm[0] == "i"){
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
	}else if(idElm[0] == "c"){
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
	var newAnswer = document.getElementById(id);

	if(newAnswer.getAttribute('data-type').includes('normal')){
		newAnswer = newAnswer.cloneNode(true);
	}

	newAnswer.id = "c-" + idElm[1] + "-" + idElm[2] + "-" + idc++;
	newAnswer.classList.add("answer");
	//console.log(newAnswer.getAttribute('data-type'));

	var answerArea = document.getElementById("answerArea-"+idElm[1]);

	// 解答済み選択肢数
	var numOfAnswer = answerArea.childElementCount;

	// 追加場所をつくる
	// var newCanvas = canvasOrigin.cloneNode(true);
	// newCanvas.id = "canvas-" + idElm[1] + "-" + numOfAnswer;
	// newCanvas.ondragover = prev;
	// newCanvas.ondrag = prev;
	// newCanvas.ondrop = dropToCanvas;
	// answerArea.appendChild(newCanvas);

	makeContainer(idElm[1],numOfAnswer)

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

function makeContainer(number,numOfAnswer){
	var answerArea = document.getElementById("answerArea-"+number);
	var newCanvas = canvasOrigin.cloneNode(true);
	newCanvas.id = "canvas-" + number + "-" + numOfAnswer;
	newCanvas.ondragover = prev;
	newCanvas.ondrag = prev;
	newCanvas.ondrop = dropToCanvas;
	answerArea.appendChild(newCanvas);
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
	var elm = document.getElementById(id);
	if(trashFlug){
		if(elmId[1] == 'c'){
		if(elm.getAttribute('data-type').includes("unique")){
			returnItem(document.getElementById(id));
		}else if(elm.getAttribute('data-type').includes("normal")){
			removeItem(document.getElementById(id));
		}
		indent(elmId[1]);
	}}else{
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
	rtElt.id = "i-" +rtEltId[1] +"-"+ rtEltId[2];
	rtElt.style.left = "0px";//インデント残ってるのを消す
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
			tmpLine += "console.log('fin');"//コンソールで確認中！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
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
	line = line.replace(/「|」/g,"'");

	//文字列は変えといて最後に戻す
	var strs = line.match(/'.+?'/);
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
  "   <meta http-equiv='Content-Type' content='text/html; charset=UTF-8' />\n",
  "   <title>\n",
  "    runProg\n",
  "   </title>\n",
  " </head>\n",

  " <body onLoad = 'start()'>\n",
  "   <form name='in'>\n",
  "    <input type='text' name='keyboard'>\n",
  "    <input type='button' value='入力' onclick='setInputValue()'>\n",
  "    <input type='button' value='リセット' onclick='clean()'>\n",
  "   </form>\n",

  "   <form name='program'>\n",
  "    <textarea name='out' readonly rows='8' cols='40'></textarea>\n",
  "    <textarea name='error' readonly rows='8' cols='40'></textarea>\n",
  "   </form>\n",

  "   <script type='text/javascript'>\n",
  "    \/\/ 改行あり出力\n",
  "    function outputWithReturn(res){\n",
  "      program.out.value += res+'\\n';\n",
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
  "     document.in.keyboard.value = '';",
  "     outputWithReturn('＜入力＞　：'+inputValueVirPage);\n",
  "     gen.next(inputValueVirPage);\n",
  "    }\n",

	"    \/\/ 入力値の取得\n",
  "    function input(){\n",
  "     return inputValueVirPage;",
  "    }\n",

  "    \/\/ 入力値の初期化を行う\n",
  "    \/\/ 「リセットボタン」で呼び出す\n",
  "    function clean(){\n",
  "     program.out.value = '';\n",
  "     gen = result(0);\n",
	"     gen.next(0);\n",
  "    }\n",

	"    window.onerror = function(msg, url, line, col, error) {",
  "     program.error.value += msg;",
	"     console.log(msg);",
	"    };",

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
