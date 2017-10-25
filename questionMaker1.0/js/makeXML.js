var area = "";

var outDir = './file/';
var extention = '.xml';

var number = 0;

var editArea = null;
var buildArea = null;

var title = [
  "<div id=\"titleWaku\" class=\"waku\">",
  "<div id=\"setsumei\">",
  "<h4>問題文編集エリア</h4>",
  "<p>以下のテキストエリアに問題文を入力してください。</p>",
  "</div>",
  "<form name=\"question\">",
  "<textarea name=\"text\" rows=\"6\" cols=\"100\"></textarea>",
  "</form>",
  "</div>"
];

var buildArea = [
  "<div id=\"buildWaku\" class=\"waku\">",
  "<div id=\"setsumei\">",
  "<h4>選択肢設置エリア</h4>",
  "<p>追加した選択肢の並び替えが行えます。</p>",
  "</div>",
  "<div id=\"buildAreaFixed\">",
  "<div id=\"buildArea\" style=\"height:100%;\"></div>",
  "</div>",
  "</div>"
];

var editArea = [
  "<div id=\"editWaku\" class=\"waku\">",
  "<div id=\"setsumei\">",
  "<h4>選択肢編集エリア</h4>",
  //"<p>テキストボックスで選択肢を作成し、追加ボタンで。上の３つの部品も選択肢の中で使用することができます。全角の［ ］、【 】、｛ ｝は部品に使用しているので使わないでください。</p>",
  "</div>",
  "<div id=\"editArea1\" class=\"parts\">",
  "<form name=\"tanzaku\" style=\"display: inline\">",
  "<textarea id=\"Content\" name=\"text\" rows=\"2\" cols=\"80\" ondrop=\"dropToEditArea(event)\"></textarea>",
  "</form>",
  "<input type=\"button\" value=\"追加\" style=\"display: inline\" onclick=\"addTanzaku()\"></input>",
  "</div>",
  "<div id = \"valuableText\" draggable = \"true\" style=\"display: inline\" ondragstart=\"editDrag(event)\">　<input type=\"text\" readonly value=\"自由記入欄\"></input>　</div>",
  "<div id = \"valuableNumber\" draggable = \"true\" style=\"display: inline\" ondragstart=\"editDrag(event)\">　<input type=\"number\"readonly value=\"99999\"></input>　</div>",
  "<div id = \"pullDown\" draggable = \"true\" style=\"display: inline\" ondragstart=\"editDrag(event)\">　<select><option>-未選択-</option><option>選択肢Ａ</option><option>選択肢Ｂ</option></select>　</div>",
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
  buildArea = document.getElementById("buildArea");
  // var newBound = boundOrigin.cloneNode(true);
  // newBound.id = "bound-0";
  // newBound.ondragover = prev;
  // newBound.ondrag=prev;
  // newBound.ondrop = dropToBuildArea;
  // buildArea.appendChild(newBound);
}

/**
エディットエリアでの挙動
*/
function dropToEditArea(e){
  var id = e.dataTransfer.getData("text/html");
  console.log("idは"+id);
  if(id.includes("valuableText") || id.includes("valuableNumber") || id.includes("pullDown")){
    editArea.value += buildPartsForEdit(id);
  }else if((/t-\d+-\d+/).test(id)){
    var elm = document.getElementById(id);
    editArea.value += backToEdit(elm.innerHTML);
    // var rmBound = document.getElementById("bound-"+ --numOfChoice);
    // //console.log(numOfChoice);
    // elm.parentElement.removeChild(elm);
    // rmBound.parentElement.removeChild(rmBound);
    removeItem(elm);
    numOfChoice--;
  }
  e.preventDefault();
}

function removeItem(rmElt){
  var itemId = rmElt.id.split("-");
  rmElt.parentElement.removeChild(rmElt);

  //ずらす
  for(var i = itemId[1];i<Math.floor(buildArea.childElementCount/2)-1;i++){
    //移動対象要素の取得
    var elt = document.getElementById("canvas-"+(Number(i)+1)).childNodes[0];
    //IDの分割
    var tmpId = elt.id.split("-");
    //IDの書き換え
    elt.id = tmpId[0]+"-"+i+"-"+tmpId[1];
    document.getElementById("canvas-"+i).appendChild(elt);
  }
  //余分な欄を消す
  //buildArea.removeChild(document.getElementById("bound-"+Math.floor(buildArea.childElementCount/2)));
  buildArea.removeChild(document.getElementById("canvas-"+(Math.floor(buildArea.childElementCount/2)-1)));
}

//並び替えの実装
function dropToBuildArea(e){
  var elm = document.getElementById(e.dataTransfer.getData('text/html'));

  //elmId[0] t
  //elmId[1] ビルドエリアに対しての番号
  //elmId[2]
  var elmId= e.dataTransfer.getData('text/html').split("-");
    //boundId[0] b
  //boundId[1]ビルドエリアに対しての番号
  var boundId = this.id.split("-");
    if(elmId[1] > boundId[1]){
		for(var i = elmId[1];boundId[1]<i;i--){
			//移動対象要素の取得
      //console.log("canvas-"+(Number(i)-1)+",,,"+elmId[1]+",,,"+boundId[1]);
			var elt = document.getElementById("canvas-"+(Number(i)-1)).childNodes[0];
			//IDの分割
			var tmpId = elt.id.split("-");
			//IDの書き換え
			elt.id = tmpId[0]+"-"+i+"-"+tmpId[2];
			document.getElementById("canvas-"+i).appendChild(elt);
		}
		elm.id = elmId[0]+"-"+boundId[1]+"-"+elmId[2];
		document.getElementById("canvas-"+boundId[1]).appendChild(elm);
	}else if((elmId[1]+1) >= boundId[1]){
		//ここは何もしない
		//ロジックわかりやすくするために書いてるだけ
	}else if(elmId[1] < boundId[1]){
		for(var i = elmId[1];i<boundId[1]-1;i++){
			//移動対象要素の取得
      //console.log("canvas-"+(Number(i)+1)+",,,"+elmId[1]+",,,"+boundId[1]);
			var elt = document.getElementById("canvas-"+(Number(i)+1)).childNodes[0];
			//IDの分割
			var tmpId = elt.id.split("-");
			//IDの書き換え
			elt.id = "t-"+i+"-"+tmpId[2];
			document.getElementById("canvas-"+i).appendChild(elt);
		}
		elm.id = elmId[0]+"-"+(Number(boundId[1])-1)+"-"+elmId[2];
		document.getElementById("canvas-"+(Number(boundId[1])-1)).appendChild(elm);
	}
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

/**  */
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

/**  */
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




function toXML(){
  var xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<doc>\n<question>";

  xml += "<text>\n"+editArea.value+"\n</text>\n";

  xml+="</question>\n</doc>";

}
