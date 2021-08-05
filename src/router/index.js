import Vue from 'vue'
import Router from 'vue-router' 
import http from '../api/http'
import Storage from '../api/storage'

// 首页
import Index from '@/pages/index/index'

// 登陆
import login from '@/pages/login/login'


//用户角色
import userRoles from '@/pages/userRoles/userRoles'

//菜单权限
import menuPower from '@/pages/menuPower/menuPower'

//巡店管理
import scoutShopDetails from '@/pages/scoutShopManage/scoutShopDetails' //巡店计划详情
import scoutShopManage from '@/pages/scoutShopManage/scoutShopManage' //巡店计划列表

import shopReportDetails from '@/pages/shopReportManage/shopReportDetails' //巡店报告详情
import shopReportManage from '@/pages/shopReportManage/shopReportManage' //巡店报告列表
import shopReportDetailsView from '@/pages/shopReportManage/shopReportDetailsView' //巡店报告店铺详情

import shopReplyDetails from '@/pages/shopReplyManage/shopReplyDetails' //巡店回复详情
import shopReplyManage from '@/pages/shopReplyManage/shopReplyManage' //巡店回复列表

//日志管理
import logView from '@/pages/logManage/logView' //日志管理

//流程管理
import flowView from '@/pages/flowManage/flowView' //流程管理查看

//系统资源
import systemResource from '@/pages/systemResource/systemResource' //系统资源查看

//员工管理
import employeeView from '@/pages/employeeManage/employeeView' //员工管理-员工查看
import employeeEdit from '@/pages/employeeManage/employeeEdit' //员工管理-员工编辑
import roleView from '@/pages/employeeManage/roleView' //员工管理-角色查看

//巡店报告设置
import shopInspectionReportSet from '@/pages/shopInspectionReportSet/shopInspectionReportSet' //巡店报告设置

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

  let routes = [{
            path: '/',
            redirect: '/index'
        },
        {
            path: '/login',
            component: login,
        },
        {
            path: '/index',
            component: Index,
            children: [{
                path: 'userRoles', //用户角色
                component: userRoles
            }, {
                path: 'menuPower', //菜单管理
                component: menuPower
            }, {
                path: 'scoutShopDetails', //巡店计划管理详情
                component: scoutShopDetails
            }, {
                path: 'scoutShopManage', //巡店计划管理列表
                component: scoutShopManage
            }, {
                path: 'shopReportDetailsView', //巡店报告店铺
                component: shopReportDetailsView
            }, {
                path: 'shopReportDetails', //巡店报告详情
                component: shopReportDetails
            }, {
                path: 'shopReportManage', //巡店报告列表
                component: shopReportManage
            }, {
                path: 'shopReplyDetails', //巡店回复详情
                component: shopReplyDetails
            }, {
                path: 'shopReplyManage', //巡店回复列表
                component: shopReplyManage
            }, {
                path: 'logView', //日志管理
                component: logView
            }, {
                path: 'flowView', //流程管理查看
                component: flowView
            }, {
                path: 'employeeView', //员工管理-员工查看
                component: employeeView
            }, {
                path: 'employeeEdit', //员工管理-员工编辑
                component: employeeEdit
            }, {
                path: 'roleView', //员工管理-角色查看
                component: roleView
            }, {
                path: 'systemResource', //系统资源管理
                component: systemResource
            }, {
                path: 'shopInspectionReportSet', //巡店管理设置
                component: shopInspectionReportSet
            }]
        }
    ]

const routerInstance = new Router({
	routes
});

// 全局路由拦截
routerInstance.beforeEach((to, from, next) => {
	const refreshToken = to.query.refreshToken;
	let route = to.query.route;
	const portMain = process.env.API_HOST
	// 如果不是从其他系统跳转的 则不做处理
	if (!refreshToken) {
		next();
	} else {
		let params = {
			refreshToken
		};
		http.get(`${portMain}/sso/covertRefreshToken`, params)
			.then(res => {
                Storage.set("heheToken", res);
				if (route) {
					localStorage.pathData = route;
				}
			})
			.catch()
			.finally(() => {
				if (route) {
					next(route);
				} else {
					localStorage.pathData = '';
					next('/');
				}
			});
	}
});

export default routerInstance
