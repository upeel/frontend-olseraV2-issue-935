(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-da29"],{"9YeL":function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=a("xCek"),n=function(t){return t&&t.__esModule?t:{default:t}}(a("vDqi"));e.default={data:function(){return{loading:!1,data:[]}},computed:{selectedStore:function(){return this.$store.getters.selectedStore},token:function(){return this.$store.state.user.token},langId:function(){return this.$store.state.userStores.langId},lang:function(){return this.$store.state.userStores.lang}},watch:{"$store.getters.selectedStore":function(){this.getData()}},methods:{getData:function(){var t=this;this.loading=!0;var e={Authorization:"Bearer "+this.token.access_token};(0,n.default)({method:"GET",url:(0,s.baseApi)(this.selectedStore.url_id,this.langId,"fbpage"),params:this.params,headers:e}).then(function(e){t.data=e.data.data,t.loading=!1}).catch(function(){t.loading=!1})},setup:function(t){window.location="https://www.facebook.com/dialog/pagetab?app_id=318795654947400&redirect_uri=https%3A%2F%2Ffbstore.myolsera.com%2Fadd%2F18%2Fdemo"}},mounted:function(){this.getData()}}},ZlIZ:function(t,e,a){"use strict";a.d(e,"a",function(){return s}),a.d(e,"b",function(){return n});var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}]},[a("el-card",{staticClass:"box-card"},[a("div",{attrs:{slot:"header"},slot:"header"},[a("div",{staticClass:"row"},[a("div",{staticClass:"col-md-4"},[a("h4",[t._v(t._s(t.lang.facebook_store))])]),t._v(" "),a("div",{staticClass:"col-md-8 text-right"},[a("button-action-authenticated",{attrs:{permission:["website/fbstore","edit"],type:"success",icon:"el-icon-setting"},on:{click:t.setup}},[t._v("\n            "+t._s(t.lang.setup)+"\n          ")])],1)])]),t._v(" "),a("div",{staticClass:"card-body"},[a("el-table",{attrs:{data:t.data,stripe:""}},[a("el-table-column",{attrs:{prop:"page_id",label:t.$lang[t.langId].page_id,width:"180"}}),t._v(" "),a("el-table-column",{attrs:{prop:"created_time",label:t.lang.created_time}})],1)],1)]),t._v(" "),a("el-card",{staticClass:"box-card"},[a("div",{attrs:{slot:"header"},slot:"header"},[a("span",[t._v(t._s(t.$lang[t.langId].how_to))])]),t._v(" "),a("div",{staticClass:"card-body"},[a("div",[a("el-steps",{attrs:{direction:"vertical"}},[a("el-step",{attrs:{title:t.$lang[t.langId].create_facebook_page,status:"process"}},[a("div",{attrs:{slot:"description"},slot:"description"},[a("ol",[a("li",[t._v(t._s(t.$lang[t.langId].step_1_facebook_page)+"\n                  "),a("p",[a("img",{attrs:{src:"https://d2cp4rzo38etyi.cloudfront.net/admin/img/admin/help_fb_page.png"}})])]),t._v(" "),a("li",[t._v(t._s(t.$lang[t.langId].step_2_facebook_page))]),t._v(" "),a("li",[t._v(t._s(t.$lang[t.langId].step_3_facebook_page))]),t._v(" "),a("li",[t._v(t._s(t.$lang[t.langId].step_4_facebook_page))]),t._v(" "),a("li",[t._v(t._s(t.$lang[t.langId].step_5_facebook_page))])])])]),t._v(" "),a("el-step",{attrs:{title:t.$lang[t.langId].add_store_to_facebook,status:"process"}},[a("div",{attrs:{slot:"description"},slot:"description"},[a("ol",[a("li",[t._v(t._s(t.$lang[t.langId].step_6_facebook_page))]),t._v(" "),a("li",[t._v(t._s(t.$lang[t.langId].step_7_facebook_page)+"\n                  "),a("p",[a("img",{attrs:{src:"https://d2cp4rzo38etyi.cloudfront.net/admin/img/admin/help_fb_page_add.png"}})])]),t._v(" "),a("li",[t._v(t._s(t.$lang[t.langId].step_8_facebook_page))])])])]),t._v(" "),a("el-step",{attrs:{title:t.$lang[t.langId].change_logo_facebook,status:"process"}},[a("div",{attrs:{slot:"description"},slot:"description"},[t._v("\n              "+t._s(t.$lang[t.langId].step_9_facebook_page)+"\n              "),a("p",[a("img",{attrs:{src:"https://d2cp4rzo38etyi.cloudfront.net/admin/img/admin/help_fb_page_view.png"}})])])])],1)],1)])])],1)},n=[]},e320:function(t,e,a){"use strict";a.r(e);var s=a("9YeL"),n=a.n(s);for(var o in s)["default"].indexOf(o)<0&&function(t){a.d(e,t,function(){return s[t]})}(o);e.default=n.a},hDTG:function(t,e,a){"use strict";a.r(e);var s=a("ZlIZ"),n=a("e320");for(var o in n)["default"].indexOf(o)<0&&function(t){a.d(e,t,function(){return n[t]})}(o);var i=a("KHd+"),l=Object(i.a)(n.default,s.a,s.b,!1,null,null,null);l.options.__file="Index.vue",e.default=l.exports}}]);