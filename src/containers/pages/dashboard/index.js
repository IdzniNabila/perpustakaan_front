import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getBookAPI } from '../../../actions/book';
import { getPeminjamanAPI } from '../../../actions/peminjaman';
import { getUserAPI } from '../../../actions/user';

class DashboardPage extends Component {
    componentDidMount() {
        if (this.props.books.length === 0) this.props.getBook();
        if (this.props.peminjamans.length === 0) this.props.getPeminjaman();
        if (this.props.users.length === 0) this.props.getUser();
    }

    render() {
        const totalBooks = this.props.books.length;
        const totalVolumes = this.props.books.reduce((acc, book) => acc + (book.stock || 0), 0);
        const totalUsers = this.props.users.length - 1; // excluding Admin
        const totalLoans = this.props.peminjamans.length;
        
        const overdueLoans = this.props.peminjamans.filter(p => {
            if (!p.tgl_kembali) return false;
            const tglKembali = new Date(p.tgl_kembali);
            const now = new Date();
            tglKembali.setHours(0,0,0,0);
            now.setHours(0,0,0,0);
            return tglKembali < now;
        }).length;

        const recentLoans = this.props.peminjamans.slice(0, 5);

        return (
            <div className="dashboard-content animate-fade-in">
                {/* Header Section */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="font-weight-bold mb-1" style={{ color: 'var(--text-main)' }}>Registry Overview</h2>
                        <p className="text-muted mb-0">Operational snapshot for Today</p>
                    </div>
                </div>

                {/* Overview Cards Row */}
                <div className="row mb-4">
                    <div className="col-md-4">
                        <div className="card shadow-sm border-0">
                            <div className="card-body d-flex align-items-center">
                                <div className="rounded-circle p-3 mr-3" style={{ background: 'rgba(92, 107, 192, 0.1)', color: 'var(--primary)' }}>
                                    <span style={{ fontSize: '24px' }} role="img" aria-label="books">📚</span>
                                </div>
                                <div>
                                    <h5 className="text-muted mb-1 font-weight-medium">Total Volumes</h5>
                                    <h3 className="font-weight-bold mb-0">{totalVolumes}</h3>
                                    <small className="text-success font-weight-bold">+{totalBooks} unique titles</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card shadow-sm border-0">
                            <div className="card-body d-flex align-items-center">
                                <div className="rounded-circle p-3 mr-3" style={{ background: 'rgba(0, 172, 193, 0.1)', color: 'var(--secondary)' }}>
                                    <span style={{ fontSize: '24px' }} role="img" aria-label="users">👥</span>
                                </div>
                                <div>
                                    <h5 className="text-muted mb-1 font-weight-medium">Active Users</h5>
                                    <h3 className="font-weight-bold mb-0">{totalUsers >= 0 ? totalUsers : 0}</h3>
                                    <small className="text-success font-weight-bold">Registered members</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card shadow-sm border-0">
                            <div className="card-body d-flex align-items-center">
                                <div className="rounded-circle p-3 mr-3" style={{ background: 'rgba(239, 83, 80, 0.1)', color: 'var(--danger)' }}>
                                    <span style={{ fontSize: '24px' }} role="img" aria-label="warning">⚠️</span>
                                </div>
                                <div>
                                    <h5 className="text-muted mb-1 font-weight-medium">Total Loans</h5>
                                    <h3 className="font-weight-bold mb-0">{totalLoans}</h3>
                                    <small className="text-danger font-weight-bold">{overdueLoans} overdue loans</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashboard Details Row */}
                <div className="row">
                    {/* Left Column: Recent Activity Table */}
                    <div className="col-md-8">
                        <div className="card shadow-sm border-0">
                            <div className="card-header d-flex justify-content-between align-items-center bg-transparent border-0 pt-4 px-4">
                                <h5 className="font-weight-bold mb-0" style={{ color: 'var(--text-main)' }}>Recent Activity</h5>
                            </div>
                            <div className="card-body px-4 pb-4">
                                <div className="table-responsive">
                                    <table className="table mb-0">
                                        <thead>
                                            <tr>
                                                <th className="border-0 px-2">TX ID</th>
                                                <th className="border-0">Volume Title</th>
                                                <th className="border-0">Member</th>
                                                <th className="border-0">Status</th>
                                                <th className="border-0 text-right">Borrow Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentLoans.length === 0 ? (
                                                <tr>
                                                    <td colSpan="5" className="text-center text-muted py-4">No recent activity</td>
                                                </tr>
                                            ) : (
                                                recentLoans.map((p) => {
                                                    const tglKembali = new Date(p.tgl_kembali);
                                                    const now = new Date();
                                                    tglKembali.setHours(0,0,0,0);
                                                    now.setHours(0,0,0,0);
                                                    const isOverdue = tglKembali < now;
                                                    
                                                    return (
                                                        <tr key={p.id}>
                                                            <td className="px-2 font-weight-bold">TX-{1000 + p.id}</td>
                                                            <td>{p.book ? p.book.name : 'Unknown Book'}</td>
                                                            <td>{p.user ? p.user.name : 'Unknown Member'}</td>
                                                            <td>
                                                                <span className={`badge ${isOverdue ? 'badge-danger' : 'badge-primary'}`}>
                                                                    {isOverdue ? 'Overdue' : 'Active'}
                                                                </span>
                                                            </td>
                                                            <td className="text-right text-muted">{p.tgl_pinjam}</td>
                                                        </tr>
                                                    );
                                                })
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Collection Health & Info */}
                    <div className="col-md-4">
                        <div className="card shadow-sm border-0 mb-4">
                            <div className="card-header bg-transparent border-0 pt-4 px-4">
                                <h5 className="font-weight-bold mb-0" style={{ color: 'var(--text-main)' }}>Collection Health</h5>
                            </div>
                            <div className="card-body px-4 pb-4">
                                <div className="mb-4">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="font-weight-medium" style={{ fontSize: '14px' }}>Maintenance Compliance</span>
                                        <span className="font-weight-bold text-success" style={{ fontSize: '14px' }}>94%</span>
                                    </div>
                                    <div className="progress" style={{ height: '8px', borderRadius: '4px' }}>
                                        <div className="progress-bar" role="progressbar" style={{ width: '94%', backgroundColor: 'var(--success)', borderRadius: '4px' }} aria-valuenow="94" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-between py-2 border-bottom">
                                    <span className="text-muted" style={{ fontSize: '14px' }}>Active Catalog</span>
                                    <span className="font-weight-bold" style={{ fontSize: '14px', color: 'var(--text-main)' }}>85% (Optimal)</span>
                                </div>
                                <div className="d-flex justify-content-between py-2 border-bottom">
                                    <span className="text-muted" style={{ fontSize: '14px' }}>Lost/Damaged</span>
                                    <span className="font-weight-bold text-danger" style={{ fontSize: '14px' }}>2% (Low)</span>
                                </div>
                                <div className="d-flex justify-content-between py-2">
                                    <span className="text-muted" style={{ fontSize: '14px' }}>Warning Space</span>
                                    <span className="font-weight-bold text-warning" style={{ fontSize: '14px' }}>30% Capacity</span>
                                </div>
                            </div>
                        </div>

                        {/* Featured Book Showcase Card */}
                        <div className="card border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)', color: '#ffffff' }}>
                            <div className="card-body p-4 text-center">
                                <span style={{ fontSize: '40px', marginBottom: '15px', display: 'block' }} role="img" aria-label="open book">📖</span>
                                <h5 className="font-weight-bold mb-2">Lexicon of Legacy</h5>
                                <p className="mb-0" style={{ fontSize: '12px', opacity: 0.85 }}>Featured Book of the Week</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    books: state.book.books,
    peminjamans: state.peminjaman.peminjamans,
    users: state.user.users
});

const mapDispatchToProps = (dispatch) => ({
    getBook: () => dispatch(getBookAPI()),
    getPeminjaman: () => dispatch(getPeminjamanAPI()),
    getUser: () => dispatch(getUserAPI())
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage);
