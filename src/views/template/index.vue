<template>
    <div class="app-container">
        <p class="page-title">模板列表</p>
        <div class="filter-container">
            <el-row :gutter="20"
                    justify="space-between">
                <el-col :span="6">
                    <el-button v-permission="`admin:user:add`"
                               type="primary"
                               size="default"
                               plain
                               @click="handleAdd()">
                        添加模板
                    </el-button>
                </el-col>
                <el-col :span="18">
                    <el-form ref="queryFormRef"
                             inline
                             style="float: right;"
                             size="default"
                             :model="params">
                        <el-form-item label="模板/描述"
                                      prop="name">
                            <el-input v-model="params.name" />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="warning"
                                       @click="handleReset()">重置</el-button>
                            <el-button type="primary"
                                       @click="_getData">查询</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>

        </div>

        <el-table v-loading="tableLoading"
                  element-loading-text="加载中..."
                  border
                  :data="list">
            <el-table-column label="ID"
                             prop="id"
                             align="center"
                             width="60px" />
            <el-table-column align="center"
                             label="模板名"
                             prop="name" />
            <el-table-column align="center"
                             label="模板描述"
                             prop="desc" />
            <el-table-column align="center"
                             width="170px"
                             label="操作">
                <template #default="{row}">
                    <el-button v-permission="`admin:user:edit`"
                               size="small"
                               type="primary"
                               @click="handleEdit(row)">编辑
                    </el-button>
                    <el-button v-permission="`admin:user:del`"
                               size="small"
                               type="danger"
                               @click="handleDel(row)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="page-container">
            <el-pagination background
                           :current-page="params.page"
                           :page-sizes="pageSizes"
                           :page-size="params.pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="total"
                           @size-change="handleSizeChange"
                           @current-change="handleCurrentChange" />
        </div>

        <add-edit-dialog v-model:visible="dialogVisible"
                         v-model:formData="formData"
                         @done="_getData" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { getList, del } from './api'
import { usePage } from '@/utils/mixin/page'
import { useReset } from '@/utils/mixin/reset'
import { ElMessage, ElMessageBox } from 'element-plus'
import AddEditDialog from './add-edit-dialog.vue'

const defaultFormData = () => ({
    id: 0,
    name: '',
    desc: '',
    content: ''
})

// data
const dialogVisible = ref(false)
const formData = ref({})

// mixin
// 获取数据
const _getData = async () => {
    tableLoading.value = true
    const { data } = await getList(params.value)
    list.value = data.data
    total.value = data.total
    tableLoading.value = false
}
const {
    tableLoading,
    list,
    params,
    pageSizes,
    total,
    handleSizeChange,
    handleCurrentChange
} = usePage(_getData)

// 添加模板
const handleAdd = () => {
    dialogVisible.value = true
    formData.value = defaultFormData()
}

// 编辑模板
const handleEdit = async (info) => {
    dialogVisible.value = true
    Object.assign(formData.value, info)
}

// 删除模板
const handleDel = async (info) => {
    await ElMessageBox.confirm('删除模板不可恢复', '警告')
    const { message } = await del(info.id)
    ElMessage.success(message)
    _getData(params)
}

// 重置
const {
    queryFormRef,
    handleReset
} = useReset()
</script>
