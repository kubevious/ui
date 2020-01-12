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
    <div class="popup-header">
        <h3>Popup Title</h3>
        {{{header}}}
    </div>
    <div class="popup-contents">
        {{{contents}}}
    </div>
    <button class="close" onclick="popupClose()" />
</div>
`);

function popupOpen(contents, params)
{
    params = params || {};
    var header = null;
    if (params.header) {
        header = params.header;
    }

    var html = PopupTemplate({ 
        contents,
        header
    });
    $('body').append(html);  

    if (params.focus) {
        $(params.focus).focus();
    }
}