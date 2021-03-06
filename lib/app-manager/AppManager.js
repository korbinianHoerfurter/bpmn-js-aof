'use strict';

var find = require('lodash/collection/find'),
    any = require('lodash/collection/any'),
    forEach = require('lodash/collection/forEach'),
    jquery = require('jquery'),
    inherits = require('inherits'),
    md5 = require('md5');


/**
 * BPMN specific modeling rule
 */
function AppManager(config) {

    this._apps=[];
    this.request_uri=config.request_uri;
    this.info_uri_pattern=config.info_uri_pattern;
    this.init();

}

AppManager.$inject = [ 'config.appManager' ];

module.exports = AppManager;

AppManager.prototype.init = function() {
    var apps=this._apps;

    var request = jquery.ajax(this.request_uri, {
        success: function (data, status, jqXHR) {
            data=JSON.parse(data);
            if (data.results) {
                for(var i=0;i<data.results.bindings.length;i++){
                    var pushdata={name: data.results.bindings[i].label.value, value: data.results.bindings[i].uri.value};
                     apps.push(pushdata);
                }
                apps.sort(function(a,b){
                    if(a.name< b.name)return -1;
                    else return 1;

                });
            }
        },
        method: "GET",
        async: true,
        dataType: 'json',
        timeout: 1000,
        data: '',
        error: function (jqXHR, status, error) {
            alert(status);
        }
    });

};

AppManager.prototype.list=function(){
    return this._apps;
}
AppManager.prototype.getInfoUri=function(appUri){
    var uri = this._apps.filter(function (app) { return app.value == appUri});
    if(uri.length>0)  {
        uri=md5(uri[0].value);
        return this.info_uri_pattern.replace('#URI#',uri);
    }
    return "";

}
