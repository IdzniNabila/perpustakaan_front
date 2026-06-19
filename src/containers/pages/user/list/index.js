import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getUserAPI, deleteUserAPI } from '../../../../actions/user';
import { getPeminjamanAPI } from '../../../../actions/peminjaman';
import UserList from './UserList';

class UserListPage extends Component {

	componentDidMount() {
		this.props.getUser();
		this.props.getPeminjaman();
	}

	render() {
		const totalRegisteredUsers = this.props.users.length;
		const totalUsers = this.props.users.length - 1; // excluding Admin
		const totalLoans = this.props.peminjamans.length;
		
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
				{/* Activity Header */}
				<div className="d-flex justify-content-between align-items-center mb-4">
					<div>
						<h2 className="font-weight-bold mb-1" style={{ color: 'var(--text-main)' }}>Activity Registry</h2>
						<p className="text-muted mb-0">Real-time monitoring of circulation and institutional interactions</p>
					</div>
					<Link to="/user/create" className="btn btn-primary shadow-sm">
						<span className="mr-2" role="img" aria-label="plus">➕</span> New User
					</Link>
				</div>

				{/* Stats Row */}
				<div className="row mb-4">
					<div className="col-md-3">
						<div className="card shadow-sm border-0 p-2">
							<div className="card-body">
								<h6 className="text-muted mb-2 font-weight-medium">Total Registered Users</h6>
								<h3 className="font-weight-bold mb-0 text-primary">{totalRegisteredUsers}</h3>
							</div>
						</div>
					</div>
					<div className="col-md-3">
						<div className="card shadow-sm border-0 p-2">
							<div className="card-body">
								<h6 className="text-muted mb-2 font-weight-medium">Active Members</h6>
								<h3 className="font-weight-bold mb-0 text-danger">{totalUsers >= 0 ? totalUsers : 0}</h3>
							</div>
						</div>
					</div>
					<div className="col-md-3">
						<div className="card shadow-sm border-0 p-2">
							<div className="card-body">
								<h6 className="text-muted mb-2 font-weight-medium">Active Loans</h6>
								<h3 className="font-weight-bold mb-0 text-success">{totalLoans}</h3>
							</div>
						</div>
					</div>
					<div className="col-md-3">
						<div className="card shadow-sm border-0 p-2">
							<div className="card-body">
								<h6 className="text-muted mb-2 font-weight-medium">Overdue Loans</h6>
								<h3 className="font-weight-bold mb-0 text-warning">{overdueCount}</h3>
							</div>
						</div>
					</div>
				</div>

				{/* User Registry Table Card */}
				<div className="card border-0 shadow-sm">
					<div className="card-header bg-transparent border-0 pt-4 px-4 pb-0">
						<h5 className="font-weight-bold mb-0" style={{ color: 'var(--text-main)' }}>Recent Log Entries</h5>
					</div>
					<div className="card-body px-4 pb-4">
						<UserList 
							users={this.props.users} 
							deleteUser={this.props.deleteUser}
						/>
					</div>
				</div>
			</div>
		)
	}

}

const mapDispatchToProps = (dispatch) => ({
	getUser: () => dispatch(getUserAPI()),
	deleteUser: (id) => dispatch(deleteUserAPI(id)),
	getPeminjaman: () => dispatch(getPeminjamanAPI())
})

const mapStateToProps = (state) => ({
	users: state.user.users,
	peminjamans: state.peminjaman.peminjamans
})

export default connect(mapStateToProps, mapDispatchToProps)(UserListPage)