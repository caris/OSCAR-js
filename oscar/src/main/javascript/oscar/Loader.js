/*!
 * CARIS oscar - Open Spatial Component ARchitecture
 *
 * Copyright 2012 CARIS <http://www.caris.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * 	http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(a,b,c){function d(a){return o.call(a)=="[object Function]"}function e(a){return typeof a=="string"}function f(){}function g(a){return!a||a=="loaded"||a=="complete"||a=="uninitialized"}function h(){var a=p.shift();q=1,a?a.t?m(function(){(a.t=="c"?B.injectCss:B.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):q=0}function i(a,c,d,e,f,i,j){function k(b){if(!o&&g(l.readyState)&&(u.r=o=1,!q&&h(),l.onload=l.onreadystatechange=null,b)){a!="img"&&m(function(){t.removeChild(l)},50);for(var d in y[c])y[c].hasOwnProperty(d)&&y[c][d].onload()}}var j=j||B.errorTimeout,l={},o=0,r=0,u={t:d,s:c,e:f,a:i,x:j};y[c]===1&&(r=1,y[c]=[],l=b.createElement(a)),a=="object"?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,r)},p.splice(e,0,u),a!="img"&&(r||y[c]===2?(t.insertBefore(l,s?null:n),m(k,j)):y[c].push(l))}function j(a,b,c,d,f){return q=0,b=b||"j",e(a)?i(b=="c"?v:u,a,b,this.i++,c,d,f):(p.splice(this.i++,0,a),p.length==1&&h()),this}function k(){var a=B;return a.loader={load:j,i:0},a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=s?l:n.parentNode,l=a.opera&&o.call(a.opera)=="[object Opera]",l=!!b.attachEvent&&!l,u=r?"object":l?"script":"img",v=l?"script":u,w=Array.isArray||function(a){return o.call(a)=="[object Array]"},x=[],y={},z={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}},A,B;B=function(a){function b(a){var a=a.split("!"),b=x.length,c=a.pop(),d=a.length,c={url:c,origUrl:c,prefixes:a},e,f,g;for(f=0;f<d;f++)g=a[f].split("="),(e=z[g.shift()])&&(c=e(c,g));for(f=0;f<b;f++)c=x[f](c);return c}function g(a,e,f,g,i){var j=b(a),l=j.autoCallback;j.url.split(".").pop().split("?").shift(),j.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("/").pop().split("?")[0]]||h),j.instead?j.instead(a,e,f,g,i):(y[j.url]?j.noexec=!0:y[j.url]=1,f.load(j.url,j.forceCSS||!j.forceJS&&"css"==j.url.split(".").pop().split("?").shift()?"c":c,j.noexec,j.attrs,j.timeout),(d(e)||d(l))&&f.load(function(){k(),e&&e(j.origUrl,i,g),l&&l(j.origUrl,i,g),y[j.url]=2})))}function i(a,b){function c(a,c){if(a){if(e(a))c||(j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}),g(a,j,b,0,h);else if(Object(a)===a)for(n in m=function(){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b}(),a)a.hasOwnProperty(n)&&(!c&&!--m&&(d(j)?j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}:j[n]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),l()}}(k[n])),g(a[n],j,b,n,h))}else!c&&l()}var h=!!a.test,i=a.load||a.both,j=a.callback||f,k=j,l=a.complete||f,m,n;c(h?a.yep:a.nope,!!i),i&&c(i)}var j,l,m=this.yepnope.loader;if(e(a))g(a,0,m,0);else if(w(a))for(j=0;j<a.length;j++)l=a[j],e(l)?g(l,0,m,0):w(l)?B(l):Object(l)===l&&i(l,m);else Object(a)===a&&i(a,m)},B.addPrefix=function(a,b){z[a]=b},B.addFilter=function(a){x.push(a)},B.errorTimeout=1e4,b.readyState==null&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",A=function(){b.removeEventListener("DOMContentLoaded",A,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k=b.createElement("script"),l,o,e=e||B.errorTimeout;k.src=a;for(o in d)k.setAttribute(o,d[o]);c=j?h:c||f,k.onreadystatechange=k.onload=function(){!l&&g(k.readyState)&&(l=1,c(),k.onload=k.onreadystatechange=null)},m(function(){l||(l=1,c(1))},e),i?k.onload():n.parentNode.insertBefore(k,n)},a.yepnope.injectCss=function(a,c,d,e,g,i){var e=b.createElement("link"),j,c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(n.parentNode.insertBefore(e,n),m(c,0))}})(this,document);


var $_oscarcssdependencies = [
    "../jquery/jquery/css/smoothness/jquery-ui-1.10.0.custom.min.css"
    ,"theme/default/style.css"
    ,"../yui/build/fonts/fonts-min.css"
    ,"../yui/build/button/assets/skins/sam/button.css"
    ,"../yui/build/autocomplete/assets/skins/sam/autocomplete.css"
    ,"../yui/build/container/assets/skins/sam/container.css"
    ,"../yui/build/paginator/assets/skins/sam/paginator.css"
    ,"../yui/build/datatable/assets/skins/sam/datatable.css"
    ,"../yui/build/datatable/assets/skins/sam/datatable-skin.css"
    ,"../yui/build/layout/assets/skins/sam/layout.css"
    ,"../yui/build/resize/assets/skins/sam/resize.css"
    ,"../yui/build/tabview/assets/skins/sam/tabview.css"
];


var $_oscarscripts = [
    "../jquery/jquery/js/jquery-1.9.0.js"
    ,"../jquery/jquery/js/jquery-ui-1.10.0.custom.min.js"
	,"../jquery/plugins/stalker/jquery.stalker.js"
    ,"../proj4js/lib/proj4js-compressed.js"
    ,"../openlayers/OpenLayers.js"
];


var $_oscaryuiscripts = [
    "../yui/build/yahoo-dom-event/yahoo-dom-event.js",
    "../yui/build/element/element-min.js",
    "../yui/build/button/button-min.js",
    "../yui/build/container/container-min.js",
    "../yui/build/datasource/datasource.js",
    "../yui/build/json/json.js",
    "../yui/build/dragdrop/dragdrop.js",
    "../yui/build/treeview/treeview.js",
    "../yui/build/animation/animation.js",
    "../yui/build/autocomplete/autocomplete.js",
    "../yui/build/connection/connection.js",
    "../yui/build/datatable/datatable.js",
    "../yui/build/paginator/paginator-min.js",
    "../yui/build/resize/resize.js",
    "../yui/build/layout/layout-min.js",
    "../yui/build/connection/connection.js",
    "../yui/build/resize/resize-min.js",
    "../yui/build/tabview/tabview-min.js"
];


$_oscarscriptdependencies = $_oscarscripts.concat($_oscaryuiscripts);
    
$_oscarscriptdependencies.push("oscar.js");
$_oscarscriptdependencies.push("yuiDependencies.js");

window["oscar"] = {
    injectJs:yepnope.injectJs,
    injectCss:yepnope.injectCss,
    readyCallbacks:[]
};

/**
 * Method: _isReady Internal function call to begin performing call backs
 */
