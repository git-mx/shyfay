import util from '../../common/js/util.js';

export default {
    data() {
        return {
            logining: false,
            formData: {
                account: '',
                password: '',
                code: '',
                imgCode: ''
            },
            formRules: {
                account: [
                    { required: true, message: '请输入账号', trigger: 'blur' },
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                ],
                code: [
                    { required: true, message: '请输入验证码', trigger: 'blur' },
                ]
            },
            imgCode: '',
            rememberFlag: false
        };
    },
    created () {
        this.getCode();
    },
    //this.$refs 一个对象，持有注册过 ref 特性 的所有 DOM 元素和组件实例
    //this.$refs.formData 就是当前组件（Login.vue）的一个VueComponent
    //能够这样用的前提是formData在某一个dom元素里被ref了，本例中是el-form
    //this.$refs.logining就是undefined，因为logining没有在任何一个dom元素里被ref
    methods: {
        handleReset2() {
            this.$refs.loginForm.resetFields();
        },
        handleSubmit2() {
            if(!this.rememberFlag){
                util.clearCookie();
            }
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    //_this.$router.replace('/table');
                    this.logining = true;
                    //NProgress.start();
                    var params = { loginName: this.formData.account, loginPassword: this.formData.password, loginCode: this.formData.code };
                    this.$http.post('/login/userLogin', params).then((res) => {
                        this.logining = false;
                        if(res.data.meta.code === 0 && res.data.data){
                            sessionStorage.setItem('sessionId', res.data.data.sessionId);
                            sessionStorage.setItem('userId', res.data.data.userId);
                            sessionStorage.setItem('userName', res.data.data.userName);
                            if(this.rememberFlag){
                                util.setCookie(this.formData.account, this.formData.password, 7, 'TRUE');
                            }
                            //存在vuex里面的值在刷新页面的时候会回到初始值，初始值就是在state里声明那个变量的时候给的值
                            //this.$store.dispatch('setUserName', res.data.data.userName)
                            this.$router.push({ path: '/departmentIndex' });
                        }else{
                            this.$message({
                                message: res.data.meta.message,
                                type: 'error'
                            });
                            this.code = '';
                            this.getCode();
                        }
                    });
                } else {
                    return false;
                }
            });
        },
        getCode(){
            let host = window.sessionStorage.getItem('host');
            //这里加一个time=Math.random是让接口每次都是真的去后台调用，而不是从缓存取接口的结果
            this.imgCode = host + '/login/getCode?time= ' + Math.random();
        },
        changeCode: function() {
            this.getCode();
        }
    },
    mounted: function(){
        var cookie = util.getCookie();
        this.rememberFlag = cookie.rememberFlag;
        this.formData.account = cookie.account;
        this.formData.password = cookie.password;
    }
}
