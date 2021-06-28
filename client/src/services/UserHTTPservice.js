import axios from "axios";

export default class UserHTTPservice {
    
    static postUser(usr) {
        console.log(usr);
        return axios.post('/users', usr);
    }

    static findByUsername(username) {
        return axios.get(`/users/${username}`);
    }

    static logIn(usr) {
        return axios.post(`/users/${usr.username}`, usr);
    }

    static loadUser(token) {
        const config = {
            headers: {
                'authorization': token
            }
        }
        return axios.get('/users', config);
    }

}