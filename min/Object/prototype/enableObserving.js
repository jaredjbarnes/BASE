(function(){var a=function(b){if(!(this instanceof a)){return new a(b)}var c=this;Object.defineProperty(c,"type",{get:function(){return b}})};var b=function(){var b=this;var c={};var d=[];var e=function(f){if(f instanceof a&&e.enabled){for(var g=0;g<d.length;g++){d[g].apply(b,arguments)}var h=c[f.type];if(h){for(var i=0;i<h.length;i++){h[i].apply(b,arguments)}}}};e.enabled=true;var f=function(a,b){if(arguments.length===2){if(!c[a]){c[a]=[]}c[a].push(b)}else if(typeof a==="function"){d.push(a)}};var g=function(a,c){c=c||a;if(arguments.length===2){var d=function(e){c.apply(this,arguments);b.unobserve(a,d)};j;b.observe(a,d)}else if(arguments.length===1){var d=function(a){c.apply(this,arguments);b.unobserve(d)};b.observe(d)}};var h=function(a,b){if(b&&typeof a==="string"&&c[a]){var e=c[a];var f=e.indexOf(b);if(f>-1){e.splice(f,1)}}else if(typeof a==="function"){for(var g in c){var f=c[g].indexOf(a);if(f>-1){c[g].splice(f,1)}}f=d.indexOf(a);if(f>-1){d.splice(f,1)}}};var i={};for(var j in b)(function(c){if(typeof b[c]!=="function"){i[c]=b[c];var d=Object.getOwnPropertyDescriptor(b,c);var f=d.get;var g=d.set;if(f){Object.defineProperty(b,c,{enumerable:true,configurable:true,get:f})}else{Object.defineProperty(b,c,{enumerable:true,configurable:true,get:function(){return i[c]}})}if(g){Object.defineProperty(b,c,{writable:true,enumerable:true,configurable:true,set:function(d){var f=e.enabled;if(f){e.enabled=false}g.apply(b,arguments);if(f){e.enabled=true}if(h!==d&&b[c]===d){var h=i[c];var j=new a(c);Object.defineProperties(j,{newValue:{get:function(){return d},enumerable:true},oldValue:{get:function(){return h},enumerable:true},property:{get:function(){return c},enumerable:true},target:{get:function(){return b},enumerable:true}});e(j)}}})}else if(!f&&!g){Object.defineProperty(b,c,{set:function(d){i[c]=d;if(g!==d){var f=new a(c);var g=i[c];var f=new a(c);Object.defineProperties(f,{newValue:{get:function(){return d},enumerable:true},oldValue:{get:function(){return g},enumerable:true},property:{get:function(){return c},enumerable:true},target:{get:function(){return b},enumerable:true}});e(f)}}})}}})(j);Object.defineProperties(b,{observe:{value:f,writable:false,enumerable:false},observeOnce:{value:g,writable:false,enumerable:false},unobserve:{value:h,writable:false,enumerable:false}})};Object.defineProperty(Object.prototype,"enableObserving",{enumerable:false,get:function(){return b}})})()