<template>
  <div class="shop_info" ref="shop_info">
    <div class="finish_top">
      <div class="finish_top_time_area">
        <img style="height: 100%;" :src="shopInfo.logo || defaultImg"/>
      </div>
      <div class="finish_tips3">{{shopInfo.name}}</div>
      <div class="shop_info_notice">[公告]&nbsp;{{shopInfo.notice}}</div>
    </div>
    <div class="shop_info_main">
      <div class="shop_info_main_line" style="border: 0;font-weight: bold;font-size: 18px;">
        商家信息
      </div>
      <div class="shop_info_main_line">
        <div class="shop_info_main_line_left">商家电话</div>
        <div class="shop_info_main_line_right">{{shopInfo.phone}}</div>
      </div>
      <div class="shop_info_main_line">
        <div class="shop_info_main_line_left">商家地址</div>
        <div class="shop_info_main_line_right">{{shopInfo.address}}</div>
      </div>
      <div class="shop_info_main_line">
        <div class="shop_info_main_line_left">商家简介</div>
        <div class="shop_info_main_line_right">{{shopInfo.info}}</div>
      </div>
      <div class="shop_info_main_line">
        <div class="shop_info_main_line_left">商家营业时间</div>
        <div class="shop_info_main_line_right">{{shopInfo.times}}</div>
      </div>
      <div class="shop_info_main_line">
        <div class="shop_info_main_line_left">商家图集</div>
        <div class="shop_info_main_line_right"></div>
      </div>
      <div class="shop_info_main_line_pics">
        <img class="shop_info_pics" :src="item.src" v-for="(item, key) in shopInfo.pics" />
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'shopMain',
    mounted () {
      if (this.userInfo.wid) {
      } else {
        this.$router.push({name: 'shopMain', query: this.$route.query})
      }
      this.$nextTick(() => {
        this.$refs.shop_info.style.height = (document.documentElement.clientHeight - this.$refs.shop_info.getBoundingClientRect().top) + 'px'
        this.$refs.shop_info.style.overflow = 'auto'
      })
    },
    components: {
    },
    data () {
      return {
        defaultImg: require('../assets/default_log.png')
      }
    },
    computed: {
      ...mapGetters([
        'shopInfo',
        'userInfo'
      ])
    },
    methods: {

    },
    watch: {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .shop_info {
    background: #F5F5F5;
  }
  .finish_top {
    background: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .finish_top_time_area {
    height: 80px;
    width: 80px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #ffffff;
    margin: 10px 0 0 0;
  }
  .finish_tips3 {
    font-weight: bold;
    font-size: 18px;
    padding-top: 10px;
  }
  .shop_info_notice {
    font-size: 15px;
    padding: 10px 0;
    margin: 10px 20px 0 20px;
    display: flex;
    align-items: center;
    align-self: stretch;
    border-top: 1px solid #eeeeee;
    color: #666666;
  }
  .shop_info_main {
    margin: 10px 8px;;
    background: #ffffff;
  }
  .shop_info_main_line {
    margin: 0 15px;
    padding: 10px 0;
    color: #333333;
    border-bottom: 1px solid #eeeeee;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .shop_info_main_line_left {
    flex: 0 0 auto;
    font-size: 16px;
  }
  .shop_info_main_line_right {
    font-size: 13px;
    color: #666666;
  }
  .shop_info_main_line_pics {
    margin: 0 15px;
    padding: 10px 0;
    display: flex;
    flex-wrap: wrap;
  }
  .shop_info_pics {
    width: 100px;
    height: 100px;
    margin-right: 10px;
    margin-bottom: 10px;
  }
</style>
