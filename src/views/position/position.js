
import util from '../../common/js/util.js';
import levelData from './positionLevel.js';

export default {
    data() {
        return {
            listLevels: levelData.getListLevels(),
            addLevels: levelData.getAddLevels(),
            filters: {
                name: '',
                level: ''
            },
            loading: false,
            showId: false,
            listData: [],
            pageIndex: 1,
            pageSize: 10,
            totalCount: 0,
            formTitle: '',
            formVisible: false,
            formLoading: false,
            addOrEdit: 0,
            formData: {
                positionId: 0,
                positionName: '',
                positionLevel: '',
                positionRemark: ''
            },
            formRules: {
                positionName: [
                    {required: true, message: '请填写职位名称', trigger: 'blur'}
                ],
                positionLevel: [
                    {required: true, message: '请选择职位等级', trigger: 'blur'}
                ]
            }
        }
    },
    methods: {
        getListData: function() {
            this.loading = true;
            var params = {
                pageIndex: this.pageIndex,
                pageSize: this.pageSize,
                positionName: this.filters.name,
                positionLevel: this.filters.level == '全部' ? '' : this.filters.level
            }
            this.$http.post('/position/listPosition', params).then((res) => {
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
        handleCurrentChange: function(val){
            this.pageIndex = val;
            this.getListData();
        },
        funAdd: function(){
            this.addOrEdit = 1;
            this.formTitle = '新增职位信息';
            this.formVisible = true;
        },
        funEdit: function(row){
            this.addOrEdit = 2;
            this.formTitle = '修改职位信息';
            this.formVisible = true;
            this.formLoading = true;
            this.$http.get('/position/detailPosition?positionId=' + row.positionId).then((res) => {
                this.formLoading = false;
                let resData = res.data;
                if(resData.meta.code === 0 && resData.data){
                    this.formData = {
                        positionId: row.positionId,
                        positionName: resData.data.positionName,
                        positionLevel: resData.data.positionLevel,
                        positionRemark: resData.data.positionRemark
                    };
                }else{
                    this.formVisible = false;
                    this.errorMessage(resData.meta.message);
                }
            }).catch(() => {
               this.innerServerError();
            });
        },
        funDelete: function(row){
            this.$confirm("确认删除该部门信息吗?", "提示", {
                type: 'warning'
            }).then(() => {
                this.loading = true;
                this.$http.get('/position/deletePosition?positionId=' + row.positionId).then((res) => {
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
            }).catch(()=>{

            });
        },
        closeForm: function(){
            this.$refs.refForm.resetFields();
            this.formData = {
                positionId: 0,
                positionName: '',
                positionLevel: '',
                positionRemark: ''
            };
            this.formVisible = false;
        },
        submitForm: function(){
            this.$refs.refForm.validate((valid) =>{
                if(valid){
                    this.formLoading = true;
                    let params = {};
                    let resData = {};
                    if(this.addOrEdit == 1){
                        params = {
                            createId: sessionStorage.getItem('userId'),
                            positionName: this.formData.positionName,
                            positionLevel: this.formData.positionLevel,
                            positionRemark: this.formData.positionRemark
                        };
                        this.$http.post('/position/addPosition', params).then((res) => {
                            this.formLoading = false;
                            resData = res.data;
                            if(resData.meta.code == 0) {
                                this.$message({
                                    message: '新增成功',
                                    type: 'success'
                                });
                                this.initThis();
                            }else{
                                this.errorMessage(resData.meta.message);
                            }
                        }).catch(() => {
                            this.innerServerError();
                        });
                    }else{
                        params = {
                            positionId: this.formData.positionId,
                            positionName: this.formData.positionName,
                            positionLevel: this.formData.positionLevel,
                            positionRemark: this.formData.positionRemark
                        };
                        this.$http.post('/position/modifyPosition', params).then((res) => {
                            this.formLoading = false;
                            resData = res.data;
                            if(resData.meta.code == 0){
                                this.$message({
                                    message: '修改成功',
                                    type: 'success'
                                });
                                this.initThis();
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
        },
        initThis: function(){
            this.$refs.refForm.resetFields();
            this.formVisible = false;
            this.formData = {
                positionId: 0,
                positionName: '',
                positionLevel: '',
                positionRemark: ''
            };
            this.getListData();
        }
    },
    mounted() {
        this.getListData();
    }
}
