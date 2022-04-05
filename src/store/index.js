import {createStore} from 'vuex'
import {getUser} from '@/utils/token'

const state = {
    loading: false,
    user: undefined,
}
const mutations = {
    SET_LOADING: (state, v) => {
        state.loading = v;
    },
    async REFRESH_USER(state) {
        state.user = await getUser();
    }
}
const actions = {}
const getters = {
    loading: state => state.loading,
}

const store = createStore({
    state,
    mutations,
    actions,
    modules: {},
    getters
})

export default store


