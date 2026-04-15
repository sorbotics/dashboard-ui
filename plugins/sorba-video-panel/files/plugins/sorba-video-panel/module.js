define(["@grafana/data","react","@emotion/css","@grafana/ui","lodash"],((e,t,a,r,n)=>(()=>{"use strict";var s={644:e=>{e.exports=a},305:t=>{t.exports=e},388:e=>{e.exports=r},980:e=>{e.exports=n},650:e=>{e.exports=t}},o={};function l(e){var t=o[e];if(void 0!==t)return t.exports;var a=o[e]={exports:{}};return s[e](a,a.exports,l),a.exports}l.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return l.d(t,{a:t}),t},l.d=(e,t)=>{for(var a in t)l.o(t,a)&&!l.o(e,a)&&Object.defineProperty(e,a,{enumerable:!0,get:t[a]})},l.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),l.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var c={};return(()=>{l.r(c),l.d(c,{plugin:()=>f});var e=l(305),t=l(650),a=l.n(t),r=l(644),n=l(388);const s=()=>({wrapper:r.css`
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      background: rgb(17, 18, 23);
    `,svg:r.css`
      width: 24px;
      height: 24px;
    `,text:r.css`
      margin-left: 5px;
    `}),o=({message:e="Camera not found"})=>{const t=(0,n.useStyles2)(s);return a().createElement("div",{className:t.wrapper},a().createElement("svg",{xmlns:"http://www.w3.org/2000/svg",className:t.svg,viewBox:"0 0 512 512"},a().createElement("title",null,"Alert Circle"),a().createElement("path",{d:"M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z",fill:"none",stroke:"currentColor",strokeMiterlimit:"10",strokeWidth:"32"}),a().createElement("path",{d:"M250.26 166.05L256 288l5.73-121.95a5.74 5.74 0 00-5.79-6h0a5.74 5.74 0 00-5.68 6z",fill:"none",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"32"}),a().createElement("path",{d:"M256 367.91a20 20 0 1120-20 20 20 0 01-20 20z",fill:"none",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"22"})),a().createElement("span",{className:t.text},e))},i=()=>{const e=r.keyframes`
    to {
        transform: rotate(1turn);
    }
  `;return{wrapper:r.css`
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    `,spinner:r.css`
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 6.4px solid;
      border-color: #dbdcef;
      border-right-color: #1f6feb;
      animation: ${e} 1s infinite linear;
    `}},d=()=>{const e=(0,n.useStyles2)(i);return a().createElement("div",{className:e.wrapper},a().createElement("div",{className:e.spinner}))},u=()=>({wrapper:r.css`
      height: 100%;
      width: 100%;
    `}),h=({camera:e=null,onload:r,scaledWidth:s=200,scaledHeight:l=200,searchParams:c=""})=>{const i=(0,t.useRef)(null),[h,m]=(0,t.useState)(!1),[p,g]=(0,t.useState)(!1),v=(0,t.useMemo)((()=>new Image),[]);v.onload=(0,t.useCallback)((e=>{if(m(!0),g(!1),i.current){const t=i.current.getContext("2d");t&&t.drawImage(v,0,0,s,l),r&&r(e)}}),[v,r,l,s,m,i]),v.onerror=(0,t.useCallback)((e=>{m(!0),g(!0)}),[m,g]),(0,t.useEffect)((()=>{v.src=`https://${window.location.host}/frigate/api/${e}/latest.jpg?h=${l}${c?`&${c}`:""}`}),[i,e,v,c,l,s]);const f=(0,n.useStyles2)(u);return a().createElement("div",{className:f.wrapper},h?null:a().createElement(d,null),h&&p?a().createElement(o,null):null,h&&!p?a().createElement("canvas",{ref:i,height:l,width:s}):null)},m=()=>({wrapper:r.css`
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    `}),p=({camera:e,searchParams:r="",scaledWidth:s,scaledHeight:o})=>{const[l,c]=(0,t.useState)(Date.now()),i=(0,t.useCallback)((()=>{const e=Date.now()-l;setTimeout((()=>{c(Date.now())}),e>200?1:200)}),[l]),d=(0,n.useStyles2)(m);return a().createElement("div",{className:d.wrapper},a().createElement(h,{camera:e,onload:i,scaledWidth:s,scaledHeight:o,searchParams:`&cache=${l}&${r}`}))};var g=l(980);const v=({item:e,value:r,onChange:s})=>{const[o,l]=(0,t.useState)([]);return(0,t.useEffect)((()=>{fetch("/visionapi/cameras").then((e=>e.json())).then((e=>{const t=e.rows.map((e=>({label:e.name,value:e.name})));l(t)})).catch((()=>{l([])}))}),[]),a().createElement(n.Select,{options:o,value:r,onChange:e=>s(e.value)})},f=new e.PanelPlugin((({options:e,data:n,width:s,height:l})=>{const c=e.camera,i=!!e.camera,d=e,u=Math.round(s),h=Math.round(l),[m,v]=(0,t.useState)({}),f=(0,t.useMemo)((()=>new URLSearchParams(Object.keys(d).reduce(((e,t)=>(e.push([t,!0===d[t]?"1":"0"]),e)),[]))),[d]);return Object.values(e).length&&!(0,g.isEqual)(e,m)&&v(e),a().createElement("div",{className:(0,r.cx)(r.css`
          width: ${s}px;
          height: ${l}px;
        `)},i?a().createElement(p,{camera:c,scaledWidth:u,scaledHeight:h,searchParams:f}):a().createElement(o,{message:"No camera selected"}))})).setPanelOptions((e=>e.addCustomEditor({id:"camera",path:"camera",name:"Camera",editor:v}).addBooleanSwitch({path:"bbox",name:"Bounding box",showIf:e=>{var t;return!!(null===(t=e.camera)||void 0===t?void 0:t.length)}}).addBooleanSwitch({path:"timestamp",name:"Timestamp",showIf:e=>{var t;return!!(null===(t=e.camera)||void 0===t?void 0:t.length)}}).addBooleanSwitch({path:"zones",name:"Zones",showIf:e=>{var t;return!!(null===(t=e.camera)||void 0===t?void 0:t.length)}}).addBooleanSwitch({path:"mask",name:"Masks",showIf:e=>{var t;return!!(null===(t=e.camera)||void 0===t?void 0:t.length)}}).addBooleanSwitch({path:"motion",name:"Motion boxes",showIf:e=>{var t;return!!(null===(t=e.camera)||void 0===t?void 0:t.length)}}).addBooleanSwitch({path:"regions",name:"Regions",showIf:e=>{var t;return!!(null===(t=e.camera)||void 0===t?void 0:t.length)}})))})(),c})()));
//# sourceMappingURL=module.js.map