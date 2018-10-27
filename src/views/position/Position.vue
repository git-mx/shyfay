<template>
    <section>
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="职位名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="filters.level" placeholder="职位等级">
                        <el-option v-for="item in listLevels"
                                   :key="item.order"
                                   :label="item.name"
                                   :value="item.name">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getListData">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="funAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-table :data="listData" highlight-current-row v-loading="loading" style="width:100%">
            <el-table-column prop="positionId" label="序号" width="100" align="center" v-if="showId"></el-table-column>
            <el-table-column prop="positionName" label="职位名称" width="200" align="center"></el-table-column>
            <el-table-column prop="positionLevel" label="职位等级" width="100" align="center"></el-table-column>
            <el-table-column prop="positionRemark" label="备注" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="操作" width="120" align="center">
                <template  slot-scope="scope">
                    <a class="btn-operation" href="javascript:void(0)" @click="funEdit(scope.row)">修改</a>
                    <a class="btn-operation" href="javascript:void(0)" @click="funDelete(scope.row)">删除</a>
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
        <!--@close绑定对话框右上角的关闭事件-->
        <!--这里的也可以写成 title="新增职位信息",不过由于需要动态绑定，所以必须写成:title.title="{{formTile}}这样是不行的" -->
        <el-dialog :title="formTitle" :visible.sync="formVisible" @close="closeForm">
            <!--这里的el-form不能用v-model，必须要要用:model，如果使用v-model那么this.$refs.refForm.resetFields();将会无效-->
            <!--这里的el-input不能用:model，必须要用v-molde，如果使用了:model的时候在validate的时候即使填写了内容也会验证不过-->
            <el-form :model="formData" :rules="formRules" label-width="80px" ref="refForm">
                <el-form-item label="职位名称" prop="positionName">
                    <el-input type="text" v-model="formData.positionName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="职位等级" prop="positionLevel">
                    <el-select v-model="formData.positionLevel" filterable placeholder="请选择职位等级">
                        <el-option v-for="item in addLevels"
                                   :key="item.order"
                                   :label="item.name"
                                   :value="item.name">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item lable="备注">
                    <el-input type="textarea" v-model="formData.positionRemark"></el-input>
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
    import js from './position.js';
    export default js;
</script>
<style>
    @import '../../styles/common.css';
</style>