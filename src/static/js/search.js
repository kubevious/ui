function openSearch()
{
    popupOpen(`
    <div class="form-group has-success">
        <input id="searchInput" type="text" class="form-control search-input" placeholder="Search" oninput="performSearch(event)">
    </div>
    <div class="search-results">
    </div>
    `,
    {
        focus: "#searchInput"
    })
}

function performSearch(e)
{
    var criteria = e.currentTarget.value;
    fetchSearchResults(criteria, result => {
        var owner = $(".search-results");
        owner.empty();
        for(var item of result)
        {
            owner.append(generateSearchItemHtml(item));
        }
    });
}

const SearchResultItemTemplate = 
    Handlebars.compile(`
<div class="search-result" dn="{{dn}}" onclick="onSearchItemClick(event)">
    <img class="search-logo" src="{{logo}}" />
    <span class="search-title">{{{title}}}</span>
</div>
`);
function generateSearchItemHtml(item)
{
    var dnParts = parseDn(item.dn);
    var lastPart = _.last(dnParts);

    var html = SearchResultItemTemplate({ 
        dn: item.dn,
        title: generateDnPathHtml(dnParts), //item.dn,
        logo: getNodeLogoUrl(lastPart.kind)
    });
    return html;
}

function onSearchItemClick(event)
{
    var dn = $(event.currentTarget).attr("dn");
    selectDiagramItem(dn);
    popupClose();
}