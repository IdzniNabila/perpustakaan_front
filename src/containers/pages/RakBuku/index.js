import React, { useState, useEffect } from 'react';
import api from '../../../utils/api';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faTrash, faSpinner } from "@fortawesome/free-solid-svg-icons";

const RakBukuPage = () => {
    const [rakBuku, setRakBuku] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRakBuku();
    }, []);

    const fetchRakBuku = async () => {
        setLoading(true);
        try {
            const response = await api.get('/rak-buku');
            setRakBuku(response.data.data);
            setError(null);
        } catch (err) {
            setError('Gagal memuat rak buku. Pastikan Anda sudah login.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Yakin ingin menghapus buku ini dari rak?')) return;
        
        try {
            await api.delete(`/rak-buku/${id}`);
            setRakBuku(rakBuku.filter(item => item.id !== id));
        } catch (err) {
            alert('Gagal menghapus buku dari rak.');
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <FontAwesomeIcon icon={faSpinner} spin size="3x" className="text-primary" />
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="font-weight-bold text-primary">Rak Buku Saya</h3>
            </div>

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {rakBuku.length === 0 && !error ? (
                <div className="card text-center p-5">
                    <FontAwesomeIcon icon={faBook} size="4x" className="text-muted mb-3" />
                    <h5 className="text-muted">Rak buku Anda masih kosong.</h5>
                    <p className="text-muted">Jelajahi e-Pustaka untuk menambahkan buku ke rak Anda.</p>
                </div>
            ) : (
                <div className="row">
                    {rakBuku.map((item) => (
                        <div className="col-md-4 col-sm-6 mb-4" key={item.id}>
                            <div className="card h-100 shadow-sm border-0">
                                <div className="card-body">
                                    <h5 className="card-title font-weight-bold">{item.book?.name}</h5>
                                    <h6 className="card-subtitle mb-2 text-muted">{item.book?.penerbit}</h6>
                                    <p className="card-text small text-muted">
                                        Status: <span className="badge badge-info">{item.status.replace('_', ' ')}</span>
                                    </p>
                                    <div className="d-flex justify-content-between align-items-center mt-4">
                                        <button className="btn btn-sm btn-outline-primary">
                                            Baca Sekarang
                                        </button>
                                        <button 
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleDelete(item.id)}
                                            title="Hapus dari Rak"
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RakBukuPage;
