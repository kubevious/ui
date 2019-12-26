$(".logbarcloaser").click(function(){
    $(".bottom-panel").addClass("hide");
    $(".resetlogbar").addClass("show");
});

$(".resetlogbar").click(function(){
    $(".bottom-panel").removeClass("hide");
    $(".resetlogbar").removeClass("show");
});




$(".sidebarcloaser").click(function(){
    $(".sidebar").addClass("hide");
    $(".resetsidebar").addClass("show");
});

$(".resetsidebar").click(function(){
    $(".sidebar").removeClass("hide");
    $(".resetsidebar").removeClass("show");
});