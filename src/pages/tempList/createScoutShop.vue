<template>
  <div>
    <section class="upperBlock">
      <div>
        <span class="leftTip" @click="goBack">
          <i class="el-icon-arrow-left"></i>
          新建报考与成绩管理报表
        </span>
      </div>
      <div>
        <a href="static/fileTemplate/报考与成绩上传模板.xlsx">
          <el-button type="primary" plain size="small">下载报考与成绩上传模板</el-button>
        </a>
        <el-button type="primary" size="small" @click="releaseFun" :loading="btnloading">发布</el-button>
      </div>
    </section>
    <section class="middleBlock">
      <ul>
        <li>
          <div class="leftTitle">
            <span class="redColor">*</span>
            对应证书
          </div>
          <el-select v-model="cert" placeholder="请选择" size="small" class="width520">
            <el-option
              v-for="(item,index) in certificateList"
              :key="index"
              :label="item.label"
              :value="item.label"
            ></el-option>
          </el-select>
        </li>
        <li>
          <div class="leftTitle">
            <span class="redColor">*</span>
            考试批次
          </div>
          <el-select v-model="examBatch" placeholder="请选择" size="small" class="width520">
            <el-option
              v-for="(item,index) in batchList"
              :key="index"
              :label="item.label"
              :value="item.label"
            ></el-option>
          </el-select>
        </li>

        <li>
          <div class="leftTitle">
            <span class="redColor">*</span>附件上传
          </div>
          <div class="fileWrap">
            <div class="fileUL" v-if="file !== ''">
              <div>
                {{file.name}}
                <span class="redColor" @click="deleteFun">删除</span>
                <span class="redColor" @click="replaceFun">替换</span>
              </div>
            </div>

            <label for="fileDom" class="global-el-btn" v-else>上传附件</label>
            <input
              type="file"
              ref="fileDom"
              id="fileDom"
              @change="uploadFun"
              v-show="false"
              accept=".xls, .xlsx"
            />
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      btnloading: false,
      cert: "", //证书
      examBatch: "", //批次
      file: "", //文件
      certificateList: [], //证书数据
      batchList: [] //批次数据
    };
  },
  created() {
    this.certsSettingList();
    this.examBatchList();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    //证书列表
    certsSettingList() {
      this.$api.certsSettingList().then(res => {
        if (res.code === 200) {
          res.data.certsSettingList.forEach(item => {
            this.certificateList.push({
              label: `${item.certName}${item.certGrade}`
            });
          });
        }
      });
    },
    //获取批次列表数据
    examBatchList() {
      this.$api.examBatchList().then(res => {
        res.data.examBatchList.forEach(item => {
          this.batchList.push({
            label: item.batchName
          });
        });
      });
    },
    //上传
    uploadFun(e) {
      if (e.target.files[0] == null) {
        return;
      }
      this.file = e.target.files[0];

      this.$refs.fileDom.value = "";
    },
    //删除
    deleteFun() {
      this.file = "";
    },
    //替换
    replaceFun() {
      this.$refs.fileDom.click();
    },
    //发布
    releaseFun() {
      let params = {
        file: this.file, //附件
        cert: this.cert, //对应证书
        examBatch: this.examBatch //考试批次
      };
      if (this.file === "" || this.cert === 0 || this.examBatch === "") {
        this.$message.warning("请完善资料在提交！");
        return;
      }

      this.btnloading = true;
      this.$api.addExamResults(params).then(
        res => {
          this.$message.success(res.msg);
          this.btnloading = false;
          this.$router.go(-1);
        },
        err => {
          this.btnloading = false;
        }
      );
    }
  }
};
</script>


<style scoped lang="scss" >
.redColor {
  color: #9e0029;
}
.width520 {
  width: 520px;
}

.upperBlock {
  display: flex;
  justify-content: space-between;
  .leftTip {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: rgba(34, 36, 38, 1);
    cursor: pointer;
  }
}

.middleBlock {
  margin-top: 55px;
  ul {
    margin-left: 50px;

    li {
      display: flex;
      align-items: baseline;
      margin-bottom: 32px;
      .leftTitle {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(138, 145, 153, 1);
        // margin: 0px 16px 0px 8px;
        flex: 0 0 80px;
      }
      .fileWrap {
        flex: 1;
        .fileUL {
          // display: flex;
          // flex-wrap: wrap;
          margin-bottom: 24px;
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(34, 36, 38, 1);
          .redColor {
            cursor: pointer;
          }

          div {
            margin-right: 40px;
            margin-bottom: 20px;
          }
        }
      }
    }
  }
}
</style>

