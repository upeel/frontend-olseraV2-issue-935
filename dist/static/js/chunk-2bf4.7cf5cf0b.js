(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-2bf4"],{"+bpC":function(e,t,a){"use strict";a.r(t);var s=a("6bCz"),i=a("M9F1");for(var n in i)["default"].indexOf(n)<0&&function(e){a.d(t,e,function(){return i[e]})}(n);var o=a("KHd+"),l=Object(o.a)(i.default,s.a,s.b,!1,null,null,null);l.options.__file="Index.vue",t.default=l.exports},"6bCz":function(e,t,a){"use strict";a.d(t,"a",function(){return s}),a.d(t,"b",function(){return i});var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}]},[a("el-row",{attrs:{gutter:10}},[a("el-col",{attrs:{md:24}},[a("el-card",{staticClass:"box-card"},[a("div",{attrs:{slot:"header"},slot:"header"},[a("h4",[e._v(e._s(e.lang.email)+" "+e._s(e.lang.reports))])]),e._v(" "),a("div",{staticClass:"card-body"},[a("el-alert",{attrs:{title:e.lang.info_for_pos_v2,type:"info","show-icon":""}}),e._v(" "),a("div",{staticStyle:{"margin-bottom":"20px"}}),e._v(" "),a("el-form",{attrs:{"label-width":"120px"},model:{value:e.data,callback:function(t){e.data=t},expression:"data"}},[a("el-form-item",{attrs:{label:e.lang.email_recipients}},e._l(e.emails,function(t){return a("el-tag",{key:t,staticClass:"mr-8",attrs:{closable:e.checkCustomPermission("settings/posemailreport","destroy"),type:"primary",size:"mini"},on:{close:function(a){return e.remove(t)}}},[e._v("\n                "+e._s(t)+"\n              ")])}),1),e._v(" "),e.checkCustomPermission("settings/posemailreport","store")?a("el-form-item",{attrs:{label:e.lang.add+" "+e.lang.email_recipients}},[a("el-input",{attrs:{type:"textarea"},model:{value:e.fresh.email,callback:function(t){e.$set(e.fresh,"email",t)},expression:"fresh.email"}}),e._v(" "),a("p",{staticClass:"size-12 input-desc oldgrey"},[e._v("\n                "+e._s(e.lang.info_report_email_recipients)+",\n                "+e._s(e.lang.multiple_accounts_split_by_comma)+"\n              ")])],1):e._e(),e._v(" "),e.checkCustomPermission("settings/posemailreport","store")?a("el-form-item",[a("div",{staticClass:"flex-container mt-16",staticStyle:{height:"40px"}},[a("div",{staticClass:"full-width"},[e._v("Setiap pagi sistem akan otomatis mengirimkan ringkasan tutup penjualan")]),e._v(" "),a("div",{staticClass:"text-right",staticStyle:{width:"20%"}},[1===e.data.auto_email_closing_sales?a("span",{staticClass:"mr-12"},[e._v(e._s(e.lang.yes))]):a("span",{staticClass:"mr-12"},[e._v(e._s(e.lang.no))])]),e._v(" "),a("div",{staticClass:"flex-container text-right",staticStyle:{width:"15%"}},[a("el-switch",{attrs:{"active-value":1,"inactive-value":0},on:{change:e.updateAutoEmail},model:{value:e.data.auto_email_closing_sales,callback:function(t){e.$set(e.data,"auto_email_closing_sales",t)},expression:"data.auto_email_closing_sales"}})],1)])]):e._e(),e._v(" "),e.checkCustomPermission("settings/posemailreport","store")?a("el-form-item",[a("el-button",{attrs:{type:"success",disabled:e.disabledButton,size:"small",icon:"el-icon-plus"},on:{click:e.add}},[e._v("\n                "+e._s(e.lang.save)+"\n              ")])],1):e._e()],1)],1)])],1)],1)],1)},i=[]},M9F1:function(e,t,a){"use strict";a.r(t);var s=a("qYYC"),i=a.n(s);for(var n in s)["default"].indexOf(n)<0&&function(e){a.d(t,e,function(){return s[e]})}(n);t.default=i.a},qYYC:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=c(a("4d7F")),i=c(a("m1cH")),n=c(a("QbLZ")),o=a("xCek"),l=c(a("vDqi")),r=a("6y4V");function c(e){return e&&e.__esModule?e:{default:e}}t.default={mixins:[r.checkCustomPermission],data:function(){return{loading:!0,data:{},emails:[],fresh:{},disabledButton:!0}},computed:{selectedStore:function(){return this.$store.getters.selectedStore},token:function(){return this.$store.state.user.token},langId:function(){return this.$store.state.userStores.langId},lang:function(){return this.$store.state.userStores.lang}},watch:{"$store.getters.selectedStore":function(){this.getData()},fresh:{handler:function(e){e.email&&""!==e.email&&e.email.length>0?this.disabledButton=!1:this.disabledButton=!0},deep:!0}},methods:{getData:function(){var e=this;this.loading=!0,this.emails=[];var t={Authorization:"Bearer "+this.token.access_token};(0,l.default)({method:"GET",url:(0,o.baseApi)(this.selectedStore.url_id,this.langId,"posemailreport/"),params:this.params,headers:t}).then(function(t){if(e.data=t.data.data,e.data.pos_report_emails){var a=e.data.pos_report_emails;e.emails=a.split(",")}e.loading=!1}).catch(function(t){e.loading=!1,e.data={},e.emails=[],console.log(t),404!==t.response.data.error.status_code&&e.$notify({type:"warning",title:t.response.data.error.message,message:t.response.data.error.error})})},save:function(e,t,a){var s={Authorization:"Bearer "+this.token.access_token};(0,l.default)({method:"POST",url:(0,o.baseApi)(this.selectedStore.url_id,this.langId,"posemailreport/store-update"),headers:s,data:e}).then(function(e){t(e.data.data)}).catch(function(e){a(e.response.data.error)})},add:function(){var e=this;this.loading=!0;var t=(0,n.default)({},this.fresh),a=[];this.emails.length>0?((a=[].concat((0,i.default)(this.emails))).join(","),a=a+","+t.email):a=t.email,console.log(a);var o={email:a,auto_email_closing_sales:this.data.auto_email_closing_sales};new s.default(function(t,a){e.save(o,t,a)}).then(function(){e.fresh={},e.$message({type:"success",message:"success"}),e.getData()}).catch(function(t){e.loading=!1,e.$notify({type:"warning",title:t.message,message:t.error})})},remove:function(e){var t=this;this.loading=!0;var a=[].concat((0,i.default)(this.emails));a.splice(a.indexOf(e),1);var n={email:a.join(","),auto_email_closing_sales:this.data.auto_email_closing_sales};new s.default(function(e,a){t.save(n,e,a)}).then(function(e){t.getData(),t.$message({type:"success",message:"saved"})}).catch(function(e){t.loading=!1,t.$notify({type:"warning",title:e.message,message:e.error})})},updateAutoEmail:function(){var e=this;this.loading=!0;var t={auto_email_closing_sales:this.data.auto_email_closing_sales,email:this.data.pos_report_emails};new s.default(function(a,s){e.save(t,a,s)}).then(function(){e.$message({type:"success",message:"success"}),e.getData()}).catch(function(t){e.loading=!1,e.$notify({type:"warning",title:t.message,message:t.error})})}},mounted:function(){this.getData()}}}}]);