import { USER_LOGIN, ADMIN_LOGIN } from "../constants/action-types";
import axios from "axios";
import backend from '../../backendConfig';

export const userLogin = (loginData) => dispatch => {
    axios.defaults.withCredentials = true;
    axios.post(`${backend}/login/user`, loginData)
        .then(response => {
            if (response.data === "Success_Login"){
                dispatch({
                    type: USER_LOGIN,
                    payload: response.data
                })
            }
        })
        .catch(error => {
            if (error.response && error.response.data) {
                alert("Incorrect credentials!");
                return dispatch({
                    type: USER_LOGIN,
                    payload: error.response.data
                });
            }
        });
}

export const adminLogin  = (loginData) => dispatch => {
    axios.post(`${backend}/login/admin`, loginData)
    .then(response => {
        if (response.data === "Success_Login"){
            dispatch({
                type: ADMIN_LOGIN,
                payload: response.data
            })
        }
    })
    .catch(error => {
        if (error.response && error.response.data) {
            alert("Incorrect credentials!");
            return dispatch({
                type: ADMIN_LOGIN,
                payload: error.response.data
            });
        }
    });
}