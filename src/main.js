import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//import './assets/theme/theme-green/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import routes from './routes'
//import Mock from './mock'
//Mock.bootstrap();
import 'font-awesome/css/font-awesome.min.css'

import axios from 'axios';


Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

//NProgress.configure({ showSpinner: false });

let axiosInstance = axios.create();
Vue.prototype.$http = axiosInstance;
axiosInstance.defaults.timeout = 20000;
axiosInstance.interceptors.request.use(
    function(config){
      config.headers.sessionId = window.sessionStorage.getItem('sessionId');
      return config;
    },
    function(error){
      return Promise.reject(error);
    }
);
axiosInstance.interceptors.response.use(
    function(config){
      return config;
    },
    function(error){
      if(error.response){
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      }else{
        console.log("response error:", error.message());
      }
    }
);

// axiosInstance.get('http://132.232.48.14:8081/vue-admin/domain/getDomain').then(function (res) {
//   if(res.data.meta.code === 0 && res.data.data){
//     //axiosInstance.defaults.baseURL = res.data.data
//     axiosInstance.defaults.baseURL = 'http://132.232.48.14:8081/vue-admin';
//     sessionStorage.setItem('host', 'http://132.232.48.14:8081/vue-admin');
//     initVue();
//   }
// });
axiosInstance.get('http://localhost:8081/shyfay-admin/domain/getDomain').then(function (res) {
  if(res.data.meta.code === 0 && res.data.data){
    //axiosInstance.defaults.baseURL = res.data.data
    axiosInstance.defaults.baseURL = 'http://localhost:8081/shyfay-admin';
    sessionStorage.setItem('host', 'http://localhost:8081/shyfay-admin');
    initVue();
  }
});


const router = new VueRouter({
  routes
})

//第一次进入系统的时候访问的路径是http://localhost:8000/,即 /
//就是从这里跳转到http://localhost:8000/#/login的
router.beforeEach((to, from, next) => {
  //NProgress.start();
  if (to.path == '/login') {
    sessionStorage.removeItem('sessionId');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userName');
  }
  let sessionId = sessionStorage.getItem('sessionId');
  if (!sessionId && to.path != '/login') {
    next({ path: '/login' })
  } else {
    next()
  }
})

//router.afterEach(transition => {
//NProgress.done();
//});

var initVue = function(){
    new Vue({
        //el: '#app',
        //template: '<App/>',
        router,
        store,
        //components: { App }
        render: h => h(App)
    }).$mount('#app');
}

