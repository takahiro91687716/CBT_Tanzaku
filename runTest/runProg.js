var scriptBefore = [
  "<html>\n",

  " <head>\n",
  "   <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" />\n",
  "   <title>\n",
  "    runProg\n",
  "   </title>\n",
  " </head>\n",

  " <body onLoad = \"start()\">\n",
  "   <form name=\"in\">\n",
  "    <input type=\"text\" name=\"keyboard\">\n",
  "    <input type=\"button\" value=\"入力\" onclick=\"setInputValue()\">\n",
  "    <input type=\"button\" value=\"リセット\" onclick=\"clean()\">\n",
  "   </form>\n",

  "   <form name=\"program\">\n",
  "    <textarea name=\"out\" readonly rows=\"8\" cols=\"40\"></textarea>\n",
  "   </form>\n",

  "   <script type=\"text/javascript\">\n",
  "    \/\/ 改行あり出力\n",
  "    function outputWithReturn(res){\n",
  "      program.out.value += res+\"\\n\";\n",
  "    }\n",

  "    \/\/ 改行なし出力\n",
  "    function outputLessReturn(res){\n",
  "      program.out.value += res;\n",
  "    }\n",

  "    \/\/ 入力値を格納する配列\n",
  "    var inputValues = [];\n",
  "    \/\/ 現在入力されている回数\n",
  "    var inputTimes = 0;\n",

  "    \/\/ 入力値の取得を行う\n",
  "    \/\/ 「入力ボタン」で呼び出す\n",
  "    function setInputValue(){\n",
  "     var inputValueVirPage = document.in.keyboard.value",
  "     document.in.keyboard.value = \"\"",
  "     outputWithReturn(\"＜入力＞　：\"+inputValueVirPage);\n",
  "     gen.next(inputValueVirPage);\n",
  "    }\n",

  "    \/\/ 入力値の初期化を行う\n",
  "    \/\/ 「リセットボタン」で呼び出す\n",
  "    function clean(){\n",
  "     inputValues.length = 0;\n",
  "     inputTimes = 0;\n",
  "     result();\n",
  "    }\n",

  "    function* result(inputValueVirPage){\n",
];

        //！！！！！！！！！！！！！//
        //ここに生成したコードが入る//
        //！！！！！！！！！！！！！//

var scriptAfter = [
  "    }\n",

  "    var gen = result(0);\n",

  "    function start(){\n",
  "     gen.next(0);\n",
  "    }\n",

  "   </script>\n",
  " </body>\n",
  "</html>\n",
];

function run(){
  //入力されている実行コードの取得
  var code = program.prog.value;

  var source = "";

  //input()の数を数える
  //「 } 」の数になるから重要
  var inputNum = 0;

  // 実行コードを改行で分割する
  // 短冊の方では行で取得するのでいらない
  var codes = code.split("\n");

  var htmlsource = window.open("", "", "scrollbars=yes, width=600, height=400");
	htmlsource.document.open();

  //実行コード配置位置までの script[] を設置
  for(var i = 0; i < scriptBefore.length ; i++){
    source += scriptBefore[i];
  }

  //実行コードの配置
  for(var i = 0; i < codes.length; i++){
    var tmpLine = "";

    //inputの処理
    if(codes[i].includes("input()")){
      tmpLine += "if(typeof inputValues["+ inputNum +"] != \"undefined\"){\n";
      tmpLine += codes[i].replace(/input\(\)/g,("input("+ inputNum++ +")"))+"\n";
    }else{
      //inputが含まれない場合の処理
      tmpLine += codes[i];
    }
    source += tmpLine;
  }

  source += "yield inputValueVirPage;"

  for(var i = 0; i < scriptAfter.length; i++){
    source += scriptAfter[i];
  }

  htmlsource.document.write(source);
	htmlsource.document.close();
}

/** 出力テスト
outputWithReturn("6の段を表示する")
var i = i;
for(i;i<10;i++){
outputWithReturn(i*6)
}
*/

/** 入力系
outputWithReturn("入力値を表示する");
var i = input();
outputWithReturn(i);
*/

/** 入力系
outputWithReturn("数を入力してください");
var i = input();
outputWithReturn("もうひとつ");
var j = input();
outputWithReturn("合計は...");
outputWithReturn(i+j);
*/
