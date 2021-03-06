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
	setTrashActionForArea();
}

//--------------------------------------------------
// "(number)問目"を作成する関数
//--------------------------------------------------
function buildQuestion(number){
	var textarea = question[number].getElementsByTagName('textArea');
	var answerarea = question[number].getElementsByTagName('answerArea');
	var itemsarea = question[number].getElementsByTagName('itemsArea');

	//問題要素を表示する領域の生成
	buildArea(number);

	//問題文要素埋め込み
	buildTextArea(textarea, number);
	//解答欄要素埋め込み
	buildAnswerArea(answerarea, number);
	//選択肢欄要素埋め込み
	buildItemsArea(itemsarea, number);
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

	var layout = document.createElement('div');
	//解答欄領域の生成
	layout.appendChild(buildAnswerAreaBox(number));
	//選択肢領域の生成
	layout.appendChild(buildItemsAreaBox(number));
	area.appendChild(layout);

	if(question[number].getAttribute('horizontal')=='true'){
		layout.classList.add('horizontal');
	}

	area.appendChild(document.createElement('br'));
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
	box.id = "answerAreaBox-" + number;//width変更するため

	var caption = document.createElement('div');
	caption.classList.add('caption');
	caption.classList.add('captionForAnswerArea');

	var captionContents = document.createElement('h3');
	captionContents.innerHTML = "解答欄";

	var button = document.createElement('input');
	button.type = 'button';
	button.classList.add('executeButton');
	button.onclick = function(){
		runCode(number);
	};
	button.value = "実行";

	captionContents.appendChild(button);

	caption.appendChild(captionContents);
	box.appendChild(caption);

	var fixedAnswerArea = document.createElement('div');
	// fixedAnswerArea.classList.add('fixedArea');
	fixedAnswerArea.id = "fixedAnswerArea-" + number;//height変更するため

	var answerArea = document.createElement('div');
	answerArea.id = "answerArea-" + number;
	answerArea.classList.add('answerArea');
	answerArea.ondrop = dropToAnswerArea;
	answerArea.ondragover = prev;
	answerArea.ondrag = prev;

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
	box.id = "itemsAreaBox-" + number;

	var caption = document.createElement('div');
	caption.classList.add('caption');
	caption.classList.add('captionForItemsArea');

	var captionContents = document.createElement('h3');
	captionContents.innerHTML = "選択肢欄";

	caption.appendChild(captionContents);
	box.appendChild(caption);

	var fixedItemsArea = document.createElement('div');
	// fixedItemsArea.classList.add('fixedArea');
	fixedItemsArea.id = "fixedItemsArea-" + number;//height変更するため

	var itemsArea = document.createElement('div');
	itemsArea.id = "itemsArea-" + number;
	itemsArea.classList.add('itemsArea');

	fixedItemsArea.appendChild(itemsArea);
	box.appendChild(fixedItemsArea);
	return box;
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// １題を構成するDOM要素の埋め込み
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//--------------------------------------------------
// "(number)問目"の問題文要素を埋め込む関数
//--------------------------------------------------
function buildTextArea(textArea, number){
	var text = textArea[0].getElementsByTagName('text')[0];
	var textContent = document.createElement('p');
	buildTextIncludesMarks(textContent,text);
	document.getElementById("textArea-"+number).appendChild(textContent);
}

function buildTextIncludesMarks(parent,text){
	// <text> ~~~~~~ </text>の
	// ~~~~~~部分を取得する
	var str = text.childNodes[0].nodeValue;

	// マークされているところ ex) {mark:3倍} とそうでない部分を分解してHTML表示形式に組み替える
	var numOfNormal = 0;
	var numOfMark = 0;

	// 正規表現で特殊部品を探す
	var mark = str.match(/\{mark\:.*?\}/g);
	if(mark){
		numOfMark = mark.length;
	}

	// マークされているところの部分をわかりやすい形に置き換えておく
	// ここでは (@mark番号) の形
	for(var i = 0; i < numOfMark; i++){
		str = str.replace(mark[i],"(@mark"+i+")");
	}

	//改行と水平タブを削除
	// (@brace番号)を区切り文字として使用することで特殊部品以外を取得する
	var normal =str.replace(/\n|\t/g,"").split(/\(@mark\d\)/);

	// splitで "" が配列に含まれてしまうため削除
	normal.some(function(remove, i){
    if (remove==""){
			normal.splice(i,1);
		}
	});
	if(normal&&normal[0]==("")){
		normal = null;
	}

	//マークされているところ以外を含んでいる場合はその数をカウントしておく
	if(normal){
		numOfNormal = normal.length;
	}

	// 基本形式の部分をわかりやすい形に置き換えておく
	// ここでは (@normal番号) の形
	for(var i = 0; i < numOfNormal; i++){
		str = str.replace(normal[i],"(@normal"+i+")");
	}

	//ここで要素を順番通りに取得できる
	//あとはelementsをDOMにしてparentに追加していく
	var elements = str.match(/\(.*?\)/g);

	for(var i = 0;i<elements.length;i++){
		var child = null;
		if(elements[i].includes("normal")){
			child = document.createElement("span");
			child.innerHTML = normal[elements[i].match(/\d/)];
		}else if(elements[i].includes("mark")){
			child = document.createElement("mark");
			var number = elements[i].match(/\d/);
			var target = mark[number].substring(1, mark[number].length - 1).split(":");
			child.innerHTML = target[1];
		}else{
			//これが出たら作り直し
			console.log("例外");
		}
		parent.appendChild(child);
	}
}

//--------------------------------------------------
// "(number)問目"の解答欄要素を埋め込む関数
//--------------------------------------------------
function buildAnswerArea(answerAreaTag, number){
	var items = answerAreaTag[0].getElementsByTagName('item');
	var horizontal = question[number].getAttribute('horizontal');
	if(answerAreaTag[0].getAttribute('width')){
		document.getElementById("answerAreaBox-"+number).style.width = answerAreaTag[0].getAttribute('width') + 'px';
	}else if(horizontal=='true'){//horizontalも見ないといけない
		document.getElementById("answerAreaBox-"+number).style.width = 400 + 'px';
	}
	if(answerAreaTag[0].getAttribute('height')){
		document.getElementById("fixedAnswerArea-"+number).style.height = answerAreaTag[0].getAttribute('height') + 'px';
	}else{
		document.getElementById("fixedAnswerArea-"+number).style.height = 300 + 'px';
	}

	//選択肢埋め込み
	for(i = 0; i < items.length; i++) {
		var answerArea = document.getElementById("answerArea-"+number);
		answerArea.appendChild(buildAnswerAreaItemElm(items[i],number,i));
	}
}

function buildAnswerAreaItemElm(itemContent, numOfQuestion, numOfItem){
	var item = document.createElement("div");
	item.id = numOfQuestion + "-" + idc++;
	item.classList.add('item');
	item.classList.add('fixed');
	item.setAttribute('data-type','fixed');
	item.setAttribute('data-question',numOfQuestion);
	item.setAttribute('data-locate','answerArea');
	item.setAttribute('data-item',(numOfItem+100));//いらないかも
	item.draggable=true;
	item.ondragstart = itemDragStart;
	item.ondragover = prev;
	item.ondrop = dropToItem;
	buildItemIncludesParts(item,itemContent);
	return item;
}

//--------------------------------------------------
// "(number)問目"の選択肢欄要素を埋め込む関数
//--------------------------------------------------
function buildItemsArea(itemsAreaTag, number){
	var items = itemsAreaTag[0].getElementsByTagName('item');
	var horizontal = question[number].getAttribute('horizontal');
	if(itemsAreaTag[0].getAttribute('width')){
		document.getElementById("itemsAreaBox-"+number).style.width = itemsAreaTag[0].getAttribute('width') + 'px';
	}else if(horizontal=='true'){
		document.getElementById("itemsAreaBox-"+number).style.width = 400 + 'px';
	}
	if(itemsAreaTag[0].getAttribute('height')){
		document.getElementById("fixedItemsArea-"+number).style.height = itemsAreaTag[0].getAttribute('height') + 'px';
	}else{
		document.getElementById("fixedItemsArea-"+number).style.height = 300 + 'px';
	}

	//選択肢埋め込み
	for(i = 0; i < items.length; i++) {
		var itemsArea = document.getElementById("itemsArea-"+number);
		var container = document.createElement("div");//aaaaaaaaaaaaa
		container.id = "container-" + number + "-" + i;//aaaaaaaaaaaaa
		container.classList.add('container');
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
	item.setAttribute('data-locate','itemsArea');
	item.setAttribute('data-item',numOfItem);
	item.draggable=true;
	item.ondragstart = itemDragStart;
	buildItemIncludesParts(item,itemContent);

	return item;
}

// フォーム重複を防ぐためにフィールドで変数を持つ
var numOfForm = 0;
function buildItemIncludesParts(parent,item){
	// <item> ~~~~~~ </item>の
	// ~~~~~~部分を取得する
	var str = item.childNodes[0].nodeValue;

	// 特殊部品 ex) {number:200} とそうでない部分を分解してHTML表示形式に組み替える
	var numOfBrace = 0;

	// 正規表現で特殊部品を探す
	var brace = str.match(/\{text\:.*?\}|\{number\:.*?\}|\{pullDown\:.*?\}/g);
	if(brace){
		numOfBrace = brace.length;
	}

	// 特殊部品の部分をわかりやすい形に置き換えておく
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
			normal.splice(i,1);
		}
	});
	if(normal&&normal[0]==("")){
		normal = null;
	}

	// 基本部品の部分をわかりやすい形に置き換えておく
	// ここでは (@normal番号) の形
	if(normal){
		for(var i = 0; i < normal.length; i++){
			var tmpElm = str.match(/\(@.*?\)/g);
			if(tmpElm){
				for(var j = 0; j < tmpElm.length; j++){
					str = str.replace(tmpElm[j],'＠');
				}
			}
			str = str.replace(normal[i],"(@normal"+i+")");
			if(tmpElm){
				for(var j = 0; j < tmpElm.length; j++){
					str = str.replace('＠',tmpElm[j]);
				}
			}
		}
	}

	//ここで要素を順番通りに取得できる
	//あとはelementsをDOMにしてparentに追加していく
	var elements = str.match(/\(.*?\)/g);

	for(var i = 0;i<elements.length;i++){
		var child = null;
		if(elements[i].includes("normal")){
			child = document.createElement("span");
			child.setAttribute('data-tag','span');
			child.innerHTML = normal[elements[i].match(/\d/)];
		}else if(elements[i].includes("brace")){
			child = document.createElement("form");
			child.name = numOfForm++;
			child.style.display = "inline";
			var number = elements[i].match(/\d/);
			var target = brace[number].substring(1, brace[number].length - 1).split(":");
			var son = null;
			if(target[0].includes("text")){
				son = document.createElement("input");
				child.setAttribute('data-tag','input');//formに属性付与
				son.type = "text";
				son.name = "keyboard";
				son.onkeyup = function(){
					changeWidthOfInput(this);
				}
				if(target[1]){
					son.value = target[1];
				}
				changeWidthOfInput(son);
			}else if(target[0].includes("number")){
				son = document.createElement("input");
				child.setAttribute('data-tag','input');//formに属性付与
				son.type = "number";
				son.name = "keyboard";
				son.onkeyup = function(){
					changeWidthOfInput(this);
				}
				if(target[1]){
					son.value = target[1].replace(/\s/g,'');
				}
				changeWidthOfInput(son);
			}else{
				var selectList = target[1].split(",");
				son = document.createElement("select");
				child.setAttribute('data-tag','select');//formに属性付与
				son.name = 'pd';
				for(var j = 0; j < selectList.length;j++){
					var tmp = document.createElement("option");
					tmp.value = selectList[j];
					tmp.innerHTML += selectList[j];
					son.appendChild(tmp);
				}
			}
			child.appendChild(son);
		}else{
			//これが出たら作り直し
			console.log("例外");
		}
		parent.appendChild(child);
	}
}

