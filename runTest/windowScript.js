// 改行あり出力
function outputWithReturn(res){
  program.out.value += res+"\n";
}

// 改行なし出力
function outputLessReturn(res){
  program.out.value += res;
}

// 入力値を格納する配列
var inputValues = [];
// 現在入力されている回数
var inputTimes = 0;

var g = result();//ジェネレータ

// 入力値の取得を行う
// 「入力ボタン」で呼び出す
function setInputValue(){
  //inputValues[inputTimes++] = document.in.keyboard.value;
  outputWithReturn("＜入力＞　："+document.in.keyboard.value);
  g.next();
}

// 入力値の取得
// これが行われた場合、入力回数をカウントする
function input(number){
  return inputValues[number];
}

// 入力値の初期化を行う
// 「リセットボタン」で呼び出す
function clean(){
  inputValues.length = 0;
  inputTimes = 0;
  result();
}

function start(){
  g.next();
}

function* result(){
  // 実行コードに入力が含まれていた場合に result() を繰り返すため実行時にコンソールを消す
  program.out.value = "";
  var inputnum = 0;

  // !!!!!!!!!!ここからサンプルコード!!!!!!!!!!!
  outputWithReturn("入力値を足して表示する");
  outputWithReturn("ひとつめ");

  yield inputnum;

  inputnum++;
  var i = document.in.keyboard.value;

  outputWithReturn(i);

  outputWithReturn("ふたつめ");

  yield inputnum;

  var j = document.in.keyboard.value;
  outputWithReturn(i+j);

  yield inputnum;
}
