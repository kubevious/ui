const historyScope = {
	client: null,
    view: null,
    data: []
};

class HistoryClient {

	constructor()
	{
		this._selectedDate = null;
		this._isTimeMachineActive = false;
		this._dateTo = new Date();
		this._durationHrs = 24;

		$(document).on("layout-open-timelineComponent", () => {
			this._activateMenuButtonStates();
		});
		
		
		this.refresh();
	}

	get dateFrom() {
		return this._calcShiftDate(-this.durationHrs);
	}

	get dateTo() {
		return this._dateTo;
	}

	get durationHrs() {
		return this._durationHrs;
	}

	_calcShiftDate(diffHours)
	{
		return moment(this._dateTo).add(diffHours, 'hours').toDate();
	}

	refresh()
	{
		// fetchHistoryRange(data => {

		// });
		this.refreshTimeline();
	}

	refreshTimeline()
	{
		var from = this.dateFrom.toISOString();
		var to = this.dateTo.toISOString();

		Logger.info("[HistoryClient::refreshTimeline] %s -> %s, diff: %s", from, to, moment.duration(moment(this.dateTo).diff(this.dateFrom)).asHours() );

		fetchHistoryTimeline(from, to, data => {
			for(var x of data)
			{
				x.date = new Date(x.date);
			}
			historyScope.data = _.orderBy(data, ['date'], ['asc']);
			if (historyScope.view) {
				historyScope.view.render();
			}
		});
	}

	selectDate(date)
	{
		if (date) {
			Logger.info("[HistoryClient::selectDate] %s", date.toISOString());
		} else {
			Logger.info("[HistoryClient::selectDate] none");
		}
		this._selectedDate = date;

		this._activateHeaderInfo();

		if (date)
		{
			if (this._dateChangeTimerId) {
				clearTimeout(this._dateChangeTimerId);
			}
	
			this._dateChangeTimerId = setTimeout(() => {
				this._loadSnapshot();
			}, 250);
		}
		else
		{
			this._loadSnapshot();
		}
	}

	toggleTimeMachine()
	{
		Logger.info('[History::toggleTimeMachine]...')

		this._cancelPendingTimeouts();
		
		this._isTimeMachineActive = !this._isTimeMachineActive;
		if (this._isTimeMachineActive) {
			this.selectDate(this.dateTo);
		} else {
			this.selectDate(null);
		}
		this._activateMenuButtonStates();
		this._activateHeaderInfo();
		if (this._isTimeMachineActive)
		{
			historyScope.view.selectDate(this.dateTo);
		}
		historyScope.view.setSelectorVisibility(this._isTimeMachineActive);
	}

	zoomIn()
	{
		this._cancelPendingTimeouts();
		
		this._durationHrs = Math.max(1, this._durationHrs / 2);
		this.refreshTimeline();
	}

	zoomOut()
	{
		this._cancelPendingTimeouts();
		
		this._durationHrs = Math.min(24 * 5, this._durationHrs * 2);
		this.refreshTimeline();
	}

	panLeft()
	{
		this._cancelPendingTimeouts();
		
		this._dateTo = this._calcShiftDate(-this.durationHrs / 2);
		this.refreshTimeline();
	}

	panRight()
	{
		this._cancelPendingTimeouts();
		
		this._dateTo = this._calcShiftDate(this.durationHrs / 2);
		this.refreshTimeline();
	}

	resetView()
	{
		Logger.info('[History::toggleTimeMachine]...')
		
		this._cancelPendingTimeouts();

		this._dateTo = new Date();
		this._durationHrs = 24;
		this._isTimeMachineActive = false;

		this.refreshTimeline();

		this.selectDate(null);

		this._activateMenuButtonStates();
		historyScope.view.setSelectorVisibility(this._isTimeMachineActive);
	}

	_activateMenuButtonStates()
	{
		if (this._isTimeMachineActive) {
			$('#btnTimelineTimeMachine').addClass('active');
		} else {
			$('#btnTimelineTimeMachine').removeClass('active');
		}
	}

	_activateHeaderInfo()
	{
		var html = '';

		if (this._isTimeMachineActive && this._selectedDate) {
			html = '<span class="time-machine-header-span"></span><span>Time Machine Active: ' + this._selectedDate.toISOString() + '</span>';
		}

		$('#history-info').html(html);
	}

	_loadSnapshot()
	{
		Logger.info("[HistoryClient::_loadSnapshot] %s", this._selectedDate);

		this._cancelPendingTimeouts();

		diagramScope.client.setTimeMachineDate(this._selectedDate);
	}

	_cancelPendingTimeouts()
	{
		if (this._dateChangeTimerId) {
			clearTimeout(this._dateChangeTimerId);
			this._dateChangeTimerId = null;
		}
	}

}


historyScope.client = new HistoryClient();
