const Promise = require('the-promise');
const _ = require('the-lodash');
const SnapshotReconstructor = require('./snapshot-reconstructor');
const Snapshot = require('./snapshot');

class HistorySnapshotReader
{
    constructor(logger, driver)
    {
        this._logger = logger.sublogger('HistorySnapshotReader');
        this._driver = driver;

        this._registerStatements();
    }

    get logger() {
        return this._logger;
    }

    _registerStatements()
    {
        this._registerStatement('GET_DIFFS_TIMELINE_RANGE', 'SELECT MIN(`date`) as min_date, MAX(`date`) as `max_date` FROM `diffs`;');
        this._registerStatement('GET_DIFFS_TIMELINE_FROM_TO', 'SELECT * FROM `diffs` WHERE (`date` BETWEEN ? AND ?) ORDER BY `date`;');
        this._registerStatement('GET_DIFFS_TIMELINE_FROM', 'SELECT * FROM `diffs` WHERE (`date` >= ?) ORDER BY `date`;');
        this._registerStatement('GET_DIFFS_TIMELINE_TO', 'SELECT * FROM `diffs` WHERE (`date` <= ?) ORDER BY `date`;');
        this._registerStatement('GET_DIFFS_TIMELINE', 'SELECT * FROM `diffs` ORDER BY `date`;');

        this._registerStatement('GET_SNAPSHOT_BY_ID', 'SELECT * FROM `snapshots` WHERE `id` = ?;');
        this._registerStatement('GET_RECENT_SNAPSHOT', 'SELECT * FROM `snapshots` ORDER BY `date` DESC LIMIT 1;');
        
        this._registerStatement('GET_DIFFS_FOR_SNAPSHOT', 'SELECT * FROM `diffs` WHERE `in_snapshot` = 0 AND `snapshot_id` = ? ORDER BY `date`;');
        this._registerStatement('GET_DIFFS_FOR_SNAPSHOT_AND_DATE', 'SELECT * FROM `diffs` WHERE `in_snapshot` = 0 AND `snapshot_id` = ? AND `date` <= ? ORDER BY `date`;');
        this._registerStatement('FIND_DIFF_FOR_DATE', 'SELECT * FROM `diffs` WHERE `date` <= ? ORDER BY `date` DESC LIMIT 1;');

        // this._registerStatement('GET_SNAPSHOT_ITEMS_CONFIGKIND_DN', 'SELECT `id`, `dn`, `kind`, `config-kind`, `name`, `config` FROM `snap_items` WHERE `snapshot_id` = ? AND `config-kind` IN (?) AND `dn` = ?');
        // this._registerStatement('GET_SNAPSHOT_ITEMS_CONFIGKIND', 'SELECT `id`, `dn`, `kind`, `config-kind`, `name`, `config` FROM `snap_items` WHERE `snapshot_id` = ? AND `config-kind` IN (?)');
        // this._registerStatement('GET_SNAPSHOT_ITEMS_DN', 'SELECT `id`, `dn`, `kind`, `config-kind`, `name`, `config` FROM `snap_items` WHERE `snapshot_id` = ? AND `dn` = ?');
        // this._registerStatement('GET_SNAPSHOT_ITEMS', 'SELECT `id`, `dn`, `kind`, `config-kind`, `name`, `config` FROM `snap_items` WHERE `snapshot_id` = ?');

        // this._registerStatement('GET_DIFF_ITEMS_CONFIGKIND_DN', 'SELECT `id`, `dn`, `kind`, `config-kind`, `name`, `present`, `config` FROM `diff_items` WHERE `diff_id` = ? AND `config-kind` IN (?) AND `dn` = ?');
        // this._registerStatement('GET_DIFF_ITEMS_CONFIGKIND', 'SELECT `id`, `dn`, `kind`, `config-kind`, `name`, `present`, `config` FROM `diff_items` WHERE `diff_id` = ? AND `config-kind` IN (?)');
        // this._registerStatement('GET_DIFF_ITEMS_DN', 'SELECT `id`, `dn`, `kind`, `config-kind`, `name`, `present`, `config` FROM `diff_items` WHERE `diff_id` = ? AND `dn` = ?');
        // this._registerStatement('GET_DIFF_ITEMS', 'SELECT `id`, `dn`, `kind`, `config-kind`, `name`, `present`, `config` FROM `diff_items` WHERE `diff_id` = ?');
    }

