import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { withRouter } from 'react-router-dom';
import { closeToast } from '../../actions/toast';
import Sidebar from '../../components/Dashboard/Sidebar';

const DashboardLayout = (props) => {

	const dispatch = useDispatch();
	const message = useSelector(state => state.toast.message);
	const show = useSelector(state => state.toast.show);

	const handleToast = () => {
		dispatch(closeToast())
	}

	useEffect(() => {
		// masih blom bisa toast nya masih muncul di halaman lain
		if (message === null) {
			props.history.listen((location, action) => {
				dispatch(closeToast());
			})
		}

	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])


	return (
		<div className="dashboard-layout-wrapper">
			<Sidebar />
			<div className="main-content">

				{/*Notif*/}
				{show ? 
					<div className="alert alert-success alert-dismissible fade show" role="alert">
					  {message}
					  <button type="button" onClick={handleToast} className="close" data-dismiss="alert" aria-label="Close">
					    <span aria-hidden="true">&times;</span>
					  </button>
					</div> :
					null
				}

				{props.children}
			</div>
		</div>
	)
}

export default withRouter(DashboardLayout)