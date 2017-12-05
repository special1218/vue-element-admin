<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input style="width: 200px;" class="filter-item" placeholder="标题" v-model="listQuery.title">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">添加</el-button>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <el-table :data="list" v-loading="listLoading" element-loading-text="正在加载中..." border fit highlight-current-row style="width: 100%">
		<el-table-column type="selection"width="55"></el-table-column>

     <el-table-column align="center" label="序号" width="110">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
     </el-table-column>

      <el-table-column width='160px' label="姓名">
        <template scope="scope">
          <span>{{scope.row.username}}</span>
        </template>
      </el-table-column>
      
      <el-table-column width="120px" align="center" label="性别">
        <template scope="scope">
          <span>{{scope.row.sex}}</span>
        </template>
      </el-table-column>
      
      <el-table-column width="220px" align="center" label="电子邮件">
        <template scope="scope">
          <span>{{scope.row.email}}</span>
        </template>
      </el-table-column>
      
      <el-table-column width="200px" align="center" label="手机号码">
        <template scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>
      
      <el-table-column width="230px" align="center" label="备注">
        <template scope="scope">
          <span>{{scope.row.remark}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="180">
        <template scope="scope">
          <el-button v-if="scope.row.status!='published'" size="small" type="success" @click="handleUpdate(scope.row)">编辑
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

        <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
	      <el-form class="small-space" :model="temp" ref="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
	        <el-form-item label="姓名" prop="username"
	        		:rules="[
	        			{ required: true, message: '姓名不能为空'}
	        		]"
	        >
	          <el-input v-model.trim="temp.username"></el-input>
	        </el-form-item>
	        
	        <el-form-item label="性别">
		        <el-radio-group v-model="temp.sex">
				      <el-radio label="男"></el-radio>
				      <el-radio label="女"></el-radio>
				    </el-radio-group>
			    </el-form-item>
	
	        <el-form-item label="Email" prop="email"
	        		:rules="[
	        			{ required: true, message: '电子邮件不能为空'}
	        		]"
	        >
	          <el-input v-model.trim="temp.email"></el-input>
	        </el-form-item>
	
	        <el-form-item label="手机号" prop="phone"
	        		:rules="[
	        			{ required: true, message: '手机号不能为空'}
	        		]"
	        >
	          <el-input v-model.trim="temp.phone"></el-input>
	        </el-form-item>
	
	        <el-form-item label="备注">
	          <el-input type='textarea' placeholder='请输入内容' :autosize="{ minRows: 2, maxRows: 4}" v-model.trim="temp.remark"></el-input>
	        </el-form-item>
	      </el-form>
	      <div slot="footer" class="dialog-footer">
	        <el-button @click="dialogFormVisible = false">取 消</el-button>
	        <el-button type="primary" @click="updateData('temp')">确 定</el-button>
	      </div>
	    </el-dialog>

  </div>
</template>

<script>
import { fetchList, AddUser, UpdateUser, DeleteUser } from '@/api/article'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'

export default {
  name: 'complexTable',
  directives: {
    waves
  },
  data() {
    return {
      radio: '0',
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      temp: {
        id: undefined,
        username: '',
        password: '888888',
        sex: '',
        email: '',
        phone: '',
        remark: ''
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
      fetchList(this.listQuery).then(res => {
        this.list = res.data.data
        this.total = res.data.count
        console.log(this.list)
        this.listLoading = false
      })
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
        username: '',
        password: '888888',
        sex: '',
        email: '',
        phone: '',
        remark: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogTitle = '添加用户'
      this.dialogFormVisible = true
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogTitle = '修改用户'
      this.dialogFormVisible = true
    },
    updateData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 根据id判断 修改操作（true）还是删除操作
          if (this.temp.id) {
            console.log(this.temp.id)
            UpdateUser(this.temp)
              .then((result) => {
                if (!result.error_code) {
                  this.dialogFormVisible = false
                  this.getList()
                }
              }, () => {
                console.log('操作失败')
              })
          } else {
            AddUser(this.temp)
              .then((res) => {
                if (!res.error_code) {
                  this.dialogFormVisible = false
                  this.getList()
                }
              }, () => {
                console.log('操作失败')
              })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        var data = { userId: row.id }
        DeleteUser(data)
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
              this.$notify({
                title: '失败',
                message: '删除失败',
                type: 'error',
                duration: 2000
              })
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
        const tHeader = ['姓名', '性别', 'Email', '手机号', '备注']
        const filterVal = ['username', 'sex', 'email', 'phone', 'remark']
        const data = this.formatJson(filterVal, this.list)
        export_json_to_excel(tHeader, data, 'table数据')
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
