(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-77a3"],{DChC:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(s("QbLZ")),a=r(s("Ljqw"));function r(e){return e&&e.__esModule?e:{default:e}}var i={mixins:[s("6y4V").checkCustomPermission],computed:{selectedStore:function(){return this.$store.getters.selectedStore},token:function(){return this.$store.state.user.token},langId:function(){return this.$store.state.userStores.langId},lang:function(){return this.$store.state.userStores?this.$store.state.userStores.lang:{}},userRole:function(){var e=this.$store.getters.selectedStore;return{role_id:e.role_id,role_name:e.role_name,is_pos_only:e.is_pos_only,is_mobile:e.is_mobile}},rootLang:function(){return this.$lang[this.langId]},headers:function(){var e=this.$store.getters.token;return this.$store.getters.webviewMode&&(e=this.$store.getters.webviewToken),{Authorization:"Bearer "+e.access_token}},baseURL:function(){return a.default},loggedInUser:function(){return this.$store.state.user.loggedInUser},stageLevel:function(){return"sit"},defaultAccessByStore:function(){return["setdemo1","allinolsera2"]},wejayafoodAccessByStore:function(){return["setdemo1","allinolsera2","ayammrotholpusat","ayammrotholdramaga"]},saveToAllAccessStore:function(){return["setdemo1","allinolsera2","siliwangidutagarden","barokahfrozenfood"]},outlets:function(){var e=[{name:this.$store.state.userStores.lang.all,store_id:0,url_id:"all"}],t=[];return this.$store.getters.stores.map(function(s){t.includes(s.store_id)||s.is_store_active&&(e.push((0,n.default)({},s)),t.push(s.store_id))}),e},tokopediaActiveStore:function(){return this.$store.state.tokopediaActiveStore},shopeeActiveStore:function(){return this.$store.state.shopeeActiveStore}}};t.default=i},"Oo/n":function(e,t,s){},QkI2:function(e,t,s){"use strict";s.r(t);var n=s("efMI"),a=s.n(n);for(var r in n)["default"].indexOf(r)<0&&function(e){s.d(t,e,function(){return n[e]})}(r);t.default=a.a},VK5l:function(e,t,s){"use strict";s.r(t);var n=s("u7ro"),a=s("QkI2");for(var r in a)["default"].indexOf(r)<0&&function(e){s.d(t,e,function(){return a[e]})}(r);var i=s("KHd+"),o=Object(i.a)(a.default,n.a,n.b,!1,null,null,null);o.options.__file="DownloadMaterial.vue",t.default=o.exports},efMI:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=c(s("14Xm")),a=c(s("D3Ub")),r=c(s("QbLZ")),i=c(s("m1cH")),o=c(s("DChC"));s("Oo/n");var l=c(s("vDqi"));function c(e){return e&&e.__esModule?e:{default:e}}t.default={mixins:[o.default],data:function(){return{loading:!1,data:[],visibleDialogItem:!1,singleItem:{},searchKeyword:"",selectedFilterType:null,selectedItems:[]}},computed:{baseUrlMarketing:function(){return"/static/marketing-materials"},computedData:function(){var e=this,t=[].concat((0,i.default)(this.data));return this.selectedFilterType&&(t=t.filter(function(t){return t.type===e.selectedFilterType})),this.searchKeyword&&(t=t.filter(function(t){return t.title.toLowerCase().includes(e.searchKeyword.toLowerCase())})),t},filters:function(){return[{value:1,name:"Akrilik",size:"A5/A4"},{value:2,name:"X Banner",size:"160cm x 60cm"}]}},mounted:function(){this.fetchData()},methods:{fetchData:function(){var e=this;l.default.get(this.baseUrlMarketing+"/data.json").then(function(t){e.data=t.data})},handleClickItem:function(e){this.singleItem=(0,r.default)({},e),this.visibleDialogItem=!0},handleSelectFilterType:function(e){this.selectedFilterType&&this.selectedFilterType===e.value?this.selectedFilterType=null:this.selectedFilterType=e.value},handleCloseDialog:function(){this.visibleDialogItem=!1,this.singleItem={}},downloadFile:function(e,t){var s=this;return(0,a.default)(n.default.mark(function a(){var r;return n.default.wrap(function(s){for(;;)switch(s.prev=s.next){case 0:return s.next=2,document.createElement("a");case 2:return(r=s.sent).style.display="none",document.body.appendChild(r),r.href=e,r.setAttribute("download",t),s.abrupt("return",r);case 8:case"end":return s.stop()}},a,s)}))()},handleDownloadMultipleItems:function(){var e=this;return(0,a.default)(n.default.mark(function t(){return n.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.selectedItems.map(function(){var t=(0,a.default)(n.default.mark(function t(s,a){var r;return n.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.downloadFile(s);case 2:r=t.sent,setTimeout(function(){r.click(),window.URL.revokeObjectURL(r.href),document.body.removeChild(r)},1e3*a);case 4:case"end":return t.stop()}},t,e)}));return function(e,s){return t.apply(this,arguments)}}());case 2:e.selectedItems=[];case 3:case"end":return t.stop()}},t,e)}))()}}}},u7ro:function(e,t,s){"use strict";s.d(t,"a",function(){return n}),s.d(t,"b",function(){return a});var n=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"content-wrapper"},[s("section",{staticClass:"content"},[s("div",{staticClass:"closable-banner newfeature-banner"},[s("h1",[e._v(e._s(e.rootLang.get_promotion_materials))]),e._v(" "),s("h3",[e._v(e._s(e.rootLang.now_easier))]),e._v(" "),s("div",{staticClass:"rounded-2"}),e._v(" "),s("div",{staticClass:"rounded-1"})]),e._v(" "),s("div",{staticClass:"mb-16 flex-container flex-container--content-space-between"},[s("div",[e._v("\n        "+e._s(e.computedData.length)+" "+e._s(e.lang.items)+"\n      ")]),e._v(" "),s("div",[s("el-input",{attrs:{placeholder:e.lang.search,"prefix-icon":"el-icon-search",type:"search",clearable:""},model:{value:e.searchKeyword,callback:function(t){e.searchKeyword=t},expression:"searchKeyword"}})],1),e._v(" "),s("el-button",{attrs:{disabled:e.selectedItems.length<=0,loading:e.loading,type:"success"},on:{click:e.handleDownloadMultipleItems}},[e._v("\n        Download "),s("span",{directives:[{name:"show",rawName:"v-show",value:e.selectedItems.length,expression:"selectedItems.length"}]},[e._v("("+e._s(e.selectedItems.length)+")")])])],1),e._v(" "),s("el-card",{staticClass:"promotion-materials"},[s("el-row",{attrs:{gutter:10}},e._l(e.computedData,function(t,n){return s("el-col",{key:n,attrs:{xs:12,md:6}},[s("div",{staticClass:"promotion-materials--item",class:e.selectedItems.includes(t.download_url)?"selected":""},[s("div",{staticClass:"flex-container flex-container--content-space-between p-8"},[s("div",{staticClass:"font-14"},[e._v("\n                "+e._s(t.title)+"\n              ")]),e._v(" "),s("div",[s("input",{directives:[{name:"model",rawName:"v-model",value:e.selectedItems,expression:"selectedItems"}],attrs:{type:"checkbox"},domProps:{value:t.download_url,checked:Array.isArray(e.selectedItems)?e._i(e.selectedItems,t.download_url)>-1:e.selectedItems},on:{change:function(s){var n=e.selectedItems,a=s.target,r=!!a.checked;if(Array.isArray(n)){var i=t.download_url,o=e._i(n,i);a.checked?o<0&&(e.selectedItems=n.concat([i])):o>-1&&(e.selectedItems=n.slice(0,o).concat(n.slice(o+1)))}else e.selectedItems=r}}})])]),e._v(" "),s("div",{staticClass:"promotion-materials--thumbnail",on:{click:function(s){return e.handleClickItem(t)}}},[s("img",{staticClass:"promotion-materials--thumbnail--image",attrs:{src:e.baseUrlMarketing+"/thumbnails/"+t.file}})])])])}),1)],1)],1),e._v(" "),s("el-dialog",{attrs:{visible:e.visibleDialogItem,"show-close":!1,"before-close":e.handleCloseDialog,"append-to-body":"","custom-class":"dialog-transparent"},on:{"update:visible":function(t){e.visibleDialogItem=t}}},[s("div",{staticClass:"flex-container mb-8"},[s("div",{staticClass:"font-14 color-white flex-grow-1"},[e._v("\n        "+e._s(e.singleItem.title)+"\n      ")]),e._v(" "),s("div",{staticClass:"flex-container"},[s("a",{staticClass:"mr-24 font-14 color-primary--vibrant",attrs:{href:e.singleItem.download_url,download:""}},[s("svg-icon",{attrs:{"icon-class":"download"}}),e._v(" Download\n        ")],1),e._v(" "),s("div",{staticClass:"color-white font-14 pointer",on:{click:e.handleCloseDialog}},[s("svg-icon",{attrs:{"icon-class":"x"}})],1)])]),e._v(" "),e.singleItem.file?s("img",{staticClass:"w-fit",attrs:{src:e.baseUrlMarketing+"/banners/"+e.singleItem.file}}):e._e()]),e._v(" "),e._m(0)],1)},a=[function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"floating-action-button color-whatsapp--bg"},[t("a",{attrs:{href:"https://bit.ly/3choZJP",target:"_blank"}},[t("i",{staticClass:"icon-whatsapp"}),this._v(" Pengajuan materi promosi\n    ")])])}]}}]);