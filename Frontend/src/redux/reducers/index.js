import { combineReducers } from 'redux';
import loginReducer from './loginReducer';
import signupReducer from './signupReducer';
import logoutReducer from './logoutReducer';

export default combineReducers({
    login: loginReducer,
    signup: signupReducer,
    logout: logoutReducer
});