class HistoryClient {

	constructor()
	{
		this._dateFrom = null;
		this._dateTo = null;
		
		this.refresh();
	}

	refresh()
	{
		fetchHistoryRange(data => {

		});

		fetchHistoryTimeline(this._dateFrom, this._dateTo, data => {
			historyScope.data = _.orderBy(data, ['date'], ['asc']);
			if (historyScope.historyView) {
				historyScope.historyView.render();
			}
		});
	}

}

var historyClient = new HistoryClient();
