export function __vite_legacy_guard(){import("data:text/javascript,")}import{r as o,o as e,c as t,a as s,b as r,w as n,d as a,p as i,e as l,f as c,F as d,g as u,t as m,h as v,i as p,S as f,j as h,u as g,k as w,l as b,m as k,P as A,M as y,K as C,C as O,n as x,q as R,s as I,v as S,x as N,y as V,z as E,A as _,B as T,D as L,E as D,V as U,G as q,H as j,I as J,J as Q,L as B,N as G,O as F,Q as $,R as M,T as P,U as z,W as H,X as Y,Y as K}from"./vendor.127fb34c.js";!function(){const o=document.createElement("link").relList;if(!(o&&o.supports&&o.supports("modulepreload"))){for(const o of document.querySelectorAll('link[rel="modulepreload"]'))e(o);new MutationObserver((o=>{for(const t of o)if("childList"===t.type)for(const o of t.addedNodes)"LINK"===o.tagName&&"modulepreload"===o.rel&&e(o)})).observe(document,{childList:!0,subtree:!0})}function e(o){if(o.ep)return;o.ep=!0;const e=function(o){const e={};return o.integrity&&(e.integrity=o.integrity),o.referrerpolicy&&(e.referrerPolicy=o.referrerpolicy),"use-credentials"===o.crossorigin?e.credentials="include":"anonymous"===o.crossorigin?e.credentials="omit":e.credentials="same-origin",e}(o);fetch(o.href,e)}}();var X=(o,e)=>{for(const[t,s]of e)o[t]=s;return o};const W={setup(){}},Z=o=>(i("data-v-63f6f862"),o=o(),l(),o),oo={class:"logo"},eo=a("ColorVote"),to=Z((()=>s("div",{id:"logo"},[s("div"),s("div"),s("div"),s("div"),s("div"),s("div"),s("div"),s("div")],-1)));var so=X(W,[["render",function(a,i,l,c,d,u){const m=o("router-link");return e(),t("div",null,[s("h1",oo,[r(m,{to:"/"},{default:n((()=>[eo])),_:1})]),to])}],["__scopeId","data-v-63f6f862"]]);const ro={name:"Home",components:{Logo:so},setup:()=>({rooms:c((()=>{const o=Mo.rooms.map((o=>({name:o,admin:zo(o)})));return o.sort(((o,e)=>o.name.localeCompare(e.name))),o})),createRoom:Xo,joinRoom:Yo})},no=a("about"),ao={class:"rooms"},io=["onClick"],lo=["onClick"];var co=X(ro,[["render",function(i,l,c,f,h,g){const w=o("logo"),b=o("router-link");return e(),t("div",null,[r(w),r(b,{class:"about",to:"/about",title:"about"},{default:n((()=>[no])),_:1}),s("div",ao,[s("div",{class:"room add-room",onClick:l[0]||(l[0]=o=>f.createRoom())},"+ Créer un Vote"),(e(!0),t(d,null,u(f.rooms,(o=>(e(),t("div",{key:o.name,class:"room",onClick:e=>f.joinRoom(o.name)},[a(m(o.name)+" ",1),o.admin?(e(),t("span",{key:0,class:"rename-room",onClick:v((e=>f.joinRoom(o.name,o.admin)),["stop"])},"admin",8,lo)):p("",!0)],8,io)))),128))])])}]]);const uo={name:"About",components:{Logo:so}},mo=(o=>(i("data-v-183e9de0"),o=o(),l(),o))((()=>s("div",{id:"container"},[s("div",{class:"inner"},[s("section",{id:"main_content"},[s("h2",null,"Votation anonyme, rapide et multiplatforme"),s("p",null," "),s("h3",null,"Présentation"),s("p",{class:"center"},[s("iframe",{src:"http://www.slideshare.net/slideshow/embed_code/28555735",width:"595",height:"485",frameborder:"0",marginwidth:"0",marginheight:"0",scrolling:"no",style:{border:"1px solid #ccc","border-width":"1px 1px 0","margin-bottom":"5px"},allowfullscreen:""},"\n            ")]),s("p",null,[a(" Téléchargez le guide: "),s("a",{href:"/downloads/ColorvoteGuide.pdf"},"ColorvoteGuide.pdf")]),s("p",{class:"center"},[s("iframe",{width:"620",height:"349",src:"//www.youtube.com/embed/3us5FfN0BiE?rel=0",frameborder:"0",allowfullscreen:""})]),s("h3",null,"Poster"),s("p",{class:"center"},[s("a",{href:"/images/colorvote_poster.png"},[s("img",{src:"/images/colorvote_poster_thumb.png",alt:"poster"})])]),s("h3",null,"Contact"),s("p",null,[a(" contact "),s("a",{href:"mailto:boris@colorvote.ch"},"boris@colorvote.ch")]),s("h3",null,"Technique"),s("p",null,"ColorVote utilise: Vue.js, node, socket.io"),s("p",null,[s("a",{href:"https://github.com/bfritscher/colorvote",id:"view-on-github",class:"button"},[s("span",null,"View on GitHub")])])]),s("footer",null,[a(" Colorvote is maintained by "),s("a",{href:"https://github.com/bfritscher"},"Boris Fritscher"),s("br")])])],-1)));var vo=X(uo,[["render",function(s,n,a,i,l,c){const d=o("logo");return e(),t("div",null,[r(d),mo])}],["__scopeId","data-v-183e9de0"]]);const po={name:"Voter",components:{Swiper:f,SwiperSlide:h},setup(){const o=g();w((()=>{var e;o.params.roomName!==(null==(e=Mo.room)?void 0:e.name)&&(Mo.room&&Ko(Mo.room.name),o.params.roomName&&Yo(o.params.roomName))}));const e=b(null),t=k({sessionId:void 0,choice:void 0}),s=b(!1),r=c((()=>{var o;const e=[];for(let t=0;t<(null==(o=Mo.room)?void 0:o.nbOptions);t++)e.push(t);return e})),n=c((()=>{var o;return new Array(null==(o=Mo.room)?void 0:o.nbOptions).fill(0).map(((o,e)=>({id:e,title:e})))})),a=o=>{t.choice=o,e.value&&e.value.realIndex!==o&&e.value.slideToLoop(o),function(o){var e;Ho.emit("vote",null==(e=Mo.room)?void 0:e.name,Mo.userId,o)}(o),localStorage.setItem(`COLORVOTE_VOTE__${Mo.room.name}`,JSON.stringify(t))};w((()=>{var o;Mo.room&&Mo.room.sessionId!==t.sessionId&&(t.sessionId=Mo.room.sessionId,t.choice=void 0);const e=JSON.parse(localStorage.getItem(`COLORVOTE_VOTE__${null==(o=Mo.room)?void 0:o.name}`)||"{}");e&&Mo.room&&Mo.room.sessionId===e.sessionId&&a(e.choice)}));return{modules:[A,y,C,O],slides:n,onSlideChange:()=>{e.value&&a(e.value.realIndex)},state:Mo,showCardVote:s,vote:t,choices:r,setVote:a,setControlledSwiper(o){e.value=o,t.choice&&e.value.slideToLoop(t.choice)}}}},fo={class:"title"},ho=a(" ... "),go={class:"room-title"},wo=["onClick"],bo={class:"title"},ko={key:1,class:"votenow"},Ao={key:2,class:"voting-stopped"},yo=[s("h1",null,"Votation terminée",-1)],Co=a("<");var Oo=X(po,[["render",function(a,i,l,c,f,h){var g;const w=o("swiper-slide"),b=o("swiper"),k=o("router-link");return c.state.room?(e(),t(d,{key:0},[r(b,{modules:c.modules,"slides-per-view":1,"space-between":50,loop:!0,pagination:{clickable:!0},onSlideChange:c.onSlideChange,onSwiper:c.setControlledSwiper},{default:n((()=>[(e(!0),t(d,null,u(c.slides,(o=>(e(),x(w,{key:o.id,class:R(`color-${o.id}`)},{default:n((()=>[s("div",fo,m(o.title),1)])),_:2},1032,["class"])))),128)),ho])),_:1},8,["modules","onSlideChange","onSwiper"]),s("div",go,m(null==(g=c.state.room)?void 0:g.name),1),s("div",{class:"show-card-vote",onClick:i[0]||(i[0]=o=>c.showCardVote=!c.showCardVote)}),c.showCardVote?(e(),t("div",{key:0,class:"card-vote",onClick:i[1]||(i[1]=o=>c.showCardVote=!c.showCardVote)},[(e(!0),t(d,null,u(c.choices,(o=>(e(),t("div",{class:"card-wrapper",key:o},[s("div",{class:R(["card",`color-${o} ${c.vote.choice===o?"active":""}`]),onClick:v((e=>c.setVote(o)),["stop"])},[s("div",bo,m(o),1)],10,wo)])))),128))])):p("",!0),void 0===c.vote.choice?(e(),t("div",ko,"Votez maintenant")):p("",!0),c.state.room&&"closed"!==c.state.room.status?p("",!0):(e(),t("div",Ao,yo)),r(k,{class:"backLink",to:"/"},{default:n((()=>[Co])),_:1})],64)):p("",!0)}]]);const xo={name:"Chart",props:["data"],setup(o){const e=b(null);return I((()=>{w((()=>{!function(o,e){const t=30,s=20,r=30,n=40,a=500-n-s,i=500-t-r,l=S(".0%"),c=N().range([0,a]).round(.1),d=V().range([i,0]),u=Object.keys(e).map((o=>parseInt(o))),m=D(c),v=E(e),p=_(d).tickFormat(S("d")),f=T(o).attr("width",a+n+s).attr("height",i+t+r).select("g.transform").attr("transform","translate("+n+","+t+")");c.domain(u),d.domain([0,L(e)]),f.select("g.x.axis").attr("transform","translate(0,"+i+")").call(m),f.select("g.y.axis").transition().duration(1e3).call(p);const h=f.selectAll(".bar").data(e.map(((o,e)=>({key:e,value:o})))),g=h.enter().append("g").attr("class","bar").attr("transform",(o=>"translate("+c(o.key)+",0)"));g.append("rect").attr("class",(o=>"color-"+o.key)).attr("width",c.bandwidth()).attr("y",(o=>d(o.value))).attr("height",(o=>i-d(o.value))),g.append("text").attr("x",c.bandwidth()/2-12).attr("y",(o=>d(o.value)-8)),h.attr("transform",(o=>"translate("+c(o.key)+",0)")),h.select("rect").transition().duration(1e3).attr("y",(o=>d(o.value))).attr("height",(o=>i-d(o.value))),h.select("rect").attr("width",c.bandwidth()),h.select("text").transition().duration(1e3).text((o=>l(o.value/v||0))).attr("y",(o=>d(o.value)-8)),h.select("text").attr("x",c.bandwidth()/2-12),h.exit().remove()}(e.value,o.data)}))})),{svgRef:e}}},Ro={ref:"svgRef",width:"500",height:"500",class:"chart"},Io=[s("g",{class:"transform"},[s("g",{class:"x axis"}),s("g",{class:"y axis"})],-1)];const So={name:"Asker",components:{VueQrcode:U,Chart:X(xo,[["render",function(o,s,r,n,a,i){return e(),t("svg",Ro,Io,512)}]]),Logo:so},setup(){const o=g(),e=q();w((()=>{var e;o.params.roomName!==(null==(e=Mo.room)?void 0:e.name)&&(Mo.room&&Ko(Mo.room.name),o.params.roomName&&Yo(o.params.roomName,zo(o.params.roomName)))}));const t=k({showqrcode:!1,showresults:!1}),s=c((()=>`${window.location.origin}/${e.resolve({name:"voter",params:{rootName:Mo.room.name}}).href}`)),r=c((()=>{var o;return Object.values((null==(o=Mo.room)?void 0:o.results)||{}).reduce(((o,e)=>o+e),0)})),n=c((()=>{var o;try{const e=G(Mo.tokens[null==(o=Mo.room)?void 0:o.name]);return new Date(1e3*e.exp)}catch(e){return new Date}}));function a(o,e){for(o=o.toString();o.length<e;)o="0"+o;return o}let i;const l=b(""),d=b("");return I((()=>{i=setInterval((()=>{Mo.room&&"open"===Mo.room.status?l.value=function(){let o=j().diff(Mo.room.sessionId);o=Math.round(o/1e3);const e=o%60;return a((o-e)/60,2)+":"+a(e,2)}():l.value="00:00",d.value=j(n.value).fromNow()}))})),J((()=>{clearInterval(i)})),{href:s,ui:t,state:Mo,votesTotal:r,remainingTime:d,confirmDestroy(){confirm("Are you sure you want to destroy this room?")&&function(){var o;const e=null==(o=Mo.room)?void 0:o.name;Ho.emit("close",zo(e)),delete Mo.tokens[e],Po()}()},extendRoom:Wo,sendCurrentRoomConfig:Zo,elapsedTime:l,switchStatus(){var o;"closed"===(null==(o=Mo.room)?void 0:o.status)?(t.showresults=!1,Mo.room.status="open",Mo.room.sessionId=(new Date).getTime()):(t.showresults=!0,Mo.room.status="closed"),Zo()}}}},No={style:{display:"flex","flex-direction":"column",height:"100%"}},Vo={class:"room-title"},Eo={class:"room-stats"},_o=s("br",null,null,-1),To={key:0,id:"voting-admin-panel"},Lo={class:"timer"},Do=a(" votes: "),Uo={class:"votesCount"},qo=a("<"),jo={key:1,class:"liveresults"},Jo={key:0},Qo=a("nombres de choix "),Bo=s("div",{style:{flex:"1"}},null,-1),Go={id:"advanced_options"};const Fo=[{path:"/",component:co},{path:"/about",component:vo},{path:"/:roomName/admin",component:X(So,[["render",function(i,l,c,d,u,f){var h;const g=o("logo"),w=o("vue-qrcode"),b=o("router-link"),k=o("chart");return e(),t("div",No,[r(g),s("div",Vo,m(null==(h=d.state.room)?void 0:h.name),1),s("div",Eo,[a(m(d.votesTotal),1),_o,s("span",null,m(d.state.count),1)]),d.state.room?(e(),t("div",To,[s("span",Lo,m(d.elapsedTime),1),s("button",{id:"questionAction",class:R({new:"closed"===d.state.room.status,stop:"closed"!=d.state.room.status}),onClick:l[0]||(l[0]=o=>d.switchStatus())},m("closed"==d.state.room.status?"NOUVEAU":"TERMINER"),3),Do,s("span",Uo,m(d.votesTotal),1),r(w,{id:"showqrcode",title:"afficher le QRCode",value:d.href,width:40,type:"image/png",color:{dark:"#000000ff",light:"#ffffffff"},quality:.92,onClick:l[1]||(l[1]=o=>d.ui.showqrcode=!d.ui.showqrcode)},null,8,["value","quality"]),s("img",{id:"toggleResults",alt:"afficher résultats",title:"afficher résultats",src:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAIAAAADnC86AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjExR/NCNwAAAJtJREFUWEftjcEJQlEMBG3ABrx7sgfr8ebdLi3g12AJ8YVd+GH/Q9AIHtxhTtnA7OJHvAo/Dqet3No4XJEk5NbG4YokIbc2DlckCbm1cbgiScitzUfhy3FixG25bs3/GQ5XJAlzkCR0mOb/DIcrkoQ5SBI6TPN/xv+Gz4v6vfD+rg4cXnWY5rMkocN03KU6HDi86jDNZ0nCt8IRTzfZRmDQJl1BAAAAAElFTkSuQmCC",onClick:l[2]||(l[2]=o=>d.ui.showresults=!d.ui.showresults)}),r(b,{class:"backLink",to:"/"},{default:n((()=>[qo])),_:1})])):p("",!0),d.ui.showresults&&d.state.room?(e(),t("div",jo,[r(k,{data:d.state.room.results.slice(0,d.state.room.nbOptions)},null,8,["data"]),"open"==d.state.room.status?(e(),t("div",Jo,[s("label",null,[Qo,Q(s("input",{type:"range",step:"1",min:"2",max:"8","onUpdate:modelValue":l[3]||(l[3]=o=>d.state.room.nbOptions=o),onChange:l[4]||(l[4]=o=>d.sendCurrentRoomConfig())},null,544),[[B,d.state.room.nbOptions,void 0,{number:!0}]]),a(" "+m(d.state.room.nbOptions),1)])])):p("",!0)])):p("",!0),Bo,s("div",Go,[a(" Room expires "+m(d.remainingTime)+" ",1),s("button",{onClick:l[5]||(l[5]=(...o)=>d.extendRoom&&d.extendRoom(...o))},"extend +1h"),s("button",{onClick:l[6]||(l[6]=(...o)=>d.confirmDestroy&&d.confirmDestroy(...o))},"destroy room")]),d.ui.showqrcode?(e(),t("div",{key:2,id:"qrCodePanel",onClick:l[8]||(l[8]=o=>d.ui.showqrcode=!1)},[r(w,{value:d.href,width:400,type:"image/png",color:{dark:"#000000ff",light:"#ffffffff"},quality:.92},null,8,["value","quality"]),s("h1",{class:"user-select",onClick:l[7]||(l[7]=v((()=>{}),["stop"]))},m(d.href),1)])):p("",!0)])}]]),name:"asker"},{path:"/:roomName",component:Oo,name:"voter"}],$o=F({history:$(),routes:Fo}),Mo=k({roomName:"",rooms:[],userId:function(){const o=localStorage.getItem("COLORVOTE_UUID");if(o)return o;const e=M();return localStorage.setItem("COLORVOTE_UUID",e),e}(),tokens:function(){const o=JSON.parse(localStorage.getItem("COLORVOTE_TOKENS")||"[]"),e={};return o.forEach((o=>{const t=G(o);t.exp>Date.now()/1e3&&(e[t.r]=o)})),e}(),connected:!1,error:null,count:0});function Po(){localStorage.setItem("COLORVOTE_TOKENS",JSON.stringify(Object.values(Mo.tokens)))}function zo(o){const e=localStorage.getItem("COLORVOTE_SUPERUSER");return e?`SUPERUSER|${o}|${e}`:Mo.tokens[o]}const Ho=P("https://api.colorvote.ch");function Yo(o,e){Ho.emit("join",o,e)}function Ko(o){Ho.emit("leave",o)}function Xo(){const o=prompt("Nom de la salle?");o&&Ho.emit("create",o,(e=>{Mo.tokens[o]=e,Po(),Yo(o,e)}))}function Wo(){var o;const e=null==(o=Mo.room)?void 0:o.name;Ho.emit("extend",zo(e),(o=>{Mo.tokens[e]=o,Po()}))}function Zo(){var o;Ho.emit("config",{s:Mo.room.status,o:Mo.room.nbOptions,i:Mo.room.sessionId},zo(null==(o=Mo.room)?void 0:o.name))}Ho.on("connect",(()=>{Mo.connected=!0})),Ho.on("disconnect",(()=>{Mo.connected=!1})),Ho.on("error",(o=>{Mo.error=o,$o.push("/")})),Ho.on("count",(o=>{Mo.count=o})),Ho.on("rooms",(o=>{Mo.rooms=o})),Ho.on("info",(o=>{if(Mo.error=null,Mo.room=function(o){return{name:o.n,status:o.s,sessionId:o.i,nbOptions:o.o,results:o.r}}(o),!$o.currentRoute.params||$o.currentRoute.params.roomName!=Mo.room.name){let o=`/${Mo.room.name}`;Mo.room.results&&(o+="/admin"),$o.push(o)}})),Ho.on("closed",(()=>{Mo.room=null,$o.push("/")}));const oe={class:"wrapper"},ee={key:0,id:"errormsg"},te={key:1,id:"reconnecting"};const se=z(X({setup:()=>({state:Mo})},[["render",function(s,n,a,i,l,c){const d=o("router-view");return e(),t("div",oe,[i.state.error?(e(),t("div",ee,m(i.state.error),1)):p("",!0),i.state.connected?p("",!0):(e(),t("div",te,"reconnecting")),r(d)])}]]));H({app:se,dsn:"https://f09e33ebeef1496b877ceebdcba1ff14@sentry.j42.org/22",integrations:[new Y.BrowserTracing({routingInstrumentation:K($o)})],tracesSampleRate:1}),se.use($o).mount("#app");
