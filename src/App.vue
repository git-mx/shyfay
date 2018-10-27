<template>
	<div id="app">
		<!--transition标签是vuejs的标签，被包裹的内容将拥有transition提供的过度效果-->
		<!--name="fade"将自动解析为fade-enter， fade-enter-active,这俩写在下方的css中的-->
		<!--mode="out-in"即表示渲染模式，这里表示进入和离开的时候都渲染过度效果-->
		<transition name="fade"
		            mode="out-in">
			<router-view></router-view>
		</transition>
	</div>
</template>

<script>
export default {
	name: 'app',
	components: {
	}
}

</script>

<style lang="scss">
body {
	/*padding如果写一个值表示4个边距都是给定值的值，如果写4个值，那么这4个值表示的是上右下左，左右写两个值则第一个值表示上下，第二个值表示左右*/
	margin: 0px;
	padding: 0px;
	/*background: url(assets/bg1.jpg) center !important;*/
	/*background-size: cover;*/
	/*background: #1F2D3D;*/
	-webkit-font-smoothing: antialiased;
	background: url('assets/bg3.jpg');
	repeat: no-repeat;
	background-attachment:fixed;
	/*filter 属性定义了元素(通常是<img>)的可视效果(例如：模糊与饱和度)*/
	/*下面这一段是固定的写法，这是微软的一种滤镜，其主要作用是对图片进行透明处理， scale表示改变图片的大小来适应滤镜的边界*/
	filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='assets/bg3.jpg', sizingMethod='scale');
	-ms-filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='assets/bg3.jpg', sizingMethod='scale');
	/*background-size 可是指定具体的（宽高）px px 也可以指定cover和contain*/
	/*在no-repeat的情况下cover是图片的宽高比例不变，然后铺满容器，这样就会导致如果原始图片的宽高比例和容器的宽高比例不一样，图片就会被截取*/
	/*在no-repeat的情况下contain是图片自身的宽高比不变，缩放至图片自身能完全显示出来，所以容器会有留白区域*/
	/*所在在no-repeat的情况如果原始图片的宽高比例和容器比例一样的话，用两者的效果是一样的*/
	background-size: cover;
	-moz-background-size: cover;
	-webkit-background-size: cover;
	font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
	font-size: 14px;
	-webkit-font-smoothing: antialiased;
}

#app {
	position: absolute;
	top: 0px;
	bottom: 0px;
	width: 100%;
}

.el-submenu [class^=fa] {
	vertical-align: baseline;
	margin-right: 10px;
}

.el-menu-item [class^=fa] {
	vertical-align: baseline;
	margin-right: 10px;
}

.toolbar {
	background: #f2f2f2;
	padding: 10px;
	//border:1px solid #dfe6ec;
	margin: 10px 0px;
	.el-form-item {
		margin-bottom: 10px;
	}
}

.fade-enter-active,
.fade-leave-active {
	/*这里表示所有的属性其，透明度都从*/
	transition: all .2s ease;
	//transition: opacity .5s;
}

.fade-enter,
.fade-leave-active {
	/*opacity改变元素的不透明度，默认值是1即，完全不透明，当为0时则完全透明*/
	opacity: 0;
}
</style>