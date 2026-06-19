import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getBookAPI, deleteBookAPI } from '../../../../actions/book';
import { getPeminjamanAPI } from '../../../../actions/peminjaman';
import BookList from './BookList';
import jwt from 'jwt-decode';

class BookListPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			filterMode: 'all'
		};
	}

	componentDidMount() {
		this.props.getBook();
		this.props.getPeminjaman();
	}

	setFilter = (mode) => {
		this.setState({ filterMode: mode });
	};

	render() {
		const { books, peminjamans, isAuthenticated, token } = this.props;
		const { filterMode } = this.state;

		let jwtDecode = null;
		if (isAuthenticated && token) {
			try {
				jwtDecode = jwt(token);
			} catch (e) {}
		}
		const isAdmin = jwtDecode && jwtDecode.role === 'admin';

		// Get set of borrowed book IDs
		const borrowedBookIds = new Set(peminjamans.map(p => p.book_id));

		// Filter books dynamically based on active tab
		const filteredBooks = books.filter(book => {
			if (filterMode === 'available') {
				return book.stock > 0;
			}
			if (filterMode === 'borrowed') {
				return borrowedBookIds.has(book.id);
			}
			if (filterMode === 'out_of_stock') {
				return book.stock === 0;
			}
			return true; // 'all'
		});

		return (
			<div className="animate-fade-in">
				{/* Catalog Header */}
				<div className="d-flex justify-content-between align-items-center mb-4">
					<div>
						<h2 className="font-weight-bold mb-1" style={{ color: 'var(--text-main)' }}>Katalog Buku</h2>
						<p className="text-muted mb-0">Akses katalog arsip buku dan pemantauan ketersediaan stok</p>
					</div>
					{isAdmin && (
						<Link to="/book/create" className="btn btn-primary shadow-sm">
							<span className="mr-2" role="img" aria-label="plus">➕</span> Tambah Buku
						</Link>
					)}
				</div>

				{/* Filters Tabs Row */}
				<div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
					<div style={{ display: 'flex', gap: '8px' }}>
						<button 
							onClick={() => this.setFilter('all')} 
							className={`btn btn-sm btn-outline-primary ${filterMode === 'all' ? 'active' : ''}`}
							style={{ borderRadius: '6px' }}
						>
							Semua Buku
						</button>
						<button 
							onClick={() => this.setFilter('available')} 
							className={`btn btn-sm btn-outline-primary ${filterMode === 'available' ? 'active' : ''}`}
							style={{ borderRadius: '6px' }}
						>
							Tersedia
						</button>
						<button 
							onClick={() => this.setFilter('borrowed')} 
							className={`btn btn-sm btn-outline-primary ${filterMode === 'borrowed' ? 'active' : ''}`}
							style={{ borderRadius: '6px' }}
						>
							Sedang Dipinjam
						</button>
						<button 
							onClick={() => this.setFilter('out_of_stock')} 
							className={`btn btn-sm btn-outline-primary ${filterMode === 'out_of_stock' ? 'active' : ''}`}
							style={{ borderRadius: '6px' }}
						>
							Stok Habis
						</button>
					</div>
				</div>

				<BookList 
					books={filteredBooks} 
					deleteBook={this.props.deleteBook}
					isAdmin={isAdmin}
				/> 
			</div>
		)
	}

}

const mapDispatchToProps = (dispatch) => ({
	getBook: () => dispatch(getBookAPI()),
	deleteBook: (id) => dispatch(deleteBookAPI(id)),
	getPeminjaman: () => dispatch(getPeminjamanAPI())
})

const mapStateToProps = (state) => ({
	books: state.book.books,
	peminjamans: state.peminjaman.peminjamans,
	isAuthenticated: state.auth.isAuthenticated,
	token: state.auth.token
})

export default connect(mapStateToProps, mapDispatchToProps)(BookListPage)