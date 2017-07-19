<template>
  <div class="order_list" ref="order_list">
    <div v-for="(item, key) in list" class="order_list_item">
      <img class="order_list_item_icon" :src="item.img || defaultImg" />
      <div class="order_list_item_content" @click="gotoDetail(item)">
        <div class="order_list_item_content_name">
          <div class="order_list_item_content_name_text" @click.stop="gotoMain">{{shopInfo.shop_name}}</div>
          <div class="order_list_item_content_name_pay" v-if="item.status === 0">去支付</div>
          <div class="order_list_item_content_name_finish" v-else>订单已完成</div>
        </div>
        <div class="order_list_item_content_time">{{item.pay_time}}</div>
        <div class="order_list_item_content_detail">{{item.order[0].name}}&nbsp;&nbsp;等{{item.order.length}}个菜品</div>
        <div class="order_list_item_content_amount">{{item.totalAmount}}</div>
        <div class="order_list_item_content_name_gotoPay" v-if="item.status === 0" @click.stop="repay(item)">去支付</div>
      </div>
    </div>
    <div class="no_order" v-if="list.length === 0">没有订单信息，快去下单吧！</div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'shopMain',
  mounted () {
    this.$refs.order_list.style.height = (document.documentElement.clientHeight - this.$refs.order_list.getBoundingClientRect().top) + 'px'
    this.$refs.order_list.style.overflow = 'auto'
  },
  components: {
  },
  data () {
    return {
      defaultImg: require('../assets/default_log.png'),
      list: [
        {
          order: [
            {id: '1', kind: '1', name: '热销菜单1', img: '', price: 10, count: 1},
            {id: '5', kind: '2', name: '优惠菜单5', img: '', price: 100, count: 1},
            {id: '9', kind: '3', name: '满20减12菜单9', img: '', price: 16, count: 2},
            {id: '13', kind: '3', name: '满20减12菜单13', img: '', price: 16, count: 3}
          ],
          totalAmount: 155,
          discount: 20,
          luckyMoneyText: '超级会员专享',
          luckyMoney: 15,
          mark: '不要辣椒',
          pay_time: '2017-07-11',
          orderId: '1',
          payType: '微信支付',
          status: 0
        },
        {
          order: [
            {id: '1', kind: '1', name: '尖椒肉丝', img: '', price: 10, count: 1},
            {id: '9', kind: '3', name: '米饭', img: '', price: 16, count: 2},
            {id: '13', kind: '3', name: '酸梅汤', img: '', price: 16, count: 3}
          ],
          totalAmount: 77,
          discount: 12,
          luckyMoneyText: '超级会员专享',
          luckyMoney: 5,
          mark: '少盐少油',
          pay_time: '2017-07-18',
          orderId: '1',
          payType: '支付宝支付',
          status: 1
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'shopInfo',
      'orderInfo'
    ])
  },
  methods: {
    ...mapActions([
      'setShopInfo'
    ]),
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
    repay (item) {
      this.orderInfo.orderId = item.orderId
      this.orderInfo.totalAmount = item.totalAmount
      this.$router.push({name: 'payOrder'})
    },
    gotoMain () {
      this.$router.push({name: 'shopMain'})
    },
    gotoDetail (item) {
      this.$router.push({name: 'orderDetail', params: {item: item}})
    }
  },
  watch: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .order_list {
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
    font-size: 16px;
    color: #333333;
    font-weight: bold;
    background: url("../assets/business_a@2x.png") no-repeat;
    background-position: right;
    background-size: contain;
    padding-right: 20px;
  }
  .order_list_item_content_name_pay {
    color: #2395ff;
  }
  .order_list_item_content_time {
    padding-top: 9px;
    font-size: 12px;
    color: #999999;
  }
  .order_list_item_content_detail {
    padding-top: 15px;
    font-size: 13px;
    color: #666666;
  }
  .order_list_item_content_amount {
    padding-top: 9px;
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
