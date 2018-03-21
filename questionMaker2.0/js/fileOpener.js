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


function loadStorage(){
  var filelist = document.getElementById('filelist');
  while(filelist.firstChild ){
    filelist.removeChild(filelist.firstChild);
  }
  if(window.localStorage){
    for(var i=0;i< window.localStorage.length;i++){
      // 位置を指定して、ストレージからキーを取得する
      var name = window.localStorage.key(i);
      console.log(name);
      var file = document.createElement('option');
      file.setAttribute('value',name);
      file.innerHTML = name;
      filelist.appendChild(file);
    }
  }
}

function getFilename(){
  var str = document.getElementById("filename").value;
  if(str.includes(".xml")){
    str = str.replace(/\.xml/g,"");
  }
  return str + ".xml";
}

function saveFile(){
  var filename = getFilename();
	window.opener.writeLocalStorage(filename);
  loadStorage();
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
  loadStorage();
}
