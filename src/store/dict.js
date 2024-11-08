import { defineStore } from 'pinia'
import { getRoles, getAuths, getProject } from '@/api/common'

// 数据字典
export default defineStore('dict', {
    state: () => ({
        roleOptions: [],
        authTreeData: [],
        project: []
    }),
    actions: {
        async getDict() {
            await Promise.all([
                this.getRoles(),
                this.getAuths(),
                this.getProject()
            ])
        },
        async getRoles() {
            const { data } = await getRoles()
            this.roleOptions = data
        },
        async getAuths() {
            const { data } = await getAuths()
            this.authTreeData = data
        },
        async getProject() {
            const { data } = await getProject()
            this.project = data
        }
    }
})
