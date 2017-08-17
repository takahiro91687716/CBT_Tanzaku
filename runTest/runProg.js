var head = "<html><head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" /><title>runProg</title></head>";
var body = "<body onLoad = \"result()\"><form name=\"in\"><input type=\"text\" name=\"keyboard\"><input type=\"button\" id=\"inpStr\" value=\"文字入力\"><input type=\"button\" id=\"inpNum\" value=\"数値入力\"></form><form name=\"program\"><textarea name=\"out\" readonly rows=\"8\" cols=\"40\"></textarea></form>";
var script1 = "<script type=\"text/javascript\">function output(res){\nprogram.out.value += res+\"\\n\";\n}\nfunction input(){\nreturn document.in.keyboard.value;\n}\n";

var script2 = "</script>";
var bottom = "</body></html>";


/**
文字列の数を数える
*/
var counter = function(str,seq){
  return str.split(seq).length - 1;
}

function run(){
  var code = program.prog.value;

  var source = "";

  code = code.replace(/console.log/g,"output");
  codes = code.split("\n");
  //alert(codes[0]);


  var htmlsource = window.open("", "", "scrollbars=yes, width=600, height=400");
	htmlsource.document.open();
  source += head;
  source += body;
  source += script1;

  var func = "function result(){\nvar button = document.getElementById(\"inpStr\");\ninstantFunction0();\n";

  for(var i = 0; i < codes.length; i++){
    func += "function instantFunction" + i + "(){\n";

    //inputの処理
    if(codes[i].includes("input()")){
      func += "button.onclick = function(){\n";
    }

    func += codes[i]+";\n";

    if(i<codes.length-1){
      func += "instantFunction" + (i+1) +"();\n";
    }
    func += "}\n";
    if(0<i){
      func += "}\n";
    }
  }

  source += func;
  source += script2;
  source += bottom;
  htmlsource.document.write(source);
	htmlsource.document.close();
}

/** 出力テスト
console.log("6の段を表示する")
var i = i;
for(i;i<10;i++){
console.log(i*6)
}
*/

/** 入力系
console.log("入力値を表示する")
var i = input();
console.log(i)
*/
