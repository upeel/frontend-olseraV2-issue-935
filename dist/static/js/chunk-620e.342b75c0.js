(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-620e"],{"8CuY":function(e,t,s){"use strict";s.d(t,"a",function(){return n}),s.d(t,"b",function(){return a});var n=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"content-wrapper"},[s("section",{staticClass:"content sales-list"},[s("div",{staticClass:"panel tab-list"},[s("ul",{staticClass:"nav-tabs-shop-devin",attrs:{role:"tablist"}},[1!==e.userRole.is_pos_only&&e.checkCustomPermission("catalog/featured","index")?s("li",{class:[e.methodRouteIsHiddenSubMenuClass("/specialtype/featured")]},[s("router-link",{attrs:{to:{path:"/specialtype/featured"}}},[e._v("\n            "+e._s(e.lang.featured)+"\n          ")])],1):e._e(),e._v(" "),1!==e.userRole.is_pos_only&&e.checkCustomPermission("catalog/newrelease","index")?s("li",{class:[e.methodRouteIsHiddenSubMenuClass("/specialtype/newrelease")]},[s("router-link",{attrs:{to:{path:"/specialtype/newrelease"}}},[e._v("\n            "+e._s(e.lang.new_release)+"\n          ")])],1):e._e(),e._v(" "),1!==e.userRole.is_pos_only&&e.checkCustomPermission("catalog/sale","index")?s("li",{class:[e.methodRouteIsHiddenSubMenuClass("/specialtype/sale")]},[s("router-link",{attrs:{to:{path:"/specialtype/sale"}}},[e._v("\n            "+e._s(e.lang.sale)+"\n          ")])],1):e._e(),e._v(" "),e.checkCustomPermission("catalog/popular","index")?s("li",{class:[e.methodRouteIsHiddenSubMenuClass("/specialtype/popular")]},[s("router-link",{attrs:{to:{path:"/specialtype/popular"}}},[e._v("\n            "+e._s(e.lang.popular)+"\n          ")])],1):e._e(),e._v(" "),1!==e.userRole.is_pos_only&&e.checkCustomPermission("catalog/outstock","index")?s("li",{class:[e.methodRouteIsHiddenSubMenuClass("/specialtype/outstock")]},[s("router-link",{attrs:{to:{path:"/specialtype/outstock"}}},[e._v("\n            "+e._s(e.lang.out_of_stock)+"\n          ")])],1):e._e(),e._v(" "),1!==e.userRole.is_pos_only&&e.checkCustomPermission("catalog/preorder","index")?s("li",{class:[e.methodRouteIsHiddenSubMenuClass("/specialtype/preorder")]},[s("router-link",{attrs:{to:{path:"/specialtype/preorder"}}},[e._v("\n            "+e._s(e.lang.preorder)+"\n          ")])],1):e._e(),e._v(" "),e.checkCustomPermission("catalog/rawmaterial","index")?s("li",{class:[e.methodRouteIsHiddenSubMenuClass("/specialtype/rawmaterial")]},[s("router-link",{attrs:{to:{path:"/specialtype/rawmaterial"}}},[e._v("\n            "+e._s(e.$lang[e.langId].raw_material)+"\n          ")])],1):e._e()])]),e._v(" "),s("div",{staticClass:"tab-content"},[s("router-view")],1)])])},a=[]},Ccnf:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.mixinHiddenFeatureByPlanType=void 0;var n=s("rOiX"),a={computed:{planType:function(){return this.$store.getters.selectedStore.plan_type_id},selectedStore:function(){return this.$store.getters.selectedStore}},watch:{planType:{handler:function(e){this.resetLock()}}},mounted:function(){this.resetLock()},destroyed:function(){this.resetLock()},methods:{precheckByUrlId:function(e){return n.featureAccessByUrlIds[this.selectedStore.url_id]&&n.featureAccessByUrlIds[this.selectedStore.url_id].includes(e)},resetLock:function(){this.destoryIconSubmenuDisabled();var e=document.querySelectorAll(".submenu-disabled a, .button-plan-type-disabled");e&&e.length&&e.forEach(function(e){e.insertAdjacentHTML("beforeend",'<svg aria-hidden="true" class="ml-10 svg-icon icon-submenu-disabled"><use xlink:href="#icon-lock"></use></svg>')})},destoryIconSubmenuDisabled:function(){var e=document.querySelectorAll(".panel.tab-list .icon-submenu-disabled, .button-plan-type-disabled .icon-submenu-disabled");e&&e.length&&e.forEach(function(e){e.remove()})},methodRouteIsHidden:function(e){return this.$isHiddenByPlanType(this.planType,e)},methodFeatureNameIsHidden:function(e){return this.$isFeatureNameHiddenByPlanType(this.planType,e)},methodFeatureIsHiddenCellTable:function(e){return this.handlerClassName(e,"methodFeatureNameIsHidden",["celltable"])},methodRouteIsHiddenSidebarMenuClass:function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return!this.precheckByUrlId(e)&&this.handlerClassName(e,"methodRouteIsHidden",["sidebarmenu"],t)},methodRouteIsHiddenSubMenuClass:function(e){return!this.precheckByUrlId(e)&&this.handlerClassName(e,"methodRouteIsHidden",["submenu"])},methodRouteIsHiddenButtonClass:function(e){return this.handlerClassName(e,"methodFeatureNameIsHidden",["button","button-plan-type"])},handlerClassName:function(e,t,s){var n=arguments.length>3&&void 0!==arguments[3]&&arguments[3],a="-enabled";this[t](e)&&!n&&(a="-disabled");var o=[];return s.map(function(e){o.push(e+a)}),o.join(" ")}}};t.mixinHiddenFeatureByPlanType=a},GQe3:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=s("Ccnf"),a=s("6y4V");t.default={mixins:[n.mixinHiddenFeatureByPlanType,a.checkCustomPermission],computed:{langId:function(){return this.$store.state.userStores.langId},lang:function(){return this.$store.state.userStores.lang},userRole:function(){var e=this.$store.getters.selectedStore;return{role_id:e.role_id,role_name:e.role_name,is_pos_only:e.is_pos_only,is_mobile:e.is_mobile}}},mounted:function(){1===this.userRole.is_pos_only&&this.$router.push("/specialtype/popular")}}},TKeO:function(e,t,s){"use strict";s.r(t);var n=s("8CuY"),a=s("tk/o");for(var o in a)["default"].indexOf(o)<0&&function(e){s.d(t,e,function(){return a[e]})}(o);var i=s("KHd+"),r=Object(i.a)(a.default,n.a,n.b,!1,null,null,null);r.options.__file="Index.vue",t.default=r.exports},"tk/o":function(e,t,s){"use strict";s.r(t);var n=s("GQe3"),a=s.n(n);for(var o in n)["default"].indexOf(o)<0&&function(e){s.d(t,e,function(){return n[e]})}(o);t.default=a.a}}]);