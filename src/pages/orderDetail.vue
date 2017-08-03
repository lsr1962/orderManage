<template>
  <div class="order_detail" ref="order_detail">
    <div class="finish_top">
      <div class="finish_top_time_area">
        <img style="height: 100%;" :src="orderItem.shopInfo.logo || defaultImg"/>
      </div>
      <div class="finish_tips">{{orderItem.orderList.tags}}</div>
      <div class="finish_tips2">{{orderItem.orderList.text}}</div>
      <div class="finish_tips3">{{orderItem.orderList.PayName}}</div>
      <div class="finish_luckyMoney" v-if="orderItem.orderList.isShare === '0'" @click="shareTips = true">发红包</div>
    </div>
    <div class="detail_content">
      <div class="detail_content_order">
        <div class="order_line" style="border-bottom: 1px solid #eeeeee;" @click.stop="gotoMain">
          <img :src="orderItem.shopInfo.logo || defaultImg" style="width: 15%;"/>
          <div class="order_list_item_content_name_text">{{orderItem.shopInfo.name}}</div>
        </div>
        <div v-for="item in orderItem.items" class="order_line">
          <div class="order_name">{{item.name}}</div>
          <div class="order_acount"><span class="unit">×</span>{{item.count}}</div>
          <div class="order_amount"><span class="unit">￥</span>{{(item.count * (item.price * 100)) / 100}}</div>
        </div>
        <div class="order_line" style="border-bottom: 1px solid #eeeeee;" v-if="!Array.isArray(orderItem.discount)">
          <div class="order_name reduce_icon" :class="'icon_' + orderItem.discount.type">{{orderItem.discount.name}}</div>
          <div class="order_acount"></div>
          <div class="order_amount reduce"><span class="unit">-￥</span>{{orderItem.discount.reduce}}</div>
        </div>
        <div class="lucky_money_line" v-if="!Array.isArray(orderItem.coupon)">
          <div class="order_name" style="font-weight: bold;">红包</div>
          <div class="order_acount"></div>
          <div class="order_amount reduce is_lucky_money">
            <div class="unit">-￥</div>
            <div>{{orderItem.coupon.reduce}}</div>
          </div>
        </div>
        <div class="lucky_money_line total_line">
          <div class="discount_detail discount_icon"></div>
          <div class="order_acount"></div>
          <div class="order_amount total_amount is_lucky_money"><span class="unit2">小计￥</span><span class="total_amount">{{orderItem.orderList.TradeAmount}}</span></div>
        </div>
      </div>
      <div class="detail_content_order">
        <div class="order_info_title">订单信息</div>
        <div class="order_info_line">
          <div class="order_info_line_title">订单号</div>
          <div class="order_info_line_text">{{orderItem.orderList.OrderNo}}</div>
        </div>
        <div class="order_info_line">
          <div class="order_info_line_title">支付方式</div>
          <div class="order_info_line_text">{{orderItem.orderList.payType}}</div>
        </div>
        <div class="order_info_line">
          <div class="order_info_line_title">下单时间</div>
          <div class="order_info_line_text">{{orderItem.orderList.PayTime}}</div>
        </div>
      </div>
    </div>
    <mt-popup
      v-model="shareTips"
      class="shareTips_popup"
      popup-transition="popup-fade">
      <div class="shareTips_text" @click="shareTips = false">请点击右上角分享给朋友圈</div>
    </mt-popup>
  </div>
</template>

