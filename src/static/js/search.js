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

    var text = e.data;
    fetchSearchResults(e.data, result => {
        var owner = $(".search-results");
        owner.empty();
        for(var item of result)
        {
            owner.append(item.dn);
        }
    });
}