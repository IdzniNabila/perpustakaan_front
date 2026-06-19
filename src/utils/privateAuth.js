import React, { Component } from 'react';
import { connect } from 'react-redux';	

export default function privateAuth (ComposedComponent) {

	class Authentication extends Component {

		componentDidMount() {
			if (!this.props.isAuthenticated) {
				this.props.history.push('/')
			} 
		}

		// FIX: componentWillUpdate deprecated → pakai componentDidUpdate
		componentDidUpdate(prevProps) {
			if (!this.props.isAuthenticated) {
				this.props.history.push('/')
			} 
		}

		render() {
			return <ComposedComponent {...this.props} />
		}
	}

	const mapStateToProps = (state) => ({
		isAuthenticated: state.auth.isAuthenticated
	})

	return connect(mapStateToProps, null)(Authentication);
}
