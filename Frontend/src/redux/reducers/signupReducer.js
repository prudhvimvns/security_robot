import { USER_SIGNUP } from '../constants/action-types';

const initialState = {
    signup: {}
};

export default function (state = initialState, action) {
    switch (action.type) {
        case USER_SIGNUP:
            return {
                ...state,
                signup: action.payload
            };
        default:
            return state;
    }
};