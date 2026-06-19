import React from 'react'
import Table from '../../../../components/ReactTable/Table'
import { Link } from 'react-router-dom'

export default function UserList({ users, deleteUser }) {
	const columns = React.useMemo(
		() => [	
			{
				Header: 'Name',
				accessor: 'name'
			},
			{
				Header: 'Email',
				accessor: 'email'
			},
			{
				Header: 'Aksi',
				disableFilters: true,
				Cell: ({row}) => (
					<div style={{ display: 'flex', gap: '6px' }}>
						<Link to={`/user/${row.original.id}/edit`} className="btn btn-sm btn-primary" style={{ borderRadius: '6px' }}>Edit</Link>
						<button onClick={() => deleteUser(row.original.id)} className="btn btn-sm btn-danger" style={{ borderRadius: '6px' }}>Hapus</button>
					</div>
				)
			}
		],
		[deleteUser]
	)

	return (
		<React.Fragment>
			<Table columns={columns} data={users} />
		</React.Fragment>
	)
}