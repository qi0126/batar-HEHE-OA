<template>
  <transition name="fade">
    <div class="modelWrap" @click="cancelModel">
      <!-- <div class="imgWrap"> -->
      <img :src="imgSrc" alt />
      <!-- </div> -->
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    imgSrc: {
      type: String,
      required: true
    }
  },
  created() {},
  mounted() {},
  methods: {
    cancelModel() {
      this.$emit("callback", false);
    }
  },
  data() {
    return {
      resultAll: {
        rowSize: 0
      },
      pageSize: 20,
      page: 1,
      currentPage: 1
    };
  }
};
</script>

<style scoped lang="scss">
.modelWrap {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 30001;
  display: flex;
  justify-content: center;
  align-items: center;
}

img {
  max-height: 640px;
}

/* 开始过渡阶段,动画出去阶段 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease-out;
}

/* 进入开始 */
.fade-enter {
  transform: translateX(-500px);
  opacity: 0;
}

/* 出去终点 */
.fade-leave-active {
  transform: translateX(500px);
  opacity: 0;
}
</style>
