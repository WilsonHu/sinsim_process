import axios from 'axios'
// import fetch from './fetch'

class API {
	//获取已授权列表
	get(param) {
		// config.data.strSQL = param.data;
		var data = param.data;
		return axios.get(param.api, data);
	}

	//添加授权
	post(param) {
		return fetch({
			url: param.api,
			data: param.data,
			method: 'post'
		})
	}

	// put(param) {
	// 	return fetch({
	// 		url: param.api,
	// 		data: param.data,
	// 		method: 'put'
	// 	})
	// }
	//
	// add(param) {
	// 	param.data.type = "add";
	// 	return this.put(param);
	// }
	//
	// delete(param) {
	// 	return fetch({
	// 		url: param.api,
	// 		data: param.data,
	// 		method: 'delete'
	// 	})
	// }

	reqSuccess(obj, msg) {
		obj.$message({
			message: msg,
			type: 'success'
		});
	}

	reqFail(obj, msg) {
		obj.$message({
			message: msg,
			type: 'error'
		});
	}
}
export default API;