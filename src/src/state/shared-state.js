import _ from 'the-lodash'
import { v4 as uuidv4 } from 'uuid';

class SharedState
{
    constructor()
    {
        console.log("[SharedState] CONSTRUCTOR");

        this._debugOutput = true;
        this._isSheduled = false;
        this._lastValues = {};
        this._values = {};
        this._subscribers = {};
        this._subscribedKeys = {};
    }

    /*
     * Subscribes to changes of key value. Supports multiple key subscription.
     * Usage:
     * state.subscribe("key1", (value) => {
            console.log('Key1 VALUE CHANGED: ');
            console.log(value);
       })
     * Usage:
     * state.subscribe(["key1", "key2"], ({key1, key2}) => {
            console.log('Key1 or Key2 VALUEs CHANGED: ');
            console.log(key1);
            console.log(key2);
       })
     */
    subscribe(keyOrKeys, cb)
    {
        var subscriber = {
            id: uuidv4(),
            handler: cb
        }

        if (_.isArray(keyOrKeys)) {
            subscriber.isArray = true;
            subscriber.keys = keyOrKeys;
        } else {
            subscriber.isArray = false;
            subscriber.keys = [keyOrKeys];
        }

        this._subscribers[subscriber.id] = subscriber;

        for(var key of subscriber.keys) {
            if (!this._subscribedKeys[key]) {
                this._subscribedKeys[key] = {}
            }
            this._subscribedKeys[key][subscriber.id] = true;
        }

        this._notifyToSubscriber(subscriber.id);
        
        return {
            subscriber: subscriber.id
        }
    }

    unsubscribe(values) {
        values.forEach(key => {
            delete this._subscribers[key]
        })
    }

    get(name)
    {
        var value = this._values[name];
        if (_.isNullOrUndefined(value)) {
            value = null;
        }
        return value;
    }

    set(name, value, options)
    {
        options = options || {};

        if (!options.skipCompare)
        {
            if (_.fastDeepEqual(value, this._values[name]))
            {
                return;
            }
        }

        if (this._debugOutput)
        {
            var str = JSON.stringify(value);
            if (str) {
                if (str.length > 80) {
                    str = str.substring(0, 80) + '...';
                }
            }
            console.log("[SharedState] SET " + name + " = " + str);
        }

        if (_.isNullOrUndefined(value)) {
            delete this._values[name];
        } else {
            this._values[name] = value;
        }

        this._trigger();
    }

    _trigger()
    {
        if (this._isSheduled) {
            return;
        }
        this._isSheduled = true;
        setTimeout(() => {
            this._isSheduled = false;
            this._process();
        }, 0)
    }

    _process()
    {
        var diff = {};

        {
            for(var name of _.keys(this._values))
            {
                var value = this._values[name];
                var lastValue = this._lastValues[name];

                if (!_.fastDeepEqual(value, lastValue))
                {
                    diff[name] = true;
                }
            }
        }

        {
            for(var name of _.keys(this._lastValues))
            {
                var value = this._values[name];
                if (_.isNullOrUndefined(value)) {
                    diff[name] = true;
                }
            }
        }
        
        var subscriberIDs = {};
        for(var name of _.keys(diff))
        {
            if (this._subscribedKeys[name])
            {
                for(var id of _.keys(this._subscribedKeys[name]))
                {
                    subscriberIDs[id] = true;
                }
            }
        }

        this._lastValues = _.cloneDeep(this._values);

        for(var id of _.keys(subscriberIDs))
        {
            this._notifyToSubscriber(id);
        }
    }

    _notifyToSubscriber(id)
    {
        var subscriber = this._subscribers[id];
        var argsArray = [];

        if (!subscriber)
        {
            return;
        }

        if (subscriber.isArray)
        {
            var dict = {};
            for(var name of subscriber.keys)
            {
                var value = this.get(name);
                dict[name] = value;
            }
            argsArray.push(dict);
        }
        else
        {
            var value = this.get(subscriber.keys[0]);
            argsArray.push(value);
        }

        // console.log("[SharedState] Trigger " + id + " :: " + JSON.stringify(argsArray));
        subscriber.handler.apply(null, argsArray);
    }
}

export default SharedState;
