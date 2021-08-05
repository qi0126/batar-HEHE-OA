<template>
  <div v-loading="loadingList">
    日志管理
    <div class="line"></div>
    <section class="upperBlock">
      <el-input
        placeholder="姓名、模块"
        style="width:250px"
        size="small"
        v-model="content"
        @keydown.enter.native="searchFun"
      >
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <span>创建时间</span>
      <el-date-picker
        v-model="selectedDay"
        @change="selectDate"
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
      <el-table :data="listData" style="width: 100%" height="678">
        <el-table-column type="index" label="序"></el-table-column>
        <el-table-column prop="id" label="编号"></el-table-column>
        <el-table-column prop="userName" label="姓名"></el-table-column>
        <el-table-column prop="model" label="模块"></el-table-column>
        <el-table-column prop="createTime" label="时间"></el-table-column>
        <el-table-column prop="content" label="内容"></el-table-column>
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
      selectedDay: "",
      loadingList: false,
      btnloading: false,
      selectData: [], //选中的数据
      listData: [],
      content: "", //模糊查询
      startTime: "",
      endTime: "",
      search: "",
      pageCurrent: 1,
      pageSize: 12,
      total: 0
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //获取列表
    getList() {
      let params = {
        content: this.content,
        startTime: this.startTime,
        endTime: this.endTime,
        size: this.pageSize,
        page: this.pageCurrent
      };
      this.loadingList = true;
      this.$api.findLog(params).then(
        res => {
          if (res.code == 200) {
            this.listData = res.data.data;
            this.total = res.data.count;
          }
          this.loadingList = false;
        },
        err => {
          this.loadingList = false;
        }
      );
    },
    // 时间日期事件
    selectDate() {
      this.startTime = "";
      this.endTime = "";
      if (this.selectedDay) {
        this.startTime = this.$moment(this.selectedDay[0]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        this.endTime = this.$moment(this.selectedDay[1]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      }
      this.searchFun();
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
    searchFun() {
      this.pageCurrent = 1;
      this.pageSize = 12;
      this.getList();
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
</style>

