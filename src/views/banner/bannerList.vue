<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input style="width: 200px;" @keyup.enter.native="handleFilter" class="filter-item" placeholder="图片标题" v-model="listQuery.title">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">添加</el-button>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <el-table :data="list" v-loading="listLoading" element-loading-text="正在加载中..." border fit highlight-current-row style="width: 100%">
		<el-table-column type="selection"width="60"></el-table-column>

     <el-table-column align="center" label="序号" width="90">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
     </el-table-column>
           
      <el-table-column width="200px" align="center" label="上传图片">
        <template scope="scope">
          <img :src="scope.row.imgpath" id="img"/>
        </template>
      </el-table-column>

      <el-table-column width='260px' label="图片标题">
        <template scope="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>
      
      <!--<el-table-column width="360px" align="center" label="图片路径">
        <template scope="scope">
          <span>{{scope.row.imgpath}}</span>
        </template>
      </el-table-column>-->
      
      <el-table-column width="110px" align="center" label="是否显示">
        <template scope="scope">
          <span>{{scope.row.isshow}}</span>
        </template>
      </el-table-column>
      
      <el-table-column width="420px" align="center" label="图片描述">
        <template scope="scope">
          <div v-html="scope.row.description"></div>
        </template>
      </el-table-column>
      
      <el-table-column width="250px" align="center" label="创建时间">
        <template scope="scope">
          <span>{{scope.row.createtime}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="180">
        <template scope="scope">
          <el-button v-if="scope.row.status!='published'" size="small" type="success" @click="handleUpdate(scope.row.id)">编辑
          </el-button>
          <el-button v-if="scope.row.status!='deleted'" size="small" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
import { ListBanner, DeleteBanner } from '@/api/banner'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'

export default {
  name: 'complexTable',
  directives: {
    waves
  },
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      temp: {
        id: undefined,
        title: '',
        imgpath: '',
        isshow: '',
        description: ''
      },
      dialogFormVisible: false,
      dialogTitle: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      ListBanner(this.listQuery).then(res => {
        this.list = res.data.data
        this.total = res.data.count
        console.log(this.list)
        this.listLoading = false
        for (const key in this.list) {
          if (this.list[key].imgpath.substr(0, 4) !== 'http') {
            this.list[key].imgpath = 'http://114.55.249.153:8028' + this.list[key].imgpath
          }
        }
      })
    },
    handleFilter() {
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        title: '',
        imgpath: '',
        isshow: '',
        description: ''
      }
    },
    handleCreate() {
      this.$router.push({ path: 'bannerAdd/0' })
    },
    handleUpdate(id) {
      this.$router.push('bannerAdd/' + id)
    },
    updateData() {},
    resetForm(formName) {
      this.dialogFormVisible = false
      this.$refs[formName].resetFields()
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        var data = { id: row.id }
        DeleteBanner(data)
          .then((result) => {
            if (!result.error_code) {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            } else {
              console.log('删除失败')
              this.getList()
            }
          }, () => {
            console.log('操作失败')
          })
      })
    },
    handleDownload() {
      require.ensure([], () => {
        const { export_json_to_excel } = require('vendor/Export2Excel')
        const tHeader = ['上传图片', '图片标题', '是否显示', '图片描述', '创建时间']
        const filterVal = ['imgpath', 'title', 'isshow', 'description', 'createtime']
        const data = this.formatJson(filterVal, this.list)
        export_json_to_excel(tHeader, data, '图片信息')
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
<style scoped="scoped" type="text/css">
	#img{
		width: 50px;
		height: 50px;
	}
</style>