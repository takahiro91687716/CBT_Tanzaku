var outDir = './file/';
var extention = '.xml';

var area = null;
var editArea = null;
var buildArea = null;
var answerarea = null;
var answerWaku = null;

//選択肢をドラッグした時に
//データを渡す
function setID(e) {
	e.dataTransfer.setData('text/html',e.target.id);
}

//--------------------------------------------------
// ページロードこっちでもいいかも
//--------------------------------------------------
function setElement(){
  area = document.getElementById('area');
  editArea = document.getElementById("Content");
  editArea.ondragover = prev;//
  buildArea = document.getElementById("itemsarea");
  answerarea = document.getElementById("answerarea");
  answerWaku = document.getElementById("answerareaWaku");

  setEvent();
  addFile();
}

function setEvent(){
  console.log("イベント処理を設定します");
  answerarea.ondragover = prev;
  answerarea.ondrop = addItemToAnswerarea;
}

/** エディットエリアでの挙動 */
function dropToEditArea(e){
  var id = e.dataTransfer.getData("text/html");
  console.log("idは"+id);
  if((/sample\d/).test(id)){
    editArea.value += buildPartsForEdit(id);
  }else if((/t-\d+/).test(id)){
    var elm = document.getElementById(id);
    editArea.value += backToEdit(elm.innerHTML);
    returnItem(elm);
    numOfChoice--;//これbuildArea.childElementCountで代用できるわ
  }
  e.preventDefault();
}

function returnItem(rtElt){
  var itemId = rtElt.id.split("-");
  rtElt.parentElement.removeChild(rtElt);
  //ずらす
  for(var i = itemId[1];i<buildArea.childElementCount-1;i++){
    console.log((Number(i)+1)+"を移動")
    //移動対象要素の取得
    var elt = document.getElementById("canvas-"+(Number(i)+1)).childNodes[0];
    //IDの書き換え
    elt.id = "t-"+i;
    document.getElementById("canvas-"+i).appendChild(elt);
  }
  //余分な欄を消す
  buildArea.removeChild(document.getElementById("canvas-"+(buildArea.childElementCount-1)));
}

//エディットエリアでのパーツ表示に変換
function buildPartsForEdit(id){
  var str = "";
  if(id.includes("sample1")){
    str = "［ 自由記入欄 ］";
  }else if(id.includes("sample2")){
    str = "【 99999 】";
  }else if(id.includes("sample3")){
    str = "｛ 未選択 ｜ 選択肢A ｜ 選択肢B ｝";
  }
  return str;
}

