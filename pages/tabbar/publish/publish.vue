<template>
	<view class="page">
		<form>
			<view class="uni-textarea">
				<textarea placeholder="这一刻的想法..." style="height: 175upx;" maxlength="-1" v-model="input_content" />
			</view>
			<view class="uni-list list-pd">
				<view class="uni-list-cell cell-pd">
					<view class="uni-uploader">
						<view class="uni-uploader-head" v-if="photo">
							<view class="uni-uploader-title"></view>
							<view class="uni-uploader-info">{{imageList.length}}/9</view>
						</view>
						<view class="uni-uploader-body">
							<view class="uni-uploader__files">
								<block v-for="(image,index) in imageList" :key="index">
									<view class="uni-uploader__file" style="position: relative;">
										<image class="uni-uploader__img" mode="aspectFill" :src="image" :data-src="image" @tap="previewImage"></image>
										<image mode="aspectFill" v-if="!photo" @tap="previewImage" src="/static/video/play.png" style="width: 80upx;height: 80upx; position: absolute;top:65upx;left:65upx"></image>
										<view class="close-view" @click="close(index)">×</view>
									</view>
								</block>
								<view class="uni-uploader__input-box" v-if="imageList.length < num">
									<view class="uni-uploader__input" @tap="chooseImage"></view>
								</view>
							</view>
						</view>				
					</view>
				</view>
				<free-list-item @click="sendLocation" :title="title" showRight :showRightIcon="false" cover="/static/images/address.png" :coverSize="50">
					<image slot="right" src="/static/images/rightArrow.png" mode="aspectFill" style="width: 50rpx;height: 50rpx;"></image>
				</free-list-item>
			</view>

			<view class="footer bg-white">
				<button type="default" class="feedback-submit" @click="publish">发表</button>
			</view>
			
			
			<free-confirm ref="confirm" title="温馨提示" :showCancel="false">
				<text class="font-md">发布成功！</text>
			</free-confirm>
		</form>
	</view>
</template>

