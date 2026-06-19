import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getPeminjamanAPI, deletePeminjamanAPI } from '../../../../actions/peminjaman';
import { getBookAPI } from '../../../../actions/book';
import PeminjamanList from './PeminjamanList';

class PeminjamanListPage extends Component {

	componentDidMount() {
		this.props.getPeminjaman();
		this.props.getBook();
	}

	render() {
		const totalLoans = this.props.peminjamans.length;
		const totalBooks = this.props.books.length;
		const totalVolumes = this.props.books.reduce((acc, book) => acc + (book.stock || 0), 0);
		
		const overdueCount = this.props.peminjamans.filter(p => {
			if (!p.tgl_kembali) return false;
			const tglKembali = new Date(p.tgl_kembali);
			const now = new Date();
			tglKembali.setHours(0,0,0,0);
			now.setHours(0,0,0,0);
			return tglKembali < now;
		}).length;

		return (
			<div className="animate-fade-in">
				{/* Circulation Header */}
				<div className="d-flex justify-content-between align-items-center mb-4">
					<div>
						<h2 className="font-weight-bold mb-1" style={{ color: 'var(--text-main)' }}>Registri Sirkulasi</h2>
						<p className="text-muted mb-0">Status sirkulasi langsung dan konsol manajemen sirkulasi</p>
					</div>
					<Link to="/peminjaman/create" className="btn btn-primary shadow-sm">
						<span className="mr-2" role="img" aria-label="plus">➕</span> Tambah Peminjaman
					</Link>
				</div>

				{/* Stats Row */}
				<div className="row mb-4">
					<div className="col-md-3">
						<div className="card shadow-sm border-0 p-2">
							<div className="card-body">
								<h6 className="text-muted mb-2 font-weight-medium">Sirkulasi Aktif</h6>
								<h3 className="font-weight-bold mb-0 text-primary">{totalLoans}</h3>
							</div>
						</div>
					</div>
					<div className="col-md-3">
						<div className="card shadow-sm border-0 p-2">
							<div className="card-body">
								<h6 className="text-muted mb-2 font-weight-medium">Keterlambatan</h6>
								<h3 className="font-weight-bold mb-0 text-danger">{overdueCount}</h3>
							</div>
						</div>
					</div>
					<div className="col-md-3">
						<div className="card shadow-sm border-0 p-2">
							<div className="card-body">
								<h6 className="text-muted mb-2 font-weight-medium">Total Volume</h6>
								<h3 className="font-weight-bold mb-0 text-success">{totalVolumes}</h3>
							</div>
						</div>
					</div>
					<div className="col-md-3">
						<div className="card shadow-sm border-0 p-2">
							<div className="card-body">
								<h6 className="text-muted mb-2 font-weight-medium">Judul Unik</h6>
								<h3 className="font-weight-bold mb-0 text-warning">{totalBooks}</h3>
							</div>
						</div>
					</div>
				</div>

				{/* Loan Register Table Card */}
				<div className="card border-0 shadow-sm">
					<div className="card-header bg-transparent border-0 pt-4 px-4 pb-0">
						<h5 className="font-weight-bold mb-0" style={{ color: 'var(--text-main)' }}>Daftar Peminjaman Aktif</h5>
					</div>
					<div className="card-body px-4 pb-4">
						<PeminjamanList 
							peminjamans={this.props.peminjamans} 
							deletePeminjaman={this.props.deletePeminjaman}
						/> 
					</div>
				</div>
			</div>
		)
	}

}

const mapDispatchToProps = (dispatch) => ({
	getPeminjaman: () => dispatch(getPeminjamanAPI()),
	deletePeminjaman: (id) => dispatch(deletePeminjamanAPI(id)),
	getBook: () => dispatch(getBookAPI())
})

const mapStateToProps = (state) => ({
	peminjamans: state.peminjaman.peminjamans,
	books: state.book.books
})

export default connect(mapStateToProps, mapDispatchToProps)(PeminjamanListPage)