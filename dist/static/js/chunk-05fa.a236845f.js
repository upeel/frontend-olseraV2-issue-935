(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-05fa"],{DChC:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=r(a("QbLZ")),n=r(a("Ljqw"));function r(t){return t&&t.__esModule?t:{default:t}}var s={mixins:[a("6y4V").checkCustomPermission],computed:{selectedStore:function(){return this.$store.getters.selectedStore},token:function(){return this.$store.state.user.token},langId:function(){return this.$store.state.userStores.langId},lang:function(){return this.$store.state.userStores?this.$store.state.userStores.lang:{}},userRole:function(){var t=this.$store.getters.selectedStore;return{role_id:t.role_id,role_name:t.role_name,is_pos_only:t.is_pos_only,is_mobile:t.is_mobile}},rootLang:function(){return this.$lang[this.langId]},headers:function(){var t=this.$store.getters.token;return this.$store.getters.webviewMode&&(t=this.$store.getters.webviewToken),{Authorization:"Bearer "+t.access_token}},baseURL:function(){return n.default},loggedInUser:function(){return this.$store.state.user.loggedInUser},stageLevel:function(){return"sit"},defaultAccessByStore:function(){return["setdemo1","allinolsera2"]},wejayafoodAccessByStore:function(){return["setdemo1","allinolsera2","ayammrotholpusat","ayammrotholdramaga"]},saveToAllAccessStore:function(){return["setdemo1","allinolsera2","siliwangidutagarden","barokahfrozenfood"]},outlets:function(){var t=[{name:this.$store.state.userStores.lang.all,store_id:0,url_id:"all"}],e=[];return this.$store.getters.stores.map(function(a){e.includes(a.store_id)||a.is_store_active&&(t.push((0,i.default)({},a)),e.push(a.store_id))}),t},tokopediaActiveStore:function(){return this.$store.state.tokopediaActiveStore},shopeeActiveStore:function(){return this.$store.state.shopeeActiveStore}}};e.default=s},EXcd:function(t,e,a){"use strict";a.r(e);var i=a("wi6L"),n=a("JcSy");for(var r in n)["default"].indexOf(r)<0&&function(t){a.d(e,t,function(){return n[t]})}(r);var s=a("KHd+"),o=Object(s.a)(n.default,i.a,i.b,!1,null,null,null);o.options.__file="_historyFunding.vue",e.default=o.exports},Gl82:function(t,e,a){"use strict";a.r(e);var i=a("bfdr"),n=a.n(i);for(var r in i)["default"].indexOf(r)<0&&function(t){a.d(e,t,function(){return i[t]})}(r);e.default=n.a},JcSy:function(t,e,a){"use strict";a.r(e);var i=a("uv3q"),n=a.n(i);for(var r in i)["default"].indexOf(r)<0&&function(t){a.d(e,t,function(){return i[t]})}(r);e.default=n.a},"YR/C":function(t,e,a){"use strict";a.r(e);var i=a("fYo0"),n=a("Gl82");for(var r in n)["default"].indexOf(r)<0&&function(t){a.d(e,t,function(){return n[t]})}(r);var s=a("KHd+"),o=Object(s.a)(n.default,i.a,i.b,!1,null,null,null);o.options.__file="_listFunding.vue",e.default=o.exports},bfdr:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=c(a("14Xm")),n=c(a("D3Ub")),r=c(a("DChC")),s=c(a("ulFf")),o=c(a("kGIl")),l=c(a("r7om")),u=a("zTvW");function c(t){return t&&t.__esModule?t:{default:t}}var d=a("wd/R");e.default={name:"listBFISubmission",mixins:[r.default,s.default],components:{CustomDateFilter:l.default,Loading:o.default},computed:{},data:function(){return{dataBFI:[],isLoading:!1,showFilter:!1,labelDate:"",params:{start_date:d().format("yyyy-MM-DD"),end_date:d().format("yyyy-MM-DD")}}},mounted:function(){this.params.start_date=d().format("YYYY-MM-DD"),this.params.end_date=d().format("YYYY-MM-DD"),this.labelDate=this.$lang[this.langId].today+"\n"+d(this.params.start_date).format("DD MMM YYYY")+" - "+d(this.params.end_date).format("DD MMM YYYY"),this.getFunding()},methods:{getFunding:function(){var t=this;this.isLoading=!0;var e=this.params;(0,u.bfiStore)(e).then(function(){var e=(0,n.default)(i.default.mark(function e(a){return i.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:t.isLoading=!1,t.dataBFI=a.data.data.submission_req,t.$emit("bfiId",a.data.data.id);case 3:case"end":return e.stop()}},e,t)}));return function(t){return e.apply(this,arguments)}}()).catch(function(e){t.isLoading=!1,t.$message({type:"error",message:e.string})})},setLabelFilter:function(t){"today"===t.labelForDate?this.labelDate=this.$lang[this.langId].today+"\n"+d(this.params.start_date).format("DD MMM YYYY")+" - "+d(this.params.end_date).format("DD MMM YYYY"):"yesterday"===t.labelForDate?this.labelDate=this.$lang[this.langId].yesterday+"\n"+d(this.params.start_date).format("DD MMM YYYY")+" - "+d(this.params.end_date).format("DD MMM YYYY"):"weekago"===t.labelForDate?this.labelDate=this.$lang[this.langId].a_week_ago+"\n"+d(this.params.start_date).format("DD MMM YYYY")+" - "+d(this.params.end_date).format("DD MMM YYYY"):"monthago"===t.labelForDate?this.labelDate=this.$lang[this.langId].a_month_ago+"\n"+d(this.params.start_date).format("DD MMM YYYY")+" - "+d(this.params.end_date).format("DD MMM YYYY"):"thismonth"===t.labelForDate?this.labelDate=this.$lang[this.langId].this_month+"\n"+d(this.params.start_date).format("DD MMM YYYY")+" - "+d(this.params.end_date).format("DD MMM YYYY"):"lastmonth"===t.labelForDate?this.labelDate=this.$lang[this.langId].last_month+"\n"+d(this.params.start_date).format("DD MMM YYYY")+" - "+d(this.params.end_date).format("DD MMM YYYY"):"custom"===t.labelForDate&&(this.labelDate=this.$lang[this.langId].custom+"\n"+d(this.params.start_date).format("DD MMM YYYY")+" - "+d(this.params.end_date).format("DD MMM YYYY"))},toggleFilter:function(){this.showFilter?this.showFilter=!1:this.showFilter=!0},dateFilterClose:function(){this.showFilter=!1},dateFilterReset:function(t){this.labelDate=this.$lang[this.langId].today+"\n"+d().format("DD MMM YYYY")+" - "+d().format("DD MMM YYYY"),this.params.start_date=d().format("YYYY-MM-DD"),this.params.end_date=d().format("YYYY-MM-DD"),this.dateFilterClose(),this.getFunding()},dateFilterSave:function(t){this.params.start_date=t.startDate,this.params.end_date=t.endDate,this.dateFilterClose(),this.setLabelFilter(t),this.getFunding()}}}},fYo0:function(t,e,a){"use strict";a.d(e,"a",function(){return i}),a.d(e,"b",function(){return n});var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("div",{staticClass:"row"},[a("div",{staticClass:"col-xs-12 col-lg-6 col-md-6 col-sm-6 font-20 lh-2 text-left"},[t._v("\n      "+t._s(t.rootLang.loan_history)+"\n    ")]),t._v(" "),a("div",{staticClass:"col-xs-12 col-lg-6 col-md-6 col-sm-6"},[a("el-button",{staticClass:"date-filter-dashboard",staticStyle:{"margin-right":"7px",float:"right"},attrs:{size:"small"},on:{click:t.toggleFilter}},[a("i",{staticClass:"fa fa-filter"}),t._v(" "),a("span",[t._v(t._s(t.labelDate))])])],1)]),t._v(" "),a("div",{staticStyle:{"margin-top":"24px"}},[!1===t.isLoading?a("div",{staticStyle:{border:"1px solid #f5f5f5","border-radius":"3px"}},[a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.isLoading,expression:"isLoading"}],ref:"multipleTable",staticClass:"product-table-max-height mobile-fix-height-unset",attrs:{data:t.dataBFI,stripe:""}},[a("el-table-column",{attrs:{prop:"submission_date",label:t.lang.date,width:"130"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v("\n            "+t._s(e.row.fsubmission_date)+"\n          ")]}}],null,!1,1778903896)}),t._v(" "),a("el-table-column",{attrs:{label:t.rootLang.plafond,prop:"tenor"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",[t._v(t._s(e.row.tenor)+" "+t._s(t.rootLang.months))])]}}],null,!1,2567275142)}),t._v(" "),a("el-table-column",{attrs:{label:t.rootLang.submissions_amount,prop:"amount"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",[t._v(t._s(e.row.famount))])]}}],null,!1,4160942540)}),t._v(" "),a("el-table-column",{attrs:{label:t.rootLang.installment,prop:"installment_amount"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",[t._v(t._s(e.row.finstallment_amount))])]}}],null,!1,845592288)}),t._v(" "),a("el-table-column",{attrs:{label:t.lang.status,prop:"submission_status"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",[t._v(t._s(t.capitalize(e.row.submission_status)))])]}}],null,!1,136855440)})],1)],1):a("div",{staticStyle:{"margin-top":"60px"}},[a("loading",{attrs:{align:"center",active:!0,color:"#1bb4e6",loader:"spinner",width:32,height:32,backgroundColor:"#ffffff"}})],1)]),t._v(" "),a("custom-date-filter",{attrs:{"show-filter":t.showFilter},on:{close:t.dateFilterClose,reset:t.dateFilterReset,save:t.dateFilterSave}})],1)},n=[]},kGIl:function(t,e,a){"undefined"!=typeof self&&self,t.exports=function(t){var e={};function a(i){if(e[i])return e[i].exports;var n=e[i]={i:i,l:!1,exports:{}};return t[i].call(n.exports,n,n.exports,a),n.l=!0,n.exports}return a.m=t,a.c=e,a.d=function(t,e,i){a.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},a.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},a.t=function(t,e){if(1&e&&(t=a(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(a.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)a.d(i,n,function(e){return t[e]}.bind(null,n));return i},a.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return a.d(e,"a",e),e},a.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},a.p="",a(a.s=1)}([function(t,e,a){},function(t,e,a){"use strict";a.r(e);var i="undefined"!=typeof window?window.HTMLElement:Object,n={mounted:function(){this.enforceFocus&&document.addEventListener("focusin",this.focusIn)},methods:{focusIn:function(t){if(this.isActive&&t.target!==this.$el&&!this.$el.contains(t.target)){var e=this.container?this.container:this.isFullPage?null:this.$el.parentElement;(this.isFullPage||e&&e.contains(t.target))&&(t.preventDefault(),this.$el.focus())}}},beforeDestroy:function(){document.removeEventListener("focusin",this.focusIn)}};function r(t,e,a,i,n,r,s,o){var l,u="function"==typeof t?t.options:t;if(e&&(u.render=e,u.staticRenderFns=a,u._compiled=!0),i&&(u.functional=!0),r&&(u._scopeId="data-v-"+r),s?(l=function(t){(t=t||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext)||"undefined"==typeof __VUE_SSR_CONTEXT__||(t=__VUE_SSR_CONTEXT__),n&&n.call(this,t),t&&t._registeredComponents&&t._registeredComponents.add(s)},u._ssrRegister=l):n&&(l=o?function(){n.call(this,(u.functional?this.parent:this).$root.$options.shadowRoot)}:n),l)if(u.functional){u._injectStyles=l;var c=u.render;u.render=function(t,e){return l.call(e),c(t,e)}}else{var d=u.beforeCreate;u.beforeCreate=d?[].concat(d,l):[l]}return{exports:t,options:u}}var s=r({name:"spinner",props:{color:{type:String,default:"#000"},height:{type:Number,default:64},width:{type:Number,default:64}}},function(){var t=this.$createElement,e=this._self._c||t;return e("svg",{attrs:{viewBox:"0 0 38 38",xmlns:"http://www.w3.org/2000/svg",width:this.width,height:this.height,stroke:this.color}},[e("g",{attrs:{fill:"none","fill-rule":"evenodd"}},[e("g",{attrs:{transform:"translate(1 1)","stroke-width":"2"}},[e("circle",{attrs:{"stroke-opacity":".25",cx:"18",cy:"18",r:"18"}}),e("path",{attrs:{d:"M36 18c0-9.94-8.06-18-18-18"}},[e("animateTransform",{attrs:{attributeName:"transform",type:"rotate",from:"0 18 18",to:"360 18 18",dur:"0.8s",repeatCount:"indefinite"}})],1)])])])},[],!1,null,null,null).exports,o=r({name:"dots",props:{color:{type:String,default:"#000"},height:{type:Number,default:240},width:{type:Number,default:60}}},function(){var t=this.$createElement,e=this._self._c||t;return e("svg",{attrs:{viewBox:"0 0 120 30",xmlns:"http://www.w3.org/2000/svg",fill:this.color,width:this.width,height:this.height}},[e("circle",{attrs:{cx:"15",cy:"15",r:"15"}},[e("animate",{attrs:{attributeName:"r",from:"15",to:"15",begin:"0s",dur:"0.8s",values:"15;9;15",calcMode:"linear",repeatCount:"indefinite"}}),e("animate",{attrs:{attributeName:"fill-opacity",from:"1",to:"1",begin:"0s",dur:"0.8s",values:"1;.5;1",calcMode:"linear",repeatCount:"indefinite"}})]),e("circle",{attrs:{cx:"60",cy:"15",r:"9","fill-opacity":"0.3"}},[e("animate",{attrs:{attributeName:"r",from:"9",to:"9",begin:"0s",dur:"0.8s",values:"9;15;9",calcMode:"linear",repeatCount:"indefinite"}}),e("animate",{attrs:{attributeName:"fill-opacity",from:"0.5",to:"0.5",begin:"0s",dur:"0.8s",values:".5;1;.5",calcMode:"linear",repeatCount:"indefinite"}})]),e("circle",{attrs:{cx:"105",cy:"15",r:"15"}},[e("animate",{attrs:{attributeName:"r",from:"15",to:"15",begin:"0s",dur:"0.8s",values:"15;9;15",calcMode:"linear",repeatCount:"indefinite"}}),e("animate",{attrs:{attributeName:"fill-opacity",from:"1",to:"1",begin:"0s",dur:"0.8s",values:"1;.5;1",calcMode:"linear",repeatCount:"indefinite"}})])])},[],!1,null,null,null).exports,l=r({name:"bars",props:{color:{type:String,default:"#000"},height:{type:Number,default:40},width:{type:Number,default:40}}},function(){var t=this.$createElement,e=this._self._c||t;return e("svg",{attrs:{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 30 30",height:this.height,width:this.width,fill:this.color}},[e("rect",{attrs:{x:"0",y:"13",width:"4",height:"5"}},[e("animate",{attrs:{attributeName:"height",attributeType:"XML",values:"5;21;5",begin:"0s",dur:"0.6s",repeatCount:"indefinite"}}),e("animate",{attrs:{attributeName:"y",attributeType:"XML",values:"13; 5; 13",begin:"0s",dur:"0.6s",repeatCount:"indefinite"}})]),e("rect",{attrs:{x:"10",y:"13",width:"4",height:"5"}},[e("animate",{attrs:{attributeName:"height",attributeType:"XML",values:"5;21;5",begin:"0.15s",dur:"0.6s",repeatCount:"indefinite"}}),e("animate",{attrs:{attributeName:"y",attributeType:"XML",values:"13; 5; 13",begin:"0.15s",dur:"0.6s",repeatCount:"indefinite"}})]),e("rect",{attrs:{x:"20",y:"13",width:"4",height:"5"}},[e("animate",{attrs:{attributeName:"height",attributeType:"XML",values:"5;21;5",begin:"0.3s",dur:"0.6s",repeatCount:"indefinite"}}),e("animate",{attrs:{attributeName:"y",attributeType:"XML",values:"13; 5; 13",begin:"0.3s",dur:"0.6s",repeatCount:"indefinite"}})])])},[],!1,null,null,null).exports,u=r({name:"vue-loading",mixins:[n],props:{active:Boolean,programmatic:Boolean,container:[Object,Function,i],isFullPage:{type:Boolean,default:!0},enforceFocus:{type:Boolean,default:!0},lockScroll:{type:Boolean,default:!1},transition:{type:String,default:"fade"},canCancel:Boolean,onCancel:{type:Function,default:function(){}},color:String,backgroundColor:String,blur:{type:String,default:"2px"},opacity:Number,width:Number,height:Number,zIndex:Number,loader:{type:String,default:"spinner"}},data:function(){return{isActive:this.active}},components:{Spinner:s,Dots:o,Bars:l},beforeMount:function(){this.programmatic&&(this.container?(this.isFullPage=!1,this.container.appendChild(this.$el)):document.body.appendChild(this.$el))},mounted:function(){this.programmatic&&(this.isActive=!0),document.addEventListener("keyup",this.keyPress)},methods:{cancel:function(){this.canCancel&&this.isActive&&(this.hide(),this.onCancel.apply(null,arguments))},hide:function(){var t=this;this.$emit("hide"),this.$emit("update:active",!1),this.programmatic&&(this.isActive=!1,setTimeout(function(){var e;t.$destroy(),void 0!==(e=t.$el).remove?e.remove():e.parentNode.removeChild(e)},150))},disableScroll:function(){this.isFullPage&&this.lockScroll&&document.body.classList.add("vld-shown")},enableScroll:function(){this.isFullPage&&this.lockScroll&&document.body.classList.remove("vld-shown")},keyPress:function(t){27===t.keyCode&&this.cancel()}},watch:{active:function(t){this.isActive=t},isActive:function(t){t?this.disableScroll():this.enableScroll()}},computed:{bgStyle:function(){return{background:this.backgroundColor,opacity:this.opacity,backdropFilter:"blur(".concat(this.blur,")")}}},beforeDestroy:function(){document.removeEventListener("keyup",this.keyPress)}},function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("transition",{attrs:{name:t.transition}},[a("div",{directives:[{name:"show",rawName:"v-show",value:t.isActive,expression:"isActive"}],staticClass:"vld-overlay is-active",class:{"is-full-page":t.isFullPage},style:{zIndex:t.zIndex},attrs:{tabindex:"0","aria-busy":t.isActive,"aria-label":"Loading"}},[a("div",{staticClass:"vld-background",style:t.bgStyle,on:{click:function(e){return e.preventDefault(),t.cancel(e)}}}),a("div",{staticClass:"vld-icon"},[t._t("before"),t._t("default",[a(t.loader,{tag:"component",attrs:{color:t.color,width:t.width,height:t.height}})]),t._t("after")],2)])])},[],!1,null,null,null).exports;a(0),u.install=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},i=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return{show:function(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:e,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:a,r=Object.assign({},e,i,{programmatic:!0}),s=new(t.extend(u))({el:document.createElement("div"),propsData:r}),o=Object.assign({},a,n);return Object.keys(o).map(function(t){s.$slots[t]=o[t]}),s}}}(t,e,a);t.$loading=i,t.prototype.$loading=i},e.default=u}]).default},ulFf:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=o(a("GQeE")),n=o(a("EJiy")),r=a("xCek"),s=o(a("vDqi"));function o(t){return t&&t.__esModule?t:{default:t}}var l=a("wd/R"),u={computed:{},data:function(){return{isSetup:"",dialogSetup:!1}},methods:{accountSetup:function(){var t=this,e={Authorization:"Bearer "+this.token.access_token};(0,s.default)({method:"GET",url:(0,r.baseApi)(this.selectedStore.url_id,this.langId,"account/setup"),headers:e}).then(function(e){t.isSetup=e.data.account_setup}).catch(function(e){if("object"===(0,n.default)(e.response.data.error.error)){var a=(0,i.default)(e.response.data.error.error)[0];t.$notify({tipe:"warning",title:e.response.data.error.message,message:e.response.data.error.error[a][0]})}else t.$notify({tipe:"warning",title:e.response.data.error.message,message:e.response.data.error.error})})},finishSetup:function(){this.dialogSetup=!1,this.accountSetup()},capitalize:function(t){var e="";return t&&(e=t[0].toUpperCase()+t.slice(1)),e},capitalEachWord:function(t){var e="";if(t){var a="";a=t.split(" ");for(var i=0;i<a.length;i++)a[i]=a[i][0].toUpperCase()+a[i].substr(1);e=a.join(" ")}return e},formatPrice:function(t){return(t/1).toFixed(0).replace(".",",").toString().replace(/\B(?=(\d{3})+(?!\d))/g,".")},formatPriceDecimal:function(t){return(t/1).toFixed(2).replace(".",",").toString().replace(/\B(?=(\d{3})+(?!\d))/g,".")},indexNumber:function(t,e,a){return e*a+(t+1)-e},dateFormat:function(t){return l(t).format("DD MMM YYYY")},checkDate:function(t){var e=l(t),a=l();return!(e.diff(a)>0)}}};e.default=u},uv3q:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=l(a("14Xm")),n=l(a("D3Ub")),r=l(a("YR/C")),s=l(a("DChC")),o=a("zTvW");function l(t){return t&&t.__esModule?t:{default:t}}e.default={name:"dialogBFIFunding",mixins:[s.default],components:{fundingList:r.default},computed:{},mounted:function(){},data:function(){return{showHistory:!0,bfi_id:"",loadingCheck:!1}},methods:{handleSelectMonth:function(){},IdBFI:function(t){this.bfi_id=t},submitAgain:function(){var t=this;this.loadingCheck=!0,(0,o.bfiStore)().then(function(){var e=(0,n.default)(i.default.mark(function e(a){var n;return i.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:t.loadingCheck=!1,"Approved"===(n=a.data.data).submission_req[0].submission_status||"Rejected"===n.submission_req[0].submission_status?t.$router.push({path:"/service-activation-v2/bfi-finance",query:{bfi_id:n.id}}):t.$message({type:"error",message:t.rootLang.loan_on_progress});case 3:case"end":return e.stop()}},e,t)}));return function(t){return e.apply(this,arguments)}}()).catch(function(e){t.loadingCheck=!1,t.$message({type:"error",message:e.string})})},closeDetail:function(){this.$router.push({path:"/service-activation-v2"}),this.$router.go()}}}},wi6L:function(t,e,a){"use strict";a.d(e,"a",function(){return i}),a.d(e,"b",function(){return n});var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("el-dialog",{attrs:{visible:t.showHistory,"show-close":!1,fullscreen:"",width:"80%","custom-class":"dialog-card"},on:{"update:visible":function(e){t.showHistory=e}}},[a("div",{staticClass:"flex-container",staticStyle:{"text-align":"center"},attrs:{slot:"title"},slot:"title"},[a("el-row",{staticStyle:{width:"100%"},attrs:{gutter:20}},[a("el-col",{attrs:{xs:3,sm:2,md:1,lg:1,xl:1,align:"left"}},[a("label",{staticClass:"font-24 pointer",on:{click:t.closeDetail}},[a("svg-icon",{attrs:{"icon-class":"arrow-left"}})],1)]),t._v(" "),a("el-col",{attrs:{xs:21,sm:22,md:23,lg:23,xl:23,align:"center"}},[a("h4",{staticClass:"dialog-title font-24"},[t._v("BFI Finance")])])],1)],1),t._v(" "),a("div",{staticClass:"col-lg-12",staticStyle:{padding:"0"}},[a("div",{staticClass:"col-lg-8",staticStyle:{float:"none",margin:"auto"}},[a("div",{staticClass:"like-table-wrapper mb-16",staticStyle:{"box-shadow":"0px 2px 2px 2px #0503031f"}},[a("div",{staticClass:"like-table-wrapper--item pointer"},[a("el-avatar",{staticClass:"mr-4",attrs:{src:this.$route.query.data.photo}}),t._v(" "),a("div",{staticClass:"font-14 font-semi-bold",staticStyle:{"flex-grow":"1"}},[t._v("\n              "+t._s(this.$route.query.data.alias_name)+"\n            ")]),t._v(" "),a("el-button",{staticClass:"color-bfi--bg color-white",attrs:{loading:t.loadingCheck},on:{click:t.submitAgain}},[t._v(t._s(t.rootLang.submit_again)+" "),a("i",{staticClass:"el-icon-arrow-right"})])],1)]),t._v(" "),a("funding-list",{on:{bfiId:t.IdBFI}})],1)])])],1)},n=[]},zTvW:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.installCall=function(t){return(0,i.service)({url:"/bfi-installment",method:"POST",data:t})},e.bfiStore=function(t){return(0,i.service)({url:"/bfi-bystore",method:"GET",params:t})},e.submitBFI=function(t,e){return(0,i.service)({url:t,method:"POST",data:e})};var i=a("xCek");!function(t){t&&t.__esModule}(a("wNa6"))}}]);