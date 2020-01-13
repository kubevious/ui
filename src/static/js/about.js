function openAbout()
{
    fetchAbout(result => {

        var headerHtml = '<h3>About Kubevious</h3>';

        var contentHtml = '<div class="about">';
        contentHtml += _renderKeyValueContents(result, true);
        contentHtml += '</div>';

        popupOpen(contentHtml, {
            header: headerHtml
        });

    });

}