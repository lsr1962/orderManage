<template>
  <div class="order_list" ref="order_list">
    <mt-loadmore :autoFill="false" :bottom-method="loadBottom" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore">
      <ul>
        <li v-for="(item, key) in list" class="order_list_item">
          <img class="order_list_item_icon" :src="item.shopInfo.logo || defaultImg" />
          <div class="order_list_item_content" @click="gotoDetail(item)">
            <div class="order_list_item_content_name" @click.stop="gotoMain">
              <div class="order_list_item_content_name_text">{{item.shopInfo.name}}</div>
              <img class="order_list_item_content_name_icon" src="../assets/store@2x.png"/>
              <div class="order_list_item_content_name_finish">{{item.orderList.PayName}}</div>
            </div>
            <div class="order_list_item_content_time">{{item.orderList.PayTime}}</div>
            <div class="order_list_item_content_detail">{{item.items[0].name}}&nbsp;&nbsp;等{{item.items.length}}个菜品</div>
            <div class="order_list_item_content_amount">￥{{item.orderList.TradeAmount}}</div>
          </div>
        </li>
      </ul>
      <div slot="bottom" class="mint-loadmore-bottom">
        <span v-show="bottomStatus !== 'loading'" :class="{ 'is-rotate': bottomStatus === 'drop' }">↑</span>
        <span v-show="bottomStatus === 'loading'">
          <mt-spinner type="snake"></mt-spinner>
        </span>
      </div>
    </mt-loadmore>
    <div class="no_order" v-if="list.length === 0">没有订单信息，快去下单吧！</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Toast, Loadmore, Spinner } from 'mint-ui'
export default {
  name: 'shopMain',
  mounted () {
    if (this.userInfo.wid) {
      this.loadBottom()
    } else {
      this.$router.push({name: 'shopMain', query: this.$route.query})
    }
    this.$refs.order_list.style.height = (document.documentElement.clientHeight - this.$refs.order_list.getBoundingClientRect().top) + 'px'
  },
  components: {
    [Loadmore.name]: Loadmore,
    [Spinner.name]: Spinner
  },
  data () {
    return {
      defaultImg: require('../assets/default_log.png'),
      order: {
        last: 1,
        amount: 10
      },
      list: [],
      allLoaded: false,
      bottomStatus: ''
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  methods: {
    dateFormat (value, fmt) {
      var o = {
        'M+': value.getMonth() + 1, // 月份
        'd+': value.getDate(), // 日
        'h+': value.getHours(), // 小时
        'm+': value.getMinutes(), // 分
        's+': value.getSeconds(), // 秒
        'q+': Math.floor((value.getMonth() + 3) / 3), // 季度
        'S': value.getMilliseconds() // 毫秒
      }
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (value.getFullYear() + '').substr(4 - RegExp.$1.length))
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
      return fmt
    },
    gotoMain () {
      this.$router.push({name: 'shopMain', query: this.$route.query})
    },
    gotoDetail (item) {
      this.$router.push({name: 'orderDetail', params: {item: item}, query: this.$route.query})
    },
    handleBottomChange (status) {
      this.bottomStatus = status
    },
    loadBottom () {
      this.$http.post('/order/get.html', {
        data: this.userInfo,
        order: this.order
      }).then((data) => {
        var result = data.data
        if (parseInt(result.errcode) !== 0) {
          Toast(result.errmsg)
          return
        }
        this.list = this.list.concat(result.dataList)
        if (result.dataList.length < 10) {
          this.allLoaded = true
        } else {
          this.order.last += 10
        }
      }).catch((e) => {
        console.log(e)
      })
      this.$refs.loadmore.onBottomLoaded()
    }
  },
  watch: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .order_list {
    overflow: scroll;
  }
  .order_list_item {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 15px;
    border-bottom: 1px solid #eeeeee;
    height: 162px;
  }
  .order_list_item_icon {
    width: 15%;
  }
  .order_list_item_content {
    width: 85%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 15px;
  }
  .order_list_item_content_name {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 20px;
  }
  .order_list_item_content_name_text {
    flex: 0 0 auto;
    font-size: 16px;
    color: #333333;
    font-weight: bold;
    padding-right: 10px;
  }
  .order_list_item_content_name_icon {
    flex: 0 0 auto;
    height: 16px;
  }
  .order_list_item_content_name_finish {
    flex: 1;
    text-align: right;
  }
  .order_list_item_content_name_pay {
    color: #2395ff;
  }
  .order_list_item_content_time {
    padding-top: 10px;
    font-size: 12px;
    color: #999999;
  }
  .order_list_item_content_detail {
    padding-top: 15px;
    font-size: 13px;
    color: #666666;
  }
  .order_list_item_content_amount {
    padding-top: 10px;
    font-size: 13px;
    color: #333333;
  }
  .order_list_item_content_name_gotoPay {
    align-self: flex-end;
    padding: 5px 10px;
    margin-right: 20px;
    border: 1px solid #ff6952;
    color: #ff5339;
    border-radius: 5px;
  }
  .no_order {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
  }
</style>
