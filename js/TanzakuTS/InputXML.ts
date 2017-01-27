class InputXML{
	//XMLHttpRequestオブジェクトを生成
	xhr : XMLHttpRequest = new XMLHttpRequest();

constructor(){

}

	function init():void{
	  //openメソッドでXMLファイルを開く
		xhr.open(method, fname, async);

		//無名functionによるイベント処理
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				//buildQuestions(xhr);
			}
		}
		xhr.send(null);
	}
