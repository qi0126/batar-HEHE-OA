export let menu = [{
        id: "100",
        menuName: "巡店管理",
        menuUrl: null,
        parentId: "000",
        showTF: false,
        auth: "oa-shop-manage",
        childs: [
            {
                id: "101",
                menuName: "巡店反馈记录",
                menuUrl: "/index/shopReplyManage",
                parentId: "100",
                childs: [],
                auth: "oa-fklog",
                showTF: false
            },
            {
                id: "102",
                menuName: "巡店报告管理",
                menuUrl: "/index/shopReportManage",
                parentId: "100",
                childs: [],
                auth: "oa-bg-manage",
                showTF: false
            },
            {
                id: "103",
                menuName: "巡店计划管理",
                menuUrl: "/index/scoutShopManage",
                parentId: "100",
                childs: [],
                auth: "oa-jh-manage",
                showTF: false
            },
            {
                id: "104",
                menuName: "巡店报告管理设置",
                menuUrl: "/index/shopInspectionReportSet",
                parentId: "100",
                childs: [],
                auth: "oa-bgsz-manage",
                showTF: false
            }
        ]
    },
    {
        id: "200",
        menuName: "系统管理",
        menuUrl: null,
        parentId: "000",
        auth: "oa-sys-manage",
        showTF: false,
        childs: [
            // {
            //     id: "201",
            //     menuName: "菜单管理",
            //     menuUrl: "/index/menuPower",
            //     parentId: "200",
            //     childs: [],
            //     auth: "",
            //     showTF: true
            // },
            // {
            //     id: "202",
            //     menuName: "角色管理",
            //     menuUrl: "/index/roleView",
            //     parentId: "200",
            //     childs: [],
            //     auth: "",
            //     showTF: true
            // },
            // {
            //     id: "203",
            //     menuName: "系统资源管理",
            //     menuUrl: "/index/systemResource",
            //     parentId: "200",
            //     childs: [],
            //     auth: "",
            //     showTF: true
            // },
            {
                id: "204",
                menuName: "流程管理",
                menuUrl: "/index/flowView",
                parentId: "200",
                childs: [],
                auth: "flow:select",
                showTF: false
            },
            // {
            //     id: "205",
            //     menuName: "员工管理",
            //     menuUrl: null,
            //     parentId: "200",
            //     showTF: true,
            //     childs: [{
            //             id: "2051",
            //             menuName: "员工管理-员工信息",
            //             menuUrl: "/index/employeeEdit",
            //             parentId: "205",
            //             childs: [],
            //             auth: "",
            //             showTF: true
            //         },
            //         {
            //             id: "2052",
            //             menuName: "员工管理--人员",
            //             menuUrl: "/index/employeeView",
            //             parentId: "205",
            //             childs: [],
            //             auth: "",
            //             showTF: true
            //         }
            //     ]
            // },
            {
                id: "206",
                menuName: "日志查看",
                menuUrl: "/index/logView",
                parentId: "200",
                childs: [],
                auth: "",
                showTF: false
            },
        ]
    },
    {
      id: "300",
      menuName: "自营系统",
      menuUrl: null,
      parentId: "000",
      showTF: false,
      auth: "oa-proprietary-systems",
      childs: []
    }
];
