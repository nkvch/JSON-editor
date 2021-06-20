import axios from 'axios';

const API_JSON_CONTROLLER_URL = '/jsons';

export default class HTTPservice {

    static post(obj) {
        return axios.post(API_JSON_CONTROLLER_URL, obj);
    }
    
}