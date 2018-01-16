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
    elm.parentElement.removeChild(elm);
  }
  e.preventDefault();
}

function trashItem(e){
	var id = e.dataTransfer.getData("text/html",e.target.id);
	var elm = document.getElementById(id);
	if(trashFlug){
		elm.parentElement.removeChild(elm);
	}else{
		trashFlug = true;
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
function buildPartsForItemArea(parent,str){

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
	if(!containerCall){
		rewriteAttribute(elm);
		answerArea.appendChild(elm);
	}else{
		containerCall = false;
	}
}

function dropToItemsArea(e){
	trashFlug = false;
	var id = e.dataTransfer.getData("text/html",e.target.id);
	var elm = document.getElementById(id);
	if(!containerCall){
		rewriteAttribute(elm);
		itemsArea.appendChild(elm);
	}else{
		containerCall = false;
	}
}

var idc = 0;
var itemOrigin = document.createElement("div");
itemOrigin.classList.add("item");
itemOrigin.setAttribute('data-locate','itemsArea');
itemOrigin.setAttribute('data-unique','');
function addItemToItemsArea(){
  if(0 < editArea.value.length){
		var item = itemOrigin.cloneNode(true);
		item.id = idc++;
		item.draggable = true;
		item.ondragstart = itemDragStart;
		item.ondblclick = changeToUnique;
		item.ondragover = prev;
		item.ondrop = dropToItem;

		buildPartsForItemArea(item,editArea.value);
		itemsArea.appendChild(item);
    editArea.value = "";
  }else{
    alert("空の選択肢は置けません！");
  }
}

function loadItem(areaname,str,unique){
	var area = null;
	var item = itemOrigin.cloneNode(true);
	item.id = idc++;
	item.draggable = true;
	item.ondragstart = itemDragStart;
	item.ondragover = prev;
	item.ondrop = dropToItem;
	if(areaname=='answerArea'){
		area = answerArea;
		item.setAttribute('data-type','answer');
	  item.classList.add("answer");
	}else if(areaname=='itemsArea'){
		area = itemsArea;
		item.ondblclick = changeToUnique;
		if(unique){
			item.setAttribute('data-unique','true');
	    item.style.backgroundColor = '#CCFFFF';
		}
	}else{
		console.log(areaname);
	}
	buildPartsForItemArea(item,str)
	area.appendChild(item);
}

function prev(e) {
	if(e.preventDefault) {
		e.preventDefault();
	}
}

var containerCall = false;
function dropToItem(e){
	containerCall = true;
	console.log("ドロップ：アイテム");

	var id = e.dataTransfer.getData("text/html",e.target.id);
	var elm = document.getElementById(id);

	var mouseY = e.clientY;
  var divClientRect = this.getBoundingClientRect();
  var harfOfdiv = divClientRect.height/2;
	var elmY = divClientRect.top+harfOfdiv;


	if(elm.getAttribute('data-locate') == this.getAttribute('data-locate')){
		if(mouseY<elmY){
			console.log("要素移動（同じエリア）");
	    //上半分に落とされた時
	    console.log("上半分に落とされました");
			answerArea.insertBefore(elm, this);
	  }else if(elmY<=mouseY){
	    console.log("下半分に落とされました");
	    //下半分に落とされた時
	    answerArea.insertBefore(elm, this.nextSibling);
	  }
	}else{
		if(mouseY<elmY){
			console.log("要素移動（違うエリア）");
	    //上半分に落とされた時
	    console.log("上半分に落とされました");
			moveToAnother(elm,this,true);
	  }else if(elmY<=mouseY){
	    console.log("下半分に落とされました");
	    //下半分に落とされた時
			moveToAnother(elm,this,false);
	  }
	}
}

function moveToAnother(elm1,elm2,before){
	var areaname = elm2.getAttribute('data-locate');

	rewriteAttribute(elm1);

	if(!elm2){
		console.log("末尾に追加");
		answerArea.appendChild(elm1);
	}else if(before){
		elm2.parentElement.insertBefore(elm1,elm2);
	}else{
		elm2.parentElement.insertBefore(elm1,elm2.nextSibling);
	}
}

function rewriteAttribute(elm){
	var areaname = elm.getAttribute('data-locate');

	if(areaname=='answerArea'){
		elm.setAttribute('data-locate','itemsArea');
	  elm.classList.remove("answer");
		elm.ondblclick = changeToUnique;
	}else if(areaname=='itemsArea'){
		if(elm.getAttribute('data-unique')){
	    elm.setAttribute('data-unique','');
	    elm.style. backgroundColor = '';
	  }
		elm.setAttribute('data-locate','answerArea');
	  elm.classList.add("answer");
		elm.ondblclick = '';
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

function openFilelist(){
  window.open('fileOpener.html', 'child', 'width=500,height=250');
}

function loadFile(filename){
	console.log(window.localStorage.getItem(filename));
	var question = window.localStorage.getItem(filename).split('＠');
	console.log(question);

	//作成状態を削除する
	idc = 0;
	while (answerArea.hasChildNodes()) {
		answerArea.removeChild(answerArea.lastChild);
	}
	while (itemsArea.hasChildNodes()) {
		itemsArea.removeChild(itemsArea.lastChild);
	}


	if(question[question.indexOf('[horizontal]')+1] != String(horizontal)){
		changeHorizontal();
	}

	if(question[question.indexOf('[displayAnswer]')+1] !=String(displayAnswer)){
		setAnswerArea();
	}

	document.getElementById("questionText").value = question[question.indexOf('[text]')+1];


	fixWidth2('answerArea',question[question.indexOf('[answerWidth]')+1]);
	fixHeight2('answerArea',question[question.indexOf('[answerHeight]')+1]);

	if(0<question.indexOf('[answerItem]')){
		for(var i = question.indexOf('[answerItem]'); i <= question.lastIndexOf('[answerItem]');i+=2){
			loadItem('answerArea',question[i+1],false);
		}
	}

	fixWidth2('itemsArea',question[question.indexOf('[itemsWidth]')+1]);
	fixHeight2('itemsArea',question[question.indexOf('[itemsHeight]')+1]);

	if(0<question.indexOf('[itemsItem]')){
		for(var i = question.indexOf('[itemsItem]'); i <= question.lastIndexOf('[itemsItem]');i+=3){
			var unique = false;
			if(String(unique) != question[i+2]){
				unique = true;
			}
			loadItem('itemsArea',question[i+1],unique);
		}
	}
}

function dataOfStorage(){
	var str = '';

	str += '[horizontal]＠';
	str += horizontal+'＠';

	str += '[displayAnswer]＠';
	str += displayAnswer+'＠';

	str += '[text]＠';
	str += document.getElementById("questionText").value+'＠';

	str += '[answerWidth]＠';
	str += document.getElementById("answerAreaWidth").value+'＠';
	str += '[answerHeight]＠';
	str += document.getElementById("answerAreaHeight").value+'＠';

	for(var i = 0; i < answerArea.childElementCount;i++){
		str += '[answerItem]＠';
		var item = answerArea.childNodes[i];
		for(var j = 0; j < item.childElementCount;j++){
			str += item.childNodes[j].getAttribute('data-value');
		}
		str += '＠';
	}

	str += '[itemsWidth]＠';
	str += document.getElementById("itemsAreaWidth").value+'＠';

	str += '[itemsHeight]＠';
	str += document.getElementById("itemsAreaHeight").value+'＠';

	for(var i = 0; i < itemsArea.childElementCount;i++){
		str += '[itemsItem]＠';
		var item = itemsArea.childNodes[i];
		for(var j = 0; j < item.childElementCount;j++){
			str += item.childNodes[j].getAttribute('data-value');
		}
		str += '＠';
		str += Boolean(itemsArea.childNodes[i].getAttribute('data-unique')) + '＠';
	}

	return str;
}


function toXML(filename){//上のquestionを読み込めるように変形させる．先にロードつくるか
	var question = window.localStorage.getItem(filename).split('＠');
  var xml = '';
	xml += "<?xml version='1.0' encoding='UTF-8'?>\n";
	xml += "<doc>\n";
	xml += "<question";
	xml += " horizontal='"+question[question.indexOf('[horizontal]')+1]+"'";
	xml += ">\n";

	xml += "<textArea>\n"
  xml += "<text>\n"
	xml += question[question.indexOf('[text]')+1].replace('【','{mark:').replace('】','}');
	xml += "\n</text>\n";
	xml += "</textArea>\n"

	xml += "<answerArea ";
	xml += " width='"+question[question.indexOf('[answerWidth]')+1]+"'";
	xml += " height='"+question[question.indexOf('[answerHeight]')+1]+"'";
	xml += ">\n";
	if(0<question.indexOf('[answerItem]')){
		for(var i = question.indexOf('[answerItem]'); i <= question.lastIndexOf('[answerItem]');i+=2){
			xml += "<item>";
			xml += exchangePartsToXML(question[i+1]);
			xml += "</item>\n";
		}
	}
	xml += "</answerArea>\n";

	xml += "<itemsArea ";
	xml += " width='"+question[question.indexOf('[itemsWidth]')+1]+"'";
	xml += " height='"+question[question.indexOf('[itemsHeight]')+1]+"'";
	xml += ">\n";

	if(0<question.indexOf('[itemsItem]')){
		for(var i = question.indexOf('[itemsItem]'); i <= question.lastIndexOf('[itemsItem]');i+=3){
			var unique = false;
			if(String(unique) != question[i+2]){
				unique = true;
			}
			xml += "<item";
			xml += " unique='"+unique+"'>"
			xml += exchangePartsToXML(question[i+1]);
			xml += "</item>\n";
		}
	}
	xml += "</itemsArea>\n";

  xml+="</question>\n</doc>";

  return xml;
}

function exchangePartsToXML(str){
  str = str.replace(/［/g,'{text:');
	str = str.replace(/【/g,'{number:');
	str = str.replace(/｛/g,'{pullDown:');
	str = str.replace(/｜/g,',');//この辺変えたほうがいいかも
	str = str = str.replace(/］|】|｝/g,'}');
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

function outputFile(filename){
  download(new Blob([toXML(filename)]), getFilename());
}

function writeLocalStorage(){
  if(window.localStorage){
    window.localStorage.setItem(getFilename() , dataOfStorage());
  }
}

function removeFile(filename){
  // ウェブストレージに対応している
  if(window.localStorage){
    // 指定したキーに保存したデータを削除する
    window.localStorage.removeItem(filename);
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
	if(fixValue){
		fixArea.style.width = fixValue + "px";
	}else{
		fixArea.style.width = fixValue;
	}
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
		if(horizontal){
			fixHeight2("answerArea",fixValue);
      fixHeight2("itemsArea",fixValue);
		}else{
			document.getElementById(areaname+"Fixed").style.height = "";
		}
  }
}

function fixHeight2(areaname,fixValue){
  var fixArea = document.getElementById(areaname+"Fixed");
  document.getElementById(areaname+"Height").value = fixValue;
	if(fixValue){
		fixArea.style.height = fixValue + "px";
	}else{
		fixArea.style.height = fixValue;
	}

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
