(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-1f74"],{"3wke":function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=d(o("QbLZ")),r=d(o("m1cH")),s=o("xCek"),n=d(o("vDqi")),i=d(o("R4z1")),l=o("4gHt"),c=o("b5sX");function d(t){return t&&t.__esModule?t:{default:t}}var u=o("wd/R");e.default={mixins:[i.default,c.mixinPaginationComponent],data:function(){return{loading:!0,tableData:[],statusValue:null,pages:[{value:5,label:"5 "+this.$store.state.userStores.lang.rows},{value:10,label:"10 "+this.$store.state.userStores.lang.rows},{value:20,label:"20 "+this.$store.state.userStores.lang.rows}],params:{search:null,total:null,currentPage:1,sort_column:"id",sort_type:"desc",per_page:10,page:1,search_text:""},isButtonDisabled:!1,dialogCopyProductStoreList:!1,loadingGetCopyProduct:!1,activeStores:[],storeCopy:{},copyStoreId:"",dataCopyProduct:[],dialogCopyProduct:!1,disableMore:!1,isIndeterminate:!1,checkAllProductToCopy:!1,checkedProductsToCopy:[],loadingSaveCopyProduct:!1,loadingExport:!1}},computed:{labelRow:function(){for(var t=[],e=0,o=0,a=1;a<=200;a++)e=1e3*a-999,o=1e3*a,t.push({value:e+" - "+o,key:a-1,string:e+"_"+o});return t},selectedStore:function(){return this.$store.getters.selectedStore},token:function(){return this.$store.state.user.token},langId:function(){return this.$store.state.userStores.langId},lang:function(){return this.$store.state.userStores.lang},columns:function(){for(var t=[],e=Math.ceil(this.dataCopyProduct.length/this.cols),o=0;o<this.cols;o++)t.push(this.dataCopyProduct.slice(o*e,o*e+e));return t},btnCopy:function(){var t=!0;return t=!(this.checkedProductsToCopy.length>0),t},userStores:function(){return this.$store.getters.stores},stageLevel:function(){return"sit"}},mounted:function(){var t=this;this.checkPersistentMeta(),this.getData(),this.userStores.map(function(e){e.disable||t.activeStores.push(e)})},methods:{getData:function(){var t=this;this.loading=!0;var e={Authorization:"Bearer "+this.token.access_token};(0,n.default)({method:"GET",url:(0,s.baseApi)(this.selectedStore.url_id,this.langId,"productcombo"),params:this.params,headers:e}).then(function(e){t.tableData=e.data.data,t.params.total=e.data.meta.total,t.loading=!1}).catch(function(e){t.tableData=[],t.params.total=0,t.loading=!1,404!==e.response.data.error.status_code&&t.$notify({type:"warning",title:e.response.data.error.message,message:e.response.data.error.error})})},changePageTable:function(t){this.params.per_page=t,this.getData()},handleSearch:function(t){this.params.page=1,this.params.currentPage=1,this.params.search_text="",this.params.search_column=null,this.getData()},changeSortTable:function(t){"ascending"===t.order&&(t.order="asc"),"descending"===t.order&&(t.order="desc"),console.log(t),this.params.sort_type=t.order,this.params.sort_column=t.prop,this.getData()},changeCurrentPage:function(t){this.params.currentPage=t,this.params.page=t,this.getData()},addData:function(){this.$router.push({path:"/catalog/package/create"})},goToSinglePage:function(t){this.$router.push({path:"/catalog/package/"+t.id})},copyDialogList:function(t){t?(this.dialogCopyProductStoreList=!0,this.dialogCopyProduct=!1):this.dialogCopyProductStoreList=!0},getCopyProduct:function(t,e){var o=this;this.loadingGetCopyProduct=!0;var a={};e?a={per_page:20,search_column:"name",search_text:this.params.search_text}:(this.storeCopy=t,this.copyStoreId="",this.copyStoreId=t.store_id,a={per_page:20});var r={Authorization:"Bearer "+this.token.access_token};(0,n.default)({method:"GET",url:(0,s.baseApi)(this.selectedStore.url_id,this.langId,"productcombo/copyfromstore/"+t.store_id),headers:r,params:a}).then(function(t){o.dataCopyProduct=t.data.data,o.dialogCopyProductStoreList=!1,o.dialogCopyProduct=!0,null!==t.data.links.next?(o.disableMore=!0,o.next_page=t.data.links.next):o.disableMore=!1,o.loadingGetCopyProduct=!1}).catch(function(t){console.log(t),o.dataCopyProduct=[],o.loadingGetCopyProduct=!1,o.$notify({type:"warning",title:t.response.data.error.message,message:t.response.data.error.error})})},handleSearchCopy:function(t){t.length>0?this.getCopyProduct(this.storeCopy,!0):this.getCopyProduct(this.storeCopy,!1)},handleCheckAllChange:function(t){var e=[].concat((0,r.default)(this.dataCopyProduct)).slice(0,20);this.checkedProductsToCopy=t?e.map(function(t){return t.id}):[],this.isIndeterminate=!1},saveCopyProduct:function(){var t=this;this.loadingSaveCopyProduct=!0;var e={Authorization:"Bearer "+this.token.access_token},o={store_id:this.copyStoreId,product_combo_id:this.checkedProductsToCopy.join(", ")};(0,n.default)({method:"POST",url:(0,s.baseApi)(this.selectedStore.url_id,this.langId,"productcombo/cloneproductcombofromstore"),headers:e,data:o}).then(function(e){t.loadingSaveCopyProduct=!1,t.dialogCopyProductStoreList=!1,t.checkedProductsToCopy=[];var o=(0,s.baseApi)(t.selectedStore.url_id,t.langId,"product");t.getProducts(o),t.dialogCopyProduct=!1}).catch(function(e){t.$notify({type:"warning",title:e.response.data.error.message,message:e.response.data.error.error}),t.loadingSaveCopyProduct=!1})},handleCheckedProductToCopyChange:function(t){var e=t.length;this.checkAllProductToCopy=e===this.dataCopyProduct.length||20,this.isIndeterminate=!1},loadMore:function(){var t=this;this.loading=!0;var e={Authorization:"Bearer "+this.token.access_token};(0,n.default)({method:"GET",url:this.next_page,headers:e,params:{per_page:20}}).then(function(e){e.data.data.map(function(e){t.dataCopyProduct.push(e)}),null!==e.data.links.next?(t.disableMore=!0,t.next_page=e.data.links.next):t.disableMore=!1,t.loading=!1}).catch(function(e){404!==e.response.data.error.status_code&&t.$notify({type:"warning",title:e.response.data.error.message,message:e.response.data.error.error}),t.loading=!1})},handleClick:function(t){var e=this;this.loadingExport=!0,this.loading=!0;var o=(0,a.default)({},this.params);o.p=t.key,(0,l.exportPackage)(o).then(function(o){console.log("r",o);var a="product_package-"+t.string+"-"+u().format("YYYY-MM-DD")+"__.xlsx";console.log("r",a);var r=window.URL.createObjectURL(new Blob([o.data])),s=document.createElement("a");s.href=r,s.setAttribute("download",a),document.body.appendChild(s),s.click(),e.loadingExport=!1,e.loading=!1}).catch(function(t){console.log(t,"error"),e.loadingExport=!1,e.loading=!1})}}}},"4gHt":function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.fetchSingle=function(t){return(0,a.service)({url:"/productcombo/"+t})},e.fetchProductPackage=function(t){return(0,a.service)({url:"/productcombo/",params:t})},e.copyPackage=function(t){return(0,a.service)({url:"/productcombo/copy",method:"POST",data:t})},e.exportPackage=function(t){return(0,a.service)({url:"/productcombo/excel",method:"GET",responseType:"blob",params:t})},e.estimatePrice=function(t){return(0,a.service)({url:"/estimatepriceproduct",method:"POST",data:t})};var a=o("xCek")},"8jOc":function(t,e,o){"use strict";o.d(e,"a",function(){return a}),o.d(e,"b",function(){return r});var a=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",[o("div",{staticClass:"main-content"},[o("div",{staticClass:"table-handler-flex"},[o("div",{staticClass:"flex-grow-1"},[o("h4",{staticClass:"main-content__title"},[t._v(t._s(t.$lang[t.langId].list)+" "+t._s(t.lang.product_combo))]),t._v(" "),o("p",{staticClass:"main-content__subtitle"},[t._v(t._s(t.params.total)+" "+t._s(t.lang.product_combo))])]),t._v(" "),o("div",[0===t.$store.getters.selectedStore.pos_freemium||1===t.selectedStore.is_onlineshop?o("button-action-authenticated",{attrs:{permission:["catalog/productcombo","store"]},on:{click:function(e){return t.copyDialogList(!1)}}},[o("svg-icon",{attrs:{"icon-class":"copy-product"}}),t._v(" "+t._s(t.$lang[t.langId].copy_package_product)+"\n        ")],1):t._e(),t._v(" "),"sit"===t.stageLevel||"dev"===t.stageLevel?o("el-dropdown",{staticClass:"px-4",on:{command:t.handleClick}},[o("button-action-authenticated",{attrs:{permission:["catalog/productcombo","show"],loading:t.loadingExport,type:"primary"}},[t._v("\n            Export Excel"),o("i",{staticClass:"el-icon-arrow-down el-icon--right"})]),t._v(" "),o("el-dropdown-menu",{staticStyle:{"overflow-y":"scroll",height:"300px"},attrs:{slot:"dropdown"},slot:"dropdown"},t._l(t.labelRow,function(e){return o("el-dropdown-item",{key:e.key,attrs:{command:e}},[t._v(t._s(t.lang.rows)+" "+t._s(e.value))])}),1)],1):t._e(),t._v(" "),o("button-action-authenticated",{attrs:{permission:["catalog/productcombo","store"],type:"primary",icon:"el-icon-plus"},on:{click:t.addData}},[t._v("\n          "+t._s(t.lang.add)+"\n        ")])],1)]),t._v(" "),o("div",{staticClass:"table-handler-flex sticky-top-has-submenu"},[o("div",{staticClass:"mb-12",staticStyle:{"flex-grow":"1"}},[o("el-select",{staticClass:"inline-form",attrs:{filterable:"",placeholder:t.lang.please_select,size:"small"},on:{change:t.changePageTable},model:{value:t.params.per_page,callback:function(e){t.$set(t.params,"per_page",e)},expression:"params.per_page"}},t._l(t.pages,function(t){return o("el-option",{key:t.value,attrs:{label:t.label,value:t.value}})}),1)],1),t._v(" "),o("div",{staticClass:"mb-12"},[o("el-input",{staticClass:"inline-form input-search",attrs:{placeholder:t.lang.search,clearable:"","prefix-icon":"el-icon-search",size:"small"},on:{change:t.handleSearch},model:{value:t.params.search,callback:function(e){t.$set(t.params,"search",e)},expression:"params.search"}})],1)]),t._v(" "),o("el-divider"),t._v(" "),t.lang.product_name?o("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],attrs:{data:t.tableData,stripe:""},on:{"sort-change":t.changeSortTable}},[o("el-table-column",{attrs:{label:t.lang.product_name,"min-width":"160"},scopedSlots:t._u([{key:"default",fn:function(e){return[o("div",{staticClass:"flex-container pointer",on:{click:function(o){return t.goToSinglePage(e.row)}}},[e.row.photo_xs?o("el-image",{staticStyle:{width:"50px",height:"50px","border-radius":"50%","margin-right":"8px"},attrs:{src:e.row.photo_xs,fit:"cover"}}):t._e(),t._v(" "),o("strong",[t._v(t._s(e.row.name))])],1)]}}],null,!1,1880626351)}),t._v(" "),o("el-table-column",{attrs:{prop:"stock_qty",sortable:"",label:t.lang.qty,width:"120"}}),t._v(" "),o("el-table-column",{attrs:{prop:"fsell_price",sortable:"",label:t.lang.online_selling_price,width:"160"}}),t._v(" "),o("el-table-column",{attrs:{prop:"fsell_price_pos",sortable:"",label:t.lang.offline_selling_price,width:"140"}}),t._v(" "),o("el-table-column",{attrs:{prop:"published_date",sortable:"",label:t.lang.publish,width:"140"}}),t._v(" "),"dev"===t.stageLevel||"sit"===t.stageLevel?o("el-table-column",{attrs:{fixed:"right",align:"center",width:"40px"},scopedSlots:t._u([{key:"default",fn:function(e){return[o("el-dropdown",{attrs:{trigger:"click"}},[o("el-button",{staticStyle:{color:"#909399"},attrs:{type:"text",icon:"el-icon-more"}}),t._v(" "),o("el-dropdown-menu",{staticStyle:{"background-color":"#F2F2F2"},attrs:{slot:"dropdown"},slot:"dropdown"},[o("router-link",{attrs:{to:{name:"Package Copy",params:{id:e.row.id,copy:!0}}}},[o("el-dropdown-item",[o("el-button",{staticStyle:{color:"#000000"},attrs:{type:"text"}},[o("svg-icon",{attrs:{"icon-class":"file-text"}}),t._v("\n                    "+t._s(t.$lang[t.langId].copy)+"\n                  ")],1)],1)],1)],1)],1)]}}],null,!1,4100794139)}):t._e()],1):t._e(),t._v(" "),o("pagination",{attrs:{params:t.params},on:{"size-change":t.changePageTable,"current-change":t.changeCurrentPage}})],1),t._v(" "),o("el-dialog",{attrs:{visible:t.dialogCopyProductStoreList,title:"Copy Product"},on:{"update:visible":function(e){t.dialogCopyProductStoreList=e}}},[o("div",{directives:[{name:"loading",rawName:"v-loading",value:t.loadingGetCopyProduct,expression:"loadingGetCopyProduct"}]},t._l(t.activeStores,function(e){return o("div",{key:e.store_id,staticClass:"box-in-loop pointer",on:{click:function(o){return t.getCopyProduct(e,!1)}}},[e.disable?t._e():o("div",{staticClass:"flex-container"},[o("el-avatar",{staticStyle:{"flex-basis":"32px","min-width":"32px"},attrs:{src:e.logo,size:32}}),t._v(" "),o("div",{staticClass:"ml-8",staticStyle:{"flex-grow":"2"}},[t._v(t._s(e.name))]),t._v(" "),o("el-button",{attrs:{round:"",type:"text",size:"small",icon:"el-icon-arrow-right"}})],1)])}),0)]),t._v(" "),o("el-dialog",{attrs:{visible:t.dialogCopyProduct,"destroy-on-close":!0,"show-close":!1,fullscreen:"","custom-class":"unset-border-radius pos-relative"},on:{"update:visible":function(e){t.dialogCopyProduct=e}}},[o("div",{attrs:{slot:"title"},slot:"title"},[o("div",[t._v(t._s(t.lang.copy_from_store))]),t._v(" "),o("el-button",{staticClass:"btn-block mb-12",on:{click:function(e){return t.copyDialogList(!0)}}},[o("div",{staticClass:"flex-container"},[o("el-avatar",{attrs:{src:t.storeCopy.logo}}),t._v(" "),o("div",[t._v("\n            "+t._s(t.storeCopy.name)+"\n            "),o("i",{staticClass:"el-icon-caret-bottom"})])],1)])],1),t._v(" "),o("div",{staticStyle:{"padding-bottom":"40px"}},[o("el-input",{staticClass:"mb-24 bg-f5",attrs:{placeholder:t.lang.search,clearable:"","prefix-icon":"el-icon-search"},on:{change:t.handleSearchCopy},model:{value:t.params.search_text,callback:function(e){t.$set(t.params,"search_text",e)},expression:"params.search_text"}}),t._v(" "),o("div",{staticClass:"mb-12"},[o("div",{staticClass:"mb-12"},[o("el-checkbox",{attrs:{indeterminate:t.isIndeterminate},on:{change:t.handleCheckAllChange},model:{value:t.checkAllProductToCopy,callback:function(e){t.checkAllProductToCopy=e},expression:"checkAllProductToCopy"}},[t._v("\n            "+t._s(t.$lang[t.langId].copy_all)+"\n          ")])],1),t._v(" "),o("div",[o("el-checkbox-group",{staticClass:"flex-container flex-container--wrap",attrs:{max:20},on:{change:t.handleCheckedProductToCopyChange},model:{value:t.checkedProductsToCopy,callback:function(e){t.checkedProductsToCopy=e},expression:"checkedProductsToCopy"}},t._l(t.dataCopyProduct,function(e){return o("div",{key:e.id,staticClass:"flex-grid-2 px-12"},[o("el-checkbox",{staticClass:"p-8 unset-height block checkbox-right",attrs:{label:e.id,border:""}},[o("div",{staticClass:"font-14 font-bold overflow-ellipsis"},[t._v("\n                  "+t._s(e.name)+"\n                ")])])],1)}),0)],1)]),t._v(" "),t.disableMore?o("div",[o("el-button",{staticClass:"btn-block",attrs:{icon:"el-icon-arrow-down"},on:{click:t.loadMore}},[t._v("\n          "+t._s(t.$lang[t.langId].load_more)+"\n        ")])],1):t._e()],1),t._v(" "),o("el-button",{staticClass:"btn-save-copy-product",attrs:{loading:t.loadingSaveCopyProduct,disabled:t.btnCopy,type:"success"},on:{click:t.saveCopyProduct}},[t._v("\n      "+t._s(t.lang.save)+"\n    ")])],1)],1)},r=[]},R4z1:function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=function(t){return t&&t.__esModule?t:{default:t}}(o("QbLZ"));var r={watch:{params:{deep:!0,handler:function(t){this.$store.dispatch("setParam",{path:this.$route.name,params:(0,a.default)({},t)})}}},methods:{checkPersistentMeta:function(){this.$route.meta&&this.$route.meta.persistent_param&&(this.$store.state.requestParam.param[this.$route.name]?this.params=(0,a.default)({},this.$store.state.requestParam.param[this.$route.name]):this.$store.dispatch("setParam",{path:this.$route.name,params:(0,a.default)({},this.params)}))}}};e.default=r},Y5bG:function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.scrollTo=function(t,e,o){var r=document.documentElement.scrollTop||document.body.parentNode.scrollTop||document.body.scrollTop,s=t-r,n=0;e=void 0===e?500:e,function t(){n+=20;var i=Math.easeInOutQuad(n,r,s,e);!function(t){document.documentElement.scrollTop=t,document.body.parentNode.scrollTop=t,document.body.scrollTop=t}(i),n<e?a(t):o&&"function"==typeof o&&o()}()},Math.easeInOutQuad=function(t,e,o,a){return(t/=a/2)<1?o/2*t*t+e:-o/2*(--t*(t-2)-1)+e};var a=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(t){window.setTimeout(t,1e3/60)}},Z2Hx:function(t,e,o){"use strict";o.r(e);var a=o("8jOc"),r=o("ysio");for(var s in r)["default"].indexOf(s)<0&&function(t){o.d(e,t,function(){return r[t]})}(s);var n=o("KHd+"),i=Object(n.a)(r.default,a.a,a.b,!1,null,null,null);i.options.__file="Index.vue",e.default=i.exports},b5sX:function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.mixinPaginationComponent=void 0;var a={components:{Pagination:function(t){return t&&t.__esModule?t:{default:t}}(o("F5n6")).default}};e.mixinPaginationComponent=a},ysio:function(t,e,o){"use strict";o.r(e);var a=o("3wke"),r=o.n(a);for(var s in a)["default"].indexOf(s)<0&&function(t){o.d(e,t,function(){return a[t]})}(s);e.default=r.a}}]);