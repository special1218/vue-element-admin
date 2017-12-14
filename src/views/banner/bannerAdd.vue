<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">
      	<el-row>
				  <el-col :span="8">
				  	<el-form-item label-width="100px" label="标题:" class="postInfo-container-item">
              <el-input placeholder="图片标题" style='min-width:150px;' v-model="postForm.title">
	              </el-input>
	            </el-form-item>
				  </el-col>
	
				  <el-col :span="8">
			      <el-form-item label-width="100px" label="上传图片:" class="postInfo-container-item" style="margin-left: 50%;">
              <el-upload style="width: 500px; height: 100px;"
							  action="http://114.55.249.153:8028/goods/singleUpload"
							  list-type="picture-card"
		            :on-error="handleError" :on-success="handleSuccess"
							  :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :file-list="imgList">
							  <i class="el-icon-plus"></i>
							</el-upload>
								<el-dialog :visible.sync="dialogVisible" size="tiny">
								  <img width="100%" :src="baseUrl + postForm.imgpath" alt="">
								</el-dialog>
		            </el-form-item>
			    </el-col>
				</el-row>
				
				<el-row style='width: 300px;'>
					<el-col :span="6">
			      <el-form-item label-width="100px" label="是否显示:" class="postInfo-container-item" style="margin-left: 50%;">
              <el-radio-group v-model="postForm.isshow" style="width: 300px;">
										<el-radio :label="0">否</el-radio>
										<el-radio :label="1">是</el-radio>
							  </el-radio-group>
            </el-form-item>
			    </el-col>
				</el-row>
        
				<p>图片描述：</p>
        <div class="editor-container">
          <tinymce :height=200 v-model="postForm.description"></tinymce>
        </div>
        
        <div id="btn">
        	<el-button @click="back()">取消</el-button>
          <el-button type="primary" @click="sure()">确 定</el-button>
        </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import MDinput from '@/components/MDinput'
import Multiselect from 'vue-multiselect'// 使用的一个多选框组件，element-ui的select不能满足所有需求
import 'vue-multiselect/dist/vue-multiselect.min.css'// 多选框组件css
import Sticky from '@/components/Sticky' // 粘性header组件
import { AddBanner, UpdateBanner, getModelById } from '@/api/banner'

const defaultForm = {
  title: '', // 文章题目
  isshow: '',
  description: '',
  imgpath: ''
}

export default {
  components: { Tinymce, MDinput, Multiselect, Sticky },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(null)
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      imgList: [],
      baseUrl: '',
      fetchSuccess: true,
      dialogVisible: false,
      rules: {
        name: [{ validator: validateRequire }],
        sale_ty: [{ validator: validateRequire }],
        status: [{ validator: validateRequire }]
      }
    }
  },
  created() {
    this.postForm = Object.assign({}, defaultForm)
    const id = this.$route.params.id
    console.log(id)
    if (id > 0) {
      getModelById({ id: id }).then(res => {
        this.postForm = res.data.data
        this.baseUrl = this.postForm.imgpath.substr(0, 4) === 'http' ? '' : 'http://114.55.249.153:8028'
        this.imgList = [{ url: this.baseUrl + this.postForm.imgpath }]
      })
    }
  },
  methods: {
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 上传成功的钩子函数
    handleSuccess(response) {
      this.postForm.imgpath = response.url
      console.log(response)
      this.baseUrl = 'http://114.55.249.153:8028'
      this.imgList = [{ url: this.baseUrl + this.postForm.imgpath }]
    },
    // 上传失败的钩子函数
    handleError(response) {
      this.$message.error('上传图片失败')
    },
    // 图片删除的钩子函数
    handleRemove() {
      console.log('已删除此照片')
    },
    sure() {
      this.postForm.isshow = String(this.postForm.isshow)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (!this.postForm.id) {
            AddBanner(this.postForm).then(res => {
              this.$notify({
                title: '成功',
                message: '添加商品成功',
                type: 'success',
                duration: 2000
              })
              this.$store.state.app.visitedViews.pop()
              this.$router.push({ path: '/banner/bannerList' })
            })
          } else {
            UpdateBanner(this.postForm).then(res => {
              this.$notify({
                title: '成功',
                message: '修改商品成功',
                type: 'success',
                duration: 2000
              })
              this.$store.state.app.visitedViews.pop()
              this.$router.push({ path: '/banner/bannerList' })
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    back() {
      this.$router.push({ path: '/banner/bannerList' })
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    draftForm() {
      if (this.postForm.content.length === 0 || this.postForm.title.length === 0) {
        this.$message({
          message: '请填写必要的标题和内容',
          type: 'warning'
        })
        return
      }
      this.$message({
        message: '保存成功',
        type: 'success',
        showClose: true,
        duration: 1000
      })
      this.postForm.status = 'draft'
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped="scoped">
  @import "src/styles/mixin.scss";
  .title-prompt{
    position: absolute;
    right: 0px;
    font-size: 12px;
    top:10px;
    color:#ff4949;
  }
  .createPost-container {
    position: relative;
    padding: 40px 45px 20px 50px;
  }
.createPost-container .createPost-main-container .editor-container[data-v-20c9dc59] {
    min-height: 200px;
}
#btn{
  	width: 100%;
  	text-align: center;
  	height: 60px;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

