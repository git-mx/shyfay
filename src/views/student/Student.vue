<template>
    <section>
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="学生名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="filters.orderNumber" placeholder="学生名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getListData">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="funAdd">新增</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="downloadModel">模板下载</el-button>
                </el-form-item>
                <el-form-item>
                    <el-upload
                            class="upload-demo"
                            action="https://jsonplaceholder.typicode.com/posts/">
                        <el-button type="primary">上传数据</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="downloadData">下载学生数据</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="funRand">随机分组</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-table :data="listData" border highlight-current-row v-loading="loading" style="width:100%" :span-method="objectSpanMethod">
            <el-table-column prop="studentId" label="序号" width="100" align="center" v-if="showId"></el-table-column>
            <el-table-column prop="groupNo" label="组号" width="120" align="center"></el-table-column>
            <el-table-column prop="studentName" label="学生姓名" width="120" align="center"></el-table-column>
            <el-table-column prop="parentName" label="家长姓名" width="120" align="center"></el-table-column>
            <el-table-column prop="contactPhone" label="联系电话" width="200" align="center"></el-table-column>
            <el-table-column prop="orderNumber" label="订单号" width="200" align="center"></el-table-column>
            <el-table-column fixed="right" label="操作" width="60" align="center">
                <template  slot-scope="scope">
                    <a class="btn-operation" href="javascript:void(0)" @click="funEdit(scope.row)">修改</a>
                </template>
            </el-table-column>
        </el-table>
        <div  align="center">
            <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page="pageIndex"
                    :page-size="pageSize"
                    :total="totalCount"
                    layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
        </div>
        <el-dialog :title="formTitle" :visible.sync="formVisible" @close="closeForm">
            <el-form :model="formData" :rules="formRules" label-width="80px" ref="refForm">
                <el-form-item label="组号">
                    <el-input type="text" v-model="formData.groupNo" :disabled="true" placeholder="组号由后台自动分配"></el-input>
                </el-form-item>
                <el-form-item label="学生名称" prop="studentName">
                    <el-input type="text" v-model="formData.studentName"></el-input>
                </el-form-item>
                <el-form-item label="家长姓名" prop="parentName">
                    <el-input type="text" v-model="formData.parentName"></el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="contactPhone">
                    <el-input type="text" v-model="formData.contactPhone"></el-input>
                </el-form-item>
                <el-form-item lable="订单号">
                    <el-input type="text" v-model="formData.orderNumber" :disabled="true" placeholder="订单号由后台自动生成"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeForm">取消</el-button>
                <el-button type="primary" @click="submitForm" :loading="formLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>
<script type="text/ecmascript-6">
    import js from './student.js';
    export default js;
</script>
<style>
    @import '../../styles/common.css';
</style>