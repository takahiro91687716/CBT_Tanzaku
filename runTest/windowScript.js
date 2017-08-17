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

// 入力値の取得を行う
// 「入力ボタン」で呼び出す
function setInputValue(){
  inputValues[inputTimes] = document.in.keyboard.value;
}

// 入力値の取得
// これが行われた場合、入力回数をカウントする
function input(){
  return inputValues[inputTimes];
  inputTimes++;
}

// 入力値の初期化を行う
// 「リセットボタン」で呼び出す
function clean(){
  inputValues.length = 0;
  inputTimes = 0;
  result();
}

function result(){
  // 実行コードに入力が含まれていた場合に result() を繰り返すため実行時にコンソールを消す
  program.out.value = "";

  // !!!!!!!!!!ここからサンプルコード!!!!!!!!!!!
  outputWithReturn("入力値を足して表示する");

  if(typeof inputValues[0] == "undefined"){
    setTimeout("result()", 100);
  }else{
    var i = input();
    outputWithReturn(i);
  }
  // !!!!!!!!!!ここまでサンプルコード!!!!!!!!!!!

}
