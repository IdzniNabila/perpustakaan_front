import api from '../utils/api';

// ── GET semua user ────────────────────────────────────────────────────────────
// FIX: res.data (array) → res.data.data
export const getUserAPI = () => (dispatch) => {
    return new Promise((resolve, reject) => {
        api.get('user')
            .then((res) => {
                dispatch({ type: 'GET_USER', value: res.data.data }); // ← FIX
                resolve(res);
            })
            .catch((err) => reject(err));
    });
};

export const createUserAPI = () => (dispatch) => {
    dispatch({ type: 'CREATE_USER' });
};

// ── Tambah user ───────────────────────────────────────────────────────────────
export const storeUserAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        api.post('user', data)
            .then((res) => {
                dispatch({ type: 'STORE_USER', value: data });
                dispatch({ type: 'SHOW_TOAST', message: 'User has been created' });
                resolve(res);
            })
            .catch((err) => reject(err));
    });
};

// ── Edit (ambil data satu user) ───────────────────────────────────────────────
// FIX: res.data → res.data.data
export const editUserAPI = (id) => (dispatch) => {
    return new Promise((resolve, reject) => {
        api.get(`user/${id}/edit`)
            .then((res) => {
                dispatch({ type: 'EDIT_USER', value: res.data.data }); // ← FIX
                resolve(res);
            })
            .catch((err) => reject(err));
    });
};

// ── Update user ───────────────────────────────────────────────────────────────
// FIX: api.post + _method:'PUT' → api.put langsung
export const updateUserAPI = (data, id) => (dispatch) => {
    return new Promise((resolve, reject) => {
        api.put(`user/${id}`, data) // ← FIX
            .then((res) => {
                dispatch({ type: 'UPDATE_USER', value: res.data.data }); // ← FIX
                dispatch({ type: 'SHOW_TOAST', message: 'User has been updated' });
                resolve(res);
            })
            .catch((err) => reject(err));
    });
};

// ── Hapus user ────────────────────────────────────────────────────────────────
// FIX: api.post + _method:'DELETE' → api.delete langsung
export const deleteUserAPI = (id) => (dispatch) => {
    dispatch({ type: 'DELETE_USER', value: id });
    dispatch({ type: 'SHOW_TOAST', message: 'User has been deleted' });

    return new Promise((resolve, reject) => {
        api.delete(`user/${id}`) // ← FIX
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    });
};