import Login from './views/user/Login.vue';
import NotFound from './views/404.vue';
import Home from './views/Home.vue';
import Main from './views/Main.vue';
import sysUser from './views/user/User.vue';
import Form from './views/nav1/Form.vue';
import departmentIndex from './views/department/Department.vue';
import positionIndex from './views/position/Position.vue';
import Page4 from './views/nav2/Page4.vue';
import Page5 from './views/nav2/Page5.vue';
import Page6 from './views/nav3/Page6.vue';
import echarts from './views/charts/echarts.vue';

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '系统管理',
        iconCls: 'el-icon-setting',//图标样式class
        children: [
            { path: '/main', component: Main, name: '主页', hidden: true },
            { path: '/departmentIndex', component: departmentIndex, name: '部门管理' },
            { path: '/sysPosition', component: positionIndex, name: '职位管理' },
            { path: '/sysUser', component: sysUser, name: '用户管理' },
            { path: '/sutdent', component: Form, name: '学生管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '导航二',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/page4', component: Page4, name: '页面4' },
            { path: '/page5', component: Page5, name: '页面5' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-address-card',
        leaf: true,//只有一个节点
        children: [
            { path: '/page6', component: Page6, name: '导航三' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: 'Charts',
        iconCls: 'fa fa-bar-chart',
        children: [
            { path: '/echarts', component: echarts, name: 'echarts' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;