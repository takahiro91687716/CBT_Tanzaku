var outDir = './file/';
var extention = '.xml';

var area = null;
var editArea = null;
var itemsArea = null;
var answerArea = null;
var answerBox = null;

//選択肢をドラッグした時に
//データを渡す
function itemDragStart(e) {
	e.dataTransfer.setData('text/html',e.target.id);
}

//--------------------------------------------------
// ページロードこっちでもいいかも
//--------------------------------------------------
function setElement(){
  area = document.getElementById('area');
  editArea = document.getElementById("itemText");

  itemsArea = document.getElementById("itemsArea");
  answerArea = document.getElementById("answerArea");
  answerBox = document.getElementById("answerAreaBox");

  setEvent();
  addFile();
}

function setEvent(){
  console.log("イベント処理を設定します");
	editArea.ondragover = prev;//
  answerArea.ondragover = prev;
  answerArea.ondrop = dropToAnswerArea;
	itemsArea.ondragover = prev;
  itemsArea.ondrop = dropToItemsArea;
	area.ondragover = prev;
	area.ondrag = prev;
	area.ondrop = trashItem;
}

/** エディットエリアでの挙動 */
function dropToEditArea(e){
	trashFlug = false;
  var id = e.dataTransfer.getData("text/html");
	var elm = document.getElementById(id);
  console.log("idは"+id);
  if((/sample\d/).test(id)){
    editArea.value += elm.getAttribute('data-value');
  }else if((/\d+/).test(id)){
		for(var i = 0; i < elm.childElementCount;i++){
			editArea.value += elm.childNodes[i].getAttribute('data-value');
		}
    removeItem(elm);
  }
  e.preventDefault();
}

function trashItem(e){
	var id = e.dataTransfer.getData("text/html",e.target.id);
	var elm = document.getElementById(id);
	if(trashFlug){
		removeItem(elm);
	}else{
		trashFlug = true;
	}
}

function removeItem(rmElm){
	var parent = rmElm.parentElement
  parent.removeChild(rmElm);
	moveUpContainer(parent);
}

function moveUpContainer(blank){
	var area = null;
	var areaname = blank.getAttribute('data-area');
	if(areaname=='answerArea'){
		area = answerArea;
	}else if(areaname=='itemsArea'){
		area = itemsArea;
	}else{
		console.log(areaname);
	}

	for(var i = Number(blank.getAttribute('data-number')); i < area.childElementCount-1;i++){
		console.log(areaname+'の'+(Number(i)+1)+"番を移動");
		//移動対象要素の取得
		var tmpElt = document.getElementById(areaname+"Container-"+(Number(i)+1)).childNodes[0];
		document.getElementById(areaname +"Container-"+i).appendChild(tmpElt);
	}
	//余分な欄を消す
  area.removeChild(document.getElementById(areaname+"Container-"+(area.childElementCount-1)));
}

function moveDownContainer(point){
	var area = null;
	var areaname = point.getAttribute('data-area')
	if(areaname=='answerArea'){
		area = answerArea;
	}else if(areaname=='itemsArea'){
		area = itemsArea;
	}

	for(var i = area.childElementCount-1; Number(point.getAttribute('data-number')) < i;i--){
		console.log(areaname+'の'+(Number(i)-1)+"番を移動");
		//移動対象要素の取得
		var tmpElt = document.getElementById(areaname+"Container-"+(Number(i)-1)).childNodes[0];
		var moveTo = document.getElementById(areaname+"Container-"+i)
		console.log(tmpElt);
		console.log(moveTo);
		moveTo.appendChild(tmpElt);
	}
}

var textInput = document.createElement('input');
textInput.type = 'text';
textInput.setAttribute('readonly',true);

var numberInput = document.createElement('input');
numberInput.type = 'number';
numberInput.setAttribute('readonly',true);

var pullDown = document.createElement('select');