//ビルドエリアからエディットエリアへ移した時のパーツの変換
function backToEdit(str){
  var num = str.match(/<input type=\"number\" readonly=\"true\" value=\"\s*\d+\s*\">/g);
  var text = str.match(/<input type=\"text\" readonly=\"true\" value=\"\s*.*?\s*\">/g);
  var pd = str.match(/<select><option>\s*.*?\s*<\/option><\/select>/g);

  if(num != null){
    for(var i = 0; i < num.length;i++){
      str = str.replace(num[i],"【"+num[i].substring(numInput.length,num[i].length-endOfInput.length).replace(/\s+/g,"")+"】");
    }
  }
  if(text != null){
    for(var i = 0; i < text.length;i++){
      str = str.replace(text[i],"［"+text[i].substring(textInput.length,text[i].length-endOfInput.length)+"］");
    }
  }
  if(pd != null){
    for(var i = 0; i < pd.length;i++){
      str = str.replace(pd[i],"｛"+pd[i].substring(topOfPullDown.length,pd[i].length-endOfPullDown.length).replace(/<\/option><option>/g,"｜")+"｝");
    }
  }
  return str;
}

var textInput = "<input type='text' readonly='true' value='";
var numInput = "<input type='number' readonly='true' value='";
var endOfInput = "'>";
var topOfPullDown = "<select><option>";
var slash = "</option><option>"
var endOfPullDown = "</option></select>";

//エディットエリアからビルドエリアへ移した時のパーツの変換
function buildPartsForBuild(str){
  var num = str.match(/【\s*\d+\s*】/g);
  var text = str.match(/［\s*.*?\s*］/g);
  var pd = str.match(/｛\s*.*?\s*｝/g);

  if(num != null){
    for(var i = 0; i < num.length;i++){
      str = str.replace(num[i],numInput+num[i].substring(1,num[i].length-1).replace(/\s+/g,"")+endOfInput);
    }
  }
  if(text != null){
    for(var i = 0; i < text.length;i++){
      str = str.replace(text[i],textInput+text[i].substring(1,text[i].length-1)+endOfInput);
    }
  }
  if(pd != null){
    for(var i = 0; i < pd.length;i++){
      str = str.replace(pd[i],topOfPullDown+pd[i].substring(1,pd[i].length-1).replace(/｜/g,slash)+endOfPullDown);
    }
  }
  return str;
}


var itemsOfAnswerarea = 0;
var itemBoxForAnswer = document.createElement("div");
//itemBoxForAnswer.classList.add("canvas");
function addItemToAnswerarea(e){
  var addElm = document.getElementById(e.dataTransfer.getData("text/html",e.target.id));
  addElm.id.replace("t","a");
  addElm.id.replace(/\d/,itemsOfAnswerarea);

  var newItemBox = itemBoxForAnswer.cloneNode(true);
  newItemBox.id = "itemBoxA-"+itemsOfAnswerarea++;

  answerarea.appendChild(newItemBox);
  answerarea.appendChild(addElm);
}

var canvasOrigin = document.createElement("div");
canvasOrigin.classList.add("canvas");
var numOfChoice = 0;
function addTanzaku(){
  if(0 < editArea.value.length){
    var newCanvas = canvasOrigin.cloneNode(true);
    newCanvas.id = "canvas-"+ numOfChoice;
    var newTanzaku = document.createElement("div");
    newTanzaku.id = "t-" + numOfChoice ++;
    newTanzaku.classList.add("tanzaku");
    newTanzaku.draggable = true;
    newTanzaku.ondragstart = function(e){
      e.dataTransfer.setData('text/html',e.target.id);
    };
    newTanzaku.innerHTML += buildPartsForBuild(editArea.value);
    newTanzaku.ondragover = prev;
  	newTanzaku.ondrag=prev;
    newTanzaku.ondrop = dropToTanzaku;
    newTanzaku.ondblclick = changeToUnique;
    editArea.value = "";
    buildArea.appendChild(newCanvas);
    newCanvas.appendChild(newTanzaku);
  }else{
    alert("空の選択肢は置けません！");
  }
}

function prev(e) {
	if(e.preventDefault) {
		e.preventDefault();
	}
}

function dropToTanzaku(e){
  var divClientRect = this.getBoundingClientRect();
  var harfOfdiv = divClientRect.height/2;
  var mouseY = e.clientY;
  var from = e.dataTransfer.getData("text/html").split("-");
  console.log("fromのidは："+from);
  var to = this.id.split("-");
  console.log("toのidは："+to);

  if(mouseY<(divClientRect.top+harfOfdiv)){
    //上半分に落とされた時
    console.log("上半分に落とされました");
    insertUpper(from[1],to[1]);
  }else if((divClientRect.top+harfOfdiv)<=mouseY){
    console.log("下半分に落とされました");
    //下半分に落とされた時
    insertLower(from[1],to[1]);

  }
}

function changeToUnique(e){
  var idSplit = this.id.split("-");

  if(idSplit[2] != null){
    this.id = idSplit[0] + "-" + idSplit[1];
    this.style. backgroundColor = '#FFFFCC';
  }else {
    this.id += "-unique";
    this.style.backgroundColor = '#CCFFFF';
  }
}

/** 上半分にドロップされた時 */
function insertUpper(from,to){
  console.log(from+"から"+to);
  var insert = document.getElementById("t-"+from);
  insert.id = "insert";

  if(from<to){
    //上から下へ持ってきた時
    to--;
    for(var i = from; i < to ; i++){
      console.log("上から下へ持ってきました");
      console.log(i+"を動かす：to"+to+",from"+from);
      var tmpElt = document.getElementById("t-"+(Number(i)+1));
      tmpElt.id = "t-"+Number(i);
      document.getElementById("canvas-"+Number(i)).appendChild(tmpElt);
    }
  }else{
    //下から上へ持ってきた時、または同値
    for(var i = from; to < i; i--){
      console.log("下から上へ持ってきました");
      console.log(i+"を動かす：to"+to+",from"+from);
      var tmpElt = document.getElementById("t-"+(Number(i)-1));
      tmpElt.id = "t-"+Number(i);
      document.getElementById("canvas-"+Number(i)).appendChild(tmpElt);
    }
  }
  insert.id = "t-"+to;
  document.getElementById("canvas-"+to).appendChild(insert);
}

/** 下半分にドロップされた時 */
function insertLower(from,to){
  console.log(from+"から"+to);
  var insert = document.getElementById("t-"+from);
  insert.id = "insert";

  if(to<from){
    //下から上へ持ってきた時
    to++;
    for(var i = from; to < i; i--){
      console.log("下から上へ持ってきました");
      console.log(i+"を動かす：to"+to+",from"+from);
      var tmpElt = document.getElementById("t-"+(Number(i)-1));
      tmpElt.id = "t-"+Number(i);
      document.getElementById("canvas-"+Number(i)).appendChild(tmpElt);
    }
  }else{
    //上から下へ持ってきた時、または同値
    for(var i = from; i < to ; i++){
      console.log("上から下へ持ってきました");
      console.log(i+"を動かす：to"+to+",from"+from);
      var tmpElt = document.getElementById("t-"+(Number(i)+1));
      tmpElt.id = "t-"+Number(i);
      document.getElementById("canvas-"+Number(i)).appendChild(tmpElt);
    }
  }
  insert.id = "t-"+to;
  document.getElementById("canvas-"+to).appendChild(insert);
}

var displayAnswer = false;
function setAnswerArea(){
  if(displayAnswer){
    console.log("解答欄を非表示にします");
    answerWaku.style.display = 'none';
    document.getElementById("dispAnswer").value = "解答欄表示";
    displayAnswer = false;
  }else{
    console.log("解答欄を表示します");
    answerWaku.style.display = 'block';
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

function save(){
  download(new Blob([toXML()]), getFilename());
}

function save2(){
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

      // ストレージからデータを取得する
      var value = window.sessionStorage.getItem(name);

      filelist.innerHTML += "<input type='button' class='tools' value='読み込み' onclick='removeFile(\""+name+"\")'>"
      filelist.innerHTML += "<input type='button' class='tools' value='削除' onclick='removeFile(\""+name+"\")'>"
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
    document.getElementById(areaname+"Waku").style.width = "";
  }
}

//内部操作用
function fixWidth2(areaname,fixValue){
  var fixArea = document.getElementById(areaname+"Waku");
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
      fixHeight2("answerarea",fixValue);
      fixHeight2("itemsarea",fixValue);
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
    fixArea.classList.add("yokonarabi");
    fixWidth2("answerarea",minOfWidth);
    fixWidth2("itemsarea",minOfWidth);
    horizontal = true;
  }else{
    fixArea.classList.remove("yokonarabi");
    horizontal = false;
  }
}
