(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-267a"],{"3OPK":function(t,e,a){"use strict";a.r(e);var i=a("fTf8"),s=a("cAlW");for(var n in s)["default"].indexOf(n)<0&&function(t){a.d(e,t,function(){return s[t]})}(n);var o=a("KHd+"),l=Object(o.a)(s.default,i.a,i.b,!1,null,null,null);l.options.__file="Form.vue",e.default=l.exports},"3OgN":function(t,e,a){"use strict";a.r(e);var i=a("COCV"),s=a("rYBE");for(var n in s)["default"].indexOf(n)<0&&function(t){a.d(e,t,function(){return s[t]})}(n);var o=a("KHd+"),l=Object(o.a)(s.default,i.a,i.b,!1,null,null,null);l.options.__file="Index.vue",e.default=l.exports},"66BH":function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=function(t){return t&&t.__esModule?t:{default:t}}(a("QbLZ"));e.default={props:{item:{type:Object,default:null}},methods:{edit:function(){var t=(0,i.default)({},this.item);this.$emit("edit",t)}}}},COCV:function(t,e,a){"use strict";a.d(e,"a",function(){return i}),a.d(e,"b",function(){return s});var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}]},[a("el-row",{attrs:{gutter:10}},[a("el-col",{attrs:{md:12}},[t.showForm?t._e():a("el-card",{staticClass:"box-card"},[a("div",{staticClass:"table-handler-flex",attrs:{slot:"header"},slot:"header"},[a("h4",{staticStyle:{"flex-grow":"1"}},[t._v(t._s(t.$lang[t.langId].twilio_settings))]),t._v(" "),a("button-action-authenticated",{attrs:{disabled:t.disabledSave,permission:["settings/smsnotify","edit"],icon:"el-icon-check",type:"success",size:"small"},on:{click:t.saveTwilio}},[t._v("\n            "+t._s(t.lang.save)+"\n          ")])],1),t._v(" "),a("div",{staticClass:"card-body"},[a("p",[t._v(t._s(t.$lang[t.langId].info_twilio_setting)+"\n          ")]),t._v(" "),a("el-form",{attrs:{"label-width":"40%"}},[a("el-form-item",{attrs:{label:t.$lang[t.langId].account_sid}},[a("el-input",{model:{value:t.twilioData.account_sid,callback:function(e){t.$set(t.twilioData,"account_sid",e)},expression:"twilioData.account_sid"}})],1),t._v(" "),a("el-form-item",{attrs:{label:t.$lang[t.langId].auth_token}},[a("el-input",{model:{value:t.twilioData.auth_token,callback:function(e){t.$set(t.twilioData,"auth_token",e)},expression:"twilioData.auth_token"}})],1),t._v(" "),a("el-form-item",{attrs:{label:t.$lang[t.langId].form_number}},[a("el-input",{model:{value:t.twilioData.from_number,callback:function(e){t.$set(t.twilioData,"from_number",e)},expression:"twilioData.from_number"}})],1),t._v(" "),a("el-form-item",{attrs:{label:t.lang.activated}},[a("el-switch",{attrs:{"active-value":"A","inactive-value":"I"},model:{value:t.twilioData.status,callback:function(e){t.$set(t.twilioData,"status",e)},expression:"twilioData.status"}}),t._v(" "),"I"===t.twilioData.status?a("span",[t._v(t._s(t.lang.no))]):t._e(),t._v(" "),"A"===t.twilioData.status?a("span",[t._v(t._s(t.lang.yes))]):t._e()],1)],1)],1)]),t._v(" "),t.showForm?t._e():a("el-card",{staticClass:"box-card"},[a("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[t._v("\n          "+t._s(t.$lang[t.langId].how_to)+"\n        ")]),t._v(" "),a("div",{staticClass:"card-body"},[a("div",[a("el-steps",{attrs:{direction:"vertical",active:t.activeSteps}},[a("el-step",{attrs:{status:"process"}},[a("div",{attrs:{slot:"title"},slot:"title"},[a("h4",[t._v(t._s(t.$lang[t.langId].create_twilio_account)+"\n                    "),a("span",{staticClass:"pull-right"},[a("el-button",{staticStyle:{color:"#000000"},attrs:{type:"text",size:"mini"},on:{click:function(e){return t.showSteps("first",t.activeSteps)}}},[1===t.activeSteps?a("i",{staticClass:"el-icon-arrow-down"}):a("i",{staticClass:"el-icon-arrow-right"})])],1)])]),t._v(" "),1===t.activeSteps?a("div",{attrs:{slot:"description"},slot:"description"},[a("ol",[a("li",[t._v(t._s(t.$lang[t.langId].twilio_setting_1)+" "),a("a",{attrs:{href:"https://www.twilio.com/try-twilio"}},[t._v("https://www.twilio.com/try-twilio")]),t._v(" "),a("p",[a("img",{attrs:{src:"https://d2cp4rzo38etyi.cloudfront.net/admin/img/admin/twilio_signup2.png"}})])]),t._v(" "),a("li",[t._v(t._s(t.$lang[t.langId].twilio_setting_2))]),t._v(" "),a("li",[t._v(t._s(t.$lang[t.langId].twilio_setting_3))]),t._v(" "),a("li",[t._v(t._s(t.$lang[t.langId].twilio_setting_4)+"\n                      "),a("el-row",[a("el-col",{attrs:{md:12}},[a("img",{attrs:{src:"https://d2cp4rzo38etyi.cloudfront.net/admin/img/admin/twilio_smsveri.png"}})]),t._v(" "),a("el-col",{attrs:{md:12}},[a("img",{attrs:{src:"https://d2cp4rzo38etyi.cloudfront.net/admin/img/admin/twilio_vericode.png"}})])],1)],1)])]):t._e()]),t._v(" "),a("el-step",{attrs:{status:"process"}},[a("div",{attrs:{slot:"title"},slot:"title"},[a("h4",[t._v(t._s(t.$lang[t.langId].twilio_setting_5)+"\n                    "),a("span",{staticClass:"pull-right"},[a("el-button",{staticStyle:{color:"#000000"},attrs:{type:"text",size:"mini"},on:{click:function(e){return t.showSteps("second",t.activeSteps)}}},[2===t.activeSteps?a("i",{staticClass:"el-icon-arrow-down"}):a("i",{staticClass:"el-icon-arrow-right"})])],1)])]),t._v(" "),2===t.activeSteps?a("div",{attrs:{slot:"description"},slot:"description"},[t._v("\n                  "+t._s(t.$lang[t.langId].twilio_setting_6)+"\n                  "),a("p",[a("img",{attrs:{src:"https://d2cp4rzo38etyi.cloudfront.net/admin/img/admin/twilio_consoledash2.png"}})])]):t._e()]),t._v(" "),a("el-step",{attrs:{status:"process"}},[a("div",{attrs:{slot:"title"},slot:"title"},[a("h4",[t._v(t._s(t.$lang[t.langId].twilio_setting_7)+"\n                    "),a("span",{staticClass:"pull-right"},[a("el-button",{staticStyle:{color:"#000000"},attrs:{type:"text",size:"mini"},on:{click:function(e){return t.showSteps("third",t.activeSteps)}}},[3===t.activeSteps?a("i",{staticClass:"el-icon-arrow-down"}):a("i",{staticClass:"el-icon-arrow-right"})])],1)])]),t._v(" "),3===t.activeSteps?a("div",{attrs:{slot:"description"},slot:"description"},[t._v("\n                  "+t._s(t.$lang[t.langId].twilio_setting_8)+":\n                  "),a("div",[a("ol",[a("li",[t._v(t._s(t.$lang[t.langId].twilio_setting_9)+" "),a("a",{attrs:{href:"https://www.twilio.com/console/phone-numbers/search"}},[t._v("https://www.twilio.com/console/phone-numbers/search ")])]),t._v(" "),a("li",[t._v(t._s(t.$lang[t.langId].twilio_setting_10)+"\n                      ")]),t._v(" "),a("li",[t._v(" "+t._s(t.$lang[t.langId].twilio_setting_11))]),t._v(" "),a("li",[t._v(t._s(t.$lang[t.langId].twilio_setting_12))]),t._v(" "),a("li",[t._v(t._s(t.$lang[t.langId].twilio_setting_13)+"\n                        "),a("el-row",[a("el-col",{attrs:{md:12}},[a("img",{attrs:{src:"https://d2cp4rzo38etyi.cloudfront.net/admin/img/admin/twilio_searchnumber2.png"}})]),t._v(" "),a("el-col",{attrs:{md:12}},[a("img",{attrs:{src:"https://d2cp4rzo38etyi.cloudfront.net/admin/img/admin/twilio_fromnumber2.png"}})])],1)],1),t._v(" "),a("li",[t._v(t._s(t.$lang[t.langId].twilio_setting_14))])])])]):t._e()]),t._v(" "),a("el-step",{attrs:{status:"process"}},[a("div",{attrs:{slot:"title"},slot:"title"},[a("h4",[t._v(t._s(t.$lang[t.langId].twilio_setting_15)+"\n                    "),a("span",{staticClass:"pull-right"},[a("el-button",{staticStyle:{color:"#000000"},attrs:{type:"text",size:"mini"},on:{click:function(e){return t.showSteps("four",t.activeSteps)}}},[4===t.activeSteps?a("i",{staticClass:"el-icon-arrow-down"}):a("i",{staticClass:"el-icon-arrow-right"})])],1)])]),t._v(" "),4===t.activeSteps?a("div",{attrs:{slot:"description"},slot:"description"},[t._v("\n                  "+t._s(t.$lang[t.langId].twilio_setting_16)+"\n                  "),a("div",[a("ol",[a("li",[t._v(t._s(t.$lang[t.langId].twilio_setting_17))]),t._v(" "),a("li",[t._v(t._s(t.$lang[t.langId].twilio_setting_18)+"\n                        "),a("p",[a("img",{attrs:{src:"https://d2cp4rzo38etyi.cloudfront.net/admin/img/admin/twilio_permission.png"}})])]),t._v(" "),a("li",[t._v(t._s(t.$lang[t.langId].twilio_setting_19))])])])]):t._e()])],1)],1)])])],1),t._v(" "),a("el-col",{attrs:{md:12}},[t.showForm?t._e():a("el-card",{staticClass:"box-card"},[a("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[t._v("\n          "+t._s(t.lang.sms_and_notification_templates)+"\n        ")]),t._v(" "),a("div",{staticClass:"card-body"},[t._l(t.notifyData,function(e){return a("div",{key:e.id,staticClass:"dd-item",staticStyle:{"margin-bottom":"0"}},[a("list",{attrs:{item:e},on:{edit:t.edit}})],1)}),t._v(" "),t.moreLink?a("div",{directives:[{name:"loading",rawName:"v-loading",value:t.loadingMoreNotify,expression:"loadingMoreNotify"}],staticClass:"load-more"},[a("el-button",{staticClass:"btn-block",attrs:{disabled:t.disabledButton},on:{click:t.loadMore}},[t._v("\n              "+t._s(t.$lang[t.langId].load_more)+"\n            ")])],1):t._e()],2)])],1)],1),t._v(" "),t.showForm?a("item-form",{attrs:{saved:t.saved,loading:t.loading,"form-data":t.tmp},on:{cancel:t.cancelForm,save:t.saveForm}}):t._e()],1)},s=[]},SxrI:function(t,e,a){"use strict";a.r(e);var i=a("rS5j"),s=a("TGSR");for(var n in s)["default"].indexOf(n)<0&&function(t){a.d(e,t,function(){return s[t]})}(n);var o=a("KHd+"),l=Object(o.a)(s.default,i.a,i.b,!1,null,null,null);l.options.__file="List.vue",e.default=l.exports},TGSR:function(t,e,a){"use strict";a.r(e);var i=a("66BH"),s=a.n(i);for(var n in i)["default"].indexOf(n)<0&&function(t){a.d(e,t,function(){return i[t]})}(n);e.default=s.a},cAlW:function(t,e,a){"use strict";a.r(e);var i=a("do5m"),s=a.n(i);for(var n in i)["default"].indexOf(n)<0&&function(t){a.d(e,t,function(){return i[t]})}(n);e.default=s.a},do5m:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n(a("P2sY")),s=n(a("QbLZ"));function n(t){return t&&t.__esModule?t:{default:t}}e.default={props:["saved","loading","formData"],data:function(){return{disableSave:!0,exampleEmail:null,data:{}}},created:function(){this.exampleEmail=this.data.template},computed:{selectedStore:function(){return this.$store.getters.selectedStore},token:function(){return this.$store.state.user.token},lang:function(){return this.$store.state.userStores.lang},langId:function(){return this.$store.state.userStores.langId}},watch:{data:{handler:function(t){t.body&&""!==t.body?this.disabledSave=!1:this.disabledSave=!0},deep:!0},saved:{handler:function(t){!0===t&&(this.data={},this.disabledSave=!0)},deep:!0},formData:{handler:function(t){this.data=(0,s.default)({},t)},deep:!0,immediate:!0}},methods:{setExampleBody:function(){this.data.body=this.exampleEmail},cancel:function(){this.data={},this.$emit("cancel")},save:function(){this.disableSave=!0;var t=(0,i.default)({},this.data);this.$emit("save",t)}}}},fTf8:function(t,e,a){"use strict";a.d(e,"a",function(){return i}),a.d(e,"b",function(){return s});var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("el-row",{attrs:{gutter:10}},[a("el-col",{attrs:{md:8}},[a("el-card",{staticClass:"box-card"},[a("div",{attrs:{slot:"header"},slot:"header"},[a("h4",[t._v(t._s(t.$lang[t.langId].how_to))])]),t._v(" "),a("div",{staticClass:"card-body"},[a("div",[a("h5",[a("b",[a("span",{pre:!0},[t._v("{{ order_no }}{{ customer_name }} {{ customer_email }}")])])]),t._v(" "),a("p",[t._v(t._s(t.lang.info_variable_tags))])]),t._v(" "),a("hr"),t._v(" "),a("div",[a("h5",[t._v(t._s(t.lang.load_template))]),t._v(" "),a("p",[t._v(t._s(t.lang.info_sample_content_email)+" :")]),t._v(" "),a("br"),t._v(" "),a("el-button",{staticClass:"pull-right",staticStyle:{"margin-bottom":"5px",color:"#0085CD"},attrs:{plain:""},on:{click:t.setExampleBody}},[t._v("\n              "+t._s(t.lang.load_template)+" "+t._s(t.lang.email_body)+"\n            ")]),t._v(" "),a("el-input",{attrs:{type:"textarea",rows:5,readonly:""},model:{value:t.exampleEmail,callback:function(e){t.exampleEmail=e},expression:"exampleEmail"}})],1)])])],1),t._v(" "),a("el-col",{attrs:{md:16}},[a("el-card",[a("div",{staticClass:"table-handler-flex",attrs:{slot:"header"},slot:"header"},[a("div",{staticClass:"mr-8"},[1===t.data.sms_notify_type_id||2===t.data.sms_notify_type_id||3===t.data.sms_notify_type_id||4===t.data.sms_notify_type_id?a("el-tag",{staticStyle:{padding:"2px 6px"},attrs:{type:"success"}},[a("svg-icon",{staticStyle:{"margin-right":"0",stroke:"#67c23a"},attrs:{"icon-class":"message-square"}})],1):t._e(),t._v(" "),7===t.data.sms_notify_type_id||8===t.data.sms_notify_type_id?a("el-tag",{staticStyle:{padding:"2px 6px"},attrs:{type:"warning"}},[a("svg-icon",{staticStyle:{"margin-right":"0",stroke:"#f56c6c"},attrs:{"icon-class":"message-square"}})],1):t._e(),t._v(" "),5===t.data.sms_notify_type_id||6===t.data.sms_notify_type_id?a("el-tag",{staticStyle:{padding:"2px 6px"},attrs:{type:"danger"}},[a("svg-icon",{staticStyle:{"margin-right":"0",stroke:"#e6a23c"},attrs:{"icon-class":"message-square"}})],1):t._e()],1),t._v(" "),a("div",{staticStyle:{"flex-grow":"1"}},[a("h4",[t._v(t._s(t.data.sms_notify_type_name))]),t._v(" "),a("p",{staticClass:"input-desc size-12 oldgrey"},[t._v(t._s(t.data.sms_notify_type_description))])]),t._v(" "),a("div",[a("el-button",{attrs:{size:"small",type:"info"},on:{click:t.cancel}},[t._v("\n              "+t._s(t.lang.cancel)+"\n            ")]),t._v(" "),a("el-button",{attrs:{size:"small",type:"success",icon:"el-icon-check",disabled:t.disabledSave},on:{click:t.save}},[t._v("\n                "+t._s(t.lang.save)+"\n            ")])],1)]),t._v(" "),a("div",{staticClass:"card-body"},[a("h5",[t._v(t._s(t.$lang[t.langId].sms_body))]),t._v(" "),a("el-input",{attrs:{type:"textarea",rows:5},model:{value:t.data.body,callback:function(e){t.$set(t.data,"body",e)},expression:"data.body"}})],1)])],1)],1)],1)},s=[]},rS5j:function(t,e,a){"use strict";a.d(e,"a",function(){return i}),a.d(e,"b",function(){return s});var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"dd-handle mb-12",staticStyle:{"padding-left":"8px"}},[a("div",{staticClass:"flex-container flex-container--wrap"},[a("div",{staticClass:"mr-8"},[1===t.item.sms_notify_type_id||2===t.item.sms_notify_type_id||3===t.item.sms_notify_type_id||4===t.item.sms_notify_type_id?a("el-tag",{staticStyle:{padding:"2px 6px"},attrs:{type:"success"}},[a("svg-icon",{staticStyle:{"margin-right":"0",stroke:"#67c23a"},attrs:{"icon-class":"message-square"}})],1):t._e(),t._v(" "),7===t.item.sms_notify_type_id||8===t.item.sms_notify_type_id?a("el-tag",{staticStyle:{padding:"2px 6px"},attrs:{type:"warning"}},[a("svg-icon",{staticStyle:{"margin-right":"0",stroke:"#f56c6c"},attrs:{"icon-class":"message-square"}})],1):t._e(),t._v(" "),5===t.item.sms_notify_type_id||6===t.item.sms_notify_type_id?a("el-tag",{staticStyle:{padding:"2px 6px"},attrs:{type:"danger"}},[a("svg-icon",{staticStyle:{"margin-right":"0",stroke:"#e6a23c"},attrs:{"icon-class":"message-square"}})],1):t._e()],1),t._v(" "),a("div",{staticStyle:{"flex-grow":"1"}},[t._v("\n      "+t._s(t.item.sms_notify_type_name)+"\n      "),a("p",{staticClass:"input-desc size-12 oldgrey",staticStyle:{"margin-bottom":"0","margin-top":"0"}},[t._v("\n        "+t._s(t.item.sms_notify_type_description)+"\n      ")])]),t._v(" "),a("button-action-authenticated",{attrs:{permission:["settings/smsnotify","edit"],size:"mini",type:"text",icon:"el-icon-edit-outline"},on:{click:t.edit}})],1)])},s=[]},rYBE:function(t,e,a){"use strict";a.r(e);var i=a("sDte"),s=a.n(i);for(var n in i)["default"].indexOf(n)<0&&function(t){a.d(e,t,function(){return i[t]})}(n);e.default=s.a},sDte:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=a("xCek"),s=l(a("vDqi")),n=l(a("SxrI")),o=l(a("3OPK"));function l(t){return t&&t.__esModule?t:{default:t}}e.default={components:{List:n.default,ItemForm:o.default},data:function(){return{loading:!0,twilioData:{},notifyData:[],moreLink:null,disabledSave:!0,loadingMoreNotify:!1,showForm:!1,saved:!1,tmp:{},activeSteps:1,params:{per_page:100}}},computed:{selectedStore:function(){return this.$store.getters.selectedStore},token:function(){return this.$store.state.user.token},lang:function(){return this.$store.state.userStores.lang},langId:function(){return this.$store.state.userStores.langId}},watch:{"store.getters.selectedStore":function(){this.getNotify()},twilioData:{handler:function(t){t&&""!==t.account_sid&&""!==t.auth_token&&""!==t.from_number?this.disabledSave=!1:this.disabledSave=!0},deep:!0}},methods:{getNotify:function(){var t=this;this.loading=!0;var e={Authorization:"Bearer "+this.token.access_token};(0,s.default)({method:"GET",url:(0,i.baseApi)(this.selectedStore.url_id,this.langId,"smsnotify/"),headers:e,params:this.params}).then(function(e){t.notifyData=e.data.data,t.moreLink=e.data.links.next,t.loading=!1}).catch(function(e){t.loading=!1})},getDetailNotify:function(t){var e=this;this.loading=!0;var a={Authorization:"Bearer "+this.token.access_token};(0,s.default)({method:"GET",url:(0,i.baseApi)(this.selectedStore.url_id,this.langId,"smsnotify/detail/"+t),headers:a,params:this.params}).then(function(t){e.tmp=t.data.data,e.loading=!1,e.showForm=!0}).catch(function(t){e.loading=!1,e.showForm=!1})},getTwilio:function(){var t=this;this.loading=!0;var e={Authorization:"Bearer "+this.token.access_token};(0,s.default)({method:"GET",url:(0,i.baseApi)(this.selectedStore.url_id,this.langId,"twilioconfig"),headers:e}).then(function(e){t.twilioData=e.data.data,t.loading=!1}).catch(function(e){t.loading=!1})},loadMore:function(){var t=this;this.disabledButton=!0,this.loadingMoreNotify=!0;var e={Authorization:"Bearer "+this.token.access_token};(0,s.default)({method:"GET",url:this.moreLink,params:this.params,headers:e}).then(function(e){t.notifyData=t.notifyData.concat(e.data.data),t.loadingMoreNotify=!1,t.moreLink=e.data.links.next,t.disabledButton=!1}).catch(function(e){t.loadingMoreNotify=!1,t.disabledButton=!1,t.$notify({type:"warning",title:e.response.data.error.message,message:e.response.data.error.error})})},edit:function(t){var e=t.id;this.getDetailNotify(e)},cancelForm:function(){this.showForm=!1,this.tmp={}},saveForm:function(t){var e=this;this.loading=!0;var a=t.id,n={Authorization:"Bearer "+this.token.access_token};(0,s.default)({method:"PUT",url:(0,i.baseApi)(this.selectedStore.url_id,this.langId,"smsnotify/update/"+a),headers:n,data:t}).then(function(t){e.tmp={},e.saved=!0,e.showForm=!1,e.loading=!1,e.getNotify(),e.$message({type:"success",message:"saved"})}).catch(function(t){e.saved=!1,e.loading=!1,e.$notify({type:"warning",title:t.response.data.error.message,message:t.response.data.error.error})})},saveTwilio:function(){var t=this;this.loading=!0;var e=this.twilioData,a={Authorization:"Bearer "+this.token.access_token};(0,s.default)({method:"PUT",url:(0,i.baseApi)(this.selectedStore.url_id,this.langId,"twilioconfig/update"),headers:a,data:e}).then(function(e){t.twilioData=e.data.data,t.loading=!1,t.getTwilio(),t.$message({type:"success",message:"saved"})}).catch(function(e){t.loading=!1,t.$notify({type:"warning",title:e.response.data.error.message,message:e.response.data.error.error})})},showSteps:function(t,e){"first"===t?this.activeSteps=1!==e?1:0:"second"===t?this.activeSteps=2!==e?2:0:"third"===t?this.activeSteps=3!==e?3:0:"four"===t&&(this.activeSteps=4!==e?4:0)}},mounted:function(){this.getTwilio(),this.getNotify()}}}}]);