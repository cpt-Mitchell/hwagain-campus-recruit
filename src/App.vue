<template>
  <div>
    <van-overlay :show="loadingObj.isLoading" class="common-loading-overlay">
      <van-loading color="#fff" size="24px">{{ loadingObj.loadingText }}</van-loading>
    </van-overlay>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"/>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"/>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { LoadingObj } from './types'

export default defineComponent({
  name: 'App',
  setup () {
    const store = useStore()

    const loadingObj = computed<LoadingObj>(() => store.state.loadingObj)
    return {
      loadingObj
    }
  }
})
</script>

<style lang="less">
@import "./assets/styles/variables";

#app {
  color: @color-text;
  font-size: @font-size-normal;
}

.common-loading-overlay {
  z-index: 1000 !important;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
