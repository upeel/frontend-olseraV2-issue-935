(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-09a9"],{"1oEa":function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(e){return e&&e.__esModule?e:{default:e}}(n("QbLZ"));t.default={data:function(){return{localSelectedStore:""}},computed:{stores:function(){return this.$store.state.userStores.stores},selectedStore:function(){return this.$store.getters.selectedStore},token:function(){return this.$store.state.user.token},rootLang:function(){return this.$lang[this.langId]},langId:function(){return this.$store.state.userStores.langId}},watch:{selectedStore:{handler:function(e){this.localSelectedStore=(0,r.default)({},e)},deep:!0,immediate:!0}},methods:{handleChangeSelectStore:function(e){this.$emit("change",e.store_id)}}}},BHoP:function(e,t,n){"use strict";n.r(t);var r=n("R2U7"),s=n("hJrB");for(var o in s)["default"].indexOf(o)<0&&function(e){n.d(t,e,function(){return s[e]})}(o);var a=n("KHd+"),i=Object(a.a)(s.default,r.a,r.b,!1,null,null,null);i.options.__file="SwitchStore.vue",t.default=i.exports},CxQ9:function(e,t,n){"use strict";n.r(t);var r=n("Dors"),s=n.n(r);for(var o in r)["default"].indexOf(o)<0&&function(e){n.d(t,e,function(){return r[e]})}(o);t.default=s.a},DChC:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=o(n("QbLZ")),s=o(n("Ljqw"));function o(e){return e&&e.__esModule?e:{default:e}}var a={mixins:[n("6y4V").checkCustomPermission],computed:{selectedStore:function(){return this.$store.getters.selectedStore},token:function(){return this.$store.state.user.token},langId:function(){return this.$store.state.userStores.langId},lang:function(){return this.$store.state.userStores?this.$store.state.userStores.lang:{}},userRole:function(){var e=this.$store.getters.selectedStore;return{role_id:e.role_id,role_name:e.role_name,is_pos_only:e.is_pos_only,is_mobile:e.is_mobile}},rootLang:function(){return this.$lang[this.langId]},headers:function(){var e=this.$store.getters.token;return this.$store.getters.webviewMode&&(e=this.$store.getters.webviewToken),{Authorization:"Bearer "+e.access_token}},baseURL:function(){return s.default},loggedInUser:function(){return this.$store.state.user.loggedInUser},stageLevel:function(){return"sit"},defaultAccessByStore:function(){return["setdemo1","allinolsera2"]},wejayafoodAccessByStore:function(){return["setdemo1","allinolsera2","ayammrotholpusat","ayammrotholdramaga"]},saveToAllAccessStore:function(){return["setdemo1","allinolsera2","siliwangidutagarden","barokahfrozenfood"]},outlets:function(){var e=[{name:this.$store.state.userStores.lang.all,store_id:0,url_id:"all"}],t=[];return this.$store.getters.stores.map(function(n){t.includes(n.store_id)||n.is_store_active&&(e.push((0,r.default)({},n)),t.push(n.store_id))}),e},tokopediaActiveStore:function(){return this.$store.state.tokopediaActiveStore},shopeeActiveStore:function(){return this.$store.state.shopeeActiveStore}}};t.default=a},Dors:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={name:"SplashScreen",props:{loading:{type:Boolean,default:!1}},data:function(){return{visibleSplashScreen:!0}},watch:{loading:{immediate:!0,handler:function(e){var t=this;e?this.visibleSplashScreen=e:setTimeout(function(){t.visibleSplashScreen=!1},1e3)}}}}},PpQ1:function(e,t,n){"use strict";n.r(t);var r=n("s1Sf"),s=n("CxQ9");for(var o in s)["default"].indexOf(o)<0&&function(e){n.d(t,e,function(){return s[e]})}(o);var a=n("KHd+"),i=Object(a.a)(s.default,r.a,r.b,!1,null,null,null);i.options.__file="SplashScreen.vue",t.default=i.exports},R2U7:function(e,t,n){"use strict";n.d(t,"a",function(){return r}),n.d(t,"b",function(){return s});var r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("el-select",{staticStyle:{width:"100%"},attrs:{"value-key":"store_id",filterable:""},on:{change:e.handleChangeSelectStore},model:{value:e.localSelectedStore,callback:function(t){e.localSelectedStore=t},expression:"localSelectedStore"}},e._l(e.stores,function(t,r){return n("el-option",{key:r,staticClass:"box-in-loop pointer flex-container m-null",attrs:{label:t.name,value:t,disabled:t.disable}},[n("div",{staticStyle:{"flex-grow":"1","line-height":"1"}},[n("div",{staticClass:"font-bold font-14"},[e._v(e._s(t.name))]),e._v(" "),n("span",{staticClass:"font-13"},[e._v(e._s(t.url_id+".myolsera.com"))])]),e._v(" "),t.disable?n("span",[n("el-button",{staticClass:"btn-block",attrs:{round:"",size:"small",type:"danger"}},[e._v("\n          "+e._s(e.rootLang.expired)+"\n        ")])],1):e._e()])}),1)],1)},s=[]},S2fW:function(e,t,n){"use strict";var r=n("snMk");n.n(r).a},hJrB:function(e,t,n){"use strict";n.r(t);var r=n("1oEa"),s=n.n(r);for(var o in r)["default"].indexOf(o)<0&&function(e){n.d(t,e,function(){return r[e]})}(o);t.default=s.a},jfnq:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=l(n("14Xm")),s=l(n("D3Ub")),o=n("xCek"),a=l(n("BHoP")),i=l(n("PpQ1")),u=l(n("DChC"));function l(e){return e&&e.__esModule?e:{default:e}}t.default={name:"IndexReportsMobile",components:{SwitchStore:a.default,SplashScreen:i.default},mixins:[u.default],data:function(){return{loading:!0,reportsPathTaxRole:[{path:"salestaxrole",key:"sales"}],reportsPath:[{path:"products",key:"products",premium:!1},{path:"purchases",key:"purchase",premium:!0},{path:"sales",key:"sales",premium:!1},{path:"shifts",key:"shift",premium:!0},{path:"payments",key:"payment",premium:!1},{path:"multioutlets",key:"multi_outlet_reports",premium:!0},{path:"attendance",key:"attendance_reports",premium:!0}],initStoreId:null,readyToMount:!1}},computed:{token:function(){return this.$store.getters.webviewToken},selectedStore:function(){return this.$store.getters.webviewSelectedStore},lang:function(){return this.$store.state.userStores.lang},langId:function(){return this.$store.state.userStores.langId}},mounted:function(){this.$store.commit("SET_WEBVIEW_MODE",!0);var e=this.$route.query,t=e.password,n=e.username,r=e.store_id,s=e.lang,o=JSON.parse(localStorage.getItem("olsbowebview_token")),a=JSON.parse(localStorage.getItem("olsbowebview_selectedstore"));this.getLocalization(s),t&&n&&r?(this.$store.commit("REMOVE_WEBVIEW_TOKEN"),this.$store.commit("REMOVE_WEBVIEW_SELECTED_STORE"),this.initStoreId=r,this.authUser({username:n,password:t,store_id:r})):t&&n&&!r?(this.$store.commit("REMOVE_WEBVIEW_TOKEN"),this.$store.commit("REMOVE_WEBVIEW_SELECTED_STORE"),this.authUser({username:n,password:t})):!o||!a||t||n||r?this.handleAuthFailed("mounted"):(this.$store.commit("SET_WEBVIEW_TOKEN",o),this.getLoggedInUser())},methods:{authUser:function(e){var t=this;this.loading=!0;var n={username:e.username,password:e.password,client_id:2,client_secret:"0XqbhEW6E72GNHn0iIM7Ui1GgB8jny91wYnXAIb8",grant_type:"password"};this.$store.dispatch("webviewLogin",n).then(function(n){t.$store.dispatch("webviewFetchUserLoggedin").then(function(){var n=(0,s.default)(r.default.mark(function n(s){var o;return r.default.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:if(o=e.store_id){n.next=4;break}return n.next=4,t.$store.dispatch("setStores").then(function(e){o=e.data.data[0].store_id}).catch(function(){});case 4:t.$store.dispatch("webviewSetSelectedStore",o).then(function(){t.loading=!1,t.readyToMount=!0,"PJ"===t.selectedStore.role_id&&t.$router.push({path:"/reports-mobile/salestaxrole?path=salesreport"})});case 5:case"end":return n.stop()}},n,t)}));return function(e){return n.apply(this,arguments)}}())}).catch(function(e){t.loading=!1,t.handleAuthFailed()})},getLoggedInUser:function(){var e=this;this.loading=!0,this.$store.dispatch("webviewFetchUserLoggedin").then(function(){e.readyToMount=!0,e.loading=!1}).catch(function(t){e.loading=!1,e.handleAuthFailed()})},getLocalization:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;return(0,s.default)(r.default.mark(function n(){var s;return r.default.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return(s=t)||(s="id"),n.next=4,o.HTTP.get("localization").then(function(t){e.$store.dispatch("setLangLocally",{id:s,lang:t.data[s].admin.all})});case 4:case"end":return n.stop()}},n,e)}))()},handleAuthFailed:function(e){console.log(e),this.$message({type:"warning",message:"Auth failed"}),this.$router.push({path:"/webview-login",query:{redirect:"/reports-mobile"}})}}}},"nI+D":function(e,t,n){"use strict";n.r(t);var r=n("jfnq"),s=n.n(r);for(var o in r)["default"].indexOf(o)<0&&function(e){n.d(t,e,function(){return r[e]})}(o);t.default=s.a},s1Sf:function(e,t,n){"use strict";n.d(t,"a",function(){return r}),n.d(t,"b",function(){return s});var r=function(){var e=this.$createElement,t=this._self._c||e;return t("transition",{attrs:{name:"el-fade-in-linear"}},[this.visibleSplashScreen?t("div",{attrs:{id:"olsera-splash-screen"}},[t("div",{staticStyle:{"text-align":"center"}},[t("div",[t("img",{attrs:{src:"/static/img/olsera-office.png"}})]),this._v(" "),t("div",[this._v("\n        Please wait...\n      ")])])]):this._e()])},s=[]},snMk:function(e,t,n){},ttYn:function(e,t,n){"use strict";n.d(t,"a",function(){return r}),n.d(t,"b",function(){return s});var r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return e.token&&e.token.access_token&&e.selectedStore?n("div",[n("div",{staticClass:"wrapper-nav-tabs-mobile-reports"},[n("ul",{staticClass:"nav-tabs-shop-devin",attrs:{role:"tablist"}},["PJ"!==e.selectedStore.role_id?e._l(e.reportsPath,function(t,r){return n("li",{key:r,attrs:{"data-wow-delay":"0.14s"}},[e.selectedStore.pos_freemium?n("div",[t.premium?t.premium&&1===e.selectedStore.is_onlineshop?n("router-link",{attrs:{to:"/reports-mobile/"+t.path}},[e._v("\n              "+e._s(e.lang[t.key])+"\n            ")]):n("router-link",{attrs:{to:{path:"/reports-mobile/freemium"}}},[e._v("\n              "+e._s(e.lang[t.key])+"\n              "),n("span",{staticClass:"premium-labeled-tabs"},[e._v("\n                Premium\n              ")])]):n("router-link",{attrs:{to:"/reports-mobile/"+t.path}},[e._v("\n              "+e._s(e.lang[t.key])+"\n            ")])],1):n("div",[n("router-link",{attrs:{to:"/reports-mobile/"+t.path}},["attendance"!==t.path?n("span",[e._v(e._s(e.lang[t.key]))]):n("span",[e._v(e._s(e.rootLang[t.path]))])])],1)])}):e._l(e.reportsPathTaxRole,function(t,r){return n("li",{key:r,attrs:{"data-wow-delay":"0.14s"}},[n("div",[n("router-link",{attrs:{to:"/reports-mobile/"+t.path}},[e._v("\n              "+e._s(e.lang[t.key])+"\n            ")])],1)])})],2)]),e._v(" "),n("div",{staticClass:"mobile-report--main"},[e.readyToMount?n("router-view"):e._e()],1),e._v(" "),n("splash-screen",{attrs:{loading:e.loading}})],1):e._e()},s=[]},uObg:function(e,t,n){"use strict";n.r(t);var r=n("ttYn"),s=n("nI+D");for(var o in s)["default"].indexOf(o)<0&&function(e){n.d(t,e,function(){return s[e]})}(o);n("S2fW");var a=n("KHd+"),i=Object(a.a)(s.default,r.a,r.b,!1,null,"373ac5c7",null);i.options.__file="IndexMobile.vue",t.default=i.exports}}]);