"use strict";(self.webpackChunkgrafana=self.webpackChunkgrafana||[]).push([[2415],{"./public/app/features/alerting/unified/AlertGroups.tsx":(e,t,s)=>{s.r(t),s.d(t,{default:()=>R});var a=s("../../opt/drone/yarncache/react-npm-17.0.2-99ba37d931-b254cc17ce.zip/node_modules/react/index.js"),r=s("./.yarn/__virtual__/react-redux-virtual-7ad20a440e/3/opt/drone/yarncache/react-redux-npm-7.2.6-134f5ed64d-0bf142ce0d.zip/node_modules/react-redux/es/index.js"),n=s("./packages/grafana-ui/src/index.ts"),i=s("./public/app/core/hooks/useQueryParams.ts"),l=s("./public/app/features/alerting/unified/components/AlertingPageWrapper.tsx"),c=s("./public/app/plugins/datasource/alertmanager/types.ts"),o=s("./.yarn/__virtual__/@emotion-css-virtual-72c314ddb1/3/opt/drone/yarncache/@emotion-css-npm-11.7.1-25ff8755a7-ac1f56656f.zip/node_modules/@emotion/css/dist/emotion-css.esm.js"),u=s("./public/app/features/alerting/unified/components/AlertLabels.tsx"),p=s("./packages/grafana-data/src/index.ts"),d=s("./public/app/features/alerting/unified/components/silences/AmAlertStateTag.tsx"),g=s("./public/app/features/alerting/unified/components/DynamicTableWithGuidelines.tsx"),m=s("./public/app/features/alerting/unified/utils/misc.ts"),b=s("./public/app/features/alerting/unified/components/AnnotationDetailsField.tsx"),f=s("../../opt/drone/yarncache/react-npm-17.0.2-99ba37d931-b254cc17ce.zip/node_modules/react/jsx-runtime.js");const x=e=>{let{alert:t,alertManagerSourceName:s}=e;const a=(0,n.useStyles2)(h);return(0,f.jsxs)(f.Fragment,{children:[(0,f.jsxs)("div",{className:a.actionsRow,children:[t.status.state===c.Z9.Suppressed&&(0,f.jsx)(n.LinkButton,{href:`${(0,m.eQ)("/alerting/silences",s)}&silenceIds=${t.status.silencedBy.join(",")}`,className:a.button,icon:"bell",size:"sm",children:"Manage silences"}),t.status.state===c.Z9.Active&&(0,f.jsx)(n.LinkButton,{href:(0,m.VN)(s,t.labels),className:a.button,icon:"bell-slash",size:"sm",children:"Silence"}),t.generatorURL&&(0,f.jsx)(n.LinkButton,{className:a.button,href:t.generatorURL,icon:"chart-line",size:"sm",children:"See source"})]}),Object.entries(t.annotations).map((e=>{let[t,s]=e;return(0,f.jsx)(b.a,{annotationKey:t,value:s},t)})),(0,f.jsxs)("div",{className:a.receivers,children:["Receivers:"," ",t.receivers.map((e=>{let{name:t}=e;return t})).filter((e=>!!e)).join(", ")]})]})},h=e=>({button:o.css`
    & + & {
      margin-left: ${e.spacing(1)};
    }
  `,actionsRow:o.css`
    padding: ${e.spacing(2,0)} !important;
    border-bottom: 1px solid ${e.colors.border.medium};
  `,receivers:o.css`
    padding: ${e.spacing(1,0)};
  `}),j=e=>{let{alerts:t,alertManagerSourceName:s}=e;const r=(0,n.useStyles2)(y),i=(0,a.useMemo)((()=>[{id:"state",label:"State",renderCell:e=>{let{data:t}=e;return(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)(d.G,{state:t.status.state}),(0,f.jsxs)("span",{className:r.duration,children:["for"," ",(0,p.intervalToAbbreviatedDurationString)({start:new Date(t.startsAt),end:new Date(t.endsAt)})]})]})},size:"220px"},{id:"labels",label:"Labels",renderCell:e=>{let{data:{labels:t}}=e;return(0,f.jsx)(u.s,{className:r.labels,labels:t})},size:1}]),[r]),l=(0,a.useMemo)((()=>t.map((e=>({id:e.fingerprint,data:e})))),[t]);return(0,f.jsx)("div",{className:r.tableWrapper,"data-testid":"alert-group-table",children:(0,f.jsx)(g.F,{cols:i,items:l,isExpandable:!0,renderExpandedContent:e=>{let{data:t}=e;return(0,f.jsx)(x,{alert:t,alertManagerSourceName:s})}})})},y=e=>({tableWrapper:o.css`
    margin-top: ${e.spacing(3)};
    ${e.breakpoints.up("md")} {
      margin-left: ${e.spacing(4.5)};
    }
  `,duration:o.css`
    margin-left: ${e.spacing(1)};
    font-size: ${e.typography.bodySmall.fontSize};
  `,labels:o.css`
    padding-bottom: 0;
  `});var v,S=s("./public/app/features/alerting/unified/components/CollapseToggle.tsx"),N=s("./public/app/features/alerting/unified/components/alert-groups/AlertGroupHeader.tsx");const _=e=>{let{alertManagerSourceName:t,group:s}=e;const[r,i]=(0,a.useState)(!0),l=(0,n.useStyles2)(k);return(0,f.jsxs)("div",{className:l.wrapper,children:[(0,f.jsxs)("div",{className:l.header,children:[(0,f.jsxs)("div",{className:l.group,"data-testid":"alert-group",children:[(0,f.jsx)(S.U,{isCollapsed:r,onToggle:()=>i(!r),"data-testid":"alert-group-collapse-toggle"}),Object.keys(s.labels).length?(0,f.jsx)(u.s,{className:l.headerLabels,labels:s.labels}):v||(v=(0,f.jsx)("span",{children:"No grouping"}))]}),(0,f.jsx)(N.Z,{group:s})]}),!r&&(0,f.jsx)(j,{alertManagerSourceName:t,alerts:s.alerts})]})},k=e=>({wrapper:o.css`
    & + & {
      margin-top: ${e.spacing(2)};
    }
  `,headerLabels:o.css`
    padding-bottom: 0 !important;
    margin-bottom: -${e.spacing(.5)};
  `,header:o.css`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    padding: ${e.spacing(1,1,1,0)};
    background-color: ${e.colors.background.secondary};
    width: 100%;
  `,group:o.css`
    display: flex;
    flex-direction: row;
    align-items: center;
  `,summary:o.css``,spanElement:o.css`
    margin-left: ${e.spacing(.5)};
  `,[c.Z9.Active]:o.css`
    color: ${e.colors.error.main};
  `,[c.Z9.Suppressed]:o.css`
    color: ${e.colors.primary.main};
  `,[c.Z9.Unprocessed]:o.css`
    color: ${e.colors.secondary.main};
  `});var $,C=s("./public/app/features/alerting/unified/components/AlertManagerPicker.tsx"),w=s("./public/app/features/alerting/unified/components/alert-groups/MatcherFilter.tsx");const z=e=>{let{onStateFilterChange:t,stateFilter:s}=e;const a=(0,n.useStyles2)(M),r=Object.entries(c.Z9).sort(((e,t)=>{let[s]=e,[a]=t;return s<a?-1:1})).map((e=>{let[t,s]=e;return{label:t,value:s}}));return(0,f.jsxs)("div",{className:a.wrapper,children:[$||($=(0,f.jsx)(n.Label,{children:"State"})),(0,f.jsx)(n.RadioButtonGroup,{options:r,value:s,onChange:t})]})},M=e=>({wrapper:o.css`
    margin-left: ${e.spacing(1)};
  `});var G,A,F=s("../../opt/drone/yarncache/lodash-npm-4.17.21-6382451519-eb835a2e51.zip/node_modules/lodash/lodash.js");const O=e=>{let{className:t,groups:s,groupBy:a,onGroupingChange:r}=e;const i=(0,F.uniq)(s.flatMap((e=>e.alerts)).flatMap((e=>{let{labels:t}=e;return Object.keys(t)}))).filter((e=>!(e.startsWith("__")&&e.endsWith("__")))).map((e=>({label:e,value:e})));return(0,f.jsxs)("div",{"data-testid":"group-by-container",className:t,children:[G||(G=(0,f.jsx)(n.Label,{children:"Custom group by"})),(0,f.jsx)(n.MultiSelect,{"aria-label":"group by label keys",value:a,placeholder:"Group by",prefix:A||(A=(0,f.jsx)(n.Icon,{name:"tag-alt"})),onChange:e=>{r(e.map((e=>{let{value:t}=e;return t})))},options:i})]})};var B=s("./public/app/features/alerting/unified/hooks/useAlertManagerSourceName.ts");const L=e=>{let{groups:t}=e;const[s,r]=(0,a.useState)(Math.floor(100*Math.random())),[l,c]=(0,i.K)(),{groupBy:o=[],queryString:u,alertState:p}=(0,m.lC)(l),d=`matcher-${s}`,[g,b]=(0,B.k)(),x=(0,n.useStyles2)(Z),h=!!(o.length>0||u||p);return(0,f.jsxs)("div",{className:x.wrapper,children:[(0,f.jsx)(C.P,{current:g,onChange:b}),(0,f.jsxs)("div",{className:x.filterSection,children:[(0,f.jsx)(w.F,{className:x.filterInput,defaultQueryString:u,onFilterChange:e=>c({queryString:e||null})},d),(0,f.jsx)(O,{className:x.filterInput,groups:t,groupBy:o,onGroupingChange:e=>c({groupBy:e.length?e.join(","):null})}),(0,f.jsx)(z,{stateFilter:p,onStateFilterChange:e=>c({alertState:e||null})}),h&&(0,f.jsx)(n.Button,{className:x.clearButton,variant:"secondary",icon:"times",onClick:()=>{c({groupBy:null,queryString:null,alertState:null}),setTimeout((()=>r(s+1)),100)},children:"Clear filters"})]})]})},Z=e=>({wrapper:o.css`
    border-bottom: 1px solid ${e.colors.border.medium};
    margin-bottom: ${e.spacing(3)};
  `,filterSection:o.css`
    display: flex;
    flex-direction: row;
    margin-bottom: ${e.spacing(3)};
  `,filterInput:o.css`
    width: 340px;
    & + & {
      margin-left: ${e.spacing(1)};
    }
  `,clearButton:o.css`
    margin-left: ${e.spacing(1)};
    margin-top: 19px;
  `});var I=s("./public/app/features/alerting/unified/state/actions.ts"),P=s("./public/app/features/alerting/unified/utils/redux.ts"),T=s("./public/app/features/alerting/unified/utils/constants.ts"),E=s("./public/app/features/alerting/unified/hooks/useUnifiedAlertingSelector.ts");var W=s("./public/app/features/alerting/unified/utils/alertmanager.ts");var q,D;const U=e=>({groupingBanner:o.css`
    margin: ${e.spacing(2,0)};
  `}),R=()=>{var e;const[t]=(0,B.k)(),s=(0,r.useDispatch)(),[c]=(0,i.K)(),{groupBy:o=[]}=(0,m.lC)(c),u=(0,n.useStyles2)(U),p=(0,E._)((e=>e.amAlertGroups)),{loading:d,error:g,result:b=[]}=null!==(e=p[t||""])&&void 0!==e?e:P.oq,x=((e,t)=>(0,a.useMemo)((()=>0===t.length?e:e.flatMap((e=>{let{alerts:t}=e;return t})).reduce(((e,s)=>{if(t.every((e=>Object.keys(s.labels).includes(e)))){const a=e.find((e=>t.every((t=>e.labels[t]===s.labels[t]))));if(a)a.alerts.push(s);else{const a=t.reduce(((e,t)=>Object.assign({},e,{[t]:s.labels[t]})),{});e.push({alerts:[s],labels:a,receiver:{name:"NONE"}})}}else{const t=e.find((e=>0===Object.keys(e.labels).length));t?t.alerts.push(s):e.push({alerts:[s],labels:{},receiver:{name:"NONE"}})}return e}),[])),[e,t]))(b,o),h=(e=>{const[t]=(0,i.K)(),s=(0,m.lC)(t),r=(0,W.Zh)(s.queryString||"");return(0,a.useMemo)((()=>e.reduce(((e,t)=>{const a=t.alerts.filter((e=>{let{labels:t,status:a}=e;const n=(0,W.eD)(t,r),i=!s.alertState||a.state===s.alertState;return n&&i}));return a.length>0&&(0===Object.keys(t.labels).length?e.unshift(Object.assign({},t,{alerts:a})):e.push(Object.assign({},t,{alerts:a}))),e}),[])),[e,s,r])})(x);return(0,a.useEffect)((()=>{function e(){t&&s((0,I.mS)(t))}e();const a=setInterval(e,T.iF);return()=>{clearInterval(a)}}),[s,t]),(0,f.jsxs)(l.J,{pageId:"groups",children:[(0,f.jsx)(L,{groups:b}),d&&(q||(q=(0,f.jsx)(n.LoadingPlaceholder,{text:"Loading notifications"}))),g&&!d&&(0,f.jsx)(n.Alert,{title:"Error loading notifications",severity:"error",children:g.message||"Unknown error"}),b&&h.map(((e,s)=>(0,f.jsxs)(a.Fragment,{children:[(1===s&&0===Object.keys(h[0].labels).length||0===s&&Object.keys(e.labels).length>0)&&(0,f.jsxs)("p",{className:u.groupingBanner,children:["Grouped by: ",Object.keys(e.labels).join(", ")]}),(0,f.jsx)(_,{alertManagerSourceName:t||"",group:e})]},`${JSON.stringify(e.labels)}-group-${s}`))),b&&!h.length&&(D||(D=(0,f.jsx)("p",{children:"No results."})))]})}},"./public/app/features/alerting/unified/components/AlertingPageWrapper.tsx":(e,t,s)=>{s.d(t,{J:()=>l});s("../../opt/drone/yarncache/react-npm-17.0.2-99ba37d931-b254cc17ce.zip/node_modules/react/index.js");var a=s("./public/app/core/components/Page/Page.tsx"),r=s("./public/app/core/selectors/navModel.ts"),n=s("./.yarn/__virtual__/react-redux-virtual-7ad20a440e/3/opt/drone/yarncache/react-redux-npm-7.2.6-134f5ed64d-0bf142ce0d.zip/node_modules/react-redux/es/index.js"),i=s("../../opt/drone/yarncache/react-npm-17.0.2-99ba37d931-b254cc17ce.zip/node_modules/react/jsx-runtime.js");const l=e=>{let{children:t,pageId:s,isLoading:l}=e;const c=(0,r.h)((0,n.useSelector)((e=>e.navIndex)),s);return(0,i.jsx)(a.Z,{navModel:c,children:(0,i.jsx)(a.Z.Contents,{isLoading:l,children:t})})}},"./public/app/features/alerting/unified/components/DynamicTableWithGuidelines.tsx":(e,t,s)=>{s.d(t,{F:()=>c});var a=s("./.yarn/__virtual__/@emotion-css-virtual-72c314ddb1/3/opt/drone/yarncache/@emotion-css-npm-11.7.1-25ff8755a7-ac1f56656f.zip/node_modules/@emotion/css/dist/emotion-css.esm.js"),r=s("./packages/grafana-ui/src/index.ts"),n=(s("../../opt/drone/yarncache/react-npm-17.0.2-99ba37d931-b254cc17ce.zip/node_modules/react/index.js"),s("./public/app/features/alerting/unified/components/DynamicTable.tsx")),i=s("../../opt/drone/yarncache/react-npm-17.0.2-99ba37d931-b254cc17ce.zip/node_modules/react/jsx-runtime.js");const l=["renderExpandedContent"];const c=e=>{let{renderExpandedContent:t}=e,s=function(e,t){if(null==e)return{};var s,a,r={},n=Object.keys(e);for(a=0;a<n.length;a++)s=n[a],t.indexOf(s)>=0||(r[s]=e[s]);return r}(e,l);const c=(0,r.useStyles2)(o);return(0,i.jsx)(n.t,Object.assign({renderExpandedContent:t?(e,s,r)=>(0,i.jsxs)(i.Fragment,{children:[!(s===r.length-1)&&(0,i.jsx)("div",{className:(0,a.cx)(c.contentGuideline,c.guideline)}),t(e,s,r)]}):void 0,renderPrefixHeader:()=>(0,i.jsx)("div",{className:c.relative,children:(0,i.jsx)("div",{className:(0,a.cx)(c.headerGuideline,c.guideline)})}),renderPrefixCell:(e,t,s)=>(0,i.jsxs)("div",{className:c.relative,children:[(0,i.jsx)("div",{className:(0,a.cx)(c.topGuideline,c.guideline)}),!(t===s.length-1)&&(0,i.jsx)("div",{className:(0,a.cx)(c.bottomGuideline,c.guideline)})]})},s))},o=e=>({relative:a.css`
    position: relative;
    height: 100%;
  `,guideline:a.css`
    left: -19px;
    border-left: 1px solid ${e.colors.border.medium};
    position: absolute;

    ${e.breakpoints.down("md")} {
      display: none;
    }
  `,topGuideline:a.css`
    width: 18px;
    border-bottom: 1px solid ${e.colors.border.medium};
    top: 0;
    bottom: 50%;
  `,bottomGuideline:a.css`
    top: 50%;
    bottom: 0;
  `,contentGuideline:a.css`
    top: 0;
    bottom: 0;
    left: -49px !important;
  `,headerGuideline:a.css`
    top: -25px;
    bottom: 0;
  `})},"./public/app/features/alerting/unified/components/alert-groups/MatcherFilter.tsx":(e,t,s)=>{s.d(t,{F:()=>c});s("../../opt/drone/yarncache/react-npm-17.0.2-99ba37d931-b254cc17ce.zip/node_modules/react/index.js");var a,r,n=s("./packages/grafana-ui/src/index.ts"),i=s("./.yarn/__virtual__/@emotion-css-virtual-72c314ddb1/3/opt/drone/yarncache/@emotion-css-npm-11.7.1-25ff8755a7-ac1f56656f.zip/node_modules/@emotion/css/dist/emotion-css.esm.js"),l=s("../../opt/drone/yarncache/react-npm-17.0.2-99ba37d931-b254cc17ce.zip/node_modules/react/jsx-runtime.js");const c=e=>{let{className:t,onFilterChange:s,defaultQueryString:i,queryString:c}=e;const u=(0,n.useStyles2)(o),p=a||(a=(0,l.jsx)(n.Icon,{name:"search"}));return(0,l.jsxs)("div",{className:t,children:[(0,l.jsxs)(n.Label,{children:[(0,l.jsx)(n.Tooltip,{content:r||(r=(0,l.jsxs)("div",{children:["Filter alerts using label querying, ex:",(0,l.jsx)("pre",{children:'{severity="critical", instance=~"cluster-us-.+"}'})]})),children:(0,l.jsx)(n.Icon,{className:u.icon,name:"info-circle",size:"xs"})}),"Search by label"]}),(0,l.jsx)(n.Input,{placeholder:"Search",defaultValue:i,value:c,onChange:e=>{const t=e.target;s(t.value)},"data-testid":"search-query-input",prefix:p,className:u.inputWidth})]})},o=e=>({icon:i.css`
    margin-right: ${e.spacing(.5)};
  `,inputWidth:i.css`
    width: 340px;
    flex-grow: 0;
  `})},"./public/app/features/alerting/unified/components/silences/AmAlertStateTag.tsx":(e,t,s)=>{s.d(t,{G:()=>l});var a=s("./public/app/plugins/datasource/alertmanager/types.ts"),r=(s("../../opt/drone/yarncache/react-npm-17.0.2-99ba37d931-b254cc17ce.zip/node_modules/react/index.js"),s("./public/app/features/alerting/unified/components/StateTag.tsx")),n=s("../../opt/drone/yarncache/react-npm-17.0.2-99ba37d931-b254cc17ce.zip/node_modules/react/jsx-runtime.js");const i={[a.Z9.Active]:"bad",[a.Z9.Unprocessed]:"neutral",[a.Z9.Suppressed]:"info"},l=e=>{let{state:t}=e;return(0,n.jsx)(r.i,{state:i[t],children:t})}},"./public/app/features/alerting/unified/hooks/useAlertManagerSourceName.ts":(e,t,s)=>{s.d(t,{k:()=>o});var a=s("./public/app/core/hooks/useQueryParams.ts"),r=s("./public/app/core/store.ts"),n=s("../../opt/drone/yarncache/react-npm-17.0.2-99ba37d931-b254cc17ce.zip/node_modules/react/index.js"),i=s("./public/app/features/alerting/unified/utils/constants.ts"),l=s("./public/app/features/alerting/unified/utils/datasource.ts");function c(e){return e===l.GC||!!(0,l.aM)().find((t=>t.name===e))}function o(){const[e,t]=(0,a.K)(),s=(0,n.useCallback)((e=>{c(e)&&(e===l.GC?(r.Z.delete(i.de),t({[i.c4]:null})):(r.Z.set(i.de,e),t({[i.c4]:e})))}),[t]),o=e[i.c4];if(o&&"string"==typeof o)return c(o)?[o,s]:[void 0,s];const u=r.Z.get(i.de);return u&&"string"==typeof u&&c(u)?(s(u),[u,s]):[l.GC,s]}}}]);
//# sourceMappingURL=AlertGroups.b86cc30c452b708f8c31.js.map