<template>
  <div v-loading="loadingTF">
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
        v-model="statusTxt"
        placeholder="请选择"
        class="width200"
        @change="selectFun"
      >
        <el-option
          v-for="item in statusList"
          :key="item.state"
          :label="item.name"
          :value="item.state"
        ></el-option>
      </el-select>
      <span>创建时间</span>
      <el-date-picker
        v-model="search"
        type="daterange"
        align="right"
        size="small"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-time="['00:00:00', '23:59:59']"
        @change="getList"
      ></el-date-picker>
    </section>
    <section class="middleBlock" v-if="listData.length > 0">
      <el-table
        :data="listData"
        style="width: 100%"
        height="678"
        @row-dblclick="goDetail"
        @selection-change="handleSelectionChange"
      >
        <el-table-column prop="planNum" label="计划编号"></el-table-column>
        <el-table-column prop="type" label="计划类型">
          <template slot-scope="scope">
            <span v-if="scope.row.type === 0">安排巡店</span>
            <span v-if="scope.row.type === 1">申请巡店</span>
          </template>
        </el-table-column>
        <el-table-column prop="planUserName" label="主访人"></el-table-column>
        <el-table-column prop="escortUser" label="陪同人">
          <template slot-scope="scope">
            <span>{{scope.row.escortUser.userNames || '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="storeNum" label="巡店数"></el-table-column>
        <el-table-column prop="budget" label="总预算"></el-table-column>
        <el-table-column prop="phone" label="联系人"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="creator" label="创建人"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.reportStatus === 0" class="txtYellow">待报告</span>
            <span v-else-if="scope.row.reportStatus === 1">已报告</span>
            <span v-else>--</span>
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
      btnloading: false,
      selectData: [], //选中的数据
      listData: [], //巡店计划列表
      searchValue: "",
      search: "", //创建时间
      pageCurrent: 1,
      pageSize: 12,
      total: 0,
      statusTxt: "全部",
      statusList: [
        { name: "全部", state: "" },
        { name: "待报告", state: "0" },
        { name: "已报告", state: "1" }
      ],
      loadingTF: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
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
          path: "shopReportDetails",
          query: { id: elem.id }
        });
      }
    },
    //获取列表
    getList() {
      this.loadingTF = true;
      let params = {
        page: this.pageCurrent,
        size: this.pageSize,
        search: this.searchValue,
        reportStatus: this.statusTxt === "全部" ? "" : this.statusTxt,
        startTime: this.search
          ? this.$moment(this.search[0]).format("YYYY-MM-DD HH:mm:ss")
          : "",
        endTime: this.search
          ? this.$moment(this.search[1]).format("YYYY-MM-DD HH:mm:ss")
          : ""
      };
      this.$api.findAllReportPage(params).then(
        res => {
          this.loadingTF = false;
          this.listData = res.data.data;
          this.total = res.data.count;

          this.listData.forEach(item => {
            item.escortUser = item.escortUser
              ? JSON.parse(item.escortUser)
              : "-";
          });
        },
        err => {
          this.loadingTF = false;
        }
      );
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

