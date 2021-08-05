<template>
  <div class="userWrap" v-loading="loadingList">
    <div>
      <el-row>
        <el-col :span="6">
          <el-button type="primary" size="small" @click="newItem">新增</el-button>
        </el-col>
        <el-col :span="18">
          <div class="topMenuRight">
            <span class="titleTip">状态</span>
            <el-select v-model="expired" placeholder="请选择" size="small" @change="searchFun">
              <el-option
                v-for="item in expiredData"
                :key="item.value"
                :label="item.txt"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-input
              class="width280"
              v-model="keyWord"
              placeholder="访问路径/资源名称/资源说明/所需权限点"
              size="small"
              @keyup.enter.native="searchFun"
            >
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-table
      :data="systemData"
      stripe
      height="700"
      :summary-method="getSummaries"
      style="width: 100%; margin-top: 20px"
      v-if="systemData.length > 0"
    >
      <el-table-column prop="name" header-align="center" align="center" label="资源名称"></el-table-column>
      <el-table-column prop="url" label="路径" header-align="center" align="center"></el-table-column>
      <el-table-column prop="authValue" label="所需权限" header-align="center" align="center"></el-table-column>
      <el-table-column prop="createId" label="创建人" header-align="center" align="center"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" header-align="center" align="center"></el-table-column>
      <!-- <el-table-column prop="parentId" label="父级ID" header-align="center" align="center"></el-table-column> -->
      <el-table-column prop="updateTime" label="修改时间" header-align="center" align="center"></el-table-column>
      <el-table-column prop="status" label="启用状态" header-align="center" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status==='0'">启用</span>
          <span class="txtYellow" v-if="scope.row.status==='1'">已禁用</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" header-align="center" align="center">
        <template slot-scope="scope">
          <span class="txtYellow" @click.stop="editFun(scope.row)">编辑</span>
          <span class="txtRed" @click.stop="delFun(scope.row)">删除</span>
        </template>
      </el-table-column>
    </el-table>

    <NoDataPage v-else></NoDataPage>

    <div class="pageD" v-if="systemData.length > 0">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[12, 30, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="priceSum"
        background
      ></el-pagination>
    </div>

    <!-- 新增资源 -->
    <el-dialog
      title="新增资源"
      :visible.sync="newTemplateType"
      width="720px"
      :close-on-click-modal="false"
    >
      <div class="newTemplateStyle">
        <div class="line"></div>
        <el-row>
          <el-col :span="12" class="item">
            <span>资源名称</span>
            <el-input
              v-model="resourceName"
              placeholder="请填写编码类型的值"
              size="small"
              class="inputWidth"
            ></el-input>
            <span class="red_font">*</span>
          </el-col>
          <el-col :span="12" class="item">
            <span style="margin-left: 26px;">所需权限</span>
            <el-input v-model="authValue" placeholder="请填写所需权限" size="small" class="inputWidth"></el-input>
            <!-- <el-select
                v-model="authValue"
                filterable
                placeholder="请选择权限值"
                size="small"
                class="selectWidth"
              >
                <el-option
                  v-for="item in needPowerData"
                  :key="item.authId"
                  :label="item.authName"
                  :value="item.authValue"
                ></el-option>
            </el-select>-->
            <span class="red_font">*</span>
          </el-col>
          <el-col :span="24">
            <span>访问路径</span>
            <el-input
              v-model="resourcePath"
              placeholder="请填写访问路径"
              size="small"
              class="inputWidth566"
            ></el-input>
            <span class="red_font">*</span>
          </el-col>
          <el-col :span="24" style="display:flex;">
            <!-- <span class>资源说明</span>
              <el-input
                v-model="resourceDesc"
                type="textarea"
                :rows="2"
                class="inputWidth566"
                placeholder="请对系统资源进行说明（100字以内）">
            </el-input>-->
            <span class>启用状态</span>
            <el-select
              v-model="statusTF"
              filterable
              placeholder="请选择权限值"
              size="small"
              class="selectWidth"
            >
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.txt"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
        </el-row>
      </div>
      <div class="layer"></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="newTemplateType = false" size="small">取 消</el-button>
        <el-button type="primary" @click="saveCreat" size="small">保 存</el-button>
      </span>
    </el-dialog>
    <!-- 编辑资源 -->
    <el-dialog
      title="编辑资源"
      :visible.sync="editTemplateType"
      width="720px"
      :close-on-click-modal="false"
    >
      <div class="newTemplateStyle">
        <div class="line"></div>
        <el-row>
          <el-col :span="12" class="item">
            <span class>资源名称</span>
            <el-input
              v-model="editResourceName"
              placeholder="请填写编码类型的值"
              size="small"
              class="inputWidth"
            ></el-input>
            <span class="red_font">*</span>
          </el-col>
          <el-col :span="12" class="item">
            <span style="margin-left: 26px;">所需权限</span>
            <el-input v-model="editAuthValue" placeholder="请填写所需权限" size="small" class="inputWidth"></el-input>
            <!-- <el-select
                v-model="editAuthValue"
                filterable
                placeholder="请选择权限值"
                size="small"
                class="selectWidth"
              >
                <el-option
                  v-for="item in needPowerData"
                  :key="item.authId"
                  :label="item.authName"
                  :value="item.authValue"
                ></el-option>
            </el-select>-->
            <span class="red_font">*</span>
          </el-col>
          <el-col :span="24">
            <span>访问路径</span>
            <el-input
              v-model="editResourcePath"
              placeholder="请填写访问路径"
              size="small"
              class="inputWidth566"
            ></el-input>
            <span class="red_font">*</span>
          </el-col>
          <el-col :span="24" style="display:flex;">
            <span class>启用状态</span>
            <el-select
              v-model="statusTF"
              filterable
              placeholder="请选择权限值"
              size="small"
              class="selectWidth"
            >
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.txt"
                :value="item.value"
              ></el-option>
            </el-select>
            <!-- <span>资源说明</span>
              <el-input
                v-model="editResourceDesc"
                type="textarea"
                :rows="2"
                class="inputWidth566"
                placeholder="请对系统资源进行说明（100字以内）">
            </el-input>-->
          </el-col>
        </el-row>
      </div>
      <div class="layer"></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editTemplateType = false" size="small">取 消</el-button>
        <el-button type="primary" @click="saveEdit" size="small">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loadingList: false,
      editResourceName: "", //资源名称
      editResourcePath: "", //访问路径
      editResourceDesc: "", //资源说明
      editAuthValue: "", //编辑所需权限值
      editData: [], //编辑数据
      resourceName: "", //资源名称
      authValue: "", //所需权限
      resourcePath: "", //访问路径
      resourceDesc: "", //资源说明
      needPowerData: [], //所需权限数据
      input: "", //模拟
      keyWord: "", //关键字搜索
      editImgUrl: "", //编辑图片路径
      pcode: "", //数据回填一级品目和一级系列
      logoImg: "", //新增系列图片
      expiredData: [
        { txt: "全部", value: "" },
        { txt: "启用", value: "0" },
        { txt: "已禁用", value: "1" }
      ], //状态
      expired: "全部", //状态值
      codeFilterData: "", // 编码筛选条件数据
      options: [],
      systemData: [], //系统资源数据
      newTemplateType: false, //新增编码管理弹出框状态
      editTemplateType: false, // 编辑编码管理弹出框状态
      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示条目个数
      priceSum: 0, //总条目数
      statusTF: 0,
      statusList: [{ txt: "启用", value: 0 }, { txt: "已禁用", value: 1 }]
    };
  },
  created() {
    this.displayAllData(1, 12);
  },
  methods: {
    displayAllData(num, size) {
      var self = this;
      this.pageNum = num;
      this.pageSize = size;
      let params = {
        page: num,
        size: size,
        status: self.expired != "全部" ? self.expired : "",
        search: self.keyWord
      };
      this.loadingList = true;
      this.$api.authAll(params).then(
        res => {
          if (res.code == 200) {
            self.systemData = res.data.data;
            self.priceSum = res.data.count;
          }
        },
        err => {}
      );
      this.loadingList = false;
    },
    // 获取编码筛选
    getCodeFilterData() {
      var self = this;
      this.$axios.post(this.$portMain + "/code/sys").then(function(res) {
        if (res.data.code == 200) {
          self.codeFilterData = res.data.data;
        }
      });
    },
    // 新增保存
    saveCreat() {
      let self = this;
      let params = {
        name: this.resourceName,
        authValue: this.authValue,
        url: this.resourcePath,
        // resourceDesc: this.resourceDesc,
        status: this.statusTF
      };
      this.$api.addAuthUrl(params).then(
        res => {
          if (res.code == 200) {
            this.displayAllData(1, 12);
            this.newTemplateType = false;
            this.resourceName = "";
            this.authValue = "";
            this.resourcePath = "";
            // this.resourceDesc = ""
            this.statusTF = 0;
            this.$message.success("新增资源成功，正在刷新页面！");
          } else {
            this.$message.error(res.message);
          }
        },
        err => {
          this.$message.error(res.message);
        }
      );
    },
    // 编辑保存
    saveEdit() {
      let self = this;
      let params = {
        authId: this.editData.authId,
        name: this.editResourceName,
        authValue: this.editAuthValue,
        url: this.editResourcePath,
        resourceDesc: this.editResourceDesc,
        status: this.statusTF
      };
      this.$api.editAuthUrl(params).then(
        res => {
          if (res.code == 200) {
            this.displayAllData(1, 12);
            this.editTemplateType = false;
            this.resourceName = "";
            this.authValue = "";
            this.resourcePath = "";
            this.resourceDesc = "";
            this.statusTF = 0;
            this.$message.success("修改资源成功，正在刷新页面！");
          } else {
            this.$message.error(res.message);
          }
        },
        err => {
          this.$message.error(res.message);
        }
      );
    },
    // 删除
    delFun(item) {
      let self = this;
      this.$confirm("确定要删除该条资源么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let params = {
          authId: item.authId
        };
        this.$api.delAuthUrl(params).then(
          res => {
            if (res.code == 200) {
              this.displayAllData(1, 12);
              this.$message.success("删除资源成功，正在刷新页面！");
            } else {
              this.$message.error(res.message);
            }
          },
          err => {
            this.$message.error(res.message);
          }
        );
      });
    },
    //表格底部数据统计
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0 || index === 7) {
          sums[index] = "";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] += "";
        } else {
          sums[index] = "";
        }
      });

      return sums;
    },
    //编辑
    editFun(elem) {
      // this.getNeedPowerData();
      this.editData = elem;
      // console.log(elem)
      var self = this;
      this.editTemplateType = true;
      this.editAuthValue = elem.authValue;
      this.editResourceName = elem.name; //资源名称
      this.editResourcePath = elem.url; //访问路径
      // this.editResourceDesc = elem.resourceDesc; //资源说明
      this.statusTF = elem.status ? elem.status : 0;
    },
    //分页事件开始
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.displayAllData(1, this.pageSize);
    },
    handleCurrentChange(val) {
      this.displayAllData(val, this.pageSize);
    },
    // 新增
    newItem() {
      // this.getNeedPowerData();
      this.resourceName = "";
      this.authValue = "";
      this.resourcePath = "";
      // this.resourceDesc = "";
      this.newTemplateType = true;
      this.statusTF = 0;
    },
    //搜索
    searchFun() {
      this.displayAllData(1, 12);
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
  .item {
    display: flex;
  }

  .topMenuRight {
    text-align: right;

    .width280 {
      width: 327px;
      margin-left: 24px;
    }

    .titleTip {
      font-size: 12px;
      color: #8a9199;
    }
  }
  .selectWidth {
    width: 200px;
    margin-left: 10px;
    align-content: center;
  }
  .inputWidth {
    width: 200px;
    margin-left: 10px;
    align-content: center;
  }
  .inputWidth566 {
    width: 566px;
    margin-left: 10px;
    align-content: center;
  }
  .pageD {
    margin-top: 20px;
    text-align: center;
  }
  .newTemplateStyle {
    line-height: 50px;
  }
}
</style>

