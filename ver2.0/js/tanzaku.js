//XMLHttpRequestオブジェクトを生成
var xhr = new XMLHttpRequest();

//問題ファイル
var question = null;

//変数用
var variable = "変数：<input type=number></input> = <input type=number></input>";
//自由欄
var freeLine = "<input type> </input>";

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

	//全解答欄でアクション指定
	var canvas = document.getElementsByClassName("canvas");
	for(var i = 0; i < canvas.length ; i++){
		canvasAction(canvas[i]);
	}

	var bound = document.getElementsByClassName("bound");
	for(var i = 0; i < bound.length ; i++){
		boundAction(bound[i]);
	}

	//全選択肢欄でアクション指定
	var choices = document.getElementsByClassName("choices");
	for(var i = 0; i < choices.length ; i++){
		removeItem(choices[i]);
	}
}

//--------------------------------------------------
// "(number)問目"を作成する関数
//--------------------------------------------------
function buildQuestion(number){
	var textList = question[number].getElementsByTagName('text');
	var itemList = question[number].getElementsByTagName('item');

	//問題要素を表示する領域の生成
	buildArea(number);

	//問題文埋め込み
	document.getElementById("text"+number).innerHTML += "<p>" + textList[0].childNodes[0].nodeValue + "</p>";

	//選択肢埋め込み
	for(i = 0; i < itemList.length; i++) {
		var str = "<div id= \"i-"+ number + "-" + i + "\"";//idは(i,問題番号,選択肢何個目)
		str += "draggable = \"true\""; //ドラッグできるように
		str += "ondragstart=\"itemDragStart(event)\">" ;
		str += buildChoiceParts(itemList[i]);
		str += "</div>";
		document.getElementById("choices"+number).innerHTML += str;
	}
}

