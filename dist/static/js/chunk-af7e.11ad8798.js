(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-af7e"],{"/yR7":function(t,e,a){"use strict";a.r(e);var n=a("vZTL"),r=a.n(n);for(var s in n)["default"].indexOf(s)<0&&function(t){a.d(e,t,function(){return n[t]})}(s);e.default=r.a},DChC:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=s(a("QbLZ")),r=s(a("Ljqw"));function s(t){return t&&t.__esModule?t:{default:t}}var i={mixins:[a("6y4V").checkCustomPermission],computed:{selectedStore:function(){return this.$store.getters.selectedStore},token:function(){return this.$store.state.user.token},langId:function(){return this.$store.state.userStores.langId},lang:function(){return this.$store.state.userStores?this.$store.state.userStores.lang:{}},userRole:function(){var t=this.$store.getters.selectedStore;return{role_id:t.role_id,role_name:t.role_name,is_pos_only:t.is_pos_only,is_mobile:t.is_mobile}},rootLang:function(){return this.$lang[this.langId]},headers:function(){var t=this.$store.getters.token;return this.$store.getters.webviewMode&&(t=this.$store.getters.webviewToken),{Authorization:"Bearer "+t.access_token}},baseURL:function(){return r.default},loggedInUser:function(){return this.$store.state.user.loggedInUser},stageLevel:function(){return"sit"},defaultAccessByStore:function(){return["setdemo1","allinolsera2"]},wejayafoodAccessByStore:function(){return["setdemo1","allinolsera2","ayammrotholpusat","ayammrotholdramaga"]},saveToAllAccessStore:function(){return["setdemo1","allinolsera2","siliwangidutagarden","barokahfrozenfood"]},outlets:function(){var t=[{name:this.$store.state.userStores.lang.all,store_id:0,url_id:"all"}],e=[];return this.$store.getters.stores.map(function(a){e.includes(a.store_id)||a.is_store_active&&(t.push((0,n.default)({},a)),e.push(a.store_id))}),t},tokopediaActiveStore:function(){return this.$store.state.tokopediaActiveStore},shopeeActiveStore:function(){return this.$store.state.shopeeActiveStore}}};e.default=i},EdRA:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.fetchList=function(t){return(0,n.HTTP)({url:"/api/admin/v1/en/partner",method:"GET",params:t})},e.fetchByCode=function(t){return(0,n.HTTP)({url:"/api/admin/v1/en/partner/code/"+t,method:"GET"})},e.profileUser=function(t){return(0,n.service)({url:"/myprofile",params:t})},e.addBankAccount=function(t){return(0,n.service)({url:"/masterpartner/addbank",method:"POST",data:t})},e.fetchMasterpartner=function(t){return(0,n.service)({url:"/masterpartner",params:t})},e.activatePartnership=function(t){return(0,n.service)({url:"/masterpartner",method:"POST",data:t})},e.getPartnerDetail=function(t){return(0,n.service)({url:"/masterpartner/"+t.store_id})};var n=a("xCek")},RLpG:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=function(t){return t&&t.__esModule?t:{default:t}}(a("DChC")),r=a("EdRA");e.default={name:"ActivationPartnership",mixins:[n.default],components:{},props:{showDialog:{type:Boolean,default:!1}},watch:{showDialog:function(t){if(t)if(null!==this.loggedInUser.name){var e=this.loggedInUser.name;e.length>7?this.codePartner=e.slice(0,8):this.codePartner=e}else this.codePartner=this.randomString(8)}},data:function(){return{loadingActivation:!1,linkDefault:"https://www.olsera.com/pos/",codePartner:"",price:0}},mounted:function(){},methods:{activatePartnership:function(){var t=this;this.loadingActivation=!0;var e={code:this.codePartner};(0,r.activatePartnership)(e).then(function(e){t.loadingActivation=!1,t.$emit("activated")}).catch(function(e){t.loadingActivation=!1,t.$notify({type:"warning",title:e.response.data.error.message,message:e.response.data.error.error})})},handleClose:function(){this.$emit("close")},randomString:function(t,e){e=e||"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";for(var a="",n=0;n<t;n++){var r=Math.floor(Math.random()*e.length);a+=e.substring(r,r+1)}return a},getRandom:function(){console.log("radn"),this.codePartner=this.randomString(8)},handleChange:function(t){}}}},S0ZI:function(t,e,a){"use strict";a.r(e);var n=a("bifU"),r=a("cGXW");for(var s in r)["default"].indexOf(s)<0&&function(t){a.d(e,t,function(){return r[t]})}(s);var i=a("KHd+"),o=Object(i.a)(r.default,n.a,n.b,!1,null,null,null);o.options.__file="activationPartnership.vue",e.default=o.exports},VVGx:function(t,e,a){"use strict";a.r(e);var n=a("cvcp"),r=a("/yR7");for(var s in r)["default"].indexOf(s)<0&&function(t){a.d(e,t,function(){return r[t]})}(s);var i=a("KHd+"),o=Object(i.a)(r.default,n.a,n.b,!1,null,null,null);o.options.__file="index.vue",e.default=o.exports},bifU:function(t,e,a){"use strict";a.d(e,"a",function(){return n}),a.d(e,"b",function(){return r});var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("el-dialog",{staticClass:"dialog-join-partner",attrs:{visible:t.showDialog,"before-close":t.handleClose,width:"536px"},on:{"update:visible":function(e){t.showDialog=e}}},[a("div",{attrs:{slot:"title"},slot:"title"},[a("div",{staticClass:"flex-container"},[a("h4",{staticClass:"font-bold"},[t._v("\n        Gabung Partner 🤝\n      ")])]),t._v(" "),a("span",{staticClass:"font-bold"},[t._v("Rekan untung, Anda untung")])]),t._v(" "),a("div",{staticClass:"text-center word-break"},[a("el-image",{attrs:{src:"/static/img/join-partner/banner-icon-join-partner.svg"}}),t._v(" "),a("perfect-scrollbar",{staticStyle:{height:"100%","max-height":"calc(50vh - 100px)"}},[a("div",{staticClass:"mt-16 mb-8 text-left"},[t._v("\n        Bagikan link partner Anda ke rekan wirausaha kamu untuk bergabung bersama Olsera\n      ")]),t._v(" "),a("div",{staticClass:"text-left mb-6"},[a("div",{staticClass:"mb-8"},[t._v("✔️ Dapatkan komisi "),a("span",{staticClass:"font-bold"},[t._v("250rb")]),t._v(" untuk setiap rekanmu yang berhasil mendaftar dan berlangganan "),a("span",{staticClass:"font-bold"},[t._v("Olsera 1 tahun.")])]),t._v(" "),a("div",[t._v("✔️ Rekanmu juga akan mendapatkan benefit berupa "),a("span",{staticClass:"font-bold"},[t._v(" voucher 218rb ")]),t._v(" untuk tambahan masa aktif langganan.")])]),t._v(" "),a("div",{staticClass:"mt-24 text-center"},[a("div",{staticClass:"full-width"},[a("div",{staticClass:"font-12 color-info"},[t._v("Id Partner Anda")]),t._v(" "),a("el-input",{staticClass:"color-prepend flex-container font-bold",attrs:{maxlength:"8"},on:{input:t.handleChange},model:{value:t.codePartner,callback:function(e){t.codePartner=e},expression:"codePartner"}},[a("template",{slot:"prepend"},[t._v("AF-")]),t._v(" "),a("template",{slot:"append"},[a("el-button",{attrs:{type:"text"},on:{click:t.getRandom}},[a("svg-icon",{staticClass:"color-info pointer",attrs:{"icon-class":"refresh-ico"}})],1)],1)],2)],1)]),t._v(" "),a("el-button",{staticClass:"btn-block mt-24",attrs:{type:"primary",loading:t.loadingActivation},on:{click:t.activatePartnership}},[t._v(t._s(t.rootLang.join_partner)+" "+t._s(t.rootLang.now))])],1)],1),t._v(" "),a("div",{attrs:{slot:"footer"},slot:"footer"})])},r=[]},cGXW:function(t,e,a){"use strict";a.r(e);var n=a("RLpG"),r=a.n(n);for(var s in n)["default"].indexOf(s)<0&&function(t){a.d(e,t,function(){return n[t]})}(s);e.default=r.a},cvcp:function(t,e,a){"use strict";a.d(e,"a",function(){return n}),a.d(e,"b",function(){return r});var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"content-wrapper"},[a("section",{staticClass:"content"},[t._m(0),t._v(" "),a("div",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],staticClass:"flex-container--same-height flex-container--desktop mt-24"},[a("div",{staticClass:"full-width border border--grey-border radius-10 p-24 mr-12 color-white--bg",staticStyle:{flex:"1"}},[a("div",{staticClass:"flex-container full-width"},[a("div",{staticClass:"container-icon"},[a("el-avatar",{attrs:{size:32,src:t.loggedInUser.photo,shape:"circle"}})],1),t._v(" "),a("div",{staticClass:"full-width font-20 ml-8"},[t._v(t._s(t.loggedInUser.name))]),t._v(" "),a("el-popover",{attrs:{placement:"bottom",title:"Title",width:"200",trigger:"hover"}},[a("el-button",{attrs:{slot:"reference",circle:"",type:"text"},slot:"reference"},[a("div",{staticClass:"container-icon"},[a("svg-icon",{attrs:{"icon-class":"information-circle"}})],1)]),t._v(" "),a("div",[a("div",[t._v("✔️ Dapatkan komisi 250rb untuk setiap rekanmu yang berhasil mendaftar dan berlangganan Olsera 1 tahun. "),a("br"),t._v(" ✔️ Rekanmu juga akan mendapatkan benefit berupa voucher 218rb untuk tambahan masa aktif langganan.")])])],1)],1),t._v(" "),a("div",{staticClass:"mt-16 font-14"},[t._v("Bagikan link partner Anda ke rekan wirausaha kamu untuk bergabung bersama Olsera")]),t._v(" "),a("div",{staticClass:"color-primary--soft--bg radius-10 p-16"},[a("div",{staticClass:"flex-container"},[a("div",{staticClass:"font-20 font-bold word-break px-8",attrs:{id:"partner_code"}},[t._v(t._s(t.masterPartner.url_partner))]),t._v(" "),a("div",{staticClass:"flex-grow-1"}),t._v(" "),a("div",[a("div",{staticClass:"flex-container color-primary pointer",on:{click:function(e){return t.copyText("partner_code")}}},[a("div",{staticClass:"container-icon pointer",attrs:{slot:"append"},slot:"append"},[a("svg-icon",{attrs:{"icon-class":"feather-copy",stroke:"#67C23A"}})],1),t._v(" "),a("span",{staticClass:"font-16 font-bold"},[t._v("Copy")])]),t._v(" "),a("div",{staticClass:"flex-container color-primary ml-8"},[a("el-dropdown",{attrs:{trigger:"click"}},[a("span",{staticClass:"el-dropdown-link font-18 color-primary"},[a("svg-icon",{attrs:{"icon-class":"share-2",stroke:"#67C23A"}}),t._v(" "),a("span",{staticClass:"font-16 font-bold"},[t._v("Share")])],1),t._v(" "),a("el-dropdown-menu",{attrs:{slot:"dropdown"},slot:"dropdown"},t._l(t.networkShare,function(e){return a("el-dropdown-item",{key:e.network,attrs:{command:"edit"}},[a("ShareNetwork",{attrs:{network:e.network,url:t.masterPartner.url_partner?t.masterPartner.url_partner:"",title:"",description:"Hi! Ayo gabung bersama saya menggunakan Olsera. Premium, Kaya Fitur, Memuaskan. Aplikasi Kasir dengan fitur Delivery, Take Away plus Website yang benar-benar membantu. Murah mulai Rp 140.000/bulan. Eishh, juga tersedia plan Gratis untuk usaha yang baru rintis loh. Daftar di link ini untuk mendapatkan GRATIS coba dan Voucher Rp 218.000 untuk aktivasi tambahan. Masih tersedia, buruan! ",quote:"Hi! Ayo gabung bersama saya menggunakan Olsera. Premium, Kaya Fitur, Memuaskan! Aplikasi Kasir dengan fitur Delivery, Take Away plus Website yang benar-benar membantu. Murah mulai Rp 140.000/bulan. Eishh, juga tersedia plan Gratis untuk usaha yang baru rintis loh. Daftar di link ini untuk mendapatkan GRATIS coba dan Voucher Rp 218.000 untuk aktivasi tambahan. Masih tersedia, buruan! ",hashtags:"olsera"}},[a("div",{staticClass:"full-width",staticStyle:{"text-transform":"capitalize"}},[t._v(t._s(e.network))])])],1)}),1)],1)],1)])])]),t._v(" "),a("div",{staticClass:"mt-16 color-primary--soft--bg radius-10 p-16"},[a("div",{staticClass:"flex-container"},[t._m(1),t._v(" "),a("div",{staticClass:"px-8 pointer",staticStyle:{display:"flex",width:"30%"},on:{click:t.openWa}},[a("div",{staticClass:"container-icon",attrs:{slot:"append"},slot:"append"},[a("svg-icon",{attrs:{"icon-class":"ico-whatsapp",stroke:"#67C23A"}})],1),t._v(" "),a("div",{staticClass:"ml-8 font-16 font-bold",staticStyle:{color:"#67C23A"}},[t._v("Share ke Olsera")])])])])]),t._v(" "),a("div",{staticClass:"full-width border border--grey-border radius-10 p-24 ml-12 color-white--bg",staticStyle:{flex:"1"}},[a("div",{staticClass:"flex-container full-width"},[a("div",{staticClass:"container-icon"},[a("svg-icon",{staticClass:"color-primary",attrs:{"icon-class":"icon-money"}})],1),t._v(" "),a("div",{staticClass:"full-width font-20"},[t._v("Total Komisi Dicairkan")])]),t._v(" "),a("div",{staticClass:"mt-16 font-14"},[t._v("Sediakan akun bank untuk pencairan komisi dari program Gabung Partner")]),t._v(" "),a("div",{staticClass:"color-info--bg radius-10 p-16"},[a("div",{staticClass:"flex-container"},[a("div",{staticClass:"full-width text-center"},[a("div",{staticClass:"font-20 font-bold word-break px-8 color-info"},[t._v(t._s(t.masterPartner.ftotal_comission))])])])]),t._v(" "),a("div",{staticClass:"font-14 color-info"},[t._v("Komisi otomatis dicairkan Olsera")]),t._v(" "),a("div",{staticClass:"mt-16 color-green--soft--bg radius-10 p-16"},[t.masterPartner.bt_account_no?a("div",{staticClass:"flex-container"},[a("div",{staticClass:"container-icon"},[a("svg-icon",{staticClass:"color-primary",attrs:{"icon-class":"icon-bank"}})],1),t._v(" "),a("div",{staticClass:"full-width"},[t._v(t._s(t.masterPartner.bt_bank))]),t._v(" "),a("div",{staticClass:"container-icon pointer",on:{click:t.handleEditBank}},[a("svg-icon",{staticClass:"color-primary",attrs:{"icon-class":"edit-2"}})],1)]):a("div",{staticClass:"flex-container"},[a("div",{staticClass:"container-icon"},[a("svg-icon",{staticClass:"color-primary",attrs:{"icon-class":"icon-bank"}})],1),t._v(" "),a("div",{staticClass:"full-width"},[t._v("Belum ada akun Bank")]),t._v(" "),a("div",[a("el-button",{attrs:{type:"success"},on:{click:function(e){t.dialogEditBank=!0}}},[t._v(t._s(t.rootLang.add))])],1)])])])]),t._v(" "),a("div",{staticClass:"flex-container mt-24"},[a("div",{staticClass:"full-width font-20"},[t._v(t._s(t.rootLang.registered_partner))]),t._v(" "),a("div",{staticClass:"table-handler-flex full-width text-right px-24",staticStyle:{display:"contents"}},[a("el-input",{staticClass:"inline-form input-search full-width",attrs:{clearable:"",placeholder:t.lang.search,"prefix-icon":"el-icon-search",size:"small"},on:{change:t.handleSearch},model:{value:t.params.search,callback:function(e){t.$set(t.params,"search",e)},expression:"params.search"}})],1)]),t._v(" "),a("div",{staticClass:"like-table-wrapper mt-16 mb-24"},[a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.loadingPartner,expression:"loadingPartner"}],staticClass:"with-empty-data",attrs:{data:t.dataPartner},on:{"row-click":t.getDetailPartner}},[0===t.dataPartner.length?a("div",{staticClass:"card_close_date box-card",attrs:{slot:"append"},slot:"append"},[a("div",{staticClass:"no-data-wrapper no-data-settle"},[a("img",{staticClass:"no-data-image",attrs:{src:"/static/img/no-data-partner.svg"}}),t._v(" "),a("div",{staticStyle:{"max-width":"360px",width:"100%"}},[a("span",[t._v("Belum ada rekan terdaftar, Yuk! Ajak teman-temanmu gabung olsera dan dapatkan keuntungannya")])])])]):t._e(),t._v(" "),a("el-table-column",{attrs:{label:t.lang.store_name,prop:"fcreated_time"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("div",{staticClass:"flex-container"},[a("el-avatar",{style:"border: 1px solid;",attrs:{size:32,src:e.row.logo,shape:"circle"}}),t._v(" "),a("div",{staticClass:"ml-8"},[t._v(t._s(e.row.name))])],1)]}}])}),t._v(" "),a("el-table-column",{attrs:{label:t.rootLang.join_date,prop:"fcreated_time"}}),t._v(" "),a("el-table-column",{attrs:{label:t.rootLang.date_withdraw,prop:"flast_date_withdraw"}}),t._v(" "),a("el-table-column",{attrs:{label:t.lang.total+" "+t.rootLang.comission,prop:"fcommission"}})],1),t._v(" "),t.meta.total>t.meta.page_size?a("div",{staticClass:"mt-12 border border--grey-border table-handler-bottom text-center"},[a("el-pagination",{staticStyle:{"margin-bottom":"20px"},attrs:{total:t.meta.total,"page-sizes":[1,15,50,100],"page-size":t.meta.page_size,"current-page":t.meta.currentPage,background:"",layout:"sizes, prev, pager, next"},on:{"update:currentPage":function(e){return t.$set(t.meta,"currentPage",e)},"update:current-page":function(e){return t.$set(t.meta,"currentPage",e)},"current-change":t.handleChangePage,"size-change":t.handleChangeSizePage}})],1):t._e()],1),t._v(" "),a("transition",{attrs:{name:"el-zoom-in-center"}},[t.showDetail?a("div",{staticClass:"offscreen-right-sidebar"},[a("div",{staticClass:"offscreen-right-sidebar--wrapper"},[a("div",{staticClass:"offscreen-right-sidebar--header text-left"},[a("div",{staticClass:"full-width font-20"},[t._v(t._s(t.rootLang.detail_partner))]),t._v(" "),a("close-esc",{on:{close:t.handleClose}})],1),t._v(" "),a("div",[a("div",{staticClass:"flex-container"},[a("el-avatar",{style:"border: 1px solid;",attrs:{size:32,src:t.tempPartner.logo,shape:"circle"}}),t._v(" "),a("div",{staticClass:"ml-12"},[a("div",{staticClass:"font-20 font-bold text-capitalize"},[t._v(t._s(t.tempPartner.name))]),t._v(" "),a("span",{staticClass:"font-12 color-info"},[t._v(t._s(t.rootLang.registered_on)+" "+t._s(t.tempPartner.fcreated_time))])])],1),t._v(" "),a("div",{staticClass:"mt-20 flex-container"},[a("div",{staticClass:"full-width font-20 font-bold"},[t._v(t._s(t.lang.total)+" "+t._s(t.rootLang.comission))]),t._v(" "),a("div",{staticClass:"full-width font-20 font-bold text-right"},[t._v(t._s(t.tempPartner.fcommission))])]),t._v(" "),a("div",{staticClass:"mt-16 border border--grey border--with-shadow radius-5"},t._l(t.tempPartner.billing,function(e){return a("div",{key:e.id,staticClass:"like-table-wrapper--item flex-container"},[a("div",{staticClass:"full-width"},[a("div",[t._v(t._s(e.billing_package_option_name))]),t._v(" "),a("div",{staticClass:"font-12 color-info"},[t._v(t._s(e.fbilling_date))]),t._v(" "),0===e.comission_is_paid?a("el-tag",{attrs:{type:"info",effect:"plain"}},[t._v(t._s(t.rootLang.pending))]):a("el-tag",{attrs:{type:"success",effect:"plain"}},[t._v("Sudah dicairkan")])],1),t._v(" "),a("div",{staticClass:"text-right",staticStyle:{width:"40%"}},[t._v(t._s(e.fcomission_amount))])])}),0)])])]):t._e()]),t._v(" "),a("el-dialog",{attrs:{visible:t.dialogEditBank,"show-close":!1,"close-on-press-escape":!1,"append-to-body":"","custom-class":"dialog-card"},on:{"update:visible":function(e){t.dialogEditBank=e}}},[a("div",{staticClass:"flex-container",attrs:{slot:"title"},slot:"title"},[a("h4",{staticClass:"dialog-title full-width"},[t._v("\n          "+t._s(t.masterPartner.bt_account_no?t.lang.edit+" "+t.lang.bank_account:t.rootLang.add_bank_account)+"\n        ")]),t._v(" "),a("div",{staticClass:"btn_save_dialog full-width text-right"},[a("el-button",{attrs:{type:"info"},on:{click:function(e){t.dialogEditBank=!1,t.temp={}}}},[t._v(t._s(t.lang.cancel))]),t._v(" "),a("el-button",{attrs:{loading:t.loadingSaveBank,type:"success"},on:{click:t.handleSaveBank}},[t._v(t._s(t.lang.save))])],1)]),t._v(" "),a("div",[a("div",{staticClass:"full-width"},[a("div",{staticClass:"mb-16 word-break"},[t._v("Pastikan Nama dan Nomor akun sesuai dengan buku tabungan Anda")]),t._v(" "),a("div",{staticClass:"mb-16"},[a("div",{staticClass:"font-12 text-left"},[t._v("Nama Bank")]),t._v(" "),a("el-select",{staticStyle:{width:"100%"},attrs:{placeholder:"Pilih tipe bisnis Anda",filterable:""},model:{value:t.temp.bt_bank,callback:function(e){t.$set(t.temp,"bt_bank",e)},expression:"temp.bt_bank"}},t._l(t.listBank,function(t){return a("el-option",{key:t.id,attrs:{value:t.name,label:t.name}})}),1),t._v(" "),a("div",{staticClass:"font-12 text-left mt-16"},[t._v("Cabang")]),t._v(" "),a("el-input",{model:{value:t.temp.bt_branch_code,callback:function(e){t.$set(t.temp,"bt_branch_code",e)},expression:"temp.bt_branch_code"}}),t._v(" "),a("div",{staticClass:"font-12 text-left mt-16"},[t._v("Nama Akun")]),t._v(" "),a("el-input",{model:{value:t.temp.bt_account_name,callback:function(e){t.$set(t.temp,"bt_account_name",e)},expression:"temp.bt_account_name"}}),t._v(" "),a("div",{staticClass:"font-12 text-left mt-16"},[t._v("Nomor Akun")]),t._v(" "),a("el-input",{attrs:{type:"number"},model:{value:t.temp.bt_account_no,callback:function(e){t.$set(t.temp,"bt_account_no",e)},expression:"temp.bt_account_no"}})],1)])])])],1),t._v(" "),a("activation-partnership",{attrs:{"show-dialog":t.dialogPartner},on:{activated:t.avtivatedPartner,close:t.closeDialogPartner}})],1)},r=[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"banner-partner radius-10"},[e("div",{staticClass:"banner-icon"},[e("div",{staticClass:"color-white"},[e("span",{staticClass:"title font-32 font-bold"},[this._v("Gabung Partner")]),this._v(" "),e("div",{staticClass:"font-20"},[this._v("Rekan untung, Anda untung")])])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"full-width word-break"},[e("span",[this._v("Atau bagikan kepada tim Olsera calon pengguna yang Anda kenal berupa \n                "),e("span",{staticClass:"font-bold"},[this._v("Nama, No Contact")]),this._v(" dan "),e("span",{staticClass:"font-bold"},[this._v("Kebutuhan.")]),this._v(" Tim kami akan menghubungi mereka dan mendaftarkannya ke dalam akun partner Anda. *Santai saja. Biarkan kami yang melakukan follow up kepada pelanggan agar mereka berlangganan setelah 14 hari trial.")])])}]},vYzU:function(t,e,a){"undefined"!=typeof self&&self,t.exports=function(t){var e={};function a(n){if(e[n])return e[n].exports;var r=e[n]={i:n,l:!1,exports:{}};return t[n].call(r.exports,r,r.exports,a),r.l=!0,r.exports}return a.m=t,a.c=e,a.d=function(t,e,n){a.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},a.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},a.t=function(t,e){if(1&e&&(t=a(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(a.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)a.d(n,r,function(e){return t[e]}.bind(null,r));return n},a.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return a.d(e,"a",e),e},a.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},a.p="",a(a.s=0)}([function(t,e,a){t.exports=a(1)},function(t,e,a){"use strict";a.r(e),a.d(e,"ShareNetwork",function(){return s});var n={baidu:"http://cang.baidu.com/do/add?iu=@u&it=@t",buffer:"https://bufferapp.com/add?text=@t&url=@u",email:"mailto:?subject=@t&body=@u%0D%0A@d",evernote:"https://www.evernote.com/clip.action?url=@u&title=@t",facebook:"https://www.facebook.com/sharer/sharer.php?u=@u&title=@t&description=@d&quote=@q&hashtag=@h",flipboard:"https://share.flipboard.com/bookmarklet/popout?v=2&url=@u&title=@t",hackernews:"https://news.ycombinator.com/submitlink?u=@u&t=@t",instapaper:"http://www.instapaper.com/edit?url=@u&title=@t&description=@d",line:"http://line.me/R/msg/text/?@t%0D%0A@u%0D%0A@d",linkedin:"https://www.linkedin.com/sharing/share-offsite/?url=@u",messenger:"fb-messenger://share/?link=@u",odnoklassniki:"https://connect.ok.ru/dk?st.cmd=WidgetSharePreview&st.shareUrl=@u&st.comments=@t",pinterest:"https://pinterest.com/pin/create/button/?url=@u&media=@m&description=@t",pocket:"https://getpocket.com/save?url=@u&title=@t",quora:"https://www.quora.com/share?url=@u&title=@t",reddit:"https://www.reddit.com/submit?url=@u&title=@t",skype:"https://web.skype.com/share?url=@t%0D%0A@u%0D%0A@d",sms:"sms:?body=@t%0D%0A@u%0D%0A@d",stumbleupon:"https://www.stumbleupon.com/submit?url=@u&title=@t",telegram:"https://t.me/share/url?url=@u&text=@t%0D%0A@d",tumblr:"https://www.tumblr.com/share/link?url=@u&name=@t&description=@d",twitter:"https://twitter.com/intent/tweet?text=@t&url=@u&hashtags=@h@tu",viber:"viber://forward?text=@t%0D%0A@u%0D%0A@d",vk:"https://vk.com/share.php?url=@u&title=@t&description=@d&image=@m&noparse=true",weibo:"http://service.weibo.com/share/share.php?url=@u&title=@t&pic=@m",whatsapp:"https://api.whatsapp.com/send?text=@t%0D%0A@u%0D%0A@d",wordpress:"https://wordpress.com/press-this.php?u=@u&t=@t&s=@d&i=@m",xing:"https://www.xing.com/social/share/spi?op=share&url=@u&title=@t",yammer:"https://www.yammer.com/messages/new?login=true&status=@t%0D%0A@u%0D%0A@d"},r="undefined"!=typeof window?window:null,s={name:"ShareNetwork",props:{network:{type:String,required:!0},url:{type:String,required:!0},title:{type:String,required:!0},description:{type:String,default:""},quote:{type:String,default:""},hashtags:{type:String,default:""},twitterUser:{type:String,default:""},media:{type:String,default:""},tag:{type:String,default:"a"},popup:{type:Object,default:function(){return{width:626,height:436}}}},data:function(){return{popupTop:0,popupLeft:0,popupWindow:void 0,popupInterval:null}},computed:{networks:function(){return this.$SocialSharing?this.$SocialSharing.options.networks:n},key:function(){return this.network.toLowerCase()},rawLink:function(){var t=navigator.userAgent.toLowerCase();return"sms"===this.key&&(t.indexOf("iphone")>-1||t.indexOf("ipad")>-1)?this.networks[this.key].replace(":?",":&"):this.networks[this.key]},shareLink:function(){var t=this.rawLink;return"twitter"===this.key&&(this.hashtags.length||(t=t.replace("&hashtags=@h","")),this.twitterUser.length||(t=t.replace("@tu",""))),t.replace(/@tu/g,"&via="+encodeURIComponent(this.twitterUser)).replace(/@u/g,encodeURIComponent(this.url)).replace(/@t/g,encodeURIComponent(this.title)).replace(/@d/g,encodeURIComponent(this.description)).replace(/@q/g,encodeURIComponent(this.quote)).replace(/@h/g,this.encodedHashtags).replace(/@m/g,encodeURIComponent(this.media))},encodedHashtags:function(){return"facebook"===this.key&&this.hashtags.length?"%23"+this.hashtags.split(",")[0]:this.hashtags}},render:function(t){var e=this;if(!this.networks.hasOwnProperty(this.key))throw new Error("Network "+this.key+" does not exist");var a={class:"share-network-"+this.key,on:{click:function(){return e["http"===e.rawLink.substring(0,4)?"share":"touch"]()}}};return"a"===this.tag&&(a.attrs={href:"javascript:void(0)"}),t(this.tag,a,this.$slots.default)},methods:{resizePopup:function(){var t=r.innerWidth||document.documentElement.clientWidth||r.screenX,e=r.innerHeight||document.documentElement.clientHeight||r.screenY,a=t/r.screen.availWidth;this.popupLeft=(t-this.popup.width)/2/a+(void 0!==r.screenLeft?r.screenLeft:r.screenX),this.popupTop=(e-this.popup.height)/2/a+(void 0!==r.screenTop?r.screenTop:r.screenY)},share:function(){var t=this;this.resizePopup(),this.popupWindow&&this.popupInterval&&(clearInterval(this.popupInterval),this.popupWindow.close(),this.emit("change")),this.popupWindow=r.open(this.shareLink,"sharer-"+this.key,",height="+this.popup.height+",width="+this.popup.width+",left="+this.popupLeft+",top="+this.popupTop+",screenX="+this.popupLeft+",screenY="+this.popupTop),this.popupWindow&&(this.popupWindow.focus(),this.popupInterval=setInterval(function(){t.popupWindow&&!t.popupWindow.closed||(clearInterval(t.popupInterval),t.popupWindow=null,t.emit("close"))},500),this.emit("open"))},touch:function(){window.open(this.shareLink,"_blank"),this.emit("open")},emit:function(t){this.$root.$emit("share_network_"+t,this.key,this.url),this.$emit(t,this.key,this.url)}}};e.default={install:function(t,e){t.component(s.name,s),t.prototype.$SocialSharing={options:{networks:e&&e.hasOwnProperty("networks")?Object.assign(n,e.networks):n}}}}}])},vZTL:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=c(a("DChC")),r=c(a("XFEm")),s=c(a("S0ZI")),i=a("znf4"),o=a("EdRA"),l=a("vYzU");function c(t){return t&&t.__esModule?t:{default:t}}e.default={name:"JoinPartner",components:{ShareNetwork:l.ShareNetwork,CloseEsc:r.default,ActivationPartnership:s.default},mixins:[n.default],data:function(){return{loading:!0,loadingSaveBank:!1,loadingPartner:!1,dataProfile:{},dialogEditBank:!1,listBank:[],temp:{},dataPartner:[],visibleItem:[!1,!1],params:{per_page:15},meta:{total:0,page_size:15,currentPage:1},networkShare:[{network:"whatsapp",name:"Whatsapp",icon:"fab fah fa-lg fa-whatsapp",color:"#25d366"},{network:"facebook",name:"Facebook",icon:"fab fah fa-lg fa-facebook-f",color:"#1877f2"},{network:"twitter",name:"Twitter",icon:"fab fah fa-lg fa-twitter",color:"#1da1f2"}],showDetail:!1,tempPartner:{},dialogPartner:!1}},computed:{masterPartner:function(){var t={};return this.dataProfile.master_partner&&((t=this.dataProfile.master_partner).url_partner="https://www.olsera.com/id/pos/"+t.code.toLowerCase()),t}},mounted:function(){this.getProfile(),this.getDataBank(),this.getDataPartner()},methods:{getProfile:function(){var t=this;this.loading=!0,(0,o.profileUser)().then(function(e){t.dataProfile=e.data.data,t.dataProfile.master_partner||(t.dialogPartner=!0),t.loading=!1}).catch(function(e){t.dataProfile={},t.loading=!1,t.$notify({type:"warning",title:e.response.data.error.message,message:e.response.data.error.error})})},getDataBank:function(){var t=this;this.loading=!0;(0,i.dataBank)({per_page:1e3}).then(function(e){t.loading=!1,t.listBank=e.data.data}).catch(function(e){t.loading=!1,t.$message({type:"error",message:e.response.data.error.error})})},getDataPartner:function(){var t=this;this.loadingPartner=!0,(0,o.fetchMasterpartner)(this.params).then(function(e){t.dataPartner=e.data.data,t.meta={total:e.data.meta.total,page_size:e.data.meta.per_page,currentPage:e.data.meta.current_page},t.loadingPartner=!1}).catch(function(e){t.dataPartner=[],t.loadingPartner=!1,404!==e.response.data.error.status_code&&t.$notify({type:"warning",title:e.response.data.error.message,message:e.response.data.error.error})})},handleSearch:function(){this.getDataPartner()},handleEditBank:function(){this.temp={bt_account_no:this.masterPartner.bt_account_no,bt_account_name:this.masterPartner.bt_account_name,bt_branch_code:this.masterPartner.bt_branch_code,bt_bank:this.masterPartner.bt_bank},this.dialogEditBank=!0},selectBank:function(t){var e=this;t&&this.listBank.map(function(a){a.name===t&&(e.temp.bank_swift_id=a.id)})},handleSaveBank:function(){var t=this;this.loadingSaveBank=!0,(0,o.addBankAccount)(this.temp).then(function(e){t.dataProfile=e.data.data,t.temp={},t.loadingSaveBank=!1,t.dialogEditBank=!1}).catch(function(e){t.dataProfile={},t.loadingSaveBank=!1,t.$notify({type:"warning",title:e.response.data.error.message,message:e.response.data.error.error})})},handleChangePage:function(t){this.meta.currentPage=t,this.params.page=t,this.getDataPartner()},handleChangeSizePage:function(t){this.params.per_page=t,this.params.page=1,this.getDataPartner()},showData:function(t){"not_saved"===t?(this.params.search_text=0,this.params.search_column="status_withdraw"):"saved"===t?(this.params.search_text=1,this.params.search_column="status_withdraw"):(this.$delete(this.params,"search_text"),this.$delete(this.params,"search_column")),this.getDataPartner()},copyText:function(t){var e=document.getElementById(t).innerHTML,a=document.createElement("textarea");a.value=e,document.body.appendChild(a),a.select(),document.execCommand("copy"),document.body.removeChild(a),this.$notify({type:"info",message:"Berhasil copy text"})},openWa:function(){window.open(this.dataProfile.master_partner.share_link)},getDetailPartner:function(t){var e=this;this.loadingPartner=!0,console.log("partner",t.partner_id),(0,o.getPartnerDetail)(t).then(function(t){e.tempPartner=t.data.data,e.showDetail=!0,e.loadingPartner=!1}).catch(function(t){e.loadingPartner=!1,e.$notify({type:"warning",title:t.response.data.error.message,message:t.response.data.error.error})})},handleClose:function(){this.showDetail=!1,this.tempPartner={}},closeDialogPartner:function(){this.dialogPartner=!1,this.dataProfile.master_partner||this.$router.push({path:"/dashboard"})},avtivatedPartner:function(){this.getProfile(),this.getDataBank(),this.getDataPartner(),this.dialogPartner=!1}}}},znf4:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.dataSettlement=function(t){return(0,n.service)({url:"/settlement",method:"GET",params:t})},e.dataBank=function(t){return(0,n.service)({url:"/bankswift",method:"GET",params:t})},e.settlementAccount=function(t){return(0,n.service)({url:"/settlement/account",method:"GET",params:t})},e.updateAccount=function(t){return(0,n.service)({url:"/settlement/account",method:"POST",data:t})},e.cekPassword=function(t){return(0,n.service)({url:"/settlement/account/cekpassword",method:"POST",data:t})},e.detailSettlement=function(t){return(0,n.service)({url:"/settlement/"+t,method:"GET"})},e.downloadSettlement=function(t){return(0,n.service)({url:"/settlement/export/"+t,method:"GET",responseType:"blob"})},e.downloadSettlementList=function(t){return(0,n.service)({url:"/settlement",method:"GET",params:t,responseType:"blob"})},e.detailOrder=function(t){return(0,n.service)({url:"/settlement/details/"+t.id,method:"GET",params:t})},e.settlementOnlineOrder=function(t){return(0,n.service)({url:"/settlement/selforder",method:"GET",params:t})},e.downloadSettlementOnlineOrder=function(t){return(0,n.service)({url:"/settlement/selforder",method:"GET",params:t,responseType:"blob"})};var n=a("xCek")}}]);