//emとexをpxだとどれくらいと仮定するか
var expx = 8;
var empx = 13;
var min = 50;
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
	var size = (ex*expx)+(em*empx);
	if(size < min){
		size = min;
	}
	input.style.width = size+'px';
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
	//アイテム上にドロップされたか調べる
	if(!containerCall){
		console.log("ドロップ：解答欄");
		var id = e.dataTransfer.getData("text/html",e.target.id);
		var elm = document.getElementById(id);
		var number = elm.getAttribute('data-question');
		var answerArea = document.getElementById("answerArea-"+number);

		if(elm.getAttribute('data-locate') == 'answerArea'){
			// 解答欄からの要素の処理
			console.log("要素移動："+"answerArea-"+number);
			answerArea.insertBefore(elm,answerArea.lastChild.nextSibling);
		}else if(elm.getAttribute('data-locate') == 'itemsArea'){
			// 選択肢欄からの要素の処理
			console.log("新規追加："+ "answerArea-"+number);
			addAnswer(elm,null,false);
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
function dropToItem(e){
	containerCall =true;
	console.log("ドロップ：アイテム");

	var id = e.dataTransfer.getData("text/html",e.target.id);
	var elm = document.getElementById(id);
	var number = elm.getAttribute('data-question');
	var answerArea = document.getElementById("answerArea-"+number);

	// 置いた時点のカーソル位置
	var mouseY = e.clientY;
	// 置かれた item での評価基準座標
	var divClientRect = this.getBoundingClientRect();
	var harfOfdiv = divClientRect.height/2;
	var elmY = divClientRect.top+harfOfdiv;

	if(elm.getAttribute('data-locate') =='answerArea'){
		// 解答欄からの要素の処理
		console.log("要素移動");

		if(mouseY<elmY){
			//上半分に落とされた時
			console.log("上半分に落とされました");
			answerArea.insertBefore(elm, this);
		}else if(elmY<=mouseY){
			console.log("下半分に落とされました");
			//下半分に落とされた時
			answerArea.insertBefore(elm, this.nextSibling);
		}
	}else if(elm.getAttribute('data-locate') =='itemsArea'){
		// 選択肢欄からの要素の処理
		console.log("新規追加");

		if(mouseY<elmY){
			console.log("上半分に落とされました");
			addAnswer(elm,this,true);
		}else if(elmY<=mouseY){
			console.log("下半分に落とされました");
			addAnswer(elm,this,false);
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
function addAnswer(elm1,elm2,before){

	//問題番号の取得
	var number = elm1.getAttribute('data-question');

	if(elm1.getAttribute('data-type').includes('normal')){
		elm1 = elm1.cloneNode(true);
		elm1.id = number+ "-" + idc++;
		//クローンしたらイベントは引き継がれない
		elm1.ondragstart = itemDragStart;
		var input = elm1.getElementsByTagName('input');
		if(input){//inputのイベントを再付与
			for(var i = 0; i < input.length;i++){
				input[i].onkeyup = function(){
					changeWidthOfInput(this);
				}
			}
		}
	}

	elm1.ondragover = prev;
	elm1.ondrop = dropToItem;
	elm1.setAttribute('data-locate','answerArea');

	var answerArea = document.getElementById("answerArea-"+number);
	if(!elm2){
		console.log("末尾に追加");
		answerArea.appendChild(elm1);
	}else if(before){
		answerArea.insertBefore(elm1, elm2);
	}else{
		answerArea.insertBefore(elm1, elm2.nextSibling);
	}
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
		if(elm.getAttribute('data-locate')=='answerArea'){
			//使用制限付きか調べる
			if(elm.getAttribute('data-type') == ("unique")){
				returnItem(elm);
			//使用制限無しか調べる（それ以外"fix"もあるので条件付き）
		}else if(elm.getAttribute('data-type') == ("normal")){
				elm.parentElement.removeChild(elm);
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
function returnItem(rtElm){
	var number = rtElm.getAttribute('data-question');
	var answerArea = document.getElementById("answerArea-"+number);
	rtElm.style.left = "0px";//インデント残ってるのを消す
	rtElm.setAttribute('data-locate','itemsArea');
	document.getElementById("container-"+number+"-"+rtElm.getAttribute('data-item')).appendChild(rtElm);
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
		var item = answerArea.childNodes[i];
		level -= (item.textContent.match(/を実行する|を繰り返す|を実行し/g)||[]).length
		if(0 < level){
			item.style.position = 'relative';
			item.style.left = (level * 20)+ 'px';
		}else {
			item.style.position = 'relative';
			item.style.left = '0px';
			level = 0;
		}
		//次のレベルを増やしておく
		level += (item.textContent.match(/もし|の間|そうでなければ|そうでなければ|そうでなければ|そうでなければ|増やしながら|増やしながら|減らしながら|減らしながら/g)||[]).length;
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

//1選択肢を文字列にして取得する
function makeStringFromItem(item){
	var line = "";

	for(var i = 0; i < item.childElementCount; i++){
		if(typeof item.childNodes[i].innerHTML != "undefined"){
			if(item.childNodes[i].getAttribute('data-tag') == 'select'){
				line += item.childNodes[i].pd.value + " ";
			}else if(item.childNodes[i].getAttribute('data-tag') == 'input'){
				line += item.childNodes[i].keyboard.value+ " ";
			}else if(item.childNodes[i].getAttribute('data-tag') == 'span'){
				line += item.childNodes[i].textContent+ " ";
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
		var elt = makeStringFromItem(answerArea.childNodes[i]);
		code += toJS(elt) +"\n";
	}
	return code;

}

//1行ごとに変換を行う
//**TODO
//*全角スペースの除去
//*1ずつ増やしながら...の1ずつ以外も実装
function toJS(line){
	//xDNCL→JavaScript
	console.log(line);
	for(var i = 0; i < line.length ; i++){
		console.log(line.charAt(i));
	}


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
	if(line.includes("を改行なしで表示する")){
		line = "outputLessReturn("+ line.replace(/を改行なしで表示する/g,"")+")";
	}

	if(line.includes("を実行する")){
		line = "}";
	}

	if(line.includes("を繰り返す")){
		line = "}";
	}

	if(line.includes("を実行し，そうでなければ")){
		line = "} else {";
	}
	if(line.includes("を実行し，そうでなければ")){
		line = "} else {";
	}

	if(line.includes("を実行し，そうでなくもし")){
		line = line.replace(/を実行し，そうでなくもし/g,"");
		line = "} else if("+ line.replace(/ならば/g,""); +"){";
	}
	if(line.includes("を実行し，そうでなくもし")){
		line = line.replace(/を実行し，そうでなくもし/g,"");
		line = "} else if("+ line.replace(/ならば/g,""); +"){";
	}

	if(line.includes("もし")){
		line = line.replace(/もし/g,"");
		line = "if("+line.replace(/ならば/g,"")+"){";
	}
	if(line.includes("もし")){
		line = line.replace(/もし/g,"");
		line = "if("+line.replace(/ならば/g,"")+"){";//注意！！ 「ならは+ ゙」
	}

	if(line.includes("の間，")){
		line = "while(" + line.replace(/の間，/g,"") + "){";
	}

	//濁点が独立
	if(line.includes("ずつ増やしながら，")){
		var equation =  line.replace(/を|から|まで/g,",").replace(/ずつ増やしながら，/g,"").split(",");
		line = "for("+ equation[0] + " = " +  equation[1] + ";" + equation[0] + "<="+ equation[2] + ";" + equation[0] + "+=" +equation[3] + "){";
	}

	//濁点が結合
	if(line.includes("ずつ増やしながら，")){
		var equation =  line.replace(/を|から|まで/g,",").replace(/ずつ増やしながら，/g,"").split(",");
		line = "for("+ equation[0] + " = " +  equation[1] + ";" + equation[0] + "<="+ equation[2] + ";" + equation[0] + "+=" +equation[3] + "){";
	}

	//濁点が独立
	if(line.includes("ずつ減らしながら，")){
		var equation =  line.replace(/を|から|まで/g,",").replace(/ずつ減らしながら，/g,"").split(",");
		line = "for(" + equation[0] + " = " + equation[1] + ";" + equation[0] + "<="+ equation[2] + ";" + equation[0] + "-=" +equation[3] + "){";
	}

	//濁点が結合
	if(line.includes("ずつ減らしながら，")){
		var equation =  line.replace(/を|から|まで/g,",").replace(/ずつ減らしながら，/g,"").split(",");
		line = "for(" + equation[0] + " = " + equation[1] + ";" + equation[0] + "<"+ equation[2] + ";" + equation[0] + "-=" +equation[3] + "){";
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