//エディットエリアからビルドエリアへ移した時のパーツの変換
function buildPartsForItemArea(parent){
	var str = editArea.value

  var num = str.match(/【\s*\d+\s*】/g);
  var text = str.match(/［\s*.*?\s*］/g);
  var pd = str.match(/｛\s*.*?\s*｝/g);

	if(num){
		for(var i = 0; i < num.length;i++){
      str = str.replace(num[i],'(@num'+i+')');
    }
	}

	if(text){
		for(var i = 0; i < text.length;i++){
      str = str.replace(text[i],'(@text'+i+')');
    }
	}

	if(pd){
		for(var i = 0; i < pd.length;i++){
      str = str.replace(pd[i],'(@pd'+i+')');
    }
	}

	// (@~~~番号)を区切り文字として使用することで特殊部品以外を取得する
	var normal =str.split(/\(@.*?\d\)/);

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
		console.log(str);
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

	var elements = str.match(/\(.*?\)/g);

	for(var i = 0; i < elements.length;i++){
		var child = null;

		if(elements[i].includes('@normal')){
			child = document.createElement('span');
			var number = elements[i].match(/\d/);
			var target = normal[number];
			child.setAttribute('data-value',target);
			child.innerHTML = target;

		}else if(elements[i].includes('@num')){
			child = numberInput.cloneNode(true);
			var number = elements[i].match(/\d/);
			var target = num[number];
			child.setAttribute('data-value',target);
			target = target.substring(1, target.length - 1).replace(/\s+/g,"");
			child.value = target;

		}else if(elements[i].includes('@text')){
			child = textInput.cloneNode(true);
			var number = elements[i].match(/\d/);
			var target = text[number];
			child.setAttribute('data-value',target);
			target = target.substring(1, target.length - 1).replace(/\s+/g,"");
			child.value = target;

		}else if(elements[i].includes('@pd')){
			child = pullDown.cloneNode(true);
			var number = elements[i].match(/\d/);
			var target = pd[number];
			child.setAttribute('data-value',target);
			var options = target.substring(1, target.length - 1).replace(/\s+/g,"").split('｜');
			for(var j = 0; j < options.length;j++){
				var son = document.createElement("option");
				son.value = options[j];
				son.innerHTML = options[j];
				child.appendChild(son);
			}
		}else{
			console.log('変換失敗');
		}
		parent.appendChild(child);
	}
}


var trashFlug = true;
function dropToAnswerArea(e){
	trashFlug = false;
	var id = e.dataTransfer.getData("text/html",e.target.id);
	var elm = document.getElementById(id);
	var to = answerArea.childElementCount;
	if(!containerCall){
	if(elm.getAttribute('data-type')=='item'){
		var parent = elm.parentElement;
		//itemsareaからanswerarea
		//answerareaの最後尾に追加
		addItemByDrop('answerArea',elm,to);
		//追加後itemsareaのコンテナ１つ消す
		moveUpContainer(parent);
	}else if (elm.getAttribute('data-type')=='answer') {
		//answerareaからanswerarea
		//answerareaの最後尾に移動
		var from = Number(elm.parentElement.getAttribute('data-number'));
		insertLower('answerArea',from,(to-1));
	}else{
		console.log('例外：dropToAnswerArea');
	}}else{containerCall = false;}
}

function dropToItemsArea(e){
	trashFlug = false;
	var id = e.dataTransfer.getData("text/html",e.target.id);
	var elm = document.getElementById(id);
	var to = itemsArea.childElementCount;
	if(!containerCall){
	if(elm.getAttribute('data-type')=='answer'){
		var parent = elm.parentElement;
		//itemsareaからanswerarea
		//answerareaの最後尾に追加
		addItemByDrop('itemsArea',elm,to);
		//追加後itemsareaのコンテナ１つ消す
		moveUpContainer(parent);
	}else if (elm.getAttribute('data-type')=='item') {
		//answerareaからanswerarea
		//answerareaの最後尾に移動
		var from = Number(elm.parentElement.getAttribute('data-number'));
		insertLower('itemsArea',from,(to-1));
	}else{
		console.log('例外：dropToItemsArea');
	}
}else{
	containerCall = false;
}
}

