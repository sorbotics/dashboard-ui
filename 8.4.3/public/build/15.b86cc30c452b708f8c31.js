"use strict";(self.webpackChunkgrafana=self.webpackChunkgrafana||[]).push([[15,7641],{"./public/app/features/admin/ServerStats.tsx":(e,s,t)=>{t.r(s),t.d(s,{ServerStats:()=>N});var a=t("../../opt/drone/yarncache/react-npm-17.0.2-99ba37d931-b254cc17ce.zip/node_modules/react/index.js"),n=t("./.yarn/__virtual__/@emotion-css-virtual-72c314ddb1/3/opt/drone/yarncache/@emotion-css-npm-11.7.1-25ff8755a7-ac1f56656f.zip/node_modules/@emotion/css/dist/emotion-css.esm.js"),i=t("./packages/grafana-ui/src/index.ts"),r=t("./public/app/types/index.ts"),c=t("./packages/grafana-runtime/src/index.ts");var o=t("./public/app/core/services/context_srv.ts"),l=t("./public/app/features/plugins/admin/components/Loader.tsx"),d=t("./packages/grafana-data/src/index.ts"),p=t("../../opt/drone/yarncache/react-npm-17.0.2-99ba37d931-b254cc17ce.zip/node_modules/react/jsx-runtime.js");const u=()=>{var e;const s=x((0,i.useTheme2)()),[t,n]=(0,a.useState)(!1),[r,o]=(0,a.useState)({mode:"thumbs",theme:c.config.theme2.isLight?"light":"dark"}),l=()=>n(!1);return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsxs)(i.Modal,{title:"Start crawler",isOpen:t,onDismiss:l,children:[(0,p.jsx)("div",{className:s.wrap,children:(0,p.jsx)(i.CodeEditor,{height:200,value:null!==(e=JSON.stringify(r,null,2))&&void 0!==e?e:"",showLineNumbers:!1,readOnly:!1,language:"json",showMiniMap:!1,onBlur:e=>{o(JSON.parse(e))}})}),(0,p.jsxs)(i.Modal.ButtonRow,{children:[(0,p.jsx)(i.Button,{onClick:()=>{(0,c.getBackendSrv)().post("/api/admin/crawler/start",r).then((e=>{console.log("GOT",e),l()}))},children:"Start"}),(0,p.jsx)(i.Button,{variant:"secondary",onClick:l,children:"Cancel"})]})]}),(0,p.jsx)(i.Button,{onClick:()=>n(!0),variant:"primary",children:"Start"})]})},x=e=>({wrap:n.css`
      border: 2px solid #111;
    `});var h,g,m;const j=()=>{const e=v((0,i.useTheme2)()),[s,t]=(0,a.useState)();return(0,a.useEffect)((()=>{const e=(0,c.getGrafanaLiveSrv)().getStream({scope:d.LiveChannelScope.Grafana,namespace:"broadcast",path:"crawler"}).subscribe({next:e=>{((0,d.isLiveChannelMessageEvent)(e)||(0,d.isLiveChannelStatusEvent)(e))&&t(e.message)}});return()=>{e.unsubscribe()}}),[]),s?(0,p.jsxs)("div",{className:e.wrap,children:[(0,p.jsx)("pre",{children:JSON.stringify(s,null,2)}),"running"!==s.state&&(m||(m=(0,p.jsx)(u,{}))),"stopped"!==s.state&&(0,p.jsx)(i.Button,{variant:"secondary",onClick:()=>{(0,c.getBackendSrv)().post("/api/admin/crawler/stop")},children:"Stop"})]}):(0,p.jsxs)("div",{className:e.wrap,children:["No status (never run)",h||(h=(0,p.jsx)("br",{})),g||(g=(0,p.jsx)(u,{}))]})},v=e=>({wrap:n.css`
      border: 4px solid red;
    `,running:n.css`
      border: 4px solid green;
    `});var f,b,y,S,w,k;const N=()=>{const[e,s]=(0,a.useState)(null),[t,n]=(0,a.useState)(!1),d=(0,i.useStyles2)(_),u=o.Vt.hasAccess(r.bW.DataSourcesRead,o.Vt.isGrafanaAdmin),x=o.Vt.hasAccess(r.bW.UsersRead,o.Vt.isGrafanaAdmin);return(0,a.useEffect)((()=>{o.Vt.hasAccess(r.bW.ActionServerStatsRead,o.Vt.isGrafanaAdmin)&&(n(!0),(async()=>(0,c.getBackendSrv)().get("api/admin/stats").catch((e=>(console.error(e),null))))().then((e=>{s(e),n(!1)})))}),[]),o.Vt.hasAccess(r.bW.ActionServerStatsRead,o.Vt.isGrafanaAdmin)?(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)("h2",{className:d.title,children:"Instance statistics"}),t?(0,p.jsx)("div",{className:d.loader,children:f||(f=(0,p.jsx)(l.a,{text:"Loading instance stats..."}))}):e?(0,p.jsxs)("div",{className:d.row,children:[(0,p.jsx)(A,{content:[{name:"Dashboards (starred)",value:`${e.dashboards} (${e.stars})`},{name:"Tags",value:e.tags},{name:"Playlists",value:e.playlists},{name:"Snapshots",value:e.snapshots}],footer:b||(b=(0,p.jsx)(i.LinkButton,{href:"/dashboards",variant:"secondary",children:"Manage dashboards"}))}),(0,p.jsxs)("div",{className:d.doubleRow,children:[(0,p.jsx)(A,{content:[{name:"Data sources",value:e.datasources}],footer:u&&(y||(y=(0,p.jsx)(i.LinkButton,{href:"/datasources",variant:"secondary",children:"Manage data sources"})))}),(0,p.jsx)(A,{content:[{name:"Alerts",value:e.alerts}],footer:S||(S=(0,p.jsx)(i.LinkButton,{href:"/alerting/list",variant:"secondary",children:"Alerts"}))})]}),(0,p.jsx)(A,{content:[{name:"Organisations",value:e.orgs},{name:"Users total",value:e.users},{name:"Active users in last 30 days",value:e.activeUsers},{name:"Active sessions",value:e.activeSessions}],footer:x&&(w||(w=(0,p.jsx)(i.LinkButton,{href:"/admin/users",variant:"secondary",children:"Manage users"})))})]}):(0,p.jsx)("p",{className:d.notFound,children:"No stats found."}),c.config.featureToggles.dashboardPreviews&&(k||(k=(0,p.jsx)(j,{})))]}):null},_=e=>({title:n.css`
      margin-bottom: ${e.spacing(4)};
    `,row:n.css`
      display: flex;
      justify-content: space-between;
      width: 100%;

      & > div:not(:last-of-type) {
        margin-right: ${e.spacing(2)};
      }

      & > div {
        width: 33.3%;
      }
    `,doubleRow:n.css`
      display: flex;
      flex-direction: column;

      & > div:first-of-type {
        margin-bottom: ${e.spacing(2)};
      }
    `,loader:n.css`
      height: 290px;
    `,notFound:n.css`
      font-size: ${e.typography.h6.fontSize};
      text-align: center;
      height: 290px;
    `}),A=e=>{let{content:s,footer:t}=e;const a=(0,i.useStyles2)(L);return(0,p.jsx)(i.CardContainer,{className:a.container,disableHover:!0,children:(0,p.jsxs)("div",{className:a.inner,children:[(0,p.jsx)("div",{className:a.content,children:s.map((e=>(0,p.jsxs)("div",{className:a.row,children:[(0,p.jsx)("span",{children:e.name}),(0,p.jsx)("span",{children:e.value})]},e.name)))}),t&&(0,p.jsx)("div",{children:t})]})})},L=e=>({container:n.css`
      padding: ${e.spacing(2)};
    `,inner:n.css`
      display: flex;
      flex-direction: column;
      width: 100%;
    `,content:n.css`
      flex: 1 0 auto;
    `,row:n.css`
      display: flex;
      justify-content: space-between;
      width: 100%;
      margin-bottom: ${e.spacing(2)};
      align-items: center;
    `})},"./public/app/features/admin/UpgradePage.tsx":(e,s,t)=>{t.r(s),t.d(s,{UpgradeInfo:()=>G,UpgradePage:()=>L,default:()=>O});t("../../opt/drone/yarncache/react-npm-17.0.2-99ba37d931-b254cc17ce.zip/node_modules/react/index.js");var a=t("./.yarn/__virtual__/react-redux-virtual-7ad20a440e/3/opt/drone/yarncache/react-redux-npm-7.2.6-134f5ed64d-0bf142ce0d.zip/node_modules/react-redux/es/index.js"),n=t("./.yarn/__virtual__/@emotion-css-virtual-72c314ddb1/3/opt/drone/yarncache/@emotion-css-npm-11.7.1-25ff8755a7-ac1f56656f.zip/node_modules/@emotion/css/dist/emotion-css.esm.js"),i=t("./packages/grafana-ui/src/index.ts"),r=t("./public/app/core/components/Page/Page.tsx"),c=t("./public/app/core/selectors/navModel.ts"),o=t("../../opt/drone/yarncache/react-npm-17.0.2-99ba37d931-b254cc17ce.zip/node_modules/react/jsx-runtime.js");const l={fontWeight:500,fontSize:"26px",lineHeight:"123%"},d=(0,i.stylesFactory)((e=>{const s=e.isDark?"public/img/licensing/header_dark.svg":"public/img/licensing/header_light.svg",t=e.isDark?e.palette.dark9:e.palette.gray6;return{container:n.css`
      padding: 36px 79px;
      background: ${e.colors.panelBg};
    `,footer:n.css`
      text-align: center;
      padding: 16px;
      background: ${t};
    `,header:n.css`
      height: 137px;
      padding: 40px 0 0 79px;
      position: relative;
      display: none;
      background: url('${s}') right;
    `}}));function p(e){let{header:s,editionNotice:t,subheader:a,children:n}=e;const r=(0,i.useTheme)(),c=d(r);return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)("div",{className:c.header,children:[(0,o.jsx)("h2",{style:l,children:s}),a&&(0,o.jsx)("h3",{children:a}),(0,o.jsx)(u,{size:"128px",style:{boxShadow:"0px 0px 24px rgba(24, 58, 110, 0.45)",background:"#0A1C36",position:"absolute",top:"19px",left:"71%"},children:(0,o.jsx)("img",{src:"public/img/grafana_icon.svg",alt:"Dashboard",width:"80px",style:{position:"absolute",left:"23px",top:"20px"}})})]}),(0,o.jsx)("div",{className:c.container,children:n}),t&&(0,o.jsx)("div",{className:c.footer,children:t})]})}const u=e=>{let{size:s,style:t,children:a}=e;return(0,o.jsx)("div",{style:Object.assign({width:s,height:s,position:"absolute",bottom:0,right:0,borderRadius:"50%"},t),children:a})};var x,h,g,m,j,v,f,b,y,S,w,k,N,_,A=t("./public/app/features/admin/ServerStats.tsx");function L(e){let{navModel:s}=e;return(0,o.jsx)(r.Z,{navModel:s,children:x||(x=(0,o.jsxs)(r.Z.Contents,{children:[(0,o.jsx)(A.ServerStats,{}),(0,o.jsx)(G,{editionNotice:"You are running the open-source version."})]}))})}const z={fontWeight:500,fontSize:"26px",lineHeight:"123%"},G=e=>{let{editionNotice:s}=e;const t=(0,i.useStyles2)(B);return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)("h2",{className:t.title,children:"license"}),(0,o.jsx)(p,{header:"Dashboard Enterprise",subheader:"Get your free trial",editionNotice:s,children:(0,o.jsxs)("div",{className:t.column,children:[h||(h=(0,o.jsx)(P,{})),g||(g=(0,o.jsx)(E,{}))]})})]})},B=e=>({column:n.css`
      display: none;
      grid-template-columns: 100%;
      column-gap: 20px;
      row-gap: 40px;

      @media (min-width: 1050px) {
        grid-template-columns: 50% 50%;
      }
    `,title:n.css`
      margin: ${e.spacing(4)} 0;
    `}),C=()=>(0,o.jsxs)("div",{style:{marginTop:"40px",marginBottom:"30px"},children:[m||(m=(0,o.jsx)("h2",{style:z,children:"Get Dashboard Enterprise"})),j||(j=(0,o.jsx)(D,{})),(0,o.jsx)("p",{style:{paddingTop:"12px"},children:"You can use the trial version for free for 30 days. We will remind you about it five days before the trial period ends."})]}),D=()=>v||(v=(0,o.jsx)(i.LinkButton,{variant:"primary",size:"lg",href:"https://grafana.com/contact?about=grafana-enterprise&utm_source=grafana-upgrade-page",children:"Contact us and get a free trial"})),E=()=>(0,o.jsxs)("div",{children:[f||(f=(0,o.jsx)("h4",{children:"At your service"})),b||(b=(0,o.jsxs)($,{children:[(0,o.jsx)(T,{title:"Enterprise Plugins",image:"public/img/licensing/plugin_enterprise.svg"}),(0,o.jsx)(T,{title:"Critical SLA: 2 hours",image:"public/img/licensing/sla.svg"}),(0,o.jsxs)(T,{title:"Unlimited Expert Support",image:"public/img/licensing/customer_support.svg",children:["24 x 7 x 365 support via",(0,o.jsxs)($,{nested:!0,children:[(0,o.jsx)(T,{title:"Email"}),(0,o.jsx)(T,{title:"Private Slack channel"}),(0,o.jsx)(T,{title:"Phone"})]})]}),(0,o.jsx)(T,{title:"Hand-in-hand support",image:"public/img/licensing/handinhand_support.svg",children:"in the upgrade process"})]})),(0,o.jsxs)("div",{style:{marginTop:"20px"},children:[y||(y=(0,o.jsx)("strong",{children:"Also included:"})),S||(S=(0,o.jsx)("br",{})),"Indemnification, working with Dashboard Labs on future prioritization, and training from the core Dashboard team."]}),w||(w=(0,o.jsx)(C,{}))]}),P=()=>(0,o.jsxs)("div",{style:{paddingRight:"11px"},children:[k||(k=(0,o.jsx)("h4",{children:"Enhanced functionality"})),N||(N=(0,o.jsx)(M,{}))]}),M=()=>_||(_=(0,o.jsxs)($,{children:[(0,o.jsx)(T,{title:"Data source permissions"}),(0,o.jsx)(T,{title:"Reporting"}),(0,o.jsx)(T,{title:"SAML authentication"}),(0,o.jsx)(T,{title:"Enhanced LDAP integration"}),(0,o.jsx)(T,{title:"Team Sync",children:"LDAP, GitHub OAuth, Auth Proxy, Okta"}),(0,o.jsx)(T,{title:"White labeling"}),(0,o.jsx)(T,{title:"Auditing"}),(0,o.jsx)(T,{title:"Settings updates at runtime"}),(0,o.jsx)(T,{title:"Grafana usage insights",children:(0,o.jsxs)($,{nested:!0,children:[(0,o.jsx)(T,{title:"Sort dashboards by popularity in search"}),(0,o.jsx)(T,{title:"Find unused dashboards"}),(0,o.jsx)(T,{title:"Dashboard usage stats drawer"}),(0,o.jsx)(T,{title:"Dashboard presence indicators"})]})}),(0,o.jsx)(T,{title:"Enterprise plugins",children:(0,o.jsxs)($,{nested:!0,children:[(0,o.jsx)(T,{title:"Oracle"}),(0,o.jsx)(T,{title:"Splunk"}),(0,o.jsx)(T,{title:"Service Now"}),(0,o.jsx)(T,{title:"Dynatrace"}),(0,o.jsx)(T,{title:"New Relic"}),(0,o.jsx)(T,{title:"DataDog"}),(0,o.jsx)(T,{title:"AppDynamics"}),(0,o.jsx)(T,{title:"SAP HANA®"}),(0,o.jsx)(T,{title:"Gitlab"}),(0,o.jsx)(T,{title:"Honeycomb"}),(0,o.jsx)(T,{title:"Jira"}),(0,o.jsx)(T,{title:"MongoDB"}),(0,o.jsx)(T,{title:"Salesforce"}),(0,o.jsx)(T,{title:"Snowflake"}),(0,o.jsx)(T,{title:"Wavefront"})]})})]})),$=e=>{let{children:s,nested:t}=e;const a=n.css`
    display: none;
    flex-direction: column;
    padding-top: 8px;

    > div {
      margin-bottom: ${t?0:8}px;
    }
  `;return(0,o.jsx)("div",{className:a,children:s})},T=e=>{let{children:s,title:t,image:a}=e;const i=a||"public/img/licensing/checkmark.svg",r=n.css`
    display: none;

    > img {
      display: block;
      height: 22px;
      flex-grow: 0;
      padding-right: 12px;
    }
  `,c=n.css`
    font-weight: 500;
    line-height: 1.7;
  `;return(0,o.jsxs)("div",{className:r,children:[(0,o.jsx)("img",{src:i,alt:""}),(0,o.jsxs)("div",{children:[(0,o.jsx)("div",{className:c,children:t}),s]})]})},O=(0,a.connect)((e=>({navModel:(0,c.h)(e.navIndex,"upgrading")})))(L)},"./public/app/features/plugins/admin/components/Loader.tsx":(e,s,t)=>{t.d(s,{a:()=>r});t("../../opt/drone/yarncache/react-npm-17.0.2-99ba37d931-b254cc17ce.zip/node_modules/react/index.js");var a=t("./packages/grafana-ui/src/index.ts"),n=t("./public/app/features/plugins/admin/components/Page.tsx"),i=t("../../opt/drone/yarncache/react-npm-17.0.2-99ba37d931-b254cc17ce.zip/node_modules/react/jsx-runtime.js");const r=e=>{let{text:s="Loading..."}=e;return(0,i.jsx)(n.T,{children:(0,i.jsx)("div",{className:"page-loader-wrapper",children:(0,i.jsx)(a.LoadingPlaceholder,{text:s})})})}},"./public/app/features/plugins/admin/components/Page.tsx":(e,s,t)=>{t.d(s,{T:()=>r});t("../../opt/drone/yarncache/react-npm-17.0.2-99ba37d931-b254cc17ce.zip/node_modules/react/index.js");var a=t("./.yarn/__virtual__/@emotion-css-virtual-72c314ddb1/3/opt/drone/yarncache/@emotion-css-npm-11.7.1-25ff8755a7-ac1f56656f.zip/node_modules/@emotion/css/dist/emotion-css.esm.js"),n=t("./packages/grafana-ui/src/index.ts"),i=t("../../opt/drone/yarncache/react-npm-17.0.2-99ba37d931-b254cc17ce.zip/node_modules/react/jsx-runtime.js");const r=e=>{let{children:s}=e;const t=(0,n.useStyles2)(c);return(0,i.jsx)("div",{className:"page-container",children:(0,i.jsx)("div",{className:t,children:s})})},c=e=>a.css`
    margin-bottom: ${e.spacing(3)};
  `}}]);
//# sourceMappingURL=15.b86cc30c452b708f8c31.js.map