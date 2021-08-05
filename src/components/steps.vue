<template>
  <div>
    <el-steps :active="indexActive" align-center>
      <el-step
        v-for="(item, index) in getData"
        :key="index"
        :title="item.nodeName"
        :status="item.status"
      >
        <div slot="description" class="description">
          <span v-if="item.isAuth == 1">
            <span>{{ item.authUSerName | getStepPeople(10)}}</span>
            <div class="more" v-if="item.authUSerName.length > 10">
              ...
              <strong>更多</strong>
              <div class="dialog">
                <h3>{{item.authUSerName}}</h3>
                <!-- <p>{{ item.authUSerName}}</p> -->
              </div>
            </div>
          </span>
          <span v-else>{{ item.userName }}</span>
        </div>
      </el-step>
    </el-steps>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // getActive:2
      indexActive: 0
    };
  },
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  watch: {
    data: {
      handler(nv, ov) {
        // console.log("1aaa", nv);
        // console.log("2aaa", ov);
      },
      deep: true
    }
  },
  created() {},
  methods: {
    getActive() {
      const data = [...this.data];
      let activeWait = "",
        activeSuccess = "",
        activeError = "";
      data.forEach((item, index) => {
        if (item.status === "wait") {
          activeWait = index;
        }
      });

      data.forEach((item, index) => {
        if (item.status === "success") {
          activeSuccess = index;
        }
      });

      data.forEach((item, index) => {
        if (item.status === "error") {
          activeError = index;
        }
      });

      if (
        activeWait !== "" &&
        (activeSuccess === "" || activeSuccess !== "") &&
        activeError === ""
      ) {
        //待审

        return activeWait + 1;
      }

      if (activeWait === "" && activeSuccess !== "" && activeError === "") {
        //审核通过

        return activeSuccess + 1;
      }

      if (activeError !== "") {
        //驳回

        return activeError + 1;
      }
    }
  },
  computed: {
    getData() {
      let data = [...this.data];
      // 添加状态
      for (let i = 0, len = data.length; i < len; i++) {
        let v = data[i];
        switch (v.isAuth) {
          case 1:
            v.status = "wait";
            break;
          case 2:
            v.status = "success";
            break;
          case 3:
            v.status = "error";
            break;
          default:
            v.status = "wait";
        }
      }
      this.indexActive = this.getActive();
      return data;
    }
    // getActive() {
    //   const data = [...this.data];
    //   let active = data.length;
    //   for (let i = 0, len = data.length; i < len; i++) {
    //     if (data[i].status !== 1) {
    //       // active = i+1;
    //       active = i;
    //       break;
    //     }
    //   }
    //   return active;
    // }
  },
  filters: {
    getStepPeople(elem, b) {
      let result = elem.substr(0, b);
      return result;
    }
  }
};
</script>

<style scoped lang="scss">
.description {
  .more {
    display: inline-block;
    position: relative;
    cursor: pointer;
    strong {
      color: #df343d;
      font-weight: bold;
    }
    .dialog {
      z-index: 10;
      visibility: hidden;
      position: absolute;
      left: 0;
      top: 100%;
      width: 250px;
      box-sizing: border-box;
      padding: 10px;
      background: #fff;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
      border-radius: 5px;
      h3 {
        font-size: 14px;
        font-weight: bold;
        color: #37393b;
      }
      p {
        padding-top: 10px;
        line-height: 1.4;
        font-size: 12px;
        color: #3c3c3c;
      }
    }
    &:hover .dialog {
      visibility: visible;
    }
  }
}
</style>