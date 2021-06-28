import axios from 'axios';

export default class JsonHTTPservice {

    // static post(obj) {
    //     return axios.post('/jsons', obj);
    // }

    // static get() {
    //     return axios.get('/jsons');
    // }

    static post(obj, userId, token) {
        const config = {
            headers: {
                'authorization': token
            }
        };
        return axios.post(`/jsons/${userId}`, obj, config);
    }

    static getUsersJsons(userId, token) {
        const config = {
            headers: {
                'authorization': token
            }
        };
        return axios.get(`/jsons/${userId}`, config);
    }
    
    static getById(_id, userId, token) {
        const config = {
            headers: {
                'authorization': token
            }
        };
        return axios.get(`/jsons/${userId}/${_id}`, config);
    }

    static updateJson(obj, _id, userId, token) {
        const config = {
            headers: {
                'authorization': token
            }
        };
        return axios.patch(`/jsons/${userId}/${_id}`, obj, config);
    }

}