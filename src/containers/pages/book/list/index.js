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
			filterMode: 'all',
			searchQuery: '',
			searchField: 'name' // 'name', 'penerbit', 'tahun'
		};
	}

	componentDidMount() {
		this.props.getBook();
		this.props.getPeminjaman();
	}

	setFilter = (mode) => {
		this.setState({ filterMode: mode });
	};

	setSearchQuery = (e) => {
		this.setState({ searchQuery: e.target.value });
	};

	setSearchField = (e) => {
		this.setState({ searchField: e.target.value });
	};

	render() {
		const { books, peminjamans, isAuthenticated, token } = this.props;
		const { filterMode, searchQuery, searchField } = this.state;

		let jwtDecode = null;
		if (isAuthenticated && token) {
			try {
				jwtDecode = jwt(token);
			} catch (e) {}
		}
		const isAdmin = jwtDecode && jwtDecode.role === 'admin';

		// Get set of borrowed book IDs
		const borrowedBookIds = new Set(peminjamans.map(p => p.book_id));

		// Filter books dynamically based on active tab and search query
		const filteredBooks = books.filter(book => {
			let passTab = true;
			if (filterMode === 'available') {
				passTab = book.stock > 0;
			} else if (filterMode === 'borrowed') {
				passTab = borrowedBookIds.has(book.id);
			} else if (filterMode === 'out_of_stock') {
				passTab = book.stock === 0;
			}

			let passSearch = true;
			if (searchQuery.trim() !== '') {
				const query = searchQuery.toLowerCase();
				if (searchField === 'name') {
					passSearch = book.name?.toLowerCase().includes(query) || book.description?.toLowerCase().includes(query);
				} else if (searchField === 'penerbit') {
					passSearch = book.penerbit?.toLowerCase().includes(query);
				} else if (searchField === 'tahun') {
					passSearch = book.tanggal_terbit?.includes(query);
				}
			}

			return passTab && passSearch;
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
							Tambah Buku
						</Link>
					)}
				</div>

				{/* Search & Filters */}
				<div className="card shadow-sm border-0 mb-4" style={{ borderRadius: '12px' }}>
					<div className="card-body p-3">
						<div className="row align-items-center">
							<div className="col-md-7 mb-2 mb-md-0">
								<div className="input-group">
									<div className="input-group-prepend">
										<select 
											className="custom-select" 
											style={{ borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px', borderRight: 'none', backgroundColor: '#FAF9F6', maxWidth: '140px' }}
											value={searchField}
											onChange={this.setSearchField}
										>
											<option value="name">Judul</option>
											<option value="penerbit">Penerbit</option>
											<option value="tahun">Tahun Terbit</option>
										</select>
									</div>
									<input 
										type="text" 
										className="form-control" 
										placeholder="Cari koleksi buku perpustakaan..." 
										style={{ borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}
										value={searchQuery}
										onChange={this.setSearchQuery}
									/>
								</div>
							</div>
							<div className="col-md-5 d-flex justify-content-md-end">
								<div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
									<button 
										onClick={() => this.setFilter('all')} 
										className={`btn btn-sm ${filterMode === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
										style={{ borderRadius: '6px', whiteSpace: 'nowrap' }}
									>
										Semua Buku
									</button>
									<button 
										onClick={() => this.setFilter('available')} 
										className={`btn btn-sm ${filterMode === 'available' ? 'btn-primary' : 'btn-outline-primary'}`}
										style={{ borderRadius: '6px', whiteSpace: 'nowrap' }}
									>
										Tersedia
									</button>
									<button 
										onClick={() => this.setFilter('borrowed')} 
										className={`btn btn-sm ${filterMode === 'borrowed' ? 'btn-primary' : 'btn-outline-primary'}`}
										style={{ borderRadius: '6px', whiteSpace: 'nowrap' }}
									>
										Dipinjam
									</button>
								</div>
							</div>
						</div>
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