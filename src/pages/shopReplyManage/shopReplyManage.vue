<template>
  <div v-loading="loadingList">
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
        v-model="selectedDay"
        @change="selectDayFun"
        type="daterange"
        align="right"
        unlink-panels
        size="small"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-time="['00:00:00', '23:59:59']"
      ></el-date-picker>
    </section>
    <section class="middleBlock" v-if="listData.length > 0">
      <el-table
        :data="listData"
        style="width:100%;margin-bottom: 20px;"
        row-key="id"
        highlight-current-row
        ref="refTable"
        @row-click="clickTable"
        :default-expand-all="isExpand"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table
              :data="props.row.storeAllList"
              style="width:100%;"
              highlight-current-row
              :show-header="false"
              @row-dblclick="goDetail"
            >
              <el-table-column type="index" width="50">
                <template slot-scope="scope">
                  <span></span>
                </template>
              </el-table-column>
              <el-table-column prop="planNum" width="150px" label="计划编号">
                <template slot-scope="scope">
                  <span></span>
                </template>
              </el-table-column>
              <el-table-column label="计划类型">
                <template slot-scope="scope">
                  <span></span>
                </template>
              </el-table-column>
              <el-table-column prop="planUserName" label="主访人">
                <template slot-scope="scope">
                  <span></span>
                </template>
              </el-table-column>
              <el-table-column prop="escortUser" label="陪同人">
                <template slot-scope="scope">
                  <span>{{scope.row.newUserName || '-'}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="storeNum" width="240px" label="到访客户">
                <template slot-scope="scope">
                  <span>{{scope.row.storeName}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="address" label="巡店单号">
                <template slot-scope="scope">
                  <span>{{scope.row.storeNum}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="budget" label="总预算">
                <template slot-scope="scope">
                  <span>{{scope.row.totalPrice}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="phone" width="200px" label="预定时间">
                <template slot-scope="scope">
                  <span>{{scope.row.predictStartTime || '-'}}-{{scope.row.predictEndTime || '-'}}</span>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="phone" label="到店状态">
                <template slot-scope="scope">
                  <span v-if="scope.row.isStoreStatus == 0">未到店</span>
                  <span v-else-if="scope.row.isStoreStatus == 1">已到店</span>
                  <span v-else>--</span>
                </template>
              </el-table-column>-->
              <el-table-column prop="phone" label="报告状态">
                <template slot-scope="scope">
                  <span>-</span>
                </template>
              </el-table-column>
              <el-table-column prop="phone" label="联系人">
                <template slot-scope="scope">
                  <span></span>
                </template>
              </el-table-column>
              <el-table-column label="分数/满分">
                <template slot-scope="scope">
                  <span>{{scope.row.score}}/{{scope.row.fullMark}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="创建时间">
                <template slot-scope="scope">
                  <span></span>
                </template>
              </el-table-column>
              <el-table-column prop="creator" label="创建人">
                <template slot-scope="scope">
                  <span></span>
                </template>
              </el-table-column>
              <el-table-column prop="address" label="状态">
                <template slot-scope="scope">
                  <span v-if="scope.row.isStoreStatus === 0" style="color:#F20F34">未到店</span>
                  <span v-else>
                    <span v-if="scope.row.storeStatus === 0" style="color:#F20F34">待反馈</span>
                    <span v-else-if="scope.row.storeStatus === 1" style="color:#F29924">待回复</span>
                    <span v-else-if="scope.row.storeStatus === 2">已回复</span>
                    <span v-else>--</span>
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column prop="planNum" width="150px" label="计划编号"></el-table-column>
        <el-table-column label="计划类型">
          <template slot-scope="scope">
            <span v-if="scope.row.type === 0">安排巡店</span>
            <span v-if="scope.row.type === 1">申请巡店</span>
          </template>
        </el-table-column>
        <el-table-column prop="planUserName" label="主访人"></el-table-column>
        <el-table-column prop="newUserName" label="陪同人"></el-table-column>
        <el-table-column prop="storeName" width="240px" label="到访客户">
          <template slot-scope="scope">
            <span>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="巡店单号">
          <template slot-scope="scope">
            <span>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="budget" label="总预算">
          <template slot-scope="scope">
            <span>{{scope.row.budget || '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="predictStartTime" width="200px" label="预定时间">
          <template slot-scope="scope">
            <span>-</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop label="到店状态">
          <template slot-scope="scope">
            <span>-</span>
          </template>
        </el-table-column>-->
        <el-table-column prop label="报告状态">
          <template slot-scope="scope">
            <span v-if="scope.row.reportStatus === 0">待报告</span>
            <span v-else-if="scope.row.reportStatus === 1">已报告</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="联系人"></el-table-column>
        <el-table-column label="分数/满分"></el-table-column>

        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="creator" label="创建人"></el-table-column>
        <el-table-column prop="address" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.backStatus === 0" style="color:#F29924">待回复</span>
            <span v-else-if="scope.row.backStatus === 1">已回复</span>
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
      loadingList: false,
      isExpand: true,
      startTime: "",
      endTime: "",
      selectedDay: "", //日期
      btnloading: false,
      selectData: [], //选中的数据
      listData: [],
      searchValue: "",
      search: "",
      statusTxt: "",
      pageCurrent: 1,
      pageSize: 12,
      total: 0,
      mock: "",
      statusList: [
        { name: "全部", state: "" },
        { name: "待反馈", state: 0 },
        { name: "待回复", state: 1 },
        { name: "已回复", state: 2 },
        { name: "未到店", state: 3 }
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
      this.$router.push({
        path: "shopReplyDetails",
        query: { planId: elem.planId, storeId: elem.storeId }
      });
    },
    //获取列表
    getList() {
      let params = {
        page: this.pageCurrent,
        size: this.pageSize,
        search: this.searchValue,
        status: this.statusTxt === "全部" ? "" : this.statusTxt,
        startTime: this.startTime,
        endTime: this.endTime
      };

      // this.loadingList = true;
      this.$api.findAllFeedback(params).then(
        res => {
          this.listData = res.data.data;
          this.total = res.data.count;

          this.listData.forEach(ielem => {
            ielem.storeList = ielem.storeList ? ielem.storeList : [];
            ielem.storeAllList = ielem.storeList.concat(
              ielem.storeListOut ? ielem.storeListOut : []
            );
            this.listData.forEach(item => {
              if (item.escortUser) {
                item.newUserName = JSON.parse(item.escortUser).userNames;
              }
            });
          });

          this.loadingList = false;
        },
        err => {
          this.loadingList = false;
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
    },
    //搜索
    selectDayFun() {
      if (this.selectedDay != null) {
        this.startTime = this.$moment(this.selectedDay[0]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        this.endTime = this.$moment(this.selectedDay[1]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      } else {
        this.startTime = "";
        this.endTime = "";
      }
      this.getList();
    },
    clickTable(row, index, e) {
      this.$refs.refTable.toggleRowExpansion(row);
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
<style>
.el-table--enable-row-transition .el-table__body td {
  padding: 0;
  line-height: 50px;
  height: 50px;
}
</style>

