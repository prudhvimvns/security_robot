import { USER_LOGOUT } from "../constants/action-types";

export const userLogout = () => dispatch => {
    dispatch({type: USER_LOGOUT});
}