// toは移動先
function addItemByDrop(areaname,elm,to){

	//移動先によって属性を変更する
	if(areaname=='answerArea'){
		if(elm.getAttribute('data-unique')){
	    elm.setAttribute('data-unique','');
	    elm.style. backgroundColor = '';
	  }
		elm.setAttribute('data-type','answer');
	  elm.classList.add("answer");
		elm.ondblclick = '';
	}else if(areaname=='itemsArea'){
		elm.setAttribute('data-type','item');
	  elm.classList.remove("answer");
		elm.ondblclick = changeToUnique;
	}

  makeContainer(areaname);
	console.log(to+'に移動');
	var point = document.getElementById(areaname+'Container-'+to)

	//to以降ずらす
	moveDownContainer(point);
	point.appendChild(elm);
}

var idc = 0;
var itemOrigin = document.createElement("div");
itemOrigin.classList.add("item");
itemOrigin.setAttribute('data-type','item');
itemOrigin.setAttribute('data-unique','');
function addItemToItemsArea(){
  if(0 < editArea.value.length){
		var item = itemOrigin.cloneNode(true);
		item.id = idc++;
		item.draggable = true;
		item.ondragstart = itemDragStart;
		item.ondblclick = changeToUnique;

		buildPartsForItemArea(item);
		makeContainer('itemsArea').appendChild(item);
    editArea.value = "";
  }else{
    alert("空の選択肢は置けません！");
  }
}

var containerOrigin = document.createElement("div");
containerOrigin.classList.add("container");
function makeContainer(areaname){
	var area = null;
	if(areaname == 'itemsArea'){
		area = itemsArea;
	}else if(areaname == 'answerArea'){
		area = answerArea;
	}else{
		console.log('関数：makeContainerでエラー')
	}

	var number = area.childElementCount
	var container = containerOrigin.cloneNode(true);
	container.id = areaname + 'Container-' + number;
	container.setAttribute('data-number',number);
	container.setAttribute('data-area',areaname);

	container.ondragover = prev;
	container.ondrag = prev;
	container.ondrop = dropToContainer;
	area.appendChild(container);

	return container;
}

function prev(e) {
	if(e.preventDefault) {
		e.preventDefault();
	}
}

var containerCall = false;
function dropToContainer(e){
	containerCall = true;
	console.log("ドロップ：コンテナ");
	var id = e.dataTransfer.getData("text/html",e.target.id);
	var elm = document.getElementById(id);
	var parent = elm.parentElement;

  var divClientRect = this.getBoundingClientRect();
  var harfOfdiv = divClientRect.height/2;
  var mouseY = e.clientY;
  var from = Number(parent.getAttribute('data-number'));
	var fromArea = parent.getAttribute('data-area');
  console.log("fromのidは："+from);
	console.log("fromのareaは："+fromArea);

	var to = Number(this.getAttribute('data-number'));
	var toArea = this.getAttribute('data-area');
  console.log("toのidは："+to);
	console.log("toのareaは："+toArea);

	if(fromArea == toArea){
		if(mouseY<(divClientRect.top+harfOfdiv)){
			console.log("要素移動（同じエリア）");
	    //上半分に落とされた時
	    console.log("上半分に落とされました");
	    insertUpper(toArea,from,to);
	  }else if((divClientRect.top+harfOfdiv)<=mouseY){
	    console.log("下半分に落とされました");
	    //下半分に落とされた時
	    insertLower(toArea,from,to);
	  }
	}else{
		if(mouseY<(divClientRect.top+harfOfdiv)){
			console.log("要素移動（違うエリア）");
	    //上半分に落とされた時
	    console.log("上半分に落とされました");
			console.log(fromArea+"の"+from+'から'+toArea+'の'+to);
	    addItemByDrop(toArea,elm,to);
	  }else if((divClientRect.top+harfOfdiv)<=mouseY){
	    console.log("下半分に落とされました");
	    //下半分に落とされた時
			console.log(fromArea+"の"+from+'から'+toArea+'の'+(to+1));
	    addItemByDrop(toArea,elm,(to+1));
	  }
	}

}

function changeToUnique(e){
  if(this.getAttribute('data-unique')){
    this.setAttribute('data-unique','');
    this.style. backgroundColor = '#FFFFCC';
  }else {
    this.setAttribute('data-unique','true');
    this.style.backgroundColor = '#CCFFFF';
  }
}

