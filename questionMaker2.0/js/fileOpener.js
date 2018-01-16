function setFormInput() {
  // 親ウィンドウの存在チェック
  if (!window.opener || window.opener.closed)
  {
    // 親ウィンドウが存在しない場合
    window.alert('メインウィンドウが見当たりません。');
  }
  else
  {
    //window.opener.close();
    //window.alert(window.opener);
    window.opener.document.getElementById('filename') = document.getElementById("inputText").value;
    window.close();
  }

}

var file = document.createElement('option');
function loadStorage(){
  var filelist = document.getElementById('filelist');
  if(window.localStorage){
    for(var i=0;i< window.localStorage.length;i++){
      // 位置を指定して、ストレージからキーを取得する
      var name = window.localStorage.key(i);

      file.setAttribute('value',name);
      file.innerHTML = name;
      filelist.appendChild(file);
    }
  }
}

function loadFile(){
  var filename = filelist.value;
	window.opener.loadFile(filename);
}

function outputFile(){
  var filename = filelist.value;
	window.opener.outputFile(filename);
}

function removeFile(){
  var filename = filelist.value;
	window.opener.removeFile(filename);
}
