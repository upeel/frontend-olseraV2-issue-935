(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-14f0"],{bIup:function(t,e,a){},gDSm:function(t,e,a){"use strict";var r=a("bIup");a.n(r).a},juEp:function(t,e,a){"use strict";a.r(e);var r=a("oL9x"),n=a("y9Cy");for(var i in n)["default"].indexOf(i)<0&&function(t){a.d(e,t,function(){return n[t]})}(i);a("gDSm");var o=a("KHd+"),s=Object(o.a)(n.default,r.a,r.b,!1,null,null,null);s.options.__file="index.vue",e.default=s.exports},kGIl:function(t,e,a){"undefined"!=typeof self&&self,t.exports=function(t){var e={};function a(r){if(e[r])return e[r].exports;var n=e[r]={i:r,l:!1,exports:{}};return t[r].call(n.exports,n,n.exports,a),n.l=!0,n.exports}return a.m=t,a.c=e,a.d=function(t,e,r){a.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},a.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},a.t=function(t,e){if(1&e&&(t=a(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(a.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)a.d(r,n,function(e){return t[e]}.bind(null,n));return r},a.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return a.d(e,"a",e),e},a.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},a.p="",a(a.s=1)}([function(t,e,a){},function(t,e,a){"use strict";a.r(e);var r="undefined"!=typeof window?window.HTMLElement:Object,n={mounted:function(){this.enforceFocus&&document.addEventListener("focusin",this.focusIn)},methods:{focusIn:function(t){if(this.isActive&&t.target!==this.$el&&!this.$el.contains(t.target)){var e=this.container?this.container:this.isFullPage?null:this.$el.parentElement;(this.isFullPage||e&&e.contains(t.target))&&(t.preventDefault(),this.$el.focus())}}},beforeDestroy:function(){document.removeEventListener("focusin",this.focusIn)}};function i(t,e,a,r,n,i,o,s){var l,c="function"==typeof t?t.options:t;if(e&&(c.render=e,c.staticRenderFns=a,c._compiled=!0),r&&(c.functional=!0),i&&(c._scopeId="data-v-"+i),o?(l=function(t){(t=t||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext)||"undefined"==typeof __VUE_SSR_CONTEXT__||(t=__VUE_SSR_CONTEXT__),n&&n.call(this,t),t&&t._registeredComponents&&t._registeredComponents.add(o)},c._ssrRegister=l):n&&(l=s?function(){n.call(this,(c.functional?this.parent:this).$root.$options.shadowRoot)}:n),l)if(c.functional){c._injectStyles=l;var u=c.render;c.render=function(t,e){return l.call(e),u(t,e)}}else{var d=c.beforeCreate;c.beforeCreate=d?[].concat(d,l):[l]}return{exports:t,options:c}}var o=i({name:"spinner",props:{color:{type:String,default:"#000"},height:{type:Number,default:64},width:{type:Number,default:64}}},function(){var t=this.$createElement,e=this._self._c||t;return e("svg",{attrs:{viewBox:"0 0 38 38",xmlns:"http://www.w3.org/2000/svg",width:this.width,height:this.height,stroke:this.color}},[e("g",{attrs:{fill:"none","fill-rule":"evenodd"}},[e("g",{attrs:{transform:"translate(1 1)","stroke-width":"2"}},[e("circle",{attrs:{"stroke-opacity":".25",cx:"18",cy:"18",r:"18"}}),e("path",{attrs:{d:"M36 18c0-9.94-8.06-18-18-18"}},[e("animateTransform",{attrs:{attributeName:"transform",type:"rotate",from:"0 18 18",to:"360 18 18",dur:"0.8s",repeatCount:"indefinite"}})],1)])])])},[],!1,null,null,null).exports,s=i({name:"dots",props:{color:{type:String,default:"#000"},height:{type:Number,default:240},width:{type:Number,default:60}}},function(){var t=this.$createElement,e=this._self._c||t;return e("svg",{attrs:{viewBox:"0 0 120 30",xmlns:"http://www.w3.org/2000/svg",fill:this.color,width:this.width,height:this.height}},[e("circle",{attrs:{cx:"15",cy:"15",r:"15"}},[e("animate",{attrs:{attributeName:"r",from:"15",to:"15",begin:"0s",dur:"0.8s",values:"15;9;15",calcMode:"linear",repeatCount:"indefinite"}}),e("animate",{attrs:{attributeName:"fill-opacity",from:"1",to:"1",begin:"0s",dur:"0.8s",values:"1;.5;1",calcMode:"linear",repeatCount:"indefinite"}})]),e("circle",{attrs:{cx:"60",cy:"15",r:"9","fill-opacity":"0.3"}},[e("animate",{attrs:{attributeName:"r",from:"9",to:"9",begin:"0s",dur:"0.8s",values:"9;15;9",calcMode:"linear",repeatCount:"indefinite"}}),e("animate",{attrs:{attributeName:"fill-opacity",from:"0.5",to:"0.5",begin:"0s",dur:"0.8s",values:".5;1;.5",calcMode:"linear",repeatCount:"indefinite"}})]),e("circle",{attrs:{cx:"105",cy:"15",r:"15"}},[e("animate",{attrs:{attributeName:"r",from:"15",to:"15",begin:"0s",dur:"0.8s",values:"15;9;15",calcMode:"linear",repeatCount:"indefinite"}}),e("animate",{attrs:{attributeName:"fill-opacity",from:"1",to:"1",begin:"0s",dur:"0.8s",values:"1;.5;1",calcMode:"linear",repeatCount:"indefinite"}})])])},[],!1,null,null,null).exports,l=i({name:"bars",props:{color:{type:String,default:"#000"},height:{type:Number,default:40},width:{type:Number,default:40}}},function(){var t=this.$createElement,e=this._self._c||t;return e("svg",{attrs:{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 30 30",height:this.height,width:this.width,fill:this.color}},[e("rect",{attrs:{x:"0",y:"13",width:"4",height:"5"}},[e("animate",{attrs:{attributeName:"height",attributeType:"XML",values:"5;21;5",begin:"0s",dur:"0.6s",repeatCount:"indefinite"}}),e("animate",{attrs:{attributeName:"y",attributeType:"XML",values:"13; 5; 13",begin:"0s",dur:"0.6s",repeatCount:"indefinite"}})]),e("rect",{attrs:{x:"10",y:"13",width:"4",height:"5"}},[e("animate",{attrs:{attributeName:"height",attributeType:"XML",values:"5;21;5",begin:"0.15s",dur:"0.6s",repeatCount:"indefinite"}}),e("animate",{attrs:{attributeName:"y",attributeType:"XML",values:"13; 5; 13",begin:"0.15s",dur:"0.6s",repeatCount:"indefinite"}})]),e("rect",{attrs:{x:"20",y:"13",width:"4",height:"5"}},[e("animate",{attrs:{attributeName:"height",attributeType:"XML",values:"5;21;5",begin:"0.3s",dur:"0.6s",repeatCount:"indefinite"}}),e("animate",{attrs:{attributeName:"y",attributeType:"XML",values:"13; 5; 13",begin:"0.3s",dur:"0.6s",repeatCount:"indefinite"}})])])},[],!1,null,null,null).exports,c=i({name:"vue-loading",mixins:[n],props:{active:Boolean,programmatic:Boolean,container:[Object,Function,r],isFullPage:{type:Boolean,default:!0},enforceFocus:{type:Boolean,default:!0},lockScroll:{type:Boolean,default:!1},transition:{type:String,default:"fade"},canCancel:Boolean,onCancel:{type:Function,default:function(){}},color:String,backgroundColor:String,blur:{type:String,default:"2px"},opacity:Number,width:Number,height:Number,zIndex:Number,loader:{type:String,default:"spinner"}},data:function(){return{isActive:this.active}},components:{Spinner:o,Dots:s,Bars:l},beforeMount:function(){this.programmatic&&(this.container?(this.isFullPage=!1,this.container.appendChild(this.$el)):document.body.appendChild(this.$el))},mounted:function(){this.programmatic&&(this.isActive=!0),document.addEventListener("keyup",this.keyPress)},methods:{cancel:function(){this.canCancel&&this.isActive&&(this.hide(),this.onCancel.apply(null,arguments))},hide:function(){var t=this;this.$emit("hide"),this.$emit("update:active",!1),this.programmatic&&(this.isActive=!1,setTimeout(function(){var e;t.$destroy(),void 0!==(e=t.$el).remove?e.remove():e.parentNode.removeChild(e)},150))},disableScroll:function(){this.isFullPage&&this.lockScroll&&document.body.classList.add("vld-shown")},enableScroll:function(){this.isFullPage&&this.lockScroll&&document.body.classList.remove("vld-shown")},keyPress:function(t){27===t.keyCode&&this.cancel()}},watch:{active:function(t){this.isActive=t},isActive:function(t){t?this.disableScroll():this.enableScroll()}},computed:{bgStyle:function(){return{background:this.backgroundColor,opacity:this.opacity,backdropFilter:"blur(".concat(this.blur,")")}}},beforeDestroy:function(){document.removeEventListener("keyup",this.keyPress)}},function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("transition",{attrs:{name:t.transition}},[a("div",{directives:[{name:"show",rawName:"v-show",value:t.isActive,expression:"isActive"}],staticClass:"vld-overlay is-active",class:{"is-full-page":t.isFullPage},style:{zIndex:t.zIndex},attrs:{tabindex:"0","aria-busy":t.isActive,"aria-label":"Loading"}},[a("div",{staticClass:"vld-background",style:t.bgStyle,on:{click:function(e){return e.preventDefault(),t.cancel(e)}}}),a("div",{staticClass:"vld-icon"},[t._t("before"),t._t("default",[a(t.loader,{tag:"component",attrs:{color:t.color,width:t.width,height:t.height}})]),t._t("after")],2)])])},[],!1,null,null,null).exports;a(0),c.install=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},r=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return{show:function(){var r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:e,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:a,i=Object.assign({},e,r,{programmatic:!0}),o=new(t.extend(c))({el:document.createElement("div"),propsData:i}),s=Object.assign({},a,n);return Object.keys(s).map(function(t){o.$slots[t]=s[t]}),o}}}(t,e,a);t.$loading=r,t.prototype.$loading=r},e.default=c}]).default},lMAw:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=h(a("GQeE")),n=h(a("EJiy")),i=a("xCek"),o=h(a("vDqi")),s=h(a("kGIl")),l=h(a("H/en")),c=h(a("Nf6C")),u=h(a("ulFf")),d=h(a("wd/R"));function h(t){return t&&t.__esModule?t:{default:t}}e.default={components:{SingleMonthPicker:l.default,SingleYearPicker:c.default,Loading:s.default},mixins:[u.default],data:function(){return{isLoading:!1,loadingStore:!1,loadingPDF:!1,selectedMonth:(0,d.default)().format("yyyy-MM"),isSetup:"true",dataStore:[],plus:[],minus:[],final:[],params:{store_id:this.$store.getters.selectedStore.store_id,year:(0,d.default)().format("yyyy"),month:(0,d.default)().format("MM")},period:(0,d.default)().format("yyyy-MM"),typePeriod:"month",allBranch:{value:!1,type:"allstore",url:"account/capitalstatement/allbranch"},showBranch:!1}},computed:{selectedStore:function(){return this.$store.getters.selectedStore},token:function(){return this.$store.state.user.token},langId:function(){return this.$store.state.userStores.langId},lang:function(){return this.$store.state.userStores.lang},settingValue:function(){return this.$store.state.accountingReport},visibleBranch1:function(){return this.showBranch?"col-sm-5 col-lg-5 col-md-5 text-center":"col-sm-7 col-lg-9 col-md-9  text-left"},visibleBranch2:function(){return this.showBranch?"margin: auto":"margin: 0px"}},methods:{handleSelectMonth:function(t){this.period=(0,d.default)(t).format("YYYY-MM"),this.getCapital()},setAllBranch:function(t){this.allBranch.type="allstore",this.params.store_id=this.selectedStore.store_id,t||(this.dataStore=[]);var e={allBranch:t,typeBranch:this.allBranch.type,defaultStore:this.params.store_id};this.$store.commit("SET_ACCOUNTING_REPORT",e),this.getCapital()},changeTypeBranch:function(t){var e={allBranch:this.allBranch.value,typeBranch:t,defaultStore:this.params.store_id};this.$store.commit("SET_ACCOUNTING_REPORT",e),"allstore"===t?(this.params.store_id=this.selectedStore.store_id,this.allBranch.url="account/capitalstatement/allbranch",this.getCapital()):(this.allBranch.url="account/capital/perstore",this.getStoreList(),this.getCapital())},getStoreList:function(){var t=this;this.loadingStore=!0;var e={Authorization:"Bearer "+this.token.access_token};(0,o.default)({method:"GET",url:(0,i.baseApi)(this.selectedStore.url_id,this.langId,"account/indexstore"),headers:e}).then(function(e){t.dataStore=e.data.data,t.loadingStore=!1}).catch(function(e){if(t.dataStore=[],t.loadingStore=!1,"object"===(0,n.default)(e.response.data.error.error)){var a=(0,r.default)(e.response.data.error.error)[0];t.$notify({tipe:"warning",title:e.response.data.error.message,message:e.response.data.error.error[a][0]})}else t.$notify({tipe:"warning",title:e.response.data.error.message,message:e.response.data.error.error})})},handleSelectYear:function(t){this.period=(0,d.default)(t).format("YYYY"),this.getCapital()},handleChangePeriod:function(t){this.period="month"===t?(0,d.default)().format("yyyy-MM"):(0,d.default)().format("YYYY"),this.typePeriod=t,this.getCapital()},getCapital:function(){var t=this;this.isLoading=!0,this.plus=[],this.minus=[],this.final=[];var e={Authorization:"Bearer "+this.token.access_token},a={period:this.period,store_id:this.params.store_id},s={},l={},c={},u={},d={},h=this.allBranch.value?this.allBranch.url:"account/capitalstatement";(0,o.default)({method:"GET",url:(0,i.baseApi)(this.selectedStore.url_id,this.langId,h),headers:e,params:a}).then(function(e){t.isLoading=!1;var a=e.data.data;0===e.data.has_branch?(t.allBranch={value:!1,type:"allstore",url:"account/capitalstatement/allbranch"},t.showBranch=!1,t.$store.commit("SET_ACCOUNTING_REPORT",{})):t.showBranch=!0,s=a.first_capital,l=a.investasi,a.total_penambahan,u=a.pendapatan_bersih,c=a.prive,d=a.end_capital,t.plus.push({id:1,name:s.name,amount:s.int_amount,famount:s.famount,totalPlus:!0},{id:2,name:"Penambahan Modal",amount:"",famount:"",totalPlus:!0},{id:3,name:t.$lang[t.langId].total_profit,amount:u.int_amount,famount:u.famount},{id:4,name:l.name,amount:l.int_amount,famount:l.famount},{id:5,name:c.name,amount:c.int_amount,famount:c.famount},{id:6,name:"Total Penambahan Modal",amount:u.int_amount,famount:u.famount,totalPlus:!0}),t.final.push({id:1,name:d.name,amount:d.int_amount,famount:d.famount,totalPlus:!0})}).catch(function(e){if(t.isLoading=!1,"object"===(0,n.default)(e.response.data.error.error)){var a=(0,r.default)(e.response.data.error.error)[0];t.$notify({tipe:"warning",title:e.response.data.error.message,message:e.response.data.error.error[a][0]})}else t.$notify({tipe:"warning",title:e.response.data.error.message,message:e.response.data.error.error})})},getSummaries:function(t){var e=this,a=t.columns,r=t.data,n=[];return a.forEach(function(t,a){if(0!==a){var i=r.map(function(e){return Number(e[t.property])});i.every(function(t){return isNaN(t)})?n[a]="N/A":n[a]=e.formatPrice(i.reduce(function(t,e){var a=Number(e);return isNaN(a)?t:t+e}),0)}else n[a]="SubTotal"}),n},capitalize:function(t){var e="";return t&&(e=t[0].toUpperCase()+t.slice(1)),e},getFileMobile:function(t){var e=this,a={Authorization:"Bearer "+this.token.access_token},r={period:this.period,store_id:this.params.store_id},n=this.allBranch.value?this.allBranch.url:"account/capitalstatement/";(0,o.default)({url:(0,i.baseApi)(this.selectedStore.url_id,this.langId,n+t),method:"GET",responseType:"blob",headers:a,params:r}).then(function(a){var r=new Blob([a.data]),i=e.$lang[e.langId].capital_statement+"-"+e.period+"."+t,o=(window.URL.createObjectURL(r),"?period="+e.period),s="/download/api/"+e.selectedStore.url_id+"/admin/v1/"+e.langId+n+t;window.location=s+o+","+i,e.loadingPDF=!1}).then(function(t){e.$notify({type:"warning",title:t.response.data.error.message,message:t.response.data.error.error}),e.loadingPDF=!1})},getPDF:function(){var t=this;if(this.loadingPDF=!0,this.$store.getters.webviewMode)this.getFileMobile("pdf");else{var e={Authorization:"Bearer "+this.token.access_token},a={period:this.period,store_id:this.params.store_id},s=this.allBranch.value?this.allBranch.url+"/pdf":"account/capitalstatement/pdf";(0,o.default)({url:(0,i.baseApi)(this.selectedStore.url_id,this.langId,s),method:"GET",responseType:"blob",headers:e,params:a}).then(function(e){var a=new Blob([e.data]),r=t.$lang[t.langId].capital_statement+"-"+t.period+".pdf",n=window.URL.createObjectURL(a),i=document.createElement("a");i.href=n,i.setAttribute("download",r),document.body.appendChild(i),i.click(),t.loadingPDF=!1}).catch(function(e){if("object"===(0,n.default)(e.response.data.error.error)){var a=(0,r.default)(e.response.data.error.error)[0];t.$notify({tipe:"warning",title:e.response.data.error.message,message:e.response.data.error.error[a][0]})}else t.$notify({tipe:"warning",title:e.response.data.error.message,message:e.response.data.error.error});t.loadingPDF=!1})}}},mounted:function(){this.settingValue.hasOwnProperty("allBranch")&&(this.allBranch.value=this.settingValue.allBranch,this.allBranch.type=this.settingValue.typeBranch,this.params.store_id=this.settingValue.defaultStore,"allstore"===this.settingValue.typeBranch?this.allBranch.url="account/capitalstatement/allbranch":(this.allBranch.url="account/capital/perstore",this.getStoreList())),this.getCapital()}}},oL9x:function(t,e,a){"use strict";a.d(e,"a",function(){return r}),a.d(e,"b",function(){return n});var r=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"px-20"},[a("el-card",{staticClass:"box-card"},[a("div",{staticClass:"row"},[t.showBranch?a("div",{staticClass:"visible-md visible-lg visible-sm col-sm-4 col-lg-4 col-md-4 text-left table-handler-flex",staticStyle:{"line-height":"5"}},[a("el-row",[a("el-col",{attrs:{span:t.allBranch.value?4:24}},[a("el-popover",{attrs:{placement:"bottom",width:"400",trigger:"click"}},[a("div",[a("div",{staticClass:"sub-title mb-12"},[a("span",{staticClass:"font-16 color-primary font-bold"},[t._v(t._s(t.$lang[t.langId].report_settings))])]),t._v(" "),a("div",{staticClass:"biodata"},[a("el-row",{staticStyle:{"line-height":"2"},attrs:{gutter:20}},[a("el-col",{attrs:{span:20}},[a("el-checkbox",{on:{change:t.setAllBranch},model:{value:t.allBranch.value,callback:function(e){t.$set(t.allBranch,"value",e)},expression:"allBranch.value"}},[t._v(t._s(t.$lang[t.langId].reconciliation))])],1),t._v(" "),a("el-col",{attrs:{span:4,align:"right"}},[a("el-tooltip",{attrs:{content:t.$lang[t.langId].all_branch_report,placement:"bottom"}},[a("i",{staticClass:"el-icon-info"})])],1),t._v(" "),a("el-col",{directives:[{name:"show",rawName:"v-show",value:t.showBranch,expression:"showBranch"}],attrs:{span:24}},[a("el-radio-group",{directives:[{name:"show",rawName:"v-show",value:t.allBranch.value,expression:"allBranch.value"}],on:{change:t.changeTypeBranch},model:{value:t.allBranch.type,callback:function(e){t.$set(t.allBranch,"type",e)},expression:"allBranch.type"}},[a("el-radio",{attrs:{label:"allstore",border:""}},[t._v(t._s(t.$lang[t.langId].all+" "+t.lang.store))]),t._v(" "),a("el-radio",{attrs:{label:"separate",border:""}},[t._v("Per "+t._s(t.lang.store))])],1)],1)],1)],1)]),t._v(" "),a("el-button",{staticStyle:{padding:"8px","font-size":"large"},attrs:{slot:"reference"},slot:"reference"},[a("svg-icon",{attrs:{"icon-class":"setting_ico"}})],1)],1)],1),t._v(" "),"separate"===t.allBranch.type?a("el-col",{attrs:{span:20}},[a("el-select",{staticStyle:{width:"100%"},attrs:{filterable:"",loading:t.loadingStore},on:{change:t.getCapital},model:{value:t.params.store_id,callback:function(e){t.$set(t.params,"store_id",e)},expression:"params.store_id"}},t._l(t.dataStore,function(t){return a("el-option",{key:t.store_id,attrs:{label:t.name,value:t.store_id}})}),1)],1):t._e()],1)],1):t._e(),t._v(" "),a("div",{staticClass:"col-xs-12",class:t.visibleBranch1},["month"===t.typePeriod?a("single-month-picker",{style:t.visibleBranch2,attrs:{clearable:!1},on:{input:t.handleSelectMonth},model:{value:t.period,callback:function(e){t.period=e},expression:"period"}}):t._e(),t._v(" "),"year"===t.typePeriod?a("single-year-picker",{style:t.visibleBranch2,attrs:{clearable:!1},on:{input:t.handleSelectYear},model:{value:t.period,callback:function(e){t.period=e},expression:"period"}}):t._e(),t._v(" "),a("el-radio-group",{staticClass:"custom-radio1",staticStyle:{border:"groove","border-color":"#409eff54","border-width":"thin",width:"300px"},on:{change:t.handleChangePeriod},model:{value:t.typePeriod,callback:function(e){t.typePeriod=e},expression:"typePeriod"}},[a("el-radio-button",{staticStyle:{width:"50%"},attrs:{label:"month"}},[t._v("\n              "+t._s(this.lang.month)+"\n            ")]),t._v(" "),a("el-radio-button",{staticStyle:{width:"50%"},attrs:{label:"year"}},[t._v("\n              "+t._s(this.lang.year)+"\n            ")])],1)],1),t._v(" "),a("div",{staticClass:"col-xs-12 col-sm-5 col-lg-3 col-md-3 text-right",staticStyle:{"line-height":"5","text-align":"-webkit-right","margin-top":"15px"}},[a("el-row",{staticClass:"visible-xs"},[a("el-col",{staticClass:"text-left",attrs:{span:12}},[a("el-popover",{attrs:{placement:"bottom",width:"400",trigger:"click"}},[a("div",[t.showBranch?a("div",{staticClass:"sub-title mb-12"},[a("span",{staticClass:"font-16 color-primary font-bold"},[t._v(t._s(t.$lang[t.langId].report_settings))])]):t._e(),t._v(" "),a("el-row",{staticStyle:{"line-height":"2"},attrs:{gutter:20}},[a("el-col",{attrs:{span:24}},[a("div",{staticClass:"biodata mb-8"},[a("el-checkbox",{on:{change:t.setAllBranch},model:{value:t.allBranch.value,callback:function(e){t.$set(t.allBranch,"value",e)},expression:"allBranch.value"}},[t._v(t._s(t.$lang[t.langId].reconciliation))]),a("br"),t._v(" "),a("p",{staticClass:"font-12",domProps:{innerHTML:t._s(t.$lang[t.langId].all_branch_report)}})],1)])],1)],1),t._v(" "),a("el-button",{attrs:{slot:"reference"},slot:"reference"},[t._v(t._s(t.$lang[t.langId].setting))])],1)],1),t._v(" "),a("el-col",{attrs:{span:12}},[a("el-button",{attrs:{disabled:t.loadingPDF},on:{click:function(e){return t.getPDF()}}},[t.loadingPDF?a("span",[a("loading",{staticStyle:{"text-align":"center"},attrs:{active:!0,color:"#1bb4e6",loader:"dots",width:45,height:10,backgroundColor:"#ffffff"}})],1):a("span",[a("svg-icon",{attrs:{type:"pdf-file"}}),t._v(" PDF")],1)])],1)],1),t._v(" "),a("el-button",{staticClass:"visible-md visible-sm visible-lg",on:{click:function(e){return t.getPDF()}}},[t.loadingPDF?a("span",[a("loading",{staticStyle:{"text-align":"center"},attrs:{active:!0,color:"#1bb4e6",loader:"dots",width:45,height:10,backgroundColor:"#ffffff"}})],1):a("span",[a("svg-icon",{attrs:{type:"pdf-file"}}),t._v(" PDF")],1)])],1)]),t._v(" "),a("div",{staticClass:"card-body"},[a("div",{staticStyle:{"margin-top":"24px"}},[!1===t.isLoading?a("div",[a("el-table",{ref:"multipleTable",staticClass:"product-table-max-height mobile-fix-height-unset",attrs:{data:t.plus,"header-cell-style":{background:"#DDF2FA",color:"#555"},"default-sort":{prop:"id",order:"ascending"}}},[a("el-table-column",{attrs:{label:t.lang.group,prop:"name"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("div",{directives:[{name:"show",rawName:"v-show",value:void 0!==e.row.totalPlus,expression:"scope.row['totalPlus'] !== undefined"}]},[a("span",{staticClass:"font-bold"},[t._v(t._s(e.row.name))])]),t._v(" "),a("div",{directives:[{name:"show",rawName:"v-show",value:void 0===e.row.totalPlus,expression:"scope.row['totalPlus'] === undefined"}],staticClass:"pl-16"},[a("span",[t._v(t._s(e.row.name))])])]}}],null,!1,1561160603)}),t._v(" "),a("el-table-column",{attrs:{label:t.lang.amount,prop:"amount",align:"right"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("div",{directives:[{name:"show",rawName:"v-show",value:void 0!==e.row.totalPlus,expression:"scope.row['totalPlus'] !== undefined"}]},[null!==e.row.famount?a("div",{staticClass:"font-bold"},[t._v(t._s(e.row.famount))]):a("div",{staticClass:"font-bold"},[t._v(t._s(t.selectedStore.currency_id)+" 0")])]),t._v(" "),a("div",{directives:[{name:"show",rawName:"v-show",value:void 0===e.row.totalPlus,expression:"scope.row['totalPlus'] === undefined"}]},[null!==e.row.famount?a("div",[t._v(t._s(e.row.famount))]):a("div",[t._v(t._s(t.selectedStore.currency_id)+" 0")])])]}}],null,!1,506136144)})],1),t._v(" "),a("el-table",{staticStyle:{"font-weight":"700","border-top":"1px solid #0085CD"},attrs:{data:t.final,"show-header":!1,"default-sort":{prop:"id",order:"ascending"},"final-capital":""}},[a("el-table-column",{attrs:{label:t.lang.group,prop:"name"}}),t._v(" "),a("el-table-column",{attrs:{label:t.lang.amount,prop:"famount",align:"right"}})],1)],1):a("div",[a("loading",{attrs:{align:"center",active:!0,color:"#1bb4e6",loader:"spinner",width:32,height:32,backgroundColor:"#ffffff"}})],1)])])])],1)},n=[]},ulFf:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=s(a("GQeE")),n=s(a("EJiy")),i=a("xCek"),o=s(a("vDqi"));function s(t){return t&&t.__esModule?t:{default:t}}var l=a("wd/R"),c={computed:{},data:function(){return{isSetup:"",dialogSetup:!1}},methods:{accountSetup:function(){var t=this,e={Authorization:"Bearer "+this.token.access_token};(0,o.default)({method:"GET",url:(0,i.baseApi)(this.selectedStore.url_id,this.langId,"account/setup"),headers:e}).then(function(e){t.isSetup=e.data.account_setup}).catch(function(e){if("object"===(0,n.default)(e.response.data.error.error)){var a=(0,r.default)(e.response.data.error.error)[0];t.$notify({tipe:"warning",title:e.response.data.error.message,message:e.response.data.error.error[a][0]})}else t.$notify({tipe:"warning",title:e.response.data.error.message,message:e.response.data.error.error})})},finishSetup:function(){this.dialogSetup=!1,this.accountSetup()},capitalize:function(t){var e="";return t&&(e=t[0].toUpperCase()+t.slice(1)),e},capitalEachWord:function(t){var e="";if(t){var a="";a=t.split(" ");for(var r=0;r<a.length;r++)a[r]=a[r][0].toUpperCase()+a[r].substr(1);e=a.join(" ")}return e},formatPrice:function(t){return(t/1).toFixed(0).replace(".",",").toString().replace(/\B(?=(\d{3})+(?!\d))/g,".")},formatPriceDecimal:function(t){return(t/1).toFixed(2).replace(".",",").toString().replace(/\B(?=(\d{3})+(?!\d))/g,".")},indexNumber:function(t,e,a){return e*a+(t+1)-e},dateFormat:function(t){return l(t).format("DD MMM YYYY")},checkDate:function(t){var e=l(t),a=l();return!(e.diff(a)>0)}}};e.default=c},y9Cy:function(t,e,a){"use strict";a.r(e);var r=a("lMAw"),n=a.n(r);for(var i in r)["default"].indexOf(i)<0&&function(t){a.d(e,t,function(){return r[t]})}(i);e.default=n.a}}]);