oscar._isReady = function() {   
    var scope = this;
    $$(document).ready(function() {
        
        var cb = null;
        while((cb = scope.readyCallbacks.shift()) != null) {
            cb.call(scope);
        }
    });
};

/**
 * APIMethod: getScriptLocation Returns the relative path to the oscar script
 * directory
 */
oscar.getScriptLocation = function() {
	return oscar._scriptLocation;
}

/**
 * APIMethod: oscar.onReady Called when all dependencies have been loaded and
 * oscar is ready to be used.
 */
oscar.onReady = function(fn) {
    
    this.readyCallbacks.push(fn);
};


(function() {
        var loadUtility = {};
        var scripts = document.getElementsByTagName('script');
        for ( var i = 0, len = scripts.length; i < len; i++) {
            var src = scripts[i].getAttribute('src');
            if (src) {
                var index = src.indexOf("Loader.js");
                loadUtility.host = oscar._scriptLocation = src.substring(0, index);
                break;
            }
        }
        loadUtility.loadScript = function() {
            var scriptToLoad = $_oscarscriptdependencies.shift();
            var scope = this;
            if(scriptToLoad!=null) {
                var s = scriptToLoad;
                if(scriptToLoad.indexOf("http")== -1) {
                    scriptToLoad=this.host + scriptToLoad;
                }
                oscar.injectJs(scriptToLoad,function(){scope.loadScript()});
            } else {
                setTimeout("oscar._isReady()",0);
                }
        }
        var css =null;
        while((css = $_oscarcssdependencies.shift())!= null) {
            oscar.injectCss(loadUtility.host + css);
        }
        loadUtility.loadScript();
})();
