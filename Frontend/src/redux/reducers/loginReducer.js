import { USER_LOGIN, ADMIN_LOGIN } from '../constants/action-types';

const initialState = {
    user: {},
    admin: {}
};

export default function(state = initialState, action) {
    switch(action.type){
        case USER_LOGIN:
            return {
                ...state,
                user: action.payload,
                status: action.status
            };
        case ADMIN_LOGIN:
            return {
                ...state,
                admin: action.payload,
                status: action.status
            };
        default:
            return state;
    }
};