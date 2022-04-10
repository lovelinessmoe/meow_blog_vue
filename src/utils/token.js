import store from '@/store'


/**
 * 获取登陆用户
 * 如果是没登陆返回的是undefined
 */
export function getUser() {
    let user = undefined;
    try {
        user = JSON.parse(localStorage.user);
    } catch (e) {
        console.log("用户未登陆")
    }
    return user;
}

export function setUser(user) {
    localStorage.user = JSON.stringify(user);
    store.commit('REFRESH_USER');
}

export function removeUser() {
    localStorage.removeItem('user');
    store.commit('REFRESH_USER');
}


