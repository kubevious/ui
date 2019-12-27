function popupClose(event)
{
    if (event) {
        if (event.target != event.currentTarget) {
            return;
        }
    }
    $('#popup').remove()
}

const PopupTemplate = 
    Handlebars.compile(`
<div id="popup" class="popup" onclick="popupClose(event)" >
    <div class="inner">
        {{{contents}}}
    </div>
    <button class="close" onclick="popupClose()" />
</div>
`);

function popupOpen(contents)
{
    var html = PopupTemplate({ 
        contents
    });
    $('body').append(html);  
}