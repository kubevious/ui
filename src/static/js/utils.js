function GetURLParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
}

function generateTableHtml(data, columnsInfo)
{
    var html = '';
    html += '<table class="table table-striped table-dark">';
    html += '<thead>';
    html += '<tr>';
    for(var column of columnsInfo)
    {
        var columnHtml = '<th>' + column.name + '</th>';
        html += columnHtml;
    }
    html += '</tr>';
    html += '</thead>';
    html += '<tbody>';
    for(var row of data)
    {
        html += '<tr>';
        for(var column of columnsInfo)
        {
            var value = column.value(row);
            html += '<td>';
            html += value;
            html += '</td>';
        }
        html += '</tr>';
    }
    html += '</tbody>';
    html += '</table>';
    return html;
}   

function generateList(items, generatorCb)
{
    var html = '';
    html += '<div>';
    for(var item of items)
    {
        var itemHtml = generatorCb(item);
        html += itemHtml;
    }
    html += '</div>';
    return html;
}   

function renderTable(parent, data, columnsInfo)
{
    var html = generateTableHtml(data, columnsInfo);
    parent.html(html);
}