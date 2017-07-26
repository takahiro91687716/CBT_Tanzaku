var head = "<html><head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" /><title>runProg</title></head>";
var body = "<body onLoad = \"result()\"><form name=\"program\"><textarea name=\"out\" readonly rows=\"8\" cols=\"40\"></textarea></form>";
var script1 = "<script type=\"text/javascript\">function output(res){program.out.value = res;}function result(){";
var script2 = "}</script>";
var bottom = "</body></html>";

var one = "";

function run(){
  var code = program.prog.value;
  var source = "";

  code = code.replace(/console.log/g,"output");

  var htmlsource = window.open("", "", "scrollbars=yes, width=600, height=400");
	htmlsource.document.open();
  source += head;
  source += body;
  source += script1;
  source += code;
  source += script2;
  source += bottom;
  htmlsource.document.write(source);
	htmlsource.document.close();
}
