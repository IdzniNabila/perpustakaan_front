import api from '../utils/api';

// ── GET semua peminjaman ──────────────────────────────────────────────────────
// FIX: res.data (array) → res.data.data
export const getPeminjamanAPI = () => (dispatch) => {
    return new Promise((resolve, reject) => {
        api.get('peminjaman')
            .then((res) => {
                dispatch({ type: 'GET_PEMINJAMAN', value: res.data.data }); // ← FIX
                resolve(res);
            })
            .catch((err) => reject(err));
    });
};

// ── Create (ambil daftar user & buku untuk dropdown) ─────────────────────────
// FIX BESAR: Response lama → array [ [user,...], [book,...] ]
//            Response baru → { success, data: { users:[...], books:[...] } }
export const createPeminjamanAPI = () => (dispatch) => {
    return new Promise((resolve, reject) => {
        api.get('peminjaman/create')
            .then((res) => {
                dispatch({
                    type: 'CREATE_PEMINJAMAN',
                    users: res.data.data.users, // ← FIX: dulu res.data[0]
                    books: res.data.data.books, // ← FIX: dulu res.data[1]
                });
                resolve(res);
            })
            .catch((err) => reject(err));
    });
};

// ── Tambah peminjaman baru ────────────────────────────────────────────────────
export const storePeminjamanAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        api.post('peminjaman', data)
            .then((res) => {
                dispatch({ type: 'STORE_PEMINJAMAN', value: data });
                dispatch({ type: 'SHOW_TOAST', message: 'Data has been created' });
                resolve(res);
            })
            .catch((err) => reject(err));
    });
};

// ── Edit (ambil data peminjaman + dropdown) ───────────────────────────────────
// FIX BESAR: Response lama → array [ peminjaman, [user,...], [book,...] ]
//            Response baru → { success, data: { peminjaman:{}, users:[], books:[] } }
export const editPeminjamanAPI = (id) => (dispatch) => {
    return new Promise((resolve, reject) => {
        api.get(`peminjaman/${id}/edit`)
            .then((res) => {
                dispatch({
                    type: 'EDIT_PEMINJAMAN',
                    value: res.data.data.peminjaman, // ← FIX: dulu res.data[0]
                    users: res.data.data.users,      // ← FIX: dulu res.data[1]
                    books: res.data.data.books,      // ← FIX: dulu res.data[2]
                });
                resolve(res);
            })
            .catch((err) => reject(err));
    });
};

// ── Update peminjaman ─────────────────────────────────────────────────────────
// FIX: api.post + _method:'PUT' → api.put langsung
export const updatePeminjamanAPI = (data, id) => (dispatch) => {
    return new Promise((resolve, reject) => {
        api.put(`peminjaman/${id}`, data) // ← FIX
            .then((res) => {
                dispatch({ type: 'UPDATE_PEMINJAMAN', value: res.data.data }); // ← FIX
                dispatch({ type: 'SHOW_TOAST', message: 'Data has been updated' });
                resolve(res);
            })
            .catch((err) => reject(err));
    });
};

// ── Hapus peminjaman ──────────────────────────────────────────────────────────
// FIX: api.post + _method:'DELETE' → api.delete langsung
export const deletePeminjamanAPI = (id) => (dispatch) => {
    dispatch({ type: 'DELETE_PEMINJAMAN', value: id });
    dispatch({ type: 'SHOW_TOAST', message: 'Data has been deleted' });

    return new Promise((resolve, reject) => {
        api.delete(`peminjaman/${id}`) // ← FIX
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    });
};