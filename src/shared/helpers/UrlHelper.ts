export class UrlHelper {
    /**
     * The URL requested, before initial routing.
     */
    static redirectUrl ;
    static readonly initialUrl = location.href;
    
    static getQueryParameters(): any {
        return document.location.search.replace(/(^\?)/, '').split("&").map(function (n) { return n = n.split("="), this[n[0]] = n[1], this }.bind({}))[0];
    }
}

export class FormatArgumentHelper {
    static serializeArgmsTOUrl(filter: Object): string {
        var url = "";
        for (let key in filter) {
            if (filter[key]) {
                let str;
                if (filter[key] instanceof Array) {
                    var newArray = filter[key].map(function (item) {
                        return key + "=" + item;
                    })
                    str = newArray.join("&") + "&";
                } else {
                    str = key + "=" + filter[key] + "&";
                }
                url += str;
            }
        }
        return url
    }
}