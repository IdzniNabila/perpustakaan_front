import api from '../utils/api';

// ── GET semua buku ────────────────────────────────────────────────────────────
// FIX: res.data (array) → res.data.data (array dalam wrapper { success, data })
export const getBookAPI = () => (dispatch) => {
    return new Promise((resolve, reject) => {
        api.get('book')
            .then((res) => {
                dispatch({ type: 'GET_BOOK', value: res.data.data }); // ← FIX
                resolve(res);
            })
            .catch((err) => reject(err));
    });
};

export const createBookAPI = () => (dispatch) => {
    dispatch({ type: 'CREATE_BOOK' });
};

// ── Tambah buku ───────────────────────────────────────────────────────────────
// Tidak ada perubahan — hanya POST biasa, response-nya tidak dipakai di reducer
export const storeBookAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        api.post('book', data)
            .then((res) => {
                dispatch({ type: 'STORE_BOOK', value: data });
                dispatch({ type: 'SHOW_TOAST', message: 'Book has been created' });
                resolve(res);
            })
            .catch((err) => reject(err));
    });
};

// ── Edit (ambil data satu buku) ───────────────────────────────────────────────
// FIX: res.data (object) → res.data.data
export const editBookAPI = (id) => (dispatch) => {
    return new Promise((resolve, reject) => {
        api.get(`book/${id}/edit`)
            .then((res) => {
                dispatch({ type: 'EDIT_BOOK', value: res.data.data }); // ← FIX
                resolve(res);
            })
            .catch((err) => reject(err));
    });
};

// ── Update buku ───────────────────────────────────────────────────────────────
// FIX: dulu api.post(url, { _method:'PUT' }) → sekarang api.put(url, data)
// Method spoofing tidak direkomendasikan untuk API murni
export const updateBookAPI = (data, id) => (dispatch) => {
    return new Promise((resolve, reject) => {
        api.put(`book/${id}`, data) // ← FIX: PUT langsung
            .then((res) => {
                dispatch({ type: 'UPDATE_BOOK', value: res.data.data }); // ← FIX
                dispatch({ type: 'SHOW_TOAST', message: 'Book has been updated' });
                resolve(res);
            })
            .catch((err) => reject(err));
    });
};

// ── Hapus buku ────────────────────────────────────────────────────────────────
// FIX: dulu api.post(url, { _method:'DELETE' }) → sekarang api.delete(url)
export const deleteBookAPI = (id) => (dispatch) => {
    dispatch({ type: 'DELETE_BOOK', value: id });
    dispatch({ type: 'SHOW_TOAST', message: 'Book has been deleted' });

    return new Promise((resolve, reject) => {
        api.delete(`book/${id}`) // ← FIX: DELETE langsung
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    });
};