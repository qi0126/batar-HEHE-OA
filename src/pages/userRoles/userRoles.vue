<template>
  <div class="userWrap">
    <section class="leftWrap">
      <div class="title">角色列表</div>
      <div class="line"></div>
      <div class="btnWrap">
        <el-button
          plain
          icon="el-icon-circle-plus-outline"
          size="small"
          style="width:208px"
          @click="createUser"
        >创建新角色</el-button>
      </div>
      <ul>
        <li
          v-for="item in rolesList"
          :key="item.roleId"
          @click="selectRole(item)"
          @mouseover="mouseover(item.roleId)"
          @mouseout="mouseout"
          :class="{'active':activeIndex === item.roleId}"
        >
          <span>{{item.roleName}}</span>
          <i
            class="iconfont icon-bianji red_font"
            v-show="mouseRoleId === item.roleId && $tools.controlPower(33)"
            @click.stop="editRole(item)"
          ></i>
        </li>
      </ul>
    </section>
    <section class="rightWrap">
      <div class="title">角色权限设置</div>
      <div class="line"></div>
      <ul>
        <li>
          <div>
            <el-checkbox-group v-model="selectRoleDataID" @change="selectionRoleFun">
              <el-row>
                <el-col
                  :span="6"
                  style="margin-bottom: 20px;"
                  v-for="item in rolePowerData"
                  :key="item.permsId"
                >
                  <el-checkbox :label="item.permsId" :key="item.permsId">{{item.permsName}}</el-checkbox>
                </el-col>
                <!-- <el-col :span="6" style="margin-bottom: 20px;" v-for="ite in 100">
                  <el-checkbox>公告查看</el-checkbox>
                </el-col>-->
              </el-row>

              <!-- <el-checkbox>公告查看</el-checkbox> -->
            </el-checkbox-group>
          </div>
        </li>
      </ul>

      <div class="footBtnWrap" v-show="saveType && $tools.controlPower(33)">
        <el-button type="primary" size="small" plain @click="cancelFun">取消</el-button>
        <el-button type="primary" size="small" @click="saveFun" :loading="btnloading">保存</el-button>
      </div>
    </section>
    
    <!-- 弹框 -->
    <el-dialog
      width="480px"
      title="新增角色"
      :close-on-click-modal="false"
      :visible.sync="dialogCreateState"
    >
      <section class="dialogWrap">
        <div class="content">
          <span class="title">角色名称</span>
          <el-input
            v-model="roleName"
            placeholder="请输入角色名称"
            size="small"
            style="width:240px"
            @blur="goEmpty('roleName')"
          ></el-input>
        </div>
      </section>

      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="dialogCreateState = false" plain>取 消</el-button>
        <el-button size="small" type="primary" @click="confirmFun" :loading="btnloading">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      width="480px"
      title="编辑角色"
      :close-on-click-modal="false"
      :visible.sync="dialogEditState"
    >
      <section class="dialogWrap">
        <div class="content">
          <span class="title">角色名称</span>
          <el-input
            v-model="editRoleName"
            placeholder="请输入角色名称"
            size="small"
            style="width:240px"
            @blur="goEmpty('editRoleName')"
          ></el-input>
        </div>
      </section>

      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="dialogEditState = false" plain>取 消</el-button>
        <el-button size="small" type="primary" @click="editConfirmFun" :loading="btnloading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      btnloading: false,
      saveType: false, // 底部状态
      selectRoleDataID: [], //选中角色数据ID
      editRoleItem: {}, //需要编辑角色
      editRoleName: "", //编辑角色名称
      roleName: "", //新增角色名称
      dialogCreateState: false,
      dialogEditState: false,
      mock: "",
      rolePowerData: [], //角色权限
      activeIndex: "", //选中下标
      mouseRoleId: "", //鼠标移入角色id
      rolesList:[
          {
              "roleId":2,
              "roleName":"科技院院长",
              "remark":null,
              "createTime":"2019-11-21 10:15:48",
              "modifyTime":"2019-11-26 17:24:50"
          },
          {
              "roleId":3,
              "roleName":"博士生导师",
              "remark":null,
              "createTime":"2019-11-21 10:17:40",
              "modifyTime":"2019-11-21 10:17:56"
          },
          {
              "roleId":4,
              "roleName":"字段是阿萨德",
              "remark":null,
              "createTime":"2019-11-21 13:34:46",
              "modifyTime":"2019-11-22 10:42:41"
          },
          {
              "roleId":5,
              "roleName":"监考员",
              "remark":null,
              "createTime":"2019-11-22 09:30:35",
              "modifyTime":"2019-11-22 10:38:16"
          },
          {
              "roleId":6,
              "roleName":"阿达地方",
              "remark":null,
              "createTime":"2019-11-22 10:42:19",
              "modifyTime":"2019-11-23 16:37:02"
          },
          {
              "roleId":7,
              "roleName":"权限测试",
              "remark":null,
              "createTime":"2019-11-23 16:37:31",
              "modifyTime":"2019-11-25 09:16:36"
          },
          {
              "roleId":8,
              "roleName":"IT男",
              "remark":null,
              "createTime":"2019-11-25 09:27:18",
              "modifyTime":"2019-11-25 10:16:20"
          },
          {
              "roleId":9,
              "roleName":"伯成测权限",
              "remark":null,
              "createTime":"2019-11-25 16:54:10",
              "modifyTime":"2019-11-26 17:14:55"
          }
      ] //角色列表
    };
  },
  created() {
    // this.roleListPage();
    this.selectRoleDataID = [];
  },
  methods: {
    createUser() {
      this.dialogCreateState = true;
      this.roleName = "";
    },
    //角色列表
    roleListPage(state = "initial") {
      let params = {
        pageNum: 1,
        pageSize: 10000
      };
      this.$api.roleListPage(params).then(res => {
        if (res.code == 200) {
          this.rolesList = res.data.pageInfo.list;
          if (state === "initial") {
            //初始
            this.activeIndex = this.rolesList[0].roleId;
            this.editRoleItem = this.rolesList[0];
            this.getRole(this.activeIndex);
          } else if (state === "create") {
            //新增
            let len = this.rolesList.length - 1;
            this.activeIndex = this.rolesList[len].roleId;
            this.editRoleItem = this.rolesList[len];
            this.getRole(this.activeIndex);
          } else if (state === "edit") {
            //编辑
            this.activeIndex = this.editRoleItem.roleId;
            // this.editRoleItem = this.rolesList[0];
            this.rolesList.forEach(item => {
              if (item.roleId === this.editRoleItem.roleId) {
                this.editRoleItem.roleName = item.roleName;
              }
            });
            this.getRole(this.activeIndex);
          }
        }
      });
    },
    //鼠标移入
    mouseover(id) {
      this.mouseRoleId = id;
    },
    //鼠标移出
    mouseout() {
      this.mouseRoleId = "";
    },
    //选择角色
    selectRole(item) {
      this.activeIndex = item.roleId;
      this.editRoleItem = item;
      this.getRole(item.roleId);
    },
    //去空
    goEmpty(name) {
      this[name] = this.$tools.goEmpty(this[name]);
    },
    //新增确认
    confirmFun() {
      if (this.roleName === "") {
        this.$message.warning("请输入角色名称");
        return;
      }
      let params = {
        roleName: this.roleName
      };

      this.btnloading = true;
      this.$api.addRole(params).then(
        res => {
          if (res.code == 200) {
            this.$message.success(res.msg);
            this.dialogCreateState = false;
            this.btnloading = false;
            this.roleListPage("create");
          }
        },
        err => {
          this.btnloading = false;
        }
      );
    },
    //编辑角色
    editRole(item) {
      this.dialogEditState = true;
      this.editRoleName = item.roleName;
      this.editRoleItem = item;
    },
    //提交编辑角色
    editConfirmFun() {
      if (this.editRoleName === "") {
        this.$message.warning("请输入角色名称");
        return;
      }
      let params = {
        roleId: this.editRoleItem.roleId,
        roleName: this.editRoleName
      };
      this.btnloading = true;
      this.$api.updateRole(params).then(
        res => {
          if (res.code == 200) {
            this.$message.success(res.msg);
            this.dialogEditState = false;
            this.btnloading = false;
            this.roleListPage("edit");
          }
        },
        err => {
          this.btnloading = false;
        }
      );
    },
    //根据roleId查询角色
    getRole(roleId) {
      this.selectRoleDataID = [];
      let params = {
        roleId
      };
      this.$api.getRole(params).then(res => {
        if (res.code == 200) {
          this.rolePowerData = res.data.permsListByRole;
          this.rolePowerData.forEach(item => {
            if (item.checked === 1) {
              this.selectRoleDataID.push(item.permsId);
            }
          });
        }
      });
    },
    //选择角色权限
    selectionRoleFun() {
      this.saveType = true;
    },
    //取消更改
    cancelFun() {
      this.saveType = false;
      this.roleListPage("edit");
    },
    //保存更改
    saveFun() {
      let params = {
        roleId: this.editRoleItem.roleId,
        roleName: this.editRoleItem.roleName,
        permsIds: this.selectRoleDataID
      };
      this.btnloading = true;
      this.$api.updateRole(params).then(
        res => {
          if (res.code == 200) {
            this.$message.success(res.msg);
            // this.dialogEditState = false;
            this.roleListPage("edit");
            this.saveType = false;
            this.btnloading = false;
          }
        },
        err => {
          this.btnloading = true;
        }
      );
    }
  }
};
</script>


