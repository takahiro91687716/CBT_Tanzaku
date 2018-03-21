#!/bin/sh

var top1 = "<?xml version='1.0' encoding='UTF-8'?>";
var top2 = "<doc>";//
var bottom = "</doc>";//
var exam;

fucntion removeDoc(){
  exam += $(xmllint --xpath "/question" ファイル);
}

function writeExam(){
  exam = top1+top2+exam+bottom;
  exam = $(sed -e exam "s/<\/question>/<\/question>\n/g");
}

function getFile(){
  read -p "Please input question file: " fname;
  if(fname.includes('.xml')){
    fname=fname+'.xml';
  }
}