    _registerStatement()
    {
        return this._driver.registerStatement.apply(this._driver, arguments);
    }

    queryTimelineRange()
    {   
        return this._execute('GET_DIFFS_TIMELINE_RANGE')
    }

    queryTimeline(from, to)
    {   
        if (_.isNotNullOrUndefined(from))
        {
            if (_.isNotNullOrUndefined(to))
            {
                return this._execute('GET_DIFFS_TIMELINE_FROM_TO', [from, to]);
            }
            else 
            {
                return this._execute('GET_DIFFS_TIMELINE_FROM', [from]);
            }
        }
        else
        {
            if (_.isNotNullOrUndefined(to))
            {
                return this._execute('GET_DIFFS_TIMELINE_TO', [to]);
            }
            else 
            {
                return this._execute('GET_DIFFS_TIMELINE');
            }
        }
    }

    querySnapshotForDate(date, configKind)
    {  
        return this._genericReconstructSnapshot(date, configKind, null);
    }

    queryDnSnapshotForDate(dn, date, configKind)
    {
        return this._genericReconstructSnapshot(date, configKind, { dn: dn});
    }

    _genericReconstructSnapshot(date, configKind, dnFilter)
    {
        return this.findDiffForDate(date)
            .then(diffObj => {
                if (!diffObj) {
                    return null;
                }
                return this.reconstructSnapshotByIdAndDiffDate(diffObj.snapshot_id, date, configKind, dnFilter);
            }) 
    }

    /*******/
    queryDiffsForSnapshot(snapshotId)
    {
        return this._execute('GET_DIFFS_FOR_SNAPSHOT', [snapshotId]);
    }

    queryDiffsForSnapshotAndDate(snapshotId, date)
    {
        return this._execute('GET_DIFFS_FOR_SNAPSHOT_AND_DATE', [snapshotId, date]);
    }

    findDiffForDate(date)
    {
        var snapshotId = null;
        return this._execute('FIND_DIFF_FOR_DATE', [date])
            .then(results => {
                if (results.length == 0) {
                    return null;
                }
                var diff = _.head(results);
                return diff;
            })
    }

    queryRecentSnapshot()
    {
        return this._execute('GET_RECENT_SNAPSHOT')
            .then(results => {
                return _.head(results);
            });
    }

    querySnapshotItems(snapshotId, configKind, dnFilter)
    {
        var conditions = [];
        var params = []

        conditions.push('`snapshot_id` = ?')
        params.push(snapshotId)

        if (this._hasDnFilter(dnFilter))
        {
            conditions.push('`dn` = ?')
            params.push(dnFilter.dn)
        }

        configKind = this._massageConfigKind(configKind);
        if (configKind)
        {
            var configSqlParts = []
            for(var kind of configKind)
            {
                configSqlParts.push('`config-kind` = ?');
                params.push(kind);
            } 
            conditions.push('(' + configSqlParts.join(' OR ') + ')');
        }

        var sql = 'SELECT `id`, `dn`, `kind`, `config-kind`, `name`, `config`'
            + ' FROM `snap_items`';

        if (conditions.length > 0)
        {
            sql = sql + 
                ' WHERE '
                + conditions.join(' AND ');
        }

        return this._executeSql(sql, params);



        // var hasDnFilter = this._hasDnFilter(dnFilter);
        // configKind = this._massageConfigKind(configKind);

        // if (configKind)
        // {
        //     if (hasDnFilter)
        //     {
        //         return this._execute('GET_SNAPSHOT_ITEMS_CONFIGKIND_DN', [snapshotId, configKind, dnFilter.dn]);
        //     }
        //     else
        //     {
        //         return this._execute('GET_SNAPSHOT_ITEMS_CONFIGKIND', [snapshotId, configKind]);
        //     }
        // }
        // else
        // {
        //     if (hasDnFilter)
        //     {
        //         return this._execute('GET_SNAPSHOT_ITEMS_DN', [snapshotId, dnFilter.dn]);
        //     }
        //     else
        //     {
        //         return this._execute('GET_SNAPSHOT_ITEMS', [snapshotId]);
        //     }
        // }
    }

