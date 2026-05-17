function T(e,t){for(var r=0;r<t.length;r++){const n=t[r];if(typeof n!="string"&&!Array.isArray(n)){for(const u in n)if(u!=="default"&&!(u in e)){const c=Object.getOwnPropertyDescriptor(n,u);c&&Object.defineProperty(e,u,c.get?c:{enumerable:!0,get:()=>n[u]})}}}return Object.freeze(Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}))}var ue=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function V(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var R={exports:{}},o={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var h=Symbol.for("react.element"),N=Symbol.for("react.portal"),B=Symbol.for("react.fragment"),z=Symbol.for("react.strict_mode"),F=Symbol.for("react.profiler"),U=Symbol.for("react.provider"),H=Symbol.for("react.context"),G=Symbol.for("react.forward_ref"),W=Symbol.for("react.suspense"),X=Symbol.for("react.memo"),Z=Symbol.for("react.lazy"),C=Symbol.iterator;function K(e){return e===null||typeof e!="object"?null:(e=C&&e[C]||e["@@iterator"],typeof e=="function"?e:null)}var $={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},j=Object.assign,M={};function d(e,t,r){this.props=e,this.context=t,this.refs=M,this.updater=r||$}d.prototype.isReactComponent={};d.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};d.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function O(){}O.prototype=d.prototype;function w(e,t,r){this.props=e,this.context=t,this.refs=M,this.updater=r||$}var b=w.prototype=new O;b.constructor=w;j(b,d.prototype);b.isPureReactComponent=!0;var E=Array.isArray,A=Object.prototype.hasOwnProperty,g={current:null},P={key:!0,ref:!0,__self:!0,__source:!0};function D(e,t,r){var n,u={},c=null,a=null;if(t!=null)for(n in t.ref!==void 0&&(a=t.ref),t.key!==void 0&&(c=""+t.key),t)A.call(t,n)&&!P.hasOwnProperty(n)&&(u[n]=t[n]);var i=arguments.length-2;if(i===1)u.children=r;else if(1<i){for(var s=Array(i),f=0;f<i;f++)s[f]=arguments[f+2];u.children=s}if(e&&e.defaultProps)for(n in i=e.defaultProps,i)u[n]===void 0&&(u[n]=i[n]);return{$$typeof:h,type:e,key:c,ref:a,props:u,_owner:g.current}}function J(e,t){return{$$typeof:h,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}function S(e){return typeof e=="object"&&e!==null&&e.$$typeof===h}function Q(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(r){return t[r]})}var x=/\/+/g;function _(e,t){return typeof e=="object"&&e!==null&&e.key!=null?Q(""+e.key):t.toString(36)}function v(e,t,r,n,u){var c=typeof e;(c==="undefined"||c==="boolean")&&(e=null);var a=!1;if(e===null)a=!0;else switch(c){case"string":case"number":a=!0;break;case"object":switch(e.$$typeof){case h:case N:a=!0}}if(a)return a=e,u=u(a),e=n===""?"."+_(a,0):n,E(u)?(r="",e!=null&&(r=e.replace(x,"$&/")+"/"),v(u,t,r,"",function(f){return f})):u!=null&&(S(u)&&(u=J(u,r+(!u.key||a&&a.key===u.key?"":(""+u.key).replace(x,"$&/")+"/")+e)),t.push(u)),1;if(a=0,n=n===""?".":n+":",E(e))for(var i=0;i<e.length;i++){c=e[i];var s=n+_(c,i);a+=v(c,t,r,s,u)}else if(s=K(e),typeof s=="function")for(e=s.call(e),i=0;!(c=e.next()).done;)c=c.value,s=n+_(c,i++),a+=v(c,t,r,s,u);else if(c==="object")throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.");return a}function m(e,t,r){if(e==null)return e;var n=[],u=0;return v(e,n,"","",function(c){return t.call(r,c,u++)}),n}function Y(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(r){(e._status===0||e._status===-1)&&(e._status=1,e._result=r)},function(r){(e._status===0||e._status===-1)&&(e._status=2,e._result=r)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var l={current:null},k={transition:null},ee={ReactCurrentDispatcher:l,ReactCurrentBatchConfig:k,ReactCurrentOwner:g};function q(){throw Error("act(...) is not supported in production builds of React.")}o.Children={map:m,forEach:function(e,t,r){m(e,function(){t.apply(this,arguments)},r)},count:function(e){var t=0;return m(e,function(){t++}),t},toArray:function(e){return m(e,function(t){return t})||[]},only:function(e){if(!S(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};o.Component=d;o.Fragment=B;o.Profiler=F;o.PureComponent=w;o.StrictMode=z;o.Suspense=W;o.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=ee;o.act=q;o.cloneElement=function(e,t,r){if(e==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var n=j({},e.props),u=e.key,c=e.ref,a=e._owner;if(t!=null){if(t.ref!==void 0&&(c=t.ref,a=g.current),t.key!==void 0&&(u=""+t.key),e.type&&e.type.defaultProps)var i=e.type.defaultProps;for(s in t)A.call(t,s)&&!P.hasOwnProperty(s)&&(n[s]=t[s]===void 0&&i!==void 0?i[s]:t[s])}var s=arguments.length-2;if(s===1)n.children=r;else if(1<s){i=Array(s);for(var f=0;f<s;f++)i[f]=arguments[f+2];n.children=i}return{$$typeof:h,type:e.type,key:u,ref:c,props:n,_owner:a}};o.createContext=function(e){return e={$$typeof:H,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:U,_context:e},e.Consumer=e};o.createElement=D;o.createFactory=function(e){var t=D.bind(null,e);return t.type=e,t};o.createRef=function(){return{current:null}};o.forwardRef=function(e){return{$$typeof:G,render:e}};o.isValidElement=S;o.lazy=function(e){return{$$typeof:Z,_payload:{_status:-1,_result:e},_init:Y}};o.memo=function(e,t){return{$$typeof:X,type:e,compare:t===void 0?null:t}};o.startTransition=function(e){var t=k.transition;k.transition={};try{e()}finally{k.transition=t}};o.unstable_act=q;o.useCallback=function(e,t){return l.current.useCallback(e,t)};o.useContext=function(e){return l.current.useContext(e)};o.useDebugValue=function(){};o.useDeferredValue=function(e){return l.current.useDeferredValue(e)};o.useEffect=function(e,t){return l.current.useEffect(e,t)};o.useId=function(){return l.current.useId()};o.useImperativeHandle=function(e,t,r){return l.current.useImperativeHandle(e,t,r)};o.useInsertionEffect=function(e,t){return l.current.useInsertionEffect(e,t)};o.useLayoutEffect=function(e,t){return l.current.useLayoutEffect(e,t)};o.useMemo=function(e,t){return l.current.useMemo(e,t)};o.useReducer=function(e,t,r){return l.current.useReducer(e,t,r)};o.useRef=function(e){return l.current.useRef(e)};o.useState=function(e){return l.current.useState(e)};o.useSyncExternalStore=function(e,t,r){return l.current.useSyncExternalStore(e,t,r)};o.useTransition=function(){return l.current.useTransition()};o.version="18.3.1";R.exports=o;var y=R.exports;const te=V(y),ce=T({__proto__:null,default:te},[y]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const re=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),I=(...e)=>e.filter((t,r,n)=>!!t&&n.indexOf(t)===r).join(" ");/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var ne={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oe=y.forwardRef(({color:e="currentColor",size:t=24,strokeWidth:r=2,absoluteStrokeWidth:n,className:u="",children:c,iconNode:a,...i},s)=>y.createElement("svg",{ref:s,...ne,width:t,height:t,stroke:e,strokeWidth:n?Number(r)*24/Number(t):r,className:I("lucide",u),...i},[...a.map(([f,L])=>y.createElement(f,L)),...Array.isArray(c)?c:[c]]));/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=(e,t)=>{const r=y.forwardRef(({className:n,...u},c)=>y.createElement(oe,{ref:c,iconNode:t,className:I(`lucide-${re(e)}`,n),...u}));return r.displayName=`${e}`,r};/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const se=p("ArrowDown",[["path",{d:"M12 5v14",key:"s699le"}],["path",{d:"m19 12-7 7-7-7",key:"1idqje"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ie=p("BookOpen",[["path",{d:"M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z",key:"vv98re"}],["path",{d:"M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",key:"1cyq3y"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ae=p("ChevronRight",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const le=p("Cloud",[["path",{d:"M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z",key:"p7xjir"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fe=p("Database",[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pe=p("ExternalLink",[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"M10 14 21 3",key:"gplh6r"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",key:"a6xqqp"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ye=p("Github",[["path",{d:"M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4",key:"tonef"}],["path",{d:"M9 18c-4.51 2-5-2-7-2",key:"9comsn"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const de=p("Mail",[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const he=p("MapPin",[["path",{d:"M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z",key:"2oe9fu"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const me=p("Menu",[["line",{x1:"4",x2:"20",y1:"12",y2:"12",key:"1e0a9i"}],["line",{x1:"4",x2:"20",y1:"6",y2:"6",key:"1owob3"}],["line",{x1:"4",x2:"20",y1:"18",y2:"18",key:"yk5zj1"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ve=p("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);export{se as A,ie as B,ae as C,fe as D,pe as E,ye as G,de as M,te as R,ve as X,le as a,he as b,me as c,ce as d,ue as e,V as g,y as r};
