import { USER_LOGOUT } from '../constants/action-types';

const initialState = {
    user: {}
};

export default function(state = initialState, action) {
    switch(action.type){
        case USER_LOGOUT:
            return {};
        default:
            return state;
    }
};