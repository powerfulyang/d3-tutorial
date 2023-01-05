"use strict";(self.webpackChunkd3_tutorial=self.webpackChunkd3_tutorial||[]).push([[179],{803:(t,a,n)=>{n.a(t,(async(t,r)=>{try{n.d(a,{Bl:()=>k,Bz:()=>O,Cb:()=>m,Ei:()=>b,Gl:()=>Y,Rf:()=>T,YP:()=>x,aT:()=>h,bH:()=>C,bf:()=>y,jv:()=>M,kW:()=>_,lQ:()=>R,nw:()=>I,o3:()=>g,uF:()=>E,xk:()=>f,yR:()=>B});var e,o=n(302),i=n(579),c=n(637),s=n.n(c),l=Intl.DateTimeFormat().resolvedOptions().timeZone,u=new Headers({"x-client-timezone":l}),p=await fetch("".concat(i.O,"/api/public/view-count"),{headers:u}),d=(await p.json()).reverse().map((function(t){return{date:o.rr1(new Date(t.date)),requestCount:t.requestCount,distinctRequestCount:t.distinctRequestCount,distinctIpCount:t.distinctIpCount}})),f=o.Wem(d,(function(t){return t.date})),h=o.Xf().domain(f).ticks(o.rr1).map((function(t){return d.find((function(a){return s()(a.date).isSame(t)}))||{date:t,requestCount:0,distinctRequestCount:0,distinctIpCount:0}})),v=(0,o.Ys)("#container"),y=1300,m=600,g=50,x=v.append("svg").attr("width",y).attr("height",m+150),w=(0,o.Fp7)(h,(function(t){return Math.max(t.requestCount,t.distinctIpCount)}))||0,C=(0,o.Xf)().domain(f).range([0,y-2*g]),b=(C.copy(),(0,o.BYU)().domain([w,0]).range([0,m-2*g])),k=b.copy().domain(),I=function(){return o.jvg().x((function(t,a){return C(h[a].date)||0})).y((function(t){return b(t)||0}))},E=function(){return I().curve(o.FdL)},Y=x.append("g").attr("class","axis").attr("transform","translate(".concat(g,",").concat(m-g,")")).call((0,o.LLu)(C)),T=x.append("g").attr("class","axis").attr("transform","translate(".concat(g,",").concat(g,")")).call((0,o.y4O)(b)),M=x.append("g").attr("transform","translate(".concat(g,",").concat(g,")")).attr("clip-path","url(#clip)"),L=h.map((function(t){return t.requestCount}));function O(){return M.append("path").datum(L).attr("class","line").attr("fill","none").attr("stroke",o.yKE[0]).attr("stroke-width",1).attr("d",I())}var q=O(),F=null===(e=q.node())||void 0===e?void 0:e.getTotalLength();F&&q.attr("stroke-dasharray",F).attr("stroke-dashoffset",F).transition().duration(2e3).ease(o.Nyw).attr("stroke-dashoffset",0);var N=h.map((function(t){return t.distinctIpCount}));function _(){M.append("path").datum(N).attr("class","curve-line").attr("fill","none").attr("stroke",o.yKE[1]).attr("stroke-width",1).attr("d",E())}_();var R=y-2*g,B=m-2*g;x.append("defs").append("clipPath").attr("id","clip").append("rect").attr("width",R).attr("height",B).attr("x",0).attr("y",0),r()}catch(K){r(K)}}),1)},718:(t,a,n)=>{n.a(t,(async(t,r)=>{try{n.d(a,{K1:()=>f,LV:()=>d,Ml:()=>y,cf:()=>p,nM:()=>v});var e=n(302),o=n(637),i=n.n(o),c=n(133),s=n(803),l=t([c,s]);[c,s]=l.then?(await l)():l;var u=e.Yud().extent([[0,0],[s.bf-2*s.o3,s.o3]]),p=function(){s.Rf.transition().duration(1e3).call((0,e.y4O)(s.Ei))},d=function(){s.jv.selectAll(".line").transition().duration(1e3).attr("d",(0,s.nw)())},f=function(){s.jv.selectAll(".curve-line").transition().duration(1e3).attr("d",(0,s.uF)())},h=!1;u.on("end",(function(t){var a=t.selection;if(a){h=!0;var n=c.p.invert(a[0]),r=c.p.invert(a[1]),o=[e.rr1(n),e.rr1(r)],l=e.Xf().domain(o).ticks(e.rr1),u=e.VV$(l),v=e.Fp7(l);if(u&&v){s.bH.domain([u,v]);var y=s.aT.findIndex((function(t){return i()(u).isSame(t.date)})),m=s.aT.findIndex((function(t){return i()(v).isSame(t.date)})),g=s.aT.slice(y,m+1),x=e.Fp7(g,(function(t){return Math.max(t.requestCount,t.distinctIpCount)}))||0;s.Ei.domain([x,0])}else h=!1}else{if(!h)return;h=!1,s.bH.domain(s.xk),s.Ei.domain(s.Bl)}s.jv.selectAll(".circle").remove(),s.Gl.transition().duration(1e3).call((0,e.LLu)(s.bH)),p(),d(),f()}));var v=20;function y(){var t=s.YP.append("g").attr("class","brush").attr("transform","translate(".concat(s.o3,",").concat(s.Cb-s.o3+v+30,")")).call(u);(0,c.g)(t)}r()}catch(m){r(m)}}))},133:(t,a,n)=>{n.a(t,(async(t,r)=>{try{n.d(a,{g:()=>l,p:()=>s});var e=n(302),o=n(803),i=t([o]),c=[(o=(i.then?(await i)():i)[0]).xk[0],e.S1K.offset(o.xk[1],86399)],s=e.Xf().domain(c).range([0,o.bf-2*o.o3]);function l(t){var a=e.Ly_().domain(c).thresholds(s.ticks(e.rr1)).value((function(t){return t.date}))(o.aT.map((function(t){return{date:t.date,distinctIpCount:t.distinctIpCount}}))).filter((function(t){return void 0!==t[0]&&void 0!==t.x0&&void 0!==t.x1})).map((function(t){return{distinctIpCount:t[0].distinctIpCount,x0:t.x0,x1:t.x1}})),n=e.Fp7(o.aT,(function(t){return t.distinctIpCount}))||0,r=e.BYU().domain([n,0]).range([0,50]),i=(0,e.BYU)().domain([0,n]).range(["#ffffff","#0000ff"]);t.insert("g",":first-child").attr("class","brush-histogram").selectAll("rect").data(a).join("rect").attr("x",(function(t){return s(t.x0)+1})).attr("y",(function(t){return r(t.distinctIpCount)})).attr("width",(function(t){return s(t.x1)-s(t.x0)-1})).attr("height",(function(t){return 50-r(t.distinctIpCount)})).style("fill",(function(t){return i(t.distinctIpCount)}))}r()}catch(u){r(u)}}))},582:(t,a,n)=>{n.a(t,(async(t,r)=>{try{n.d(a,{N6:()=>c});var e=n(302),o=n(803),i=t([o]);function c(){var t=o.YP.append("g").attr("class","tooltip").attr("transform","translate(".concat(o.o3,",").concat(o.o3,")"));t.append("path").attr("class","tooltip-line").style("stroke","#ccc").style("stroke-width","1px").style("opacity","0"),t.append("text").attr("class","tooltip-text").style("opacity","0");var a=t.selectAll(".tooltip-group").data(["requestCount","distinctIpCount"]).enter().append("g").attr("class","tooltip-group");a.append("circle").attr("r",2).style("fill",(function(t,a){return e.yKE[a]})).style("opacity","0"),a.append("text").style("fill",(function(t,a){return e.yKE[a]})).attr("transform","translate(10,3)"),t.append("rect").attr("width",o.bf-2*o.o3).attr("height",o.Cb-2*o.o3).attr("fill","none").attr("pointer-events","all").on("mouseout",(function(){e.Ys(".tooltip-line").style("opacity","0"),e.td_(".tooltip-group circle").style("opacity","0"),e.td_(".tooltip-group text").style("opacity","0"),e.Ys(".tooltip-text").style("opacity","0")})).on("mouseover",(function(){e.Ys(".tooltip-line").style("opacity","1"),e.td_(".tooltip-group circle").style("opacity","1"),e.td_(".tooltip-group text").style("opacity","1"),e.Ys(".tooltip-text").style("opacity","1")})).on("mousemove",(function(t){var a,n=e.cx$(t),r=o.bH,i=o.Ei,c=r.invert(n[0]),s=e.YFb((function(t){return t.date})).center(o.aT,c),l=r(o.aT[s].date)||0,u=o.Cb-2*o.o3;if(!(l<0||l>o.bf-2*o.o3)){e.Ys(".tooltip-line").datum([[l,u],[l,0]]).attr("d",e.jvg());var p=e.Ys(".tooltip-text").text(o.aT[s].date.toDateString()),d=(null===(a=p.node())||void 0===a?void 0:a.getBBox().width)||0;p.style("transform","translate(".concat(l-d/2,"px, 0)")),e.td_(".tooltip-group").attr("transform",(function(t){var a=o.aT[s][t];return e.Ys(this).select("text").text(a.toFixed(0)),"translate(".concat(r(o.aT[s].date),",").concat(i(a),")")}))}}))}o=(i.then?(await i)():i)[0],r()}catch(s){r(s)}}))},97:(t,a,n)=>{n.a(t,(async(t,a)=>{try{var r=n(582),e=n(803),o=n(718),i=n(471),c=t([r,e,o,i]);[r,e,o,i]=c.then?(await c)():c,(0,o.Ml)(),(0,r.N6)(),a()}catch(t){a(t)}}))},471:(t,a,n)=>{n.a(t,(async(t,a)=>{try{var r=n(803),e=n(718),o=n(302),i=t([r,e]);[r,e]=i.then?(await i)():i;var c=r.YP.append("g").attr("transform","translate(".concat(r.lQ/2,",").concat(r.yR+e.nM+r.o3+20,")")),s=c.append("g").attr("class","active").style("fill",o.yKE[0]).on("click",(function(){var t=o.Ys(this);if(t.classed("active")){t.classed("active",!1),t.style("fill","#ccc"),o.Ys(".line").remove();var a=o.Fp7(r.aT,(function(t){return t.distinctIpCount}));r.Ei.domain([a,0]),(0,e.cf)(),(0,e.K1)()}else t.classed("active",!0),t.style("fill",o.yKE[0]),r.Ei.domain(r.Bl),(0,e.cf)(),(0,r.Bz)(),(0,e.K1)()}));s.append("text").text("requestCount").attr("class","request-count-line").attr("transform","translate(-100,0)").style("cursor","pointer"),s.append("circle").attr("r",2).attr("transform","translate(-110,-4)");var l=c.append("g").attr("class","active").style("fill",o.yKE[1]).on("click",(function(){var t=o.Ys(this);if(t.classed("active")){t.classed("active",!1),t.style("fill","#ccc"),o.Ys(".curve-line").remove();var a=o.Fp7(r.aT,(function(t){return t.requestCount}));r.Ei.domain([a,0]),(0,e.cf)(),(0,e.LV)()}else t.classed("active",!0),t.style("fill",o.yKE[1]),r.Ei.domain(r.Bl),(0,e.cf)(),(0,r.kW)(),(0,e.LV)()}));l.append("text").text("distinctIpCount").attr("class","distinct-ip-count-line").attr("transform","translate(100,0)").style("cursor","pointer"),l.append("circle").attr("r",2).attr("transform","translate(90,-4)"),a()}catch(t){a(t)}}))},579:(t,a,n)=>{n.d(a,{O:()=>r});var r="https://api.powerfulyang.com"},103:(t,a,n)=>{n.a(t,(async(t,a)=>{try{var r=n(579),e=n(302),o=await fetch("".concat(r.O,"/api/github/user_info/powerfulyang")),i=await o.json(),c=e.Ys("#github-profile"),s=1280,l=850,u=c.append("svg").attr("xmlns","http://www.w3.org/2000/svg").attr("width",s).attr("height",l).attr("viewBox","0 0 ".concat(s," ").concat(l));u.append("rect").attr("x",0).attr("y",0).attr("width",s).attr("height",l);var p=u.append("g"),d=20*Math.tan(30*Math.PI/180),f=Math.ceil(i.contributionCalendar.length/7),h=.9*d,v=l-(f+7)*d,y=function(t,a,n,r){var o=-7*a,i=["20%","30%","35%","40%","50%"][function(t){switch(t){case"FIRST_QUARTILE":return 1;case"SECOND_QUARTILE":return 2;case"THIRD_QUARTILE":return 3;case"FOURTH_QUARTILE":return 4;default:return 0}}(n)],c=new Array(7).fill(0).map((function(t,a){return(60*a+o)%360})).map((function(t){return"hsl(".concat(t,", ").concat("50%",", ").concat(i,")")})).map((function(t){return e.B8C(t).darker(r)})).join(";");t.append("animate").attr("attributeName","fill").attr("values",c).attr("dur","10s").attr("repeatCount","indefinite")};i.contributionCalendar.forEach((function(t,a){var n=new Date(t.date).getUTCDay(),r=Math.floor(a/7),e=140+20*(r-n),o=v+(r+n)*d,i=144*Math.log10(t.contributionCount/20+1)+3,c=t.contributionLevel,s=p.append("g").attr("transform","translate(".concat(e,", ").concat(o-i,")"));"NONE"!==t.contributionLevel&&s.append("animateTransform").attr("attributeName","transform").attr("type","translate").attr("from","".concat(e," ").concat(o-3)).attr("to","".concat(e," ").concat(o-i)).attr("dur","3s").attr("repeatCount","1");var l=s.append("rect").attr("stroke","none").attr("width",18).attr("height",18).attr("x",0).attr("y",0).attr("transform","skewY(-30) skewX(".concat(Math.atan(9/h)*(180/Math.PI),") scale(").concat(1," ").concat(2*h/18,")"));y(l,r,c,0);var u=Math.sqrt(Math.pow(18,2)+Math.pow(h,2))/18,f=i/u,m=s.append("rect").attr("stroke","none").attr("width",18).attr("height",f).attr("x",0).attr("y",0).attr("transform","skewY(30) scale(".concat(1,", ").concat(u,")"));y(m,r,c,.5),"NONE"!==t.contributionLevel&&m.append("animate").attr("attributeName","height").attr("from",3/u).attr("to",f).attr("dur","3s").attr("repeatCount","1");var g=Math.sqrt(Math.pow(18,2)+Math.pow(h,2))/18,x=i/g,w=s.append("rect").attr("stroke","none").attr("width",18).attr("height",x).attr("x",0).attr("y",0).attr("transform","translate(".concat(18,",").concat(h,") skewY(-30) scale(").concat(1,", ").concat(g,")"));y(w,r,c,1),"NONE"!==t.contributionLevel&&w.append("animate").attr("attributeName","height").attr("from",3/g).attr("to",x).attr("dur","3s").attr("repeatCount","1")})),a()}catch(t){a(t)}}),1)},35:(t,a,n)=>{n.a(t,(async(t,a)=>{try{var r=n(103),e=n(97),o=t([r,e]);[r,e]=o.then?(await o)():o,a()}catch(t){a(t)}}))}},t=>{t.O(0,[216],(()=>(35,t(t.s=35)))),t.O()}]);