<script>
	import freeNavBar from "@/components/free-ui/free-nav-bar.vue"
	import freeConfirm from "@/components/free-ui/free-confirm.vue"
	import compressImage from '@/js_sdk/util.js';
	import permision from "@/js_sdk/wa-permission/permission.js"
	import freeListItem from "@/components/free-ui/free-list-item.vue"
	
	var SERVER_API = getApp().globalData.SERVER_API;
	const device = uni.getSystemInfoSync();
	var sourceType = [
		['camera'],
		['album'],
		['camera', 'album']
	]
	var sizeType = [
		['compressed'],
		['original'],
		['compressed', 'original']
	]
	var _this;
	export default {
		components: {
			freeNavBar,
			freeConfirm,
			freeListItem
		},
		data() {
			return {
				// title: 'choose/previewImage',
				input_content:'',
				imageList: [],
				title:'所在位置',
				
				
				sourceTypeIndex: 2,
				sourceType: ['拍照', '相册', '拍照或相册'],
				sizeTypeIndex: 2,
				sizeType: ['压缩', '原图', '压缩或原图'],
				countIndex: 8,
				count: [1, 2, 3, 4, 5, 6, 7, 8, 9],
				
				photo:true, //照片
				num:9,
				video:''//视频路径
			}
		},
		onLoad:function(e){
			console.log(e)
			_this = this;
			this.requestAndroidPermission('android.permission.RECORD_AUDIO')
			if(e.type=='video'){
				_this.num=1
				_this.photo=false
				console.log(_this.photo)
				console.log(_this.num)
			}
		},
		onUnload() {
			this.imageList = [],
				this.sourceTypeIndex = 2,
				this.sourceType = ['拍照', '相册', '拍照或相册'],
				this.sizeTypeIndex = 2,
				this.sizeType = ['压缩', '原图', '压缩或原图'],
				this.countIndex = 8;
		},
		
		methods: {
			async requestAndroidPermission(permisionId) {
				var result = await permision.requestAndroidPermission(permisionId)				
				if (result == -1) {
					uni.showModal({
						content:'录音权限被拒绝，将影响正常使用，请去设置页面开启！',
						showCancel: false,
						success(res) {
							if(res.confirm){
								permision.gotoAppPermissionSetting()
							}
						}
					});
				}
			},
			async compressImageHandler(src){
				console.log('platform==='+device.platform)
				const tempPath = await compressImage(src,device.platform);
				console.log('tempPath-----'+tempPath);
				return tempPath
			},
			
			
			async publish(){
				if (!this.input_content) {
					uni.showToast({
						"title":"写点什么吧~",
						"position":"bottom"
					})
					return;
				}
				if(!_this.photo&&_this.video==''){
					uni.showToast({
						"title":"您的视频呢~",
						"position":"bottom"
					})
					return;
				}
				// var location = await this.getLocation();//位置信息,可删除,主要想记录一下异步转同步处理
				
				var images = [];
				for(var i =0,len = this.imageList.length; i < len; i++){
					var image_obj = {name:'image'+(i+1),uri:this.imageList[i]};
					images.push(image_obj);
				}
				if(_this.title=="所在位置"){
					_this.title="";
				}
				if(images.length==0){
					uni.showLoading({title:'发布中...'});
					uni.request({
						url: SERVER_API+'appFriends/publish',
						data: {
							'content': this.input_content,//moment文字部分
							'location':_this.title
						},
						method:"POST",
						header:{
							"token":uni.getStorageSync("setUserData").token,
							"Content-Type":"application/x-www-form-urlencoded"
						},
						success: (uploadFileRes) => {
							console.log(uploadFileRes)
							if(uploadFileRes.data.code==1){
								uni.hideLoading();
								uni.$emit("publish")
								this.$refs.confirm.show((close)=>{
									let pages = getCurrentPages(); // 当前页面
									let beforePage = pages[pages.length - 2]; // 前一个页面
									 uni.navigateBack({
									     success: function() {
									         beforePage.onLoad(); // 执行前一个页面的onLoad方法
									     }
									 });
									close()
								})
							}						
						},
						fail:(e) =>{
							uni.hideLoading();
							uni.showToast({
								"title":"发布失败，请检查网络",
								"icon":"none"
							})
						}
					})
				}else{
					if(_this.photo){//如果是拍照
						uni.showLoading({title:'发布中...'});
						uni.uploadFile({//该上传仅为示例,可根据自己业务修改或封装,注意:统一上传可能会导致服务器压力过大
							url: SERVER_API+'appFriends/publish', 
							files:images,//有files时,会忽略filePath和name
							formData: {//后台以post方式接收
								'content': this.input_content,//moment文字部分
								'location':_this.title
								// 'longitude':location.longitude,//经度
								// 'latitude':location.latitude//纬度
							},
							header:{
								"token":uni.getStorageSync("setUserData").token
							},
							success: (uploadFileRes) => {
								var res = JSON.parse(uploadFileRes.data)
								if(res.code==1){
									uni.hideLoading();
									this.$refs.confirm.show((close)=>{
										let pages = getCurrentPages(); // 当前页面
										let beforePage = pages[pages.length - 2]; // 前一个页面
										 uni.navigateBack({
										     success: function() {
										         beforePage.onLoad(); // 执行前一个页面的onLoad方法
										     }
										 });
										close()
									})
									
								}						
							},
							fail:(e) =>{
								uni.hideLoading();
								uni.showToast({
									"title":"发布失败，请检查网络",
									"icon":"none"
								})
							}
						});
					}else{//如果是视频
						uni.showLoading({title:'视频资源上传中...'});
						var video = _this.video.indexOf("file://")==-1? 'file://'+_this.video: _this.video;
						var image_obj = {name:'image1',uri:video};
						var image_obj2 = {name:'image2',uri:_this.imageList[0]}
						var images = []
						images.push(image_obj)
						images.push(image_obj2)
						uni.uploadFile({//该上传仅为示例,可根据自己业务修改或封装,注意:统一上传可能会导致服务器压力过大
							url: SERVER_API+'appFriends/publish', 
							files:images,//有files时,会忽略filePath和name
							formData: {//后台以post方式接收
								'content': this.input_content,//moment文字部分
								'location':_this.title
								// 'longitude':location.longitude,//经度
								// 'latitude':location.latitude//纬度
							},
							header:{
								"token":uni.getStorageSync("setUserData").token
							},
							success: (uploadFileRes) => {
								var res = JSON.parse(uploadFileRes.data)
								console.log(JSON.stringify(res))
								if(res.code==1){
									uni.hideLoading();
									this.$refs.confirm.show((close)=>{
										let pages = getCurrentPages(); // 当前页面
										let beforePage = pages[pages.length - 2]; // 前一个页面
										 uni.navigateBack({
										     success: function() {
										         beforePage.onLoad(); // 执行前一个页面的onLoad方法
										     }
										 });
										close()
									})
									
								}						
							},
							fail:(e) =>{
								uni.hideLoading();
								uni.showToast({
									"title":"发布失败，请检查网络",
									"icon":"none"
								})
							}
						});
					}
				}	
				
			},
			
			getLocation(){//h5中可能不支持,自己选择
				return new Promise((resolve, reject) => {
					uni.getLocation({
						type: 'wgs84',
						success: function (res) {
							resolve(res);
						},
						fail: (e) => {  
							reject(e);
						}
					});
				} )
			},
			
			close(e){
			    this.imageList.splice(e,1);
				_this.video=''
			},
			chooseImage: async function() {
				if(_this.photo){
					if (this.imageList.length === 9) {
						let isContinue = await this.isFullImg();
						if (!isContinue) {
							return;
						}
					}
					
					uni.chooseImage({
						sourceType: sourceType[this.sourceTypeIndex],
						sizeType: sizeType[this.sizeTypeIndex],
						count: this.imageList.length + this.count[this.countIndex] > 9 ? 9 - this.imageList.length : this.count[this.countIndex],
						success: async (res) => {
					
							const tempFilePaths = res.tempFilePaths;
							let tempPathList = [];
							for (let i = 0; i < tempFilePaths.length; i++) {
								const path = tempFilePaths[i];
								const src = await this.compressImageHandler(path)
								tempPathList.push(src);
							}
							this.imageList = this.imageList.concat(tempPathList);			
						}
					})
				}else{
					uni.showActionSheet({
					    itemList: ['拍摄', '相册'],
					    success: function (res) {
					        if(res.tapIndex==1){
								uni.chooseVideo({
									count: 1,
									sourceType: ['album'],
									success: function (res) {
										console.log(res)
										if(res.size/1000000>5){
											uni.showToast({
												"title":"请选择小于5M的短视频",
												"position":"bottom"
											})
											return;
										}
										_this.imageList.push('file://'+plus.io.convertLocalFileSystemURL('/static/video/poster.jpg'))
										_this.video=res.tempFilePath
									}
								});
							}else if(res.tapIndex==0){
								const PPVideo = uni.requireNativePlugin('PP-Video');
								PPVideo.show({
									minTime: 1,
									maxTime: 10,
									bit: 1024*800,
									vWidth: 720,
									vHeight:1280,
									isBeautiful: false,
									isBeautifulBtn: true,
									isFlashBtn: true,
									isShowTime: true,
									beautifulValue: 10,
									bottomHeight:500,
									isBefore: false //默认前置
								}, result => {
									console.log(JSON.stringify(result))
									if (result.code == 200) {		
										_this.imageList.push('file://'+result.data.thumbnail)
										console.log(result.data.videoPath)
										_this.video=result.data.videoPath
									}
									
								});
							}
					    },
					    fail: function (res) {
					        
					    }
					});

				}
				
			},
			isFullImg: function() {
				return new Promise((res) => {
					uni.showModal({
						content: "已经有9张图片了,是否清空现有图片？",
						success: (e) => {
							if (e.confirm) {
								this.imageList = [];
								res(true);
							} else {
								res(false)
							}
						},
						fail: () => {
							res(false)
						}
					})
				})
			},
			previewImage: function(e) {
				if(_this.photo){
					var current = e.target.dataset.src
					uni.previewImage({
						current: current,
						urls: this.imageList
					})
				}else{
					uni.navigateTo({
						url:'../../chat/video/video?url=file://'+_this.video+'&my=true'
					})
				}
				
			},
			sendLocation(){
				if(!permision.checkSystemEnableLocation()){
					uni.showToast({
						"title":'未开启GPS位置服务，将会影响精确度',
						"position":"bottom"
					})
				}
				uni.navigateTo({
					url:"../../location/send-location/send-location?from=publish"
				})
			}
		}
	}
</script>

<style scoped>
	@import url("../../../common/uni.css");
	.footer {
		padding: 10px;
		paddding-top: 80upx;
	}
	
	.cell-pd {
		padding: 20upx 30upx;
	}
	.feedback-submit{
		margin: 0!important;
	}
	.uni-textarea {
		width: auto;
		padding: 20upx 25upx;
		line-height: 1.6;
		height: 180upx;
	}
	.uni-list::before {
		height: 0;
	}
	.uni-list:after {
		height: 0;
	}
	.list-pd {
		margin-top: 0;
	}
	.close-view{
	    text-align: center;
		line-height:30upx;
		height: 35upx;
		width: 35upx;
		background: #ef5350;
		color: #FFFFFF;
		position: absolute;
		top: 1upx;
		right: 1upx;
		font-size: 35upx;
		border-radius: 8upx;
	}
</style>
