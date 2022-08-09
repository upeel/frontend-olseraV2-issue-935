(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-2e99"],{"/qGk":function(t,a,e){"use strict";e.r(a);var s=e("QFX3"),n=e("rpq5");for(var l in n)["default"].indexOf(l)<0&&function(t){e.d(a,t,function(){return n[t]})}(l);var i=e("KHd+"),_=Object(i.a)(n.default,s.a,s.b,!1,null,null,null);_.options.__file="CancelOrderDetail.vue",a.default=_.exports},LdW4:function(t,a,e){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var s=e("xCek"),n=_(e("vDqi")),l=_(e("i2n3")),i=e("6y4V");function _(t){return t&&t.__esModule?t:{default:t}}a.default={name:"CancelReturnDetail",components:{CancelTable:l.default},mixins:[i.checkCustomPermission],data:function(){return{loading:!0,loadingElement:!1,cancelOrderData:{},downloadValue:null,downloadSelect:[{value:"",label:this.$store.state.userStores.lang.download_pdf},{value:"1",label:this.$store.state.userStores.lang.invoice},{value:"2",label:this.$store.state.userStores.lang.packing_label},{value:"3",label:this.$lang[this.$store.state.userStores.langId].packing_label_1_or_2},{value:"4",label:this.$lang[this.$store.state.userStores.langId].packing_label_weight}]}},computed:{selectedStore:function(){return this.$store.getters.selectedStore},token:function(){return this.$store.state.user.token},langId:function(){return this.$store.state.userStores.langId},lang:function(){return this.$store.state.userStores.lang}},methods:{getDetailData:function(t){var a=this;this.loading=!0;var e={Authorization:"Bearer "+this.token.access_token};(0,n.default)({method:"GET",url:(0,s.baseApi)(this.selectedStore.url_id,this.langId,"cancelledorder/"+this.$route.params.id),headers:e}).then(function(t){a.cancelOrderData=t.data.data,a.splitDate(a.cancelOrderData.order_date),a.loading=!1}).catch(function(t){a.loading=!1,console.log(t),a.$notify({type:"warning",message:t})})},splitDate:function(t){var a=t.split(" ")[0];this.cancelOrderData.order_date=a},download:function(){var t=this,a=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"pdf";this.loading=!0;var e={Authorization:"Bearer "+this.token.access_token};(0,n.default)({url:(0,s.baseApi)(this.selectedStore.url_id,this.langId,"closeorder/"+a),method:"GET",headers:e,responseType:"blob",params:{id:this.cancelOrderData.id}}).then(function(e){var s=t.cancelOrderData.order_no+"_"+a+".pdf",n=window.URL.createObjectURL(new Blob([e.data])),l=document.createElement("a");l.href=n,l.setAttribute("download",s),document.body.appendChild(l),l.click(),t.loading=!1}).catch(function(a){t.loading=!1,t.$notify({type:"warning",title:a.response.statusText})})},back:function(){this.$router.push("/sales/cancelorder/")}},beforeMount:function(){this.handleCustomPermissionSinglePage("sales/cancelledorders","show")},mounted:function(){this.getDetailData(this.selectedStore)}}},QFX3:function(t,a,e){"use strict";e.d(a,"a",function(){return s}),e.d(a,"b",function(){return n});var s=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],staticClass:"sales-detail"},[e("section",{staticClass:"order-detail"},[e("el-card",{staticClass:"box-card with-back-button"},[e("div",{staticClass:"card-body"},[e("el-button",{staticClass:"back-button",attrs:{icon:"el-icon-arrow-left"},on:{click:t.back}}),t._v(" "),e("div",{staticClass:"flex-container flex-container--wrap"},[e("div",{staticStyle:{"flex-grow":"1"}},[t.cancelOrderData.order_no?e("h4",[t._v(t._s(t.cancelOrderData.order_no))]):e("h4",[t._v("-")]),t._v(" "),e("p",[t._v(t._s(t.lang.sales_by)+" "+t._s(t.cancelOrderData.created_by))])]),t._v(" "),e("div",[e("el-button",{staticClass:"el-dropdown-link mb-4",attrs:{icon:"el-icon-printer"},on:{click:function(a){return t.download("pdf")}}}),t._v(" "),e("el-date-picker",{staticClass:"mb-4",attrs:{placeholder:this.$lang[t.langId].pick_a_day,format:"dd-MM-yyyy",type:"date",disabled:""},model:{value:t.cancelOrderData.order_date,callback:function(a){t.$set(t.cancelOrderData,"order_date",a)},expression:"cancelOrderData.order_date"}})],1)])],1)]),t._v(" "),e("div",{staticClass:"row"},[e("div",{staticClass:"col-md-4"},[e("el-card",{staticClass:"box-card"},[e("div",{attrs:{slot:"header"},slot:"header"},[e("h3",{staticClass:"box-title"},[t._v(t._s(t.lang.customer))])]),t._v(" "),e("div",{staticClass:"card-body"},[e("ul",{staticClass:"list-unstyled"},[e("li",[e("p",[t._v(t._s(t.lang.name))]),t._v(" "),e("div",[t.cancelOrderData.customer_name?e("h5",[t._v(t._s(t.cancelOrderData.customer_name))]):e("h5",[t._v("-")])])]),t._v(" "),e("li",[e("p",[t._v(t._s(t.lang.email))]),t._v(" "),e("div",[t.cancelOrderData.customer_email?e("h5",[t._v(t._s(t.cancelOrderData.customer_email))]):e("h5",[t._v("-")])])])])])])],1),t._v(" "),e("div",{staticClass:"col-md-4"},[e("el-card",{staticClass:"box-card"},[e("div",{attrs:{slot:"header"},slot:"header"},[e("h3",{staticClass:"box-title"},[t._v(t._s(t.lang.shipping_to))])]),t._v(" "),e("div",{staticClass:"card-body"},[e("ul",{staticClass:"list-unstyled"},[e("li",[e("p",[t._v(t._s(t.lang.name))]),t._v(" "),e("div",[t.cancelOrderData.shipping_to?e("h5",[t._v(t._s(t.cancelOrderData.shipping_to))]):e("h5",[t._v("-")])])]),t._v(" "),e("li",[e("p",[t._v(t._s(t.lang.address))]),t._v(" "),e("div",[t.cancelOrderData.shipping_address?e("h5",[t._v(t._s(t.cancelOrderData.shipping_address))]):e("h5",[t._v("-")])])]),t._v(" "),e("li",[e("p",[t._v(t._s(t.lang.phone))]),t._v(" "),e("div",[t.cancelOrderData.shipping_phone?e("h5",[t._v(t._s(t.cancelOrderData.shipping_phone))]):e("h5",[t._v("-")])])])])])])],1),t._v(" "),e("div",{staticClass:"col-md-4"},[e("el-card",{staticClass:"box-card"},[e("div",{attrs:{slot:"header"},slot:"header"},[e("h3",{staticClass:"box-title"},[t._v(t._s(t.lang.shipping_courier))])]),t._v(" "),e("div",{staticClass:"card-body"},[e("ul",{staticClass:"list-unstyled"},[e("li",[e("p",[t._v(t._s(t.lang.courier))]),t._v(" "),e("div",[t.cancelOrderData.shipping_courier_name?e("h5",[t._v(t._s(t.cancelOrderData.shipping_courier_name))]):e("h5",[t._v("-")])])]),t._v(" "),e("li",[e("p",[t._v(t._s(t.lang.tracking_no))]),t._v(" "),e("div",[t.cancelOrderData.shipping_track_no?e("h5",[t._v(t._s(t.cancelOrderData.shipping_track_no))]):e("h5",[t._v("-")])])])])])])],1)]),t._v(" "),e("cancel-table",{attrs:{"data-table":t.cancelOrderData}}),t._v(" "),e("div",{staticClass:"row"},[e("div",{staticClass:"col-md-12"},[e("el-card",{staticClass:"box-card"},[e("div",{attrs:{slot:"header"},slot:"header"},[e("h3",{staticClass:"box-title"},[t._v(t._s(t.lang.deal_detail))])]),t._v(" "),e("div",{staticClass:"card-body"},[e("div",{staticStyle:{"margin-bottom":"22px"}},[e("h5",[t._v(t._s(t.lang.created_time))]),t._v(" "),e("label",[t._v(t._s(t.cancelOrderData.created_by)+", "+t._s(t.cancelOrderData.order_time))])]),t._v(" "),e("div",[e("h5",[t._v(t._s(t.lang.last_modified))]),t._v(" "),e("label",[t._v(t._s(t.cancelOrderData.modified_by)+", "+t._s(t.cancelOrderData.modified_time))])])])])],1)])],1)])},n=[]},i2n3:function(t,a,e){"use strict";e.r(a);var s=e("yXct"),n=e("pB4G");for(var l in n)["default"].indexOf(l)<0&&function(t){e.d(a,t,function(){return n[t]})}(l);var i=e("KHd+"),_=Object(i.a)(n.default,s.a,s.b,!1,null,null,null);_.options.__file="CancelOrderTable.vue",a.default=_.exports},mRQj:function(t,a,e){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var s=function(t){return t&&t.__esModule?t:{default:t}}(e("P2sY"));a.default={name:"CancelTable",props:{dataTable:{default:null,type:Object}},data:function(){return{loading:!0,detailData:{},showTable:!1}},watch:{dataTable:function(){this.getData()}},computed:{selectedStore:function(){return this.$store.getters.selectedStore},langId:function(){return this.$store.state.userStores.langId},lang:function(){return this.$store.state.userStores.lang},rootLang:function(){return this.$lang[this.$store.state.userStores.langId]}},methods:{getData:function(){this.detailData=(0,s.default)({},this.dataTable),this.refreshTable()},refreshTable:function(){this.loading=!0,this.detailData.orderitems.length>0?(this.loading=!1,this.showTable=!0):(this.loading=!1,this.showTable=!1)}}}},pB4G:function(t,a,e){"use strict";e.r(a);var s=e("mRQj"),n=e.n(s);for(var l in s)["default"].indexOf(l)<0&&function(t){e.d(a,t,function(){return s[t]})}(l);a.default=n.a},rpq5:function(t,a,e){"use strict";e.r(a);var s=e("LdW4"),n=e.n(s);for(var l in s)["default"].indexOf(l)<0&&function(t){e.d(a,t,function(){return s[t]})}(l);a.default=n.a},yXct:function(t,a,e){"use strict";e.d(a,"a",function(){return s}),e.d(a,"b",function(){return n});var s=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("el-card",{staticClass:"box-card"},[e("div",{attrs:{slot:"header"},slot:"header"},[e("h3",{staticClass:"box-title"},[t._v(t._s(t.lang.order_item))])]),t._v(" "),e("div",{staticClass:"card-body"},[t.showTable?e("div",[e("div",{staticClass:"table-responsive"},[e("table",{staticClass:"table-orderitems table table-striped"},[e("thead",[e("tr",[e("th",{attrs:{width:"20"}},[t._v("No. ")]),t._v(" "),e("th",{staticClass:"description",attrs:{width:"300"}},[t._v(t._s(t.lang.description))]),t._v(" "),e("th",{attrs:{width:"50"}},[t._v(t._s(t.lang.qty))]),t._v(" "),e("th",{attrs:{width:"100"}},[t._v(t._s(t.lang.price)+" ("+t._s(t.detailData.currency_id)+")")]),t._v(" "),e("th",{attrs:{width:"100"}},[t._v(t._s(t.lang.total_price)+" ("+t._s(t.detailData.currency_id)+")")]),t._v(" "),e("th",{attrs:{width:"100"}})])]),t._v(" "),e("tbody",[t._l(t.detailData.orderitems,function(a,s){return e("tr",{key:s},[e("td",[t._v(t._s(s+1))]),t._v(" "),e("td",[e("div",{staticClass:"flex-container"},[a.photo_md?e("el-avatar",{staticStyle:{"min-width":"40px"},attrs:{src:a.photo_md}}):t._e(),t._v(" "),e("div",{staticClass:"ml-8"},[a.product_name?[t._v(t._s(a.product_name))]:t._e(),t._v(" "),a.product_variant_name?[t._v(t._s(a.product_variant_name))]:t._e(),t._v(" "),a.product_combo_name?[t._v(t._s(a.product_combo_name))]:t._e(),t._v(" "),a.product_sku?e("span",[t._v("\n                      ("+t._s(a.product_sku)+")\n                    ")]):t._e(),t._v(" "),a.product_combo_id?e("div",{staticClass:"product-comodities"},[e("strong",{staticClass:"size-11"},[t._v(t._s(t.lang.products_inside))]),t._v(" "),e("ul",{staticClass:"list-unstyled"},t._l(a.products,function(a){return e("li",{key:a.id},[t._v("\n                          * "+t._s(a.product_name)+" ("+t._s(a.qty)+")\n                        ")])}),0)]):t._e(),t._v(" "),a.note?e("div",{staticClass:"font-12"},[t._v(t._s(a.note))]):t._e()],2)],1)]),t._v(" "),e("td",{attrs:{valign:"middle",align:"left"}},[a.qty?e("div",[t._v(" "+t._s(a.qty)+" ")]):e("div",[t._v("-")])]),t._v(" "),e("td",{attrs:{valign:"middle",align:"left"}},[a.fprice?e("div",[t._v(" "+t._s(a.fprice)+" ")]):e("div",[t._v("-")])]),t._v(" "),e("td",{attrs:{valign:"middle",align:"left"}},[t._v(t._s(a.famount))]),t._v(" "),e("td")])}),t._v(" "),e("tr",[e("td",{staticStyle:{"border-bottom":"1px solid #000",padding:"0 0 0 0"},attrs:{colspan:"5"}}),t._v(" "),e("td",{staticStyle:{"border-bottom":"1px solid #000",padding:"0 0 0 0"},attrs:{colspan:"5"}})]),t._v(" "),e("tr",[e("td"),t._v(" "),e("td",{staticStyle:{"text-align":"right"}},[t._v(t._s(t.lang.order_amount))]),t._v(" "),e("th",[t._v(t._s(t.detailData.total_item_qty))]),t._v(" "),e("td"),t._v(" "),e("td"),t._v(" "),e("td")]),t._v(" "),e("tr",[e("td"),t._v(" "),e("td",{staticStyle:{"text-align":"right"}},[t._v(t._s(t.lang.subtotal))]),t._v(" "),e("td"),t._v(" "),e("td"),t._v(" "),e("th",[t._v(t._s(t.detailData.forder_amount))]),t._v(" "),e("td")]),t._v(" "),e("tr",[e("td"),t._v(" "),e("td",{staticStyle:{"text-align":"right"}},[t._v(t._s(t.lang.discount))]),t._v(" "),e("td"),t._v(" "),e("td"),t._v(" "),e("th",[t._v(t._s(t.detailData.fdiscount_amount))]),t._v(" "),e("td")]),t._v(" "),e("tr",[e("td"),t._v(" "),e("td",{staticStyle:{"text-align":"right"}},[t._v(t._s(t.lang.service_charge))]),t._v(" "),e("td"),t._v(" "),e("td"),t._v(" "),e("th",[t._v(t._s(t.detailData.fservice_charge_amount))]),t._v(" "),e("td")]),t._v(" "),e("tr",[e("td"),t._v(" "),e("td",{staticStyle:{"text-align":"right"}},[t._v(t._s(t.lang.tax))]),t._v(" "),e("td"),t._v(" "),e("td"),t._v(" "),e("th",[t._v(t._s(t.detailData.ftax_amount))]),t._v(" "),e("td")]),t._v(" "),e("tr",[e("td"),t._v(" "),e("td",{staticStyle:{"text-align":"right"}},[t._v(t._s(t.$lang[t.langId].rounded))]),t._v(" "),e("td"),t._v(" "),e("td"),t._v(" "),e("th",[t._v(t._s(t.detailData.frounded_amount))]),t._v(" "),e("td")]),t._v(" "),e("tr",[e("td"),t._v(" "),e("td",{staticStyle:{"text-align":"right"}},[t._v(t._s(t.lang.shipping_cost))]),t._v(" "),e("td"),t._v(" "),e("td"),t._v(" "),e("th",[t._v(t._s(t.detailData.fshipping_cost))]),t._v(" "),e("td")]),t._v(" "),e("tr",{staticStyle:{"background-color":"#fff"}},[e("td"),t._v(" "),e("td",{staticStyle:{"text-align":"right"}},[t._v(t._s(t.lang.total_due))]),t._v(" "),e("td"),t._v(" "),e("td"),t._v(" "),e("th",[t._v(t._s(t.detailData.ftotal_amount))]),t._v(" "),e("td")]),t._v(" "),e("tr",[e("td",{staticStyle:{padding:"0 0 0 0"},attrs:{colspan:"6"}})]),t._v(" "),e("tr",{staticStyle:{"background-color":"#fff"}},[e("td"),t._v(" "),e("td",{staticStyle:{"text-align":"right"}},[t._v(t._s(t.lang.payment))]),t._v(" "),e("td"),t._v(" "),e("td"),t._v(" "),e("th",[t._v(t._s(t.detailData.fpayment_amount))]),t._v(" "),e("td")]),t._v(" "),t._l(t.detailData.creditpayments,function(a){return e("tr",{key:a.id,staticStyle:{"background-color":"#fff"}},[e("td"),t._v(" "),e("td",{staticClass:"text-right ipad-style"},[""===a.payment_mode_name?[t._v("\n                  "+t._s(t.lang.payment)+" "+t._s(a.payment_type_name)+" "+t._s(a.fpayment_date)+"\n                ")]:[t._v("\n                  "+t._s(t.lang.payment)+" "+t._s(a.payment_mode_name)+" "+t._s(a.fpayment_date)+"\n                ")]],2),t._v(" "),e("td"),t._v(" "),e("td"),t._v(" "),e("th",[t._v(t._s(a.fpayment_amount))]),t._v(" "),e("td")])}),t._v(" "),0!==parseInt(t.detailData.credit_outstanding_amount)?e("tr",[e("td"),t._v(" "),e("td",{staticClass:"text-right ipad-style"},[t._v(t._s(t.lang.outstanding_payment))]),t._v(" "),e("td"),t._v(" "),e("td"),t._v(" "),e("th",{staticStyle:{"text-align":"right"},attrs:{align:"right"}},[t._v(t._s(t.detailData.fcredit_outstanding_amount))]),t._v(" "),t.showEdit?e("td",[e("el-button",{attrs:{size:"small",type:"text",icon:"el-icon-plus"},on:{click:function(a){return t.setPayment(!0)}}},[t._v("\n                  "+t._s(t.lang.payment)+"\n                ")])],1):t._e()]):t._e(),t._v(" "),"BT"===t.detailData.payment_type_id?e("tr",{staticStyle:{"background-color":"#fff"}},[e("th",{attrs:{colspan:"6"}},[e("p",[e("label",[t._v(t._s(t.lang.payment)+" "+t._s(t.detailData.payment_type_name)+" ( "+t._s(t.detailData.bt_bank_name)+" - "+t._s(t.detailData.bt_account_no)+" )")])]),t._v(" "),e("p",[t.detailData.payment_from_bank?e("label",[t._v(t._s(t.lang.payment_via_bank)+" : "+t._s(t.detailData.payment_from_bank)+" "+t._s(null!==t.detailData.payment_payee?"("+t.detailData.payment_payee+")":""))]):e("label",[t._v(t._s(t.lang.payment_via_bank)+" : -")])]),t._v(" "),e("p",[t.detailData.payment_charge?e("label",[t._v(t._s(t.lang.payment_charge)+" : "+t._s(t.detailData.payment_charge))]):t._e()]),t._v(" "),e("p",[t.detailData.payment_ref?e("label",[t._v(t._s(t.lang.payment_ref)+" : "+t._s(t.detailData.payment_ref))]):e("label",[t._v(t._s(t.lang.payment_ref)+" : -")])]),t._v(" "),e("p",[t.detailData.payment_date?e("label",[t._v(t._s(t.lang.payment_date)+" : "+t._s(t.detailData.payment_date))]):e("label",[t._v(t._s(t.lang.payment_date)+" : -")])])]),t._v(" "),e("td")]):e("tr",{staticStyle:{"background-color":"#fff"}},[e("th",{attrs:{colspan:"6"}},[e("p",[t.detailData.payment_mode_name?e("label",[t._v(t._s(t.lang.payment_mode)+" : "+t._s(t.detailData.payment_mode_name))]):e("label",[t._v(t._s(t.lang.payment_mode)+" : -")])]),t._v(" "),e("p",[t.detailData.payment_charge?e("label",[t._v(t._s(t.lang.payment_charge)+" : "+t._s(t.detailData.payment_charge))]):e("label",[t._v(t._s(t.lang.payment_charge)+" : -")])]),t._v(" "),e("p",[t.detailData.payment_ref?e("label",[t._v(t._s(t.lang.payment_ref)+" : "+t._s(t.detailData.payment_ref))]):e("label",[t._v(t._s(t.lang.payment_ref)+" : -")])]),t._v(" "),e("p",[t.detailData.payment_date?e("label",[t._v(t._s(t.lang.payment_date)+" : "+t._s(t.detailData.payment_date))]):e("label",[t._v(t._s(t.lang.payment_date)+" : -")])])]),t._v(" "),e("td")])],2)])])]):e("div",{staticClass:"no-product text-center"},[e("p",[t._v(t._s(t.lang.no_order))]),t._v(" "),e("img",{attrs:{src:"/static/img/no-data.svg",alt:"No Data Picture"}})])])])},n=[]}}]);