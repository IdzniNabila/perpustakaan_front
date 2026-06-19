/* eslint-disable array-callback-return */
import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { TextInput } from '../../../../components/Formik/TextInput';
import { useHistory } from 'react-router-dom';

// FIX: Laravel validation error format
const getValidationErrors = (err) => {
	const data = err?.response?.data;
	if (data?.errors) return data.errors;
	if (data?.error?.errors) return data.error.errors;
	return {};
};

const UserForm = ({ user, storeUser, updateUser }) => {
	let history = useHistory();

	const initialValues = {
		name: '',
		email: '',
		password: ''
	}

	return (
		<Formik
			initialValues={user.id ? { ...user, password: '' } : initialValues}
	        enableReinitialize
			validationSchema={Yup.object({
				name: Yup.string()
					.required('Required'),
				email: Yup.string()
					.email('Invalid email address')
					.required('Required'),
				password: user.id 
					? Yup.string() 
					: Yup.string().required('Required')
			})}
			onSubmit={(data, actions) => {
				if(!data.id) {
					storeUser(data)
						.then((res) => {
							history.push('/user')
						}, (err) => {
							const errors = getValidationErrors(err);
							Object.keys(errors).map((key) => {
								actions.setFieldError(key, errors[key])
							})
						});
				} else {
					updateUser(data, data.id)
						.then((res) => {
							history.push('/user')
						}, (err) => {
							const errors = getValidationErrors(err);
							Object.keys(errors).map((key) => {
								actions.setFieldError(key, errors[key])
							})
						})
				}
			}}
		>
			{formik => (
				<Form>
					<TextInput
						label="Name"
						type="text"
						name="name"
						placeholder="Enter your name here"
					/>
					<TextInput
						label="Email"
						type="email"
						name="email"
						placeholder="Enter your email here"
					/>
					<TextInput
						label="Password"
						type="password"
						name="password"
						placeholder={user.id ? "Kosongkan jika tidak ingin mengubah password" : "Enter your password here"}
					/>
					<button type="submit" className="btn btn-primary btn-block">
						{user.id ? 'UPDATE' : 'CREATE'}
					</button>					
				</Form>
			)}
		</Formik>
	)
}

export default UserForm;
