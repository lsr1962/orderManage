<template>
  <div id="app">
    <mt-header :style="{ paddingTop: iosFixed, height: iosFixedHeight, fontSize: '20px' }" :title="$route.meta.title" v-if="!($route.meta.home)">
      <div slot="left" class="backBtn" @click="goBack"></div>
      <div v-if="$route.meta.right" slot="right" @click="triggerRight">{{$route.meta.right}}</div>
    </mt-header>
    <transition name="merchant-slide" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import { Header } from 'mint-ui'
  export default {
    mounted () {
      if (window.navigator.userAgent.indexOf('iPhone') > -1) {
        this.iosFixed = '20px'
        this.iosFixedHeight = '64px'
      }
    },
    components: {
      [Header.name]: Header
    },
    data () {
      return {
        iosFixed: '0px',
        iosFixedHeight: '44px'
      }
    },
    name: 'app',
    methods: {
      goBack () {
        this.$router.back()
      },
      triggerRight () {
        this.$emit(this.$route.meta.right)
      }
    }
  }
</script>

<style>
  @import './style/reset.css';
  #app {
    margin: 0;
    padding: 0;
    color: #2c3e50;
  }
  .backBtn {
    background: url(./assets/btn_back@2x.png) no-repeat;
    background-size: 11px 18px;
    background-position: center left;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 44px;
  }
  .mint-header {
    height: 44px;
    line-height: 44px;
    background: -moz-linear-gradient(left, #3FC2F1  0%, #3479DE 100%) !important;
    background: -webkit-linear-gradient(left, #3FC2F1  0%, #3479DE 100%) !important;
    background: linear-gradient(to right, #3FC2F1 0%,#3479DE 100%) !important;
  }
  .merchant-slide-enter {
    opacity: 0;
  }
  .merchant-slide-enter-active {
    transition: all 0.1s ease;
  }
  .merchant-slide-leave {
    opacity: 1;
  }
  .merchant-slide-leave-active {
    transition: all 0.1s ease;
    opacity: 0;
  }
</style>
