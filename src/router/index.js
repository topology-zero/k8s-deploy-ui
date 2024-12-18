import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/layout/index.vue'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/login',
            component: () => import('@/views/login/index.vue'),
            hidden: true
        },
        {
            path: '/404',
            component: () => import('@/views/404.vue'),
            hidden: true
        },
        {
            path: '/',
            component: Layout,
            redirect: '/dashboard',
            // 如果设置了 useTopNav = true ,则需要每个路由都设置 meta
            // meta: { title: '首页' },
            children: [
                {
                    path: 'dashboard',
                    name: 'dashboard',
                    component: () => import('@/views/dashboard/index.vue'),
                    meta: { title: '首页', icon: 'dashboard', affix: true }
                }
            ]
        },
        {
            path: '/admin',
            component: Layout,
            redirect: '/admin/user',
            name: 'admin',
            permission: 'admin',
            meta: { title: '后台管理', icon: 'manage' },
            children: [
                // 用户相关
                {
                    path: 'user',
                    name: 'user',
                    permission: 'admin:user',
                    component: () => import('@/views/admin/user/index.vue'),
                    meta: { title: '用户管理', icon: 'user' }
                },
                // 角色相关
                {
                    path: 'role',
                    name: 'role',
                    permission: 'admin:role',
                    component: () => import('@/views/admin/role/index.vue'),
                    meta: { title: '角色管理', icon: 'role' }
                },
                // 权限相关
                {
                    path: 'auth',
                    name: 'auth',
                    permission: 'admin:auth',
                    component: () => import('@/views/admin/auth/index.vue'),
                    meta: { title: '权限管理', icon: 'auth' }
                }
            ]
        },
        {
            path: '/namespace',
            component: Layout,
            redirect: '/namespace/index',
            name: 'namespace',
            permission: 'namespace',
            meta: { title: '命名空间管理', icon: 'ns' },
            children: [
                {
                    path: 'index',
                    name: 'namespace-index',
                    permission: 'namespace',
                    component: () => import('@/views/namespace/index.vue'),
                    meta: { title: '命名空间管理', icon: 'ns' }
                }
            ]
        },
        {
            path: '/project',
            component: Layout,
            redirect: '/project/index',
            name: 'project',
            permission: 'project',
            meta: { title: '项目管理', icon: 'project' },
            children: [
                {
                    path: 'index',
                    name: 'project-index',
                    permission: 'project',
                    component: () => import('@/views/project/index.vue'),
                    meta: { title: '项目管理', icon: 'project' }
                }
            ]
        },
        {
            path: '/template',
            component: Layout,
            redirect: '/template/index',
            name: 'template',
            permission: 'template',
            meta: { title: '模板管理', icon: 'template' },
            children: [
                {
                    path: 'index',
                    name: 'template-index',
                    permission: 'template',
                    component: () => import('@/views/template/index.vue'),
                    meta: { title: '模板管理', icon: 'template' }
                }
            ]
        },
        {
            path: '/deploy',
            component: Layout,
            redirect: '/deploy/index',
            name: 'deploy',
            permission: 'deploy',
            meta: { title: '部署管理', icon: 'deploy' },
            children: [
                {
                    path: 'index',
                    name: 'deploy-index',
                    permission: 'deploy',
                    component: () => import('@/views/deploy/index.vue'),
                    meta: { title: '部署管理', icon: 'deploy' }
                },
                {
                    path: 'add',
                    name: 'deploy-add',
                    hidden: true,
                    permission: 'deploy:add',
                    component: () => import('@/views/deploy/new-deploy.vue'),
                    meta: { title: '新上线', icon: 'deploy' }
                }
            ]
        },
        {
            path: '/run',
            component: Layout,
            redirect: '/run/index',
            name: 'run',
            permission: 'run',
            meta: { title: '运行', icon: 'run' },
            children: [
                {
                    path: 'index',
                    name: 'run-index',
                    permission: 'run:index',
                    component: () => import('@/views/run/index.vue'),
                    meta: { title: '调试运行', icon: 'run' }
                }
            ]
        },
        {
            path: '/redirect',
            component: Layout,
            hidden: true,
            children: [
                {
                    path: '/redirect/:path(.*)',
                    component: () => import('@/views/redirect/index.vue')
                }
            ]
        },
        // 404 page must be placed at the end !!!
        { path: '/:pathMatch(.*)', redirect: '/404', hidden: true }
    ]
})

export default router