/** 上半分にドロップされた時 */
function insertUpper(areaname,from,to){

  console.log(from+"から"+to);
  var insert = document.getElementById(areaname+"Container-"+from).childNodes[0];

  if(from<to){
    //上から下へ持ってきた時
    to--;
    for(var i = from; i < to ; i++){
      console.log("上から下へ持ってきました");
      console.log(i+"を動かす：to"+to+",from"+from);
      var tmpElt = document.getElementById(areaname+"Container-"+(Number(i)+1)).childNodes[0];
      document.getElementById(areaname+"Container-"+Number(i)).appendChild(tmpElt);
    }
  }else{
    //下から上へ持ってきた時、または同値
    for(var i = from; to < i; i--){
      console.log("下から上へ持ってきました");
      console.log(i+"を動かす：to"+to+",from"+from);
      var tmpElt = document.getElementById(areaname+"Container-"+(Number(i)-1)).childNodes[0];
      document.getElementById(areaname+"Container-"+Number(i)).appendChild(tmpElt);
    }
  }
  document.getElementById(areaname+"Container-"+to).appendChild(insert);
}

/** 下半分にドロップされた時 */
function insertLower(areaname,from,to){
  console.log(from+"から"+to);
  var insert = document.getElementById(areaname+"Container-"+from).childNodes[0];

  if(to<from){
    //下から上へ持ってきた時
    to++;
    for(var i = from; to < i; i--){
      console.log("下から上へ持ってきました");
      console.log(i+"を動かす：to"+to+",from"+from);
      var tmpElt = document.getElementById(areaname+"Container-"+(Number(i)-1)).childNodes[0];
      document.getElementById(areaname+"Container-"+Number(i)).appendChild(tmpElt);
    }
  }else{
    //上から下へ持ってきた時、または同値
    for(var i = from; i < to ; i++){
      console.log("上から下へ持ってきました");
      console.log(i+"を動かす：to"+to+",from"+from);
      var tmpElt = document.getElementById(areaname+"Container-"+(Number(i)+1)).childNodes[0];
      document.getElementById(areaname+"Container-"+Number(i)).appendChild(tmpElt);
    }
  }
  document.getElementById(areaname+"Container-"+to).appendChild(insert);
}

var displayAnswer = false;
function setAnswerArea(){
  if(displayAnswer){
    console.log("解答欄を非表示にします");
    answerBox.style.display = 'none';
    document.getElementById("dispAnswer").value = "解答欄表示";
    displayAnswer = false;
  }else{
    console.log("解答欄を表示します");
    answerBox.style.display = 'block';
    document.getElementById("dispAnswer").value = "解答欄非表示";
    displayAnswer = true;
  }
}

var displayFilelist = false;
function openFilelist(){
  if(displayFilelist){
    console.log("ファイルを非表示にします");
    filelist.style.display = 'none';
    displayFilelist = false;
  }else{
    console.log("ファイルを表示します");
    filelist.style.display = 'block';
    displayFilelist = true;
  }
}


function toXML(){
  var xml = "<?xml version='1.0' encoding='UTF-8'?>\n<doc>\n<question>\n";

  xml += "<text>\n"+document.getElementById("questionText").value+"\n</text>\n";

  for(var i = 0; i < numOfChoice; i++){
    var elm = document.getElementById("canvas-"+i).childNodes[0];
    if(elm.id.includes("unique")){
      xml += "<item unique='true'>\n";
    }else{
      xml += "<item>\n";
    }
    xml += exXml(elm.innerHTML)+"\n";
    xml += "</item>\n";
  }

  xml+="</question>\n</doc>";

  return xml;
}

