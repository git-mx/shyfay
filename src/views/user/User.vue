<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="姓名"></el-input>
                </el-form-item>
                <el-form-item >
                        <el-checkbox v-model="sexMan" border>男</el-checkbox>
                        <el-checkbox v-model="sexWoman" border>女</el-checkbox>
                </el-form-item>
                <el-form-item>
                    <!--这里还不能写成filterable="true"-->
                    <el-select
                    v-model="filters.departmentId"
                    filterable
                    remote
                    clearable
                    placeholder="所属部门"
                    :remote-method="queryDepartment"
                    :loadinng="searchLoading">
                        <el-option v-for="item in dsearchOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select
                    v-model="filters.positionId"
                    filterable
                    remote
                    clearable
                    placeholder="所在职位"
                    :remote-method="queryPosition"
                    :loading="searchLoading">
                        <el-option v-for="item in psearchOptions"
                                   :key="item.id"
                                   :label="item.name"
                                   :value="item.id">

                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="width:10px;">

                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getListData">查询</el-button>
                    <el-button type="primary" v-on:click="funAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <template>
            <el-table :data="listData" highlight-current-row v-loading="loading" style="width: 100%;">
                <el-table-column prop="userId" label="序号" width="100" hidden="true"></el-table-column>
                <el-table-column prop="userName" label="姓名" width="120" align="center" >
                </el-table-column>
                <el-table-column prop="userSex" label="性别" width="70" :formatter="formatSex"  align="center" >
                </el-table-column>
                <el-table-column prop="departmentName" label="所在部门" width="120"  align="center" >
                </el-table-column>
                <el-table-column prop="positionName" label="职位" width="120"  align="center" >
                </el-table-column>
                <el-table-column prop="birthdayTime" label="出生日期" :formatter="formatBirthday" width="130" align="center" >
                </el-table-column>
                <el-table-column prop="phoneNumber" label="联系电话" width="130"  align="center">
                </el-table-column>
                <el-table-column prop="houseAddress" label="地址" >
                </el-table-column>
                <el-table-column label="操作" width="120" align="center">
                    <template  slot-scope="scope">
                        <a class="btn-operation" href="javascript:void(0)" @click="funEdit(scope.row)">修改</a>
                        <a class="btn-operation" href="javascript:void(0)" @click="funDelete(scope.row)">删除</a>
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <div align="center">
            <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page="pageIndex"
                    :page-size="pageSize"
                    :total="totalCount"
                    layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
        </div>
        <el-dialog :title="formTitle" :visible.sync="formVisible" @close="closeForm" :loading="formLoading">
            <el-form :model="formData" :rules="formRules" ref="refForm" >
                <el-row>
                    <el-col :span="12">
                        <el-form-item label-width="80px" label="所属部门" prop="departmentId">
                            <el-select v-model="formData.departmentId">
                                <el-option v-for="item in departmentOptions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="所在职位" prop="positionId">
                            <el-select v-model="formData.positionId">
                                <el-option v-for="item in positionOptions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label-width="80px" label="姓名" prop="userName">
                            <el-input class="input-two-column" type="text" v-model="formData.userName" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label-width="80px" label="性别" prop="userSex">
                            <el-radio-group v-model="formData.userSex">
                                <el-radio :label="1" border>男</el-radio>
                                <el-radio :label="2" border>女</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label-width="80px" label="出生日期" prop="birthdayTime">
                            <el-date-picker v-model="formData.birthdayTime" placeholder="请选择日期"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label-width="80px" label="联系电话" prop="phoneNumber">
                            <el-input type="text"  class="input-two-column" v-model="formData.phoneNumber"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label-width="80px" label="身份证号" prop="idNumber">
                    <el-input type="text" v-model="formData.idNumber"></el-input>
                </el-form-item>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label-width="80px" label="登录账号" prop="loginName">
                            <el-input class="input-two-column" type="text" v-model="formData.loginName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="addOrEdit===1">
                        <el-form-item label-width="80px" label="登录密码" prop="loginPassword">
                            <el-input class="input-two-column" type="password" v-model="formData.loginPassword"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="addOrEdit===2">
                        <el-form-item label-width="80px" label="登录密码">
                            <el-input class="input-two-column" type="password" v-model="formData.editLoginPassword" placeholder="若不输入则沿用原有密码"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label-width="80px" label="联系地址" prop="houseAddress">
                    <el-input type="text" v-model="formData.houseAddress"></el-input>
                </el-form-item>
                <!--为了判断图片的像素大小才不得已这么写，其实可以用element-ui的el-uoload组件很简单-->
                <el-form-item label-width="80px" label="头像图片">
                    <el-row>
                        <el-col :span="24">
                            <img :src="imageUrl" class="header-image" alt />
                            <input type="file" @change="fileChange" class="input-image" ref="inputFile"/>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label-width="80px" label="">
                    <el-row>
                        <el-row :span="24">
                            <div v-if="pngMessage">请上传PNG格式的图片</div>
                            <div v-if="sizeMessage">请上传小于或等于2M的图片</div>
                            <div v-if="pxMessage">请上传尺寸为132×132的图片</div>
                        </el-row>
                    </el-row>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeForm">取消</el-button>
                <el-button type="primary" @click="submitForm" :loading="formLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>
<script>
    import js from './user.js';
    export default js;
</script>

<style scoped>
    .header-image {
        background: #FFFFFF;
        weidth: 132px;
        height: 132px;
        border: 1px solid #d9d9d9;

    }
    /*.header-image:hover {*/
        /*border: 1px solid #409EFF;*/
    /*}*/
    .input-image {
        position: absolute;
        top: 2px;
        left: 2px;
        width: 125px;
        height: 125px;
        opacity: 0;
    }
</style>