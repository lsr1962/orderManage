<template>
  <div id="app">
    <mt-header ref="header" style="fontSize: 20px; display: none;" :title="$route.meta.title" v-show="!($route.meta.home)">
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
    color: #000000;
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
