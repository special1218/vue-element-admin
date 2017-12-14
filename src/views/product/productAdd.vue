<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" ref="postForm">

      <div class="createPost-main-container">
      	<el-row :gutter="20">
				  <el-col :xs="4" :sm="6" :md="7" :lg="8">
				  	<el-form-item label-width="100px" label="商品名称:" class="postInfo-container-item">
	            <el-input placeholder="请输入商品名称" style='min-width:150px;' v-model.trim="postForm.goodsname">
	              </el-input>
	          </el-form-item>
				  </el-col>
				  <el-col :xs="4" :sm="6" :md="7" :lg="8">
				  	<el-form-item label-width="100px" label="推荐类型:" class="postInfo-container-item">
              <el-select v-model="postForm.sale_ty" placeholder="请选择">
							    <el-option v-for="item in sale_ty"
							    	 :label="item.label"
							    	 :value="item.sale_ty">
							    </el-option>
							  </el-select>
						  </el-form-item>
				  </el-col>
				  <el-col :xs="4" :sm="6" :md="7" :lg="8">
				  	<el-form-item label-width="100px" label="商品价格:" class="postInfo-container-item">
                <el-input placeholder="请输入商品价格" style='min-width:150px' v-model.trim="postForm.price">
                  </el-input>
              </el-form-item>
				  </el-col>
				</el-row>
				
				<el-row :gutter="20">
						<el-col :xs="4" :sm="6" :md="7" :lg="8">
				  	<el-form-item label-width="100px" label="商品库存:" class="postInfo-container-item">
                <el-input placeholder="请输入商品库存" style='min-width:150px;' v-model.trim="postForm.stock">
                  </el-input>
              </el-form-item>
				  </el-col>
				  <el-col :xs="4" :sm="8" :md="8" :lg="8">
				  	<el-form-item label-width="100px" label="商品状态">
						    <el-radio-group v-model="postForm.status">
										<el-radio :label="0">未上架</el-radio>
										<el-radio :label="1">审核中</el-radio>
										<el-radio :label="2">已上架</el-radio>
							  </el-radio-group>
				    </el-form-item>
				  </el-col>
				</el-row>
					
        <el-form-item label-width="100px" label="商品概述:">
          <el-input type="textarea" class="article-textarea" autosize placeholder="请输入内容" v-model.trim="postForm.description">
          </el-input>
        </el-form-item>
        
        <div id="btn">
        	<el-button @click="back()">取消</el-button>
          <el-button type="primary" @click="sure()">确 定</el-button>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'

import { AddGoods, UpdateGoods, getModelById } from '@/api/goods'

export default {
  components: { Tinymce },
  data() {
    return {
      sale_ty: [{
        sale_ty: '0',
        label: '本周推荐'
      }, {
        sale_ty: '1',
        label: '本月推荐'
      }, {
        sale_ty: '2',
        label: '套装推荐'
      }, {
        sale_ty: '3',
        label: '推荐列表'
      }],
      postForm: {
        goodsname: '',
        price: '',
        stock: '',
        sale_ty: '',
        status: '2'
      },
      formInline: ''
    }
  },
  created() {
    const id = this.$route.params.id
    console.log(id)
    if (id > 0) {
      getModelById({ id: id }).then(res => {
        this.postForm = res.data.data
        if (!this.postForm.description) {
          this.postForm.description = ''
        }
      })
    }
  },
  methods: {
    resetTemp() {
      this.postForm = {
        goodsname: '',
        price: '',
        stock: '',
        sale_ty: '',
        status: '',
        description: ''
      }
    },
    sure() {
      // 根据id判断 修改操作（true）还是删除操作
      if (this.postForm.id) {
        UpdateGoods(this.postForm)
          .then(res => {
            if (!res.error_code) {
              console.log('修改成功')
              this.$router.push({ path: '/product/productList' })
              this.$store.state.app.visitedViews.pop()
              this.postForm.goodsname = ''
              this.postForm.price = ''
              this.postForm.stock = ''
              this.postForm.sale_ty = ''
              this.postForm.status = ''
              this.postForm.description = ''
            }
          }, () => {
            console.log('操作失败')
          })
      } else {
        AddGoods(this.postForm)
          .then(res => {
            if (!res.error_code) {
              console.log('添加成功')
              this.$router.push({ path: '/product/productList' })
              this.$store.state.app.visitedViews.pop()
            }
          }, () => {
            console.log('操作失败')
          })
      }
    },
    back() {
      this.$router.push({ path: '/product/productList' })
      this.$store.state.app.visitedViews.pop()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .createPost-container {
    position: relative;
    .createPost-main-container {
      padding: 40px 45px 20px 50px;
      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 10px;
        .postInfo-container-item {
          float: left;
        }
      }
    }
    .word-counter {
      width: 40px;
      position: absolute;
      right: -10px;
      top: 0px;
    }
  }
  #btn{
  	width: 100%;
  	text-align: center;
  	height: 60px;
  }
</style>

