(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-db4f"],{"/2W8":function(t,e,a){"use strict";a.d(e,"a",function(){return i}),a.d(e,"b",function(){return n});var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"chacheli-designer",class:{dragging:t.dragging.active}},[a("chacheli-designer-layout",{ref:"layoutComp",attrs:{layout:t.layout,chachelis:t.chachelis,dragging:t.dragging},on:{"cell-clicked":t.cellClicked,"update-position":t.updatePosition,remove:t.handleRemove}}),t._v(" "),t.checkCustomPermission("settings/posrestolayout","edit")?a("chacheli-chooser",{attrs:{chachelis:t.chachelis,dragging:t.dragging}}):t._e()],1)},n=[]},"356E":function(t,e,a){"use strict";a.d(e,"a",function(){return i}),a.d(e,"b",function(){return n});var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("el-card",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],staticClass:"box-card"},[a("div",{staticClass:"table-handler-flex",attrs:{slot:"header"},slot:"header"},[a("h4",{staticClass:"box-title"},[t._v(t._s(t.lang.add))]),t._v(" "),a("div",[a("el-button",{attrs:{disabled:t.disabledSave,size:"small",type:"success",icon:"el-icon-check"},on:{click:t.save}},[t._v("\n          "+t._s(t.lang.save)+"\n        ")]),t._v(" "),t.data.id?a("button-action-authenticated",{attrs:{permission:["settings/posrestolayout","destroy"],disabled:t.disabledSave,size:"small",type:"danger",icon:"el-icon-delete"},on:{click:t.remove}}):t._e()],1)]),t._v(" "),a("div",{staticClass:"card-body"},[a("el-form",{attrs:{"label-width":"120px"},model:{value:t.data,callback:function(e){t.data=e},expression:"data"}},[a("el-form-item",{attrs:{label:t.lang.layout_name,required:!0}},[a("el-input",{attrs:{type:"text"},model:{value:t.data.name,callback:function(e){t.$set(t.data,"name",e)},expression:"data.name"}}),t._v(" "),a("p",{staticClass:"size-12 input-desc oldgrey"},[t._v("\n            "+t._s(t.lang.info_resto_layout_name)+"\n          ")])],1),t._v(" "),a("el-form-item",{attrs:{label:t.lang.table_numbers,required:!0}},[a("el-input",{attrs:{placeholder:"type and hit enter",type:"text"},on:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.addTablesState.apply(null,arguments)},change:t.addTablesState},model:{value:t.data.table_numbers,callback:function(e){t.$set(t.data,"table_numbers",e)},expression:"data.table_numbers"}}),t._v(" "),a("p",{staticClass:"size-12 input-desc oldgrey"},[t._v("\n            "+t._s(t.lang.info_table_numbers)+"\n          ")]),t._v(" "),t.data.items?t._l(t.data.items,function(e,i){return a("el-tag",{key:i,attrs:{closable:""},on:{close:function(a){return t.removeTable(e,i)}}},[t._v("\n              "+t._s(e.name)+"\n            ")])}):t._e()],2)],1)],1)])],1)},n=[]},"4z/Z":function(t,e,a){"use strict";a.d(e,"a",function(){return i}),a.d(e,"b",function(){return n});var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("span",{staticClass:"number-input button-group"},[t._v("\n  "+t._s(t.value)+"\n  "),a("el-button",{attrs:{size:"small"},on:{click:function(e){return e.preventDefault(),e.stopPropagation(),t.setValue(-1)}}},[t._v("\n    -\n  ")]),t._v(" "),a("el-button",{attrs:{size:"small"},on:{click:function(e){return e.preventDefault(),e.stopPropagation(),t.setValue(1)}}},[t._v("\n    +\n  ")])],1)},n=[]},"58RC":function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"number-input",props:["value"],methods:{setValue:function(t){this.$emit("input",this.value+t)}}}},"5itK":function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=s(a("m1cH")),n=s(a("QbLZ"));function s(t){return t&&t.__esModule?t:{default:t}}e.default={props:["saved","loading","formData","newState"],data:function(){return{disabledSave:!0,data:{items:[],table_numbers:""},arr:[]}},computed:{selectedStore:function(){return this.$store.getters.selectedStore},token:function(){return this.$store.state.user.token},lang:function(){return this.$store.state.userStores.lang}},watch:{data:{handler:function(t){t.items||(this.data.items=[]),t.name||(this.data.name=""),t.name&&""!==t.name&&t.items&&t.items.length>0?this.disabledSave=!1:this.disabledSave=!0},deep:!0},saved:{handler:function(t){this.disabledSave=!0===t},deep:!0},formData:{handler:function(t){var e=this;this.data=(0,n.default)({},t),t.items||(this.data.items=[]),t.name||(this.data.name=""),t.items&&t.items.map(function(t){-1===e.arr.indexOf(t.name)&&e.arr.push(t.name)})},deep:!0,immediate:!0}},methods:{addTablesState:function(t){var e=this;-1===this.arr.indexOf(t)&&this.arr.push(t),this.data.items=[],this.arr.map(function(t){e.data.items.push({name:t})}),this.data.table_numbers=""},save:function(){this.disabledSave=!0;var t=(0,n.default)({},this.data);t.tempitems=[].concat((0,i.default)(this.data.items)),t.items=t.tempitems.map(function(t){return t.name}),t.table_numbers=t.items.join(","),this.$emit("save",t)},remove:function(){this.$emit("remove",{id:this.data.id})},removeTable:function(t,e){this.data.items.splice(e,1);var a=[];this.data.items.map(function(t){a.push(t.name)}),this.arr=a}}}},"6tsq":function(t,e,a){"use strict";a.r(e);var i=a("z7cJ"),n=a("YTZs");for(var s in n)["default"].indexOf(s)<0&&function(t){a.d(e,t,function(){return n[t]})}(s);var r=a("KHd+"),o=Object(r.a)(n.default,i.a,i.b,!1,null,null,null);o.options.__file="ChacheliChooser.vue",e.default=o.exports},"6zRN":function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.Layout=e.Designer=void 0;var i=s(a("CmBG")),n=s(a("CIkr"));function s(t){return t&&t.__esModule?t:{default:t}}e.Designer=i.default,e.Layout=n.default},"7wAm":function(t,e,a){"use strict";a.r(e);var i=a("yG0x"),n=a.n(i);for(var s in i)["default"].indexOf(s)<0&&function(t){a.d(e,t,function(){return i[t]})}(s);e.default=n.a},"7yJc":function(t,e,a){"use strict";a.d(e,"a",function(){return i}),a.d(e,"b",function(){return n});var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"chacheli-layout"},[t._l(t.chachelis,function(e){return[e.available?t._e():a("div",{key:e.id,staticClass:"chacheli",style:{top:e.y*t.v+"%",left:e.x*t.h+"%",width:e.w*t.h+"%",height:e.h*t.v+"%"}},[a(e.comp,{tag:"component",attrs:{meta:e,data:t.data[e.id]}})],1)]})],2)},n=[]},AFwf:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=function(t){return t&&t.__esModule?t:{default:t}}(a("EfOy"));e.default={name:"chacheli-designer-layout",components:{Chacheli:i.default},props:["layout","chachelis","dragging"],data:function(){return{placeholder:{interaction:"resize",hidden:!0,invalid:!1,unit:"px",t:0,l:0,w:1,h:1},units:{v:0,h:0}}},computed:{placeholderStyle:function(){return{top:this.placeholder.t+this.placeholder.unit,left:this.placeholder.l+this.placeholder.unit,width:this.placeholder.w+this.placeholder.unit,height:this.placeholder.h+this.placeholder.unit}},interactClass:function(){return this.placeholder.hidden?"":"interact "+this.placeholder.interaction}},watch:{"layout.cols":function(){this.calc()},"layout.rows":function(){this.calc()},"dragging.active":function(t){t?this.dragStart():this.dragEnd()}},methods:{calc:function(){this.units.v=100/this.layout.rows,this.units.h=100/this.layout.cols},resizeStart:function(t){this.interactStart(t,"resize",this.resizeMove)},resizeMove:function(t){this.placeholder.w=this.interact.w0+t.clientX-this.interact.x0,this.placeholder.h=this.interact.h0+t.clientY-this.interact.y0,this.maybeUpdateChacheli(this.interact.chacheli.x,this.interact.chacheli.y,Math.max(1,Math.round(this.placeholder.w/this.interact.xu)),Math.max(1,Math.round(this.placeholder.h/this.interact.yu)))},positionStart:function(t){this.interactStart(t,"drag",this.positionMove)},handleRemove:function(t){this.$emit("remove",t)},positionMove:function(t){this.placeholder.l=this.interact.l0+t.clientX-this.interact.x0,this.placeholder.t=this.interact.t0+t.clientY-this.interact.y0,this.maybeUpdateChacheli(Math.round(this.placeholder.l/this.interact.xu),Math.round(this.placeholder.t/this.interact.yu),this.interact.chacheli.w,this.interact.chacheli.h)},dragStart:function(){this.interact.dragging=!1,this.$el.addEventListener("mouseenter",this.dragEnter,!1),this.$el.addEventListener("mouseleave",this.dragLeave,!1),this.$el.addEventListener("mousemove",this.dragOver,!1)},dragEnter:function(t){this.dragging.active&&(this.interact.dragging=!0,this.interact.x0=this.interact.y0=-1,this.placeholder.unit="%",this.placeholder.hidden=!1,this.placeholder.interaction="dnd",this.placeholder.invalid=!1,this.placeholder.w=this.units.h,this.placeholder.h=this.units.v,this.createValidationGrid(null),this.calcInteractUnits(),this.dragOver(t))},dragOver:function(t){var e=this.$el.getBoundingClientRect(),a=Math.floor((t.clientX-e.left)/this.interact.xu),i=Math.floor((t.clientY-e.top)/this.interact.yu);a===this.interact.x0&&i===this.interact.y0||(this.interact.x0=a,this.interact.y0=i,this.placeholder.l=a*this.units.h,this.placeholder.t=i*this.units.v,this.placeholder.invalid=!this.validateChacheli(a,i,1,1))},dragLeave:function(){this.placeholder.hidden=!0,this.interact.dragging=!1},dragEnd:function(){if(this.$el.removeEventListener("mouseenter",this.dragEnter,!1),this.$el.removeEventListener("mouseleave",this.dragLeave,!1),this.$el.removeEventListener("mousemove",this.dragOver,!1),this.interactCleanup(),this.interact.dragging&&!this.dragging.cancelled&&!this.placeholder.invalid){var t=this.chachelis[this.dragging.index];t&&t.available&&(t.available=!1,t.x=this.interact.x0,t.y=this.interact.y0,t.w=t.h=1),this.$emit("update-position",{col:t.x,row:t.y,id:t.id})}},interactStart:function(t,e,a){this.placeholder.unit="px",this.placeholder.hidden=!1,this.placeholder.invalid=!1,this.placeholder.interaction=e,this.placeholder.t=this.interact.t0=t.initialPos.top,this.placeholder.l=this.interact.l0=t.initialPos.left,this.placeholder.w=this.interact.w0=t.initialPos.width,this.placeholder.h=this.interact.h0=t.initialPos.height,this.interact.x0=t.event.clientX,this.interact.y0=t.event.clientY,this.interact.chacheli=t.chacheli,this.interact.handler=a,this.calcInteractUnits(),this.createValidationGrid(t.chacheli),document.documentElement.addEventListener("mousemove",this.interact.handler,!1),document.documentElement.addEventListener("mouseup",this.interactStop,!1)},interactStop:function(){document.documentElement.removeEventListener("mousemove",this.interact.handler,!1),document.documentElement.removeEventListener("mouseup",this.interactStop,!1),this.interactCleanup()},calcInteractUnits:function(){var t=document.defaultView.getComputedStyle(this.$el);this.interact.xu=Math.floor(parseInt(t.width)/this.layout.cols),this.interact.yu=Math.floor(parseInt(t.height)/this.layout.rows)},createValidationGrid:function(t){var e=parseInt(this.layout.rows),a=parseInt(this.layout.cols);this.interact.grid=new Array(e);for(var i=0;i<e;i++)for(var n=this.interact.grid[i]=new Array(a),s=0;s<a;s++)n[s]=1;for(var r=0;r<this.chachelis.length;r++){var o=this.chachelis[r];if(o!==t&&!o.available)for(var l=0;l<o.h;l++)for(var c=0;c<o.w;c++)this.interact.grid[o.y+l][o.x+c]=0}},validateChacheli:function(t,e,a,i){for(var n=0;n<i;n++)for(var s=0;s<a;s++){var r=this.interact.grid[e+n];if(!r||!r[t+s])return!1}return!0},maybeUpdateChacheli:function(t,e,a,i){var n=this.interact.chacheli;n.x!==t||n.y!==e||n.w!==a||n.h!==i?(this.validateChacheli(t,e,a,i)?(n.x=t,n.y=e,n.w=a,n.h=i,this.placeholder.invalid=!1):this.placeholder.invalid=!0,this.$emit("update-position",{col:t,row:e,id:n.id})):this.placeholder.invalid=!1},interactCleanup:function(){this.placeholder.hidden=!0,this.interact.chacheli=null,this.interact.grid=null},minColumns:function(){for(var t=1,e=0;e<this.chachelis.length;e++){var a=this.chachelis[e];a.available||(t=Math.max(t,a.x+a.w))}return t},minRows:function(){for(var t=1,e=0;e<this.chachelis.length;e++){var a=this.chachelis[e];a.available||(t=Math.max(t,a.y+a.h))}return t},onClick:function(t,e){var a={row:t-1,col:e-1};this.$emit("cell-clicked",a)}},created:function(){this.calc(),this.interact={chacheli:null,handler:null,x0:0,y0:0,l0:0,t0:0,w0:0,h0:0,xu:0,yu:0,grid:null,dragging:0}}}},CIkr:function(t,e,a){"use strict";a.r(e);var i=a("7yJc"),n=a("WzHh");for(var s in n)["default"].indexOf(s)<0&&function(t){a.d(e,t,function(){return n[t]})}(s);var r=a("KHd+"),o=Object(r.a)(n.default,i.a,i.b,!1,null,null,null);o.options.__file="Layout.vue",e.default=o.exports},CmBG:function(t,e,a){"use strict";a.r(e);var i=a("/2W8"),n=a("7wAm");for(var s in n)["default"].indexOf(s)<0&&function(t){a.d(e,t,function(){return n[t]})}(s);var r=a("KHd+"),o=Object(r.a)(n.default,i.a,i.b,!1,null,null,null);o.options.__file="Designer.vue",e.default=o.exports},"CsW/":function(t,e,a){"use strict";a.r(e);var i=a("356E"),n=a("oDaN");for(var s in n)["default"].indexOf(s)<0&&function(t){a.d(e,t,function(){return n[t]})}(s);var r=a("KHd+"),o=Object(r.a)(n.default,i.a,i.b,!1,null,null,null);o.options.__file="Form.vue",e.default=o.exports},DUY6:function(t,e,a){"use strict";a.d(e,"a",function(){return i}),a.d(e,"b",function(){return n});var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"chacheli-designer-control"},[a("div",{staticClass:"flex-container"},[a("div",{staticClass:"mr-8"},[t._v("\n      "+t._s(t.lang.columns)+" "),a("number-input",{attrs:{value:t.layout.cols},on:{input:t.setCols}})],1),t._v(" "),a("div",[t._v("\n      "+t._s(t.lang.rows)+" "),a("number-input",{attrs:{value:t.layout.rows},on:{input:t.setRows}})],1)])])},n=[]},EfOy:function(t,e,a){"use strict";a.r(e);var i=a("L8Z4"),n=a("ZcTV");for(var s in n)["default"].indexOf(s)<0&&function(t){a.d(e,t,function(){return n[t]})}(s);var r=a("KHd+"),o=Object(r.a)(n.default,i.a,i.b,!1,null,null,null);o.options.__file="Chacheli.vue",e.default=o.exports},"GY+e":function(t,e,a){"use strict";a.r(e);var i=a("Kjvu"),n=a.n(i);for(var s in i)["default"].indexOf(s)<0&&function(t){a.d(e,t,function(){return i[t]})}(s);e.default=n.a},Khej:function(t,e,a){"use strict";a.r(e);var i=a("4z/Z"),n=a("Lj/z");for(var s in n)["default"].indexOf(s)<0&&function(t){a.d(e,t,function(){return n[t]})}(s);var r=a("KHd+"),o=Object(r.a)(n.default,i.a,i.b,!1,null,null,null);o.options.__file="NumberInput.vue",e.default=o.exports},Kjvu:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=function(t){return t&&t.__esModule?t:{default:t}}(a("Khej"));e.default={name:"LayoutControl",components:{NumberInput:i.default},props:["layout","lang"],methods:{setCols:function(t){this.$emit("cols",t)},setRows:function(t){this.$emit("rows",t)}}}},L8Z4:function(t,e,a){"use strict";a.d(e,"a",function(){return i}),a.d(e,"b",function(){return n});var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"chacheli",style:t.style,on:{mousedown:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"left",37,e.key,["Left","ArrowLeft"])?null:"button"in e&&0!==e.button?null:(e.preventDefault(),e.stopPropagation(),t.mousedown("drag",e))}}},[a("div",{ref:"content",staticClass:"content-table"},[t._v(t._s(t.chacheli.text))]),t._v(" "),t.checkCustomPermission("settings/posrestolayout","edit")?a("div",{staticClass:"close",on:{click:function(e){return e.preventDefault(),e.stopPropagation(),t.close.apply(null,arguments)},mousedown:function(t){t.preventDefault(),t.stopPropagation()}}}):t._e()])},n=[]},"Lj/z":function(t,e,a){"use strict";a.r(e);var i=a("58RC"),n=a.n(i);for(var s in i)["default"].indexOf(s)<0&&function(t){a.d(e,t,function(){return i[t]})}(s);e.default=n.a},Qgfx:function(t,e,a){"use strict";a.r(e);var i=a("DUY6"),n=a("GY+e");for(var s in n)["default"].indexOf(s)<0&&function(t){a.d(e,t,function(){return n[t]})}(s);var r=a("KHd+"),o=Object(r.a)(n.default,i.a,i.b,!1,null,null,null);o.options.__file="LayoutControl.vue",e.default=o.exports},"QnR/":function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"chacheli-layout",props:["layout","chachelis","data"],data:function(){return{v:0,h:0}},watch:{"layout.cols":function(){this.calc()},"layout.rows":function(){this.calc()}},created:function(){this.calc()},methods:{calc:function(){this.v=100/this.layout.rows,this.h=100/this.layout.cols}}}},WzHh:function(t,e,a){"use strict";a.r(e);var i=a("QnR/"),n=a.n(i);for(var s in i)["default"].indexOf(s)<0&&function(t){a.d(e,t,function(){return i[t]})}(s);e.default=n.a},YTZs:function(t,e,a){"use strict";a.r(e);var i=a("pKMa"),n=a.n(i);for(var s in i)["default"].indexOf(s)<0&&function(t){a.d(e,t,function(){return i[t]})}(s);e.default=n.a},ZcTV:function(t,e,a){"use strict";a.r(e);var i=a("zFCr"),n=a.n(i);for(var s in i)["default"].indexOf(s)<0&&function(t){a.d(e,t,function(){return i[t]})}(s);e.default=n.a},bomc:function(t,e,a){"use strict";a.r(e);var i=a("AFwf"),n=a.n(i);for(var s in i)["default"].indexOf(s)<0&&function(t){a.d(e,t,function(){return i[t]})}(s);e.default=n.a},clkn:function(t,e,a){"use strict";a.d(e,"a",function(){return i}),a.d(e,"b",function(){return n});var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("el-card",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}]},[a("div",{staticClass:"table-handler-flex",attrs:{slot:"header"},slot:"header"},[a("h4",{staticClass:"box-title"},[t._v(t._s(t.lang.restaurant_layout)+" "+t._s(t.data.name))]),t._v(" "),a("div",[a("el-button",{attrs:{type:"text",icon:"el-icon-back"},on:{click:t.back}},[t._v(t._s(t.lang.back))]),t._v(" "),a("button-action-authenticated",{attrs:{permission:["settings/posrestolayout","edit"],type:"success",icon:"el-icon-plus"},on:{click:t.addTable}},[t._v("\n          "+t._s(t.$lang[t.langId].manage_table)+"\n        ")])],1)]),t._v(" "),t.checkCustomPermission("settings/posrestolayout","edit")?a("layout-control",{attrs:{layout:t.layout,lang:t.lang},on:{cols:t.setCols,rows:t.setRows}}):t._e(),t._v(" "),a("designer",{ref:"designer",attrs:{layout:t.layout,chachelis:t.chachelis},on:{"cell-clicked":t.add,"update-position":t.addByDrag,remove:t.removeData}})],1),t._v(" "),a("el-dialog",{attrs:{visible:t.showDialog,title:t.$lang[t.langId].select_table,width:"220px"},on:{"update:visible":function(e){t.showDialog=e}},model:{value:t.showDialog,callback:function(e){t.showDialog=e},expression:"showDialog"}},[a("el-select",{model:{value:t.maybeInserted.id,callback:function(e){t.$set(t.maybeInserted,"id",e)},expression:"maybeInserted.id"}},t._l(t.availableChachelis,function(t){return a("el-option",{key:t.id,attrs:{value:t.id,label:t.text}})}),1),t._v(" "),a("div",{attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{type:"success"},on:{click:t.okAdd}},[t._v("\n        "+t._s(t.lang.add)+"\n      ")])],1)],1),t._v(" "),a("el-dialog",{staticClass:"no-header",attrs:{visible:t.showManageTables,width:"80%"},on:{"update:visible":function(e){t.showManageTables=e}}},[a("div",{directives:[{name:"loading",rawName:"v-loading",value:t.loadingDialog,expression:"loadingDialog"}],staticClass:"dialog-body"},[a("table-form",{attrs:{"form-data":t.data,saved:t.saved},on:{remove:t.removeDialog,save:t.save}})],1)]),t._v(" "),a("el-dialog",{attrs:{visible:t.deleteDialog,width:"50%",center:"","close-on-click-modal":!1,"show-close":!1},on:{"update:visible":function(e){t.deleteDialog=e}}},[a("span",{attrs:{slot:"title"},slot:"title"},[a("svg-icon",{staticStyle:{stroke:"#F44336"},attrs:{"icon-class":"alert-triangle"}}),t._v("\n      "+t._s(t.lang.notif_warn)+"\n    ")],1),t._v(" "),a("div",{staticClass:"text-center"},[a("p",[t._v(t._s(t.lang.are_you_sure_to_remove_this_data)+"\n        "),a("span",{staticStyle:{"font-weight":"bold"}},[t._v('"'+t._s(t.data.name)+'"')])]),t._v(" "),a("p",{staticStyle:{color:"#AFB0AF"}},[t._v(t._s(t.rootLang.info_delete_item))])]),t._v(" "),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:t.cancelDeleteDialog}},[t._v(t._s(t.lang.cancel))]),t._v(" "),a("el-button",{attrs:{type:"danger"},on:{click:t.remove}},[t._v(t._s(t.rootLang.delete))])],1)])],1)},n=[]},dHHg:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=u(a("4d7F")),n=u(a("vDqi")),s=a("xCek"),r=a("6zRN"),o=u(a("Qgfx")),l=u(a("CsW/")),c=a("6y4V");function u(t){return t&&t.__esModule?t:{default:t}}e.default={components:{Designer:r.Designer,LayoutControl:o.default,TableForm:l.default},mixins:[c.checkCustomPermission],data:function(){return{loading:!1,loadingDialog:!1,chachelis:[],saved:!1,maybeInserted:{id:null,row:null,col:null},showDialog:!1,showManageTables:!1,layout:{cols:0,rows:0},data:{},deleteDialog:!1,dataTmp:[]}},computed:{selectedStore:function(){return this.$store.getters.selectedStore},token:function(){return this.$store.state.user.token},lang:function(){return this.$store.state.userStores.lang},langId:function(){return this.$store.state.userStores.langId},availableChachelis:function(){return this.chachelis.filter(function(t){if(t.available)return t})},rootLang:function(){return this.$lang[this.$store.state.userStores.langId]}},methods:{getData:function(){var t=this;this.loading=!0;var e={Authorization:"Bearer "+this.token.access_token};(0,n.default)({method:"GET",url:(0,s.baseApi)(this.selectedStore.url_id,this.langId,"posrestolayout/detail/"+this.$route.params.id),headers:e}).then(function(e){t.chachelis=[],t.data=e.data.data,t.layout.cols=t.data.cols,t.layout.rows=t.data.rows,t.data.items.map(function(e){var a={id:e.id,x:e.col,y:e.row,w:1,h:1,text:e.name,available:!0};(e.col>-1||e.row>-1)&&(a.available=!1),t.chachelis.push(a)}),t.loading=!1}).catch(function(e){t.$notify({type:"warning",title:e.response.data.error.message,message:e.response.data.error.error}),t.loading=!1})},save:function(t){var e=this;this.loadingDialog=!0;var a={Authorization:"Bearer "+this.token.access_token};(0,n.default)({method:"PUT",url:(0,s.baseApi)(this.selectedStore.url_id,this.langId,"posrestolayout/update/"+t.id),headers:a,data:t}).then(function(t){e.chachelis=[],e.data=t.data.data,e.layout.cols=e.data.cols,e.layout.rows=e.data.rows,e.data.items.map(function(t){var a={id:t.id,x:t.col,y:t.row,w:1,h:1,text:t.name,available:!0};(t.col>-1||t.row>-1)&&(a.available=!1),e.chachelis.push(a)}),e.saved=!0,e.loadingDialog=!1,e.showManageTables=!1,e.$message({type:"success",message:"saved"})}).catch(function(t){e.saved=!1,e.loadingDialog=!1,e.$notify({type:"warning",title:t.response.data.error.message,message:t.response.data.error.error})})},setCols:function(t){t>=this.$refs.designer.minColumns()&&t<=15&&(this.layout.cols=t),this.saveGrid()},setRows:function(t){t>=this.$refs.designer.minRows()&&t<=15&&(this.layout.rows=t),this.saveGrid()},resetMaybeInserted:function(){this.maybeInserted.id=null,this.maybeInserted.x=null,this.maybeInserted.y=null},add:function(t){this.resetMaybeInserted(),this.maybeInserted.row=t.row,this.maybeInserted.col=t.col,this.showDialog=!0},addByDrag:function(t){var e=this;if(this.checkCustomPermission("settings/posrestolayout","edit")){this.resetMaybeInserted(),this.maybeInserted.id=t.id,this.maybeInserted.row=t.row,this.maybeInserted.col=t.col;var a={id:this.data.id,items:[this.maybeInserted]};new i.default(function(t,i){e.promiseSave(a,t,i)}).then(function(t){e.resetMaybeInserted(),e.showDialog=!1}).catch(function(t){e.$notify({type:"warning",title:t.response.data.error.message,message:t.response.data.error.error})})}},okAdd:function(){var t=this;this.chachelis.map(function(e){e.id===t.maybeInserted.id&&(e.available=!1,e.y=t.maybeInserted.row,e.x=t.maybeInserted.col)});var e={id:this.data.id,items:[this.maybeInserted]};new i.default(function(a,i){t.promiseSave(e,a,i)}).then(function(e){t.resetMaybeInserted(),t.showDialog=!1}).catch(function(e){t.$notify({type:"warning",title:e.response.data.error.message,message:e.response.data.error.error})})},saveGrid:function(){var t=this,e={Authorization:"Bearer "+this.token.access_token};(0,n.default)({method:"POST",url:(0,s.baseApi)(this.selectedStore.url_id,this.langId,"posrestolayout/updategrid"),headers:e,data:{id:this.$route.params.id,cols:this.layout.cols,rows:this.layout.rows}}).then(function(e){t.$message({type:"success",message:"Success"})}).catch(function(e){t.$notify({type:"warning",title:e.response.data.error.message,message:e.response.data.error.error})})},promiseSave:function(t,e,a){var i=this,r={Authorization:"Bearer "+this.token.access_token};(0,n.default)({method:"POST",url:(0,s.baseApi)(this.selectedStore.url_id,this.langId,"posrestolayout/updatelayout"),headers:r,data:t}).then(function(t){i.$message({type:"success",message:"success"}),e(t.data.data)}).catch(function(t){i.$notify({type:"warning",title:t.response.data.error.message,message:t.response.data.error.error})})},back:function(){this.$router.push({path:"/restomode/posrestolayout"})},addTable:function(){this.showManageTables=!0},remove:function(){var t=this;this.loadingDialog=!0;var e={Authorization:"Bearer "+this.token.access_token};(0,n.default)({method:"DELETE",url:(0,s.baseApi)(this.selectedStore.url_id,this.langId,"posrestolayout/delete/"+this.data.id),headers:e}).then(function(e){t.loadingDialog=!1,t.deleteDialog=!1,t.dataTmp=[],t.back(),t.$message({type:"success",message:e.data.data.message})}).catch(function(e){t.$notify({type:"warning",title:e.response.data.error.message,message:e.response.data.error.error}),t.loadingDialog=!1,t.deleteDialog=!1,t.dataTmp=[]})},removeDialog:function(t){this.deleteDialog=!0,this.dataTmp=t},cancelDeleteDialog:function(){this.deleteDialog=!1,this.dataTmp=[]},removeData:function(t){var e=this,a="Nomor meja "+t.text+" akan dihapus dari layout?";this.$confirm(a,"",{confirmButtonText:this.rootLang.yes,cancelButtonText:this.lang.cancel,showClose:!1,type:""}).then(function(){e.loading=!0,e.resetMaybeInserted(),e.maybeInserted.id=t.id,e.maybeInserted.row=-1,e.maybeInserted.col=-1;var a={id:e.data.id,items:[e.maybeInserted]};new i.default(function(t,i){e.promiseSave(a,t,i)}).then(function(t){e.resetMaybeInserted(),e.loading=!1}).catch(function(t){e.loading=!1,e.$notify({type:"warning",title:t.response.data.error.message,message:t.response.data.error.error})})}).catch(function(){e.chachelis.map(function(e){e.id===t.id&&(e.available=!1)})})}},mounted:function(){this.getData()}}},n16Q:function(t,e,a){"use strict";a.r(e);var i=a("clkn"),n=a("yxI6");for(var s in n)["default"].indexOf(s)<0&&function(t){a.d(e,t,function(){return n[t]})}(s);var r=a("KHd+"),o=Object(r.a)(n.default,i.a,i.b,!1,null,null,null);o.options.__file="Layout.vue",e.default=o.exports},oDaN:function(t,e,a){"use strict";a.r(e);var i=a("5itK"),n=a.n(i);for(var s in i)["default"].indexOf(s)<0&&function(t){a.d(e,t,function(){return i[t]})}(s);e.default=n.a},p36d:function(t,e,a){"use strict";a.r(e);var i=a("x20W"),n=a("bomc");for(var s in n)["default"].indexOf(s)<0&&function(t){a.d(e,t,function(){return n[t]})}(s);var r=a("KHd+"),o=Object(r.a)(n.default,i.a,i.b,!1,null,null,null);o.options.__file="ChacheliDesignerLayout.vue",e.default=o.exports},pKMa:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"chacheli-chooser",props:["chachelis","dragging"],methods:{mousedown:function(t,e){var a=document.defaultView.getComputedStyle(e.target),i=e.target.getBoundingClientRect();this.dX=i.left-e.clientX,this.dY=i.top-e.clientY,this.dragElement=e.target,this.dragElement.style.width=parseFloat(a.width)+"px",this.dragElement.style.height=this.dragElement.parentElement.style.height=parseFloat(a.height)+"px",this.dragMove(e),document.documentElement.addEventListener("mousemove",this.dragMove,!1),document.documentElement.addEventListener("mouseup",this.dragStop,!1),document.documentElement.addEventListener("keydown",this.keyDown,!1),this.dragging.active=!0,this.dragging.cancelled=!1,this.dragging.index=t},keyDown:function(t){27===t.keyCode&&(this.dragging.cancelled=!0,this.dragStop())},dragMove:function(t){this.dragElement.style.left=t.clientX+this.dX+"px",this.dragElement.style.top=t.clientY+this.dY+"px"},dragStop:function(){document.documentElement.removeEventListener("mousemove",this.dragMove,!1),document.documentElement.removeEventListener("mouseup",this.dragStop,!1),document.documentElement.removeEventListener("keydown",this.keyDown,!1),this.dragElement.parentElement.removeAttribute("style"),this.dragElement.removeAttribute("style"),this.dragElement=null,this.dragging.active=!1}}}},x20W:function(t,e,a){"use strict";a.d(e,"a",function(){return i}),a.d(e,"b",function(){return n});var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"chacheli-designer-layout",class:t.interactClass},[t._l(parseInt(t.layout.rows),function(e){return[t._l(parseInt(t.layout.cols),function(i){return[a("div",{key:e+"-"+i,staticClass:"grid",class:{right:i==t.layout.cols,bottom:e==t.layout.rows},style:{top:(e-1)*t.units.v+"%",left:(i-1)*t.units.h+"%",width:t.units.h+"%",height:t.units.v+"%"},on:{click:function(a){return t.onClick(e,i)}}},[t._v("\n        "+t._s(i-1)+", "+t._s(e-1)+"\n      ")])]})]}),t._v(" "),t._l(t.chachelis,function(e){return[e.available?t._e():a("chacheli",{key:e.id,attrs:{layout:t.layout,units:t.units,chacheli:e},on:{resize:t.resizeStart,drag:t.positionStart,remove:t.handleRemove}})]}),t._v(" "),a("div",{directives:[{name:"show",rawName:"v-show",value:!t.placeholder.hidden,expression:"!placeholder.hidden"}],staticClass:"placeholder",class:{invalid:t.placeholder.invalid},style:t.placeholderStyle})],2)},n=[]},yG0x:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=r(a("p36d")),n=r(a("6tsq")),s=a("6y4V");function r(t){return t&&t.__esModule?t:{default:t}}e.default={name:"chacheli-designer",components:{ChacheliDesignerLayout:i.default,ChacheliChooser:n.default},props:["layout","chachelis"],mixins:[s.checkCustomPermission],data:function(){return{dragging:{active:!1,cancelled:!1,index:0},showDialog:!1}},methods:{minColumns:function(){return this.$refs.layoutComp.minColumns()},minRows:function(){return this.$refs.layoutComp.minRows()},cellClicked:function(t){this.$emit("cell-clicked",t),this.showDialog=!0},updatePosition:function(t){this.$emit("update-position",t)},handleRemove:function(t){this.$emit("remove",t)}}}},yxI6:function(t,e,a){"use strict";a.r(e);var i=a("dHHg"),n=a.n(i);for(var s in i)["default"].indexOf(s)<0&&function(t){a.d(e,t,function(){return i[t]})}(s);e.default=n.a},z7cJ:function(t,e,a){"use strict";a.d(e,"a",function(){return i}),a.d(e,"b",function(){return n});var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"chacheli-chooser"},[a("div",{staticClass:"inner"},[t._l(t.chachelis,function(e,i){return[e.available?a("div",{key:e.id,staticClass:"chacheli-outer"},[a("div",{staticClass:"chacheli",class:{dragging:t.dragging.active&&i===t.dragging.index},on:{mousedown:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"left",37,e.key,["Left","ArrowLeft"])?null:"button"in e&&0!==e.button?null:(e.preventDefault(),e.stopPropagation(),t.mousedown(i,e))}}},[t._v("\n          "+t._s(e.text)+"\n        ")])]):t._e()]})],2)])},n=[]},zFCr:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=a("6y4V");e.default={name:"chacheli",props:["layout","chacheli","units"],mixins:[i.checkCustomPermission],computed:{style:function(){return{top:this.chacheli.y*this.units.v+"%",left:this.chacheli.x*this.units.h+"%",width:this.chacheli.w*this.units.h+"%",height:this.chacheli.h*this.units.v+"%"}}},methods:{mousedown:function(t,e){var a=document.defaultView.getComputedStyle(this.$el),i=document.defaultView.getComputedStyle(this.$refs.content);this.$emit(t,{chacheli:this.chacheli,event:e,initialPos:{left:parseFloat(a.getPropertyValue("left"))+parseFloat(a.getPropertyValue("padding-left"))+parseFloat(a.getPropertyValue("border-left-width")),top:parseFloat(a.getPropertyValue("top"))+parseFloat(a.getPropertyValue("padding-top"))+parseFloat(a.getPropertyValue("border-top-width")),width:parseFloat(i.getPropertyValue("width")),height:parseFloat(i.getPropertyValue("height"))}})},close:function(){this.chacheli.available=!0,this.$emit("remove",this.chacheli)}}}}}]);