function exXml(str){
  var num = str.match(/<input type='number' readonly='true' value='\s*\d+\s*'>/g);
  var text = str.match(/<input type='text' readonly='true' value='\s*.*?\s*'>/g);
  var pd = str.match(/<select><option>\s*.*?\s*<\/option><\/select>/g);

  if(num != null){
    for(var i = 0; i < num.length;i++){
      str = str.replace(num[i],"{number:"+num[i].substring(numInput.length,num[i].length-endOfInput.length).replace(/\s+/g,"")+"}");
    }
  }
  if(text != null){
    for(var i = 0; i < text.length;i++){
      str = str.replace(text[i],"{text:"+text[i].substring(textInput.length,text[i].length-endOfInput.length)+"}");
    }
  }
  if(pd != null){
    for(var i = 0; i < pd.length;i++){
      str = str.replace(pd[i],"{pullDown:"+pd[i].substring(topOfPullDown.length,pd[i].length-endOfPullDown.length).replace(/<\/option><option>/g,",")+"}");
    }
  }
  return str;
}

function download(blob, filename) {
  var objectURL = (window.URL || window.webkitURL).createObjectURL(blob),
      a = document.createElement('a');
      e = document.createEvent('MouseEvent');

  //a要素のdownload属性にファイル名を設定
  a.download = filename;
  a.href = objectURL;

  //clickイベントを着火
  e.initEvent("click", true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
  a.dispatchEvent(e);
}

function getFilename(){
  var str = document.getElementById("filename").value;
  if(str.includes(".xml")){
    str = str.replace(/\.xml/g,"");
  }
  return str + ".xml";
}

function getFile(filename){
  download(new Blob([window.sessionStorage.getItem(filename)]), getFilename());
}

function writeSessionStorage(){
  if(window.sessionStorage){
    window.sessionStorage.setItem(getFilename() , toXML());
  }
  addFile();
}

function addFile(){
  filelist.innerHTML = "";
  // ウェブストレージに対応している
  if(window.sessionStorage){
    for(var i=0;i< window.sessionStorage.length;i++){
      // 位置を指定して、ストレージからキーを取得する
      var name = window.sessionStorage.key(i);

      filelist.innerHTML += "<input type='button' class='tools' value='読み込み' onclick='removeFile(\""+name+"\")'>";
      filelist.innerHTML += "<input type='button' class='tools' value='書き出し' onclick='getFile(\""+name+"\")'>"
      filelist.innerHTML += "<input type='button' class='tools' value='削除' onclick='removeFile(\""+name+"\")'>";
      filelist.innerHTML +="ファイル名：" + name +"<br>";
    }
  }
}

function removeFile(key){
  // ウェブストレージに対応している
  if(window.sessionStorage){
    // 指定したキーに保存したデータを削除する
    window.sessionStorage.removeItem(key);
    addFile();
  }
}

var minOfWidth = 350;
function fixWidth(areaname){
  var fixValue = document.getElementById(areaname+"Width").value;
  if(fixValue||horizontal){
    if(fixValue < minOfWidth){
      fixValue = minOfWidth;
    }
    fixWidth2(areaname,fixValue);
  }else{
    document.getElementById(areaname+"Box").style.width = "";
  }
}

//内部操作用
function fixWidth2(areaname,fixValue){
  var fixArea = document.getElementById(areaname+"Box");
  document.getElementById(areaname+"Width").value = fixValue;
  fixArea.style.width = fixValue + "px";
}

var minOfHeight = 250;
function fixHeight(areaname){
  var fixValue = document.getElementById(areaname+"Height").value;
  if(fixValue){
    if(fixValue < minOfHeight){
      fixValue = minOfHeight;
    }
    if(!horizontal){
      fixHeight2(areaname,fixValue);
    }else{
      fixHeight2("answerArea",fixValue);
      fixHeight2("itemsArea",fixValue);
    }
  }else{
    document.getElementById(areaname+"Fixed").style.height = "";
  }
}

function fixHeight2(areaname,fixValue){
  var fixArea = document.getElementById(areaname+"Fixed");
  document.getElementById(areaname+"Height").value = fixValue;
  fixArea.style.height = fixValue + "px";
}

var horizontal = false;
function changeHorizontal(){
  var fixArea = document.getElementById("layout");
  if(!horizontal){
    fixArea.classList.add("horizontal");
    fixWidth2("answerArea",minOfWidth);
    fixWidth2("itemsArea",minOfWidth);
    horizontal = true;
  }else{
    fixArea.classList.remove("horizontal");
    horizontal = false;
  }
}
