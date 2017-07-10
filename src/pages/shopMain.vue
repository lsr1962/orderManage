<template>
  <div class="shopMain">
    <div class="shopMain_top">
      <img class="shopMain_top_icon" src="../assets/default_log.png">
      <div class="shopMain_top_info">
        <div class="shopMain_top_info_name">{{shop_name}}</div>
        <div class="shopMain_top_info_intro">{{shop_intro}}</div>
        <div class="shopMain_top_info_tips">{{shop_tips}}</div>
      </div>
    </div>
    <div class="shopMain_sales">
      <div class="shopMain_sales_line" v-for="(item, key) in salesList" :key="item.id" v-if="(key !== 0 && pullDown) || (key === 0)">
        <div class="shopMain_sales_line_detail" >{{item.name}}</div>
        <div :class="button_type" v-if="key === 0" @click="toggleType">{{salesList.length}}个活动</div>
      </div>
    </div>
    <div class="shopMain_list">
      <div class="shopMain_list_title">商品</div>
      <div class="shopMain_list_total" ref="list_frame">
        <div class="shopMain_list_total_kind">
          <div v-for="(item, key) in kindList" :key="item.id" :class="'kind_item ' + (key === chosenKind ? 'chosen' : '')" @click="chosenKind = key">
            {{item.name}}
            <div class="kind_item_line" v-if="(key !== chosenKind) && ((key + 1) !== chosenKind)"></div>
          </div>
        </div>
        <div class="shopMain_list_total_menu">
          <div v-for="(item, key) in menuList" :key="item.id" class="menu_item">
            <div class="menu_item_left">
              <img class="menu_item_left_img" :src="item.img || defaultImg"/>
            </div>
            <div class="menu_item_right">
              <div class="menu_item_right_title">{{item.name}}</div>
              <div class="menu_item_right_line">
                <div class="menu_item_right_line_left">￥{{item.price}}</div>
                <div class="menu_item_right_line_right"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="shopMain_list_bottom"></div>
    </div>
  </div>
</template>

<script>
import { Cell } from 'mint-ui'
export default {
  name: 'shopMain',
  mounted () {
    this.resizeList()
  },
  components: {
    [Cell.name]: Cell
  },
  data () {
    return {
      pullDown: false,
      chosenKind: 0,
      shop_name: '店铺名称店铺名称',
      shop_intro: '店铺介绍信息',
      shop_tips: '店铺提示信息',
      defaultImg: require('../assets/default_log.png'),
      salesList: [
        {id: '1', name: '满20减12'},
        {id: '2', name: '满100减20'},
        {id: '3', name: '满500减100'},
        {id: '4', name: '满1000减200'}
      ],
      kindList: [
        {type: '1', name: '热销'},
        {type: '2', name: '优惠'},
        {type: '3', name: '满20减12'},
        {type: '4', name: '折扣单品'},
        {type: '5', name: '折扣小食'},
        {type: '6', name: '折扣套餐'},
        {type: '7', name: '热菜'},
        {type: '8', name: '凉菜'},
        {type: '9', name: '汤粥'},
        {type: '10', name: '主食'},
        {type: '11', name: '饮料'}
      ],
      menuList: [
        {type: '1', name: '菜单1', img: '', price: 10, count: 0},
        {type: '2', name: '菜单2', img: '', price: 11, count: 0},
        {type: '3', name: '菜单3', img: '', price: 20, count: 0},
        {type: '4', name: '菜单4', img: '', price: 25, count: 0},
        {type: '5', name: '菜单5', img: '', price: 100, count: 0},
        {type: '6', name: '菜单6', img: '', price: 70, count: 0},
        {type: '7', name: '菜单7', img: '', price: 45, count: 0},
        {type: '8', name: '菜单8', img: '', price: 23, count: 0},
        {type: '9', name: '菜单9', img: '', price: 16, count: 0},
        {type: '10', name: '菜单10', img: '', price: 87, count: 0}
      ]
    }
  },
  computed: {
    button_type () {
      return this.pullDown ? 'shopMain_sales_line_button2' : 'shopMain_sales_line_button1'
    }
  },
  methods: {
    toggleType () {
      this.pullDown = !this.pullDown
      this.$nextTick(() => {
        this.resizeList()
      })
    },
    resizeList () {
      this.$refs.list_frame.style.height = (document.documentElement.clientHeight - this.$refs.list_frame.getBoundingClientRect().top) + 'px'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .shopMain_top {
    height: 100%;
    display: flex;
    justify-content: center;
    font-size: 16px;
    color: #FFFFFF;
    text-align: left;
    background: #34A1FB;
    background-size: cover;
    padding-top: 15px;
  }
  .shopMain_top_icon {
    width: 60px;
    height: 60px;
    margin: 10px 15px;
    align-self: center;
  }
  .shopMain_top_info {
    width: 70%;
    padding: 10px 0 10px 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .shopMain_top_info_name {
    font-size: 20px;
    background: url("../assets/more.png") no-repeat;
    background-position: right;
    background-size: contain;
  }
  .shopMain_sales {
    font-size: 15px;
    padding: 15px 0;
  }
  .shopMain_sales_line {
    padding: 5px 10px;
    display: flex;
    justify-content: space-between;
  }
  .shopMain_sales_line_button1 {
    background: url("../assets/unfold.png") no-repeat;
    background-position: right;
    background-size: contain;
    padding-right: 20px;
  }
  .shopMain_sales_line_button2 {
    background: url("../assets/packup.png") no-repeat;
    background-position: right;
    background-size: contain;
    padding-right: 20px;
  }
  .shopMain_list {
    position: relative;
  }
  .shopMain_list_total {
    display: flex;
    justify-content: center;
    padding-bottom: 50px;
    border-top: 1px solid #34A1FB;
  }
  .shopMain_list_title {
    padding: 0 0 5px 15px;
    font-size: 20px;
    color: #34A1FB;
  }
  .shopMain_list_total_kind {
    width: 30%;
    height: 100%;
    overflow: auto;
  }
  .shopMain_list_total_menu {
    width: 70%;
    height: 100%;
    overflow: auto;
    padding: 10px;
  }
  .shopMain_list_bottom {
    height: 50px;
    position: absolute;
    bottom: 0;
    width: 100%;
    background: #34A1FB;
  }
  .kind_item {
    font-size: 15px;
    height: 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    background: #F8F8F8;
    position: relative;
  }
  .kind_item_line {
    position: absolute;
    bottom: 0;
    margin: auto 15%;
    width: 70%;
    height: 1px;
    background-color: #34A1FB;
    opacity: 0.3;
  }
  .chosen {
    background: #ffffff;
  }
  .menu_item {
    font-size: 15px;
    height: 100px;
    display: flex;
    justify-content: center;
    text-align: center;
    padding-bottom: 5px;
  }
  .menu_item_left {
    width: 30%;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
  .menu_item_left_img {
    width: 100%;
  }
  .menu_item_right {
    width: 70%;
    padding-left: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
  .menu_item_right_title {
    font-size: 20px;
    text-align: left;
  }
  .menu_item_right_line {
    display: flex;
    justify-content: space-between;
    font-size: 15px;
    color: #34A1FB;
  }
</style>
