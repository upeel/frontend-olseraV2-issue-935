(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-64e7"],{"6OGS":function(e,t,a){"use strict";a.d(t,"a",function(){return s}),a.d(t,"b",function(){return i});var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],staticClass:"sales-detail"},[a("section",{staticClass:"order-detail"},[a("el-card",{staticClass:"box-card with-back-button"},[a("div",{staticClass:"card-body"},[a("el-button",{staticClass:"back-button",attrs:{icon:"el-icon-arrow-left"},on:{click:e.backHandle}}),e._v(" "),a("div",{staticClass:"flex-container flex-container--wrap"},[a("div",{staticStyle:{"flex-grow":"1"}},[e.openPurchaseData.purchase_no?a("h4",[e._v(e._s(e.openPurchaseData.purchase_no))]):a("h4",[e._v("-")]),e._v(" "),a("p",[e._v(e._s(e.lang.purchase_by)+" "+e._s(e.openPurchaseData.purchase_by_name))])]),e._v(" "),e.showEdit?a("div",[a("div",{staticClass:"table-handler-flex"},[a("el-select",{staticClass:"inline-form mr-4",staticStyle:{"max-width":"120px"},attrs:{disabled:!e.checkCustomPermission(e.permis,"edit"),placeholder:e.lang.please_select,size:"small"},on:{change:e.handleUpdateStatus},model:{value:e.openPurchaseData.status,callback:function(t){e.$set(e.openPurchaseData,"status",t)},expression:"openPurchaseData.status"}},e._l(e.statusSelect,function(e){return a("el-option",{key:e.value,attrs:{label:e.label,value:e.value,disabled:e.disabled}})}),1),e._v(" "),a("div",{staticClass:"mr-4"},[a("span",[e._v(e._s(e.lang.paid)+" ?")]),e._v(" "),e.checkCustomPermission(e.permis,"edit")?a("el-switch",{attrs:{"active-value":1,"inactive-value":0,disabled:"0.00"===e.openPurchaseData.total_amount},on:{change:e.handleSwitchPayment},model:{value:e.openPurchaseData.is_paid,callback:function(t){e.$set(e.openPurchaseData,"is_paid",t)},expression:"openPurchaseData.is_paid"}}):e._e(),e._v(" "),0===e.openPurchaseData.is_paid?a("span",[e._v(e._s(e.lang.not_yet))]):e._e(),e._v(" "),1===e.openPurchaseData.is_paid?a("span",[e._v(e._s(e.$lang[e.langId].done))]):e._e()],1),e._v(" "),a("el-button",{staticClass:"mr-4",attrs:{icon:"el-icon-printer"},on:{click:e.downloadPdf}}),e._v(" "),a("el-date-picker",{staticClass:"date-purchase",staticStyle:{"max-width":"140px"},attrs:{type:"date",placeholder:e.$lang[e.langId].pick_a_day,disabled:!e.checkCustomPermission(e.permis,"edit"),format:"dd-MM-yyyy"},on:{change:e.changeDateHeader},model:{value:e.openPurchaseData.fpurchase_date,callback:function(t){e.$set(e.openPurchaseData,"fpurchase_date",t)},expression:"openPurchaseData.fpurchase_date"}})],1)]):a("div",[a("el-select",{staticClass:"inline-form",staticStyle:{"max-width":"120px"},attrs:{placeholder:e.lang.please_select,size:"small",disabled:""},model:{value:e.openPurchaseData.status,callback:function(t){e.$set(e.openPurchaseData,"status",t)},expression:"openPurchaseData.status"}},e._l(e.statusSelect,function(e){return a("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})}),1),e._v(" "),a("el-button",{attrs:{icon:"el-icon-printer"},on:{click:e.downloadPdf}}),e._v(" "),a("el-date-picker",{staticClass:"date-purchase",staticStyle:{"max-width":"140px"},attrs:{type:"date",placeholder:e.$lang[e.langId].pick_a_day,format:"dd-MM-yyyy",disabled:""},model:{value:e.openPurchaseData.fpurchase_date,callback:function(t){e.$set(e.openPurchaseData,"fpurchase_date",t)},expression:"openPurchaseData.fpurchase_date"}}),e._v(" "),"Complete Purchase Detail"===e.routeName?a("button-action-authenticated",{staticClass:"edit-header purchase",attrs:{permission:[e.permis,"edit"],type:"primary",icon:"el-icon-edit"},on:{click:e.editHeaderButton}},[e._v("\n              "+e._s(e.lang.edit)+"\n            ")]):e._e()],1)])],1)]),e._v(" "),a("el-row",{attrs:{gutter:10}},[a("el-col",{attrs:{md:8}},[a("el-card",{staticClass:"card-body"},[a("div",{staticClass:"flex-container flex-container--wrap",attrs:{slot:"header"},slot:"header"},[a("h3",{staticClass:"box-title"},[e._v(e._s(e.lang.supplier))]),e._v(" "),e.showEdit?a("div",[e.isEditing.supplier?a("el-button",{attrs:{type:"text",size:"mini"},on:{click:function(t){return e.cancelEdit("supplier")}}},[e._v("\n                "+e._s(e.lang.cancel)+"\n              ")]):e._e(),e._v(" "),e.isEditing.supplier?a("el-button",{attrs:{type:"success",size:"mini"},on:{click:function(t){return e.saveEdit("supplier")}}},[e._v("\n                "+e._s(e.lang.save)+"\n              ")]):e._e(),e._v(" "),e.isEditing.supplier?e._e():a("button-action-authenticated",{attrs:{permission:[e.permis,"edit"],type:"primary",size:"mini",icon:"el-icon-edit",disabled:e.computedAccess},on:{click:function(t){return e.handleEdit("supplier")}}},[e._v("\n                "+e._s(e.lang.edit)+"\n              ")])],1):e._e()]),e._v(" "),a("div",{staticClass:"card-body"},[e.isEditing.supplier?a("div",[a("p",[e._v(e._s(e.lang.search+" "+e.lang.supplier))]),e._v(" "),a("el-autocomplete",{attrs:{"fetch-suggestions":e.getSupplierSuggest,debounce:e.autoCompleteStartOn,placeholder:e.lang.search+" "+e.lang.supplier,clearable:""},on:{select:e.handleSelectSupplier},model:{value:e.formSupplier.supplierName,callback:function(t){e.$set(e.formSupplier,"supplierName",t)},expression:"formSupplier.supplierName"}})],1):a("div",[a("div",{staticClass:"mb-8"},[a("p",{staticClass:"font-12 mb-0"},[e._v(e._s(e.lang.supplier_name))]),e._v(" "),e.openPurchaseData.supplier_name?a("div",[e._v(e._s(e.openPurchaseData.supplier_name))]):a("div",[e._v("-")])]),e._v(" "),a("div",{staticClass:"mb-8"},[a("p",{staticClass:"font-12 mb-0"},[e._v(e._s(e.lang.phone))]),e._v(" "),e.openPurchaseData.supplier_phone?a("div",[e._v(e._s(e.openPurchaseData.supplier_phone))]):a("div",[e._v("-")])]),e._v(" "),a("div",{staticClass:"mb-8"},[a("p",{staticClass:"font-12 mb-0"},[e._v(e._s(e.lang.contact_person))]),e._v(" "),e.openPurchaseData.supplier_contact_person?a("div",[e._v(e._s(e.openPurchaseData.supplier_contact_person))]):a("div",[e._v("-")])]),e._v(" "),a("div",{staticClass:"mb-8"},[a("p",{staticClass:"font-12 mb-0"},[e._v(e._s(e.lang.email))]),e._v(" "),e.openPurchaseData.supplier_email?a("div",[e._v(e._s(e.openPurchaseData.supplier_email))]):a("div",[e._v("-")])]),e._v(" "),a("div",{staticClass:"mb-8"},[a("p",{staticClass:"font-12 mb-0"},[e._v(e._s(e.lang.address))]),e._v(" "),e.openPurchaseData.supplier_address?a("div",[e._v(e._s(e.openPurchaseData.supplier_address))]):a("div",[e._v("-")])]),e._v(" "),a("div",{staticClass:"mb-8"},[a("p",{staticClass:"font-12 mb-0"},[e._v(e._s(e.lang.notes))]),e._v(" "),e.openPurchaseData.supplier_notes?a("div",[e._v(e._s(e.openPurchaseData.supplier_notes))]):a("div",[e._v("-")])])])])])],1),e._v(" "),a("el-col",{attrs:{md:8}},[a("el-card",{staticClass:"card-body"},[a("div",{staticClass:"flex-container flex-container--wrap",attrs:{slot:"header"},slot:"header"},[a("h3",{staticClass:"box-title"},[e._v(e._s(e.lang.received_info))]),e._v(" "),e.showEdit?a("div",[e.isEditing.receiptInfo?a("el-button",{attrs:{size:"mini",type:"text"},on:{click:function(t){return e.cancelEdit("receiptInfo")}}},[e._v("\n                "+e._s(e.lang.cancel)+"\n              ")]):e._e(),e._v(" "),e.isEditing.receiptInfo?a("el-button",{attrs:{size:"mini",type:"success",disabled:e.loadingElement},on:{click:function(t){return e.saveEdit("receiptInfo")}}},[e.loadingElement?a("loading-component",{staticStyle:{"text-align":"center"},attrs:{active:!0,color:"#1bb4e6",loader:"dots",width:32,height:10,backgroundColor:"#ffffff"}}):a("span",[e._v(e._s(e.lang.save))])],1):e._e(),e._v(" "),e.isEditing.receiptInfo?e._e():a("el-button",{attrs:{size:"mini",type:"primary",icon:"el-icon-edit",disabled:e.computedAccess},on:{click:function(t){return e.handleEdit("receiptInfo")}}},[e._v("\n                "+e._s(e.lang.edit)+"\n              ")])],1):e._e()]),e._v(" "),a("div",{staticClass:"card-body"},[a("el-form",{ref:"receiptInfo",attrs:{model:e.formReceiptInfo},nativeOn:{submit:function(e){e.preventDefault()},keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.saveEdit("receiptInfo")}}},[a("div",{staticClass:"mb-8"},[a("p",[e._v(e._s(e.lang.received_date))]),e._v(" "),e.isEditing.receiptInfo?a("div",[a("el-form-item",{attrs:{prop:"dateReceipt",rules:[{required:!0,message:"Please input date",trigger:"change"}]}},[a("el-date-picker",{attrs:{type:"date",placeholder:e.$lang[e.langId].pick_a_day,format:"dd-MM-yyyy","value-format":"yyyy-MM-dd"},model:{value:e.formReceiptInfo.dateReceipt,callback:function(t){e.$set(e.formReceiptInfo,"dateReceipt",t)},expression:"formReceiptInfo.dateReceipt"}})],1)],1):a("div",[e.openPurchaseData.freceived_date?a("h5",[e._v(e._s(e.openPurchaseData.freceived_date))]):a("h5",[e._v("-")])])]),e._v(" "),a("div",{staticClass:"mb-8"},[a("p",[e._v(e._s(e.lang.received_no))]),e._v(" "),e.isEditing.receiptInfo?a("div",[a("el-form-item",{attrs:{prop:"noReceipt",rules:[{required:!0,message:"Please input no receipt",trigger:"blur"}]}},[a("el-input",{attrs:{type:"text",placeholder:e.$lang[e.langId].input_code,clearable:""},model:{value:e.formReceiptInfo.noReceipt,callback:function(t){e.$set(e.formReceiptInfo,"noReceipt",t)},expression:"formReceiptInfo.noReceipt"}})],1)],1):a("div",[e.openPurchaseData.received_no?a("h5",[e._v(e._s(e.openPurchaseData.received_no))]):a("h5",[e._v("-")])])]),e._v(" "),e.isEditing.receiptInfo?a("div",{staticClass:"mb-8"},[a("p",[e._v(e._s(e.lang.continue_add_incoming_stock))]),e._v(" "),a("el-form-item",{attrs:{prop:"switchInStock",rules:[{required:!0,message:"Please select add stock",trigger:"blur"}]}},[a("el-switch",{attrs:{"active-value":1,"inactive-value":0},model:{value:e.formReceiptInfo.switchInStock,callback:function(t){e.$set(e.formReceiptInfo,"switchInStock",t)},expression:"formReceiptInfo.switchInStock"}}),e._v(" "),0===e.formReceiptInfo.switchInStock?a("span",[e._v(e._s(e.lang.no))]):e._e(),e._v(" "),1===e.formReceiptInfo.switchInStock?a("span",[e._v(e._s(e.lang.yes))]):e._e()],1)],1):e._e()])],1)])],1),e._v(" "),a("el-col",{attrs:{md:8}},[a("el-card",{staticClass:"card-body"},[a("div",{staticClass:"flex-container flex-container--wrap",attrs:{slot:"header"},slot:"header"},[a("h3",{staticClass:"box-title"},[e._v(e._s(e.lang.notes))]),e._v(" "),e.showEdit?a("div",[e.isEditing.notes?a("el-button",{attrs:{type:"text",size:"mini"},on:{click:function(t){return e.cancelEdit("notes")}}},[e._v(e._s(e.lang.cancel))]):e._e(),e._v(" "),e.isEditing.notes?a("el-button",{attrs:{type:"success",size:"mini"},on:{click:function(t){return e.saveEdit("notes")}}},[e._v(e._s(e.lang.save))]):e._e(),e._v(" "),e.isEditing.notes?e._e():a("el-button",{attrs:{type:"primary",size:"mini",disabled:e.computedAccess,icon:"el-icon-edit"},on:{click:function(t){return e.handleEdit("notes")}}},[e._v("\n                "+e._s(e.lang.edit)+"\n              ")])],1):e._e()]),e._v(" "),a("div",{staticClass:"card-body"},[e.isEditing.notes?a("div",[a("el-input",{attrs:{type:"textarea",autosize:""},model:{value:e.formNotes.notes,callback:function(t){e.$set(e.formNotes,"notes",t)},expression:"formNotes.notes"}})],1):a("div",[e.openPurchaseData.notes?a("p",[e._v(e._s(e.openPurchaseData.notes))]):a("p",[e._v(e._s(e.$lang[e.langId].there_is_no))])])])])],1),e._v(" "),a("el-col",{attrs:{md:8}},[a("el-card",{staticClass:"card-body"},[a("div",{staticClass:"flex-container flex-container--wrap",attrs:{slot:"header"},slot:"header"},[a("h3",{staticClass:"box-title"},[e._v(e._s(e.lang.due_date))]),e._v(" "),e.showEdit?a("div",[e.isEditing.due_date?a("el-button",{attrs:{type:"text",size:"mini"},on:{click:function(t){return e.cancelEdit("due_date")}}},[e._v(e._s(e.lang.cancel))]):e._e(),e._v(" "),e.isEditing.due_date?a("el-button",{attrs:{type:"success",size:"mini"},on:{click:function(t){return e.saveEdit("due_date")}}},[e._v(e._s(e.lang.save))]):e._e(),e._v(" "),e.isEditing.due_date?e._e():a("el-button",{attrs:{type:"primary",size:"mini",disabled:e.computedAccess,icon:"el-icon-edit"},on:{click:function(t){return e.handleEdit("due_date")}}},[e._v("\n                "+e._s(e.lang.edit)+"\n              ")])],1):e._e()]),e._v(" "),a("div",{staticClass:"card-body"},[e.isEditing.due_date?a("div",[a("div",{staticClass:"mb-16 flex-container"},[a("el-date-picker",{attrs:{type:"date",placeholder:e.$lang[e.langId].pick_a_day,format:"dd-MM-yyyy","value-format":"yyyy-MM-dd"},model:{value:e.formDueDate.payment_due_date,callback:function(t){e.$set(e.formDueDate,"payment_due_date",t)},expression:"formDueDate.payment_due_date"}})],1)]):a("div",[e.openPurchaseData.fpayment_due_date?a("p",[e._v(e._s(e.openPurchaseData.fpayment_due_date))]):a("p",[e._v(e._s(e.$lang[e.langId].there_is_no))])])])])],1)],1),e._v(" "),a("purchase-table",{attrs:{"data-table":e.openPurchaseData,"edit-show":e.showEdit},on:{changePayment:e.checkPayment}}),e._v(" "),a("div",{staticClass:"row"},[a("div",{staticClass:"col-md-12"},[a("el-card",{staticClass:"box-card"},[a("div",{attrs:{slot:"header"},slot:"header"},[a("h3",{staticClass:"box-title"},[e._v(e._s(e.lang.deal_detail))])]),e._v(" "),a("div",{staticClass:"card-body"},[a("div",{staticStyle:{"margin-bottom":"22px"}},[a("h5",[e._v(e._s(e.lang.created_time))]),e._v(" "),a("label",[e._v(e._s(e.openPurchaseData.created_by)+", "+e._s(e.openPurchaseData.created_time))])]),e._v(" "),a("div",[a("h5",[e._v(e._s(e.lang.last_modified))]),e._v(" "),a("label",[e._v(e._s(e.openPurchaseData.modified_by)+", "+e._s(e.openPurchaseData.modified_time))])])])])],1)])],1)])},i=[]},Dl1V:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=u(a("FyfS")),i=u(a("GQeE")),n=a("xCek"),r=u(a("vDqi")),o=u(a("SOyq")),c=u(a("wd/R")),l=u(a("kGIl")),d=a("6y4V");function u(e){return e&&e.__esModule?e:{default:e}}t.default={name:"DetailPurchase",mixins:[d.checkCustomPermission],components:{PurchaseTable:o.default,LoadingComponent:l.default},data:function(){return{loading:!0,loadingElement:!1,showTable:!1,openPurchaseData:{},suggestData:[],autoCompleteStartOn:300,showEdit:!0,switchValue:0,routeName:"",statusSelect:[{value:"P",disabled:!1,label:this.$lang[this.$store.state.userStores.langId].pending},{value:"T",disabled:!1,label:this.$lang[this.$store.state.userStores.langId].sent},{value:"S",disabled:!1,label:this.$lang[this.$store.state.userStores.langId].sending},{value:"R",disabled:!1,label:this.$store.state.userStores.lang.rewarded},{value:"Z",disabled:!1,label:this.$lang[this.$store.state.userStores.langId].complete},{value:"X",disabled:"ST"===this.$store.state.userStores.userRole.role_id||"SA"===this.$store.state.userStores.userRole.role_id||"PT"===this.$store.state.userStores.userRole.role_id||"LW"===this.$store.state.userStores.userRole.role_id,label:this.$store.state.userStores.lang.cancel}],isEditing:{supplier:!1,receiptInfo:!1,notes:!1,due_date:!1},formSupplier:{supplierId:"",supplierName:""},formReceiptInfo:{dateReceipt:"",noReceipt:"",switchInStock:1},formNotes:{notes:""},formDueDate:{payment_due_date:""},repeat:!1,permis:"purchase/openpurchases"}},computed:{selectedStore:function(){return this.$store.getters.selectedStore},selectRoute:function(){return this.$route.name},token:function(){return this.$store.state.user.token},langId:function(){return this.$store.state.userStores.langId},lang:function(){return this.$store.state.userStores.lang},rootLang:function(){return this.$lang[this.$store.state.userStores.langId]},accessByStore:function(){return["cvsms","smsstore1","smsstore2"]},computedAccess:function(){if(this.accessByStore.includes(this.selectedStore.url_id)&&"PT"===this.selectedStore.role_id)return!0}},beforeMount:function(){this.handleCustomPermissionSinglePage(this.permis,"show")},mounted:function(){this.permis="purchase/openpurchases","Complete Purchase Detail"===this.$route.name?this.permis="purchase/closedpurchases":"Cancel Purchase Detail"===this.$route.name&&(this.permis="purchase/cancelledpurchases"),this.getRoute(this.selectRoute,this.selectedStore)},methods:{getRoute:function(e,t){(0,i.default)(this.$route.query).includes("pathName")?this.routeName=this.$route.query.pathName:this.routeName=e;var a="";"Open Purchase Detail"===e?a="openpurchase/":"Complete Purchase Detail"===e?(a="closedpurchase/",this.showEdit=!1):"Cancel Purchase Detail"===e&&(a="cancelledpurchase/",this.showEdit=!1);var s=(0,n.baseApi)(this.selectedStore.url_id,this.langId,a+this.$route.params.id);this.getDetailData(s)},getDetailData:function(e){var t=this;this.loading=!0,void 0!==this.$route.query.rpt&&(this.repeat=!0);var a={Authorization:"Bearer "+this.token.access_token};(0,r.default)({method:"GET",url:e,headers:a}).then(function(e){t.openPurchaseData=e.data.data,console.log("aaaa",t.openPurchaseData),t.switchValue=t.openPurchaseData.is_paid,t.loading=!1}).catch(function(e){t.loading=!1,t.$notify({type:"warning",title:e.response.data.error.message,message:e.response.data.error.error})})},handleSwitchPayment:function(){var e=this;this.loading=!0;var t={Authorization:"Bearer "+this.token.access_token},a={status:this.openPurchaseData.is_paid,id:this.openPurchaseData.id};(0,r.default)({method:"POST",url:(0,n.baseApi)(this.selectedStore.url_id,this.langId,"openpurchase/updatepaymentstatus"),headers:t,params:a}).then(function(t){e.openPurchaseData=t.data.data,e.$message({message:"Success",type:"success"}),e.getDetailData(),e.loading=!1}).catch(function(t){e.$notify({type:"warning",title:t.response.data.error.message,message:t.response.data.error.error}),e.switchValue=e.openPurchaseData.is_paid,e.getDetailData(),e.loading=!1})},handleUpdateStatus:function(){var e=this;this.loading=!0;var t={Authorization:"Bearer "+this.token.access_token},a={status:this.openPurchaseData.status,id:this.openPurchaseData.id};(0,r.default)({method:"POST",url:(0,n.baseApi)(this.selectedStore.url_id,this.langId,"openpurchase/updatestatus"),headers:t,data:a}).then(function(t){e.openPurchaseData=t.data.data,e.$message({message:"Success",type:"success"}),e.loading=!1,e.getDetailData()}).catch(function(t){e.$notify({type:"warning",title:t.response.data.error.message,message:t.response.data.error.error}),e.loading=!1})},handleEdit:function(e){"supplier"===e?(this.formSupplier.supplierId=this.openPurchaseData.supplier_id,this.formSupplier.supplierName=this.openPurchaseData.supplier_name,this.isEditing.supplier=!0):"receiptInfo"===e?(this.formReceiptInfo.dateReceipt=this.openPurchaseData.received_date,this.formReceiptInfo.noReceipt=this.openPurchaseData.received_no,this.isEditing.receiptInfo=!0):"notes"===e?(this.formNotes.notes=this.openPurchaseData.notes,this.isEditing.notes=!0):"due_date"===e&&(this.formDueDate.payment_due_date=this.openPurchaseData.payment_due_date,this.isEditing.due_date=!0)},cancelEdit:function(e){"supplier"===e?(this.isEditing.supplier=!1,this.formSupplier.supplierId="",this.formSupplier.supplierName=""):"receiptInfo"===e?(this.isEditing.receiptInfo=!1,this.formReceiptInfo.dateReceipt="",this.formReceiptInfo.noReceipt="",this.formReceiptInfo.switchInStock=1):"notes"===e?(this.isEditing.notes=!1,this.formNotes.notes=""):"due_date"===e&&(this.isEditing.due_date=!1,this.formDueDate.payment_due_date="")},saveEdit:function(e){var t=this;if("supplier"===e){var a=(0,n.baseApi)(this.selectedStore.url_id,this.langId,"openpurchase/"+this.$route.params.id),s={supplier_id:this.formSupplier.supplierId};this.updateData(e,"PUT",a,s)}else if("receiptInfo"===e)this.$refs[e].validate(function(a){if(!a)return!1;var s=(0,n.baseApi)(t.selectedStore.url_id,t.langId,"openpurchase/updatereceivedinfo/"+t.$route.params.id),i={received_date:(0,c.default)(t.formReceiptInfo.dateReceipt).format("YYYY-MM-DD"),received_no:t.formReceiptInfo.noReceipt,add_incoming_stock:t.formReceiptInfo.switchInStock};t.updateData(e,"PUT",s,i)});else if("notes"===e){var i=(0,n.baseApi)(this.selectedStore.url_id,this.langId,"openpurchase/updateattr"),r={id:this.openPurchaseData.id,name:"notes",value:this.formNotes.notes};this.updateData(e,"POST",i,r)}else if("due_date"===e){var o=(0,n.baseApi)(this.selectedStore.url_id,this.langId,"openpurchase/updateattr"),l={id:this.openPurchaseData.id,name:"payment_due_date",value:(0,c.default)(this.formDueDate.payment_due_date).format("YYYY-MM-DD")};this.updateData(e,"POST",o,l)}},updateData:function(e,t,a,s){var i=this;this.loadingElement=!0;var n={Authorization:"Bearer "+this.token.access_token};(0,r.default)({method:t,url:a,headers:n,data:s}).then(function(t){i.openPurchaseData=t.data.data,i.loading=!1,i.loadingElement=!1,i.$message({message:"Success",type:"success"}),"notes"===e&&(i.isEditing.notes=!1),"supplier"===e&&(i.isEditing.supplier=!1),"due_date"===e&&(i.isEditing.due_date=!1),s.add_incoming_stock&&i.$router.push({path:"/inventory/stocksincoming/"+t.data.data.stock_in_out_id})}).catch(function(t){i.loading=!1,i.loadingElement=!1,i.$notify({type:"warning",title:t.response.data.error.message,message:t.response.data.error.error}),i.cancelEdit(e),i.getDetailData()})},changeDateHeader:function(e){var t=this;this.loading=!0;var a={Authorization:"Bearer "+this.token.access_token},s={id:this.openPurchaseData.id,name:"purchase_date",value:(0,c.default)(e).format("YYYY-MM-DD")};(0,r.default)({method:"POST",url:(0,n.baseApi)(this.selectedStore.url_id,this.langId,"openpurchase/updateattr"),headers:a,data:s}).then(function(e){t.openPurchaseData=e.data.data,t.$message({message:"Success",type:"success"}),t.loading=!1,t.getDetailData()}).catch(function(e){t.$notify({type:"warning",title:e.response.data.error.message,message:e.response.data.error.error}),t.loading=!1})},getSupplierSuggest:function(e,t){var a=this,i={Authorization:"Bearer "+this.token.access_token},o={search:e};(0,r.default)({method:"GET",url:(0,n.baseApi)(this.selectedStore.url_id,this.langId,"supplier"),headers:i,params:o}).then(function(e){var i=!0,n=!1,r=void 0;try{for(var o,c=(0,s.default)(e.data.data);!(i=(o=c.next()).done);i=!0){var l=o.value;l.value=l.name}}catch(e){n=!0,r=e}finally{try{!i&&c.return&&c.return()}finally{if(n)throw r}}a.suggestData=e.data.data,t(a.suggestData)}).catch(function(e){a.$notify({type:"warning",title:e.response.data.error.message,message:e.response.data.error.error})})},handleSelectSupplier:function(e){this.formSupplier.supplierId=e.id},editHeaderButton:function(){this.showEdit=!0},backHandle:function(){this.repeat?("purchase"===this.$route.query.path&&this.$router.push({path:"/reports/purchases"}),"unpaiddetails"===this.$route.query.path&&this.$router.push({path:"/reports/purchases?path=unpaiddetails"})):"Open Purchase Detail"===this.routeName?this.$router.push({path:"/purchase/openpurchase"}):"Complete Purchase Detail"===this.routeName?this.$router.push({path:"/purchase/completepurchase"}):"Cancel Purchase Detail"===this.routeName?this.$router.push({path:"/purchase/cancelpurchase"}):"Integrate Jurnal.ID"===this.routeName&&this.$router.push({name:"Integrate Jurnal.ID",params:{lastParams:this.$route.query.lastParams,labelDate:this.$route.query.labelDate},query:{menu:"general",tab:this.$route.query.tab}})},checkPayment:function(e){this.openPurchaseData=e,0===this.openPurchaseData.outstanding_amount&&(this.openPurchaseData.is_paid=1,this.handleSwitchPayment())},downloadPdf:function(){var e=this;this.loading=!0;var t="",a="";"R"===this.openPurchaseData.status?(t="closedpurchase",a=(0,n.baseApi)(this.selectedStore.url_id,this.langId,t+"/pdf?id="+this.openPurchaseData.id)):"P"===this.openPurchaseData.status?(t="openpurchase",a=(0,n.baseApi)(this.selectedStore.url_id,this.langId,t+"/pdf?id="+this.openPurchaseData.id)):"X"===this.openPurchaseData.status?(t="cancelledpurchase",a=(0,n.baseApi)(this.selectedStore.url_id,this.langId,t+"/pdf?id="+this.openPurchaseData.id)):(this.openPurchaseData.status,t="openpurchase",a=(0,n.baseApi)(this.selectedStore.url_id,this.langId,t+"/pdf"));var s={Authorization:"Bearer "+this.token.access_token};(0,r.default)({url:a,method:"GET",headers:s,responseType:"blob",params:{id:this.openPurchaseData.id}}).then(function(t){var a=e.openPurchaseData.purchase_no+".pdf",s=window.URL.createObjectURL(new Blob([t.data])),i=document.createElement("a");i.href=s,i.setAttribute("download",a),document.body.appendChild(i),i.click(),e.loading=!1}).catch(function(t){e.loading=!1,e.$message({type:"warning",message:"failed"})})}}}},GpOJ:function(e,t,a){"use strict";a.r(t);var s=a("Dl1V"),i=a.n(s);for(var n in s)["default"].indexOf(n)<0&&function(e){a.d(t,e,function(){return s[e]})}(n);t.default=i.a},KH2W:function(e,t,a){"use strict";a.r(t);var s=a("6OGS"),i=a("GpOJ");for(var n in i)["default"].indexOf(n)<0&&function(e){a.d(t,e,function(){return i[e]})}(n);var r=a("KHd+"),o=Object(r.a)(i.default,s.a,s.b,!1,null,null,null);o.options.__file="DetailPurchase.vue",t.default=o.exports}}]);