//--------------------------------------------------
//一つの問いの構成要素を設置する
//--------------------------------------------------
function buildArea(number){
	var area = document.getElementById("area");

	//問題文領域の生成
	var question = "<h3>問題 ("+(number+1)+")</h3>";//X問目だから+1してる
	question+= "<div id=\"waku1\">";
	question+= "<div id=\"text"+number+"\"></div>";
	question+= "</div>";
	area.innerHTML += question;

	//解答欄領域の生成
	var answer = "<h3>解答欄</h3>";
	answer+= "<div id=\"waku2-"+number+"\" class=\"waku2\">";
	answer+= "<div id=\"bound-"+number+"-"+0+"\" class=\"bound\"></div>";
	answer+= "</div>";
	answer+= "</div>";
	area.innerHTML += answer;
	document.getElementById("bound-"+number+"-0").style.height = 100 + '%';

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


function buildChoiceParts(item){
	var str = item.childNodes[0].nodeValue;
	return pickBrace(str);
}

function pickBrace(str){
	//最短マッチで探す
	var seq = str.match(/\{(.*?)\}/g);
	var regExp = null;

	if(seq){
		for(var i = 0; i < seq.length;i++){
			var target = seq[i].substring(1, seq[i].length - 1);
			var pull = target.split(",")
			var result = "";

			if(1 < pull.length){
				result = buildBrace(pull);
			}else if(target == ""){
				result = "<input type=text style=\"width:30px;\"></input>";
			}else if(target == "number"){
				result = "<input type=number style=\"width:30px;\"></input>";
			}else{
				result = seq[i];
			}
			regExp = new RegExp("{"+target+"}", "g") ;
			str = str.replace( regExp , result) ;
		}
	}
	return str;
}

function buildBrace(choices){

	var text = "<select>";

	for(var i = 0; i < choices.length;i++){
		text += "<option value = \""+choices[i]+"\">"+choices[i]+"</option>";
	}

	text += "</select>";
	return text;
}

//選択肢をドラッグした時に
//データを渡す
function itemDragStart(e) {
	e.dataTransfer.setData('text/html',e.target.id);
}

//--------------------------------------------------
//バウンドの動作
//空行欄にドロップされたときに発火させる
// 1)選択肢欄からの要素ドロップ
// 2)解答欄からの要素ドロップ
//--------------------------------------------------
function boundAction(bound){
	bound.ondragover = prev;
	bound.ondrag=prev;

	// バウンドにドロップされた場合に発火
	bound.ondrop = function(e){

		//boundId[0]：空白欄識別用 bound
		//boundId[1]：問題番号識別用 問題番号
		//boundId[2]：空白欄番号
		var boundId = this.id.split("-");

		// ドロップされた選択肢の取得
		var item = document.getElementById(e.dataTransfer.getData('text/html'));

		//itemId[0]：選択肢識別用 i
		//itemId[1]：問題番号識別用 問題番号
		//itemId[2]：選択肢番号識別用 選択肢番号
		//or
		//itemId[0]：選択肢識別用 c
		//itemId[1]：解答済み選択肢識別用 idc (重複無しのため)
		//itemId[2]：問題番号識別用 問題番号
		//itemId[3]：選択肢番号識別用 選択肢番号
		//itemId[4]：解答欄識別用 解答欄番号
		var itemId = item.id.split("-");

		var number = boundId[1];

		if(itemId[0]=="i"){
			dropI(item,bound);
		}else{
			dropC(item,bound);
		}
		//}
	}
}

function dropC(item,bound){

	//itemId[0]：選択肢識別用 c
	//itemId[1]：解答済み選択肢識別用 idc (重複無しのため)
	//itemId[2]：問題番号識別用 問題番号
	//itemId[3]：選択肢番号識別用 選択肢番号
	//itemId[4]：解答欄識別用 解答欄番号
	itemId = item.id.split("-");
	boundId = bound.id.split("-");
	var number = itemId[2];
	var waku2 = document.getElementById("waku2-"+number);

	//itemId[4]とboundId[2]を比較する
	if(itemId[4] > boundId[2]){
		for(var i = itemId[4];boundId[2]<i;i--){
			//移動対象要素の取得
			var elt = document.getElementById("canvas-"+number+"-"+(Number(i)-1)).childNodes[0];
			//IDの分割
			var tmpId = elt.id.split("-");
			//IDの書き換え
			elt.id = tmpId[0]+"-"+tmpId[1]+"-"+tmpId[2]+"-"+tmpId[3]+"-"+i;
			document.getElementById("canvas-"+number+"-"+i).appendChild(elt);
		}
		item.id = itemId[0]+"-"+itemId[1]+"-"+itemId[2]+"-"+itemId[3]+"-"+boundId[2];
		document.getElementById("canvas-"+number+"-"+boundId[2]).appendChild(item);
	}else if((itemId[4]+1) >= boundId[2]){
		//ここは何もしない
		//ロジックわかりやすくするために書いてるだけ
	}else if(itemId[4] < boundId[2]){
		for(var i = itemId[4];i<boundId[2]-1;i++){
			//移動対象要素の取得
			var elt = document.getElementById("canvas-"+number+"-"+(Number(i)+1)).childNodes[0];
			//IDの分割
			var tmpId = elt.id.split("-");
			//IDの書き換え
			elt.id = tmpId[0]+"-"+tmpId[1]+"-"+tmpId[2]+"-"+tmpId[3]+"-"+i;
			document.getElementById("canvas-"+number+"-"+i).appendChild(elt);
		}
		item.id = itemId[0]+"-"+itemId[1]+"-"+itemId[2]+"-"+itemId[3]+"-"+(Number(boundId[2])-1);
		document.getElementById("canvas-"+number+"-"+(Number(boundId[2])-1)).appendChild(item);
	}
}

function dropI(item,bound){

	//itemId[0]：選択肢識別用 i
	//itemId[1]：問題番号識別用 問題番号
	//itemId[2]：選択肢番号識別用 選択肢番号
	var itemId = item.id.split("-");
	var boundId = bound.id.split("-");
	var number = itemId[1];

	var waku2 = document.getElementById("waku2-"+number);

	//縦100%のboundの状態削除
	document.getElementById("bound-"+number+"-"+Math.floor(waku2.childElementCount/2)).style.height = '';

	//解答欄と空欄を増やす
	var newDiv0 = document.createElement("div");
	newDiv0.id = "canvas-"+number+"-"+Math.floor(waku2.childElementCount/2);
	newDiv0.classList.add("canvas");

	var newDiv1 = document.createElement("div");
	newDiv1.id = "bound-"+number+"-"+(Math.floor(waku2.childElementCount/2)+1);
	newDiv1.classList.add("bound");

	var waku2 = document.getElementById("waku2-"+number);
	waku2.appendChild(newDiv0);
	waku2.appendChild(newDiv1);

	//最下boundの縦を100%へ
	newDiv1.style.height = 100 + '%';

	//追加した欄にアクションの設定
	canvasAction(newDiv0);
	boundAction(newDiv1);

	//1つずつずらして挿入する
	for(var i = Math.floor(waku2.childElementCount/2)-1; i > boundId[2]; i--){
		//移動対象要素の取得
		var elt = document.getElementById("canvas-"+number+"-"+(Number(i)-1)).childNodes[0];
		//IDの分割
		var tmpId = elt.id.split("-");
		//IDの書き換え
		elt.id = tmpId[0]+"-"+tmpId[1]+"-"+tmpId[2]+"-"+tmpId[3]+"-"+i;
		document.getElementById("canvas-"+number+"-"+i).appendChild(elt);
	}

	//IDの書き換え
	var elt = item.cloneNode(true);
	elt.id = 'c-' + idc++ +"-"+ number+"-"+itemId[2]+"-"+boundId[2];
	document.getElementById("canvas-"+number+"-"+boundId[2]).appendChild(elt);

	indent(waku2);
}

//--------------------------------------------------
//キャンバスの動作
//解答欄にドロップされたときに発火させる
// 1)選択肢欄からの要素ドロップ
// 2)解答欄からの要素ドロップ
//--------------------------------------------------
var idc = 0;
function canvasAction(canvas){

	canvas.ondragover = prev;
	canvas.ondrag=prev;

	// キャンバスにドロップされた場合に発火
	canvas.ondrop = function(e){

		//canvasId[0]：選択肢識別用 canvas
		//canvasId[1]：問題番号識別用 問題番号
		//canvasId[2]：解答欄識別用 解答欄番号
		var canvasId = this.id.split("-");

		// ドロップされた選択肢の取得
		// Stringの"親の親id,選択肢id"状態なので、","で分割
		var elt = document.getElementById(e.dataTransfer.getData('text/html'));

		// if(!elt){
		// 	alert(e.dataTransfer.getData('text/html'));
		// }

		//itemId[0]：選択肢識別用 i
		//itemId[1]：問題番号識別用 問題番号
		//itemId[2]：選択肢番号識別用 選択肢番号
		//or
		//itemId[0]：選択肢識別用 c
		//itemId[1]：解答済み選択肢識別用 idc (重複無しのため)
		//itemId[2]：問題番号識別用 問題番号
		//itemId[3]：選択肢番号識別用 選択肢番号
		//itemId[4]：解答欄識別用 解答欄番号
		var itemId = elt.id.split("-");


		// idが 'i' で始まる要素(選択肢欄からのドロップ)か調べる
		if(itemId[0] == 'i'){
			//問題番号合っているか調べる
			if(canvasId[1] == itemId[1]){

				//解答済みでないことを調べている
				if(canvas.childElementCount != 0){
					canvas.textContent = null;//子を消す
				}

				//元選択肢のクローンを生成
				//クローンのidを新しく設定
				//設定するidは c+ドロップされた番号+元id
				elt = elt.cloneNode(true);
				elt.id = 'c-' + idc++ +"-"+ itemId[1]+"-"+itemId[2]+"-"+canvasId[2];

				//キャンバスへ要素を追加
				canvas.appendChild(elt);
				//インデント調整
				indent(canvas.parentElement);
			}
		}else{
			//idが 'i' で始まらない要素、つまり、
			// 'c'の場合(解答欄からのドロップ)

			//問題番号合っているか調べる
			if(canvasId[1] == itemId[2]){

				//canvasId[2]とitemId1[4]の要素を入れかえる、つまり
				//a-問題番号-canvasId[2]の子とa-問題番号-itemId1[4]をswap
				var tmpElt = canvas.childNodes[0];

				elt.id = itemId[0]+"-"+itemId[1]+"-"+itemId[2]+"-"+itemId[3]+"-"+canvasId[2];//解答欄は変えておく
				canvas.appendChild(elt);//移動だからクローンの必要無し

				//落としたところに既に要素が存在していた場合
				if(tmpElt != null){
					var tmpId = tmpElt.id.split("-");//元要素のidを取っておく
					//もってきた選択肢のもともとの解答欄に
					var swapTo = document.getElementById("canvas"+"-"+itemId[2]+"-"+itemId[4]);
					tmpElt.id = tmpId[0]+"-"+tmpId[1]+"-"+tmpId[2]+"-"+tmpId[3]+"-"+itemId[4];//解答欄は変えておく
					swapTo.appendChild(tmpElt);
					//インデント調整
					indent(canvas.parentElement);
				}
			}
		}
	}
}

//--------------------------------------------------
//choicesの動作
//選択肢欄にドロップされたとき発火させる
// 1)解答済み選択肢の要素ドロップ
//--------------------------------------------------
function removeItem(choices){
	choices.ondragover = prev;
	choices.ondrop = function(e) {
		choiceId = this.id.split("-");
		var rmElt = document.getElementById(e.dataTransfer.getData('text/html'));
		// if(!rmElt){
		// 	alert(e.dataTransfer.getData('text/html'));
		// }
		var itemId = rmElt.id.split("-");


		if(itemId[0]=='c'){//解答済みならば
			rmElt.parentElement.removeChild(rmElt);
			var number = itemId[2];
			var waku2 = document.getElementById("waku2-"+number);

			// //最初の枠消さないように
			// if(3<waku2.childElementCount){
			//例によってずらす
			for(var i = itemId[4];i<Math.floor(waku2.childElementCount/2)-1;i++){
				//移動対象要素の取得
				var elt = document.getElementById("canvas-"+number+"-"+(Number(i)+1)).childNodes[0];
				//IDの分割
				var tmpId = elt.id.split("-");
				//IDの書き換え
				elt.id = tmpId[0]+"-"+tmpId[1]+"-"+tmpId[2]+"-"+tmpId[3]+"-"+i;
				document.getElementById("canvas-"+number+"-"+i).appendChild(elt);
			}
			//余分な欄を消す
			waku2.removeChild(document.getElementById("bound-"+number+"-"+Math.floor(waku2.childElementCount/2)));
			waku2.removeChild(document.getElementById("canvas-"+number+"-"+(Math.floor(waku2.childElementCount/2)-1)));

			//boundの大きさ調整
			document.getElementById("bound-"+number+"-"+Math.floor(waku2.childElementCount/2)).style.height = 100 + '%';
			//インデント調整
			indent(waku2);
		}
	}
}

function prev(e) {
	if(e.preventDefault) {
		e.preventDefault();
	}
}

function indent(waku2){
	//インデントレベル
	var level = 0;
	//何問目か取得
	var number = waku2.id.split("-")[1];

	for(var i = 1; i < Math.floor(waku2.childElementCount); i+= 2){
		var elt = waku2.childNodes[i];
		level -= (elt.textContent.match(/を実行/g)||[]).length
		if(0 < level){
			elt.childNodes[0].style.position = 'relative';
			elt.childNodes[0].style.left = (level * 20)+ 'px';
		}else {
			elt.childNodes[0].style.position = 'relative';
			elt.childNodes[0].style.left = '0px';
			level = 0;
		}
		//次のレベルを増やしておく
		level += (elt.textContent.match(/もし|の間/g)||[]).length;
	}
}



function runCode(number){
	var waku2 = document.getElementById("waku2-"+number);
	var counter = 0;
	var code = [];

	for(var i = 1; i < Math.floor(waku2.childElementCount); i+= 2){
		var elt = waku2.childNodes[i];
		code[counter] = eval(elt);
	}
}

function eval(line){
	var op = "";
	if(line.contains("もし")){

	}else if(line.contains("の間")){

	}else if(line.contains("←")){

	}else if(line.contains("表示する")){

	}else if(line.contains("input()")){

	}
}

function calc(){

}
