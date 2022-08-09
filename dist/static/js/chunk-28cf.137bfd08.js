(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-28cf"],{"2hOu":function(t,e,a){"use strict";a.r(e);var n=a("7y+z"),s=a.n(n);for(var i in n)["default"].indexOf(i)<0&&function(t){a.d(e,t,function(){return n[t]})}(i);e.default=s.a},"7y+z":function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=a("xCek"),s=function(t){return t&&t.__esModule?t:{default:t}}(a("vDqi"));e.default={data:function(){return{loading:!1,disabledSave:!0,data:{}}},computed:{selectedStore:function(){return this.$store.getters.selectedStore},token:function(){return this.$store.state.user.token},langId:function(){return this.$store.state.userStores.langId},lang:function(){return this.$store.state.userStores.lang}},watch:{"$store.getters.selectedStore":function(){this.getData()},data:{handler:function(t){t.ext_domain&&""!==t.ext_domain?this.disabledSave=!1:this.disabledSave=!0},deep:!0}},methods:{getData:function(){var t=this;this.loading=!0,this.disabledSave=!0;var e={Authorization:"Bearer "+this.token.access_token};(0,s.default)({method:"GET",url:(0,n.baseApi)(this.selectedStore.url_id,this.langId,"usemydomain"),params:this.params,headers:e}).then(function(e){t.data=e.data.data,t.disabledSave=!1,t.loading=!1}).catch(function(e){t.loading=!1,t.disabledSave=!1,t.$notify({type:"warning",title:"Error",message:e.response.data.error.error})})},save:function(t){var e=this;this.loading=!0,this.disabledSave=!0;var a={Authorization:"Bearer "+this.token.access_token};(0,s.default)({method:"POST",url:(0,n.baseApi)(this.selectedStore.url_id,this.langId,"usemydomain"),data:t,headers:a}).then(function(t){e.data=t.data.data,e.loading=!1,e.disabledSave=!1,e.$notify({type:"success",message:"Success"})}).catch(function(t){e.loading=!1,e.disabledSave=!1,e.$notify({type:"warning",title:"Error",message:t.response.data.error.error})})},deleteInput:function(){this.save(this.data)}},mounted:function(){this.getData()}}},UmkQ:function(t,e,a){"use strict";a.r(e);var n=a("o0UQ"),s=a("2hOu");for(var i in s)["default"].indexOf(i)<0&&function(t){a.d(e,t,function(){return s[t]})}(i);var o=a("KHd+"),d=Object(o.a)(s.default,n.a,n.b,!1,null,null,null);d.options.__file="Index.vue",e.default=d.exports},o0UQ:function(t,e,a){"use strict";a.d(e,"a",function(){return n}),a.d(e,"b",function(){return s});var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("el-row",{attrs:{gutter:10}},[a("el-col",{attrs:{md:18}},[a("el-card",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],staticClass:"box-card"},[a("div",{attrs:{slot:"header"},slot:"header"},[a("div",{staticClass:"row"},[a("div",{staticClass:"col-md-4"},[a("h4",[t._v(t._s(t.lang.claim_my_domain))])]),t._v(" "),a("div",{staticClass:"col-md-8 text-right"},[a("button-action-authenticated",{attrs:{permission:["website/usemydomain","edit"],type:"success",disabled:t.disabledSave,icon:"el-icon-check"},on:{click:function(e){return t.save(t.data)}}},[t._v("\n              "+t._s(t.lang.save)+"\n            ")])],1)])]),t._v(" "),a("div",{staticClass:"card-body"},[a("el-form",{attrs:{"label-width":"120px"},model:{value:t.data,callback:function(e){t.data=e},expression:"data"}},[a("el-form-item",{attrs:{label:t.lang.custom_domain}},[a("el-input",{attrs:{type:"text",placeholder:t.$lang[t.langId].input_domain,clearable:""},on:{clear:t.deleteInput},model:{value:t.data.ext_domain,callback:function(e){t.$set(t.data,"ext_domain",e)},expression:"data.ext_domain"}})],1)],1)],1)]),t._v(" "),a("el-card",{staticClass:"box-card"},[a("div",{attrs:{slot:"header"},slot:"header"},[a("span",[t._v(t._s(t.$lang[t.langId].how_to))])]),t._v(" "),a("div",{staticClass:"card-body"},[a("div",[a("el-steps",{attrs:{direction:"vertical"}},[a("el-step",{attrs:{title:"Beli Domain",status:"process"}},[a("div",{attrs:{slot:"description"},slot:"description"},[t._v("\n                "+t._s(t.$lang[t.langId].info_buy_domain)),a("br"),t._v(" "),a("ol",[a("li",[a("a",{attrs:{href:"https://www.namecheap.com/",target:"_blank"}},[t._v("https://www.namecheap.com/")])]),t._v(" "),a("li",[a("a",{attrs:{href:"http://www.name.com/",target:"_blank"}},[t._v("http://www.name.com/")])]),t._v(" "),a("li",[a("a",{attrs:{href:"http://www.1and1.com/",target:"_blank"}},[t._v("http://www.1and1.com/")])])])])]),t._v(" "),a("el-step",{attrs:{title:t.$lang[t.langId].point_domain_to_store,status:"process"}},[a("div",{attrs:{slot:"description"},slot:"description"},[t._v("\n                "+t._s(t.$lang[t.langId].info_point_domain)),a("br"),t._v("\n                "+t._s(t.$lang[t.langId].setup_cname)),a("br"),t._v("\n                "+t._s(t.$lang[t.langId].info_setup_dns)),a("br"),t._v(" "),a("table",{staticClass:"table table-striped"},[a("thead",[a("tr",[a("th",[t._v("Type")]),t._v(" "),a("th",[t._v("Host")]),t._v(" "),a("th",[t._v("Answer")]),t._v(" "),a("th",[t._v("TTL")])])]),t._v(" "),a("tbody",[a("tr",[a("td",[t._v("CNAME")]),t._v(" "),a("td",[t._v("www.[your-domain-name].com")]),t._v(" "),a("td",[t._v("[your-store-name].myolsera.com")]),t._v(" "),a("td",[t._v("300")])]),t._v(" "),a("tr",[a("td",[t._v("A record")]),t._v(" "),a("td",[t._v("@")]),t._v(" "),a("td",[t._v("52.76.158.20")]),t._v(" "),a("td",[t._v("300")])])])])])]),t._v(" "),a("el-step",{attrs:{title:t.$lang[t.langId].claim_domain_in_store,status:"process"}},[a("div",{attrs:{slot:"description"},slot:"description"},[t._v("\n                "+t._s(t.$lang[t.langId].add_cname_dns)+"\n              ")])])],1)],1)])])],1)],1)},s=[]}}]);