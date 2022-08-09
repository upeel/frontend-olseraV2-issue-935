(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-6f44"],{"1BPP":function(e,t,i){"use strict";
/**
 * Vue Currency Input 1.20.3
 * (c) 2018-2020 Matthias Stiller
 * @license MIT
 */
function n(e,t,i){var n=document.createEvent("CustomEvent");n.initCustomEvent(t,!0,!0,i),e.dispatchEvent(n)}i.r(t),i.d(t,"CurrencyDirective",function(){return $}),i.d(t,"CurrencyInput",function(){return w}),i.d(t,"parseCurrency",function(){return g}),i.d(t,"setValue",function(){return h});var r=function(e,t,i){return t&&null!=e?Number(e.toFixed(i).split(".").join("")):e},a=function(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")},o=function(e){return e.replace(/^0+(0$|[^0])/,"$1")},s=function(e,t){return(e.match(new RegExp(a(t),"g"))||[]).length},c=function(e,t){return e.substring(0,t.length)===t},l=function(e,t){return e.substring(0,e.indexOf(t))},u=[",",".","٫"],d=function(e){var t=e.currency,i=e.locale,n=e.precision,r=e.autoDecimalMode,a=e.valueAsInteger,o=new Intl.NumberFormat(i,"string"==typeof t?{currency:t,style:"currency"}:{minimumFractionDigits:1}),c=o.format(123456);this.locale=i,this.currency=t,this.digits=[0,1,2,3,4,5,6,7,8,9].map(function(e){return e.toLocaleString(i)}),this.decimalSymbol=s(c,this.digits[0])?c.substr(c.indexOf(this.digits[6])+1,1):void 0,this.groupingSymbol=c.substr(c.indexOf(this.digits[3])+1,1),this.minusSymbol=l(Number(-1).toLocaleString(i),this.digits[1]),void 0===this.decimalSymbol?this.minimumFractionDigits=this.maximumFractionDigits=0:"number"==typeof n?this.minimumFractionDigits=this.maximumFractionDigits=n:"object"!=typeof n||r||a?"string"==typeof t?(this.minimumFractionDigits=o.resolvedOptions().minimumFractionDigits,this.maximumFractionDigits=o.resolvedOptions().maximumFractionDigits):this.minimumFractionDigits=this.maximumFractionDigits=2:(this.minimumFractionDigits=n.min||0,this.maximumFractionDigits=void 0!==n.max?n.max:20),"string"==typeof t?(this.prefix=l(c,this.digits[1]),this.negativePrefix=l(o.format(-1),this.digits[1]),this.suffix=c.substring(c.lastIndexOf(this.decimalSymbol?this.digits[0]:this.digits[6])+1)):(this.prefix=(t||{}).prefix||"",this.negativePrefix=""+this.minusSymbol+this.prefix,this.suffix=(t||{}).suffix||"")};d.prototype.parse=function(e){var t=this.isNegative(e);e=this.normalizeDigits(e),e=this.stripCurrencySymbol(e),e=this.stripMinusSymbol(e);var i=this.decimalSymbol?"("+a(this.decimalSymbol)+"\\d*)?":"",n=e.match(new RegExp("^"+this.integerPattern()+i+"$"));return n?Number((t?"-":"")+this.onlyDigits(n[1])+"."+this.onlyDigits(n[3]||"")):null},d.prototype.format=function(e,t){return void 0===t&&(t={minimumFractionDigits:this.minimumFractionDigits,maximumFractionDigits:this.maximumFractionDigits}),"string"==typeof this.currency?e.toLocaleString(this.locale,Object.assign({},{style:"currency",currency:this.currency},t)):this.insertCurrencySymbol(Math.abs(e).toLocaleString(this.locale,t),e<0||0===e&&1/e<0)},d.prototype.integerPattern=function(){return"(0|[1-9]\\d{0,2}("+a(this.groupingSymbol)+"?\\d{3})*)"},d.prototype.toFraction=function(e){return""+this.digits[0]+this.decimalSymbol+this.onlyLocaleDigits(e.substr(1)).substr(0,this.maximumFractionDigits)},d.prototype.isFractionIncomplete=function(e){return!!this.normalizeDigits(e).match(new RegExp("^"+this.integerPattern()+a(this.decimalSymbol)+"$"))},d.prototype.isNegative=function(e){return c(e,this.negativePrefix)||c(e.replace("-",this.minusSymbol),this.minusSymbol)},d.prototype.insertCurrencySymbol=function(e,t){return""+(t?this.negativePrefix:this.prefix)+e+this.suffix},d.prototype.stripMinusSymbol=function(e){return e.replace("-",this.minusSymbol).replace(this.minusSymbol,"")},d.prototype.stripCurrencySymbol=function(e){return e.replace(this.negativePrefix,"").replace(this.prefix,"").replace(this.suffix,"")},d.prototype.normalizeDecimalSymbol=function(e,t){var i=this;return u.forEach(function(n){e=e.substr(0,t)+e.substr(t).replace(n,i.decimalSymbol)}),e},d.prototype.normalizeDigits=function(e){return"0"!==this.digits[0]&&this.digits.forEach(function(t,i){e=e.replace(new RegExp(t,"g"),i)}),e},d.prototype.onlyDigits=function(e){return this.normalizeDigits(e).replace(/\D+/g,"")},d.prototype.onlyLocaleDigits=function(e){return e.replace(new RegExp("[^"+this.digits.join("")+"]*","g"),"")};var m={locale:void 0,currency:"EUR",valueAsInteger:!1,distractionFree:!0,precision:void 0,autoDecimalMode:!1,valueRange:void 0,allowNegative:!0},g=function(e,t){var i=Object.assign({},m,t),n=new d(i);return r(n.parse(e),i.valueAsInteger,n.maximumFractionDigits)},h=function(e,t){return n(e,"format",{value:t})},f=function(e,t){return e.setSelectionRange(t,t)},p=function(e,t){if(e===t)return!0;if(!e||!t||"object"!=typeof e||"object"!=typeof t)return!1;var i=Object.keys(e);return i.length===Object.keys(t).length&&(!!i.every(Object.prototype.hasOwnProperty.bind(t))&&i.every(function(i){return p(e[i],t[i])}))},v=function(e){this.numberFormat=e};v.prototype.conformToMask=function(e,t){var i=this;void 0===t&&(t="");var n=this.numberFormat.isNegative(e),r=e;r=this.numberFormat.stripCurrencySymbol(r);var a=function(e){if(""===e&&n&&t!==i.numberFormat.negativePrefix)return"";if(i.numberFormat.maximumFractionDigits>0){if(i.numberFormat.isFractionIncomplete(e))return e;if(c(e,i.numberFormat.decimalSymbol))return i.numberFormat.toFraction(e)}return null}(r=this.numberFormat.stripMinusSymbol(r));if(null!=a)return this.numberFormat.insertCurrencySymbol(a,n);var s=r.split(this.numberFormat.decimalSymbol),l=s[0],u=s.slice(1),d=o(this.numberFormat.onlyDigits(l)),m=this.numberFormat.onlyDigits(u.join("")).substr(0,this.numberFormat.maximumFractionDigits),g=u.length>0&&0===m.length,h=""===d&&n&&(t===e.slice(0,-1)||t!==this.numberFormat.negativePrefix);return g||h?t:d.match(/\d+/)?{numberValue:Number((n?"-":"")+d+"."+m),fractionDigits:m}:""};var y=function(e){this.numberFormat=e};y.prototype.conformToMask=function(e){if(""===e)return"";var t=this.numberFormat.isNegative(e),i=""===this.numberFormat.stripMinusSymbol(e)?-0:Number((t?"-":"")+o(this.numberFormat.onlyDigits(e)))/Math.pow(10,this.numberFormat.minimumFractionDigits);return{numberValue:i,fractionDigits:i.toFixed(this.numberFormat.minimumFractionDigits).slice(-this.numberFormat.minimumFractionDigits)}};var b=Math.pow(2,53)-1,_=function(e,t,i){var n=i.$CI_DEFAULT_OPTIONS,r="input"===e.tagName.toLowerCase()?e:e.querySelector("input");if(!r)throw new Error("No input element found");var a=Object.assign({},n||m,t),o=a.distractionFree,s=a.autoDecimalMode,c=a.valueRange;"boolean"==typeof o&&(a.distractionFree={hideCurrencySymbol:o,hideNegligibleDecimalDigits:o,hideGroupingSymbol:o}),a.valueRange=c?{min:void 0!==c.min?Math.max(c.min,-b):-b,max:void 0!==c.max?Math.min(c.max,b):b}:{min:-b,max:b},s?(a.distractionFree.hideNegligibleDecimalDigits=!1,r.setAttribute("inputmode","numeric")):r.setAttribute("inputmode","decimal");var l=new d(a);return r.$ci=Object.assign({},r.$ci||{numberValue:null},{options:a,numberMask:a.autoDecimalMode?new y(l):new v(l),currencyFormat:l}),r},x=function(e,t){var i=e.$ci,a=i.numberValue,o=i.currencyFormat,s=i.options;n(e,t,{numberValue:a=r(a,s.valueAsInteger,o.maximumFractionDigits)})},D=function(e,t,i){void 0===i&&(i=!1);var n=e.$ci,r=n.currencyFormat,a=n.options;S(e,null!=t?r.format(function(e,t){return Math.min(Math.max(e,t.min),t.max)}(t,a.valueRange)):null),(t!==e.$ci.numberValue||i)&&x(e,"change")},S=function(e,t,i){void 0===i&&(i=!1),function(e,t,i){if(null!=t){var n=e.$ci,r=n.focus,a=n.decimalSymbolInsertedAt,o=n.options,s=n.numberMask,c=n.currencyFormat,l=n.previousConformedValue,u=o.allowNegative,d=o.distractionFree;void 0!==a&&(t=c.normalizeDecimalSymbol(t,a),e.$ci.decimalSymbolInsertedAt=void 0);var m,g=s.conformToMask(t,l);if("object"==typeof g){var h=g.numberValue,f=g.fractionDigits,p=c.maximumFractionDigits,v=c.minimumFractionDigits;r&&(v=p),v=i?f.replace(/0+$/,"").length:Math.min(v,f.length),m=h>b?l:c.format(h,{useGrouping:!(r&&d.hideGroupingSymbol),minimumFractionDigits:v,maximumFractionDigits:p})}else m=g;u||(m=m.replace(c.negativePrefix,c.prefix)),r&&d.hideCurrencySymbol&&(m=m.replace(c.negativePrefix,c.minusSymbol).replace(c.prefix,"").replace(c.suffix,"")),e.value=m,e.$ci.numberValue=c.parse(e.value)}else e.value=e.$ci.numberValue=null;e.$ci.previousConformedValue=e.value}(e,t,i),x(e,"input")},F=function(e){e.addEventListener("input",function(t){if(!t.detail){var i=e.value,n=e.selectionStart,r=e.$ci,a=r.currencyFormat,o=r.options;S(e,i),e.$ci.focus&&f(e,function(e,t,i,n,r){var a=n.prefix,o=n.suffix,c=n.decimalSymbol,l=n.maximumFractionDigits,u=n.groupingSymbol,d=t.indexOf(c)+1,m=t.length-i;return Math.abs(e.length-t.length)>1&&i<=d?e.indexOf(c)+1:e.substr(i,1)===u&&s(e,u)===s(t,u)+1?e.length-m-1:(!r.autoDecimalMode&&0!==d&&i>d&&n.onlyDigits(t.substr(d)).length-1===l&&(m-=1),r.distractionFree.hideCurrencySymbol?e.length-m:Math.max(e.length-Math.max(m,o.length),0===a.length?0:a.length+1))}(e.value,i,n,a,o))}},{capture:!0}),e.addEventListener("keypress",function(t){u.includes(t.key)&&(e.$ci.decimalSymbolInsertedAt=e.selectionStart)}),e.addEventListener("format",function(t){var i=e.$ci,n=i.currencyFormat,r=i.options,a=i.numberValue,o=function(e){return r.valueAsInteger&&null!=e?e/Math.pow(10,n.maximumFractionDigits):e}(t.detail.value);a!==o&&D(e,o)}),e.addEventListener("focus",function(){e.$ci.focus=!0;var t=e.$ci.options.distractionFree,i=t.hideCurrencySymbol,n=t.hideGroupingSymbol,r=t.hideNegligibleDecimalDigits;(i||n||r)&&setTimeout(function(){var t=e.value,i=e.selectionStart,n=e.selectionEnd;t&&S(e,t,r),Math.abs(i-n)>0?e.setSelectionRange(0,e.value.length):f(e,function(e,t,i,n){var r=n;return t.distractionFree.hideCurrencySymbol&&(r-=e.prefix.length),t.distractionFree.hideGroupingSymbol&&(r-=s(i.substring(0,n),e.groupingSymbol)),Math.max(0,r)}(e.$ci.currencyFormat,e.$ci.options,t,i))})}),e.addEventListener("blur",function(){e.$ci.focus=!1,null!=e.$ci.numberValue&&D(e,e.$ci.numberValue)}),e.addEventListener("change",function(t){t.detail||x(e,"change")})},$={bind:function(e,t,i){var n=t.value,r=i.context,a=_(e,n,r);F(a),h(a,a.$ci.currencyFormat.parse(a.value))},componentUpdated:function(e,t,i){var n=t.value,r=t.oldValue,a=i.context;if(!p(n,r)){var o=_(e,n,a);D(o,o.$ci.numberValue,!0)}}},w={render:function(e){var t=this;return e("input",{directives:[{name:"currency",value:this.options}],on:Object.assign({},this.$listeners,{change:function(e){e.detail&&t.$emit("change",e.detail.numberValue)},input:function(e){e.detail&&t.value!==e.detail.numberValue&&t.$emit("input",e.detail.numberValue)}})})},directives:{currency:$},name:"CurrencyInput",props:{value:{type:Number,default:null},locale:{type:String,default:void 0},currency:{type:[String,Object],default:void 0},distractionFree:{type:[Boolean,Object],default:void 0},precision:{type:[Number,Object],default:void 0},autoDecimalMode:{type:Boolean,default:void 0},valueAsInteger:{type:Boolean,default:void 0},valueRange:{type:Object,default:void 0},allowNegative:{type:Boolean,default:void 0}},mounted:function(){this.setValue(this.value)},computed:{options:function(){var e=this,t=Object.assign({},this.$CI_DEFAULT_OPTIONS||m);return Object.keys(m).forEach(function(i){void 0!==e[i]&&(t[i]=e[i])}),t}},watch:{value:"setValue"},methods:{setValue:function(e){h(this.$el,e)}}},C={install:function(e,t){void 0===t&&(t={});var i=t.componentName;void 0===i&&(i=w.name);var n=t.directiveName;void 0===n&&(n="currency");var r=t.globalOptions;void 0===r&&(r={}),e.prototype.$CI_DEFAULT_OPTIONS=Object.assign({},m,r),e.component(i,w),e.directive(n,$),e.prototype.$parseCurrency=function(e,t){return void 0===t&&(t={}),g(e,Object.assign({},r,t))}}};"undefined"!=typeof window&&window.Vue&&window.Vue.use(C),t.default=C},FDIc:function(e,t,i){"use strict";i.r(t);var n=i("mELX"),r=i("vBeN");for(var a in r)["default"].indexOf(a)<0&&function(e){i.d(t,e,function(){return r[e]})}(a);var o=i("KHd+"),s=Object(o.a)(r.default,n.a,n.b,!1,null,null,null);s.options.__file="Index.vue",t.default=s.exports},Wwrm:function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=c(i("P2sY")),r=i("xCek"),a=c(i("vDqi")),o=c(i("Ckak")),s=i("6y4V");function c(e){return e&&e.__esModule?e:{default:e}}t.default={components:{InputMoney:o.default},mixins:[s.checkCustomPermission],data:function(){return{loading:!0,data:[],currency:[],selectCurrency:null,isEditing:[],tmp:{},addDialog:!1,deleteDialog:!1,deleteData:{},formAdd:{exchange_rate:"",currency_id:""},moneyIDR:{decimal:".",thousand:",",prefix:"",suffix:"",precision:2,masked:!1},moneyDollar:{decimal:",",thousand:".",prefix:"",suffix:"",precision:2,masked:!1}}},computed:{selectedStore:function(){return this.$store.getters.selectedStore},token:function(){return this.$store.state.user.token},lang:function(){return this.$store.state.userStores.lang},langId:function(){return this.$store.state.userStores.langId},computedExchange:function(){var e=this,t=1/this.formAdd.exchange_rate,i="",n="";this.currency.map(function(t){t.id===e.selectCurrency&&(i=t.name),t.id===e.formAdd.currency_id&&(n=t.name)});var r=parseFloat(t).toFixed(2)+" "+i+" = 1 "+n;return t===Number.POSITIVE_INFINITY||t===Number.NEGATIVE_INFINITY?"":r}},watch:{"store.getters.selectedStore":function(){this.getDefaultCurrency(),this.getData()}},methods:{getDefaultCurrency:function(){this.selectCurrency=this.selectedStore.currency_id},getData:function(){var e=this;this.loading=!0;var t={Authorization:"Bearer "+this.token.access_token};(0,a.default)({method:"GET",url:(0,r.baseApi)(this.selectedStore.url_id,this.langId,"storecurrency/"),headers:t}).then(function(t){e.data=t.data.data,e.data.map(function(){e.isEditing.push({editing:!1})}),e.loading=!1}).catch(function(t){e.loading=!1,e.data=[]})},getCurrency:function(){var e=this;this.loading=!0;var t={Authorization:"Bearer "+this.token.access_token};(0,a.default)({method:"GET",url:(0,r.baseApi)(this.selectedStore.url_id,this.langId,"storecurrency/getcurrency"),headers:t,params:{search:""}}).then(function(t){e.currency=t.data.data,e.loading=!1}).catch(function(t){e.loading=!1,e.$notify({type:"warning",title:"Error",message:t})})},handleSelect:function(e){var t=this;this.loading=!0;var i={Authorization:"Bearer "+this.token.access_token},n={currency_id:e};(0,a.default)({method:"POST",url:(0,r.baseApi)(this.selectedStore.url_id,this.langId,"storecurrency/updatebasecurrency"),headers:i,data:n}).then(function(e){t.$message({type:"success",message:"saved"}),t.$store.dispatch("setSelectedStore",t.selectedStore.store_id).then(function(e){t.getData(),t.loading=!1}).catch(function(e){t.loading=!1,t.$message({type:"error",message:e.string})})}).catch(function(e){t.loading=!1,t.$notify({type:"warning",title:e.response.data.error.message,message:e.response.data.error.error})})},edit:function(e,t){this.checkCustomPermission("settings/storecurrency","edit")&&(this.tmp={},this.isEditing.map(function(e){e.editing=!1}),this.isEditing[t].editing=!0,this.tmp=(0,n.default)({},e))},cancelEdit:function(e){this.isEditing[e].editing=!1,this.tmp={}},handleRemove:function(e){this.deleteData=(0,n.default)({},e),this.deleteDialog=!0},save:function(e){var t=this,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,n="POST",o="store",s="",c=e;e.id&&(n="PUT",o="update/",s=e.id),this.loading=!0;var l={Authorization:"Bearer "+this.token.access_token};(0,a.default)({method:n,url:(0,r.baseApi)(this.selectedStore.url_id,this.langId,"storecurrency/"+o+s),headers:l,data:c}).then(function(e){null!==i&&t.cancelEdit(i),t.addDialog=!1,t.loading=!1,t.getData(),t.$message({type:"success",message:"saved"})}).catch(function(e){t.$notify({type:"warning",title:e.response.data.error.message,message:e.response.data.error.error}),t.loading=!1})},addStoreCurrency:function(){this.addDialog=!0,this.formAdd.currency_id=this.selectCurrency},cancelAddDialog:function(){this.addDialog=!1},cancelDeleteDialog:function(){this.deleteDialog=!1,this.deleteData={}},removeDeleteDialog:function(e){var t=this,i=e;this.loading=!0;var n={Authorization:"Bearer "+this.token.access_token};(0,a.default)({method:"DELETE",url:(0,r.baseApi)(this.selectedStore.url_id,this.langId,"storecurrency/delete/"+i),headers:n}).then(function(e){t.loading=!1,t.deleteDialog=!1,t.$message({type:"success",message:"saved"}),t.getData()}).catch(function(e){t.loading=!1,t.deleteDialog=!0,t.$notify({type:"warning",title:e.response.data.error.message,message:e.response.data.error.error})})},updateText:function(){console.log("aaaa"),console.log(this.$refs)}},mounted:function(){this.getDefaultCurrency(),this.getCurrency(),this.getData()}}},mELX:function(e,t,i){"use strict";i.d(t,"a",function(){return n}),i.d(t,"b",function(){return r});var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}]},[i("el-card",{staticClass:"box-card"},[i("div",{staticClass:"table-handler-flex",attrs:{slot:"header"},slot:"header"},[i("h4",{staticStyle:{"flex-grow":"1"}},[e._v(e._s(e.lang.sales_currency))]),e._v(" "),i("button-action-authenticated",{attrs:{permission:["settings/storecurrency","edit"],type:"success",icon:"el-icon-plus"},on:{click:e.addStoreCurrency}},[e._v("\n        "+e._s(e.lang.add)+"\n      ")])],1),e._v(" "),i("div",{staticClass:"card-body"},[i("el-form",{attrs:{"label-width":"50%"}},[i("el-form-item",[i("template",{slot:"label"},[i("h5",{staticClass:"font-bold",staticStyle:{"margin-bottom":"8px","margin-top":"0"}},[e._v(e._s(e.lang.base_currency))]),e._v(" "),i("p",[e._v(e._s(e.$lang[e.langId].currency_based_your_store))])]),e._v(" "),i("el-select",{attrs:{disabled:!e.checkCustomPermission("settings/storecurrency","edit")},on:{change:e.handleSelect},model:{value:e.selectCurrency,callback:function(t){e.selectCurrency=t},expression:"selectCurrency"}},e._l(e.currency,function(e){return i("el-option",{key:e.id,attrs:{label:e.name,value:e.id}})}),1)],2)],1),e._v(" "),i("el-divider"),e._v(" "),i("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],attrs:{data:e.data,stripe:""}},[i("el-table-column",{attrs:{label:e.lang.exchange_rate,prop:"base_currency_id","min-width":"160"},scopedSlots:e._u([{key:"default",fn:function(t){return[i("p",[e._v("1 "+e._s(t.row.base_currency_name)+" ("+e._s(t.row.base_currency_id)+")")])]}}])}),e._v(" "),i("el-table-column",[[i("svg-icon",{attrs:{"icon-class":"arrow-right"}})]],2),e._v(" "),i("el-table-column",{staticClass:"form-in-cell-wrapper",attrs:{prop:"exchange_rate"},scopedSlots:e._u([{key:"default",fn:function(t){return[i("span",{staticClass:"editable",on:{click:function(i){return e.edit(t.row,t.$index)}}},[e._v("\n              "+e._s(t.row.exchange_rate)+"\n            ")]),e._v(" "),e.isEditing[t.$index].editing?i("div",{staticClass:"form-in-cell"},["IDR"===e.tmp.currency_id?i("input-money",e._b({model:{value:e.tmp.exchange_rate,callback:function(t){e.$set(e.tmp,"exchange_rate",t)},expression:"tmp.exchange_rate"}},"input-money",e.moneyIDR,!1)):i("input-money",e._b({model:{value:e.tmp.exchange_rate,callback:function(t){e.$set(e.tmp,"exchange_rate",t)},expression:"tmp.exchange_rate"}},"input-money",e.moneyDollar,!1)),e._v(" "),i("el-button",{attrs:{type:"info",icon:"el-icon-close",size:"mini"},on:{click:function(i){return e.cancelEdit(t.$index)}}}),e._v(" "),i("el-button",{attrs:{type:"success",icon:"el-icon-check",size:"mini"},on:{click:function(i){return e.save(e.tmp,t.$index)}}})],1):e._e()]}}])}),e._v(" "),i("el-table-column",{attrs:{prop:"currency_id","min-width":"160"},scopedSlots:e._u([{key:"default",fn:function(t){return[i("p",[e._v(e._s(t.row.currency_name)+" ("+e._s(t.row.currency_id)+")")])]}}])}),e._v(" "),i("el-table-column",{scopedSlots:e._u([{key:"default",fn:function(t){return[i("button-action-authenticated",{staticClass:"btn-plain",attrs:{permission:["settings/storecurrency","edit"],type:"danger",icon:"el-icon-delete",size:"mini"},on:{click:function(i){return e.handleRemove(t.row)}}})]}}])})],1)],1)]),e._v(" "),i("el-dialog",{attrs:{title:e.lang.add+" "+e.lang.exchange_rate,visible:e.addDialog,width:"60%","close-on-click-modal":!1,"show-close":!1},on:{"update:visible":function(t){e.addDialog=t}}},[i("el-form",{attrs:{"label-width":"40%"}},[i("el-form-item",[i("template",{slot:"label"},[i("el-row",[i("el-col",{attrs:{md:22}},[i("span",[e._v("1")]),e._v(" "),"IDR"===this.selectCurrency?i("span",[e._v(e._s(e.$lang[e.langId].rupiah)+" ("+e._s(this.selectCurrency)+")")]):e._e(),e._v(" "),"USD"===this.selectCurrency?i("span",[e._v(e._s(e.$lang[e.langId].american_dollar)+" ("+e._s(this.selectCurrency)+")")]):e._e(),e._v(" "),"SGD"===this.selectCurrency?i("span",[e._v(e._s(e.$lang[e.langId].singapore_dollar)+" ("+e._s(this.selectCurrency)+")")]):e._e()]),e._v(" "),i("el-col",{staticStyle:{"margin-top":"5px"},attrs:{md:2}},[i("svg-icon",{attrs:{"icon-class":"arrow-right"}})],1)],1)],1),e._v(" "),i("div",[i("input",{directives:[{name:"model",rawName:"v-model",value:e.formAdd.exchange_rate,expression:"formAdd.exchange_rate"}],staticStyle:{height:"36px"},attrs:{type:"number"},domProps:{value:e.formAdd.exchange_rate},on:{input:function(t){t.target.composing||e.$set(e.formAdd,"exchange_rate",t.target.value)}}}),e._v(" "),i("el-select",{staticStyle:{"margin-top":"10px"},model:{value:e.formAdd.currency_id,callback:function(t){e.$set(e.formAdd,"currency_id",t)},expression:"formAdd.currency_id"}},e._l(e.currency,function(e){return i("el-option",{key:e.id,attrs:{label:e.name,value:e.id}})}),1)],1),e._v(" "),i("div",{staticClass:"mt-12"},[e._v(e._s(e.computedExchange))])],2)],1),e._v(" "),i("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[i("el-button",{on:{click:e.cancelAddDialog}},[e._v(e._s(e.lang.cancel))]),e._v(" "),i("el-button",{attrs:{type:"success"},on:{click:function(t){return e.save(e.formAdd)}}},[e._v(e._s(e.lang.save))])],1)],1),e._v(" "),i("el-dialog",{attrs:{visible:e.deleteDialog,width:"50%",center:"","close-on-click-modal":!1,"show-close":!1},on:{"update:visible":function(t){e.deleteDialog=t}}},[i("span",{attrs:{slot:"title"},slot:"title"},[i("svg-icon",{staticStyle:{stroke:"#F44336"},attrs:{"icon-class":"alert-triangle"}}),e._v("\n      "+e._s(e.lang.notif_warn)+"\n    ")],1),e._v(" "),i("div",{staticClass:"text-center"},[i("p",[e._v(e._s(e.$lang[e.langId].are_you_want_remove)+" "+e._s(e.lang.exchange_rate)+"\n      ")]),e._v(" "),i("h3",[i("span",[e._v(e._s(e.deleteData.base_currency_id))]),e._v(" "),i("span",[i("svg-icon",{attrs:{"icon-class":"arrow-right"}})],1),e._v(" "),i("span",[e._v(e._s(e.deleteData.exchange_rate))]),e._v(" "),i("span",[e._v("("+e._s(e.deleteData.currency_id)+")")])]),e._v(" "),i("p",{staticStyle:{color:"#AFB0AF"}},[e._v(e._s(e.$lang[e.langId].info_delete_item))])]),e._v(" "),i("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[i("el-button",{on:{click:e.cancelDeleteDialog}},[e._v(e._s(e.lang.cancel))]),e._v(" "),i("el-button",{attrs:{type:"danger"},on:{click:function(t){return e.removeDeleteDialog(e.deleteData.id)}}},[e._v(e._s(e.$lang[e.langId].delete))])],1)])],1)},r=[]},vBeN:function(e,t,i){"use strict";i.r(t);var n=i("Wwrm"),r=i.n(n);for(var a in n)["default"].indexOf(a)<0&&function(e){i.d(t,e,function(){return n[e]})}(a);t.default=r.a}}]);