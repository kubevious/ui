// Header Buttons
$("#btnHeaderSearch").click(function(){
    openSearch();
});

$("#btnHeaderAbout").click(function(){
    openAbout();
});

// Expanders
$(".logbarcloser").click(function(){
    $(".bottom-panel").addClass("hide");
    $(".resetlogbar").addClass("show");
    $(".diagram").addClass("full");
});
$(".resetlogbar").click(function(){
    $(".bottom-panel").removeClass("hide");
    $(".resetlogbar").removeClass("show");
    $(".diagram").removeClass("full");
});

$(".sidebarcloser").click(function(){
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
    var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);

    if (!isChrome && !isSafari) {
        $('.customscroll').html('<p>Sorry! Non webkit users. :(</p>');
    }
});

// Tooltips
$(function () {
    activateTooltips();
})

function activateTooltips()
{
    $('.property-group-info').tooltip()
    // $('[data-toggle="tooltip"]').tooltip()
}