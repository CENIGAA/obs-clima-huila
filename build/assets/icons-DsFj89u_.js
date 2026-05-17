function V(e,t){for(var r=0;r<t.length;r++){const n=t[r];if(typeof n!="string"&&!Array.isArray(n)){for(const u in n)if(u!=="default"&&!(u in e)){const a=Object.getOwnPropertyDescriptor(n,u);a&&Object.defineProperty(e,u,a.get?a:{enumerable:!0,get:()=>n[u]})}}}return Object.freeze(Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}))}var ue=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function T(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var E={exports:{}},o={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var h=Symbol.for("react.element"),z=Symbol.for("react.portal"),N=Symbol.for("react.fragment"),B=Symbol.for("react.strict_mode"),H=Symbol.for("react.profiler"),F=Symbol.for("react.provider"),G=Symbol.for("react.context"),U=Symbol.for("react.forward_ref"),Z=Symbol.for("react.suspense"),W=Symbol.for("react.memo"),X=Symbol.for("react.lazy"),M=Symbol.iterator;function K(e){return e===null||typeof e!="object"?null:(e=M&&e[M]||e["@@iterator"],typeof e=="function"?e:null)}var j={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},R=Object.assign,$={};function d(e,t,r){this.props=e,this.context=t,this.refs=$,this.updater=r||j}d.prototype.isReactComponent={};d.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};d.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function O(){}O.prototype=d.prototype;function w(e,t,r){this.props=e,this.context=t,this.refs=$,this.updater=r||j}var b=w.prototype=new O;b.constructor=w;R(b,d.prototype);b.isPureReactComponent=!0;var x=Array.isArray,A=Object.prototype.hasOwnProperty,g={current:null},P={key:!0,ref:!0,__self:!0,__source:!0};function L(e,t,r){var n,u={},a=null,i=null;if(t!=null)for(n in t.ref!==void 0&&(i=t.ref),t.key!==void 0&&(a=""+t.key),t)A.call(t,n)&&!P.hasOwnProperty(n)&&(u[n]=t[n]);var s=arguments.length-2;if(s===1)u.children=r;else if(1<s){for(var c=Array(s),p=0;p<s;p++)c[p]=arguments[p+2];u.children=c}if(e&&e.defaultProps)for(n in s=e.defaultProps,s)u[n]===void 0&&(u[n]=s[n]);return{$$typeof:h,type:e,key:a,ref:i,props:u,_owner:g.current}}function J(e,t){return{$$typeof:h,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}function S(e){return typeof e=="object"&&e!==null&&e.$$typeof===h}function Q(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(r){return t[r]})}var C=/\/+/g;function _(e,t){return typeof e=="object"&&e!==null&&e.key!=null?Q(""+e.key):t.toString(36)}function m(e,t,r,n,u){var a=typeof e;(a==="undefined"||a==="boolean")&&(e=null);var i=!1;if(e===null)i=!0;else switch(a){case"string":case"number":i=!0;break;case"object":switch(e.$$typeof){case h:case z:i=!0}}if(i)return i=e,u=u(i),e=n===""?"."+_(i,0):n,x(u)?(r="",e!=null&&(r=e.replace(C,"$&/")+"/"),m(u,t,r,"",function(p){return p})):u!=null&&(S(u)&&(u=J(u,r+(!u.key||i&&i.key===u.key?"":(""+u.key).replace(C,"$&/")+"/")+e)),t.push(u)),1;if(i=0,n=n===""?".":n+":",x(e))for(var s=0;s<e.length;s++){a=e[s];var c=n+_(a,s);i+=m(a,t,r,c,u)}else if(c=K(e),typeof c=="function")for(e=c.call(e),s=0;!(a=e.next()).done;)a=a.value,c=n+_(a,s++),i+=m(a,t,r,c,u);else if(a==="object")throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.");return i}function k(e,t,r){if(e==null)return e;var n=[],u=0;return m(e,n,"","",function(a){return t.call(r,a,u++)}),n}function Y(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(r){(e._status===0||e._status===-1)&&(e._status=1,e._result=r)},function(r){(e._status===0||e._status===-1)&&(e._status=2,e._result=r)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var l={current:null},v={transition:null},ee={ReactCurrentDispatcher:l,ReactCurrentBatchConfig:v,ReactCurrentOwner:g};function D(){throw Error("act(...) is not supported in production builds of React.")}o.Children={map:k,forEach:function(e,t,r){k(e,function(){t.apply(this,arguments)},r)},count:function(e){var t=0;return k(e,function(){t++}),t},toArray:function(e){return k(e,function(t){return t})||[]},only:function(e){if(!S(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};o.Component=d;o.Fragment=N;o.Profiler=H;o.PureComponent=w;o.StrictMode=B;o.Suspense=Z;o.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=ee;o.act=D;o.cloneElement=function(e,t,r){if(e==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var n=R({},e.props),u=e.key,a=e.ref,i=e._owner;if(t!=null){if(t.ref!==void 0&&(a=t.ref,i=g.current),t.key!==void 0&&(u=""+t.key),e.type&&e.type.defaultProps)var s=e.type.defaultProps;for(c in t)A.call(t,c)&&!P.hasOwnProperty(c)&&(n[c]=t[c]===void 0&&s!==void 0?s[c]:t[c])}var c=arguments.length-2;if(c===1)n.children=r;else if(1<c){s=Array(c);for(var p=0;p<c;p++)s[p]=arguments[p+2];n.children=s}return{$$typeof:h,type:e.type,key:u,ref:a,props:n,_owner:i}};o.createContext=function(e){return e={$$typeof:G,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:F,_context:e},e.Consumer=e};o.createElement=L;o.createFactory=function(e){var t=L.bind(null,e);return t.type=e,t};o.createRef=function(){return{current:null}};o.forwardRef=function(e){return{$$typeof:U,render:e}};o.isValidElement=S;o.lazy=function(e){return{$$typeof:X,_payload:{_status:-1,_result:e},_init:Y}};o.memo=function(e,t){return{$$typeof:W,type:e,compare:t===void 0?null:t}};o.startTransition=function(e){var t=v.transition;v.transition={};try{e()}finally{v.transition=t}};o.unstable_act=D;o.useCallback=function(e,t){return l.current.useCallback(e,t)};o.useContext=function(e){return l.current.useContext(e)};o.useDebugValue=function(){};o.useDeferredValue=function(e){return l.current.useDeferredValue(e)};o.useEffect=function(e,t){return l.current.useEffect(e,t)};o.useId=function(){return l.current.useId()};o.useImperativeHandle=function(e,t,r){return l.current.useImperativeHandle(e,t,r)};o.useInsertionEffect=function(e,t){return l.current.useInsertionEffect(e,t)};o.useLayoutEffect=function(e,t){return l.current.useLayoutEffect(e,t)};o.useMemo=function(e,t){return l.current.useMemo(e,t)};o.useReducer=function(e,t,r){return l.current.useReducer(e,t,r)};o.useRef=function(e){return l.current.useRef(e)};o.useState=function(e){return l.current.useState(e)};o.useSyncExternalStore=function(e,t,r){return l.current.useSyncExternalStore(e,t,r)};o.useTransition=function(){return l.current.useTransition()};o.version="18.3.1";E.exports=o;var y=E.exports;const te=T(y),ae=V({__proto__:null,default:te},[y]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const re=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),q=(...e)=>e.filter((t,r,n)=>!!t&&n.indexOf(t)===r).join(" ");/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var ne={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oe=y.forwardRef(({color:e="currentColor",size:t=24,strokeWidth:r=2,absoluteStrokeWidth:n,className:u="",children:a,iconNode:i,...s},c)=>y.createElement("svg",{ref:c,...ne,width:t,height:t,stroke:e,strokeWidth:n?Number(r)*24/Number(t):r,className:q("lucide",u),...s},[...i.map(([p,I])=>y.createElement(p,I)),...Array.isArray(a)?a:[a]]));/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=(e,t)=>{const r=y.forwardRef(({className:n,...u},a)=>y.createElement(oe,{ref:a,iconNode:t,className:q(`lucide-${re(e)}`,n),...u}));return r.displayName=`${e}`,r};/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ce=f("ArrowDown",[["path",{d:"M12 5v14",key:"s699le"}],["path",{d:"m19 12-7 7-7-7",key:"1idqje"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const se=f("ArrowLeft",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ie=f("BookOpen",[["path",{d:"M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z",key:"vv98re"}],["path",{d:"M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",key:"1cyq3y"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const le=f("ChevronRight",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fe=f("Cloud",[["path",{d:"M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z",key:"p7xjir"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pe=f("Database",[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ye=f("ExternalLink",[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"M10 14 21 3",key:"gplh6r"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",key:"a6xqqp"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const de=f("Github",[["path",{d:"M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4",key:"tonef"}],["path",{d:"M9 18c-4.51 2-5-2-7-2",key:"9comsn"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const he=f("GraduationCap",[["path",{d:"M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z",key:"j76jl0"}],["path",{d:"M22 10v6",key:"1lu8f3"}],["path",{d:"M6 12.5V16a6 3 0 0 0 12 0v-3.5",key:"1r8lef"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ke=f("Mail",[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const me=f("MapPin",[["path",{d:"M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z",key:"2oe9fu"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ve=f("Menu",[["line",{x1:"4",x2:"20",y1:"12",y2:"12",key:"1e0a9i"}],["line",{x1:"4",x2:"20",y1:"6",y2:"6",key:"1owob3"}],["line",{x1:"4",x2:"20",y1:"18",y2:"18",key:"yk5zj1"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _e=f("Mountain",[["path",{d:"m8 3 4 8 5-5 5 15H2L8 3z",key:"otkl63"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const we=f("Scale",[["path",{d:"m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z",key:"7g6ntu"}],["path",{d:"m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z",key:"ijws7r"}],["path",{d:"M7 21h10",key:"1b0cd5"}],["path",{d:"M12 3v18",key:"108xh3"}],["path",{d:"M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2",key:"3gwbw2"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const be=f("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);export{ce as A,ie as B,le as C,pe as D,ye as E,de as G,ke as M,te as R,we as S,be as X,se as a,fe as b,he as c,me as d,ve as e,_e as f,ae as g,ue as h,T as i,y as r};
