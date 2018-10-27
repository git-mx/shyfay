import util from '../../common/js/util';

export default {
    data() {
        return {
            filters: {
                name: '',
                departmentId: null,
                positionId: null

            },
            loading: false,
            formLoading: false,
            searchLoading: false,
            listData: [],
            dsearchOptions: [],
            psearchOptions: [],
            departmentOptions: [],
            positionOptions: [],
            sexMan: true,
            sexWoman: true,
            pageIndex: 0,
            pageSize: 10,
            totalCount: 0,
            formTitle: '',
            formVisible: false,
            addOrEdit: 1,
            formData: {
                userId: null,
                departmentId: null,
                positionId: null,
                idNumber: '',
                userName: '',
                userSex: 1,
                birthdayTime: '',
                houseAddress: '',
                phoneNumber: '',
                loginName: '',
                loginPassword: '',
                editLoginPassword: ''
            },
            formRules: {
                departmentId:[
                    {required: true, message: '请选择部门', trigger: 'blur'}
                ],
                positionId: [
                    {required: true, message: '请选择职位', trigger: 'blur'}
                ],
                idNumber: [
                    {required: true, message: '请填写身份证号', trigger: 'blur'},
                    {
                        validator: function(rule, value, callback){
                            if(/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(value) == false){
                                callback(new Error('请输入正确的身份证号'));
                            }else {
                                callback();
                            }
                        }
                    }
                ],
                userName: [
                    {required: true, message: '请填写姓名', trigger: 'blur'}
                ],
                userSex: [
                    {required: true, message: '请选择性别', trigger: 'blur'}
                ],
                birthdayTime: [
                    {required: true, message: '请选择出生日期', trigger: 'blur'}
                ],
                phoneNumber: [
                    {required: true, message: '请填写电话号码', trigger: 'blur'},
                    {
                        validator:function(rule,value,callback){
                            //if(/^1[34578]\d{9}$/.test(value) == false){
                            //if(/^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/.test(value) == false){
                            if(/^1[34578]\d{9}$/.test(value) == false){
                                callback(new Error("请输入正确的手机号"));
                            }else{
                                callback();
                            }
                        },
                        trigger: 'blur'
                    }
                ],
                loginName: [
                    {required: true, message: '请填写登录账号', trigger: 'blur'},
                    {pattern: /^(\w){5,10}$/, message: '登录账号必须是5~10位以英文字母开头，且只能包含英文字母，数字和下划线'}
                ],
                loginPassword: [
                    {required: true, message: '请填写登录密码', trigger: 'blur'},
                    {min: 5, message: '密码长度必须大于4'},
                    {max: 10, message: '密码长度必须小于11'},
                    {pattern: /^[a-zA-Z]\w/, message: '登录密码必须以英文字母开头，且只能包含英文字母，数字和下划线'}
                ]
            }
        }
    },
    watch: {
        sexMan: {
            handler(newVal){
                if(!newVal){
                    this.sexWoman = true;
                }
            },
            immediate: true
        },
        sexWoman: {
            handler(newVal){
                if(!newVal){
                    this.sexMan = true;
                }
            }
        }
    },
    methods: {
        //性别显示转换
        formatSex: function (row, column) {
            return row.userSex == 1 ? '男' : row.userSex == 0 ? '女' : '未知';
        },
        formatBirthday: function(row, column){
            return util.formatTime(row.birthdayTime, "yyyy年MM月dd日");
        },
        //获取用户列表
        getListData: function () {
            this.loading = true;
            var userSex = null;
            if(this.sexMan && !this.sexWoman){
                var userSex = 1;
            }else if(!this.sexMan && this.sexWoman){
                var userSex = 2;
            }
            var params = {
                pageIndex: 1,
                pageSize: 10,
                departmentId: this.filters.departmentId,
                positionId: this.filters.positionId,
                userName: this.filters.name ,
                userSex: userSex
            };
            console.log(params);
            this.$http.post('/user/listUser', params).then((res) => {
                this.loading = false;
                let resData = res.data;
                if(resData.meta.code === 0 && resData.data){
                    this.listData = resData.data.list;
                    this.totalCount = resData.data.total;
                }else{
                    this.$message({
                        message: resData.meta.message,
                        type: 'error'
                    });
                }
            }).catch(()=>{

            });
        },
        initDepartmentOpions: function(){
            this.loading = true;
            this.$http.get('/department/listOption').then((res)=>{
                this.loading = false;
                if(res.data.meta.code === 0 && res.data.data){
                    this.departmentOptions = res.data.data;

                }
            }).catch(()=>{
                this.loading = false;
            })
        },
        initPositionOpions: function(){
            this.loading = true;
            this.$http.get('/position/listOption').then((res)=>{
                this.loading = false;
                if(res.data.meta.code === 0 && res.data.data){
                    this.positionOptions = res.data.data;
                }
            }).catch(()=>{
                this.loading = false;
            })
        },
        queryDepartment: function(query){
            console.log(this.departmentOptions);
            if (query !== '') {
                this.searchLoading = true;
                setTimeout(() => {
                    this.searchLoading = false;
                    this.dsearchOptions = this.departmentOptions.filter(item => {
                        return item.name.toLowerCase()
                            .indexOf(query.toLowerCase()) > -1;
                    });
                }, 200);
            } else {
                this.dsearchOptions = [];
            }
        },
        queryPosition: function(query){
            if (query !== '') {
                this.searchLoading = true;
                setTimeout(() => {
                    this.searchLoading = false;
                    this.psearchOptions = this.positionOptions.filter(item => {
                        return item.name.toLowerCase()
                            .indexOf(query.toLowerCase()) > -1;
                    });
                    console.log(this.psearchOptions);
                }, 200);
            } else {
                this.psearchOptions = [];
            }
        },
        handleCurrentChange: function(val) {
            this.pageIndex = val;
            this.getListData();
        },
        funAdd: function() {
            this.addOrEdit = 1;
            this.formVisible = true;
            this.formTitle = '新增用户信息';
        },
        funEdit: function(row){
            this.addOrEdit = 2;
            this.formVisible = true;
            this.formTitle = '修改用户信息';
            this.formLoading = true;
            this.$http.get('/user/detailUser?userId=' + row.userId).then((res)=>{
                this.formLoading = false;
                if(res.data.meta.code === 0 && res.data.data){
                    let user = res.data.data;
                    this.formData = {
                        userId: user.userId,
                        departmentId: user.departmentId,
                        positionId: user.positionId,
                        idNumber: user.idNumber,
                        userName: user.userName,
                        userSex: user.userSex,
                        birthdayTime: user.birthdayTime,
                        houseAddress: user.houseAddress,
                        phoneNumber: user.phoneNumber,
                        loginName: user.loginName,
                        loginPassword: '',
                        editLoginPassword: '',
                    }
                }else{
                    this.formVisible = false;
                    this.errorMessage(res.data.meta.message);
                }
            }).catch(()=>{
                this.innerServerError();
            })
        },
        funDelete: function(row){
            this.$confirm("确认删除该员工信息吗?", "提示", {
                type: 'warning'
            }).then(() => {
                this.loading = true;
                this.$http.get('/user/deleteUser?userId=' + row.userId).then((res) => {
                    this.loading = false;
                    let resData = res.data;
                    if(resData.meta.code === 0){
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getListData();
                    }else{
                        this.errorMessage(resData.meta.message);
                    }
                }).catch(() => {
                    this.innerServerError();
                });
            });
        },
        submitForm: function(){
            this.$refs.refForm.validate((valid) =>{
                if(valid){
                    this.formLoading = true;
                    let params = {};
                    let resData = {};
                    if(this.addOrEdit === 1){
                        params = {
                            createId: sessionStorage.getItem('userId'),
                            departmentId: this.formData.departmentId,
                            positionId: this.formData.positionId,
                            idNumber: this.formData.idNumber,
                            userName: this.formData.userName,
                            userSex: this.formData.userSex,
                            birthdayTime: util.strToStamp(this.formData.birthdayTime),
                            houseAddress: this.formData.houseAddress,
                            phoneNumber: this.formData.phoneNumber,
                            loginName: this.formData.loginName,
                            loginPassword: this.formData.loginPassword
                        };
                        this.$http.post('/user/addUser', params).then((res) => {
                            console.log(res);
                            this.formLoading = false;
                            resData = res.data;
                            if(resData.meta.code == 0) {
                                this.$message({
                                    message: '新增成功',
                                    type: 'success'
                                });
                                this.closeForm();
                            }else{
                                this.errorMessage(resData.meta.message);
                            }
                        }).catch(() => {
                            this.innerServerError();
                        });
                    }else{
                        params = {
                            updateId: sessionStorage.getItem('userId'),
                            userId: this.formData.userId,
                            departmentId: this.formData.departmentId,
                            positionId: this.formData.positionId,
                            idNumber: this.formData.idNumber,
                            userName: this.formData.userName,
                            userSex: this.formData.userSex,
                            birthdayTime: util.strToStamp(this.formData.birthdayTime),
                            houseAddress: this.formData.houseAddress,
                            phoneNumber: this.formData.phoneNumber,
                            loginName: this.formData.loginName,
                            loginPassword: this.formData.editLoginPassword
                        };
                        this.$http.post('/user/modifyUser', params).then((res) => {
                            this.formLoading = false;
                            resData = res.data;
                            if(resData.meta.code == 0){
                                this.$message({
                                    message: '修改成功',
                                    type: 'success'
                                });
                                this.closeForm();
                            }else{
                                this.errorMessage(resData.meta.message);
                            }
                        }).catch(() => {
                            this.innerServerError();
                        });
                    }
                }else{

                }
            })
        },
        closeForm: function(){
            this.$refs.refForm.resetFields();
            this.formVisible = false;
            this.formData = {
                userId: null,
                departmentId: null,
                positionId: null,
                idNumber: '',
                userName: '',
                userSex: 1,
                birthdayTime: '',
                houseAddress: '',
                phoneNumber: '',
                loginName: '',
                loginPassword: '',
                editLoginPassword: ''
            };
            this.getListData();
        },
        errorMessage: function(message){
            if(message){
                this.$message({
                    message: message,
                    type: 'error'
                });
            }else{
                this.$message({
                    message: '操作失败',
                    type: 'error'
                });
            }
        },
        innerServerError: function(){
            this.$message({
                message: '内部服务器错误，请联系系统管理员！',
                type: 'error'
            });
        }
    },
    mounted() {
        //获取列表数据
        this.getListData();
        //获取部门下拉列表
        this.initDepartmentOpions();
        //获取部门下拉列表
        this.initPositionOpions();
    }
};