function clearToken() {
    if (sessionStorage.getItem('token')) {
        sessionStorage.removeItem('token');
    }

    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('isAdmin');
    sessionStorage.removeItem('role');
}

module.exports = { clearToken }