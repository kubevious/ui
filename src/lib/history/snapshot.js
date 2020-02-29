const Promise = require('the-promise');
const _ = require('the-lodash');
const Helpers = require('./helpers');
const DnUtils = require('../utils/dn-utils');

class Snapshot
{
    constructor()
    {
        this._items = {};
        this._date = null;
    }

    get date() {
        return this._date;
    }

    get count() {
        return _.keys(this._items).length;
    }

    get keys() {
        return _.keys(this._items);
    }

    setDate(date) {
        this._date = date;
    }
    
    addItem(item)
    {
        this._items[Helpers.makeKey(item)] = item;
    }

    addItems(items)
    {
        for(var item of items)
        {
            this.addItem(item);
        }
    }

    deleteItem(item)
    {
        this.delteById(Helpers.makeKey(item));
    }

    delteById(id)
    {
        delete this._items[id];
    }

    getItems()
    {
        return _.values(this._items);
    }

    getDict()
    {
        return _.cloneDeep(this._items);
    }

    findById(id)
    {
        var item = this._items[id];
        if (!item) {
            return null;
        }
        return item;
    }

    findItem(item)
    {
        return this.findById(Helpers.makeKey(item));
    }

    generateTree()
    {
        var lookup = {};

        let makeNode = (dn, initConfig) => {
            var node = lookup[dn];
            if (node) {
                return node;
            }

            if (initConfig) {
                node = _.clone(initConfig);
            } else {
                node = {}
            };

            node.children = [];

            lookup[dn] = node;

            var parentDn = DnUtils.parentDn(dn);
            if (parentDn.length > 0) {
                var parentNode = makeNode(parentDn);
                parentNode.children.push(node);
            }

            return node;
        };

        for (var item of this.getItems().filter(x => x['config-kind'] == 'node'))
        {
            makeNode(item.dn, item.config);
        }

        var rootNode = lookup['root'];
        if (!rootNode) {
            rootNode = null;
        }

        return rootNode; //this.getDict();
    }

    _getParentDn(dn, myRn)
    {
        var parentDn = dn.substring(0, dn.length - myRn.length - 1);
        return parentDn;
    }
}

module.exports = Snapshot;