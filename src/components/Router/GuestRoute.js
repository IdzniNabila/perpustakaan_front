import React from 'react';
import {Route, Redirect} from 'react-router-dom';

// Guest Route: jika sudah login, redirect ke dashboard (bukan /admin yang tidak ada)
export const GuestRoute = ({component: Component, ...rest}) => (
	<Route {...rest} render={props => {
		const jwt = JSON.parse(localStorage.getItem('jwt'));
		if(jwt) {
			return <Redirect to={{pathname: '/peminjaman'}} />
		}

		return <Component {...props} />
	}} />
)
