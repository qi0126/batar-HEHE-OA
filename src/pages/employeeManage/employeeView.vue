<template>
  <div v-loading="loadingList">
    员工管理 - 员工查看
    <div class="line"></div>
    <section class="upperBlock">
      <el-input
        placeholder="请输入关键字搜索"
        style="width:250px"
        size="small"
        v-model="searchValue"
        @keydown.enter.native="selectFun('searchValue')"
      >
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <!-- <span>启用状态</span>
      <el-select
        size="small"
        v-model="search"
        placeholder="请选择"
        class="width200"
        @change="selectFun"
      >
        <el-option
          v-for="item in statusList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>-->
    </section>
    <section class="middleBlock" v-if="listData.length > 0">
      <el-table
        :data="listData"
        style="width: 100%"
        height="678"
        @row-dblclick="goDetail"
        @selection-change="handleSelectionChange"
      >
        <el-table-column prop="username" label="账号"></el-table-column>
        <el-table-column prop="concat" label="姓名"></el-table-column>
        <el-table-column prop="telephone" label="手机号"></el-table-column>
        <el-table-column prop="mail" label="邮箱地址"></el-table-column>
        <!-- <el-table-column prop="examBatch" label="办公电话"></el-table-column> -->
        <el-table-column prop="roleName" label="用户角色"></el-table-column>
        <!-- <el-table-column prop="createIdName" label="所属部门"></el-table-column> -->
        <el-table-column prop="status" label="启用状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0">启用</span>
            <span class="txtRed" v-else>已禁用</span>
          </template>
        </el-table-column>
      </el-table>
    </section>

    <NoDataPage v-else></NoDataPage>

    <div class="elPageWrap" v-if="listData.length > 0">
      <el-pagination
        :current-page.sync="pageCurrent"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[12, 30, 50, 100]"
        :page-size.sync="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loadingList: false,
      statusList: [],
      btnloading: false,
      selectData: [], //选中的数据
      listData: [],
      searchValue: "",
      search: "",
      pageCurrent: 1,
      pageSize: 12,
      total: 0,
      mock: "",
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        }
      ]
    };
  },
  created() {
    // this.$moment("2018-09-19T05:54:32.767Z").format("YYYY-DD-MM")
    this.getList();
  },
  methods: {
    createFun() {
      this.$router.push("createFractionManage");
    },
    deleteFun() {
      if (this.selectData.length === 0) {
        this.$message.warning("请选择需要删除的数据");
        return;
      }
      this.$confirm("请确定是否要删除！", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let ids = [];
          this.selectData.forEach(item => {
            ids.push(item.id);
          });
          let params = {
            ids
          };

          this.btnloading = true;
          this.$api.delExamResults(params).then(
            res => {
              this.$message.success(res.msg);
              this.selectData = [];
              this.btnloading = false;
              this.getList();
            },
            err => {
              this.btnloading = false;
            }
          );
        })
        .catch(() => {});
    },
    goDetail(elem) {
      if (true) {
        this.$router.push({
          path: "employeeEdit",
          query: { userId: elem.userId }
        });
      }
    },
    //获取列表
    getList() {
      let params = {
        page: this.pageCurrent,
        size: this.pageSize,
        keyWord: this.searchValue
      };
      this.loadingList = true;
      this.$api.userAll(params).then(
        res => {
          if (res.code == 200) {
            this.listData = res.data.data;
            this.total = res.data.count;
          } else {
            this.$message.error(res.message);
          }
        },
        err => {
          this.$message.error(res.message);
        }
      );
      this.loadingList = false;
    },
    //分页事件开始
    handleSizeChange(val) {
      this.pageCurrent = 1;
      this.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.pageCurrent = val;
      this.getList();
    },
    handleSelectionChange(val) {
      this.selectData = val;
    },
    //选择证书
    selectFun(name) {
      if ((name = "searchValue")) {
        this.goEmpty(name);
      }
      this.pageCurrent = 1;
      this.getList();
    },
    //去空
    goEmpty(name) {
      this[name] = this.$tools.goEmpty(this[name]);
    }
  }
};
</script>


<style scoped lang="scss" >
.width200 {
  width: 200px;
}

.line {
  width: 100%;
  border-top: 1px solid rgba(218, 221, 229, 1);
  margin-top: 15px;
  margin-bottom: 8px;
}
.redColor {
  color: #9e0029;
}
.upperBlock {
  // display: flex;
  // justify-content: space-between;
}
.upperBlock span {
  color: #8a8e99;
  font-size: 12px;
  line-height: 30px;
  margin-left: 30px;
}

.middleBlock {
  margin-top: 30px;
}

.dialogWrap {
  .title {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(34, 36, 38, 1);
  }
  .downloadBtn {
    margin-top: 13px;
    margin-bottom: 24px;
  }
  .progressWrap {
    width: 50%;
  }
  div:nth-child(3) {
    margin-bottom: 13px;
  }
}
</style>

