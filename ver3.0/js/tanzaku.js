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
	buildTextArea(textarea, number);
	//解答欄要素埋め込み
	buildAnswerArea(answerarea, number);
	//選択肢欄要素埋め込み
	buildItemsArea(itemsarea, number);
}

function setActionForAnswerAreaContainer(number){
	var numOfItems = document.getElementById('answerArea-'+number).childElementCount;
	for(i = 0; i < numOfItems; i++) {
			var container = document.getElementById('container-'+number+'-'+i);
			container.ondrop = dropToContainer;
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
	area.appendChild(buildTextAreaBox(number));
	//解答欄領域の生成
	area.appendChild(buildAnswerAreaBox(number));
	//選択肢領域の生成
	area.appendChild(buildItemsAreaBox(number));
}

//-----------------------------
// 問題文の表示を行う領域を作成する
//-----------------------------
function buildTextAreaBox(number){
	var box = document.createElement('div');
	box.classList.add('box');
	box.classList.add('textAreaBox');

	var caption = document.createElement('div');
	caption.classList.add('caption');
	caption.classList.add('captionForTextArea');

	var captionContents = document.createElement('h3');
	captionContents.innerHTML = "問題：" + ( number + 1 );

	caption.appendChild(captionContents);
	box.appendChild(caption);

	var textArea = document.createElement('div');
	textArea.id = "textArea-" + number;

	box.appendChild(textArea);
	return box;
}

//-----------------------------
// 解答欄の表示を行う領域を作成する
//-----------------------------
function buildAnswerAreaBox(number){
	var box = document.createElement('div');
	box.classList.add('box');
	box.classList.add('answerAreaBox');

	var caption = document.createElement('div');
	caption.classList.add('caption');
	caption.classList.add('captionForAnswerArea');

	var captionContents = document.createElement('h3');
	captionContents.innerHTML = "解答欄";

	var button = document.createElement('button');
	button.type = 'button';
	button.classList.add('executeButton');
	button.onclick = 'runCode('+number+')';
	button.innerHTML += "実行";

	captionContents.appendChild(button);

	caption.appendChild(captionContents);
	box.appendChild(caption);

	var fixedAnswerArea = document.createElement('div');
	fixedAnswerArea.classList.add('fixedAnswerArea');

	var answerArea = document.createElement('div');
	answerArea.id = "answerArea-" + number;
	answerArea.classList.add('answerArea');

	fixedAnswerArea.appendChild(answerArea);
	box.appendChild(fixedAnswerArea);
	return box;
}

//-----------------------------
// 選択肢の表示を行う領域を作成する
//-----------------------------
function buildItemsAreaBox(number){
	var box = document.createElement('div');
	box.classList.add('box');
	box.classList.add('itemsAreaBox');

	var caption = document.createElement('div');
	caption.classList.add('caption');
	caption.classList.add('captionForItemsArea');

	var captionContents = document.createElement('h3');
	captionContents.innerHTML = "選択肢欄";

	caption.appendChild(captionContents);
	box.appendChild(caption);

	var itemsArea = document.createElement('div');
	itemsArea.id = "itemsArea-" + number;
	itemsArea.classList.add('itemsArea');

	box.appendChild(itemsArea);
	return box;
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// １題を構成するDOM要素の埋め込み
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//--------------------------------------------------
// "(number)問目"の問題文要素を埋め込む関数
//--------------------------------------------------
function buildTextArea(textArea, number){
	var text = textArea[0].getElementsByTagName('text')[0].childNodes[0].nodeValue;
	var textContent = document.createElement('p');
	textContent.innerHTML += text;
	document.getElementById("textArea-"+number).appendChild(textContent);
}

//--------------------------------------------------
// "(number)問目"の解答欄要素を埋め込む関数
//--------------------------------------------------
function buildAnswerArea(answerAreaTag, number){
	var items = answerAreaTag[0].getElementsByTagName('item');

	//選択肢埋め込み
	for(i = 0; i < items.length; i++) {
		var answerArea = document.getElementById("answerArea-"+number);
		var container = document.createElement("div");
		container.id = "container-" + number + "-" + i;

		answerArea.appendChild(container);
		document.getElementById("container-"+number+"-"+i).appendChild(buildAnswerAreaItemElm(items[i],number,i));
	}
}

function buildAnswerAreaItemElm(itemContent, numOfQuestion, numOfItem){
	var item = document.createElement("div");
	item.id = numOfQuestion + "-" + idc++;
	item.classList.add('item');
	item.classList.add('fixed');
	item.classList.add('answer');
	item.setAttribute('data-type','fixed');
	item.setAttribute('data-question',numOfQuestion);
	item.setAttribute('data-answer','true');
	item.setAttribute('data-item',(numOfItem+100));//いらないかも
	item.draggable=true;
	item.ondragstart = itemDragStart;
	item.innerHTML += buildItemIncludesParts(itemContent);
	return item;
}

//--------------------------------------------------
// "(number)問目"の選択肢欄要素を埋め込む関数
//--------------------------------------------------
function buildItemsArea(itemsAreaTag, number){
	var items = itemsAreaTag[0].getElementsByTagName('item');

	//選択肢埋め込み
	for(i = 0; i < items.length; i++) {
		var itemsArea = document.getElementById("itemsArea-"+number);
		var container = document.createElement("div");//aaaaaaaaaaaaa
		container.id = "box-" + number + "-" + i;//aaaaaaaaaaaaa
		container.classList.add("boxx");//aaaaaaaaaaaaa
		itemsArea.appendChild(container);
		container.appendChild(buildItemsAreaItemElm(items[i],number,i));
	}
}

function buildItemsAreaItemElm(itemContent, numOfQuestion, numOfItem){
	//使用回数１回の属性指定がされているか調べる
	var unique = itemContent.getAttributeNode("unique");

	var item = document.createElement("div");
	item.id = numOfQuestion + "-" + numOfItem;
	if(unique != null && unique.value == "true"){
		item.classList.add('item');
		item.classList.add('unique');
		item.setAttribute('data-type','unique');
	}else{
		item.classList.add('item');
		item.classList.add('normal');
		item.setAttribute('data-type','normal');
	}
	item.setAttribute('data-question',numOfQuestion);
	item.setAttribute('data-answer','');
	item.setAttribute('data-item',numOfItem);
	item.draggable=true;
	item.ondragstart = itemDragStart;
	item.innerHTML += buildItemIncludesParts(itemContent);

	return item;
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

	//改行と水平タブを削除
	// (@brace番号)を区切り文字として使用することで特殊部品以外を取得する
	var normal =str.replace(/\n|\t/g,"").split(/\(@brace\d\)/);

	// splitで "" が配列に含まれてしまうため削除
	normal.some(function(remove, i){
    if (remove==""){
		normal.splice(i,1);}
	});

	//特殊部品以外を含んでいる場合はその数をカウントしておく
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
			tmp += "<input type=text name='keyboard' style='width:50px;' onkeyup='changeWidthOfInput(this)'";
			if(target[1]){
				tmp += " value=" + target[1];
			}
			tmp += ">";
		}else if(target[0].includes("number")){
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

//emとexをどれくらいと仮定するか
var expx = 10;
var empx = 13;
function changeWidthOfInput(input){
	var ex = 0;
	var em = 0;
	var hankaku = input.value.match(/[A-Za-z0-9].*?/g);
	var zenkaku = input.value.match(/[^\x01-\x7E\xA1-\xDF].*?/g);
	if(hankaku){
		ex = hankaku.length;
	}
	if(zenkaku){
		em = zenkaku.length;
	}
	input.style.width = ((ex*expx)+(em*empx))+'px';
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
	if(!containerCall){
		console.log("ドロップ：解答欄");
		var id = e.dataTransfer.getData("text/html",e.target.id);
		var elm = document.getElementById(id);
		var number = elm.getAttribute('data-question');

		var to = document.getElementById("answerArea-"+number).childElementCount;
		if(elm.getAttribute('data-answer') !=null){
			if(!Boolean(elm.getAttribute('data-answer'))){
				// 選択肢欄からの要素の処理
				console.log("新規追加："+ "answerArea-"+number);
				addAnswer(id,to);
			}else{
				// 解答欄からの要素の処理
				var from = elm.parentElement.id.split("-")[2];
				// 要素増えないので to は -1 しておく
				insertLower(from,(to-1),number);
			}
		}
		indent(number);
	}else{
		containerCall = false;
	}
}

//-----------------------------
// キャンバスへドロップされた時の処理
// ・新規追加（挿入）と並び替え
//-----------------------------
var containerCall = false;
function dropToContainer(e){
	containerCall =true;
	console.log("ドロップ：コンテナ");
	var id = e.dataTransfer.getData("text/html",e.target.id);
	var elm = document.getElementById(id);
	var number = elm.getAttribute('data-question');

	var containerId = this.id;
	console.log(this.id);
	var containerIdElm = containerId.split("-");

	// (3) containerの情報
	// containerIdElm[0] 識別子 "container"
	// containerIdElm[1] 問題番号
	// containerIdElm[2] 解答番号

	var to = Number(containerIdElm[2]);

	// 置いた時点のカーソル位置
	var mouseY = e.clientY;
	// 置かれた container での評価基準座標
	var divClientRect = this.getBoundingClientRect();
	var harfOfdiv = divClientRect.height/2;
	var elmY = divClientRect.top+harfOfdiv;

	if(elm.getAttribute('data-answer') !=null){
		if(!elm.getAttribute('data-answer')){
			// 選択肢欄からの要素の処理
			console.log("新規追加");

			if(mouseY<elmY){
				//上半分に落とされた時
				console.log("上半分に落とされました");
				addAnswer(id,to);
			}else if(elmY<=mouseY){
				//下半分に落とされた時
				console.log("下半分に落とされました");
				addAnswer(id,to+1);
			}
		}else{
			// 解答欄からの要素の処理
			console.log("要素移動");
			var from = elm.parentElement.id.split("-")[2];

			if(mouseY<elmY){
				//上半分に落とされた時
				console.log("上半分に落とされました");
				insertUpper(from,to,number);
			}else if(elmY<=mouseY){
				console.log("下半分に落とされました");
				//下半分に落とされた時
				insertLower(from,to,number);
			}
		}
	}
	indent(number);
}

//選択肢が100個置かれることは無いと仮定
//あるなら増やす
//-----------------------------
// 解答欄への要素の追加
// id     ： 追加要素の id
// here ： 追加場所
//-----------------------------
var idc = 100;
var containerOrigin = document.createElement("div");
function addAnswer(id,here){
	var elm = document.getElementById(id);
	var number = elm.getAttribute('data-question')

	if(elm.getAttribute('data-type').includes('normal')){
		elm = elm.cloneNode(true);
		elm.id = number+ "-" + idc++;
		//クローンしたらイベントは引き継がれない
		elm.ondragstart = itemDragStart;
	}

	elm.classList.add("answer");
	elm.setAttribute('data-answer','true');

	var answerArea = document.getElementById("answerArea-"+number);

	// 解答済み選択肢数
	var numOfAnswer = answerArea.childElementCount;

	makeContainer(number,numOfAnswer)

	// here以降をずらしていく
	console.log(here+"番から"+(numOfAnswer-1)+"をずらして");
	for(var i = here; i < numOfAnswer ; i++){
		var to = document.getElementById("container-" + number + "-" + ( Number(i) + 1 ));
		var elm = document.getElementById("container-" + number + "-" + i).childNodes[0];
		to.appendChild(elm);
	}

	// 新しい解答の追加
	console.log("container-" + number + "-" + here);
	document.getElementById("container-" + number + "-" + here).appendChild(elm);
}

function makeContainer(number,numOfAnswer){
	var answerArea = document.getElementById("answerArea-"+number);
	var newContainer = containerOrigin.cloneNode(true);
	newContainer.id = "container-" + number + "-" + numOfAnswer;
	newContainer.ondragover = prev;
	newContainer.ondrag = prev;
	newContainer.ondrop = dropToContainer;
	answerArea.appendChild(newContainer);
}

//-----------------------------
// 解答欄への要素の追加
// id     ： 追加要素の id
// number ： 追加場所
//-----------------------------
function insertUpper(from,to,number){
  console.log(from+"から"+to);
  var insert = document.getElementById("container-"+number+"-"+from).childNodes[0];

  if(from<to){
    //上から下へ持ってきた時
    to--;
    for(var i = from; i < to ; i++){
      console.log("上から下へ持ってきました");
      console.log(i+"を動かす：to"+to+",from"+from);
      var tmpElt = document.getElementById("container-"+number+"-"+(Number(i)+1)).childNodes[0];

      document.getElementById("container-"+number+"-"+Number(i)).appendChild(tmpElt);
    }
  }else{
    //下から上へ持ってきた時、または同値
    for(var i = from; to < i; i--){
      console.log("下から上へ持ってきました");
      console.log(i+"を動かす：to"+to+",from"+from);
      var tmpElt = document.getElementById("container-"+number+"-"+(Number(i)-1)).childNodes[0];
      document.getElementById("container-"+number+"-"+Number(i)).appendChild(tmpElt);
    }
  }
  document.getElementById("container-"+number+"-"+to).appendChild(insert);
}

//-----------------------------
// 解答欄への要素の追加
// id     ： 追加要素の id
// number ： 追加場所
//-----------------------------
function insertLower(from,to,number){
  console.log(from+"から"+to);
  var insert = document.getElementById("container-"+number+"-"+from).childNodes[0];

  if(to<from){
    //下から上へ持ってきた時
    to++;
    for(var i = from; to < i; i--){
      console.log("下から上へ持ってきました");
      console.log(i+"を動かす：to"+to+",from"+from);
      var tmpElt = document.getElementById("container-"+number+"-"+(Number(i)-1)).childNodes[0];
      document.getElementById("container-"+number+"-"+Number(i)).appendChild(tmpElt);
    }
  }else{
    //上から下へ持ってきた時、または同値
    for(var i = from; i < to ; i++){
      console.log("上から下へ持ってきました");
      console.log(i+"を動かす：to"+to+",from"+from);
      var tmpElt = document.getElementById("container-"+number+"-"+(Number(i)+1)).childNodes[0];
      document.getElementById("container-"+number+"-"+Number(i)).appendChild(tmpElt);
    }
  }
  document.getElementById("container-"+number+"-"+to).appendChild(insert);
}

//-----------------------------
// 解答欄への要素の追加
// id     ： 追加要素の id
// number ： 追加場所
//-----------------------------
function trashItem(e){
	var id = e.dataTransfer.getData("text/html",e.target.id);
	var elm = document.getElementById(id);
	if(trashFlug){
		//解答済みか調べる
		if(Boolean(elm.getAttribute('data-answer'))){
			//使用制限付きか調べる
			if(elm.getAttribute('data-type').includes("unique")){
				returnItem(elm);
			//使用制限無しか調べる（それ以外"fix"もあるので条件付き）
			}else if(elm.getAttribute('data-type').includes("normal")){
				removeItem(elm);
			}
			indent(elm.getAttribute('data-question'));
		}
	}else{
		trashFlug = true;
	}
}

//-----------------------------
// 解答欄への要素の追加
// id     ： 追加要素の id
// number ： 追加場所
//-----------------------------
function removeItem(rmElm){
	var number = rmElm.getAttribute('data-question');
	var answerArea = document.getElementById("answerArea-"+number)
	var here = Number(rmElm.parentElement.id.split("-")[2]);
	console.log(here+"番を削除");
	rmElm.parentElement.removeChild(rmElm);

	for(var i = here; i < answerArea.childElementCount-1;i++){
		var elm = document.getElementById("container-"+number+"-"+(Number(i)+1)).childNodes[0];
		document.getElementById("container-"+number+"-"+i).appendChild(elm);
	}
	//余分な欄を消す
	console.log("container-"+number+"-"+(answerArea.childElementCount-1));
  answerArea.removeChild(document.getElementById("container-"+number+"-"+(answerArea.childElementCount-1)));
}

//-----------------------------
// 解答欄への要素の追加
// id     ： 追加要素の id
// number ： 追加場所
//-----------------------------
function returnItem(rtElm){
	var number = rtElm.getAttribute('data-question');
	var answerArea = document.getElementById("answerArea-"+number);
	var here = Number(rtElm.parentElement.id.split("-")[2]);
	console.log(here+"番を戻す");
	rtElm.style.left = "0px";//インデント残ってるのを消す
	rtElm.classList.remove("answer");
	rtElm.setAttribute('data-answer','');
	document.getElementById("box-"+number+"-"+rtElm.getAttribute('data-item')).appendChild(rtElm);

	for(var i = here; i < answerArea.childElementCount-1;i++){
		var elt = document.getElementById("container-"+number+"-"+(Number(i)+1)).childNodes[0];
		document.getElementById("container-"+number+"-"+i).appendChild(elt);
	}
	//余分な欄を消す
  answerArea.removeChild(document.getElementById("container-"+number+"-"+(answerArea.childElementCount-1)));
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
		var container = answerArea.childNodes[i];
		level -= (container.textContent.match(/を実行する|を繰り返す|を実行し/g)||[]).length
		if(0 < level){
			container.childNodes[0].style.position = 'relative';
			container.childNodes[0].style.left = (level * 20)+ 'px';
		}else {
			container.childNodes[0].style.position = 'relative';
			container.childNodes[0].style.left = '0px';
			level = 0;
		}
		//次のレベルを増やしておく
		level += (container.textContent.match(/もし|の間|そうでなければ|そうでなければ|そうでなければ|そうでなければ|増やしながら|増やしながら|減らしながら|減らしながら/g)||[]).length;
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

//containerからコードにして取得する
function getElememtOfTanzaku (container){
	var ans = container.childNodes[0];
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
