import { screenConstants } from 'actions/constants';

const initState = {
    error: null,
    message: '',
    loading: false,
    banners: []
};
export default (state = initState, action) => {
    switch (action.type) {
        case screenConstants.GET_ALL_SCREEN_REQUEST:
            state = {
                ...state,
                loading: true,
                message: '',
                error: ''
            };
            break;
        case screenConstants.GET_ALL_SCREEN_SUCCESS:
            state = {
                ...state,
                loading: false,
                message: 'success',
                screens: action.payload.screens
            };
            break;
        case screenConstants.GET_ALL_SCREEN_FAILURE:
            state = {
                ...state,
                loading: false,
                error: 'error'
            };
            break;
    }
    return state;
};