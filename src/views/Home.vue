<template>
	<el-row class="container">
		<el-col :span="24" class="header">
			<el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
				{{collapsed?'':sysName}}
			</el-col>
			<el-col :span="10">
				<div class="tools" @click.prevent="collapse">
					<i class="fa fa-align-justify"></i>
				</div>
			</el-col>
			<el-col :span="4" class="userinfo">
				<el-dropdown trigger="hover">
					<span class="el-dropdown-link userinfo-inner"><img src="../assets/user.png" /> {{sysUserName}}</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item divided @click.native="changePassword">修改密码</el-dropdown-item>
						<el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-col>
		</el-col>
		<el-col :span="24" class="main">
			<aside :class="collapsed?'menu-collapsed':'menu-expanded'">
				<!--导航菜单-->
				<el-menu :default-active="$route.path" class="el-menu-vertical-demo" style="width:230px"
					 unique-opened router v-show="!collapsed">
					<template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
						<el-submenu :index="index+''" v-if="!item.leaf">
							<template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
							<el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="!child.hidden">{{child.name}}</el-menu-item>
						</el-submenu>
						<el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path"><i :class="item.iconCls"></i>{{item.children[0].name}}</el-menu-item>
					</template>
				</el-menu>
				<!--导航菜单-折叠后-->
				<ul class="el-menu el-menu-vertical-demo collapsed" v-show="collapsed" ref="menuCollapsed">
					<li v-for="(item,index) in $router.options.routes" v-if="!item.hidden" class="el-submenu item">
						<template v-if="!item.leaf">
							<div class="el-submenu__title" style="padding-left: 20px;" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)"><i :class="item.iconCls"></i></div>
							<ul class="el-menu submenu" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)">
								<li v-for="child in item.children" v-if="!child.hidden" :key="child.path" class="el-menu-item" style="padding-left: 40px;" :class="$route.path==child.path?'is-active':''" @click="$router.push(child.path)">{{child.name}}</li>
							</ul>
						</template>
						<!--<template>-->
							<!--<li class="el-submenu">-->
								<!--<div class="el-submenu__title el-menu-item" style="height: 56px;line-height: 56px;padding: 0 20px;" :class="$route.path==item.children[0].path?'is-active':''" @click="$router.push(item.children[0].path)"><i :class="item.iconCls"></i></div>-->
							<!--</li>-->
						<!--</template>-->
					</li>
				</ul>
			</aside>
			<section class="content-container">
				<div class="grid-content bg-purple-light">
					<el-col :span="24" class="content-wrapper">
						<el-col :span="24" class="breadcrumb-container">
							<el-breadcrumb separator=">" >
								<el-breadcrumb-item v-for="item in $route.matched" :key="item.path" class="el-breadcrumb-item-class">
									{{ item.name === '/' ? '' : item.name}}
								</el-breadcrumb-item>
							</el-breadcrumb>
						</el-col>
						<el-col :span="24" class="main-container">
							<transition name="fade" mode="out-in">
								<router-view></router-view>
							</transition>
						</el-col>
					</el-col>
				</div>
				<!--也许el-dialog只能放在section里面-->
				<el-dialog title="修改密码" width="600px" :visible.sync="formVisible" @close="closeForm">
					<el-form :model="formData" :rules="formRules" label-width="80px" ref="refForm">
						<el-form-item label-width="80px" label="当前密码" prop="currentPwd">
							<el-input type="password" v-model="formData.currentPwd" auto-complete="off"></el-input>
						</el-form-item>
						<el-form-item label-width="80px" label="新密码" prop="newPwd">
							<el-input type="password" v-model="formData.newPwd" auto-complete="off"></el-input>
						</el-form-item>
						<el-form-item label-width="80px" label="确认密码" prop="confirmPwd">
							<el-input type="password" v-model="formData.confirmPwd" auto-complete="off"></el-input>
						</el-form-item>
					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button @click="closeForm">取消</el-button>
						<el-button type="primary" @click="submitForm" :loading="formLoading">提交</el-button>
					</div>
				</el-dialog>
			</section>
		</el-col>
	</el-row>
</template>

