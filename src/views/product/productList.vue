<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input style="width: 200px;" @keyup.enter.native="handleFilter" class="filter-item" placeholder="商品名称" v-model="listQuery.goodsname">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">添加</el-button>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <el-table :data="list" v-loading="listLoading" element-loading-text="正在加载中..." border fit highlight-current-row style="width: 100%">
		<el-table-column type="selection"width="60"></el-table-column>

     <el-table-column align="center" label="商品id" width="100">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
     </el-table-column>

      <el-table-column width='160px' label="商品名称">
        <template scope="scope">
          <span>{{scope.row.goodsname}}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="价格">
        <template scope="scope">
          <span>{{scope.row.price}}</span>
        </template>
      </el-table-column>
      
      <el-table-column width="180px" align="center" label="库存">
        <template scope="scope">
          <span>{{scope.row.stock}}</span>
        </template>
      </el-table-column>
      
      <el-table-column width="180px" align="center" label="类型">
        <template scope="scope">
          <span>{{scope.row.sale_ty}}</span>
        </template>
      </el-table-column>
      
      <el-table-column width="180px" align="center" label="状态">
        <template scope="scope">
          <span>{{scope.row.status}}</span>
        </template>
      </el-table-column>
      
      <el-table-column width="230px" align="center" label="简述">
        <template scope="scope">
          <span>{{scope.row.description}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="210">
        <template scope="scope">
          <el-button v-if="scope.row.status!='published'" size="small" type="success" @click="handleUpdate(scope.row.id)">编辑
          </el-button>
          <el-button v-if="scope.row.status!='deleted'" size="small" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
    	 :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" background layout="total, sizes, prev, pager, next, jumper" :total="total">
    	
    </el-pagination>

  </div>
</template>

<script>
import { listByPage, DeleteGoods } from '@/api/goods'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'

const defaultForm = {
  id: undefined,
  goodsname: '',
  price: '',
  stock: '',
  sale_ty: '',
  status: '',
  description: ''
}

export default {
  name: 'complexTable',
  directives: {
    waves
  },
  data() {
    return {
      postForm: Object.assign({}, defaultForm),
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      listByPage(this.listQuery).then(res => {
        this.list = res.data.data
        this.total = Number(res.data.count)
        console.log(this.list)
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
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
      this.postForm = {
        goodsname: '',
        price: '',
        stock: '',
        sale_ty: '',
        status: '',
        description: ''
      }
    },
    handleCreate() {
      this.$router.push({ path: '/product/productAdd/0' })
    },
    handleUpdate(id) {
      this.$router.push('/product/productAdd/' + id)
    },
    updateData(formName) {
    },
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
        DeleteGoods(data)
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
        const tHeader = ['商品id', '商品名称', '价格', '库存', '类型', '状态']
        const filterVal = ['id', 'goodsname', 'pic', 'stock', 'sale_ty', 'status']
        const data = this.formatJson(filterVal, this.list)
        export_json_to_excel(tHeader, data, '商品列表')
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
