
export default {
    data() {
        return {
            loading: false,
            showId: false,
            formVisible: false,
            formLoading: false,
            formTitle: '',
            listData: [],
            addOrEdit: 1,
            pageIndex: 1,
            pageSize: 10,
            totalCount: 0,
            studentName: '',
            orderNumber: '',
            formData: {
                studentId: 0,
                groupNo: 0,
                studentName: '',
                parentName: '',
                contactPhone: '',
                orderNumber: ''
            },
            formRules: {
                studentName: [
                    {required: true, message: '请填写学生姓名', trigger: 'blur'}
                ],
                parentName: [
                    {required: true, message: '请填写家长姓名', trigger: 'blur'}
                ],
                contactPhone: [
                    {required: true, message: '请填写联系电话', trigger: 'blur'}
                ]
            },
            filters: {
                name: '',
                orderNumber: ''
            }
        }
    },
    methods: {
        getListData: function(){
            this.loading = true;
            var params = {
                pageIndex: this.pageIndex,
                pageSize: this.pageSize,
                studentName: this.studentName,
                orderNumber: this.orderNumber
            }
            this.$http.post('/student/listStudent', params).then((res) =>{
                this.loading = false;
                console.log(res.data.data);
                if(res.data.meta.code == 0 && res.data.data){
                    this.listData = res.data.data.list;
                    this.totalCount = res.data.data.total;
                }else{
                    this.errorMessage(res.data.meta.message);
                }
            }).catch(() => {
                this.innerServerError();
            });
        },
        objectSpanMethod: function({ row, column, rowIndex, columnIndex }){
            if (columnIndex === 0) {
                if (rowIndex % 2 === 0) {
                    return {
                        rowspan: 2,
                        colspan: 1
                    };
                } else {
                    return {
                        rowspan: 0,
                        colspan: 0
                    };
                }
            }
        },
        handleCurrentChange: function(val){
            this.pageIndex = val;
            this.getListData();
        },
        funAdd: function(){
            this.addOrEdit = 1;
            this.formTitle = '新增学生信息';
            this.formVisible = true;
        },
        downloadModel: function(){
            var host = sessionStorage.getItem('host');
            window.location.href = host + '/USERRESOURCES/学生数据导入模板.xlsx';
        },
        downloadData: function(){
            var host = sessionStorage.getItem('host');
            var sessionId = sessionStorage.getItem('sessionId');
            window.location.href = host + '/student/dwonloadData?sessionId='+ sessionId;
        },
        fileChange: function(event){
            var file = event.target.files[0];
            if(file.size >= 2097152){//2M
                this.$message.error('上传的文件必须小于5MB!');
            }else{
                if(file.name.endsWith('.xls') || file.name.endsWith('.xlsx')){
                    this.loading = true;
                    var formData = new FormData();
                    formData.append("file", file);
                    let headers = {headers: {"Content-Type": "multipart/form-data"}}
                    this.$http.post("/student/importData", formData, headers).then((res)=>{
                        this.loading = false;
                        if(res.data.meta.code === 0){
                            this.getListData();
                            this.$message.success('上传成功!');
                        }else{
                            this.errorMessage(res.data.meta.message);
                        }
                    }).catch(()=>{
                        this.innerServerError();
                    })
                }else{
                    this.$message.error('请上传excel文件!');
                }
            }
            this.$refs.inputFile.value = '';
        },
        funRand: function() {
            this.loading = true;
            this.$http.get('/student/randGroup').then((res)=>{
                this.loading = false;
                if(res.data.meta.code === 0){
                    this.$message.success('分组成功!');
                    this.getListData();
                }else{
                    this.errorMessage(res.data.meta.message);
                }
            }).catch(()=>{
                this.innerServerError();
            });
        },
        funEdit: function(row){
            this.addOrEdit = 2;
            this.formTitle = '修改学生信息';
            this.formVisible = true;
            this.formLoading = true;
            this.$http.get('/student/detailStudent?studentId=' + row.studentId).then((res) => {
                this.formLoading = false;
                let resData = res.data;
                if(resData.meta.code === 0 && resData.data){
                    this.formData = {
                        studentId: row.studentId,
                        groupNo: resData.data.groupNo,
                        studentName: resData.data.studentName,
                        parentName: resData.data.parentName,
                        contactPhone: resData.data.contactPhone,
                        orderNumber: resData.data.orderNumber
                    };
                }else{
                    this.formVisible = false;
                    this.errorMessage(resData.meta.message);
                }
            }).catch(() => {
                this.innerServerError();
            });
        },
        closeForm: function(){
            this.$refs.inputFile.value = '';
            this.$refs.refForm.resetFields();
            this.formData = {
                studentId: 0,
                groupNo: 0,
                studentName: '',
                parentName: '',
                contactPhone: '',
                orderNumber: ''
            };
            this.formVisible = false;
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
            this.$refs.inputFile.value = '';
            this.$refs.refForm.resetFields();
            this.loading = false;
            this.$message({
                message: '内部服务器错误，请联系系统管理员！',
                type: 'error'
            });
        },
        submitForm: function(){
            this.$refs.refForm.validate((valid) =>{
                if(valid){
                    this.formLoading = true;
                    let params = {};
                    let resData = {};
                    if(this.addOrEdit == 1){
                        params = {
                            groupNo: this.formData.groupNo,
                            studentName: this.formData.studentName,
                            parentName: this.formData.parentName,
                            contactPhone: this.formData.contactPhone,
                            orderNumber: this.formData.orderNumber
                        };
                        this.$http.post('/student/addStudent', params).then((res) => {
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
                            studentId: this.formData.studentId,
                            groupNo: this.formData.groupNo,
                            studentName: this.formData.studentName,
                            parentName: this.formData.parentName,
                            contactPhone: this.formData.contactPhone,
                            orderNumber: this.formData.orderNumber
                        };
                        this.$http.post('/student/modifyStudent', params).then((res) => {
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
    },
    mounted() {
        this.getListData();
    }
}