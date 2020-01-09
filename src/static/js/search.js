function openSearch()
{
    popupOpen(`<div class="search-results"></div>`,
    {
        focus: "#searchInput",
        header: `
        <div class="form-group has-success">
            <input id="searchInput" type="text" class="form-control search-input" placeholder="Search" oninput="performSearch(event)">
        </div>`
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

function generateSearchItemHtml(item)
{
    return generateDnShortcutHtml(item.dn, {
        handler: "onSearchItemClick"
    });
}

function onSearchItemClick(event)
{
    var dn = $(event.currentTarget).attr("dn");
    selectDiagramItem(dn);
    popupClose();
}