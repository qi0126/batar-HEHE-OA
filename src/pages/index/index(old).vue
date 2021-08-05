<template>
  <div class="homeWrap">
    <header>
      <div class="left">百泰OA管理系统</div>
      <div class="right">
        <el-row>
          <el-col :span="16">
            <el-menu
              :default-active="String(activeIndexMain)"
              class="el-menu-demo height50"
              mode="horizontal"
              @select="handleSelect"
            >
              <el-menu-item
                v-for="ielem in menuMain"
                :index="ielem.id+''"
                :key="ielem.id"
                style="height:50px;line-height:47px;"
              >{{ielem.name}}</el-menu-item>
            </el-menu>
          </el-col>
          <el-col :span="8" class="userNameDiv">
            <span class="userName" @click="editPassWord">欢迎您，{{realName}}</span>
            <span class="signOut" @click="signOut">退出</span>
          </el-col>
        </el-row>
      </div>
    </header>
    <div class="container">
      <el-container>
        <el-aside width="200px" style="background-color: #fff">
          <el-menu :router="true" @select="menuSelect" :default-active="String(activeIndex)">
            <div v-for="item in menuTwo" :key="item.id">
              <el-submenu :index="item.id+''" v-if="item.sonMenu.length > 0">
                <template slot="title">
                  <!-- <i class="el-icon-menu"></i> -->
                  {{item.name}}
                </template>
                <el-menu-item-group v-if="item.type != 2">
                  <div v-for="it in item.sonMenu" :key="it.id">
                    <el-menu-item :index="it.route + ''">{{it.name}}</el-menu-item>
                  </div>
                </el-menu-item-group>
              </el-submenu>

              <el-menu-item
                :index="item.route+''"
                v-if="item.sonMenu.length == 0 && item.type != 2"
              >
                <!-- <i class="el-icon-menu"></i> -->
                <span slot="title">{{item.name}}</span>
              </el-menu-item>
            </div>
            <!-- <el-menu-item :index="'/index/employeeView'" >
              <span slot="title">员工管理-员工（new）</span>
            </el-menu-item>
            <el-menu-item :index="'/index/roleView'" >
              <span slot="title">员工管理-角色（new）</span>
            </el-menu-item>

            <el-menu-item :index="'/index/scoutShopManage'" >
              <span slot="title">巡店计划管理（new）</span>
            </el-menu-item>
            <el-menu-item :index="'/index/shopReportManage'" >
              <span slot="title">巡店报告管理（new）</span>
            </el-menu-item>
            <el-menu-item :index="'/index/shopReplyManage'" >
              <span slot="title">巡店回复管理（new）</span>
            </el-menu-item>
            <el-menu-item :index="'/index/flowView'" >
              <span slot="title">流程管理（new）</span>
            </el-menu-item>
            <el-menu-item :index="'/index/logView'" >
              <span slot="title">日志管理（new）</span>
            </el-menu-item>
            <el-menu-item :index="'/index/systemResource'" >
              <span slot="title">系统资源（new）</span>
            </el-menu-item>
            <el-menu-item :index="'/index/menuPower'">
              <span slot="title">菜单管理（new）</span>
            </el-menu-item>
            <el-menu-item :index="'/index/userRoles'" >
              <span slot="title">权限管理（new）</span>
            </el-menu-item>-->
          </el-menu>
        </el-aside>

        <el-main class="section">
          <router-view></router-view>
        </el-main>
      </el-container>
    </div>

    <!-- 编辑 -->
    <el-dialog
      width="520px"
      title="修改密码"
      :close-on-click-modal="false"
      :visible.sync="dialogFormVisibleEdit"
    >
      <section class="dialogWrapEdit">
        <ul>
          <li class="firstLi">
            <span>原始密码</span>
            <el-input
              v-model="oldUserPassword"
              placeholder="请输入原始密码"
              size="small"
              style="width:200px"
              show-password
              @blur="goEmpty('oldUserPassword')"
            ></el-input>
          </li>
          <li>
            <span>新密码</span>
            <el-input
              v-model="userPassword"
              placeholder="请输入新密码"
              size="small"
              style="width:200px"
              show-password
              @blur="goEmpty('userPassword')"
            ></el-input>
          </li>
        </ul>
      </section>

      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="dialogFormVisibleEdit = false" plain>取 消</el-button>
        <el-button size="small" type="primary" @click="submintPassWord">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { menus } from "./menuConfig";

