var area = "";

var outDir = './file/';
var extention = '.xml';

var number = 0;

var editArea = null;
var buildArea = null;
var answerWaku = null;

var title = [
  "<div id=\"titleWaku\" class=\"waku\">",
  "<div id=\"captionForTitle\" class=\"caption\">",
  "<h4>問題文編集エリア</h4>",
  // "<div id=\"titleSizeFix\" class=\"sizeFix\">",
  // "<div id=\"titleSizeFixWidth\">",
  // "<form name=\"titleSize\">",
  // "<label>",
  // "横幅：<input type=\"number\" name=\"titleWidth\">",
  // "</label>",
  // "</form>",
  // "</div>",
  // "<div id=\"titleSizeFixHeight\">",
  // "<form name=\"titleSize\">",
  // "<label>",
  // "縦幅：<input type=\"number\"  name=\"titleHeight\">",
  // "</label>",
  // "</form>",
  // "</div>",
  // "</div>",
  "</div>",
  "<div id=\"titleEditArea\">",
  "<form name=\"question\">",
  "<textarea name=\"text\" rows=\"6\" cols=\"100\"></textarea>",
  "</form>",
  "</div>",
  "</div>"
];

var answerArea = [
  "<div id=\"answerWaku\" class=\"waku\">",
  "<div id=\"captionForAnswer\" class=\"caption\">",
  "<h4>解答欄</h4>",
  "<div id=\"answerSizeFix\" class=\"sizeFix\">",
  // "<div id=\"answerSizeFixWidth\">",
  "<form name=\"answerSize\">",
  "<label>",
  "横幅：<input type=\"number\" name=\"answerWidth\">",
  "</label>",
  // "</form>",
  // "</div>",
  // "<div id=\"answerSizeFixHeight\">",
  // "<form name=\"answerSize\">",
  "<label>",
  "縦幅：<input type=\"number\"  name=\"answerHeight\">",
  "</label>",
  "</form>",
  // "</div>",
  "</div>",
  "</div>",
  "<div id=\"answerArea\"></div>",
  "</div>",
  "</div>"
];

var buildArea = [
  "<div id=\"buildWaku\" class=\"waku\">",
  "<div id=\"captionForBuild\" class=\"caption\">",
  "<h4>選択肢欄</h4>",
  "<div id=\"buildSizeFix\" class=\"sizeFix\">",
  // "<div id=\"buildSizeFixWidth\">",
  "<form name=\"buildSize\">",
  "<label>",
  "横幅：<input type=\"number\" name=\"buildWidth\">",
  "</label>",
  // "</form>",
  // "</div>",
  // "<div id=\"buildSizeFixHeight\">",
  // "<form name=\"buildSize\">",
  "<label>",
  "縦幅：<input type=\"number\"  name=\"buildHeight\">",
  "</label>",
  "</form>",
  // "</div>",
  "</div>",
  "</div>",
  "<div id=\"buildAreaFixed\">",
  "<div id=\"buildArea\" style=\"height:100%;\"></div>",
  "</div>",
  "</div>"
];

var editArea = [
  "<div id=\"editWaku\" class=\"waku\">",
  "<div id=\"captionForEdit\" class=\"caption\">",
  "<h4>選択肢編集エリア</h4>",
  "</div>",
  "<div id=\"box\" class=\"parts\">",
  "<div id=\"editArea1\" class=\"parts\">",
  "<div id=\"editArea2\" class=\"parts\">",
  "<form name=\"tanzaku\" style=\"display: inline\">",
  "<textarea id=\"Content\" name=\"text\" rows=\"4\" cols=\"70\" ondrop=\"dropToEditArea(event)\"></textarea>",
  "</form>",
  "<input type=\"button\" class=\"add\" value=\"追加\" style=\"display: inline\" onclick=\"addTanzaku()\"></input>",
  "</div>",
  "<div id = \"valuableText\" draggable = \"true\" style=\"display: inline\" ondragstart=\"editDrag(event)\">　<input type=\"text\" readonly value=\"自由記入欄\"></input>　</div>",
  "<div id = \"valuableNumber\" draggable = \"true\" style=\"display: inline\" ondragstart=\"editDrag(event)\">　<input type=\"number\"readonly value=\"99999\"></input>　</div>",
  "<div id = \"pullDown\" draggable = \"true\" style=\"display: inline\" ondragstart=\"editDrag(event)\">　<select><option>-未選択-</option><option>選択肢Ａ</option><option>選択肢Ｂ</option></select>　</div>",
  "</div>",
  "<div id=\"setsumeibun\" class=\"parts\">",
  "<p>テキストボックスで選択肢を作成し、ボタンで追加します。３つの部品も選択肢の中で使用することができます。</p>",
  "<p>※ 全角の［ ］、【 】、｛ ｝は使用できません</p>",
  "</div>",
  "</div>",
  "</div>"
];

