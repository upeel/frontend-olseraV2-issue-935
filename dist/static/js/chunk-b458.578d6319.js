(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-b458"],{"1MUu":function(t,e,a){"use strict";a.r(e);var s=a("DDS1"),i=a("2zjJ");for(var n in i)["default"].indexOf(n)<0&&function(t){a.d(e,t,function(){return i[t]})}(n);var o=a("KHd+"),l=Object(o.a)(i.default,s.a,s.b,!1,null,null,null);l.options.__file="index.vue",e.default=l.exports},"2zjJ":function(t,e,a){"use strict";a.r(e);var s=a("PLUn"),i=a.n(s);for(var n in s)["default"].indexOf(n)<0&&function(t){a.d(e,t,function(){return s[t]})}(n);e.default=i.a},DDS1:function(t,e,a){"use strict";a.d(e,"a",function(){return s}),a.d(e,"b",function(){return i});var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("div",{staticClass:"content-wrapper"},[a("section",{staticClass:"content income-expense"},[a("el-row",{attrs:{gutter:10}},[a("el-col",{attrs:{md:11}},[a("el-card",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],staticClass:"box-card"},[a("div",{attrs:{slot:"header"},slot:"header"},[t._v("\n              "+t._s(t.rootLang.appearances)+"\n            ")]),t._v(" "),a("div",{staticClass:"card-body"},[a("div",{staticClass:"flex-container"},[a("div",{staticClass:"mr-8",staticStyle:{"flex-shrink":"0"}},[t.data.logo?a("img",{staticClass:"img-80 img-circle",attrs:{src:t.data.logo},on:{click:function(e){return t.editAppearances("logo")}}}):t._e()]),t._v(" "),a("div",{staticClass:"mr-8"},[a("h4",{staticClass:"card-sub-body-title"},[t._v(t._s(t.$lang[t.langId].logo))]),t._v(" "),a("div",{staticClass:"size-12 oldgrey"},[t._v(t._s(t.lang.click_to_change_kiosk_logo))])]),t._v(" "),a("div",{staticClass:"text-right"},[a("button-action-authenticated",{staticClass:"btn-plain",attrs:{permission:["settings/kiosk","edit"],type:"primary",size:"mini",icon:"el-icon-edit"},on:{click:function(e){return t.editAppearances("logo")}}},[t._v("\n                    "+t._s(t.lang.edit)+"\n                  ")])],1)]),t._v(" "),a("hr"),t._v(" "),a("div",{staticClass:"flex-container"},[a("div",{staticClass:"mr-8",staticStyle:{"flex-shrink":"0"}},[t.data.banner?a("img",{staticClass:"img-80 img-circle",attrs:{src:t.data.banner},on:{click:function(e){return t.editAppearances("banner")}}}):t._e()]),t._v(" "),a("div",{staticClass:"mr-8"},[a("h4",{staticClass:"card-sub-body-title"},[t._v(t._s(t.$lang[t.langId].banner))]),t._v(" "),a("div",{staticClass:"size-12 oldgrey"},[t._v(t._s(t.lang.click_to_change_kiosk_banner))])]),t._v(" "),a("div",{staticClass:"text-right"},[a("button-action-authenticated",{staticClass:"btn-plain",attrs:{permission:["settings/kiosk","edit"],type:"primary",size:"mini",icon:"el-icon-edit"},on:{click:function(e){return t.editAppearances("banner")}}},[t._v("\n                    "+t._s(t.lang.edit)+"\n                  ")])],1)])])])],1),t._v(" "),a("el-col",{attrs:{md:13}},[a("el-card",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],staticClass:"box-card"},[a("div",{attrs:{slot:"header"},slot:"header"},[t._v("\n              "+t._s(t.lang.settings)+"\n            ")]),t._v(" "),a("div",{staticClass:"card-body"},[a("el-form",{attrs:{model:t.data,"label-position":"right","label-width":"230px"}},[a("el-form-item",{attrs:{label:t.lang.kiosk_on_start_select_dine_in,prop:"on_start_select_dine_in"}},[a("el-switch",{attrs:{disabled:!t.checkCustomPermission("settings/kiosk","edit"),"active-value":1,"inactive-value":0},on:{change:t.update},model:{value:t.data.on_start_select_dine_in,callback:function(e){t.$set(t.data,"on_start_select_dine_in",e)},expression:"data.on_start_select_dine_in"}}),t._v(" "),a("p",{staticClass:"size-12 oldgrey line-height-1"},[t._v(t._s(t.lang.info_kiosk_on_start_select_dine_in))])],1),t._v(" "),a("el-form-item",{attrs:{label:t.lang.kiosk_on_start_select_table,prop:"on_start_select_table"}},[a("el-switch",{attrs:{disabled:!t.checkCustomPermission("settings/kiosk","edit"),"active-value":1,"inactive-value":0},on:{change:t.update},model:{value:t.data.on_start_select_table,callback:function(e){t.$set(t.data,"on_start_select_table",e)},expression:"data.on_start_select_table"}}),t._v(" "),a("p",{staticClass:"size-12 oldgrey line-height-1"},[t._v(t._s(t.lang.info_kiosk_on_start_select_table))])],1),t._v(" "),a("el-form-item",{attrs:{label:t.lang.kiosk_on_start_input_total_guest,prop:"on_start_input_total_guest"}},[a("el-switch",{attrs:{disabled:!t.checkCustomPermission("settings/kiosk","edit"),"active-value":1,"inactive-value":0},on:{change:t.update},model:{value:t.data.on_start_input_total_guest,callback:function(e){t.$set(t.data,"on_start_input_total_guest",e)},expression:"data.on_start_input_total_guest"}}),t._v(" "),a("p",{staticClass:"size-12 oldgrey line-height-1"},[t._v(t._s(t.lang.info_kiosk_on_start_input_total_guest))])],1),t._v(" "),a("el-form-item",{attrs:{label:t.lang.kiosk_on_start_input_customer,prop:"on_start_input_customer"}},[a("el-switch",{attrs:{disabled:!t.checkCustomPermission("settings/kiosk","edit"),"active-value":1,"inactive-value":0},on:{change:t.update},model:{value:t.data.on_start_input_customer,callback:function(e){t.$set(t.data,"on_start_input_customer",e)},expression:"data.on_start_input_customer"}}),t._v(" "),a("p",{staticClass:"size-12 oldgrey line-height-1"},[t._v(t._s(t.lang.info_kiosk_on_start_input_customer))])],1),t._v(" "),a("el-form-item",{attrs:{label:t.lang.kiosk_on_start_input_initial,prop:"on_start_input_initial"}},[a("el-switch",{attrs:{disabled:!t.checkCustomPermission("settings/kiosk","edit"),"active-value":1,"inactive-value":0},on:{change:t.update},model:{value:t.data.on_start_input_initial,callback:function(e){t.$set(t.data,"on_start_input_initial",e)},expression:"data.on_start_input_initial"}}),t._v(" "),a("p",{staticClass:"size-12 oldgrey line-height-1"},[t._v(t._s(t.lang.info_kiosk_on_start_input_initial))])],1)],1)],1)])],1)],1)],1)]),t._v(" "),a("el-dialog",{attrs:{title:t.lang.update_logo,visible:t.dialogEditUploadLogo},on:{"update:visible":function(e){t.dialogEditUploadLogo=e}}},[a("el-row",{attrs:{gutter:10}},[a("el-col",{attrs:{md:8}},[a("p",[a("strong",[t._v(t._s(t.lang.description))])]),t._v(" "),a("p",{staticClass:"size-12"},[t._v(t._s(t.lang.click_to_change_your_logo))])]),t._v(" "),a("el-col",{attrs:{md:16}},[a("el-upload",{staticStyle:{width:"100%","max-width":"100%"},attrs:{drag:"",action:t.urlUploadLogo,"file-list":t.fileList,headers:t.headers,"on-error":t.handleUploadFailed,"on-success":t.handleUploadSuccess,"before-upload":t.beforeUpload,data:t.uploadData}},[a("i",{staticClass:"el-icon-upload"}),t._v(" "),a("div",{staticClass:"el-upload__text"},[t._v(t._s(this.$lang[t.langId].drop_file_or_click))])])],1)],1)],1),t._v(" "),a("el-dialog",{attrs:{title:t.lang.change_banner,visible:t.dialogEditUploadBanner},on:{"update:visible":function(e){t.dialogEditUploadBanner=e}}},[a("el-row",{attrs:{gutter:10}},[a("el-col",{attrs:{md:8}},[a("p",[a("strong",[t._v(t._s(t.lang.description))])]),t._v(" "),a("p",{staticClass:"size-12"},[t._v(t._s(t.lang.click_to_change_kiosk_banner))])]),t._v(" "),a("el-col",{attrs:{md:16}},[a("el-upload",{staticStyle:{width:"100%","max-width":"100%"},attrs:{drag:"",action:t.urlUploadBanner,"file-list":t.fileList,headers:t.headers,"on-error":t.handleUploadFailed,"on-success":t.handleUploadSuccess,"before-upload":t.beforeUpload,data:t.uploadData}},[a("i",{staticClass:"el-icon-upload"}),t._v(" "),a("div",{staticClass:"el-upload__text"},[t._v(t._s(this.$lang[t.langId].drop_file_or_click))])])],1)],1)],1)],1)},i=[]},PLUn:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=a("xCek"),i=function(t){return t&&t.__esModule?t:{default:t}}(a("vDqi")),n=a("6y4V");e.default={mixins:[n.checkCustomPermission],data:function(){return{loading:!0,data:{},dialogEditUploadLogo:!1,dialogEditUploadBanner:!1,fileList:[]}},computed:{selectedStore:function(){return this.$store.getters.selectedStore},token:function(){return this.$store.state.user.token},langId:function(){return this.$store.state.userStores.langId},lang:function(){return this.$store.state.userStores.lang},rootLang:function(){return this.$lang[this.$store.state.userStores.langId]},urlUploadLogo:function(){return(0,s.baseApi)(this.selectedStore.url_id,this.langId,"kiosk/uploadlogo")},urlUploadBanner:function(){return(0,s.baseApi)(this.selectedStore.url_id,this.langId,"kiosk/uploadbanner")},headers:function(){return{Authorization:"Bearer "+this.token.access_token}},uploadData:function(){return{id:this.data.id}}},watch:{"$store.getters.selectedStore":function(t){this.getData()}},methods:{getData:function(){var t=this;this.loading=!0;var e={Authorization:"Bearer "+this.token.access_token};(0,i.default)({method:"GET",url:(0,s.baseApi)(this.selectedStore.url_id,this.langId,"kiosk"),params:this.params,headers:e}).then(function(e){t.data=e.data.data,t.loading=!1}).catch(function(e){t.$notify({type:"warning",title:e.response.data.error.message,message:e.response.data.error.error}),t.loading=!1})},editAppearances:function(t){this.checkCustomPermission("settings/kiosk","edit")&&("logo"===t?this.dialogEditUploadLogo=!0:"banner"===t&&(this.dialogEditUploadBanner=!0))},beforeUpload:function(t){var e="image/jpeg"===t.type,a="image/png"===t.type;return e||a||this.$message.error(this.$lang[this.langId].error_upload_photo),e||a},handleUploadFailed:function(t){this.$notify({type:"warning",title:"Failed",message:t}),this.loading=!1,this.disabledButton=!1},handleUploadSuccess:function(t){this.dialogEditUploadLogo=!1,this.dialogEditUploadBanner=!1,this.getData(),this.$message({type:"success",message:"Success"})},update:function(){var t=this;this.loading=!0;var e={Authorization:"Bearer "+this.token.access_token};(0,i.default)({method:"POST",url:(0,s.baseApi)(this.selectedStore.url_id,this.langId,"kiosk/storeupdate"),headers:e,data:this.data}).then(function(e){t.data=e.data.data,t.loading=!1,t.$message({type:"success",message:"saved"})}).catch(function(e){t.$notify({type:"warning",title:e.response.data.error.message,message:e.response.data.error.error}),t.loading=!1})}},mounted:function(){this.getData()}}}}]);