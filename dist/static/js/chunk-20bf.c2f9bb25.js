(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-20bf"],{"/OPk":function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=a("xCek"),n=function(t){return t&&t.__esModule?t:{default:t}}(a("vDqi"));e.default={data:function(){return{loading:!1,disabledSave:!0,data:{}}},computed:{selectedStore:function(){return this.$store.getters.selectedStore},token:function(){return this.$store.state.user.token},langId:function(){return this.$store.state.userStores.langId},lang:function(){return this.$store.state.userStores.lang}},watch:{"$store.getters.selectedStore":function(){this.getData()},data:{handler:function(t){t.fb_app_secret&&""!==t.fb_app_secret&&t.fb_app_id&&""!==t.fb_app_id?this.disabledSave=!1:this.disabledSave=!0},deep:!0}},methods:{getData:function(){var t=this;this.loading=!0;var e={Authorization:"Bearer "+this.token.access_token};(0,n.default)({method:"GET",url:(0,s.baseApi)(this.selectedStore.url_id,this.langId,"facebooksso"),params:this.params,headers:e}).then(function(e){t.data=e.data.data,t.loading=!1}).catch(function(e){t.loading=!1,t.$notify({type:"warning",title:"Error",message:e.response.data.error.error})})},save:function(t){var e=this;this.loading=!0,this.disabledSave=!0;var a={Authorization:"Bearer "+this.token.access_token};(0,n.default)({method:"POST",url:(0,s.baseApi)(this.selectedStore.url_id,this.langId,"facebooksso"),data:t,headers:a}).then(function(t){e.data=t.data.data,e.loading=!1,e.disabledSave=!1,e.$message({type:"success",message:"Saved"})}).catch(function(t){e.loading=!1,e.disabledSave=!1,e.$notify({type:"warning",title:"Error",message:t.response.data.error.error})})}},mounted:function(){this.getData()}}},"60l3":function(t,e,a){"use strict";a.r(e);var s=a("FfAQ"),n=a("r+xx");for(var i in n)["default"].indexOf(i)<0&&function(t){a.d(e,t,function(){return n[t]})}(i);var o=a("KHd+"),r=Object(o.a)(n.default,s.a,s.b,!1,null,null,null);r.options.__file="Index.vue",e.default=r.exports},FfAQ:function(t,e,a){"use strict";a.d(e,"a",function(){return s}),a.d(e,"b",function(){return n});var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}]},[a("el-card",{staticClass:"box-card"},[a("div",{attrs:{slot:"header"},slot:"header"},[a("div",{staticClass:"row"},[a("div",{staticClass:"col-md-4"},[a("h4",[t._v(t._s(t.$lang[t.langId].facebook_login))])]),t._v(" "),a("div",{staticClass:"col-md-8 text-right"},[a("button-action-authenticated",{attrs:{permission:["website/facebooksso","edit"],type:"success",icon:"el-icon-check"},on:{click:function(e){return t.save(t.data)}}},[t._v("\n            "+t._s(t.lang.save)+"\n          ")])],1)])]),t._v(" "),a("div",{staticClass:"card-body"},[a("el-form",{attrs:{"label-width":"120px"},model:{value:t.data,callback:function(e){t.data=e},expression:"data"}},[a("el-form-item",{attrs:{label:this.$lang[t.langId].app_id}},[a("el-input",{attrs:{type:"text"},model:{value:t.data.fb_app_id,callback:function(e){t.$set(t.data,"fb_app_id",e)},expression:"data.fb_app_id"}}),t._v(" "),a("p",{staticClass:"size-12 input-desc oldgrey"},[t._v("\n            "+t._s(t.lang.info_facebook_sso)+"\n          ")])],1),t._v(" "),a("el-form-item",{attrs:{label:this.$lang[t.langId].app_secret}},[a("el-input",{attrs:{type:"text"},model:{value:t.data.fb_app_secret,callback:function(e){t.$set(t.data,"fb_app_secret",e)},expression:"data.fb_app_secret"}})],1)],1)],1)]),t._v(" "),a("el-card",{staticClass:"box-card"},[a("div",{attrs:{slot:"header"},slot:"header"},[a("span",[t._v(t._s(this.$lang[t.langId].how_to))])]),t._v(" "),a("div",{staticClass:"card-body"},[a("div",[a("el-steps",{attrs:{direction:"vertical"}},[a("el-step",{attrs:{title:this.$lang[t.langId].login_facebook,status:"process"}},[a("div",{attrs:{slot:"description"},slot:"description"},[t._v("\n              "+t._s(this.$lang[t.langId].step_1_facebook_login)+"\n            ")])]),t._v(" "),a("el-step",{attrs:{title:this.$lang[t.langId].go_to_facebook_dev,status:"process"}},[a("div",{attrs:{slot:"description"},slot:"description"},[a("ol",[a("li",[t._v(t._s(this.$lang[t.langId].go_to_facebook_dev)+", https://developers.facebook.com/.")]),t._v(" "),a("li",[t._v(t._s(this.$lang[t.langId].step_2_facebook_login))])])])]),t._v(" "),a("el-step",{attrs:{title:this.$lang[t.langId].change_logo_facebook,status:"process"}},[a("div",{attrs:{slot:"description"},slot:"description"},[t._v("\n              "+t._s(this.$lang[t.langId].step_9_facebook_page)+"\n              "),a("p",[a("img",{attrs:{src:"https://d2cp4rzo38etyi.cloudfront.net/admin/img/admin/help_fb_page_view.png"}})])])])],1)],1)])])],1)},n=[]},"r+xx":function(t,e,a){"use strict";a.r(e);var s=a("/OPk"),n=a.n(s);for(var i in s)["default"].indexOf(i)<0&&function(t){a.d(e,t,function(){return s[t]})}(i);e.default=n.a}}]);