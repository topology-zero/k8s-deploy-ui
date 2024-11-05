import { defineStore } from 'pinia'
import { getRoles, getAuths, getProject, getTemplate } from '@/api/common'

// 数据字典
export default defineStore('dict', {
    state: () => ({
        roleOptions: [],
        authTreeData: [],
        project: [],
        templates: []
    }),
    actions: {
        async getDict() {
            await Promise.all([
                this.getRoles(),
                this.getAuths(),
                this.getProject(),
                this.getTemplate()
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
        },
        async getTemplate() {
            const { data } = await getTemplate()
            this.templates = data
        }
    }
})
