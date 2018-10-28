
import util from '../../common/js/util';

export default {
    data() {
        return {
            showId: false,
            filters: {
                name: ''
            },
            loading: false,
            formTitle: '',
            formLoading: false,
            formVisible: false,
            pageIndex: 1,
            pageSize: 10,
            totalCount: 0,
            addOrEdit: 0,
            listData: [
            ],
            formData: {
                createId: sessionStorage.getItem('userId'),
                departmentId: 0,
                departmentName: '',
                establishTime: '',
                departmentRemark: ''
            },
            formRules: {
                departmentName: [
                    { required: true, message: '请输入部门名称', trigger: 'blur' }
                ],
                establishTime: [
                    { required: true, message: '请选择成立时间', trigger: 'blur' }
                ]
            },
        }
    },
    methods: {
        formatEstablishTime: function(row){
            return util.formatTime(row.establishTime, 'yyyy年MM月dd日');
        },
        funEdit: function(row){
            this.addOrEdit = 2;
            this.formTitle = '修改部门信息';
            this.formVisible = true;
            this.formLoading = true;
            this.$http.get('/department/detailDepartment?departmentId=' + row.departmentId).then((res) => {
                this.formLoading = false;
                let resData = res.data;
                if(resData.meta.code === 0 && resData.data){
                    this.formData = {
                        createId: sessionStorage.getItem('userId'),
                        departmentId: row.departmentId,
                        departmentName: resData.data.departmentName,
                        establishTime: util.formatTime(resData.data.establishTime, "yyyy-MM-dd"),
                        departmentRemark: resData.data.departmentRemark
                    };
                }else{
                    this.formVisible = false;
                    this.errorMessage(resData.meta.message);
                }
            }).catch(() => {
                this.innerServerError();
            });
        },
        funDelete: function(row) {
            this.$confirm('确认删除该部门信息吗?', '提示', {
                type: 'warning'
            }).then(() => {
                this.loading = true;
                this.$http.get('/department/deleteDepartment?departmentId=' + row.departmentId).then((res) => {
                    this.loading = false;
                    let resData = res.data.meta.code;
                    if(resData === 0){
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getListData();
                    }else{
                        errorMessage(resData.meta.message);
                    }
                }).catch(()=>{
                    this.innerServerError();
                });
            }).catch(()=>{

            });
        },
        handleCurrentChange: function(val){
            this.pageIndex = val;
            this.getListData();
        },
        //获取用户列表
        getListData: function () {
            this.loading = true;
            var params = { pageIndex: this.pageIndex, pageSize: this.pageSize, departmentName: this.filters.name };
            this.$http.post('/department/listDepartment', params).then((res) => {
                this.loading = false;
                let resData = res.data;
                if(resData.meta.code === 0 && resData.data){
                    this.listData = resData.data.list;
                    this.totalCount = resData.data.total;
                }else{
                    this.errorMessage(resData.meta.message);
                }
            }).catch(() => {
                this.innerServerError();
            });
        },
        funAdd: function () {
            this.addOrEdit = 1;
            this.formTitle = '新增部门信息';
            this.formVisible = true;
        },
        closeForm: function() {
            //这个作用是把addForm这个dialog的所有自身属性都清空
            //例如显示的验证信息，如果不清空的话会导致例如：第一次打开表单的时候
            //有一个验证信息是"请输入名称",如果不清空，在还有这个验证信息的时候关闭表单
            //再次打开表单的时候这个"请输入名称"还在
            //this.$refs["refForm"].resetFields();
            this.$refs.refForm.resetFields();
            this.formData = {
                createId: sessionStorage.getItem('userId'),
                departmentId: 0,
                departmentName: '',
                establishTime: '',
                departmentRemark: ''
            };
            this.formVisible = false;
        },
        fromSubmit: function () {
            this.$refs.refForm.validate((valid) => {
                if (valid) {
                    this.formLoading = true;
                    let params = {};
                    if(this.addOrEdit == 1){
                        params = {
                            createId: this.formData.createId,
                            departmentName: this.formData.departmentName,
                            establishTime: util.strToStamp(this.formData.establishTime),
                            departmentRemark: this.formData.departmentRemark
                        }
                        this.$http.post('/department/addDepartment', params).then((res) => {
                            this.formLoading = false;
                            let resData = res.data;
                            if(resData.meta.code === 0){
                                this.$message({
                                    message: '新增成功',
                                    type: 'success'
                                });
                                this.$refs.refForm.resetFields();
                                this.formVisible = false;
                                this.formData = {
                                    createId: sessionStorage.getItem('userId'),
                                    departmentId: 0,
                                    departmentName: '',
                                    establishTime: '',
                                    departmentRemark: ''
                                };
                                this.getListData();
                            }else{
                                this.errorMessage(resData.meta.message);
                            }
                        }).catch(() => {
                            this.innerServerError();
                        });
                    }else{
                        params = {
                            departmentId: this.formData.departmentId,
                            departmentName: this.formData.departmentName,
                            establishTime: util.strToStamp(this.formData.establishTime),
                            departmentRemark: this.formData.departmentRemark
                        };
                        this.$http.post('/department/modifyDepartment', params).then((res) => {
                            this.formLoading = false;
                            let resData = res.data;
                            if(resData.meta.code === 0){
                                this.$message({
                                    message: '修改成功',
                                    type: 'success'
                                });
                                this.$refs.refForm.resetFields();
                                this.formVisible = false;
                                this.formData = {
                                    createId: sessionStorage.getItem('userId'),
                                    departmentId: 0,
                                    departmentName: '',
                                    establishTime: '',
                                    departmentRemark: ''
                                };
                                this.getListData();
                            }else{
                                this.errorMessage(resData.meta.message);
                            }
                        }).catch(() => {
                            this.innerServerError();
                        });
                    }
                }
            });
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
        this.getListData();
    }
}