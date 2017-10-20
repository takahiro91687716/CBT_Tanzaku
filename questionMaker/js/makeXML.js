var area = "";

var outDir = './file/';
var extention = '.xml';

var number = 0;

var editArea = null;
var tanzakuArea = null;

var title = [
  "<div id=\"titleWaku\" class=\"waku\">",
  "<h3>問題</h3>",
  "<p>以下のテキストエリアに問題文を入力してください</p>",
  "<form name=\"question\">",
  "<textarea name=\"text\" rows=\"4\" cols=\"80\"></textarea>",
  "</form>",
  "</div>"
];

var buildArea = [
  "<div id=\"buildWaku\" class=\"waku\">",
  "<div id=\"buildArea\" style=\"height:100%;\"></div>",
  "</div>"
];

var editArea = [
  "<div id=\"editWaku\" class=\"waku\">",
  "<div id=\"editArea1\" class=\"parts\">",
  "<form name=\"tanzaku\" style=\"display: inline\">",
  "<textarea id=\"Content\" name=\"text\" rows=\"4\" cols=\"80\" ondrop=\"dropToEditArea(event)\"></textarea>",
  "</form>",
  "<input type=\"button\" value=\"追加\" style=\"display: inline\" onclick=\"addTanzaku()\"></input>",
  "</div>",
  "<div id=\"editArea2\" class=\"parts\">",
  "<div id = \"valuableText\" draggable = \"true\" ondragstart=\"editDrag(event)\">　<input type=\"text\" readonly value=\"自由記入欄\"></input>　</div>",
  "<div id = \"valuableNumber\" draggable = \"true\" ondragstart=\"editDrag(event)\">　<input type=\"number\"readonly value=\"99999\"></input>　</div>",
  "<div id = \"pullDown\" draggable = \"true\" ondragstart=\"editDrag(event)\">　<select><option>-未選択-</option><option>選択肢Ａ</option><option>選択肢Ｂ</option></select>　</div>",
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
  tanzakuArea = document.getElementById("buildArea");
}

function dropToEditArea(e){
  var id = e.dataTransfer.getData("text/html");
  console.log("idは"+id);
  if(id.includes("valuableText") || id.includes("valuableNumber") || id.includes("pullDown")){
    editArea.value += buildPartsForEdit(id);
  }else if((/t-\d+/).test(id)){
    editArea.value += backToEdit(id);
  }
  e.preventDefault();
}

var textInput = "<input type=\"text\" readonly value=\"";
var numInput = "<input type=\"number\"readonly value=\"";
var endOfInput = "\"></input>";
var topOfPullDown = "<select><option>";
var slash = "</option><option>"
var endOfPullDown = "</option></select>"
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

function backToEdit(str){
  console.log("good!");
}

function buildPartsForBuild(str){
  var num = str.match(/【\s*\d+\s*】/g);
  var text = str.match(/［\s*[^］]*\s*］/g);
  var pd = str.match(/｛\s*[^］]*\s*｝/g);

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
      //str = str.replace(/｜/g,slash);
    }
  }
  console.log("数値は"+num);
  console.log("テキストは"+text);
  console.log("プルダウンは"+pd);
  console.log(str);
  return str;
}

var count = 0;
function addTanzaku(){
  var newTanzaku = document.createElement("div");
  newTanzaku.id = "t-"+ count++;
  newTanzaku.classList.add("tanzaku");
  newTanzaku.draggable = true;
  newTanzaku.ondragstart = function(e){
    e.dataTransfer.setData('text/html',e.target.id);
  };
  newTanzaku.innerHTML += buildPartsForBuild(editArea.value);
  editArea.value = "";
  tanzakuArea.appendChild(newTanzaku);
}
