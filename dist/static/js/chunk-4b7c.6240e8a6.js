(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-4b7c"],{"12WP":function(t,e,o){"use strict";o.r(e);var s=o("sH7x"),n=o("ta9E");for(var r in n)["default"].indexOf(r)<0&&function(t){o.d(e,t,function(){return n[t]})}(r);var a=o("KHd+"),i=Object(a.a)(n.default,s.a,s.b,!1,null,null,null);i.options.__file="Index.vue",e.default=i.exports},DChC:function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=r(o("QbLZ")),n=r(o("Ljqw"));function r(t){return t&&t.__esModule?t:{default:t}}var a={mixins:[o("6y4V").checkCustomPermission],computed:{selectedStore:function(){return this.$store.getters.selectedStore},token:function(){return this.$store.state.user.token},langId:function(){return this.$store.state.userStores.langId},lang:function(){return this.$store.state.userStores?this.$store.state.userStores.lang:{}},userRole:function(){var t=this.$store.getters.selectedStore;return{role_id:t.role_id,role_name:t.role_name,is_pos_only:t.is_pos_only,is_mobile:t.is_mobile}},rootLang:function(){return this.$lang[this.langId]},headers:function(){var t=this.$store.getters.token;return this.$store.getters.webviewMode&&(t=this.$store.getters.webviewToken),{Authorization:"Bearer "+t.access_token}},baseURL:function(){return n.default},loggedInUser:function(){return this.$store.state.user.loggedInUser},stageLevel:function(){return"sit"},defaultAccessByStore:function(){return["setdemo1","allinolsera2"]},wejayafoodAccessByStore:function(){return["setdemo1","allinolsera2","ayammrotholpusat","ayammrotholdramaga"]},saveToAllAccessStore:function(){return["setdemo1","allinolsera2","siliwangidutagarden","barokahfrozenfood"]},outlets:function(){var t=[{name:this.$store.state.userStores.lang.all,store_id:0,url_id:"all"}],e=[];return this.$store.getters.stores.map(function(o){e.includes(o.store_id)||o.is_store_active&&(t.push((0,s.default)({},o)),e.push(o.store_id))}),t},tokopediaActiveStore:function(){return this.$store.state.tokopediaActiveStore},shopeeActiveStore:function(){return this.$store.state.shopeeActiveStore}}};e.default=a},hUNi:function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=function(t){return t&&t.__esModule?t:{default:t}}(o("DChC"));e.default={name:"PackageIndex",mixins:[s.default]}},sH7x:function(t,e,o){"use strict";o.d(e,"a",function(){return s}),o.d(e,"b",function(){return n});var s=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticClass:"content-wrapper"},[o("section",{staticClass:"content sales-list"},[o("div",{staticClass:"panel tab-list"},[o("ul",{staticClass:"nav-tabs-shop-devin",attrs:{role:"tablist"}},[t.checkCustomPermission("catalog/products","index")?o("li",[o("router-link",{attrs:{to:{path:"/catalog/product"}}},[t._v("\n            "+t._s(t.lang.product)+"\n          ")])],1):t._e(),t._v(" "),t.checkCustomPermission("catalog/productcombo","index")?o("li",[o("router-link",{attrs:{to:{path:"/catalog/package"}}},[t._v("\n            "+t._s(t.lang.combo)+"\n          ")])],1):t._e(),t._v(" "),1!==t.selectedStore.is_pos_only&&t.checkCustomPermission("catalog/lookbook","index")?o("li",[o("router-link",{attrs:{to:{path:"/catalog/lookbook"}}},[t._v("\n            "+t._s(t.lang.look_book)+"\n          ")])],1):t._e(),t._v(" "),t.checkCustomPermission("catalog/productgroups","index")?o("li",[o("router-link",{attrs:{to:{path:"/catalog/product-group"}}},[t._v("\n            "+t._s(t.lang.group)+"\n          ")])],1):t._e(),t._v(" "),t.checkCustomPermission("catalog/brands","index")?o("li",[o("router-link",{attrs:{to:{path:"/catalog/product-brand"}}},[t._v("\n            "+t._s(t.lang.brand)+"\n          ")])],1):t._e(),t._v(" "),1!==t.selectedStore.is_pos_only&&t.checkCustomPermission("catalog/collections","index")?o("li",[o("router-link",{attrs:{to:{path:"/catalog/collection"}}},[t._v("\n            "+t._s(t.lang.collection)+"\n          ")])],1):t._e(),t._v(" "),1!==t.selectedStore.is_pos_only&&t.checkCustomPermission("catalog/specifications","index")?o("li",[o("router-link",{attrs:{to:{path:"/catalog/specification"}}},[t._v("\n            "+t._s(t.lang.specifications)+"\n          ")])],1):t._e(),t._v(" "),1!==t.selectedStore.is_pos_only&&t.checkCustomPermission("catalog/lookbookgroups","index")?o("li",[o("router-link",{attrs:{to:{path:"/catalog/grouplookbook"}}},[t._v("\n            "+t._s(t.lang.look_book_group)+"\n          ")])],1):t._e(),t._v(" "),t.checkCustomPermission("catalog/prodaddon","index")?o("li",[o("router-link",{attrs:{to:{path:"/catalog/addon"}}},[t._v("\n            "+t._s(t.lang.product_addons)+"\n          ")])],1):t._e()])]),t._v(" "),o("div",{staticClass:"tab-content"},[o("router-view")],1)])])},n=[]},ta9E:function(t,e,o){"use strict";o.r(e);var s=o("hUNi"),n=o.n(s);for(var r in s)["default"].indexOf(r)<0&&function(t){o.d(e,t,function(){return s[t]})}(r);e.default=n.a}}]);