<script>
import { Popup, Toast } from 'mint-ui'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'shopMain',
  mounted () {
    if (this.$route.params.item) {
      this.orderItem = this.$route.params.item
      if (this.orderItem.orderList.isShare === '0') {
        this.$http.post(this.$urlConfig.getShare, {
          data: this.userInfo,
          share: {
            OrderId: this.orderItem.orderList.OrderId
          }
        }).then((data1) => {
          var result1 = data1.data
          if (parseInt(result1.errcode) !== 0) {
            Toast(result1.errmsg)
            return
          }
          window.wx.config({
            debug: false,
            appId: result1.configData.appId,
            timestamp: result1.configData.timestamp,
            nonceStr: result1.configData.nonceStr,
            signature: result1.configData.signature,
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage']
          })
          window.wx.ready(() => {
            window.wx.onMenuShareTimeline({
              title: result1.shareData.share_title, // 分享标题
              link: result1.shareData.share_url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: result1.shareData.share_pic, // 分享图标
              success: () => {
                this.reportShare('1')
              },
              cancel: () => {
                // 用户取消分享后执行的回调函数
              }
            })
            window.wx.onMenuShareAppMessage({
              title: result1.shareData.share_title, // 分享标题
              desc: result1.shareData.share_content, // 分享描述
              link: result1.shareData.share_url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: result1.shareData.share_pic, // 分享图标
              type: '', // 分享类型,music、video或link，不填默认为link
              dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
              success: () => {
                this.reportShare('2')
              },
              cancel: () => {
                // 用户取消分享后执行的回调函数
              }
            })
          })
          window.wx.error((res) => {
            Toast(res)
          })
        }).catch((e) => {
          console.log(e)
        })
      }
    } else {
      this.$router.push({name: 'shopMain', query: this.$route.query})
    }
    this.$nextTick(() => {
      this.$refs.order_detail.style.height = (document.documentElement.clientHeight - this.$refs.order_detail.getBoundingClientRect().top) + 'px'
      this.$refs.order_detail.style.overflow = 'auto'
    })
  },
  components: {
    [Popup.name]: Popup
  },
  data () {
    return {
      defaultImg: require('../assets/default_log.png'),
      shareTips: false,
      orderItem: {
        coupon: [],
        discount: [],
        shopInfo: {},
        orderList: {},
        items: []
      }
    }
  },
  computed: {
    ...mapGetters([
      'shopInfo',
      'orderInfo',
      'userInfo'
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
      this.$router.push({name: 'payOrder', query: this.$route.query})
    },
    gotoMain () {
      this.$router.push({name: 'shopMain', query: this.$route.query})
    },
    gotoDetail (item) {
      console.log(item.orderId)
    },
    reportShare (type) {
      this.$http.post(this.$urlConfig.reportShare, {
        data: this.userInfo,
        share: {
          OrderId: this.orderItem.orderList.OrderId,
          from_type: type,
          share_type: '1'
        }
      }).then((data) => {
        var result = data.data
        if (parseInt(result.errcode) !== 0) {
          Toast(result.errmsg)
          return
        } else {
          Toast('分享成功！')
        }
      }).catch((e) => {
        console.log(e)
      })
    }
  },
  watch: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .order_detail {
  }
  .finish_top {
    background: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .finish_top_time {
    width: 80px;
    display: flex;
    justify-content: center;
    position: relative;
  }
  .finish_top_time_area {
    height: 80px;
    width: 80px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #ffffff;
    margin: 10px 0;
  }
  .finish_tips {
    background: #00a9fe url("../assets/exclamation_mark@2x.png") no-repeat right;
    background-size: 16px 16px;
    background-position-x: 95%;
    font-size: 10px;
    border-radius: 4px;
    padding: 5px;
    padding-right: 25px;
    color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .finish_tips2 {
    color: #2395ff;
    font-size: 10px;
    padding-top: 6px;
  }
  .finish_tips3 {
    font-weight: bold;
    font-size: 18px;
    padding-top: 18px;
    margin-bottom: 18px;
  }
  .finish_luckyMoney {
    background: url("../assets/packet_icon@2x.png") no-repeat left;
    background-size: 16px 16px;
    background-position-x: 5%;
    font-size: 10px;
    margin-bottom: 12px;
    padding: 5px;
    padding-left: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .detail_content {
    background: #F5F5F5;
    padding: 10px 8px;
  }
  .detail_content_order {
    background: #ffffff;
    margin-bottom: 10px;
  }
  .order_line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px dashed #eeeeee;
    margin: 0 15px;
    color: #333333;
    padding: 10px 0;
  }
  .order_name {
    font-size: 15px;
    width: 60%;
  }
  .order_acount {
    font-size: 14px;
    width: 15%;
    text-align: right;
  }
  .order_amount {
    font-size: 14px;
    width: 25%;
    text-align: right;
  }
  .unit {
    font-size: 12px;
  }
  .unit2 {
    font-size: 14px;
  }
  .total_amount {
    font-size: 18px;
  }
  .reduce {
    color: #ff5339;
  }
  .reduce_icon {
    background: url("../assets/reduce.png") no-repeat;
    background-position: left;
    background-size: 16px 16px;
    padding-left: 20px;
  }
  .lucky_money_line {
    margin-top: 2px;
    margin-left: 15px;
    margin-right: 15px;
    border-top: 1px solid #eeeeee;
    border-bottom: 1px solid #eeeeee;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
  }
  .total_line {
    border: 0;
  }
  .order_list_item_content_name_text {
    width: 100%;
    font-size: 16px;
    color: #333333;
    font-weight: bold;
    background: url("../assets/business_a@2x.png") no-repeat;
    background-position: right;
    background-size: contain;
    padding-right: 20px;
  }
  .is_lucky_money {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 70%;
  }
  .luckyMoneyText {
    height: 120%;
    font-size: 12px;
    border-radius: 4px;
    background: #d7c56f;
    color: #ffffff;
    padding: 5px;
    margin-right: 10px;
  }
  .order_info_title {
    padding: 10px 0;
    margin: 0 15px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color: #333333;
    font-weight: bold;
    height: 40px;
  }
  .order_info_line {
    margin: 0 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    border-bottom: 1px solid #eeeeee;
  }
  .order_info_line_title {
    font-size: 16px;
    color: #333333;
  }
  .order_info_line_text {
    font-size: 13px;
    color: #666666;
  }
  .order_list_item_content_name_gotoPay {
    padding: 5px 10px;
    border: 1px solid #ff6952;
    color: #ff5339;
    border-radius: 5px;
    margin-top: 15px;
  }
  .icon_1 {
    background-image: url("../assets/jian@2x.png");
    background-repeat: no-repeat;
  }
  .icon_2 {
    background-image: url("../assets/zeng.png");
    background-repeat: no-repeat;
  }
  .icon_3 {
    background-image: url("../assets/xin@2x.png");
    background-repeat: no-repeat;
  }
  .icon_4 {
    background-image: url("../assets/zhuan@2x.png");
    background-repeat: no-repeat;
  }
  .shareTips_popup {
    top: 0;
    width: 100%;
  }
  .shareTips_text {
    position: absolute;
    padding-top: 200px;
    text-align: center;
    width: 100%;
    font-size: 20px;
    color: #ffffff;
    background: url("../assets/shareTips.png") no-repeat;
    background-size: 30%;
    background-position: top right;
  }
</style>
