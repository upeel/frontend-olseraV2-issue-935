(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-f997"],{"2WpZ":function(e,t,n){"use strict";n.r(t);var s=n("i4dQ"),r=n("8aBc");for(var o in r)["default"].indexOf(o)<0&&function(e){n.d(t,e,function(){return r[e]})}(o);var i=n("KHd+"),a=Object(i.a)(r.default,s.a,s.b,!1,null,null,null);a.options.__file="index.vue",t.default=a.exports},"8aBc":function(e,t,n){"use strict";n.r(t);var s=n("qSsp"),r=n.n(s);for(var o in s)["default"].indexOf(o)<0&&function(e){n.d(t,e,function(){return s[e]})}(o);t.default=r.a},Ccnf:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.mixinHiddenFeatureByPlanType=void 0;var s=n("rOiX"),r={computed:{planType:function(){return this.$store.getters.selectedStore.plan_type_id},selectedStore:function(){return this.$store.getters.selectedStore}},watch:{planType:{handler:function(e){this.resetLock()}}},mounted:function(){this.resetLock()},destroyed:function(){this.resetLock()},methods:{precheckByUrlId:function(e){return s.featureAccessByUrlIds[this.selectedStore.url_id]&&s.featureAccessByUrlIds[this.selectedStore.url_id].includes(e)},resetLock:function(){this.destoryIconSubmenuDisabled();var e=document.querySelectorAll(".submenu-disabled a, .button-plan-type-disabled");e&&e.length&&e.forEach(function(e){e.insertAdjacentHTML("beforeend",'<svg aria-hidden="true" class="ml-10 svg-icon icon-submenu-disabled"><use xlink:href="#icon-lock"></use></svg>')})},destoryIconSubmenuDisabled:function(){var e=document.querySelectorAll(".panel.tab-list .icon-submenu-disabled, .button-plan-type-disabled .icon-submenu-disabled");e&&e.length&&e.forEach(function(e){e.remove()})},methodRouteIsHidden:function(e){return this.$isHiddenByPlanType(this.planType,e)},methodFeatureNameIsHidden:function(e){return this.$isFeatureNameHiddenByPlanType(this.planType,e)},methodFeatureIsHiddenCellTable:function(e){return this.handlerClassName(e,"methodFeatureNameIsHidden",["celltable"])},methodRouteIsHiddenSidebarMenuClass:function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return!this.precheckByUrlId(e)&&this.handlerClassName(e,"methodRouteIsHidden",["sidebarmenu"],t)},methodRouteIsHiddenSubMenuClass:function(e){return!this.precheckByUrlId(e)&&this.handlerClassName(e,"methodRouteIsHidden",["submenu"])},methodRouteIsHiddenButtonClass:function(e){return this.handlerClassName(e,"methodFeatureNameIsHidden",["button","button-plan-type"])},handlerClassName:function(e,t,n){var s=arguments.length>3&&void 0!==arguments[3]&&arguments[3],r="-enabled";this[t](e)&&!s&&(r="-disabled");var o=[];return n.map(function(e){o.push(e+r)}),o.join(" ")}}};t.mixinHiddenFeatureByPlanType=r},DChC:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=o(n("QbLZ")),r=o(n("Ljqw"));function o(e){return e&&e.__esModule?e:{default:e}}var i={mixins:[n("6y4V").checkCustomPermission],computed:{selectedStore:function(){return this.$store.getters.selectedStore},token:function(){return this.$store.state.user.token},langId:function(){return this.$store.state.userStores.langId},lang:function(){return this.$store.state.userStores?this.$store.state.userStores.lang:{}},userRole:function(){var e=this.$store.getters.selectedStore;return{role_id:e.role_id,role_name:e.role_name,is_pos_only:e.is_pos_only,is_mobile:e.is_mobile}},rootLang:function(){return this.$lang[this.langId]},headers:function(){var e=this.$store.getters.token;return this.$store.getters.webviewMode&&(e=this.$store.getters.webviewToken),{Authorization:"Bearer "+e.access_token}},baseURL:function(){return r.default},loggedInUser:function(){return this.$store.state.user.loggedInUser},stageLevel:function(){return"sit"},defaultAccessByStore:function(){return["setdemo1","allinolsera2"]},wejayafoodAccessByStore:function(){return["setdemo1","allinolsera2","ayammrotholpusat","ayammrotholdramaga"]},saveToAllAccessStore:function(){return["setdemo1","allinolsera2","siliwangidutagarden","barokahfrozenfood"]},outlets:function(){var e=[{name:this.$store.state.userStores.lang.all,store_id:0,url_id:"all"}],t=[];return this.$store.getters.stores.map(function(n){t.includes(n.store_id)||n.is_store_active&&(e.push((0,s.default)({},n)),t.push(n.store_id))}),e},tokopediaActiveStore:function(){return this.$store.state.tokopediaActiveStore},shopeeActiveStore:function(){return this.$store.state.shopeeActiveStore}}};t.default=i},i4dQ:function(e,t,n){"use strict";n.d(t,"a",function(){return s}),n.d(t,"b",function(){return r});var s=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"content-wrapper"},[n("section",{staticClass:"content sales-list"},[n("div",{staticClass:"panel tab-list"},[n("ul",{staticClass:"nav-tabs-shop-devin",attrs:{role:"tablist"}},[n("li",[n("router-link",{attrs:{to:{path:"/online-order/service"}}},[e._v("\n            "+e._s(e.$lang[e.langId].service)+"\n          ")])],1),e._v(" "),n("li",{class:[e.methodRouteIsHiddenSubMenuClass("/online-order/working-hours")]},[n("router-link",{attrs:{to:{path:"/online-order/working-hours"}}},[e._v("\n            "+e._s(e.$lang[e.langId].working_hours)+"\n          ")])],1),e._v(" "),n("li",[n("router-link",{attrs:{to:{path:"/online-order/delivery"}}},[e._v("\n            "+e._s(e.$lang[e.langId].delivery)+"\n          ")])],1),e._v(" "),1===e.selectedStore.pos_resto_mode?n("li",[n("router-link",{attrs:{to:{path:"/online-order/dinein"}}},[e._v("\n            Dine In & Buku Menu\n          ")])],1):e._e(),e._v(" "),"dev"===e.stageLevel||"sit"===e.stageLevel?n("li",[n("router-link",{attrs:{to:{path:"/online-order/reservation"}}},[e._v("\n            Reservasi\n          ")])],1):e._e(),e._v(" "),n("li",[n("router-link",{attrs:{to:{path:"/online-order/setting"}}},[e._v("\n            "+e._s(e.$lang[e.langId].setting)+"\n          ")])],1)])]),e._v(" "),n("div",{staticClass:"tab-content"},[n("router-view")],1)])])},r=[]},qSsp:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=n("Ccnf"),r=function(e){return e&&e.__esModule?e:{default:e}}(n("DChC"));t.default={name:"OnlineOrderSetting",mixins:[s.mixinHiddenFeatureByPlanType,r.default],computed:{lang:function(){return this.$store.state.userStores.lang},token:function(){return this.$store.state.user.token},selectedStore:function(){return this.$store.getters.selectedStore},langId:function(){return this.$store.state.userStores.langId}},watch:{"$store.getters.selectedStore":function(){this.getTest()}},methods:{getTest:function(){0===this.selectedStore.active_online_order&&this.$router.push("/dashboard")}}}}}]);