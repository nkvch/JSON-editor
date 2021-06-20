import axios from 'axios';

export default class HTTPservice {

    static post(obj) {
        return axios.post('/jsons', obj);
    }

    static get() {
        return axios.get('/jsons');
    }
    
    static getById(_id) {
        return axios.get(`/jsons/${_id}`);
    }

    static updateJson(obj, _id) {
        console.log(_id);
        return axios.patch(`/jsons/${_id}`, obj);
    }

}