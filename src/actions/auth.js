import api from '../utils/api';

export const storeToken = (token) => {
    localStorage.setItem('jwt', JSON.stringify(token));
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

// ── Login ─────────────────────────────────────────────────────────────────────
// FIX: response lama { status:'ok', token } → baru { success:true, token }
// Tidak ada perubahan karena token tetap ada di res.data.token ✓
export const loginAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        api.post('auth/login', data)
            .then((res) => {
                storeToken(res.data.token);
                dispatch({ type: 'SET_LOGIN', value: res.data.token });
                resolve(res);
            })
            .catch((err) => reject(err));
    });
};

export const logoutAPI = () => (dispatch) => {
    return new Promise((resolve, reject) => {
        api.post('auth/logout')
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(err);
            })
            .finally(() => {
                dispatch({ type: 'SET_LOGOUT', value: null });
                localStorage.removeItem('jwt');
            });
    });
};