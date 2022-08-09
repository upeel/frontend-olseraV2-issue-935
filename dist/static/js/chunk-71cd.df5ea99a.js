(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-71cd"],{"0nFj":function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=u(a("QbLZ")),i=u(a("YDBu")),n=u(a("P2sY")),r=a("xCek"),o=u(a("vDqi")),d=u(a("DChC")),l=u(a("eWfT")),c=a("0dap");function u(t){return t&&t.__esModule?t:{default:t}}e.default={components:{InputAutocomplete:l.default},mixins:[d.default],props:{dataTable:{default:null,type:Array},dataStock:{default:null,type:Array},isButtonDisabled:{type:Boolean,default:!1},isItemAdded:{type:Boolean,default:!1},editable:{type:Boolean,default:!0},toStore:{type:Number,default:null}},data:function(){return{loading:!0,detailData:{},showTable:!1,addProductDialog:!1,deleteDialog:!1,rowState:[],formAddProduct:{},deleteData:{},searchData:[],isEditing:{},tmp:{productSearchName:"",qty:null,item:{}},addingOrderItem:!1,isProgressing:!1,newData:!1,searchingItems:!1}},watch:{isItemAdded:function(t){!0===t&&(this.tmp.productSearchName="",this.tmp.qty=null,this.tmp.item={})}},computed:{selectedStore:function(){return this.$store.getters.selectedStore},token:function(){return this.$store.state.user.token},langId:function(){return this.$store.state.userStores.langId},lang:function(){return this.$store.state.userStores.lang},computedHeaderTable:function(){var t=["",this.lang.name,this.lang.qty+" "+this.lang.total,this.lang.qty+" "+this.rootLang.accepted,this.lang.qty+" "+this.lang.difference];return this.editable||t.splice(t.length-1,1),t}},methods:{addDataTable:function(){this.newData=!0,this.$set(this.tmp,"product_ids",this.tmp.item.join(",")),this.$refs.InputAutocomplete.setFocus(),this.$refs.InputAutocomplete.resetKeyword(),this.$emit("itemadded",this.tmp)},selectProduct:function(t){this.newData=!1,this.tmp.item=t},setQueryString:function(t){var e=this;t?(0,c.debounce)(function(t){return e.getProductSearch(t)},"400ms")(t):this.searchData=[]},getProductSearch:function(t,e){var a=this;this.searchingItems=!0;var s={Authorization:"Bearer "+this.token.access_token},i={sort_column:"name",sort_type:"asc",search:t,store:this.toStore,search_column:"track_inventory",search_text:1,per_page:1e3};(0,o.default)({method:"GET",url:(0,r.baseApi)(this.selectedStore.url_id,this.langId,"productvariantonlysearch"),headers:s,params:i}).then(function(t){a.searchData=t.data.data.map(function(t){return t}),a.searchingItems=!1}).catch(function(){a.searchData=[],a.searchingItems=!1})},edit:function(t){var e=(0,n.default)({},t);e.new_buy_price=(0,i.default)(e.new_buy_price,0),this.isEditing=(0,n.default)({},e)},save:function(t){var e=this;this.isProgressing=!0,this.loading=!0;var a=!1;1===this.isEditing.order_with_serial&&(this.isEditing.serials.split("\n").map(function(t){t.length<=1&&(a=!0)}),console.log("bloc",a),a?(this.loading=!1,this.isProgressing=!1,this.$notify({type:"warning",message:"Serial harus lebih dari 1 digit"})):this.saveSerial(t));if(!a){var s={Authorization:"Bearer "+this.token.access_token},i={pk:this.isEditing.in_out_id,id:this.isEditing.id,qty:this.isEditing.qty,serials:this.isEditing.serials};(0,o.default)({method:"POST",url:(0,r.baseApi)(this.selectedStore.url_id,this.langId,"stockinouts/updateitemqty"),headers:s,params:i}).then(function(t){e.$emit("itemupdated",t.data.data),e.isProgressing=!1,e.cancel()}).catch(function(t){e.$notify({type:"warning",title:t.response.data.error.message,message:t.response.data.error.error}),e.isProgressing=!1})}},saveSerial:function(t){var e=this;this.loading=!0,this.isProgressing=!0;var a={Authorization:"Bearer "+this.token.access_token},s={name:"serials",pk:this.isEditing.id,value:this.isEditing.serials};(0,o.default)({method:"POST",url:(0,r.baseApi)(this.selectedStore.url_id,this.langId,"stockinout/updateitemserials/"+this.isEditing.in_out_id),headers:a,data:s}).then(function(t){e.loading=!1,e.isProgressing=!1,e.dataTable=t.data.data.items,e.$message({message:"Saved",type:"success"});var a=t.data.data;a.items.map(function(t){null!==t.serials&&(t.fserials=t.serials.split("\n"),console.log("serial",t.fserials))}),e.$emit("itemupdated",a),e.cancel()}).catch(function(t){e.$notify({type:"warning",title:t.response.data.error.message,message:t.response.data.error.error}),e.loading=!1,e.isProgressing=!1})},removeDialog:function(t){this.deleteData=(0,s.default)({},t),this.deleteDialog=!0},deleteCancel:function(){this.deleteDialog=!1,this.deleteData={}},deleteSave:function(){var t=this,e=(0,s.default)({},this.deleteData);this.loading=!0,this.isProgressing=!0;var a={Authorization:"Bearer "+this.token.access_token},i={pk:e.in_out_id,id:e.id};(0,o.default)({method:"POST",url:(0,r.baseApi)(this.selectedStore.url_id,this.langId,"stockinouts/removeitem"),headers:a,params:i}).then(function(e){t.deleteCancel(),t.$emit("itemupdated",e.data.data),t.isProgressing=!1,t.$message({message:"Delete Success",type:"success"}),t.cancel()}).catch(function(e){t.deleteCancel(),t.$notify({type:"warning",title:e.response.data.error.message,message:e.response.data.error.error}),t.isProgressing=!1})},cancel:function(){this.isEditing={}}}}},"5Au0":function(t,e,a){"use strict";a.r(e);var s=a("I0hY"),i=a("fAuL");for(var n in i)["default"].indexOf(n)<0&&function(t){a.d(e,t,function(){return i[t]})}(n);var r=a("KHd+"),o=Object(r.a)(i.default,s.a,s.b,!1,null,null,null);o.options.__file="StocksTable.vue",e.default=o.exports},Ckdx:function(t,e,a){"use strict";a.r(e);var s=a("JHOB"),i=a("ZdU5");for(var n in i)["default"].indexOf(n)<0&&function(t){a.d(e,t,function(){return i[t]})}(n);var r=a("KHd+"),o=Object(r.a)(i.default,s.a,s.b,!1,null,null,null);o.options.__file="Detail.vue",e.default=o.exports},DChC:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=n(a("QbLZ")),i=n(a("Ljqw"));function n(t){return t&&t.__esModule?t:{default:t}}var r={mixins:[a("6y4V").checkCustomPermission],computed:{selectedStore:function(){return this.$store.getters.selectedStore},token:function(){return this.$store.state.user.token},langId:function(){return this.$store.state.userStores.langId},lang:function(){return this.$store.state.userStores?this.$store.state.userStores.lang:{}},userRole:function(){var t=this.$store.getters.selectedStore;return{role_id:t.role_id,role_name:t.role_name,is_pos_only:t.is_pos_only,is_mobile:t.is_mobile}},rootLang:function(){return this.$lang[this.langId]},headers:function(){var t=this.$store.getters.token;return this.$store.getters.webviewMode&&(t=this.$store.getters.webviewToken),{Authorization:"Bearer "+t.access_token}},baseURL:function(){return i.default},loggedInUser:function(){return this.$store.state.user.loggedInUser},stageLevel:function(){return"sit"},defaultAccessByStore:function(){return["setdemo1","allinolsera2"]},wejayafoodAccessByStore:function(){return["setdemo1","allinolsera2","ayammrotholpusat","ayammrotholdramaga"]},saveToAllAccessStore:function(){return["setdemo1","allinolsera2","siliwangidutagarden","barokahfrozenfood"]},outlets:function(){var t=[{name:this.$store.state.userStores.lang.all,store_id:0,url_id:"all"}],e=[];return this.$store.getters.stores.map(function(a){e.includes(a.store_id)||a.is_store_active&&(t.push((0,s.default)({},a)),e.push(a.store_id))}),t},tokopediaActiveStore:function(){return this.$store.state.tokopediaActiveStore},shopeeActiveStore:function(){return this.$store.state.shopeeActiveStore}}};e.default=r},I0hY:function(t,e,a){"use strict";a.d(e,"a",function(){return s}),a.d(e,"b",function(){return i});var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("bs-table",{staticClass:"box-shadow-2",attrs:{header:t.computedHeaderTable}},[t._l(t.dataTable,function(e,s){return a("tr",{key:s},[a("td",[t._v(t._s(s+1))]),t._v(" "),a("td",[a("div",{staticClass:"flex-container flex-container--wrap"},[e.product_photo_md?a("div",{staticClass:"mr-4"},[a("el-avatar",{attrs:{src:e.product_photo_md}})],1):t._e(),t._v(" "),null!==e.product_sku?a("div",[e.product_sku.length>0?a("strong",[t._v(t._s(e.product_name)+" - "+t._s(e.product_sku))]):a("strong",[t._v(t._s(e.product_name))]),t._v(" "),null!==e.product_variant_id?a("div",[null!==e.product_variant_sku?a("p",[t._v(t._s(e.product_variant_name)+" - "+t._s(e.product_variant_sku))]):a("p",[t._v(t._s(e.product_variant_name))])]):t._e()]):a("div",[a("strong",[t._v(t._s(e.product_name))]),t._v(" "),null!==e.product_variant_id?a("div",[null!==e.product_variant_sku||""!==e.product_sku?a("p",[t._v(t._s(e.product_variant_name)+" - "+t._s(e.product_variant_sku))]):a("p",[t._v(t._s(e.product_variant_name))])]):t._e()])]),t._v(" "),1===e.order_with_serial?a("div",[t._v("\n          "+t._s(t.$lang[t.langId].serial_product_note)+"\n          "),t.isEditing.id===e.id?[a("el-input",{attrs:{type:"textarea",size:"small"},model:{value:t.isEditing.serials,callback:function(e){t.$set(t.isEditing,"serials",e)},expression:"isEditing.serials"}})]:[void 0===e.serials?a("span",[t._v("Empty")]):a("div",{staticStyle:{display:"flex","flex-direction":"column"}},t._l(e.fserials,function(e){return a("span",{key:e},[t._v(t._s(e))])}),0)]],2):t._e()]),t._v(" "),a("td",{staticClass:"text-right",staticStyle:{"padding-right":"12px !important"}},[[t._v("\n          "+t._s(e.inoutitemsextref.qty_send)+"\n        ")]],2),t._v(" "),a("td",{staticClass:"text-right",staticStyle:{"padding-right":"12px !important"}},[[t._v("\n          "+t._s(e.inoutitemsextref.qty_received)+"\n        ")]],2),t._v(" "),a("td",{staticClass:"text-right color-warning",staticStyle:{"padding-right":"12px !important"}},[[t._v("\n          "+t._s(e.inoutitemsextref.qty_difference)+"\n        ")]],2)])}),t._v(" "),"P"===t.dataStock.status?a("tr",[a("td"),t._v(" "),a("td",[t._v("\n        Total\n      ")]),t._v(" "),a("td",{staticClass:"text-right",staticStyle:{"padding-right":"12px !important"}},[t._v(t._s(t.dataStock.total_qty_send))]),t._v(" "),a("td",{staticClass:"text-right",staticStyle:{"padding-right":"12px !important"}},[t._v(t._s(t.dataStock.total_qty_received))]),t._v(" "),a("td",{staticClass:"text-right color-warning",staticStyle:{"padding-right":"12px !important"}},[t._v(t._s(t.dataStock.total_qty_difference))])]):t._e()],2),t._v(" "),a("el-dialog",{attrs:{visible:t.deleteDialog,width:"50%",center:"","close-on-click-modal":!1,"show-close":!1},on:{"update:visible":function(e){t.deleteDialog=e}}},[a("span",{attrs:{slot:"title"},slot:"title"},[a("svg-icon",{staticStyle:{stroke:"#F44336"},attrs:{"icon-class":"alert-triangle"}}),t._v("\n      "+t._s(t.lang.notif_warn)+"\n    ")],1),t._v(" "),a("div",{staticClass:"text-center"},[a("p",[t._v(t._s(this.$lang[t.langId].are_you_want_remove)+" "+t._s(t.lang.product))]),t._v(" "),a("div",[a("img",{staticClass:"table-image table-image-80",attrs:{src:t.deleteData.product_photo_md,alt:t.deleteData.product_photo_md}}),t._v(" "),a("span",{staticStyle:{"margin-left":"10px"}},[a("strong",[t._v('"'+t._s(t.deleteData.product_name)+'"')])])])]),t._v(" "),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:t.deleteCancel}},[t._v(t._s(t.lang.cancel))]),t._v(" "),a("el-button",{attrs:{type:"danger"},on:{click:t.deleteSave}},[t._v(t._s(this.$lang[t.langId].delete))])],1)])],1)},i=[]},JHOB:function(t,e,a){"use strict";a.d(e,"a",function(){return s}),a.d(e,"b",function(){return i});var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("section",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}]},[t.data?[a("el-card",{staticClass:"box-card pos-relative card-body-inventory"},[a("div",{staticClass:"card-body"},[a("div",{staticClass:"inventory-status text-center"},[a("div",{staticClass:"container-icon"},[a("svg-icon",{attrs:{"icon-class":"icon-stop-circle"}})],1)]),t._v(" "),a("div",{staticClass:"flex-container with-padding-left"},[a("div",[a("h4",{staticClass:"font-bold"},[t._v(t._s(t.data.trans_no))]),t._v(" "),a("span",{staticClass:"color-warning"},[t._v("Outstanding")])]),t._v(" "),a("div",{staticClass:"full-width text-right"},["D"!==t.data.status?a("el-button",{staticClass:"ml-4 btn-no-shadow",attrs:{icon:"el-icon-back",size:"small",type:"success",plain:""},on:{click:t.backHandle}},[t._v(t._s(t.lang.back))]):t._e(),t._v(" "),0===parseInt(t.data.total_qty_difference_returned)?a("el-button",{attrs:{loading:t.loadingPosting,type:"primary"},on:{click:t.postingData}},[a("i",{staticClass:"el-icon-plus"}),t._v(" Post stok masuk\n            ")]):t._e(),t._v(" "),a("el-button",{staticClass:"ml-4 btn-no-shadow",attrs:{icon:"el-icon-printer",size:"small"},on:{click:function(e){return t.handlePrint()}}},[t._v(t._s(t.lang.print))]),t._v(" "),"D"===t.data.status?a("el-button",{staticClass:"ml-4 btn-no-shadow color-warning--bg color-white",attrs:{icon:"el-icon-takeaway-box",size:"small"},on:{click:t.backHandle}},[t._v(t._s(t.$lang[t.langId].draft))]):t._e()],1)])])]),t._v(" "),a("div",{staticClass:"row"},[a("div",{staticClass:"col-md-4"},[a("el-card",{staticClass:"box-card"},[a("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[a("strong",[t._v(t._s(t.lang.date))])]),t._v(" "),a("div",{staticClass:"box-card-content"},[[a("div",{staticClass:"flex-container"},[a("div",{staticClass:"full-width"},[t._v("\n                  "+t._s(t.rootLang.transfer_date)+"\n                ")]),t._v(" "),a("div",{staticClass:"full-width text-right"},[t._v("\n                  "+t._s(t.data.fdate)+"\n                ")])]),t._v(" "),a("div",{staticClass:"flex-container"},[a("div",{staticClass:"full-width"},[t._v("\n                  "+t._s(t.rootLang.date_received)+"\n                ")]),t._v(" "),a("div",{staticClass:"full-width text-right"},[t._v("\n                  "+t._s(t.data.fref_date)+"\n                ")])]),t._v(" "),a("div",{staticClass:"flex-container"},[a("div",{staticClass:"full-width"},[t._v("\n                  Penerima\n                ")]),t._v(" "),a("div",{staticClass:"full-width text-right"},[t._v("\n                  "+t._s(t.data.fref_date)+"\n                ")])])]],2)])],1),t._v(" "),a("div",{staticClass:"col-md-4"},[a("el-card",{staticClass:"box-card"},[a("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[a("strong",[t._v(t._s(t.lang.transfer_to))])]),t._v(" "),a("div",{staticClass:"box-card-content"},[""!==t.data.ref_store_name&&t.data.ref_store_name?[t._v(t._s(t.data.ref_store_name))]:[t._v("-")]],2)])],1),t._v(" "),a("div",{staticClass:"col-md-4"},[a("el-card",{staticClass:"box-card"},[a("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[a("strong",[t._v(t._s(t.lang.notes))])]),t._v(" "),a("div",{staticClass:"box-card-content"},[[t._v("\n              "+t._s(t.data.note)+"\n            ")]],2)])],1)]),t._v(" "),a("stocks-table",{attrs:{editable:t.data.IsEditable,"is-item-added":t.itemAdded,"is-button-disabled":t.isButtonDisabled,"data-table":t.data.itemsref,"data-stock":t.data,"to-store":t.data.ref_store_id},on:{itemadded:t.addItem,itemupdated:t.itemUpdated}}),t._v(" "),a("div",{staticStyle:{display:"none"},attrs:{id:"printView"}},[a("div",{staticClass:"box"},[a("div",{staticClass:"box-header with-padding-left with-border"},[a("div",{staticClass:"inventory-status",class:t.classBasedOnStatus,staticStyle:{"font-size":"22px","font-weight":"bold",width:"200px"}},["P"===t.data.status?[t._m(0),t._v(" "+t._s(t.data.status_desc)+"\n            ")]:t._e(),t._v(" "),"X"===t.data.status?[t._m(1),t._v(" "+t._s(t.data.status_desc)+"\n            ")]:t._e(),t._v(" "),"D"===t.data.status?[t._m(2),t._v(" "+t._s(t.data.status_desc)+"\n            ")]:t._e()],2),t._v(" "),a("div",{staticClass:"pull-right"},[a("small",{staticStyle:{color:"#ccc"}},[t._v(t._s(t.lang.incoming_stock_no))]),t._v(" "),t.data.trans_no?a("h4",[t._v(t._s(t.data.trans_no))]):a("h4",[t._v("-")])])]),t._v(" "),a("div",{staticClass:"row",staticStyle:{"margin-bottom":"10px"}},[a("div",{staticClass:"col-md-4"},[a("el-card",{staticClass:"box-card"},[a("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[a("strong",[t._v(t._s(t.lang.date))])]),t._v(" "),a("div",{staticClass:"box-card-content"},[[t.data.fdate?a("div",[t._v("\n                    "+t._s(t.data.fdate)),a("br"),a("small",[t._v(t._s(t.data.created_by))])]):a("div",[t._v("-")])]],2)])],1),t._v(" "),a("div",{staticClass:"col-md-4"},[a("el-card",{staticClass:"box-card"},[a("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[a("strong",[t._v(t._s(t.lang.notes))])]),t._v(" "),a("div",{staticClass:"box-card-content"},[[t.data.note?a("p",[t._v(t._s(t.data.note))]):a("p",[t._v("-")])]],2)])],1),t._v(" "),a("div",{staticClass:"col-md-4"},[a("el-card",{staticClass:"box-card"},[a("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[a("strong",[t._v(t._s(t.lang.transfer_to))])]),t._v(" "),a("div",{staticClass:"box-card-content"},[[t.data.to_store_name?a("p",[t._v("\n                    "+t._s(t.data.to_store_name)+"\n                  ")]):a("p",[t._v("-")])]],2)])],1)]),t._v(" "),a("hr"),t._v(" "),a("el-table",{staticClass:"table-stocks",staticStyle:{width:"100%"},attrs:{data:t.data.items,stripe:""}},[a("el-table-column",{attrs:{label:t.lang.name,width:"500"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("div",{staticClass:"clearfix"},[a("div",{staticClass:"pull-left",staticStyle:{"padding-right":"12px"}},[e.row.product_photo_md?[a("img",{staticClass:"table-image table-image-80",attrs:{src:e.row.product_photo_md,alt:e.row.product_photo_md}})]:t._e()],2),t._v(" "),a("div",{staticClass:"pull-left"},[a("strong",[t._v(t._s(e.row.product_name)+" - "+t._s(e.row.product_sku))]),t._v(" "),a("p",[t._v(t._s(e.row.product_variant_name)+" - "+t._s(e.row.product_variant_sku))])])])]}}],null,!1,1281762750)}),t._v(" "),a("el-table-column",{attrs:{label:t.lang.qty,width:"150"},scopedSlots:t._u([{key:"default",fn:function(e){return[[e.row.qty?a("p",[t._v(t._s(e.row.qty))]):a("p",[t._v("-")])]]}}],null,!1,3154917338)})],1)],1)])]:t._e()],2)},i=[function(){var t=this.$createElement,e=this._self._c||t;return e("span",[e("i",{staticClass:"el-icon-circle-check"})])},function(){var t=this.$createElement,e=this._self._c||t;return e("span",[e("i",{staticClass:"el-icon-error"})])},function(){var t=this.$createElement,e=this._self._c||t;return e("span",[e("i",{staticClass:"el-icon-document"})])}]},Jtn0:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.getListOutstanding=function(t){return(0,s.service)({url:"/stockinoutstransfer",params:t})},e.getDetailOutstanding=function(t){return(0,s.service)({url:"/stockinoutstransfer/"+t})},e.downloadOutstanding=function(t){return(0,s.service)({url:"/stockinoutstransfer/"+t,responseType:"blob",params:{type:"pdf"}})},e.postOutstanding=function(t){return(0,s.service)({url:"/stockinoutstransfer/"+t,method:"post"})},e.bulkpostOutstanding=function(t){return(0,s.service)({url:"/stockinoutstransfer/bulkpost",method:"post",data:t})};var s=a("xCek")},SUDN:function(t,e){t.exports="\t\n\v\f\r   ᠎             　\u2028\u2029\ufeff"},"Wo/Y":function(t,e,a){var s=a("USwo"),i=a("d5R0");s(s.S+s.F*(Number.parseInt!=i),"Number",{parseInt:i})},YDBu:function(t,e,a){t.exports={default:a("vQzd"),__esModule:!0}},ZdU5:function(t,e,a){"use strict";a.r(e);var s=a("e4Wq"),i=a.n(s);for(var n in s)["default"].indexOf(n)<0&&function(t){a.d(e,t,function(){return s[t]})}(n);e.default=i.a},d5R0:function(t,e,a){var s=a("7whZ").parseInt,i=a("jM5n").trim,n=a("SUDN"),r=/^[-+]?0[xX]/;t.exports=8!==s(n+"08")||22!==s(n+"0x16")?function(t,e){var a=i(String(t),3);return s(a,e>>>0||(r.test(a)?16:10))}:s},e4Wq:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=_(a("YDBu")),i=_(a("P2sY")),n=_(a("GQeE")),r=_(a("EJiy")),o=_(a("vDqi")),d=a("xCek"),l=a("Jtn0"),c=_(a("DChC")),u=_(a("5Au0"));function _(t){return t&&t.__esModule?t:{default:t}}var h=a("wd/R");e.default={mixins:[c.default],data:function(){return{loading:!1,data:null,isEditing:{date:!1,to_store_id:!1,note:!1},isButtonDisabled:!1,tmp:{},loadingPosting:!1}},components:{stocksTable:u.default},computed:{selectedStore:function(){return this.$store.getters.selectedStore},userStores:function(){return this.$store.state.userStores},token:function(){return this.$store.state.user.token},classBasedOnStatus:function(){var t=void 0;return"P"===this.data.status?t="posted":"X"===this.data.status?t="canceled":"D"===this.data.status&&(t="draft"),t},langId:function(){return this.$store.state.userStores.langId},lang:function(){return this.$store.state.userStores.lang}},methods:{addItem:function(t){var e=this;this.isButtonDisabled=!0,this.itemAdded=!1;var a={pk:this.$route.params.id,product_ids:t.product_ids,qty:t.qty,type:"O"},s={Authorization:"Bearer "+this.token.access_token};(0,o.default)({method:"POST",url:(0,d.baseApi)(this.selectedStore.url_id,this.langId,"stockinouts/additem"),headers:s,data:a}).then(function(t){e.data.items=t.data.data.items,e.isButtonDisabled=!1,e.itemAdded=!0,e.$notify({type:"success",message:"Saved"})}).catch(function(t){e.isButtonDisabled=!1,e.itemAdded=!1;var a=t.response.data.error.error;if("object"===(0,r.default)(t.response.data.error.error)){var s=" ";(0,n.default)(a).forEach(function(t){s=s+" "+a[t]}),a=s}e.$notify({type:"warning",title:t.response.data.error.message,message:a})})},loadData:function(){var t=this;this.loading=!0,(0,l.getDetailOutstanding)(this.$route.params.id).then(function(e){t.data=e.data.data,t.loading=!1,t.tmp=(0,i.default)({},t.data),t.tmp.date=new Date(t.tmp.date)}).catch(function(e){t.loading=!1,t.data={},t.$notify({type:"warning",title:e.response.data.error.message,message:e.response.data.error.error})})},save:function(t){var e=this;this.loading=!0,this.isButtonDisabled=!0;var a="",i={pk:(0,s.default)(this.$route.params.id,0),name:t};"date"===t?(this.$set(i,"value",h(this.tmp.date).format("YYYY-MM-DD")),a=(0,d.baseApi)(this.selectedStore.url_id,this.langId,"stockinouts/updateattr")):"to_store_id"===t?(this.$set(i,"value",this.tmp.to_store_id),a=(0,d.baseApi)(this.selectedStore.url_id,this.langId,"stockinouts/updateattr")):"note"===t&&(this.$set(i,"value",this.tmp.note),a=(0,d.baseApi)(this.selectedStore.url_id,this.langId,"stockinouts/updateattr"));var n={Authorization:"Bearer "+this.token.access_token};(0,o.default)({method:"POST",url:a,headers:n,data:i}).then(function(a){"date"===t?(e.data.fdate=a.data.data.fdate,e.data.date=a.data.data.date,e.isEditing.date=!1):"to_store_id"===t?(e.data.to_store_id=a.data.data.to_store_id,e.data.to_store_name=a.data.data.to_store_name,e.isEditing.to_store_id=!1):"note"===t&&(e.data.note=a.data.data.note,e.isEditing.note=!1),e.loading=!1,e.isButtonDisabled=!1,e.$message({type:"success",message:"saved"})}).catch(function(t){e.loading=!1,e.isButtonDisabled=!1,e.$notify({type:"warning",title:t.response.data.error.message,message:t.response.data.error.error})})},updateStatus:function(t){var e=this;this.loading=!0;var a={Authorization:"Bearer "+this.token.access_token};(0,o.default)({method:"POST",url:(0,d.baseApi)(this.selectedStore.url_id,this.langId,"stockinouts/updatestatus"),headers:a,data:{pk:this.data.id,status:t}}).then(function(t){e.data=t.data.data,e.data.items.map(function(t){null!==t.serials&&(t.fserials=t.serials.split("\n"))}),e.loading=!1,e.tmp=(0,i.default)({},e.data),e.tmp.date=new Date(e.tmp.date),e.$notify({type:"success",title:"Succes Update Data"})}).catch(function(t){e.loading=!1,e.$notify({type:"warning",title:t.response.data.error.message,message:t.response.data.error.error})})},initBlock:function(){this.isEditing.date=!1,this.isEditing.note=!1,this.isEditing.to_store_id=!1},editBlock:function(t){"date"===t?this.isEditing.date=!0:"to_store_id"===t?this.isEditing.to_store_id=!0:"note"===t&&(this.isEditing.note=!0)},cancelEditBlock:function(t){"date"===t?this.isEditing.date=!1:"to_store_id"===t?this.isEditing.to_store_id=!1:"note"===t&&(this.isEditing.note=!1)},itemUpdated:function(t){console.log("seraial",t),this.data.items=t.items,this.data.items.map(function(t){null!==t.serials&&(t.fserials=t.serials.split("\n"),console.log("serial",t.fserials))})},backHandle:function(){this.$router.push({path:"/inventory/stocksoutstanding/"})},handlePrint:function(){this.download("pdf","stockinouts/")},download:function(t,e){var a=this;this.loadingDownload=!0,(0,l.downloadOutstanding)(this.$route.params.id).then(function(e){var s=a.data.trans_no+"_"+t+".pdf",i=window.URL.createObjectURL(new Blob([e.data])),n=document.createElement("a");n.href=i,n.setAttribute("download",s),document.body.appendChild(n),n.click(),a.loadingDownload=!1}).catch(function(t){a.loadingDownload=!1,a.$notify({type:"warning",title:t.response.data.error.message,message:t.response.data.error.error})})},postingData:function(){var t=this;this.loadingPosting=!0,(0,l.postOutstanding)(this.data.in_out_id).then(function(e){t.data=e.data.data,t.loadData(),t.$notify({type:"success",title:"Success",message:"Stok outstanding berhasil dipost ke stok masuk!"}),t.loadingPosting=!1}).catch(function(e){t.loadingPosting=!1,t.data={},t.$notify({type:"warning",title:e.response.data.error.message,message:e.response.data.error.error})})}},mounted:function(){this.loadData()}}},fAuL:function(t,e,a){"use strict";a.r(e);var s=a("0nFj"),i=a.n(s);for(var n in s)["default"].indexOf(n)<0&&function(t){a.d(e,t,function(){return s[t]})}(n);e.default=i.a},jM5n:function(t,e,a){var s=a("USwo"),i=a("yQFZ"),n=a("S4vA"),r=a("SUDN"),o="["+r+"]",d=RegExp("^"+o+o+"*"),l=RegExp(o+o+"*$"),c=function(t,e,a){var i={},o=n(function(){return!!r[t]()||"​"!="​"[t]()}),d=i[t]=o?e(u):r[t];a&&(i[a]=d),s(s.P+s.F*o,"String",i)},u=c.trim=function(t,e){return t=String(i(t)),1&e&&(t=t.replace(d,"")),2&e&&(t=t.replace(l,"")),t};t.exports=c},vQzd:function(t,e,a){a("Wo/Y"),t.exports=a("VSTI").Number.parseInt}}]);