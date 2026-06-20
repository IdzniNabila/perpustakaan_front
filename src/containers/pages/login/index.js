import React, { Component } from 'react';
import LoginForm from './LoginForm';
import { connect } from 'react-redux';
import { loginAPI } from '../../../actions/auth';

class LoginPage extends Component {

	render() {
		return (
			<div className="auth-wrapper">
				<div className="auth-card-left">
					<span className="mb-2" role="img" aria-label="books" style={{ fontSize: '48px' }}>📚</span>
					<h3 className="mb-2 font-weight-bold" style={{ color: 'var(--primary-hover)' }}>Athenaeum</h3>
					<p className="text-muted mb-4 text-center">Sistem Informasi Perpustakaan Modern</p>
					
					<LoginForm 
						login={this.props.login}
					/>
				</div>
			</div>
		)
	}

}

const mapDispatchToProps = (dispatch) => ({
	login: (data) => dispatch(loginAPI(data))
})

export default connect(null, mapDispatchToProps)(LoginPage);