(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/find/publish/publish"],{"31ea":function(e,t,n){"use strict";n.r(t);var i=n("a8e7"),a=n("3dce");for(var s in a)"default"!==s&&function(e){n.d(t,e,function(){return a[e]})}(s);n("e6a2");var u=n("2877"),o=Object(u["a"])(a["default"],i["a"],i["b"],!1,null,"3fbd17cd",null);t["default"]=o.exports},"3dce":function(e,t,n){"use strict";n.r(t);var i=n("af04"),a=n.n(i);for(var s in i)"default"!==s&&function(e){n.d(t,e,function(){return i[e]})}(s);t["default"]=a.a},"83f4":function(e,t,n){},a8e7:function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement;e._self._c},a=[];n.d(t,"a",function(){return i}),n.d(t,"b",function(){return a})},af04:function(e,t,n){"use strict";(function(e,i){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a=u(n("a34a")),s=u(n("c4d2"));function u(e){return e&&e.__esModule?e:{default:e}}function o(e,t,n,i,a,s,u){try{var o=e[s](u),c=o.value}catch(r){return void n(r)}o.done?t(c):Promise.resolve(c).then(i,a)}function c(e){return function(){var t=this,n=arguments;return new Promise(function(i,a){var s=e.apply(t,n);function u(e){o(s,i,a,u,c,"next",e)}function c(e){o(s,i,a,u,c,"throw",e)}u(void 0)})}}var r=function(){return n.e("components/free-ui/free-nav-bar").then(n.bind(null,"c328"))},f=[["camera"],["album"],["camera","album"]],l=[["compressed"],["original"],["compressed","original"]],d={components:{freeNavBar:r},data:function(){return{input_content:"",imageList:[],sourceTypeIndex:2,sourceType:["拍照","相册","拍照或相册"],sizeTypeIndex:2,sizeType:["压缩","原图","压缩或原图"],countIndex:8,count:[1,2,3,4,5,6,7,8,9],startX:0,movedX:0,endX:0}},onUnload:function(){this.imageList=[],this.sourceTypeIndex=2,this.sourceType=["拍照","相册","拍照或相册"],this.sizeTypeIndex=2,this.sizeType=["压缩","原图","压缩或原图"],this.countIndex=8},methods:{publish:function(){var t=c(a.default.mark(function t(){var n,s,u,o,c;return a.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:if(this.input_content){t.next=3;break}return e.showModal({content:"内容不能为空",showCancel:!1}),t.abrupt("return");case 3:return e.showLoading({title:"发布中"}),t.next=6,this.getLocation();case 6:for(n=t.sent,s=[],u=0,o=this.imageList.length;u<o;u++)c={name:"image-"+u,uri:this.imageList[u]},s.push(c);e.uploadFile({url:"moment/moments",files:s,filePath:"",name:"",formData:{user_id:"1",text:this.input_content,longitude:n.longitude,latitude:n.latitude},success:function(t){e.hideLoading(),e.showToast({icon:"success",title:"发布成功"}),e.navigateBack({delta:1})},fail:function(t){console.log(i("e: "+JSON.stringify(t)," at pages\\find\\publish\\publish.vue:126")),e.hideLoading(),e.showToast({icon:"none",title:"发布失败,请检查网络"})}});case 10:case"end":return t.stop()}},t,this)}));function n(){return t.apply(this,arguments)}return n}(),getLocation:function(){return new Promise(function(t,n){e.getLocation({type:"wgs84",success:function(e){t(e)},fail:function(e){n(e)}})})},close:function(e){this.imageList.splice(e,1)},chooseImage:function(){var t=c(a.default.mark(function t(){var n,u=this;return a.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:if(9!==this.imageList.length){t.next=7;break}return t.next=3,this.isFullImg();case 3:if(n=t.sent,console.log(i("是否继续?",n," at pages\\find\\publish\\publish.vue:156")),n){t.next=7;break}return t.abrupt("return");case 7:e.chooseImage({sourceType:f[this.sourceTypeIndex],sizeType:l[this.sizeTypeIndex],count:this.imageList.length+this.count[this.countIndex]>9?9-this.imageList.length:this.count[this.countIndex],success:function(e){var t=function(e){u.imageList=u.imageList.concat(e)};s.default.compress(e.tempFilePaths,t)}});case 8:case"end":return t.stop()}},t,this)}));function n(){return t.apply(this,arguments)}return n}(),isFullImg:function(){var t=this;return new Promise(function(n){e.showModal({content:"已经有9张图片了,是否清空现有图片？",success:function(e){e.confirm?(t.imageList=[],n(!0)):n(!1)},fail:function(){n(!1)}})})},previewImage:function(t){var n=t.target.dataset.src;e.previewImage({current:n,urls:this.imageList})},touchStart:function(e){this.startX=e.mp.changedTouches[0].pageX},touchEnd:function(t){this.endX=t.mp.changedTouches[0].pageX,this.endX-this.startX>200&&e.navigateBack()}}};t.default=d}).call(this,n("6e42")["default"],n("0de9")["default"])},c56c:function(e,t,n){"use strict";(function(e){n("68ca"),n("921b");i(n("66fd"));var t=i(n("31ea"));function i(e){return e&&e.__esModule?e:{default:e}}e(t.default)}).call(this,n("6e42")["createPage"])},e6a2:function(e,t,n){"use strict";var i=n("83f4"),a=n.n(i);a.a}},[["c56c","common/runtime","common/vendor"]]]);