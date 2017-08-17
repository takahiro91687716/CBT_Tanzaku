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

// 入力値の取得と入力回数のカウントを行う
// 「入力ボタン」で呼び出す
function setInputValue(){
  inputValue[inputTimes] = document.in.keyboard.value;
  inputTimes++;
}

// 入力値の取得
function input(){
  return inputValues[inputTimes];
}

// 入力値の初期化を行う
// 「リセットボタン」で呼び出す
function reset(){
  inputValues.length = 0;
  inputTimes = 0;
}

function result(){
  // 実行コードに入力が含まれていた場合に result() を繰り返すため実行時にコンソールを消す
  program.out.value = "";

  // !!!!!!!!!!ここからサンプルコード!!!!!!!!!!!
  output1("入力値を足して表示する");

  if(typeof inputValues[0] == "undefined"){
    setTimeout("result()", 100);
  }else{
    var i = input();
    output1(i);
  }
  // !!!!!!!!!!ここまでサンプルコード!!!!!!!!!!!

}