    queryDiffItems(diffId, configKind, dnFilter)
    {
        var conditions = [];
        var params = []

        conditions.push('`diff_id` = ?')
        params.push(diffId)

        if (this._hasDnFilter(dnFilter))
        {
            conditions.push('`dn` = ?')
            params.push(dnFilter.dn)
        }

        configKind = this._massageConfigKind(configKind);
        if (configKind)
        {
            var configSqlParts = []
            for(var kind of configKind)
            {
                configSqlParts.push('`config-kind` = ?');
                params.push(kind);
            } 
            conditions.push('(' + configSqlParts.join(' OR ') + ')');
        }

        var sql = 'SELECT `id`, `dn`, `kind`, `config-kind`, `name`, `present`, `config`'
            + ' FROM `diff_items`';

        if (conditions.length > 0)
        {
            sql = sql + 
                ' WHERE '
                + conditions.join(' AND ');
        }

        return this._executeSql(sql, params);

        // if (configKind)
        // {
        //     if (hasDnFilter)
        //     {
        //         return this._execute('GET_DIFF_ITEMS_CONFIGKIND_DN', [diffId, configKind, dnFilter.dn]);
        //     }
        //     else
        //     {
        //         return this._execute('GET_DIFF_ITEMS_CONFIGKIND', [diffId, configKind]);
        //     }
        // }
        // else
        // {
        //     if (hasDnFilter)
        //     {
        //         return this._execute('GET_DIFF_ITEMS_DN', [diffId, dnFilter.dn]);
        //     }
        //     else
        //     {
        //         return this._execute('GET_DIFF_ITEMS', [diffId]);
        //     }
        // }
    }

    _massageConfigKind(configKind)
    {
        if (configKind)
        {
            if (!_.isArray(configKind))
            {
                configKind = [ configKind ];
            }
            else 
            {
                if (configKind.length == 0)
                {
                    configKind = null;
                }
            }
        }
        else
        {
            configKind = null;
        }
        return configKind;
    }

    _hasDnFilter(dnFilter)
    {
        var hasDnFilter = false;
        if (dnFilter) {
            if (dnFilter.dn) {
                hasDnFilter = true;
            }
        }
        return hasDnFilter;
    }

    reconstructSnapshotByIdAndDiffDate(snapshotId, date, configKind, dnFilter)
    {
        var snapshotReconstructor = null;
        return Promise.resolve()
            .then(() => this.querySnapshotItems(snapshotId, configKind, dnFilter))
            .then(snapshotItems => {
                snapshotReconstructor = new SnapshotReconstructor(snapshotItems);
                if (date)
                {
                    return this.queryDiffsForSnapshotAndDate(snapshotId, date)
                }
                else
                {
                    return this.queryDiffsForSnapshot(snapshotId);
                }
            })
            .then(diffs => {
                return this._queryDiffsItems(diffs, configKind, dnFilter)
            })
            .then(diffsItems => {
                snapshotReconstructor.applyDiffsItems(diffsItems);
                return snapshotReconstructor.getSnapshot();
            })
            ;
    }

    reconstructRecentShaphot()
    {
        return this.queryRecentSnapshot()
            .then(snapshot => {
                this.logger.info('[reconstructRecentShaphot] db snapshot: ', snapshot);
                if (!snapshot) {
                    return new Snapshot();
                }
                return this.reconstructSnapshotByIdAndDiffDate(snapshot.id, null, 'node');
            })
    }

    _queryDiffsItems(diffs, configKind, dnFilter)
    {
        return Promise.serial(diffs, diff => {
            return this.queryDiffItems(diff.id, configKind, dnFilter);
        });
    }

    /**  **/

    _execute(statementId, params)
    {
        return this._driver.executeStatement(statementId, params);
    }

    _executeSql(sql, params)
    {
        return this._driver.executeSql(sql, params);
    }


}



module.exports = HistorySnapshotReader;