export default {
  data() {
    return {
      controller: [], //权限点
      activeIndex: "",
      activeIndexMain: "",
      oldUserPassword: "",
      userPassword: "",
      realName: "", //用户名
      dialogFormVisibleEdit: false,
      menuMain: [], //菜单数据
      menuOne: [], //一级菜单数据
      menuTwo: [] //二级菜单数据
    };
  },
  created() {
    this.getUserInfo(); //获取用户信息
    this.getMenuInfo(); //获取菜单信息
    this.getAuth();//获取权限信息
    // this.$router.push(this.activeIndex);
  },
  methods: {
    menuSelect(a, b) {
      // console.log("aaa:",a, b);
      localStorage.menuTwo = a;
      // console.log(a, b);
      // this.$Storage.set("defaulPath", a);
    },
    //获取权限信息
    getAuth(){
      this.$api.findCurrUserAuth().then(res => {
        if (res.code == 200) {
          localStorage.authTxt = JSON.stringify(res.data)
        }
      });
    },
    signOut() {
      this.$confirm("请确认是否要退出登录？", "提示", {
        type: "warning"
      })
        .then(() => {
          localStorage.removeItem("menuTwo");
          localStorage.removeItem("menuOne");
          localStorage.removeItem("authTxt");
          this.$Storage.remove("heheToken");
          // this.$Storage.setCookie("heheToken", "");
          this.$router.push("/login");
          // this.$api.loginOut().then(res => {
          //   if (res.code == 200) {
          //     this.$Storage.remove("heheToken");
          //     this.$Storage.remove("defaulPath");
          //     this.$Storage.sessionRemove("controller");

          //     this.$router.push("/login");
          //   }
          // });
        })
        .catch(() => {});
    },
    //登录成功后查询用户信息和权限
    getUserInfo() {
      this.$api.getUserInfo().then(res => {
        if (res.code == 200) {
          this.realName = res.data.concat;
        }
      });
    },
    //登录后查询用户菜单数据
    getMenuInfo() {
      this.$api.getMenuInfo().then(res => {
        if (res.code == 200) {
          if (res.data.length > 0) {
            this.menuMain = res.data;
            //一级菜单
            if (localStorage.menuOne) {
              res.data.forEach(ielem => {
                if (JSON.stringify(ielem.id) === localStorage.menuOne) {
                  this.activeIndexMain = ielem.id;
                  this.menuTwo = ielem.sonMenu;
                }
              });
            }
            //二级菜单
            if (localStorage.menuTwo) {
              res.data.forEach(ielem => {
                if (
                  localStorage.menuOne &&
                  JSON.stringify(ielem.id) === localStorage.menuOne
                ) {
                  this.activeIndexMain = ielem.id;
                  this.menuTwo = ielem.sonMenu;
                }
                if (!localStorage.menuOne) {
                  this.activeIndexMain = res.data[0].id + "";
                  this.activeIndex = res.data[0].sonMenu[0].route;
                  this.menuTwo = res.data[0].sonMenu;
                }
              });
              this.menuTwo.forEach(ielem => {
                if (ielem.route === localStorage.menuTwo) {
                  this.activeIndex = ielem.route;
                  this.$router.push(ielem.route);
                }
              });
            }

            if (!localStorage.menuOne && !localStorage.menuTwo) {
              this.activeIndexMain = res.data[0].id + "";
              this.menuTwo = res.data[0].sonMenu;
              if (res.data[0].sonMenu.length > 0) {
                this.activeIndex = res.data[0].sonMenu[0].route;
                this.$router.push(res.data[0].sonMenu[0].route);
              } else {
                this.activeIndex = res.data[0].id;
              }
            }
          } else {
            this.menuMain = [];
          }
        }
      });
    },
    handleSelect(key, keyPath) {
      // console.log("aaa:",key,keyPath)
      localStorage.menuOne = key;
      this.menuMain.forEach(ielem => {
        if (JSON.stringify(ielem.id) === key) {
          this.menuTwo = ielem.sonMenu;
          if (ielem.sonMenu.length > 0) {
            this.activeIndex = ielem.sonMenu[0].route;
            this.$router.push(ielem.sonMenu[0].route);
          } else {
            this.activeIndex = ielem.id;
          }
        }
      });
    },

    //编辑密码
    editPassWord() {
      this.dialogFormVisibleEdit = true;
      this.userPassword = "";
      this.oldUserPassword = "";
    },
    //确定编辑
    submintPassWord() {
      let self = this;
      if (this.userPassword === "" || this.oldUserPassword === "") {
        this.$message.warning("请输入密码！");
        return;
      }

      if (this.userPassword.length < 6) {
        this.$message.warning("您输入的密码不能小于6位，请重新输入");
        return;
      }

      let params = {
        userPassword: this.userPassword,
        oldUserPassword: this.oldUserPassword
      };
      this.$api.updatePassword(params).then(res => {
        if (res.code == 200) {
          this.$message.success("密码修改成功请重新登录！");
          this.dialogFormVisibleEdit = false;
          setTimeout(function() {
            self.$router.push("/login");
          }, 1000);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //去空
    goEmpty(name) {
      this[name] = this.$tools.goEmpty(this[name]);
    }
  }
};
</script>


<style scoped lang="scss" >
.homeWrap {
  height: 100%;
  .el-menu {
    border-right: 0px;
  }
}
header {
  height: 50px;
  background: rgba(255, 255, 255, 1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  div {
    height: 50px;
    line-height: 50px;
    font-size: 14px;
  }
  .left {
    width: 200px;
    background: #9e0029;
    font-weight: bold;
    color: rgba(255, 255, 255, 1);
    text-align: center;
  }
  .right {
    // display: inline-flex;
    width: calc(100% - 200px);

    .userName {
      margin-right: 32px;
      color: #222426;
      cursor: pointer;
      text-align: right;
    }
    .userNameDiv {
      text-align: right;
      padding-right: 30px;
    }
    .signOut {
      width: 60px;
      text-align: right;
      color: #9e0029;
      font-weight: 400;
      padding-left: 12px;
      border-left: 2px solid #ccc;
      // position: relative;
      cursor: pointer;
      &:after {
        content: "";
        width: 2px;
        height: 16px;
        // background: rgba(233, 236, 245, 1);
        // position: absolute;
        // top: 17px;
        // left: 0px;
      }
    }
  }
}
.container {
  display: flex;
  height: calc(100% - 50px);
}

.section {
  background: #fff;
  margin: 16px 16px 0px 16px;
  // overflow: hidden;
}

.dialogWrapEdit {
  ul {
    li {
      display: flex;
      align-items: center;
      span {
        font-size: 14px;
        font-weight: 400;
        color: rgba(138, 145, 153, 1);
        margin-right: 11px;
        width: 56px;
        text-align: right;
      }
    }

    .firstLi {
      margin-bottom: 40px;
    }
  }
}
.height50 {
  height: 50px;
  line-height: 43px;
}
</style>

