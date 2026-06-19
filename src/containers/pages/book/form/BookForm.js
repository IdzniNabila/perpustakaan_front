/* eslint-disable array-callback-return */
import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { TextInput } from '../../../../components/Formik/TextInput';
import { DatePickerInput } from '../../../../components/Formik/DatePickerInput';
import { useHistory } from 'react-router-dom';

// FIX: Laravel validation error format adalah { message, errors: { field: [...] } }
// bukan { error: { errors: { field: [...] } } }
const getValidationErrors = (err) => {
	const data = err?.response?.data;
	// Format Laravel: { message: '...', errors: { field: ['msg'] } }
	if (data?.errors) return data.errors;
	// Fallback format lama: { error: { errors: {...} } }
	if (data?.error?.errors) return data.error.errors;
	return {};
};

const BookForm = ({ book, storeBook, updateBook }) => {
	let history = useHistory();

	const initialValues = {
		name: '',
		description: '',
		penerbit: '',
		tanggal_terbit: '',
		stock: ''
	}

	return (
		<Formik
			initialValues={book.id ? book : initialValues}
	        enableReinitialize
			validationSchema={Yup.object({
				name: Yup.string()
					.required('Required'),
				description: Yup.string()
					.required('Required'),
				penerbit: Yup.string()
					.required('Required'),
				tanggal_terbit: Yup.date()
					.required('Required'),
				stock: Yup.number()
					.required('Required')
			})}
			onSubmit={(data, actions) => {
				if(!data.id) {
					storeBook(data)
						.then((res) => {
							history.push('/book')
						}, (err) => {
							const errors = getValidationErrors(err);
							Object.keys(errors).map((key) => {
								actions.setFieldError(key, errors[key])
							})
						});
				} else {
					updateBook(data, data.id)
						.then((res) => {
							history.push('/book')
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
						label="Description"
						type="text"
						name="description"
						placeholder="Enter Description name here"
					/>
					<TextInput
						label="Penerbit"
						type="text"
						name="penerbit"
						placeholder="Enter your Penerbit here"
					/>
					<DatePickerInput
						label="Tanggal Terbit"
						name="tanggal_terbit"
						placeholderText="Enter your Tanggal Terbit here"
						dateFormat="yyyy-MM-dd"
					/>
					<TextInput
						label="Stock"
						type="number"
						name="stock"
						placeholder="Enter your Stock here"
					/>
					<button type="submit" className="btn btn-primary btn-block">
						{book.id ? 'UPDATE' : 'CREATE'}
					</button>					
				</Form>
			)}
		</Formik>
	)
}

export default BookForm;
