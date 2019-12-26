$(".logbarcloaser").click(function(){
    $(".bottom-panel").addClass("hide");
    $(".resetlogbar").addClass("show");
});

$(".resetlogbar").click(function(){
    $(".bottom-panel").removeClass("hide");
    $(".resetlogbar").removeClass("show");
});