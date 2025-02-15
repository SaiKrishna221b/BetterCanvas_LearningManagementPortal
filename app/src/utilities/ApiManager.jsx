
import { getToken, getUserInfo, logout } from './authService';

function ApiManager(){
	this.host = "http://localhost:8001";
	this.request = (url, method='GET', data=null)=>{
		console.log();
		return new Promise((resolve, reject) => {
			fetch(`${this.host}${url}`,{
					'method':method,
					'mode': 'cors',
					'headers': {
							'Access-Control-Allow-Origin': `${window.location.protocol}//${window.location.host}`,
							'Authorization': `Bearer ${getToken()}`,
							'Content-Type': 'application/json'
					},
					'body': data!= null ? (typeof(data) === "string" ? data:JSON.stringify(data)):null,
			})
			.then(response => { 
				// if(response.headers.get("content-length") === "0"){
				if(response.status !== 200){
					logout();
					reject('Invalid credentials. Please login again.');
					return;
				}
				if(response.headers.get("content-length") === "0"){
					return ""
				}
				return response.json();
			})
			.then(data => {
					resolve(data);
			});
		})
	}
	this.getUserInfo = ()=>{return getUserInfo()};
	return this;
}

export default ApiManager;