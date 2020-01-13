// Header Buttons
$("#btnHeaderSearch").click(function(){
    openSearch();
});

$("#btnHeaderAbout").click(function(){
    openAbout();
});

// Expanders
$(".logbarcloaser").click(function(){
    $(".bottom-panel").addClass("hide");
    $(".resetlogbar").addClass("show");
    $(".diagram").addClass("full");
});
$(".resetlogbar").click(function(){
    $(".bottom-panel").removeClass("hide");
    $(".resetlogbar").removeClass("show");
    $(".diagram").removeClass("full");
});

$(".sidebarcloaser").click(function(){
    $(".sidebar").addClass("hide");
    $(".resetsidebar").addClass("show");
    $(".content-body").addClass("full");
});
$(".resetsidebar").click(function(){
    $(".sidebar").removeClass("hide");
    $(".resetsidebar").removeClass("show");
    $(".content-body").removeClass("full");
});

// Scroll
$(document).ready(function () {
    if (!$.browser.webkit) {
        $('.customscroll').html('<p>Sorry! Non webkit users. :(</p>');
    }
});