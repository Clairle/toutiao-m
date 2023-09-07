<template>
    <div class="channel-edit">
        <!-- 我的频道 -->
        <van-cell :border="false">
            <div slot="title" class="title-text">我的频道</div>
            <van-button
                class="edit-btn"
                size="mini"
                round
                type="danger"
                plain
                @click="isEdit = !isEdit"
            >{{ isEdit ? '完成' : '编辑' }}</van-button>
        </van-cell>
        <!-- 宫格区域 -->
        <van-grid class="my-grid" :gutter="10">
            <van-grid-item
                class="grid-item"
                v-for="(channel, index) in userChannels"
                :key="index"
                @click="onMyChannelClick(channel, index)"
            >
            <van-icon
                v-show="isEdit && !fiexdChannels.includes(channel.id)"
                slot="icon"
                name="clear"
            >
            </van-icon>
                <span class="text"
                    :class="{active: index === active }"
                    slot="text"
                 >{{ channel.name }}</span>
            </van-grid-item>
        </van-grid>

        <!-- 频道推荐 -->
        <van-cell :border="false">
            <div slot="title" class="title-text">频道推荐</div>
        </van-cell>
        <van-grid class="recommend-grid" :gutter="10">
            <van-grid-item
                class="grid-item"
                v-for="(channel, index) in recommendChannels"
                :key="index"
                icon="plus"
                :text="channel.name"
                @click="onAddChannel(channel)"
            />
        </van-grid>
    </div>
</template>
  
<script>
// 获取所有频道模块
import { deleteUserChannel, getAllChannels } from '@/api/channel'
// 后台添加用户频道模块
import { addUserChannel } from '@/api/channel'
// 用户获取token
import { mapState } from 'vuex'
// 本地存储模块（用于未登录标签数据）
import { setItem } from '@/utils/storage'


export default {
    name: 'ChannelEdit',
    components: {},
    props: {
        userChannels: {
            type: Array,
            required: true
        },
        active: {
            type: Number,
            required: true
        }
    },
    data () {
      return {
        allChannels: [], // 所有频道
        isEdit: false, // 控制编辑状态的显示
        fiexdChannels:[0] // 固定频道，不允许删除
      }
    },
    computed: {
      // 用户token数组展开
      ...mapState(['user']),
      // 推荐频道展示计算属性简写
      recommendChannels (){
        // 遍历数组，把符合条件的元素存储到新数组中并返回
        return this.allChannels.filter(channel => {
          // 把符合条件的第1个元素返回 不要漏了return返回其值
          return !this.userChannels.find(myChannel => myChannel.id === channel.id)
        })
      }
 
      // 推荐频道计算属性
      // recommendChannels() {
      //   const channels = []
      //   this.allChannels.forEach(channel => {
      //     // find 遍历数组，找到满足条件的元素项
      //     const ret = this.userChannels.find(userChannels => { 
      //       return userChannels.id === channel.id
      //     })
      //     // 如果我的频道中不包括该频道项，则收集到推荐频道中
      //     if (!ret) {
      //       channels.push(channel)
      //     }
      //   })
      //   return channels
      // }


    },
    watch: {},
    created () {
        this.loadAllChannels()
    },
    mounted () {},
    methods: {
        async loadAllChannels() {
            try {
                    const { data } = await getAllChannels()
                    this.allChannels = data.data.channels
                } catch (err) {
                    this.$toast('数据获取失败')
                }
        },

        // 从推荐频道向我的频道添加标签
        // 当执行该函数之后，计算属性中的recommendChannels()发生了变化
        // 而一旦计算依赖的数据发生变化，计算属性会重新执行上面的推荐频道遍历函数
        // 因此不需要再将推荐频道数组中推出的元素删除
        async onAddChannel(channel) {
          this.userChannels.push(channel)

          // 数据持久化
          if (this.user) {
            try {
              // 已登录，把数据请求接口放到线上
              await addUserChannel({
                id: channel.id, // ├─ id
                seq: this.userChannels.length  // ├─ seq序号
              }) 
            } catch (err) {
              this.$toast('保存失败，请稍后重试')
            }
          }
          else {
            // 未登录，把数据存储到本地
            setItem('TOUTIAO_CHANNELS', this.userChannels)
          }
        },

        // 我的频道编辑功能
        onMyChannelClick (channel, index) {
          // 编辑状态就执行删除频道项目
          if(this.isEdit) {
            // 1. 如果是固定频道，则不删除
            if (this.fiexdChannels.includes(channel.id)) {
              return
            }
            // 2. 删除频道项
            this.userChannels.splice(index, 1)

            // 3. 如果删除的激活频道之前的频道，则active-1,以保证激活的频道项目不变
            if (index <= this.active) {
              // 让激活频道的索引 - 1
              this.$emit('update-active', this.active - 1, true)
            }

            // 删除频道的数据持久化
            this.deleteChannel(channel)
            
          }else{
            // 非编辑状态就在home中切换到该频道
            this.$emit('update-active',index, false)
          }
        },

        // 删除持久化逻辑
        async deleteChannel (channel) {
          try {
            // 已登录，则将数据更新到线上
            if (this.user) {
              await deleteUserChannel(channel.id)
            } 
            // 未登录，将数据更新到本地
            else {
              setItem('TOUTIAO_CHANNELS', this.userChannels)
            }
          } catch (err) {
            this.$toast('操作失败，请稍后重试')
          }
        }
    }
}
</script>
  
<style scoped lang="less">
.channel-edit {
  padding: 85px 0;

  .title-text {
    font-size: 32px;
    color: #333333;
  }

  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }

  /deep/ .grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
      .van-grid-item__text, .text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }
      .active {
        color: red;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }

  /deep/ .my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }

  /deep/ .recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
  