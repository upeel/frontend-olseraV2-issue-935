(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-7e4c"],{"0Qfe":function(t,e,i){"use strict";i.d(e,"a",function(){return a}),i.d(e,"b",function(){return s});var a=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("el-row",{attrs:{gutter:10}},[i("el-col",{attrs:{md:8}},[i("el-card",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],staticClass:"box-card"},[i("div",{staticClass:"card-body"},[i("div",{staticClass:"flex-container flex--container-wrap flex-align-items"},[i("div",{staticClass:"package-img mr-8"},[t.changePhoto?i("div",[i("el-upload",{attrs:{drag:"",action:t.uploadPhotoUrl,data:{id:t.dataStore.id},headers:t.headers,"on-error":t.handleUploadFailed,"on-success":t.handleUploadSuccess}},[i("i",{staticClass:"el-icon-upload"}),t._v(" "),i("div",{staticClass:"el-upload__text"},[t._v(t._s(t.$lang[t.langId].drop_file_or_click))])]),t._v(" "),i("button-action-authenticated",{attrs:{permission:["settings/generalsetting","edit"],icon:"el-icon-close"},on:{click:function(e){t.changePhoto=!1}}},[t._v("\n                "+t._s(t.lang.cancel)+"\n              ")])],1):i("div",[i("div",[t.dataStore.logo?i("el-avatar",{staticStyle:{"margin-bottom":"12px"},attrs:{src:t.dataStore.logo,size:120,shape:"square"}}):t._e()],1),t._v(" "),i("button-action-authenticated",{attrs:{permission:["settings/generalsetting","edit"],icon:"el-icon-picture",type:"info"},on:{click:function(e){t.changePhoto=!0}}},[t._v("\n                "+t._s(t.lang.change_logo)+"\n              ")])],1)]),t._v(" "),i("div",[i("h3",{staticStyle:{"margin-top":"0"}},[t._v(t._s(t.dataStore.name))]),t._v(" "),i("p",[t._v(t._s(t.dataStore.ext_domain))])])])])])],1),t._v(" "),i("el-col",{attrs:{md:16}},[i("el-card",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],staticClass:"box-card"},[i("div",{staticClass:"table-handler-flex",attrs:{slot:"header"},slot:"header"},[i("h4",{staticStyle:{"flex-grow":"1"}},[t._v(t._s(t.lang.store_info))]),t._v(" "),i("div",[t.isEdit?t._e():i("button-action-authenticated",{attrs:{type:"primary",permission:["settings/generalsetting","edit"]},on:{click:t.edit}},[t._v(t._s(t.lang.edit))]),t._v(" "),t.isEdit?i("el-button",{on:{click:t.cancel}},[t._v(t._s(t.lang.cancel))]):t._e(),t._v(" "),t.isEdit?i("el-button",{attrs:{type:"success"},on:{click:t.save}},[t._v(t._s(t.lang.save))]):t._e()],1)]),t._v(" "),i("div",{staticClass:"card-body"},[i("el-form",{attrs:{"label-width":"200px"}},[i("el-form-item",{attrs:{label:t.lang.store_name}},[t.isEdit?t._e():i("el-input",{attrs:{disabled:""},model:{value:t.dataStore.name,callback:function(e){t.$set(t.dataStore,"name",e)},expression:"dataStore.name"}}),t._v(" "),t.isEdit?i("el-input",{model:{value:t.formEdit.name,callback:function(e){t.$set(t.formEdit,"name",e)},expression:"formEdit.name"}}):t._e()],1),t._v(" "),i("el-form-item",{attrs:{label:t.lang.email}},[t.isEdit?t._l(t.emails,function(e){return i("el-tag",{key:e,attrs:{type:"primary",size:"mini",closable:!0},on:{close:function(i){return t.removeEmail(e)}}},[t._v("\n                "+t._s(e)+"\n              ")])}):t._l(t.emails,function(e){return i("el-tag",{key:e,attrs:{type:"info",size:"mini"}},[t._v("\n                "+t._s(e)+"\n              ")])})],2),t._v(" "),t.isEdit?i("el-form-item",[i("template",{slot:"label"},[i("h5",{staticStyle:{"margin-top":"0"}},[i("strong",[t._v(t._s(t.lang.add)+" "+t._s(t.lang.email))])]),t._v(" "),i("p",{staticClass:"input-desc size-12 oldgrey"},[t._v(t._s(t.lang.info_customer_contact_email))])]),t._v(" "),i("el-input",{attrs:{placeholder:t.$lang[t.langId].split_with_enter},nativeOn:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.addEmail.apply(null,arguments)}},model:{value:t.inputEmail,callback:function(e){t.inputEmail=e},expression:"inputEmail"}})],2):t._e(),t._v(" "),t.isEdit?i("el-form-item",{attrs:{label:t.$lang[t.langId].phone_more_than_1}},[i("el-input",{staticStyle:{"margin-bottom":"3px"},attrs:{disabled:t.computedDisabledInput,type:"tel"},model:{value:t.formEdit.phone_1,callback:function(e){t.$set(t.formEdit,"phone_1",e)},expression:"formEdit.phone_1"}}),t._v(" "),i("el-input",{staticStyle:{"margin-bottom":"3px"},attrs:{disabled:t.computedDisabledInput,type:"tel"},model:{value:t.formEdit.phone_2,callback:function(e){t.$set(t.formEdit,"phone_2",e)},expression:"formEdit.phone_2"}}),t._v(" "),i("el-input",{staticStyle:{"margin-bottom":"3px"},attrs:{disabled:t.computedDisabledInput,type:"tel"},model:{value:t.formEdit.phone_3,callback:function(e){t.$set(t.formEdit,"phone_3",e)},expression:"formEdit.phone_3"}})],1):i("el-form-item",{attrs:{label:t.lang.phone}},[i("ul",{staticClass:"list-unstyled"},[i("li",[t._v(t._s(t.dataStore.phone_1))]),t._v(" "),i("li",[t._v(t._s(t.dataStore.phone_2))]),t._v(" "),i("li",[t._v(t._s(t.dataStore.phone_3))])])]),t._v(" "),i("el-form-item",[i("template",{slot:"label"},[i("h5",{staticStyle:{"margin-top":"0"}},[i("strong",[t._v(t._s(t.lang.publish_store))])]),t._v(" "),i("p",{staticClass:"input-desc size-12 oldgrey"},[t._v(t._s(t.lang.info_website_published))])]),t._v(" "),t.isEdit?i("div",[i("el-switch",{attrs:{"active-value":1,"inactive-value":0},on:{change:t.publishStore},model:{value:t.formEdit.pos_published,callback:function(e){t.$set(t.formEdit,"pos_published",e)},expression:"formEdit.pos_published"}}),t._v(" "),0==t.formEdit.pos_published?i("span",[t._v(t._s(t.lang.no))]):t._e(),t._v(" "),1==t.formEdit.pos_published?i("span",[t._v(t._s(t.lang.yes))]):t._e()],1):i("div",[0==t.dataStore.pos_published?i("p",[t._v(t._s(t.lang.no))]):t._e(),t._v(" "),1==t.dataStore.pos_published?i("p",[t._v(t._s(t.lang.yes))]):t._e()])],2),t._v(" "),t.isEdit?[i("div",{staticClass:"full-width mt-16"},[i("span",{staticClass:"font-12"},[t._v("Tipe Perusahaan")]),t._v(" "),i("el-radio-group",{staticClass:"full-width flex-container border border--info",model:{value:t.formEdit.is_company,callback:function(e){t.$set(t.formEdit,"is_company",e)},expression:"formEdit.is_company"}},[i("el-radio-button",{staticClass:"lpoint-type",attrs:{label:1}},[t._v("\n                  Badan Usaha\n                ")]),t._v(" "),i("el-radio-button",{staticClass:"lpoint-type",attrs:{label:0}},[t._v("\n                  Personal\n                ")])],1)],1),t._v(" "),i("div",{staticClass:"full-width mt-16 mb-24"},[i("span",{staticClass:"font-12"},[t._v("Tipe Bisnis")]),t._v(" "),i("el-select",{staticStyle:{width:"100%"},attrs:{placeholder:"Pilih tipe bisnis Anda",filterable:""},model:{value:t.formEdit.business_type_id,callback:function(e){t.$set(t.formEdit,"business_type_id",e)},expression:"formEdit.business_type_id"}},t._l(t.businessTypes,function(t){return i("el-option",{key:t.id,attrs:{value:t.id,label:t.name}})}),1)],1),t._v(" "),31!==t.formEdit.business_type_id||"dev"!==t.stageLevel&&"sit"!==t.stageLevel?t._e():i("div",{staticClass:"mt-12"},[i("el-input",{staticStyle:{"margin-bottom":"3px"},attrs:{placeholder:"Bisnis Anda ...",disabled:t.computedDisabledInput,type:"tel"},model:{value:t.formEdit.business_type_other,callback:function(e){t.$set(t.formEdit,"business_type_other",e)},expression:"formEdit.business_type_other"}})],1)]:[i("el-form-item",{attrs:{label:"Tipe Perusahaan"}},[i("span",[t._v(t._s(1===t.dataStore.is_company?"Badan Usaha":"Personal"))])]),t._v(" "),i("el-form-item",{attrs:{label:"Tipe Bisnis"}},[i("span",[t._v(t._s(t.dataStore.business_type_name))])])],t._v(" "),i("el-collapse",[i("el-collapse-item",[i("gmap-map",{ref:"storeLocationOnMap",staticStyle:{width:"100%",height:"300px","margin-bottom":"20px"},attrs:{center:t.marker.position,zoom:t.zoom,options:t.mapOptions},on:{"update:zoom":function(e){t.zoom=e},click:t.onMapClick}},[i("gmap-marker",{attrs:{position:t.marker.position,clickable:!0,draggable:!0},on:{dragend:t.onMapClick}})],1),t._v(" "),i("template",{slot:"title"},[i("label",{staticStyle:{"margin-left":"20%"}},[t._v(t._s(t.lang.address))])]),t._v(" "),i("el-form-item",[i("el-button",{attrs:{disabled:!t.isEdit,type:"info",icon:"el-icon-location-outline"},on:{click:t.getGeolocation}},[t._v("\n                  "+t._s(t.$lang[t.langId].use_current_location)+"\n                ")])],1),t._v(" "),i("el-form-item",{attrs:{label:t.lang.address}},[t.isEdit?i("el-input",{attrs:{type:"textarea"},model:{value:t.formEdit.address,callback:function(e){t.$set(t.formEdit,"address",e)},expression:"formEdit.address"}}):i("div",{staticClass:"value-address"},[t._v("\n                  "+t._s(t.dataStore.address)+"\n                ")])],1),t._v(" "),i("el-form-item",{attrs:{label:t.lang.country}},[t.isEdit?t._e():i("div",{staticClass:"value-address"},[t._v("\n                  "+t._s(t.dataStore.country_name)+"\n                ")]),t._v(" "),t.isEdit?i("el-select",{directives:[{name:"loading",rawName:"v-loading",value:t.loadingMoreCountry,expression:"loadingMoreCountry"}],on:{change:function(e){return t.handleSelected("country",t.formEdit.country_id)}},model:{value:t.formEdit.country_id,callback:function(e){t.$set(t.formEdit,"country_id",e)},expression:"formEdit.country_id"}},[t._l(t.countries,function(t){return i("el-option",{key:t.id,attrs:{label:t.name,value:t.id}})}),t._v(" "),t.moreCountry?i("el-option",{staticStyle:{background:"#767676",color:"#F5F5F5"},attrs:{value:0}},[i("span",{staticStyle:{"font-size":"13px","margin-right":"10px",float:"left"}},[i("el-button",{staticStyle:{color:"#F5F5F5"},attrs:{type:"text",icon:"el-icon-more",size:"mini"}})],1),t._v(" "),i("span",[t._v(t._s(t.$lang[t.langId].load_more))])]):t._e()],2):t._e()],1),t._v(" "),i("el-form-item",{attrs:{label:t.lang.province}},[t.isEdit?t._e():i("el-select",{attrs:{disabled:""},model:{value:t.dataStore.state_id,callback:function(e){t.$set(t.dataStore,"state_id",e)},expression:"dataStore.state_id"}},t._l(t.stateCity,function(t){return i("el-option",{key:t.id,attrs:{label:t.name,value:t.id}})}),1),t._v(" "),t.isEdit?i("el-select",{directives:[{name:"loading",rawName:"v-loading",value:t.loadingMoreState,expression:"loadingMoreState"}],attrs:{filterable:""},on:{change:function(e){return t.handleSelected("state",t.formEdit.state_id)}},model:{value:t.formEdit.state_id,callback:function(e){t.$set(t.formEdit,"state_id",e)},expression:"formEdit.state_id"}},[t._l(t.stateCity,function(t){return i("el-option",{key:t.id,attrs:{label:t.name,value:t.id}})}),t._v(" "),t.moreState?i("el-option",{staticStyle:{background:"#767676",color:"#F5F5F5"},attrs:{value:0}},[i("span",{staticStyle:{"font-size":"13px","margin-right":"10px",float:"left"}},[i("el-button",{staticStyle:{color:"#F5F5F5"},attrs:{type:"text",icon:"el-icon-more",size:"mini"}})],1),t._v(" "),i("span",[t._v(t._s(t.$lang[t.langId].load_more))])]):t._e()],2):t._e()],1),t._v(" "),i("el-form-item",{attrs:{label:t.lang.city}},[t.isEdit?t._e():i("el-select",{attrs:{disabled:""},model:{value:t.dataStore.city_id,callback:function(e){t.$set(t.dataStore,"city_id",e)},expression:"dataStore.city_id"}},t._l(t.cities,function(t){return i("el-option",{key:t.id,attrs:{label:t.city,value:t.id}})}),1),t._v(" "),t.isEdit?i("el-select",{directives:[{name:"loading",rawName:"v-loading",value:t.loadingMoreCity,expression:"loadingMoreCity"}],attrs:{filterable:""},on:{change:function(e){return t.handleSelected("city",t.formEdit.city_id)}},model:{value:t.formEdit.city_id,callback:function(e){t.$set(t.formEdit,"city_id",e)},expression:"formEdit.city_id"}},[t._l(t.cities,function(t){return i("el-option",{key:t.id,attrs:{label:t.city,value:t.id}})}),t._v(" "),t.moreCity?i("el-option",{staticStyle:{background:"#767676",color:"#F5F5F5"},attrs:{value:0},on:{click:t.loadMore}},[i("span",{staticStyle:{"font-size":"13px","margin-right":"10px",float:"left"}},[i("el-button",{staticStyle:{color:"#F5F5F5"},attrs:{type:"text",icon:"el-icon-more",size:"mini"}})],1),t._v(" "),i("span",[t._v(t._s(t.$lang[t.langId].load_more))])]):t._e()],2):t._e()],1),t._v(" "),i("el-form-item",{attrs:{label:t.lang.subdistrict}},[t.isEdit?t._e():i("el-select",{attrs:{disabled:""},model:{value:t.dataStore.subdistrict_id,callback:function(e){t.$set(t.dataStore,"subdistrict_id",e)},expression:"dataStore.subdistrict_id"}},t._l(t.subdistrict,function(t){return i("el-option",{key:t.id,attrs:{label:t.name,value:t.id}})}),1),t._v(" "),t.isEdit?i("el-select",{directives:[{name:"loading",rawName:"v-loading",value:t.loadingMoreSubdistrict,expression:"loadingMoreSubdistrict"}],attrs:{filterable:""},on:{change:function(e){return t.handleSelected("subdistrict",t.formEdit.subdistrict_id)}},model:{value:t.formEdit.subdistrict_id,callback:function(e){t.$set(t.formEdit,"subdistrict_id",e)},expression:"formEdit.subdistrict_id"}},[t._l(t.subdistrict,function(t){return i("el-option",{key:t.id,attrs:{label:t.name,value:t.id}})}),t._v(" "),t.moreSubdistrict?i("el-option",{staticStyle:{background:"#767676",color:"#F5F5F5"},attrs:{value:0}},[i("span",{staticStyle:{"font-size":"13px","margin-right":"10px",float:"left"}},[i("el-button",{staticStyle:{color:"#F5F5F5"},attrs:{type:"text",icon:"el-icon-more",size:"mini"}})],1),t._v(" "),i("span",[t._v(t._s(t.$lang[t.langId].load_more))])]):t._e()],2):t._e()],1),t._v(" "),i("el-form-item",{attrs:{label:t.lang.postal_code}},[t.isEdit?i("el-input",{model:{value:t.formEdit.postal_code,callback:function(e){t.$set(t.formEdit,"postal_code",e)},expression:"formEdit.postal_code"}}):i("el-input",{attrs:{disabled:""},model:{value:t.dataStore.postal_code,callback:function(e){t.$set(t.dataStore,"postal_code",e)},expression:"dataStore.postal_code"}})],1)],2)],1)],2)],1)])],1)],1)},s=[]},DChC:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=o(i("QbLZ")),s=o(i("Ljqw"));function o(t){return t&&t.__esModule?t:{default:t}}var n={mixins:[i("6y4V").checkCustomPermission],computed:{selectedStore:function(){return this.$store.getters.selectedStore},token:function(){return this.$store.state.user.token},langId:function(){return this.$store.state.userStores.langId},lang:function(){return this.$store.state.userStores?this.$store.state.userStores.lang:{}},userRole:function(){var t=this.$store.getters.selectedStore;return{role_id:t.role_id,role_name:t.role_name,is_pos_only:t.is_pos_only,is_mobile:t.is_mobile}},rootLang:function(){return this.$lang[this.langId]},headers:function(){var t=this.$store.getters.token;return this.$store.getters.webviewMode&&(t=this.$store.getters.webviewToken),{Authorization:"Bearer "+t.access_token}},baseURL:function(){return s.default},loggedInUser:function(){return this.$store.state.user.loggedInUser},stageLevel:function(){return"sit"},defaultAccessByStore:function(){return["setdemo1","allinolsera2"]},wejayafoodAccessByStore:function(){return["setdemo1","allinolsera2","ayammrotholpusat","ayammrotholdramaga"]},saveToAllAccessStore:function(){return["setdemo1","allinolsera2","siliwangidutagarden","barokahfrozenfood"]},outlets:function(){var t=[{name:this.$store.state.userStores.lang.all,store_id:0,url_id:"all"}],e=[];return this.$store.getters.stores.map(function(i){e.includes(i.store_id)||i.is_store_active&&(t.push((0,a.default)({},i)),e.push(i.store_id))}),t},tokopediaActiveStore:function(){return this.$store.state.tokopediaActiveStore},shopeeActiveStore:function(){return this.$store.state.shopeeActiveStore}}};e.default=n},Oapj:function(t,e,i){"use strict";i.r(e);var a=i("0Qfe"),s=i("X870");for(var o in s)["default"].indexOf(o)<0&&function(t){i.d(e,t,function(){return s[t]})}(o);var n=i("KHd+"),r=Object(n.a)(s.default,a.a,a.b,!1,null,null,null);r.options.__file="Index.vue",e.default=r.exports},X870:function(t,e,i){"use strict";i.r(e);var a=i("dWdH"),s=i.n(a);for(var o in a)["default"].indexOf(o)<0&&function(t){i.d(e,t,function(){return a[t]})}(o);e.default=s.a},dWdH:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=d(i("P2sY")),s=i("xCek"),o=d(i("vDqi")),n=i("dV7z"),r=i("N4Yp"),l=d(i("DChC"));function d(t){return t&&t.__esModule?t:{default:t}}e.default={mixins:[l.default],data:function(){return{loading:!0,changePhoto:!1,isEdit:!1,inputEmail:"",dataStore:{},formEdit:{},emails:[],countries:[],stateCity:[],cities:[],subdistrict:[],moreCountry:null,moreState:null,moreCity:null,moreSubdistrict:null,loadingMoreCountry:!1,loadingMoreState:!1,loadingMoreCity:!1,loadingMoreSubdistrict:!1,currentPlace:null,mapOptions:{minZoom:5,maxZoom:20,draggable:!0,scrollwheel:!1,mapTypeControl:!1,zoomControl:!0,scaleControl:!0,streetViewControl:!1},zoom:10,marker:{position:{lat:-7.7470633,lng:110.42026194444445},label:{color:"black",fontFamily:"Material Icons",fontSize:"20px",text:"face"}},businessTypes:[]}},computed:{selectedStore:function(){return this.$store.getters.selectedStore},token:function(){return this.$store.state.user.token},lang:function(){return this.$store.state.userStores.lang},langId:function(){return this.$store.state.userStores.langId},uploadPhotoUrl:function(){return(0,s.baseApi)(this.selectedStore.url_id,this.$store.state.userStores.langId,"generalsetting/uploadlogo")},fileList:function(){if(this.dataStore.logo){var t=[];return t.push({url:this.dataStore.logo,name:this.dataStore.logo_name}),t}},google:n.gmapApi,computedDisabledInput:function(){return!this.isEdit}},watch:{"$store.getters.selectedStore":function(){this.getStoreData()}},mounted:function(){this.getStoreData(),this.getBusinessTypes()},methods:{getStoreData:function(){var t=this;this.loading=!0;var e={Authorization:"Bearer "+this.token.access_token};(0,o.default)({method:"GET",url:(0,s.baseApi)(this.selectedStore.url_id,this.langId,"generalsetting/"),headers:e}).then(function(e){t.dataStore=e.data.data,t.dataStore.location_lat&&t.dataStore.location_lon&&(t.marker.position={lat:parseFloat(t.dataStore.location_lat),lng:parseFloat(t.dataStore.location_lon)}),t.emails=t.dataStore.email.split(","),t.checkAddressDetail(),t.loading=!1}).catch(function(e){t.loading=!1,t.$notify({type:"warning",title:e.response.data.error.message,message:e.response.data.error.error})})},checkAddressDetail:function(){this.getCountry(),this.getStateCity(this.dataStore.country_id),this.getCity(this.dataStore.state_id),this.getSubdistrict(this.dataStore.city_id)},getCountry:function(){var t=this;this.loading=!0;var e={Authorization:"Bearer "+this.token.access_token};(0,o.default)({method:"GET",url:(0,s.baseApi)(this.selectedStore.url_id,this.langId,"shippingcountry"),headers:e,params:{search:"",per_page:100}}).then(function(e){t.countries=e.data.data,t.moreCountry=e.data.links.next,t.isEdit&&(t.formEdit.country_id="",t.formEdit.country_name="",t.formEdit.state_id="",t.formEdit.state_name="",t.formEdit.city_id="",t.formEdit.city_name="",t.formEdit.subdistrict_id="",t.formEdit.postal_code=""),t.loading=!1}).catch(function(e){t.countries=[],t.loading=!1,t.$notify({type:"warning",title:e.response.data.error.message,message:e.response.data.error.error})})},getStateCity:function(t){var e=this;this.loading=!0;var i={Authorization:"Bearer "+this.token.access_token},a={search_column:"country_id",search_operator:"=",per_page:100};t?this.$set(a,"search_text",t):this.$set(a,"search_text",0),(0,o.default)({method:"GET",url:(0,s.baseApi)(this.selectedStore.url_id,this.langId,"state"),headers:i,params:a}).then(function(i){e.stateCity=i.data.data,e.moreState=i.data.links.next,0!==t&&e.isEdit&&(e.formEdit.state_id="",e.formEdit.state_name="",e.formEdit.city_id="",e.formEdit.city_name="",e.formEdit.subdistrict_id="",e.formEdit.postal_code=""),e.loading=!1}).catch(function(t){e.loading=!1,e.$notify({type:"warning",title:t.response.data.error.message,message:t.response.data.error.error})})},getCity:function(t){var e=this;this.loading=!0;var i={Authorization:"Bearer "+this.token.access_token},a={search_column:"state_id",search_operator:"=",per_page:100};t?this.$set(a,"search_text",t):this.$set(a,"search_text",0),(0,o.default)({method:"GET",url:(0,s.baseApi)(this.selectedStore.url_id,this.langId,"shippingcity"),headers:i,params:a}).then(function(i){e.cities=i.data.data,e.moreCity=i.data.links.next,e.loading=!1,0!==t&&e.isEdit&&(e.formEdit.city_id="",e.formEdit.city_name="",e.formEdit.subdistrict_id="",e.formEdit.postal_code="")}).catch(function(t){e.loading=!1,e.$notify({type:"warning",title:t.response.data.error.message,message:t.response.data.error.error})})},getSubdistrict:function(t){var e=this;this.loading=!0;var i={Authorization:"Bearer "+this.token.access_token},a={search_column:"city_id",search_operator:"=",per_page:100};t?this.$set(a,"search_text",t):this.$set(a,"search_text",0),(0,o.default)({method:"GET",url:(0,s.baseApi)(this.selectedStore.url_id,this.langId,"shippingcitysubdistrict"),headers:i,params:a}).then(function(i){e.subdistrict=i.data.data,e.moreSubdistrict=i.data.links.next,0!==t&&e.isEdit&&(e.formEdit.subdistrict_id="",e.formEdit.postal_code=""),e.loading=!1}).catch(function(t){e.loading=!1,e.$notify({type:"warning",title:t.response.data.error.message,message:t.response.data.error.error})})},handleSelected:function(t,e){if("country"===t)if(0===e){this.loadMore(t,this.moreCountry,{search:"",per_page:100})}else this.stateCity=[],this.getStateCity(e);else"state"===t?(this.cities=[],this.getCity(e)):"city"===t&&(this.subdistrict=[],this.getSubdistrict(e))},loadMore:function(t,e,i){var a=this,s={Authorization:"Bearer "+this.token.access_token};(0,o.default)({method:"GET",url:e,params:i,headers:s}).then(function(e){"country"===t?(e.data.links.next?a.formEdit.country_id=a.countries[99].name:a.formEdit.country_id=a.countries[199].name,a.countries=a.countries.concat(e.data.data),a.moreCountry=e.data.links.next,a.loadingMoreCountry=!1):"state"===t?(a.stateCity=a.stateCity.concat(e.data.data),a.moreState=e.data.links.next,a.loadingMoreState=!1):"city"===t?(a.cities=a.cities.concat(e.data.data),a.moreCity=e.data.links.next,a.loadingMoreCity=!1):"subdistrict"===t&&(a.subdistrict=a.subdistrict.concat(e.data.data),a.moreSubdistrict=e.data.links.next,a.loadingMoreSubdistrict=!1)}).catch(function(e){"country"===t?a.loadingMoreCountry=!1:"state"===t?a.loadingMoreState=!1:"city"===t?a.loadingMoreCity=!1:"subdistrict"===t&&(a.loadingMoreSubdistrict=!1),a.$notify({type:"warning",title:e.response.data.error.message,message:e.response.data.error.error})})},handleUploadFailed:function(t){this.$notify({type:"warning",title:t.response.data.error.message,message:t.response.data.error.error})},handleUploadSuccess:function(t){this.dataStore=t.data,this.changePhoto=!1},edit:function(){this.formEdit=(0,a.default)({},this.dataStore),this.isEdit=!0},cancel:function(){this.isEdit=!1,this.formEdit={}},removeEmail:function(t){this.emails.length>1?this.emails.splice(this.emails.indexOf(t),1):this.$notify({type:"warning",title:this.$lang[this.langId].cant_delete,message:this.$lang[this.langId].delete_email})},addEmail:function(t){this.inputEmail=t.target.value,this.emails.push(this.inputEmail),this.inputEmail=""},save:function(){var t=this,e=this.emails.join(",");this.formEdit.email=e,this.loading=!0;var i={Authorization:"Bearer "+this.token.access_token},a=this.formEdit;(0,o.default)({method:"PUT",url:(0,s.baseApi)(this.selectedStore.url_id,this.langId,"generalsetting/update"),headers:i,data:a}).then(function(e){t.result=e.data.data,t.$message({type:"success",message:"saved"}),t.loading=!1,t.isEdit=!1,t.getStoreData(),t.$parent.$parent.$parent.getProfile(),t.$parent.$parent.$parent.getStoreData()}).catch(function(e){t.loading=!1,t.isEdit=!0,t.$notify({type:"warning",title:e.response.data.error.message,message:e.response.data.error.error})})},publishStore:function(){var t=this;this.loading=!0;var e={Authorization:"Bearer "+this.token.access_token},i={pos_published:this.formEdit.pos_published,website_published:this.formEdit.website_published};(0,o.default)({method:"PUT",url:(0,s.baseApi)(this.selectedStore.url_id,this.langId,"generalsetting/publish"),headers:e,data:i}).then(function(e){t.result=e.data.data,t.$message({type:"success",message:"saved"}),t.loading=!1}).catch(function(e){t.loading=!1,t.isEdit=!0,t.$notify({type:"warning",title:e.response.data.error.message,message:e.response.data.error.error})})},onMapClick:function(t){this.marker.position.lat=t.latLng.lat(),this.marker.position.lng=t.latLng.lng(),this.getFormattedAddress(t.latLng.lat(),t.latLng.lng())},getGeolocation:function(){var t=this,e=(new this.google.maps.InfoWindow,this.$refs.storeLocationOnMap.$mapObject);navigator.geolocation.getCurrentPosition(function(i){var a={lat:i.coords.latitude,lng:i.coords.longitude};e.setCenter(a),t.marker.position=a,t.getFormattedAddress(a.lat,a.lng)})},getFormattedAddress:function(t,e){var i=this;this.formEdit.location_lat=t,this.formEdit.location_lon=e,o.default.get("https://maps.googleapis.com/maps/api/geocode/json",{params:{latlng:t+","+e,key:"AIzaSyA0adbyptSOlZbbq9T_z6X4y7TS9rOFryo"}}).then(function(t){i.formEdit.address=t.data.results[0].formatted_address}).catch(function(t){})},getBusinessTypes:function(){var t=this;(0,r.getBusinessTypes)({per_page:100}).then(function(e){t.businessTypes=e.data.data})}}}}}]);