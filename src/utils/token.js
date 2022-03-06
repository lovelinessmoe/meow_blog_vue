export function getToken() {
    return localStorage.token
}

export function setToken(token) {
    return localStorage.token = token
}

export function removeToken() {
    return localStorage.removeItem('token')
}

export function getUser() {
    let user = undefined
    try {
        user = JSON.parse(localStorage.user)
    } catch (e) {
        console.log('用户未登陆')
    }
    return user
}

export function setUser(user) {
    return localStorage.user = JSON.stringify(user)
}

export function removeUser() {
    return localStorage.removeItem('user')
}

