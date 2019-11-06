import Login from '../components/Login.vue'
import HomeShow from '../components/home_show.vue'
import NotFound from '../components/404.vue'
import Home from '../components/home.vue'

//system
import System from "../components/system.vue"
import UserManage from '../components/system/user_manage.vue'
import InstallGroupManage from '../components/system/install_group_manage.vue'
import MarketGroupManage from '../components/system/market_group_manage.vue'
import RoleManage from '../components/system/role_manage.vue'
import DeviceManager from '../components/system/device_manage.vue'
import MachineTypeManager from '../components/system/machine_type_manage.vue'
import ConfigManage from '../components/system/config_manage.vue'
import TradeZoneManage from '../components/system/trade_zone_manage.vue'

//abnormal
import Abnormal from "../components/abnormal.vue"
import AbnormalTypeManage from "../components/abnormal/abnormal_type_manage.vue"
import AbnormalStatisticManage from "../components/abnormal/abnormal_statistic_manage.vue"
import AbnormalQualityManage from "../components/abnormal/abnormal_quality_manage.vue"

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
import MachineProductionReport from "../components/machine/machine_production_report.vue"
import MachineInstallWhole from "../components/machine/machine_install_whole.vue"
import MachineInstallParts from "../components/machine/machine_install_parts.vue"
import produceStaffAttendance from "../components/machine/produce_staff_attendance.vue"

//contact 联系单
import ContactSign from "../components/contract/lxd_contact_sign.vue"

export default [{
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
        children: [{
                path: '/home/show',
                component: HomeShow,
                name: 'HomeShow',
                meta: "主页",
                hidden: true
            },
            {
                path: '/home/contract',
                component: Contract,
                name: 'Contract',
                meta: "签核管理",
                children: [{
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
                    {
                        path: '/home/contract/contact_sign',
                        component: ContactSign,
                        name: 'contact_sign',
                        meta: '联系单签核'
                    },
                ]
            },
            {
                path: '/home/order',
                component: Order,
                name: 'Order',
                meta: "订单管理",
            },

            {
                path: '/home/machine',
                component: Machine,
                name: 'Machine',
                meta: "生产管理",
                children: [{
                        path: '/home/machine/machine_install_process',
                        component: MachineInstallProcess,
                        name: 'machine_install_process',
                        meta: '安装进度'
                    },
                    {
                        path: '/home/machine/machine_config_process',
                        component: MachineConfigProcess,
                        name: 'machine_config_process',
                        meta: '配置流程'
                    },
                    {
                        path: '/home/machine/machine_install_whole',
                        component: MachineInstallWhole,
                        name: 'machine_install_whole',
                        meta: '总装管理'
                    },
                    {
                        path: '/home/machine/machine_install_parts',
                        component: MachineInstallParts,
                        name: 'machine_install_parts',
                        meta: '部装管理'
                    },
                    {
                        path: '/home/machine/machine_production_report',
                        component: MachineProductionReport,
                        name: 'machine_production_report',
                        meta: '生产报表'
                    },
                    {
                        path: '/home/machine/produce_staff_attendance',
                        component: produceStaffAttendance,
                        name: 'produce_staff_attendance',
                        meta: '人员考勤'
                    }
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
                name: 'Abnormal',
                meta: "异常管理",
                children: [{
                        path: '/home/abnormal/abnormal_statistic_manage',
                        component: AbnormalStatisticManage,
                        name: 'abnormal_statistic_manage',
                        meta: '安装异常'
                    },
                    {
                        path: '/home/abnormal/abnormal_quality_manage',
                        component: AbnormalQualityManage,
                        name: 'abnormal_quality_manage',
                        meta: '质检异常'
                    },
                    {
                        path: '/home/abnormal/abnormal_type_manage',
                        component: AbnormalTypeManage,
                        name: 'abnormal_type_manage',
                        meta: '异常分类'
                    }
                ],
            },


            {
                path: '/home/task',
                component: Task,
                name: 'Task',
                meta: "流程管理",
                children: [{
                        path: '/home/task/process_manage',
                        component: ProcessManage,
                        name: 'process_manage',
                        meta: '安装流程'
                    },
                    {
                        path: '/home/task/task_content_manage',
                        component: TaskContentManage,
                        name: 'task_content_manage',
                        meta: '安装子项'
                    }
                ]
            },

            {
                path: '/home/system',
                component: System,
                name: 'System',
                meta: "系统管理",
                children: [{
                        path: '/home/system/user_manage',
                        component: UserManage,
                        name: 'user_manage',
                        meta: '用户管理'
                    },
                    {
                        path: '/home/system/install_group_manage',
                        component: InstallGroupManage,
                        name: 'install_group_manage',
                        meta: '安装组管理'
                    },
                    {
                        path: '/home/system/market_group_manage',
                        component: MarketGroupManage,
                        name: 'market_group_manage',
                        meta: '销售组管理'
                    },
                    {
                        path: '/home/system/role_manage',
                        component: RoleManage,
                        name: 'role_manage',
                        meta: '角色管理'
                    },
                    {
                        path: '/home/system/device_manager',
                        component: DeviceManager,
                        name: 'device_manager',
                        meta: '设备管理'
                    },
                    {
                        path: '/home/system/machine_type_manager',
                        component: MachineTypeManager,
                        name: 'machine_type_manager',
                        meta: '机型管理'
                    },
                    {
                        path: '/home/system/config_manage',
                        component: ConfigManage,
                        name: 'config_manage',
                        meta: '配置管理'
                    },
                    {
                        path: '/home/system/trade_zone_manage',
                        component: TradeZoneManage,
                        name: 'trade_zone_manage',
                        meta: '内贸区域管理'
                    },
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