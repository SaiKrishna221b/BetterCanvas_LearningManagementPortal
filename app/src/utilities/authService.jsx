
const TOKEN_KEY = 'authToken';

export const login = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
};

export const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('userInfo');
};

export const isAuthenticated = () => {
    return localStorage.getItem(TOKEN_KEY) !== null;
};

export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
}

export const setUserInfo = (data) => {
    if('studentID' in data) data.type = 'student';
    if('facultyID' in data) data.type = 'faculty';
    if('adminID'   in data) data.type = 'admin';
    localStorage.setItem('userInfo', JSON.stringify(data));
}
export const getUserInfo = () => {
    return JSON.parse(localStorage.getItem('userInfo')) ?? {};
}