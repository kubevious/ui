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

		});
	}

}

var historyClient = new HistoryClient();
