import React, { Component } from 'react';
import LoginForm from './LoginForm';
import { connect } from 'react-redux';
import { loginAPI } from '../../../actions/auth';

class LoginPage extends Component {

	render() {
		return (
			<div className="auth-wrapper w-100">
				<div className="container">
					<div className="row no-gutters col-md-10 mx-auto">
						<div className="col-md-6 auth-card-left">
							<h3 className="mb-4 font-weight-bold" style={{ color: 'var(--primary-hover)' }}>E-Library Login</h3>
							<p className="text-muted mb-4">Silakan masuk menggunakan akun pustakawan Anda untuk mengelola buku dan peminjaman.</p>
							<LoginForm 
								login={this.props.login}
							/>
						</div>
						<div className="col-md-6 auth-card-right">
							<img 
								src="/library_login_banner.png" 
								alt="Library Illustration" 
								className="auth-illustration"
							/>
							<h4 className="font-weight-bold">Manajemen Perpustakaan</h4>
							<p className="px-3" style={{ opacity: 0.9 }}>
								Sistem informasi perpustakaan modern, cepat, aman, dan mudah digunakan untuk manajemen sirkulasi buku.
							</p>
						</div>
					</div>
				</div>
			</div>
		)
	}

}

const mapDispatchToProps = (dispatch) => ({
	login: (data) => dispatch(loginAPI(data))
})

export default connect(null, mapDispatchToProps)(LoginPage);