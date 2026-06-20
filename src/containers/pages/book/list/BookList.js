import React from 'react'
import { Link } from 'react-router-dom'
import { BACKEND_URL } from '../../../../utils/api'

export default function BookList({ books, deleteBook, isAdmin }) {
	const gradients = [
		'linear-gradient(135deg, #5c6bc0 0%, #3f51b5 100%)',
		'linear-gradient(135deg, #00acc1 0%, #00838f 100%)',
		'linear-gradient(135deg, #ab47bc 0%, #8e24aa 100%)',
		'linear-gradient(135deg, #26a69a 0%, #00796b 100%)',
		'linear-gradient(135deg, #ff7043 0%, #d84315 100%)',
		'linear-gradient(135deg, #ec407a 0%, #c2185b 100%)',
	];

	const getGradient = (title) => {
		const index = Math.abs(title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % gradients.length;
		return gradients[index];
	};

	return (
		<div className="row">
			{books && books.length > 0 ? (
				books.map((book) => (
					<div className="col-md-3 col-sm-6 mb-4 animate-fade-in" key={book.id}>
						<div className="card h-100 border-0 shadow-sm overflow-hidden">
							{/* Styled Dynamic Book Cover or Cover Image */}
							{book.image ? (
								<div className="book-cover-image-container">
									<img 
										src={`${BACKEND_URL}${book.image}`} 
										alt={book.name} 
										className="book-cover-image"
									/>
								</div>
							) : (
								<div 
									className="book-cover-styled d-flex flex-column justify-content-between p-3" 
									style={{ background: getGradient(book.name) }}
								>
									<div className="book-cover-title text-truncate-2">{book.name}</div>
									<div className="book-cover-publisher text-uppercase font-weight-bold" style={{ fontSize: '10px', opacity: 0.8 }}>
										{book.penerbit}
									</div>
								</div>
							)}
							
							{/* Book Info Body */}
							<div className="card-body d-flex flex-column justify-content-between p-3">
								<div>
									<h6 className="card-title font-weight-bold mb-1 text-truncate" title={book.name}>
										{book.name}
									</h6>
									<p className="card-text text-muted mb-2 text-truncate" style={{ fontSize: '12px' }} title={book.description}>
										{book.description}
									</p>
									<span className={`badge ${book.stock > 0 ? 'badge-success' : 'badge-danger'}`}>
										{book.stock > 0 ? `Stok: ${book.stock}` : 'Stok Habis'}
									</span>
								</div>
								
								{/* Actions */}
								<div className={`d-flex align-items-center mt-3 pt-2 border-top ${isAdmin ? 'justify-content-between' : 'justify-content-end'}`}>
									{isAdmin && (
										<div>
											<Link to={`/book/${book.id}/edit`} className="btn btn-sm btn-outline-primary mr-2" style={{ borderRadius: '6px' }}>
												Edit
											</Link>
											<button 
												onClick={() => deleteBook(book.id)} 
												className="btn btn-sm btn-outline-danger" 
												style={{ borderRadius: '6px' }}
											>
												Hapus
											</button>
										</div>
									)}
									<button 
										onClick={async () => {
											try {
												const api = require('../../../../utils/api').default;
												await api.post('/rak-buku', { book_id: book.id });
												alert('Buku berhasil ditambahkan ke rak!');
											} catch (err) {
												alert('Gagal menambahkan ke rak. Mungkin sudah ada di rak Anda.');
											}
										}} 
										className={`btn btn-sm ${isAdmin ? 'btn-outline-success' : 'btn-primary'}`} 
										style={{ borderRadius: '6px', fontSize: '12px' }}
										title="Tambahkan ke Rak Buku Saya"
									>
										Rak Buku
									</button>
								</div>
							</div>
						</div>
					</div>
				))
			) : (
				<div className="col-12 text-center py-5">
					<p className="text-muted">Tidak ada buku dalam katalog.</p>
				</div>
			)}
		</div>
	)
}