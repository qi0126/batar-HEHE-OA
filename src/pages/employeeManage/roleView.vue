<template>
  <div class="userWrap" v-loading="loadingTF">
    <section class="leftWrap">
      <div class="title">角色列表</div>
      <div class="line"></div>
      <div class="btnWrap" v-if="roleEdit">
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
          v-for="item in RoleList"
          :key="item.roleId"
          @click="selectRole(item)"
          @mouseover="mouseover(item.roleId)"
          @mouseout="mouseout"
          :class="{'active':activeIndex === item.roleId}"
        >
          <span>{{item.roleName}}</span>
          <i
            class="iconfont icon-bianji red_font"
            v-show="mouseRoleId === item.roleId "
            @click.stop="editRole(item)"
            v-if="roleEdit"
          ></i>
          <i
            class="iconfont el-icon-delete red_font"
            v-show="mouseRoleId === item.roleId "
            @click.stop="delRole(item)"
            v-if="roleEdit"
          ></i>
        </li>
        <li v-if="RoleList.length === 0">暂无角色，请点击创建新角色</li>
      </ul>
    </section>
    <section class="rightWrap">
      <div class="title">角色权限设置</div>
      <div class="line"></div>
      <div class="rightOne">
        <el-row>
          <el-col :span="24">
            <el-tree
              :data="authoLists"
              show-checkbox
              ref="tree"
              node-key="menuId"
              :default-checked-keys="checkedCities"
              :props="props"
            ></el-tree>
          </el-col>
        </el-row>

        <!-- <div style="max-height:570px;overflow-y: auto;line-height:30px;">
          <div v-for="(items,index) in authoLists" :key="index">
              <el-checkbox-group v-model="checkedDepart">
                  <el-checkbox :label="items.menuName" :key="items.menuId" @change="handleCheckAllChange(items.menuVoList,items.menuId)" ref="deptId">{{items.menuName}}</el-checkbox>
              </el-checkbox-group>
              <el-checkbox-group v-model="checkedCities">
                  <el-row>
                      <el-col :span="6" v-for="item in items.menuVoList" :key="item.menuId">
                          <el-checkbox :label="item.userId" class="width25"  @change="changeUserFun">{{item.menuName}}</el-checkbox>
                      </el-col>
                  </el-row>
              </el-checkbox-group>
          </div>
        </div>-->
      </div>

      <div class="footBtnWrap" v-show="true" v-if="roleEdit">
        <el-button type="primary" size="small" plain @click="cancelFunOne">取消</el-button>
        <el-button type="primary" size="small" @click="saveFunOne" :loading="btnloading">保存</el-button>
      </div>
    </section>

    <!-- 弹框 -->
    <el-dialog
      width="400px"
      title="新增角色"
      :close-on-click-modal="false"
      :visible.sync="dialogCreateState"
    >
      <section class="dialogWrap">
        <el-row>
          <el-col :span="24">
            <span class="title">角色名称</span>
            <el-input
              v-model="roleName"
              placeholder="请输入角色名称(不能超过20个字)"
              size="small"
              style="width:240px"
              maxlength="20"
              @blur="goEmpty('roleName')"
            ></el-input>
          </el-col>
        </el-row>
      </section>

      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="dialogCreateState = false" plain>取 消</el-button>
        <el-button size="small" type="primary" @click="confirmFun" :loading="btnloading">确认增加</el-button>
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
            v-model="editroleName"
            placeholder="请输入角色名称(不能超过20个字)"
            size="small"
            style="width:240px"
            maxlength="20"
            @blur="goEmpty('editroleName')"
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
      editroleName: "", //编辑角色名称
      roleName: "", //新增目录名称
      RoleSubName: "", //新增子角色名称
      dialogCreateState: false,
      dialogEditState: false,
      mock: "",
      checkedDepart: [],
      RolePowerData: [], //角色权限
      activeIndex: "", //选中下标
      mouseRoleId: "", //鼠标移入角色id
      RoleList: [], //角色列表//角色列表
      //菜单列表
      props: {
        label: "menuName",
        children: "menuVoList"
      },
      addSubRoleTF: false,
      authoLists: [],
      checkedCities: [],
      loadingTF: false,
      roleEdit: false
    };
  },
  created() {
    this.getRoleAll();
    this.selectRoleDataID = [];
    this.getAuth();
  },
  methods: {
    getAuth() {
      let authObj = JSON.parse(sessionStorage.verify);
      this.roleEdit = false;
      authObj.forEach(ielem => {
        if (ielem === "role:edit") {
          this.roleEdit = true;
        }
      });
    },
    createUser() {
      this.dialogCreateState = true;
      this.roleName = "";
    },
    //角色列表
    getRoleAll() {
      this.loadingTF = true;
      let params = {
        page: 1,
        size: 9999
      };
      this.$api.roleAll(params).then(
        res => {
          this.loadingTF = false;
          if (res.code == 200) {
            if (res.data) {
              this.RoleList = res.data.data;
              if (this.RoleList.length > 0) {
                this.selectRole(this.RoleList[0]);
              }
            } else {
              this.RoleList = [];
            }
          } else {
            this.$message.error(res.message);
          }
        },
        err => {
          this.loadingTF = false;
          this.$message.error(res.message);
        }
      );
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
    //新增角色
    confirmFun() {
      let self = this;
      if (this.roleName === "") {
        this.$message.warning("请输入角色名称");
        return;
      }
      let params = {
        roleName: this.roleName
      };
      // console.log("params:",params)
      this.btnloading = true;
      this.$api.addRole(params).then(
        res => {
          if (res.code == 200) {
            self.$message.success("添加角色成功！");
            self.dialogCreateState = false;
            self.btnloading = false;
            self.roleName = "";
            this.getRoleAll();
          }
        },
        err => {
          self.btnloading = false;
          self.roleName = "";
        }
      );
    },
    //选择节点多选事件结束
    changeUserFun() {
      // console.log(this.checkedCities);
      // this.$emit('checkedFn', this.checkedCities);
    },
    //编辑角色
    editRole(item) {
      this.dialogEditState = true;
      this.editroleName = item.roleName;
      this.editRoleItem = item;
    },
    //提交编辑角色
    editConfirmFun() {
      if (this.editroleName === "") {
        this.$message.warning("请输入角色名称");
        return;
      }
      let params = {
        roleId: this.editRoleItem.roleId,
        roleName: this.editroleName
      };
      this.btnloading = true;
      this.$api.editRole(params).then(
        res => {
          if (res.code == 200) {
            this.getRoleAll();
            this.$message.success("修改角色成功,正在刷新页面！");
            this.dialogEditState = false;
            this.btnloading = false;
          } else {
            this.$message.error(res.message);
          }
        },
        err => {
          this.btnloading = false;
        }
      );
    },
    delRole(data) {
      this.$confirm("此操作将永久删除角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            roleId: data.roleId
          };
          this.$api.delRole(params).then(
            res => {
              if (res.code == 200) {
                this.getRoleAll();
                this.$message.success("删除成功，正在刷新页面！");
              } else {
                this.$message.error(res.message);
              }
            },
            err => {
              this.$message.error(res.message);
            }
          );
        })
        .catch(() => {});
    },
    //根据RoleId查询角色
    getRole(RoleId) {
      this.selectRoleDataID = [];
      let params = {
        menuId: 0,
        roleId: RoleId
      };
      this.$api.fidnRoleAuth(params).then(
        res => {
          if (res.code == 200) {
            this.authoLists = res.data;
            // this.authoLists.forEach(ielem => {
            //   ielem.itemCheckAll = false;
            // });
            // this.checkedCities = res.data.roleMenus;
            let ids = this.filterId(res.data);
            this.checkedCities = ids;
          } else {
            this.$message.error(res.message);
          }
        },
        err => {
          this.$message.error(res.message);
        }
      );
    },
    //选择节点多选事件开始
    handleCheckAllChange(allData, subElem) {
      var self = this;
      setTimeout(function() {
        self.$refs.deptId.forEach((elem, index) => {
          if (elem.$vnode.data.key == subElem) {
            if (elem.isChecked) {
              allData.forEach(smElem => {
                if (smElem.editTF != true) {
                  self.checkedCities.push(smElem.userId);
                }
              });
              self.checkedCities = self.$tools.listUnique(self.checkedCities);
            } else {
              var newList = self.checkedCities;
              allData.forEach(smElem => {
                newList.forEach((sbElem, sbind) => {
                  if (sbElem == smElem.userId) {
                    newList.splice(sbind, 1);
                  }
                });
              });
            }
          }
        });
      }, 100);
    },
    //全选此菜单权限
    handleCheckedCitiesChange() {},
    //选择角色权限
    selectionRoleFun() {
      this.saveType = true;
    },
    //取消更改
    cancelFun() {
      this.saveType = false;
    },
    //保存更改
    saveFun() {
      let params = {
        RoleId: this.editRoleItem.RoleId,
        roleName: this.editRoleItem.roleName,
        permsIds: this.selectRoleDataID
      };
      this.btnloading = true;
      this.$api.updateRole(params).then(
        res => {
          if (res.code == 200) {
            this.$message.success(res.msg);
            this.saveType = false;
            this.btnloading = false;
          }
        },
        err => {
          this.btnloading = true;
        }
      );
    },
    //取消角色权限方法
    cancelFunOne() {
      this.getRole(this.activeIndex);
    },
    //保存角色权限方法
    saveFunOne() {
      let parentIds = [];
      let ids = this.$refs.tree.getCheckedKeys();
      if (ids.length === 0) {
        this.$message.warning("角色权限不能为空，请重新选择！");
        return;
      }

      let arr = [],
        newMens = [];
      for (let key in ids) {
        arr[key] = this.findParentId(this.authoLists, ids[key]);
      }
      console.log("数组123", arr);
      newMens = [...new Set(arr.flat(Infinity))];

      let params = {
        roleId: this.activeIndex,
        menus: newMens
      };

      console.log("提交", params);

      // return;
      this.$api.updateRoleMenu(params).then(
        res => {
          if (res.code == 200) {
            this.getRole(this.activeIndex);
            this.$message.success("角色权限修改成功！");
          } else {
            this.$message.error(res.message);
          }
        },
        err => {
          this.$message.error(res.message);
        }
      );
    },
    //过滤数据获取选中id
    filterId(elem) {
      let self = this;
      let ids = [];
      elem.forEach(item => {
        if (item.menuVoList.length === 0 && item.checked === 1) {
          ids.push(item.menuId);
        } else if (item.menuVoList.length > 0) {
          ids = ids.concat(self.filterId(item.menuVoList));
        }
      });
      return ids;
    },
    //查找出父级id
    findParentId(elem, id) {
      let self = this;
      let ids = [];
      elem.forEach((item, index) => {
        if (item.menuId == id) {
          ids.push(item.menuId);
        }
        if (item.menuVoList[0]) {
          item.menuVoList.forEach((it, ix) => {
            if (it.menuId == id) {
              ids.push(item.menuId, it.menuId);
            }
            if (it.menuVoList[0]) {
              it.menuVoList.forEach((iit, iix) => {
                if (iit.menuId == id) {
                  ids.push(item.menuId, it.menuId, iit.menuId);
                }
                if (iit.menuVoList[0]) {
                  iit.menuVoList.forEach((iiit, iiix) => {
                    if (iiit.menuId == id) {
                      ids.push(item.menuId, it.menuId, iit.menuId, iiit.menuId);
                      // ids.push(index, ix, iix, iiix);
                    }
                  });
                }
              });
            }
          });
        }
      });
      // console.log("结果", ids);
      return ids;
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
    .rightOne {
      padding: 0 20px;
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
  .width25 {
    width: 18%;
    padding-left: 15px;
  }
}
</style>

