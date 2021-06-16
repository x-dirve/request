!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t=t||self).xRequest={})}(this,(function(t){"use strict";function e(t,e){return Object.prototype.toString.call(t).substr(8,e.length).toLowerCase()===e}function o(t){return e(t,"object")}function n(t){return e(t,"undefined")}var r=/\{(\w+)\}/g;function s(t){return e(t,"function")}function i(t,e,n){n=n||this;var r,i=s(e);if(r=t,Array.isArray(r))for(var a=0;a<t.length;a++){var u=!0;if(i&&(u=e.call(n,t[a],a)),!1===u)break}else if(o(t))for(var c=Object.keys(t),f=0;f<c.length;f++){var p=!0;if(i&&(p=e.call(n,t[c[f]],c[f])),!1===p)break}}function a(t){for(var e,n,r=arguments,s=[],i=arguments.length-1;i-- >0;)s[i]=r[i+1];if(!s.length)return t;var u=s.shift();if(o(t)&&o(u))for(var c in u)o(u[c])?(t[c]||Object.assign(t,((e={})[c]={},e)),a(t[c],u[c])):Object.assign(t,((n={})[c]=u[c],n));return a.apply(void 0,[t].concat(s))}function u(t){return e(t,"string")}var c,f=function(t){return t},p=!1,h={},l={},d=1,v=/get|head|delete/,y=/^http[s]?:/i,g=/^\//i,m={},k=function(t){var e=window.location.pathname;if(m[e]&&m[e].length){var o=m[e].indexOf(t);-1!==o&&m[e].splice(o,1)}};function w(t,e){var n=t;return t=(t=h[t])||n,o(e)&&(t=t.replace(r,(function(t,o){var n=e[o];return delete e[o],n}))),t}function R(){for(var t,e=[],o=arguments.length;o--;)e[o]=arguments[o];(t=console.log).call.apply(t,[console,"%c[Request]","color: cyan;"].concat(e))}var b=function(){this.defConf={autoToast:!0,dataType:"json",fresh:!0,credentials:!1,header:{"X-Requested-With":"XMLHttpRequest"},timeout:1e4,raw:!1},this.hooks={},this.keys={data:"data",code:"code",message:"message"};this.hooks={onRequest:function(t,e,o){},onResponse:function(t){return t},onResponseError:function(t){return!0}}};b.register=function(t,e){o(t)&&i(t,(function(t,s){var i,a;h[s]?console.warn("API "+s+" 已被定义"):(g.test(s)||(s="/"+s),u(e)&&!y.test(t)?(g.test(t)||(t="/"+t),t=""+e+t):y.test(t)||(i=l,void 0===(a=!0)&&(a=!1),t=t.replace(r,(function(t,e){var r=o(i)?i[e]:i;return n(r)&&a?t:r}))),h[s]=t)}))},b.cancel=function(t){var e=u(t)?t:window.location.pathname,o=m[e];if(o&&o.length)try{for(var n in o){var r=o[n];r&&r.abort()}}catch(t){console.error(t)}m[e]=[]},b.randomStr=function(){return(Date.now()+Math.random()).toString(16)},b.prototype.resolveUri=function(t,e){return w(t,e)},b.prototype.parseData=function(t){return u(t)?t.replace(/\+/g,"%2B"):JSON.stringify(t)},b.prototype.parseFormData=function(t){var e=new FormData;return o(t)&&i(t,(function(t,o){e.append(o,t)})),e},b.prototype.checkOriginHost=function(t){return b.A.href=t,b.A.host===window.location.host},b.prototype.setting=function(t){o(t)&&(p&&R("setting","->",t),o(t.hooks)&&(this.hooks=a(this.hooks,t.hooks)),o(t.keys)&&(this.keys=a(this.keys,t.keys)))},b.prototype.run=function(t,n,r,u,p){var h=this;void 0===r&&(r={}),void 0===u&&(u={}),void 0===p&&(p={}),t=t.toLocaleLowerCase();var l,y=a(this.defConf,p);y.fresh&&(r._=b.randomStr()),s(this.hooks.onRequest)&&this.hooks.onRequest.call(this,y,r,u),n=this.resolveUri(n,r),o(r)&&(n+="?"+((l=r)?Object.keys(l).map((function(t){return t+"="+encodeURIComponent(l[t])})).join("&"):""));var g,w,R=new XMLHttpRequest,O=new Promise((function(o,a){var l,g,m=y.header,w=!h.checkOriginHost(n);v.test(t)||(m.hasOwnProperty("Content-Type")||(m["Content-Type"]="application/json"),null===m["Content-Type"]?(delete m["Content-Type"],l=h.parseFormData(u)):l=h.parseData(u)),w&&(p.credentials&&(R.withCredentials=!0),delete m["X-Requested-With"]),g=p.timeout,!isNaN(g)&&e(g,"number")&&(R.timeout=p.timeout),R.open(t,n,!0),i(m,(function(t,e){R.setRequestHeader(e,t)}));var b=h;R.onload=function(){if(k(this),this.status>=200&&this.status<300||304===this.status){var t=this.responseText;if(s(b.hooks.onResponse)&&b.hooks.onResponse.call(b,t,p,r,l),"json"===y.dataType)try{t=JSON.parse(t)}catch(t){return void a(t)}var e=t[b.keys.data],n=t[b.keys.code];if(Number(n)!==d){var i=t[b.keys.message];return y.autoToast&&i&&c&&c(f({description:i,message:"请求错误",type:"fail"})),b.hooks.onResponseError(t,"Business",y),a(t)}o(p.raw?t:e||{})}else a(new Error("Request Error, status ["+this.status+"]"))},R.onerror=function(){b.hooks.onResponseError({},"Net",y),a(new Error("Request Error,["+t+"] >> "+n))},R.ontimeout=R.onerror=function(t){k(this),b.hooks.onResponseError({},"Timeout",y),a(t)},R.send(l)}));return O.abort=function(){R.abort(),k(R)},g=R,w=window.location.pathname,m[w]||(m[w]=[]),m[w].push(g),O},b.prototype.get=function(t,e,o){return this.run("GET",t,e,{},o)},b.prototype.post=function(t,e,r,s){return o(e)&&n(r)&&(r=e,e={}),n(r)&&(r={}),this.run("POST",t,e,r,s)},b.A=document.createElement("a");var O=new b;t.R=b,t.config=function(t,e){void 0===e&&(e="production"),p="production"!==e;var r=t.successCode,a=t.hosts,u=t.apis,h=t.notifyMod,v=t.notifyMsgFormater;p&&R("config","->",t),n(r)||(d=r),o(a)&&i(a,(function(t,e){l[e]=t})),o(u)&&b.register(u),n(h)||(c=h),s(v)&&(f=v)},t.default=O,t.resloveUrl=w,Object.defineProperty(t,"__esModule",{value:!0})}));