<script>
	import util from '../common/js/util';
	export default {
		data() {
			return {
				sysName:'shyfay',
				collapsed:false,
				sysUserName: '',
				sysUserAvatar: '',
                formVisible: false,
                formLoading: false,
                formData: {
                    currentPwd: '',
                    newPwd: '',
					confirmPwd: ''

				},
                formRules: {
                    currentPwd: [
                        {required: true, message: '请填写当前密码', trigger: 'blur'}
					],
                    newPwd: [
                        {required: true, message: '请填写新密码', trigger: 'blur'},
                        {min: 5, message: '密码长度必须大于4'},
                        {max: 10, message: '密码长度必须小于11'},
                        {pattern: /^[a-zA-Z]\w/, message: '登录密码必须以英文字母开头，且只能包含英文字母，数字和下划线'}
                    ],
                    confirmPwd: [
                        {required: true, message: '请再次填写新密码', trigger: 'blur'},
                        {min: 5, message: '密码长度必须大于4'},
                        {max: 10, message: '密码长度必须小于11'},
                        {pattern: /^[a-zA-Z]\w/, message: '登录密码必须以英文字母开头，且只能包含英文字母，数字和下划线'}
                    ],
				}
			}
		},
		methods: {
			//退出登录
			logout: function () {
				var _this = this;
				this.$confirm('确认退出吗?', '提示', {
					//type: 'warning'
				}).then(() => {
                    sessionStorage.removeItem('sessionId');
                    sessionStorage.removeItem('userId');
                    sessionStorage.removeItem('userName');
					_this.$router.push('/login');
				});


			},
            changePassword: function() {
				this.formVisible = true;
			},
            closeForm: function(){
                this.formData = {
                    currentPwd: '',
					newPwd: '',
					confirmPwd: ''
                };
                this.formVisible = false;
			},
			//折叠导航栏
			collapse:function(){
				this.collapsed=!this.collapsed;
			},
			showMenu(i,status){
				this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-'+i)[0].style.display=status?'block':'none';
			},
            submitForm(){
			    if(this.formData.newPwd !== this.formData.confirmPwd){
                    this.formData = {
                        currentPwd: '',
                        newPwd: '',
                        confirmPwd: ''
                    };
			        this.$message({
						message: '确认密码和新密码不一致，请重新输入',
						type: 'error'
					});
				}
                this.formLoading = true;
			    let params = {
                    userId: sessionStorage.getItem('userId'),
                    oldPassword: this.formData.currentPwd,
                    newPassword: this.formData.newPwd
				}
			    this.$http.post('/login/modifyPassword', params).then((res) => {
			        this.formLoading = false;
			        if(res.data.meta.code == 0){
                        var _this = this;
						sessionStorage.removeItem('sessionId');
						sessionStorage.removeItem('userId');
						sessionStorage.removeItem('userName');
                        util.clearCookie();
						_this.$router.push('/login');
					}else{
                        this.$message({
                            message: res.data.meta.message,
                            type: 'error'
                        });
					}
				}).catch(()=>{
                    this.$message({
                        message: '内部服务器错误，请联系系统管理员',
                        type: 'error'
                    });
				})
			}
		},
		mounted() {
            var date = new Date();
            var dateStr = date.getFullYear() + '年' + (date.getMonth() + 1) + "月" + date.getDate() + "日";
            this.sysUserName = dateStr + ' ' + sessionStorage.getItem('userName');
            //存在vuex里面的值在刷新页面的时候会回到初始值，初始值就是在state里声明那个变量的时候给的值
			//this.sysUserName = dateStr + ' '+ this.$store.getters.getUserName || '';
		}
	}

</script>

<style scoped lang="scss">
	@import '~scss_vars';
	
	.container {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
		.header {
			height: 60px;
			line-height: 60px;
			background: $color-primary;
			color:#fff;
			.userinfo {
				text-align: right;
				padding-right: 35px;
				float: right;
				.userinfo-inner {
					cursor: pointer;
					color:#fff;
					font-size: 16px;
					font-weight: 400;
					img {
						width: 40px;
						height: 40px;
						border-radius: 20px;
						margin: 10px 0px 10px 10px;
						float: right;
					}
				}
			}
			.logo {
				height:60px;
				font-size: 33px;
				font-weight: 300;
				padding-left:20px;
				padding-right:20px;
				border-color: rgba(238,241,146,0.3);
				border-right-width: 1px;
				border-right-style: solid;
				img {
					width: 40px;
					float: left;
					margin: 10px 10px 10px 18px;
				}
				.txt {
					color:#fff;
				}
			}
			.logo-width{
				width:230px;
			}
			.logo-collapse-width{
				width:60px
			}
			.tools{
				padding: 0px 23px;
				width:14px;
				height: 60px;
				line-height: 60px;
				cursor: pointer;
			}
		}
		.main {
			display: flex;
			// background: #324057;
			position: absolute;
			top: 60px;
			bottom: 0px;
			overflow: hidden;
			aside {
				flex:0 0 230px;
				width: 230px;
				// position: absolute;
				// top: 0px;
				// bottom: 0px;
				.el-menu{
					height: 100%;
				}
				.collapsed{
					width:60px;
					.item{
						position: relative;
					}
					.submenu{
						position:absolute;
						top:0px;
						left:60px;
						z-index:99999;
						height:auto;
						display:none;
					}

				}
			}
			.menu-collapsed{
				flex:0 0 60px;
				width: 60px;
			}
			.menu-expanded{
				flex:0 0 230px;
				width: 230px;
			}
			.content-container {
				// background: #f1f2f7;
				flex:1;
				// position: absolute;
				// right: 0px;
				// top: 0px;
				// bottom: 0px;
				// left: 230px;
				overflow-y: scroll;
				padding: 5px 5px 5px 20px;
				.breadcrumb-container {
					.el-breadcrumb-item-class
					{
						font-weight: 400;
						font-size: 16px;
						color: #111;
					}
				}
				.content-wrapper {
					background-color: #fff;
					box-sizing: border-box;
					padding-top: 15px;
					padding-left: 20px;
				}
				.main-container {
					margin-top :10px;
				}
			}
		}
	}
</style>