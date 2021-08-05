<template>
  <div>
    <section class="upperBlock">
      <el-input
        placeholder="请输入内容"
        style="width:250px"
        size="small"
        v-model="searchValue"
        @keydown.enter.native="selectFun('searchValue')"
      >
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <span>单据状态</span>
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
      </el-select>
      <span>创建时间</span>
      <el-date-picker
        v-model="search"
        :value-format="'yyyy-MM-dd'"
        type="daterange"
        align="right"
        unlink-panels
        size="small"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-time="['00:00:00', '23:59:59']"
        @change="getList"
      ></el-date-picker>
      <div v-if="true">
        <el-button type="primary" size="small" plain @click="exportFun">导出</el-button>
        <el-button type="primary" size="small" @click="createFun">新建</el-button>
        <el-button type="warning" size="small" @click="deleteFun" :loading="btnloading">删除</el-button>
      </div>
    </section>
    <section class="middleBlock">
      <el-table
        :data="listData"
        style="width: 100%"
        height="678"
        @row-dblclick="goDetail"
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column type="selection" width="45"></el-table-column> -->
        <el-table-column type="index" label="序号" width="100"></el-table-column>
        <el-table-column prop="cert" label="证书类型"></el-table-column>
        <el-table-column prop="examBatch" label="报考批次"></el-table-column>
        <el-table-column prop="createTime" label="发布时间"></el-table-column>
        <el-table-column prop="createIdName" label="创建人"></el-table-column>
      </el-table>
    </section>

    <div class="elPageWrap">
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
      btnloading: false,
      selectData: [], //选中的数据
      listData: [{}, {}, {}],
      searchValue: "",
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
    // this.getList();
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
          path: "scoutShopDetails",
          query: { id: elem.id, name: elem.cert }
        });
      }
    },
    //获取列表
    getList() {
      let params = {
        pageNum: this.pageCurrent,
        pageSize: this.pageSize,
        condition: this.searchValue
      };
      this.$api.getExamResultsListPage(params).then(res => {
        this.listData = res.data.pageInfo.list;
        this.total = res.data.pageInfo.total;
      });
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

.redColor {
  color: #9e0029;
}
.upperBlock {
  display: flex;
  justify-content: space-between;
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

