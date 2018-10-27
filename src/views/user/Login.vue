<template>
  <el-form :model="formData" :rules="formRules" ref="loginForm" label-position="left" label-width="0px" class="login-container">
    <h3 class="title">系统登录</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="formData.account" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model="formData.password" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-row>
      <el-col :span="16">
        <el-form-item prop="code">
          <el-input type="text" v-model="formData.code" auto-complete="off" placeholder="验证码"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <div class="code"><img v-bind:src="imgCode" alt="验证码" @click="changeCode()"/></div>
      </el-col>
    </el-row>

    <el-checkbox v-model="rememberFlag" class="remember">记住密码</el-checkbox>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
      <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
    </el-form-item>
  </el-form>
</template>
<script>
    import js from './login.js';
    export default js;
</script>
<style lang="scss" scoped>
  body {
    /*padding如果写一个值表示4个边距都是给定值的值，如果写4个值，那么这4个值表示的是上右下左，左右写两个值则第一个值表示上下，第二个值表示左右*/
    margin: 0px;
    padding: 0px;
    /*background: url(assets/bg1.jpg) center !important;*/
    /*background-size: cover;*/
    /*background: #1F2D3D;*/
    -webkit-font-smoothing: antialiased;
    repeat: no-repeat;
    background: url('../../assets/bg7.jpg') fixed;
    /*filter 属性定义了元素(通常是<img>)的可视效果(例如：模糊与饱和度)*/
    /*下面这一段是固定的写法，这是微软的一种滤镜，其主要作用是对图片进行透明处理， scale表示改变图片的大小来适应滤镜的边界*/
    filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='../../assets/bg7.jpg', sizingMethod='scale');
    -ms-filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='../../assets/bg7.jpg', sizingMethod='scale');
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
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
    .code {
      margin: 0px auto 40px auto;
      text-align: center;
    }
  }
</style>