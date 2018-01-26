import axios from 'axios'
import {Message} from 'element-ui'


// 创建axios实例
const service = axios.create({
	baseURL: HOST,  // process.env.BASE_API, // api的base_url
	withCredentials: false,               // allow CORS
	headers: {
		"Access-Control-Allow-Headers": "*"
	},
	timeout: 5000                         // 请求超时时间
})

// respone拦截器
service.interceptors.response.use(
	response => response,
	error => {
		console.log('err' + error)// for debug
		Message({
			message: error.message,
			type: 'error',
			duration: 5 * 1000
		})
		return Promise.reject(error)
	}
)

export default service
