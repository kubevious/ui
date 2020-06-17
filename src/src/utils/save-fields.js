import _ from 'the-lodash'

class FieldsSaver {
    constructor(title) {
        this._title = title
        this.fields = {}
    }

    setValue(values) {
        let params = _.clone(values)
        let fields = {}

        for (let key in params) {
            if (params[key] === null) {
                delete params[key]

            }
        }

        for (let key in params) {
            let name = ''
            key.split('_').forEach(i => {
                name += i[0]
            })

            typeof params[key] === 'boolean' ? fields[name] = params[key] : fields[name] = btoa(params[key])
        }

        this.setHistory(fields)
    }

    generateUrl(fields) {
        let url = '/'
        const firstKey = Object.keys(fields)[0]

        for (let key in fields) {
            url += key === firstKey ? `?${key}=${fields[key]}` : `&${key}=${fields[key]}`
        }

        return url
    }

    setHistory(fields) {
        const url = this.generateUrl(fields)
        window.history.pushState(fields, this._title, url)
    }

    decodeParams(params) {
        let obj = {}
        switch (this._title) {
            case 'Diagram':
                obj.tme = params.get('tme')
                obj.tmd = params.get('tmd') ? atob(params.get('tmd')) : params.get('tmd')
                obj.sd = params.get('sd') ? atob(params.get('sd')) : params.get('sd')
        }

        return obj
    }
}

export default FieldsSaver