import { USER_SIGNUP } from "../constants/action-types";
import axios from "axios";
import backend from '../../backendConfig';

export const userSignup = (signupData) => dispatch => {
    axios.defaults.withCredentials = true;
    axios.post(`${backend}/signup`, signupData)
        .then(response => {
            if (response.data === "Success_Signup"){
                dispatch({
                    type: USER_SIGNUP,
                    payload: response.data
                })
            }
        })
        .catch(error => {
            if (error.response && error.response.data) {
                alert("Failed to sign up! The email already exists!");
                return dispatch({
                    type: USER_SIGNUP,
                    payload: error.response.data
                });
            }
            return;
        });
}