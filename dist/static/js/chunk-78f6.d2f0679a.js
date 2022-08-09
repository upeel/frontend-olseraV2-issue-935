(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-78f6"],{Ccnf:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.mixinHiddenFeatureByPlanType=void 0;var n=s("rOiX"),i={computed:{planType:function(){return this.$store.getters.selectedStore.plan_type_id},selectedStore:function(){return this.$store.getters.selectedStore}},watch:{planType:{handler:function(e){this.resetLock()}}},mounted:function(){this.resetLock()},destroyed:function(){this.resetLock()},methods:{precheckByUrlId:function(e){return n.featureAccessByUrlIds[this.selectedStore.url_id]&&n.featureAccessByUrlIds[this.selectedStore.url_id].includes(e)},resetLock:function(){this.destoryIconSubmenuDisabled();var e=document.querySelectorAll(".submenu-disabled a, .button-plan-type-disabled");e&&e.length&&e.forEach(function(e){e.insertAdjacentHTML("beforeend",'<svg aria-hidden="true" class="ml-10 svg-icon icon-submenu-disabled"><use xlink:href="#icon-lock"></use></svg>')})},destoryIconSubmenuDisabled:function(){var e=document.querySelectorAll(".panel.tab-list .icon-submenu-disabled, .button-plan-type-disabled .icon-submenu-disabled");e&&e.length&&e.forEach(function(e){e.remove()})},methodRouteIsHidden:function(e){return this.$isHiddenByPlanType(this.planType,e)},methodFeatureNameIsHidden:function(e){return this.$isFeatureNameHiddenByPlanType(this.planType,e)},methodFeatureIsHiddenCellTable:function(e){return this.handlerClassName(e,"methodFeatureNameIsHidden",["celltable"])},methodRouteIsHiddenSidebarMenuClass:function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return!this.precheckByUrlId(e)&&this.handlerClassName(e,"methodRouteIsHidden",["sidebarmenu"],t)},methodRouteIsHiddenSubMenuClass:function(e){return!this.precheckByUrlId(e)&&this.handlerClassName(e,"methodRouteIsHidden",["submenu"])},methodRouteIsHiddenButtonClass:function(e){return this.handlerClassName(e,"methodFeatureNameIsHidden",["button","button-plan-type"])},handlerClassName:function(e,t,s){var n=arguments.length>3&&void 0!==arguments[3]&&arguments[3],i="-enabled";this[t](e)&&!n&&(i="-disabled");var o=[];return s.map(function(e){o.push(e+i)}),o.join(" ")}}};t.mixinHiddenFeatureByPlanType=i},VW90:function(e,t,s){"use strict";s.r(t);var n=s("guSs"),i=s("m8aI");for(var o in i)["default"].indexOf(o)<0&&function(e){s.d(t,e,function(){return i[e]})}(o);var r=s("KHd+"),a=Object(r.a)(i.default,n.a,n.b,!1,null,null,null);a.options.__file="Index.vue",t.default=a.exports},ZUJq:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=s("Ccnf"),i=s("6y4V");t.default={name:"PosSettingsIndex",mixins:[n.mixinHiddenFeatureByPlanType,i.checkCustomPermission],computed:{langId:function(){return this.$store.state.userStores.langId},lang:function(){return this.$store.state.userStores.lang},selectedStore:function(){return this.$store.getters.selectedStore},stageLevel:function(){return"production"},loggedInUser:function(){return this.$store.getters.loggedInUser}}}},guSs:function(e,t,s){"use strict";s.d(t,"a",function(){return n}),s.d(t,"b",function(){return i});var n=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"content-wrapper"},[s("section",{staticClass:"content sales-list"},[s("div",{staticClass:"panel tab-list"},[s("ul",{staticClass:"nav-tabs-shop-devin",attrs:{role:"tablist"}},[e.checkCustomPermission("settings/pospaymentmodes","index")?s("li",[s("router-link",{attrs:{to:{path:"/pos-settings/pospaymentmodes"}}},[e._v("\n            "+e._s(e.lang.payment)+"\n          ")])],1):e._e(),e._v(" "),e.checkCustomPermission("settings/posdevices","index")?s("li",[s("router-link",{attrs:{to:{path:"/pos-settings/posdevice"}}},[e._v("\n            "+e._s(e.lang.station)+"\n          ")])],1):e._e(),e._v(" "),e.checkCustomPermission("settings/posreceiptnote","index")?s("li",[s("router-link",{attrs:{to:{path:"/pos-settings/posreceiptnote"}}},[e._v("\n            "+e._s(e.$lang[e.langId].receipt_note)+"\n          ")])],1):e._e(),e._v(" "),e.checkCustomPermission("settings/posemailreport","index")?s("li",{class:[e.methodRouteIsHiddenSubMenuClass("/pos-settings/posemailreport")]},[s("router-link",{attrs:{to:{path:"/pos-settings/posemailreport"}}},[e._v("\n            "+e._s(e.lang.email)+" "+e._s(e.lang.reports)+"\n          ")])],1):e._e(),e._v(" "),e.checkCustomPermission("settings/pospasskey","index")?s("li",[s("router-link",{attrs:{to:{path:"/pos-settings/pospasskey"}}},[e._v("\n            "+e._s(e.lang.pos_pass_key)+"\n          ")])],1):e._e(),e._v(" "),e.checkCustomPermission("settings/posextsetting","index")?s("li",[s("router-link",{attrs:{to:{path:"/pos-settings/posextsetting"}}},[e._v("\n            "+e._s(e.lang.pos_ext_settings)+"\n          ")])],1):e._e(),e._v(" "),e.checkCustomPermission("settings/shiftsetting","index")?s("li",[s("router-link",{attrs:{to:{path:"/pos-settings/shiftsetting"}}},[e._v("\n            "+e._s(e.lang.shift)+"\n          ")])],1):e._e(),e._v(" "),e.checkCustomPermission("settings/posstockmode","index")?s("li",[s("router-link",{attrs:{to:{path:"/pos-settings/posstockmode"}}},[e._v("\n            "+e._s(e.lang.check_stock_mode)+"\n          ")])],1):e._e(),e._v(" "),e.checkCustomPermission("settings/shifttime","index")?s("li",[s("router-link",{attrs:{to:{path:"/pos-settings/shifttime"}}},[e._v("\n            "+e._s(e.$lang[e.langId].shift_timing_v1)+"\n          ")])],1):e._e(),e._v(" "),1===e.selectedStore.pos_resto_mode&&e.checkCustomPermission("settings/posqueue","index")?s("li",[s("router-link",{attrs:{to:{path:"/pos-settings/postqueue"}}},[e._v("\n            "+e._s(e.$lang[e.langId].post_queue)+"\n          ")])],1):e._e()])]),e._v(" "),s("div",{staticClass:"tab-content"},[s("router-view")],1)])])},i=[]},m8aI:function(e,t,s){"use strict";s.r(t);var n=s("ZUJq"),i=s.n(n);for(var o in n)["default"].indexOf(o)<0&&function(e){s.d(t,e,function(){return n[e]})}(o);t.default=i.a}}]);