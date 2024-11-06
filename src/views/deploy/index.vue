<template>
    <div class="app-container">
        <p class="page-title">项目列表</p>
        <div class="filter-container">
            <el-row :gutter="20"
                    justify="space-between">
                <el-col :span="6">
                    <el-button v-permission="`admin:user:add`"
                               type="primary"
                               size="default"
                               plain
                               @click="handleAdd()">
                        新建上线单
                    </el-button>
                </el-col>
                <el-col :span="18">
                    <el-form ref="queryFormRef"
                             inline
                             style="float: right;"
                             size="default"
                             :model="params">
                        <el-form-item label="上线单"
                                      prop="name">
                            <el-input v-model="params.name"
                                      clearable />
                        </el-form-item>
                        <el-form-item>
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
                             label="上线单"
                             show-overflow-tooltip
                             prop="deployName" />
            <el-table-column align="center"
                             label="上线项目"
                             show-overflow-tooltip
                             prop="projectName" />
            <el-table-column align="center"
                             label="使用模板"
                             show-overflow-tooltip
                             prop="templateName" />
            <el-table-column align="center"
                             label="更新时间"
                             width="180px"
                             prop="updateTime" />
            <el-table-column align="center"
                             label="状态"
                             width="100px"
                             prop="status">
                <template #default="{row}">
                    <el-tag v-if="row.status==0"
                            type="warning">待上线</el-tag>
                    <el-tag v-if="row.status==1"
                            type="primary">上线中</el-tag>
                    <el-tag v-if="row.status==2"
                            type="success">上线成功</el-tag>
                    <el-tag v-if="row.status==3"
                            type="danger">上线失败</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center"
                             width="170px"
                             label="操作">
                <template #default="{row}">
                    <el-button v-permission="`admin:user:edit`"
                               size="small"
                               :loading="row.status == 1"
                               type="primary"
                               @click="handleDeploy(row)">{{ row.status == 2 ?'查看':'上线'}}
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

        <DoDeploy v-model:visible="deployDialog"
                  v-model:formData="deployData" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { getList, del } from './api'
import { usePage } from '@/utils/mixin/page'
import { registerNotify, useWebsocket } from '@/utils/mixin/websocket'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import DoDeploy from './do-deploy.vue'

const router = useRouter()
const { websocketTarget, logMessage, statusMessage } = useWebsocket()

// 获取数据
const _getData = async () => {
    tableLoading.value = true
    const { data } = await getList(params.value)
    list.value = data.data
    total.value = data.total
    tableLoading.value = false
}

registerNotify('log_change', _getData)

const {
    tableLoading,
    list,
    params,
    pageSizes,
    total,
    handleSizeChange,
    handleCurrentChange
} = usePage(_getData)

// 添加项目
const handleAdd = () => {
    router.push('/deploy/add')
}

// 上线项目
const deployDialog = ref(false)
const deployData = ref({})
const handleDeploy = async (info) => {
    deployDialog.value = true
    deployData.value = info
    statusMessage.value.set(info.id, info.status)
    if (!logMessage.value.has(info.id)) {
        websocketTarget.value.send(`{"msgType":"init","data":${info.id}}`)
    }
}

// 删除项目
const handleDel = async (info) => {
    await ElMessageBox.confirm('删除上线单不可恢复', '警告')
    const { message } = await del(info.id)
    ElMessage.success(message)
    _getData(params)
}
</script>
