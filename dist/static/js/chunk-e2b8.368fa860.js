(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-e2b8"],{"0RfD":function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=n(s("m1cH")),i=n(s("gDS+")),l=n(s("DChC"));function n(e){return e&&e.__esModule?e:{default:e}}t.default={name:"TabelPermission",components:{lang:function(){return this.$store.state.userStores.lang},langId:function(){return this.$store.state.userStores.langId}},props:{dataPermission:{type:Array,default:null},load:{type:Boolean,default:!1},selectedRole:{type:Object,default:{role:"OW",role_name:""}}},mixins:[l.default],data:function(){return{allData:[],edited:[],disabledCheckbox:{dashboard:["edit","store","destroy"],brands:["show"],specifications:["show"],collections:["show"],featured:["show","detail","edit"],productgroups:["show"],rawmaterial:["show"],sale:["show"],inextrans:["show"],inextranstype:["show"],posdevices:["show","edit"],pospasskey:["show","store","destroy"],posextsetting:["show","store","destroy"],shiftsetting:["show","store","destroy"],posreceiptnote:["show","store","destroy"],posstockmode:["show","store","destroy"],posdisabledinein:["show","store","destroy"],posbilling:["show","store","destroy"],poslocalserver:["show","store","destroy"]}}},watch:{dataPermission:{deep:!0,immediate:!0,handler:function(e){e&&e.length&&(this.allData=JSON.parse((0,i.default)(e)))}},edited:{deep:!0,immediate:!0,handler:function(e){this.$emit("change",e)}}},methods:{checkAllHeader:function(e,t){var s=this,a=this.edited.findIndex(function(e){return e.api===s.allData[t].api});this.edited.splice(a,1),e?(this.allData[t].access_list.index=1,this.allData[t].access_list.show=1,this.allData[t].access_list.edit=1,this.allData[t].access_list.store=1,this.allData[t].access_list.update=1,this.allData[t].access_list.destroy=1,this.edited.push({keyHeader:t,keyItem:null,role_id:this.selectedRole.role,api:this.allData[t].api,index:1,show:1,edit:1,store:1,update:1,destroy:1})):(this.allData[t].access_list.index=0,this.allData[t].access_list.show=0,this.allData[t].access_list.edit=0,this.allData[t].access_list.store=0,this.allData[t].access_list.update=0,this.allData[t].access_list.destroy=0,this.edited.push({keyHeader:t,keyItem:null,role_id:this.selectedRole.role,api:this.allData[t].api,index:0,show:0,edit:0,store:0,update:0,destroy:0}))},checkAllItem:function(e,t){var s=this,i=[],l=[];this.allData[t].children.map(function(a,n){var o=s.edited.findIndex(function(e){return e.api===a.api});l.push(o),e?(a.access_list.index=1,a.access_list.show=1,a.access_list.edit=1,a.access_list.store=1,a.access_list.update=1,a.access_list.destroy=1,i.push({keyHeader:t,keyItem:n,role_id:s.selectedRole.role,api:a.api,index:1,show:1,edit:1,store:1,update:1,destroy:1})):(a.access_list.index=0,a.access_list.show=0,a.access_list.edit=0,a.access_list.store=0,a.access_list.update=0,a.access_list.destroy=0,i.push({keyHeader:t,keyItem:n,role_id:s.selectedRole.role,api:a.api,index:0,show:0,edit:0,store:0,update:0,destroy:0}))});for(var n=0;n<l.length;n++)5===l[n]&&this.edited.splice(n,1);this.edited=[].concat((0,a.default)(this.edited),i)},onChangeHeader:function(e,t){this.allData[e].isEdit=!0;var s=this.edited.findIndex(function(e){return e.api===t.api});-1===s?this.edited.push({keyHeader:e,keyItem:null,role_id:this.selectedRole.role,api:t.api,index:t.access_list.index,show:t.access_list.show,edit:t.access_list.edit,store:t.access_list.store,update:t.access_list.update,destroy:t.access_list.destroy}):(this.edited.splice(s,1),this.edited.push({keyHeader:e,keyItem:null,role_id:this.selectedRole.role,api:t.api,index:t.access_list.index,show:t.access_list.show,edit:t.access_list.edit,store:t.access_list.store,update:t.access_list.update,destroy:t.access_list.destroy}))},onChangeItem:function(e,t,s){this.allData[e].children[t].isEdit=!0;var a=this.edited.findIndex(function(e){return e.api===s.api});-1!==a&&this.edited.splice(a,1),0===s.access_list.index&&(this.allData[e].children[t].access_list.show=0,this.allData[e].children[t].access_list.edit=0,this.allData[e].children[t].access_list.store=0,this.allData[e].children[t].access_list.update=0,this.allData[e].children[t].access_list.destroy=0),this.edited.push({keyHeader:e,keyItem:t,role_id:this.selectedRole.role,api:s.api,index:s.access_list.index,show:s.access_list.index?s.access_list.show:0,edit:s.access_list.index?s.access_list.edit:0,store:s.access_list.index?s.access_list.store:0,update:s.access_list.index?s.access_list.edit:0,destroy:s.access_list.index?s.access_list.destroy:0})},cancelHeader:function(e){var t=this.edited.findIndex(function(t){return t.api===e.api}),s=this.edited[t];this.allData[s.keyHeader].access_list=JSON.parse((0,i.default)(this.dataPermission[s.keyHeader].access_list)),this.allData[s.keyHeader].isEdit=!1,this.edited.splice(t,1)},cancelItem:function(e){var t=this.edited.findIndex(function(t){return t.api===e.api}),s=this.edited[t];this.allData[s.keyHeader].children[s.keyItem].access_list=JSON.parse((0,i.default)(this.dataPermission[s.keyHeader].children[s.keyItem].access_list)),this.allData[s.keyHeader].children[s.keyItem].isEdit=!1,this.edited.splice(t,1)},cancelSave:function(){this.edited=[]},checkDisabledCheckbox:function(e,t){return!(!this.disabledCheckbox[e.id]||!this.disabledCheckbox[e.id].length)&&this.disabledCheckbox[e.id].includes(t)}}}},"97nr":function(e,t,s){"use strict";s.d(t,"a",function(){return a}),s.d(t,"b",function(){return i});var a=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"main-content"},[s("div",{staticClass:"table-handler-flex"},[s("div",{staticClass:"flex-grow-1"},[s("h4",{staticClass:"main-content__title"},[e._v(e._s(e.rootLang.staffs_permission))])]),e._v(" "),s("el-button",{attrs:{type:"text",disabled:e.isLoading,loading:e.isLoading},on:{click:e.cancelEdited}},[s("svg-icon",{staticClass:"font-20 color-info",attrs:{"icon-class":"more-vertical"}})],1)],1),e._v(" "),s("div",{staticClass:"card-body"},[s("div",{staticClass:"jurnalExportHeader mb-24 pos-sticky",staticStyle:{top:"120px","z-index":"9"}},[s("el-row",{staticClass:"px-10",attrs:{gutter:20}},[s("el-col",{staticClass:"pt-4",attrs:{md:20,sm:20,xs:16,align:"left"}},[s("span",{staticClass:"jurnal"},[e._v(e._s(e.selectedRole.role_name))])]),e._v(" "),s("el-col",{attrs:{md:4,sm:4,xs:8,align:"right"}},[s("el-dropdown",{attrs:{"hide-on-click":!1}},[s("el-button",{attrs:{icon:"el-icon-caret-bottom",circle:"",size:"mini"}}),e._v(" "),s("el-dropdown-menu",{attrs:{slot:"dropdown"},slot:"dropdown"},e._l(e.dataRoles,function(t,a){return s("el-dropdown-item",{key:a,staticStyle:{padding:"0px"}},[s("el-button",{staticClass:"accounting-dropBtn",attrs:{type:"text"},on:{click:function(s){return e.selectRole(t)}}},[e._v("\n                  "+e._s(t.name)+"\n                ")])],1)}),1)],1)],1)],1)],1),e._v(" "),s("list-permission",{ref:"permissionList",attrs:{dataPermission:e.dataPermission,selectedRole:e.selectedRole,load:e.isLoading},on:{change:e.changeEdited}}),e._v(" "),0!==e.savePermision.length?s("div",{staticClass:"save-bottom-full"},[s("div",{staticClass:"box-bodys"},[s("div",{staticClass:"visible-lg font-bold"},[e._v(e._s(e.$lang[e.langId].save_change))]),e._v(" "),s("div",{staticClass:"flex-grow-1"}),e._v(" "),s("el-button",{attrs:{type:"info"},on:{click:e.cancelEdited}},[e._v(e._s(e.lang.cancel))]),e._v(" "),s("el-button",{attrs:{type:"primary",loading:e.loadingSave},on:{click:e.saveEdited}},[e._v(e._s(e.lang.save))])],1)]):e._e()],1),e._v(" "),s("el-dialog",{attrs:{title:e.$lang[e.langId].unsaved_title,visible:e.saveDialog,"close-on-click-modal":!1,"show-close":!1,center:""},on:{"update:visible":function(t){e.saveDialog=t}}},[s("div",{staticStyle:{"text-align":"center"}},[s("span",[e._v(e._s(e.$lang[e.langId].not_save_text))])]),e._v(" "),s("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[s("el-button",{on:{click:e.cancelSaveDialog}},[e._v(e._s(e.$lang[e.langId].dont_save))]),e._v(" "),s("el-button",{attrs:{type:"success",disabled:e.loadingSave},on:{click:e.saveEdited}},[e._v(e._s(e.lang.save))])],1)])],1)},i=[]},CHG8:function(e,t,s){"use strict";s.r(t);var a=s("97nr"),i=s("RTTs");for(var l in i)["default"].indexOf(l)<0&&function(e){s.d(t,e,function(){return i[e]})}(l);var n=s("KHd+"),o=Object(n.a)(i.default,a.a,a.b,!1,null,null,null);o.options.__file="Index.vue",t.default=o.exports},CPvv:function(e,t,s){"use strict";s.r(t);var a=s("0RfD"),i=s.n(a);for(var l in a)["default"].indexOf(l)<0&&function(e){s.d(t,e,function(){return a[e]})}(l);t.default=i.a},DChC:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=l(s("QbLZ")),i=l(s("Ljqw"));function l(e){return e&&e.__esModule?e:{default:e}}var n={mixins:[s("6y4V").checkCustomPermission],computed:{selectedStore:function(){return this.$store.getters.selectedStore},token:function(){return this.$store.state.user.token},langId:function(){return this.$store.state.userStores.langId},lang:function(){return this.$store.state.userStores?this.$store.state.userStores.lang:{}},userRole:function(){var e=this.$store.getters.selectedStore;return{role_id:e.role_id,role_name:e.role_name,is_pos_only:e.is_pos_only,is_mobile:e.is_mobile}},rootLang:function(){return this.$lang[this.langId]},headers:function(){var e=this.$store.getters.token;return this.$store.getters.webviewMode&&(e=this.$store.getters.webviewToken),{Authorization:"Bearer "+e.access_token}},baseURL:function(){return i.default},loggedInUser:function(){return this.$store.state.user.loggedInUser},stageLevel:function(){return"sit"},defaultAccessByStore:function(){return["setdemo1","allinolsera2"]},wejayafoodAccessByStore:function(){return["setdemo1","allinolsera2","ayammrotholpusat","ayammrotholdramaga"]},saveToAllAccessStore:function(){return["setdemo1","allinolsera2","siliwangidutagarden","barokahfrozenfood"]},outlets:function(){var e=[{name:this.$store.state.userStores.lang.all,store_id:0,url_id:"all"}],t=[];return this.$store.getters.stores.map(function(s){t.includes(s.store_id)||s.is_store_active&&(e.push((0,a.default)({},s)),t.push(s.store_id))}),e},tokopediaActiveStore:function(){return this.$store.state.tokopediaActiveStore},shopeeActiveStore:function(){return this.$store.state.shopeeActiveStore}}};t.default=n},FBwF:function(e,t,s){"use strict";s.d(t,"a",function(){return a}),s.d(t,"b",function(){return i});var a=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{directives:[{name:"loading",rawName:"v-loading",value:e.load,expression:"load"}],staticClass:"table-custom-permission"},e._l(e.allData,function(t,a){return s("el-card",{key:a,staticClass:"el-card-null box-card"},[t.children&&!t.children.length?s("el-table",{directives:[{name:"element-table-header",rawName:"v-element-table-header"}],attrs:{data:[t]}},[s("el-table-column",{attrs:{prop:"modul_name",label:"",width:"250"}},[s("template",{slot:"header"},[s("el-checkbox",{on:{change:function(t){return e.checkAllHeader(t,a)}},model:{value:t.checkAll,callback:function(s){e.$set(t,"checkAll",s)},expression:"permission.checkAll"}},[e._v("\n            "+e._s(t.modul_name)+"\n          ")])],1)],2),e._v(" "),s("el-table-column",{attrs:{label:e.lang.view,prop:"modul_name",align:"center"},scopedSlots:e._u([{key:"default",fn:function(i){return[s("el-checkbox",{attrs:{"true-label":1,"false-label":0},on:{change:function(s){return e.onChangeHeader(a,t)}},model:{value:i.row.access_list.index,callback:function(t){e.$set(i.row.access_list,"index",t)},expression:"scope.row.access_list.index"}})]}}],null,!0)}),e._v(" "),s("el-table-column",{attrs:{prop:"modul_name",align:"center",label:"Detail"},scopedSlots:e._u([{key:"default",fn:function(i){return[s("el-checkbox",{attrs:{"true-label":1,"false-label":0},on:{change:function(s){return e.onChangeHeader(a,t)}},model:{value:i.row.access_list.show,callback:function(t){e.$set(i.row.access_list,"show",t)},expression:"scope.row.access_list.show"}})]}}],null,!0)}),e._v(" "),s("el-table-column",{attrs:{label:e.rootLang.add,prop:"modul_name",align:"center"},scopedSlots:e._u([{key:"default",fn:function(i){return[s("el-checkbox",{attrs:{disabled:e.checkDisabledCheckbox(i.row,"store"),"true-label":1,"false-label":0},on:{change:function(s){return e.onChangeHeader(a,t)}},model:{value:i.row.access_list.store,callback:function(t){e.$set(i.row.access_list,"store",t)},expression:"scope.row.access_list.store"}})]}}],null,!0)}),e._v(" "),s("el-table-column",{attrs:{label:e.lang.edit,prop:"modul_name",align:"center"},scopedSlots:e._u([{key:"default",fn:function(i){return[s("el-checkbox",{attrs:{disabled:e.checkDisabledCheckbox(i.row,"edit"),"true-label":1,"false-label":0},on:{change:function(s){return e.onChangeHeader(a,t)}},model:{value:i.row.access_list.edit,callback:function(t){e.$set(i.row.access_list,"edit",t)},expression:"scope.row.access_list.edit"}})]}}],null,!0)}),e._v(" "),s("el-table-column",{attrs:{prop:"modul_name",align:"center",label:e.lang.remove},scopedSlots:e._u([{key:"default",fn:function(i){return[s("el-checkbox",{attrs:{disabled:e.checkDisabledCheckbox(i.row,"destroy"),"true-label":1,"false-label":0},on:{change:function(s){return e.onChangeHeader(a,t)}},model:{value:i.row.access_list.destroy,callback:function(t){e.$set(i.row.access_list,"destroy",t)},expression:"scope.row.access_list.destroy"}})]}}],null,!0)})],1):t.children&&t.children.length?s("el-table",{directives:[{name:"element-table-header",rawName:"v-element-table-header"}],attrs:{data:t.children}},[s("el-table-column",{attrs:{prop:"modul_name",width:"250"},scopedSlots:e._u([{key:"default",fn:function(t){return[s("span",[e._v(e._s(t.row.modul_name))])]}}],null,!0)},[s("template",{slot:"header"},[s("el-checkbox",{on:{change:function(t){return e.checkAllItem(t,a)}},model:{value:t.checkAll,callback:function(s){e.$set(t,"checkAll",s)},expression:"permission.checkAll"}},[e._v("\n            "+e._s(t.modul_name)+"\n          ")])],1)],2),e._v(" "),s("el-table-column",{attrs:{prop:"modul_name",align:"center",label:e.lang.view},scopedSlots:e._u([{key:"default",fn:function(t){return[s("el-checkbox",{attrs:{disabled:e.checkDisabledCheckbox(t.row,"index"),"true-label":1,"false-label":0},on:{change:function(s){return e.onChangeItem(a,t.$index,t.row)}},model:{value:t.row.access_list.index,callback:function(s){e.$set(t.row.access_list,"index",s)},expression:"scope.row.access_list.index"}})]}}],null,!0)}),e._v(" "),s("el-table-column",{attrs:{prop:"modul_name",align:"center",label:"Detail"},scopedSlots:e._u([{key:"default",fn:function(t){return[s("el-checkbox",{attrs:{disabled:0===t.row.access_list.index||e.checkDisabledCheckbox(t.row,"show"),"true-label":1,"false-label":0},on:{change:function(s){return e.onChangeItem(a,t.$index,t.row)}},model:{value:t.row.access_list.show,callback:function(s){e.$set(t.row.access_list,"show",s)},expression:"scope.row.access_list.show"}})]}}],null,!0)}),e._v(" "),s("el-table-column",{attrs:{prop:"modul_name",align:"center",label:e.rootLang.add},scopedSlots:e._u([{key:"default",fn:function(t){return[s("el-checkbox",{attrs:{disabled:0===t.row.access_list.index||e.checkDisabledCheckbox(t.row,"store"),"true-label":1,"false-label":0},on:{change:function(s){return e.onChangeItem(a,t.$index,t.row)}},model:{value:t.row.access_list.store,callback:function(s){e.$set(t.row.access_list,"store",s)},expression:"scope.row.access_list.store"}})]}}],null,!0)}),e._v(" "),s("el-table-column",{attrs:{prop:"modul_name",align:"center",label:e.lang.edit},scopedSlots:e._u([{key:"default",fn:function(t){return[s("el-checkbox",{attrs:{disabled:0===t.row.access_list.index||e.checkDisabledCheckbox(t.row,"edit"),"true-label":1,"false-label":0},on:{change:function(s){return e.onChangeItem(a,t.$index,t.row)}},model:{value:t.row.access_list.edit,callback:function(s){e.$set(t.row.access_list,"edit",s)},expression:"scope.row.access_list.edit"}})]}}],null,!0)}),e._v(" "),s("el-table-column",{attrs:{label:e.lang.remove,prop:"modul_name",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[s("el-checkbox",{attrs:{disabled:0===t.row.access_list.index||e.checkDisabledCheckbox(t.row,"destroy"),"true-label":1,"false-label":0},on:{change:function(s){return e.onChangeItem(a,t.$index,t.row)}},model:{value:t.row.access_list.destroy,callback:function(s){e.$set(t.row.access_list,"destroy",s)},expression:"scope.row.access_list.destroy"}})]}}],null,!0)})],1):e._e()],1)}),1)},i=[]},RTTs:function(e,t,s){"use strict";s.r(t);var a=s("fdce"),i=s.n(a);for(var l in a)["default"].indexOf(l)<0&&function(e){s.d(t,e,function(){return a[e]})}(l);t.default=i.a},fdce:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=c(s("QbLZ")),i=c(s("jo6Y")),l=c(s("DChC")),n=c(s("lnEl")),o=s("c/X4"),r=s("YOZh");function c(e){return e&&e.__esModule?e:{default:e}}t.default={name:"StaffPermission",mixins:[l.default],components:{ListPermission:n.default},data:function(){return{isLoading:!1,loadingSave:!1,dataRoles:[],selectedRole:{role:"SP",role_name:this.$lang[this.$store.state.userStores.langId].supervisor},savePermision:[],dataPermission:[],params:{search:null,role_id:"SP"},saveDialog:!1}},computed:{lang:function(){return this.$store.state.userStores.lang},langId:function(){return this.$store.state.userStores.langId}},mounted:function(){this.getData(),this.getRoles(),window.userGuiding.hideChecklist()},beforeDestroy:function(){window.userGuiding.launchChecklist()},methods:{getRoles:function(){var e=this;(0,o.getUserRole)({sort_column:"view_order",sort_type:"asc"}).then(function(t){var s=["PO","PS","PJ"];e.dataRoles=t.data.data.filter(function(e,t){return!s.includes(e.id)}),e.loading=!1}).catch(function(t){e.loading=!1,401===t.response.data.error.status_code||e.$notify({type:"warning",title:"Error",message:t.response.data.error.error})})},getData:function(){var e=this;this.isLoading=!0;var t=this.params;(0,r.permissionList)(t).then(function(t){var s=t.data.data[0].detail.map(function(e){var t=e.menus,s=(0,i.default)(e,["menus"]);return(0,a.default)({},s,{checkAll:!1,isEdit:!1,children:t.map(function(e){return(0,a.default)({},e,{isEdit:!1})})})});e.selectedRole.role_name=t.data.data[0].role_name,e.dataPermission=s,e.isLoading=!1}).catch(function(t){e.isLoading=!1,e.$notify({type:"warning",title:"Error",message:t.response.data.error.error})})},selectRole:function(e){0===this.savePermision.length?(this.selectedRole.role=e.id,this.params.role_id=e.id,this.getData()):this.saveDialog=!0},changeEdited:function(e){this.savePermision=e},saveEdited:function(){var e=this;this.loadingSave=!0;var t={role_id:this.params.role_id,permission:this.savePermision};t.permission.map(function(e){return delete e.keyHeader,delete e.keyItem,delete e.role_id,e}),(0,r.updatePermission)(t).then(function(t){e.$refs.permissionList.cancelSave(),e.savePermision=[],e.getData(),e.loadingSave=!1}).catch(function(t){e.loadingSave=!1,e.$notify({type:"warning",title:"Error",message:t.response.data.error.error})})},cancelEdited:function(){this.$refs.permissionList.cancelSave(),this.savePermision=[],this.getData()},cancelSaveDialog:function(){this.saveDialog=!1}}}},jo6Y:function(e,t,s){"use strict";t.__esModule=!0,t.default=function(e,t){var s={};for(var a in e)t.indexOf(a)>=0||Object.prototype.hasOwnProperty.call(e,a)&&(s[a]=e[a]);return s}},lnEl:function(e,t,s){"use strict";s.r(t);var a=s("FBwF"),i=s("CPvv");for(var l in i)["default"].indexOf(l)<0&&function(e){s.d(t,e,function(){return i[e]})}(l);var n=s("KHd+"),o=Object(n.a)(i.default,a.a,a.b,!1,null,null,null);o.options.__file="ListPermission.vue",t.default=o.exports}}]);