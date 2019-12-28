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

function renderTable(parent, data, columnsInfo)
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
        html += '<tr>';
    }
    html += '</tbody>';
    html += '</table>';
    
    parent.html(html);
}