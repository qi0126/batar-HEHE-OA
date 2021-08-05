<template>
  <div class="userWrap" v-loading="loadingTF">
    <section class="leftWrap">
      <div class="title">菜单列表</div>
      <div class="line"></div>
      <div class="btnWrap">
        <el-button
          plain
          icon="el-icon-circle-plus-outline"
          size="small"
          style="width:208px"
          @click="createUser"
        >创建新菜单</el-button>
      </div>
      <el-tree
        :data="menuList"
        :show-checkbox="false"
        node-key="id"
        :props="props"
        accordion
        @node-click="selectmenu"
        :expand-on-click-node="false"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            <el-button type="text" size="mini" @click="() => append(data)">
              <i class="el-icon-circle-plus-outline"></i>
            </el-button>
            <el-button type="text" size="mini" @click="() => remove(node, data)">
              <i class="el-icon-delete"></i>
            </el-button>
          </span>
        </span>
      </el-tree>
    </section>
    <section class="rightWrap">
      <div class="title">菜单功能查看</div>
      <div class="line"></div>
      <el-table :data="funList" style="width: 100%">
        <el-table-column prop="name" label="菜单名称"></el-table-column>
        <el-table-column prop="type" label="类型">
          <template slot-scope="scope">
            <span v-if="scope.row.type == 0">目录</span>
            <span v-else-if="scope.row.type == 1">菜单</span>
            <span v-else-if="scope.row.type == 2">功能</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="details" width="260" label="菜单功能说明"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="route" label="路由地址"></el-table-column>
        <el-table-column prop="updateTime" label="修改时间"></el-table-column>
        <el-table-column prop="status" label="状态启用">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0" class="txtRed">已禁用</span>
            <span v-if="scope.row.status === 1">启用</span>
          </template>
        </el-table-column>
        <el-table-column label="编辑">
          <template slot-scope="scope">
            <span class="txtYellow" @click="editItem(scope.row)">编辑</span>
            <span class="txtRed" @click="delItem(scope.row)">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </section>

    <!-- 弹框 -->
    <el-dialog
      width="400px"
      title="新增主目录"
      :close-on-click-modal="false"
      :visible.sync="dialogCreateState"
    >
      <section class="dialogWrap">
        <el-row>
          <el-col :span="24">
            <span class="title">主目录名称</span>
            <el-input
              v-model="menuName"
              placeholder="请输入主目录名称"
              size="small"
              style="width:240px"
              @blur="goEmpty('menuName')"
            ></el-input>
          </el-col>
        </el-row>
      </section>

      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="dialogCreateState = false" plain>取 消</el-button>
        <el-button size="small" type="primary" @click="confirmFun" :loading="btnloading">确认增加</el-button>
      </div>
    </el-dialog>
    <!-- 弹框 -->
    <el-dialog
      width="1000px"
      title="新增子菜单"
      :close-on-click-modal="false"
      :visible.sync="addSubMenuTF"
    >
      <section class="dialogWrap">
        <el-row style="line-height:70px;">
          <el-col :span="8">
            <span class="title">子菜单名称</span>
            <el-input
              v-model="menuSubName"
              placeholder="请输入子菜单名称"
              size="small"
              style="width:180px"
              @blur="goEmpty('menuSubName')"
            ></el-input>
          </el-col>
          <el-col :span="8">
            <span class="title">子菜单状态</span>
            <el-select
              v-model="typeTxt"
              placeholder="请选择"
              style="width:180px"
              size="small"
              @change="selectTypeFun"
            >
              <el-option
                v-for="item in addMenuList"
                :key="item.value"
                :label="item.txt"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="8" v-show="typeTxt !== 2">
            <span class="title">子菜单路由</span>
            <el-input
              v-model="routerTxt"
              placeholder="请输入子菜单路由"
              size="small"
              style="width:180px"
              @blur="goEmpty('routerTxt')"
            ></el-input>
          </el-col>
          <el-col :span="8">
            <span class="title">功能说明</span>
            <el-input
              v-model="detailsTxt"
              placeholder="请输入子菜单名称"
              size="small"
              style="width:194px"
              maxlength="30"
              show-word-limit
            ></el-input>
          </el-col>
          <el-col :span="8">
            <span class="title">启用状态</span>
            <el-select v-model="statusTxt" placeholder="请选择" style="width:180px" size="small">
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.txt"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <span class="title">权限标识</span>
            <el-input
              v-model="auth"
              placeholder="请输入权限标识"
              size="small"
              style="width:180px"
              @blur="goEmpty('auth')"
            ></el-input>
          </el-col>
        </el-row>
      </section>

      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="addSubMenuTF = false" plain>取 消</el-button>
        <el-button size="small" type="primary" @click="addSubMenuFun" :loading="btnloading">确认增加</el-button>
      </div>
    </el-dialog>

    <el-dialog
      width="1000px"
      title="编辑菜单"
      :close-on-click-modal="false"
      :visible.sync="editSubMenuTF"
    >
      <section class="dialogWrap">
        <el-row style="line-height:70px;">
          <el-col :span="8">
            <span class="title">子菜单名称</span>
            <el-input
              v-model="selectData.name"
              placeholder="请输入子菜单名称"
              size="small"
              style="width:180px"
            ></el-input>
          </el-col>
          <el-col :span="8">
            <span class="title">子菜单状态</span>
            <el-select
              v-model="selectData.type"
              placeholder="请选择"
              style="width:180px"
              size="small"
              @change="editSelectTypeFun"
            >
              <el-option
                v-for="item in addMenuList"
                :key="item.value"
                :label="item.txt"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="8" v-show="selectData.type !== 2">
            <span class="title">子菜单路由</span>
            <el-input
              v-model="selectData.route"
              placeholder="请输入子菜单路由"
              size="small"
              style="width:180px"
            ></el-input>
          </el-col>
          <el-col :span="8">
            <span class="title">功能说明</span>
            <el-input
              v-model="selectData.details"
              placeholder="请输入子菜单名称"
              size="small"
              style="width:194px"
              maxlength="30"
              show-word-limit
            ></el-input>
          </el-col>
          <el-col :span="8">
            <span class="title">启用状态</span>
            <el-select
              v-model="selectData.status"
              placeholder="请选择"
              style="width:180px"
              size="small"
            >
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.txt"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <span class="title">权限标识</span>
            <el-input
              v-model="selectData.auth"
              placeholder="请输入权限标识"
              size="small"
              style="width:180px"
              @blur="goEmpty('auth')"
            ></el-input>
          </el-col>
        </el-row>
      </section>

      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="editSubMenuTF = false" plain>取 消</el-button>
        <el-button size="small" type="primary" @click="editConfirmFun" :loading="btnloading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      auth: "", //权限标识
      btnloading: false,
      saveType: false, // 底部状态
      editmenuItem: {}, //需要编辑菜单
      editmenuName: "", //编辑菜单名称
      menuName: "", //新增目录名称
      menuSubName: "", //新增子菜单名称
      dialogCreateState: false,
      editSubMenuTF: false,
      mock: "",
      menuPowerData: [], //菜单权限
      activeIndex: "", //选中下标
      mousemenuId: "", //鼠标移入菜单id
      menuList: [], //菜单列表
      //菜单列表
      props: {
        label: "name",
        children: "sonMenu"
      },
      addSubMenuTF: false,
      selectData: {}, //选中菜单
      typeTxt: 2,
      addMenuList: [
        // { txt: "主菜单", value: 0 },
        { txt: "子菜单", value: 1 },
        { txt: "功能", value: 2 }
      ],
      statusTxt: 1,
      statusList: [{ txt: "已禁用", value: 0 }, { txt: "启用", value: 1 }],
      detailsTxt: "", //功能说明
      funList: [], //功能
      routerTxt: "", //路由
      loadingTF: false
    };
  },
  created() {
    this.getMenuAll();
  },
  methods: {
    createUser() {
      this.dialogCreateState = true;
      this.menuName = "";
    },
    //菜单列表
    getMenuAll() {
      this.loadingTF = true;
      this.$api.getMenuAll().then(res => {
        this.loadingTF = false;
        if (res.code == 200) {
          if (res.data) {
            this.menuList = res.data;
            if (this.menuList.length > 0) {
              this.selectmenu(this.menuList[0]);
            }
          } else {
            this.menuList = [];
          }
        }
      });
    },
    //选择菜单
    selectmenu(item) {
      this.funList = item.sonMenu;
      // let params = {
      //   id: item.id
      // };
      // this.$api.viewIdMenu(params).then(
      //   res => {
      //     if (res.code == 200) {
      //       this.funList = res.data;
      //       // this.getMenuAll();
      //       // this.selectmenuDataID = [];
      //       // this.$message.success("删除成功，正在刷新页面！")
      //     }else{
      //       this.$message.error(res.message)
      //     }
      //   },
      //   err => {
      //     this.$message.error(res.message)
      //   }
      // );
    },
    //去空
    goEmpty(name) {
      this[name] = this.$tools.goEmpty(this[name]);
    },
    //新增主目录
    confirmFun() {
      let self = this;
      if (this.menuName === "") {
        this.$message.warning("请输入菜单名称");
        return;
      }
      let params = {
        name: this.menuName,
        type: 0,
        parentId: 0,
        status: 1
      };
      // console.log("params:",params)
      this.btnloading = true;
      this.$api.addOrEditMenu(params).then(
        res => {
          if (res.code == 200) {
            self.$message.success("添加目录成功！");
            self.dialogCreateState = false;
            self.btnloading = false;
            self.menuName = "";
            this.getMenuAll();
          } else {
            this.$message.error(res.message);
          }
        },
        err => {
          this.$message.error(res.message);
          self.btnloading = false;
          self.menuName = "";
        }
      );
    },
    //新增菜单
    addSubMenuFun() {
      if (this.menuSubName === "") {
        this.$message.warning("请输入菜单名称");
        return;
      }
      let params = {
        name: this.menuSubName,
        type: this.typeTxt,
        parentId: this.selectData.id,
        route: this.routerTxt,
        status: this.statusTxt,
        auth: this.auth
      };
      this.btnloading = true;
      this.$api.addOrEditMenu(params).then(
        res => {
          if (res.code == 200) {
            this.getMenuAll();
            this.$message.success(res.message);
            this.btnloading = false;
            this.addSubMenuTF = false;
            (this.menuSubName = ""), (this.routerTxt = "");
          } else {
            this.btnloading = false;
            this.$message.error(res.message);
          }
        },
        err => {
          this.$message.error(res.message);
          this.menuSubName = "";
          this.routerTxt = "";
          this.btnloading = false;
        }
      );
    },
    //编辑菜单
    editmenu(item) {
      this.editSubMenuTF = true;
      this.editmenuName = item.menuName;
      this.editmenuItem = item;
    },
    //提交编辑菜单
    editConfirmFun() {
      if (this.selectData.name === "") {
        this.$message.warning("请输入菜单名称");
        return;
      }
      // let params = this.selectData;
      console.log(this.selectData);
      let params = {
        id: this.selectData.id ? this.selectData.id : "",
        name: this.selectData.name ? this.selectData.name : "",
        type: this.selectData.type ? this.selectData.type : "",
        parentId: this.selectData.parentId ? this.selectData.parentId : "",
        route: this.selectData.route ? this.selectData.route : "",
        status: this.selectData.status,
        details: this.selectData.details ? this.selectData.details : "",
        auth: this.selectData.auth ? this.selectData.auth : ""
      };
      this.btnloading = true;
      this.$api.addOrEditMenu(params).then(
        res => {
          if (res.code == 200) {
            this.getMenuAll();
            this.$message.success("修改成功，正在刷新页面！");
            this.editSubMenuTF = false;
            this.btnloading = false;
            // this.menuListPage("edit");
          } else {
            this.btnloading = false;
            this.$message.error(res.message);
          }
        },
        err => {
          this.$message.error(res.message);
          this.btnloading = false;
        }
      );
    },
    //选择菜单权限
    selectionmenuFun() {
      this.saveType = true;
    },
    //取消更改
    cancelFun() {
      this.saveType = false;
      this.menuListPage("edit");
    },
    //删除菜单
    remove(node, data) {
      this.$confirm("此操作将永久删除菜单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            menuId: data.id
          };
          this.$api.delMenu(params).then(
            res => {
              if (res.code == 200) {
                this.getMenuAll();
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
    delItem(data) {
      this.$confirm("此操作将永久删除菜单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            menuId: data.id
          };
          this.$api.delMenu(params).then(
            res => {
              if (res.code == 200) {
                this.getMenuAll();
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
    //添加菜单
    append(data) {
      this.selectData = data;
      this.menuSubName = "";
      this.addSubMenuTF = true;
    },
    //编辑菜单
    editItem(data) {
      // console.log('data:',data)
      this.selectData = data;
      this.editSubMenuTF = true;
    },
    //选择状态
    selectTypeFun() {
      this.routerTxt = "";
    },
    //编辑状态
    editSelectTypeFun() {
      this.selectData.route;
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
    width: 400px;
    position: absolute;
    top: -20px;
    left: -20px;
    min-height: 880px;
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
    width: 75%;
    position: absolute;
    top: -20px;
    left: 380px;
    min-height: 880px;

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