<style scoped lang="scss" >
.red_font {
  color: #9e0029;
}
.userWrap {
  // background: red;
  // margin-left:-20px;
  // margin-top: -20px;
  // width: 100%;
  height: 100%;
  position: relative;
  .title {
    font-size: 14px;
    font-weight: bold;
    color: rgba(46, 48, 51, 1);
    padding: 0px 16px;
  }
  .line {
    width: 100%;
    border-top: 1px solid rgba(218, 221, 229, 1);
    margin-top: 15px;
    margin-bottom: 8px;
  }
  .leftWrap {
    box-sizing: border-box;
    padding: 15px 0px;
    width: 240px;
    position: absolute;
    top: -20px;
    left: -20px;
    height: 106%;
    border-right: 16px solid rgb(244, 244, 244);
    .btnWrap {
      text-align: center;
      margin-bottom: 8px;
    }
    ul {
      // overflow-y: scroll;
      height: 85%;
      li {
        // background: red;
        cursor: pointer;
        font-size: 14px;
        padding: 0px 16px;
        height: 40px;
        border: 1px solid #fff;
        display: flex;
        align-items: center;
        display: flex;
        justify-content: space-between;
        &:hover {
          background: rgb(246, 233, 236);
          color: #9e0029;
        }
      }
      .active {
        background: rgb(246, 233, 236);
        color: #9e0029;
      }
    }
  }
  .rightWrap {
    padding: 15px 0px;
    width: 88%;
    position: absolute;
    top: -20px;
    left: 220px;
    height: 102%;

    ul {
      padding-left: 28px;
      padding-top: 24px;
      height: 95%;
      li {
        height: 89%;
        // overflow-y: scroll;
      }
    }
  }

  .dialogWrap {
    .title {
      font-size: 14px;
      font-weight: 400;
      color: rgba(138, 145, 153, 1);
    }
  }

  .footBtnWrap {
    position: absolute;
    left: 0px;
    bottom: 7px;
    height: 50px;
    width: 100%;
    // background: green;
    box-shadow: 6px -6px 10px rgba(0, 0, 0, 0.1);
    text-align: right;
    padding-top: 10px;
    box-sizing: border-box;
    padding-right: 60px;
  }
}
</style>

