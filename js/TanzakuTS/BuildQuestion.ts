class BuildQuestion{
	//問題数を保持する変数
	private question_number : number;
  private xhr :XMLHttpRequest = new XMLHttpRequest();

  constructor(private xhr:XMLHttpRequest){
    this.question_number = 0;
		this.xhr = xhr
  }

	//--------------------------------------------------
	//ページ全体に問いを配置する関数
	//
	//--------------------------------------------------
	function buildQuestions(HttpObj){
		var resHTTP = HttpObj.responseXML;
		var question = resHTTP.getElementsByTagName('question');

		for(num; num < question.length;num++){
			buildQuestion(question[num]);
			canvasAction(num);
			removeItem(num);
		}
	}
}
