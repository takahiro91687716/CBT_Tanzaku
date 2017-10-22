var BuildQuestion = (function () {
    function BuildQuestion(xhr) {
        this.xhr = xhr;
        this.xhr = new XMLHttpRequest();
        this.question_number = 0;
        this.xhr = xhr;
    }
    return BuildQuestion;
}());
function buildQuestions(HttpObj) {
    var resHTTP = HttpObj.responseXML;
    var question = resHTTP.getElementsByTagName('question');
    for (num; num < question.length; num++) {
        buildQuestion(question[num]);
        canvasAction(num);
        removeItem(num);
    }
}
