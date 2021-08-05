import http from './http'

class Api {
    constructor() {
        this.http = http
    }

    //登录
    login(params) {
        return this.http.postUrlencoded('/sso/login', params)
    }

    //退出
    loginOut() {
            return this.http.get('/sso/logout')
        }
    //登录成功后查询用户信息和权限权限
    getUserInfo() {
            return this.http.get('/account/getCurrUser')
        }
     //登录成功后查询用户拥有的权限
    getMenuInfo() {
        return this.http.get('/account/findUserAuthMenu')
    }

    //菜单管理查看所有菜单
    getMenuAll() {
            return this.http.get('/menu/findAll')
        }
        //刪除菜单接口
    delMenu(params) {
            return this.http.postUrlencoded('/menu/delMenu', params)
        }
        //根据id 查询菜单
    viewIdMenu(params) {
        return this.http.get('/menu/findById', params)
    }

    //菜单管理添加菜单
    addOrEditMenu(params) {
            return this.http.postUrlencoded('/menu/addOrEditMenu', params)
        }
        //巡店计划分页查询接口
    getShopList(params) {
            return this.http.get('/plan/findAllPage', params)
        }
        //巡店计划详情查询接口
    findDetailsById(params) {
            return this.http.get('/plan/findDetailsById', params)
        }
        //巡店计划审核接口
    updateAudit(params) {
            return this.http.postUrlencoded('/plan/audit', params)
        }
        //巡店报告分页查询接口
    findAllReportPage(params) {
            return this.http.get('/plan/findAllReportPage', params)
        }
        //巡店报告查看详情接口
    findAllReportDetails(params) {
            return this.http.get('/plan/findAllReportDetails', params)
        }
        //巡店报告查看巡店店铺详情接口
    findReportDetails(params) {
        return this.http.get('/plan/findReportDetails', params)
    }

    //巡店回复分页查询接口
    findAllFeedback(params) {
            return this.http.get('/plan/findAllFeedback', params)
        }
        //巡店回复店铺详情查询接口
    findStoreDetails(params) {
            return this.http.get('/plan/findStoreDetails', params)
        }
        //巡店回复店铺详情查询接口
    shopReply(params) {
        return this.http.postUrlencoded('/plan/reply', params)
    }

    //分页查询接口资源
    systemResourceAll(params) {
        return this.http.get('/authUrl/findAllPage', params)
    }

    //查询公司旗下所有角色分页
    roleAll(params) {
            return this.http.get('/role/findAllByPage', params)
        }
        //新增角色
    addRole(params) {
            return this.http.postUrlencoded('/role/addRole', params)
        }
        //编辑角色
    editRole(params) {
            return this.http.postUrlencoded('/role/editRole', params)
        }
        //删除角色
    delRole(params) {
            return this.http.postUrlencoded('/role/delRole', params)
        }
        //根据目录id 查询目录下的菜单权限,并根据roleId,勾选数据
    fidnRoleAuth(params) {
            return this.http.get('/role/fidnRoleAuth', params)
        }
        //修改用户权限
    updateRoleMenu(params) {
            return this.http.post('/role/updateRoleMenu', params)
        }
        //查询流程管理
    flowAll() {
        return this.http.get('/flow/findAll')
    }

    //分页查询接口资源
    authAll(params) {
        return this.http.get('/authUrl/findAllPage', params)
    }

    //新增接口资源
    addAuthUrl(params) {
            return this.http.postUrlencoded('/authUrl/addAuthUrl', params)
        }
        //新增接口资源
    delAuthUrl(params) {
        return this.http.postUrlencoded('/authUrl/delAuthUrl', params)
    }

    //修改接口资源
    editAuthUrl(params) {
        return this.http.postUrlencoded('/authUrl/editAuthUrl', params)
    }

    //修改接口资源
    userAll(params) {
            return this.http.get('/user/findStoreUserAll', params)
        }
        //根据用户id 查询用户信息
    findById(params) {
            return this.http.get('/user/findById', params)
        }
        //为用户设置角色
    userUpdate(params) {
            return this.http.postUrlencoded('/user/updateStatus', params)
        }
        //用户查询角色列表接口
    roleFindAll() {
            return this.http.get('/role/findAll')
        }
        //查询审核节点的审核人员
    findUserByNodeId(params) {
            return this.http.get('/flow/findUserByNodeId', params)
        }
        //新增或修改节点
    addOrUpdateNode(params) {
            return this.http.postUrlencoded('/flow/addOrUpdateNode', params)
        }
        //修改流程基本信息
    updateFlow(params) {
            return this.http.post('/flow/updateFlow', params)
        }
        //修改流程基本信息
    openOrCloseFlow(params) {
            return this.http.postUrlencoded('/flow/openOrClose', params)
        }
        //删除节点
    delFlowNode(params) {
            return this.http.postUrlencoded('/flow/delFlowNode', params)
        }
        //巡店计划详情流程审核信息
    findFlowAuth(params) {
        return this.http.get('/plan/findFlowAuth', params)
    }

    //查询日志
    findLog(params) {
        return this.http.get('/log/findAllPage', params)
    }

    //查询审核按钮权限
    currUserIsAuth(params) {
        return this.http.get('/applet/planAuth/currUserIsAuth', params)
    }

    //获取巡店设置列表数据
    getReportData() {
        return this.http.get('/reportData/findAll')
    }

    //巡店设置保存
    saveReportData(params) {
        return this.http.post('/reportData/returnDataEdit', params)
    }

    //系统权限接口
    findCurrUserAuth(params) {
        return this.http.get('/account/findCurrUserAuth', params)
    }
    //系统权限接口(重构)
    myAuthVals(){
        return this.http.get('/sso/myAuthVals')
    }
    //获取自营系统
    getAddressableApp(){
        return this.http.get('/sso/getAddressableApp')
    }
    //自营系统获取跳转URL
    getRedirectionUrl(params){
        return this.http.get('/sso/getRedirectionUrl',params)
    }

    //获取用户信息
    myInfo(){
        return this.http.get('/sso/myInfo')
    }



}

export default new Api()