import Login from '../components/Login.vue'
import HomeShow from '../components/home_show.vue'
import NotFound from '../components/404.vue'
import Home from '../components/home.vue'

//system
import System from "../components/system.vue"
import UserManage from '../components/system/user_manage.vue'
import InstallGroupManage from '../components/system/install_group_manage.vue'
import RoleManage from '../components/system/role_manage.vue'
import DeviceManager from '../components/system/device_manage.vue'

//abnormal
import Abnormal from "../components/abnormal.vue"

//task
import Task from "../components/task.vue"
import TaskContentManage from "../components/task/task_content_manage.vue"
import ProcessManage from "../components/task/process_manage.vue"

//contract
import Contract from "../components/contract.vue"
import ContractSign from "../components/contract/contract_sign.vue"
import SignProcess from "../components/contract/sign_process.vue"

//order
import Order from "../components/order.vue"
import OrderManage from "../components/order/order_manage.vue"
import OrderSign from "../components/order/order_sign.vue"

//plan
import Plan from "../components/plan.vue"

//Machine
import Machine from "../components/machine.vue"
import MachineConfigProcess from "../components/machine/machine_config_process.vue"
import MachineInstallProcess from "../components/machine/machine_install_process.vue"

export default
[
	{
		path: '/login',
		component: Login,
		name: 'Login',
		hidden: true
	},
	{
		path: '/404',
		component: NotFound,
		name: '404',
		hidden: true
	},
    {
        path: '/home',
        component: Home,
        redirect: '/home/show',
        children: [
            {
                path: '/home/show',
                component: HomeShow,
                name: 'HomeShow',
                meta: "主页",
                hidden: true
            },
            {
                path: '/home/contract',
                component: Contract,
                name:'Contract',
                meta: "签核管理",
                redirect: '/home/contract/contract_sign',
                children: [
                    {
                        path: '/home/contract/contract_sign',
                        component: ContractSign,
                        name: 'contract_sign',
                        meta: '合同签核'
                    },
                    {
                        path: '/home/contract/sign_process',
                        component: SignProcess,
                        name: 'sign_process',
                        meta: '签核流程'
                    },
                ]
            },
            {
                path: '/home/order',
                component: Order,
                name:'Order',
                meta: "订单管理",
                // redirect: '/home/order/order_sign',
                // children: [
                //     {
                //         path: '/home/order/order_sign',
                //         component: OrderSign,
                //         name: 'order_sign',
                //         meta: '订单签核'
                //     },
                //     {
                //         path: '/home/order/order_manage',
                //         component: OrderManage,
                //         name: 'order_manage',
                //         meta: '订单安装'
                //     },
                // ]
            },

            {
                path: '/home/machine',
                component: Machine,
                name: 'Machine',
                meta: "机器管理",
                // redirect: '/home/machine/machine_config_process',
                children: [
                    {
                        path: '/home/machine/machine_config_process',
                        component: MachineConfigProcess,
                        name: 'machine_config_process',
                        meta: '配置流程'
                    },
                    {
                        path: '/home/machine/machine_install_process',
                        component: MachineInstallProcess,
                        name: 'machine_install_process',
                        meta: '安装进度'
                    },
                ]
            },

            {
                path: '/home/plan',
                component: Plan,
                name: 'Plan',
                meta: "计划管理",
                children: [],
            },

            {
                path: '/home/abnormal',
                component: Abnormal,
                redirect: '/home/abnormal',
                name: 'Abnormal',
                meta: "异常管理",
                children: [],
            },


            {
                path: '/home/task',
                component: Task,
                name: 'Task',
                meta: "流程管理",
                redirect: '/home/task/task_content_manage',
                children: [
                    {
                        path: '/home/task/task_content_manage',
                        component: TaskContentManage,
                        name: 'task_content_manage',
                        meta: '安装子项'
                    },
                    {
                        path: '/home/task/process_manage',
                        component: ProcessManage,
                        name: 'process_manage',
                        meta: '安装流程'
                    }
                ]
            },

            {
                path: '/home/system',
                component: System,
                name: 'System',
                meta: "系统管理",
                redirect: '/home/system/user_manage',
                children: [
                    {path: '/home/system/user_manage', component: UserManage, name: 'user_manage', meta: '用户管理'},
                    {path: '/home/system/install_group_manage', component: InstallGroupManage, name: 'install_group_manage', meta: '安装组管理'},
                    {path: '/home/system/role_manage', component: RoleManage, name: 'role_manage', meta: '角色管理'},
                    // {path: '/home/system/qualification_manage', component: QualificationManage, name: 'qualification_manage', meta: '资质管理'},
                    // {path: '/home/system/material_statistics', component: MaterialStatistics, name: 'material_statistics', meta: '材料统计'},
                    {path: '/home/system/device_manager', component: DeviceManager, name: 'device_manager', meta: '设备管理'},
                ]
            },
        ]
    },
	{
		path: '*',
		redirect: '/home',
		hidden: true
	},
]
