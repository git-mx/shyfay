<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="部门名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getListData">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="funAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="listData" highlight-current-row v-loading="loading" style="width: 100%;">
			<el-table-column prop="departmentId" label="序号" width="100" align="center" v-if="showId">
			</el-table-column>
			<el-table-column prop="departmentName" label="部门名称" width="120"  align="center" >
			</el-table-column>
			<el-table-column prop="establishTime" label="成立时间" width="160"  align="center" :formatter="formatEstablishTime" >
			</el-table-column>
			<el-table-column prop="departmentRemark" label="备注" :show-overflow-tooltip="true"></el-table-column>
			<el-table-column label="操作" width="120" align="center">
				<template  slot-scope="scope">
					<a class="btn-operation" href="javascript:void(0)" @click="funEdit(scope.row)">修改</a>
					<a class="btn-operation" href="javascript:void(0)" @click="funDelete(scope.row)">删除</a>
				</template>
			</el-table-column>
		</el-table>
		<!--分页插件-->
		<div align="center">
			<el-pagination
					@current-change="handleCurrentChange"
					:current-page="pageIndex"
					:page-size="pageSize"
					layout="total, sizes, prev, pager, next, jumper"
					:total="totalCount">
			</el-pagination>
		</div>
		<!--新增和编辑页面-->
		<el-dialog :title="formTitle" :visible.sync="formVisible" :close-on-click-modal="false" @close="closeForm">
			<el-form :model="formData" label-width="80px" :rules="formRules" ref="refForm">
				<el-form-item label="名称" prop="departmentName">
					<el-input v-model="formData.departmentName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="成立时间" prop="establishTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="formData.establishTime"></el-date-picker>
				</el-form-item>
				<el-form-item label="备注">
					<el-input type="textarea" v-model="formData.departmentRemark"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeForm">取消</el-button>
				<el-button type="primary" @click.native="fromSubmit" :loading="formLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>
<script>
    import js from './department.js';
    export default js;
</script>

<style scoped>
	@import '../../styles/common.css';
</style>