function start(){
  area = document.getElementById('area');
  area.innerHTML += buildMaker();
  setElement();
}

function buildMaker(){
  var html = '';
  for(var i = 0; i < title.length; i ++){
    html += title[i];
  }
  for(var i = 0; i < answerArea.length; i ++){
    html += answerArea[i];
  }
  for(var i = 0; i < buildArea.length; i ++){
    html += buildArea[i];
  }
  for(var i = 0; i < editArea.length; i ++){
    html += editArea[i];
  }
  return html;
}

//選択肢をドラッグした時に
//データを渡す
function editDrag(e) {
	e.dataTransfer.setData('text/html',e.target.id);
}

function setElement(){
  editArea = document.getElementById("Content");
  buildArea = document.getElementById("buildArea");
  answerWaku = document.getElementById("answerWaku");
}

/** エディットエリアでの挙動 */
function dropToEditArea(e){
  var id = e.dataTransfer.getData("text/html");
  console.log("idは"+id);
  if(id.includes("valuableText") || id.includes("valuableNumber") || id.includes("pullDown")){
    editArea.value += buildPartsForEdit(id);
  }else if((/t-\d+/).test(id)){
    var elm = document.getElementById(id);
    editArea.value += backToEdit(elm.innerHTML);
    removeItem(elm);
    numOfChoice--;//これbuildArea.childElementCountで代用できるわ
  }
  e.preventDefault();
}

function removeItem(rmElt){
  var itemId = rmElt.id.split("-");
  rmElt.parentElement.removeChild(rmElt);
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
  if(id.includes("valuableText")){
    str = "［ 自由記入欄 ］";
  }else if(id.includes("valuableNumber")){
    str = "【 99999 】";
  }else if(id.includes("pullDown")){
    str = "｛ 未選択 ｜ 選択肢A ｜ 選択肢B ｝";
  }
  return str;
}

//ビルドエリアからエディットエリアへ移した時のパーツの変換
function backToEdit(str){
  //new RegExp(numInput+'\s*\d+\s*'+endOfInput,'g');
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

  // console.log("数値は"+num);
  // console.log("テキストは"+text);
  // console.log("プルダウンは"+pd);
  // console.log(str);
  return str;
}

var textInput = "<input type=\"text\" readonly=\"true\" value=\"";
var numInput = "<input type=\"number\" readonly=\"true\" value=\"";
var endOfInput = "\">";
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
  // console.log("数値は"+num);
  // console.log("テキストは"+text);
  // console.log("プルダウンは"+pd);
  // console.log(str);
  return str;
}

var boundOrigin = document.createElement("div");
boundOrigin.classList.add("bound");
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
    newTanzaku.ondrop = dropToTanzaku;//テストだよおおおおおおおおおおおおおおおお
    // var newBound = boundOrigin.cloneNode(true);
    // newBound.id = "bound-"+ ++numOfChoice;
    // newBound.ondragover = prev;
  	// newBound.ondrag=prev;
    // newBound.ondrop = dropToBuildArea;
    editArea.value = "";
    buildArea.appendChild(newCanvas);
    newCanvas.appendChild(newTanzaku);
    // buildArea.appendChild(newBound);
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

var display = false;
function setAnswerArea(){
  if(display){
    console.log("解答欄を非表示にします");
    answerWaku.style.display = 'none';
    display = false;
  }else{
    console.log("解答欄を表示します");
    answerWaku.style.display = 'block';
    display = true;
  }
}


function toXML(){
  var xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<doc>\n<question>";

  xml += "<text>\n"+editArea.value+"\n</text>\n";

  for(var i = 0; i < numOfChoice; i++){
    var elm = document.getElementById("t-"+i);
    xml += "";
    xml += "";
  }

  xml+="</question>\n</doc>";

}
