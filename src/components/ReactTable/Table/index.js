import React from 'react'
import { useTable, useGlobalFilter, usePagination, useFilters, useSortBy  } from 'react-table'
// import matchSorter from 'match-sorter'
import { faCaretDown, faCaretUp, faAngleDoubleLeft, faAngleLeft, faAngleRight, faAngleDoubleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './Table.css';

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length

  return (
    <div className="form-group row">
      <label className="col-sm-2 col-form-label">Search</label>
      <div className="col-sm-10">
	      <input
	        value={globalFilter || ''}
	        onChange={e => {
	          setGlobalFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
	        }}
	        className="form-control"
	        placeholder={`${count} records...`}
	      />
      </div>
    </div>	    
  )
}

// Define a default UI for filtering
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length

  return (
    <input
      value={filterValue || ''}
      className="form-control"
      onChange={e => {
        setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  )
}

// function fuzzyTextFilterFn(rows, id, filterValue) {
//   return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
// }

// Let the table remove the filter if the string is empty
// fuzzyTextFilterFn.autoRemove = val => !val


export default function Table ({ columns, data })  {

	// const filterTypes = React.useMemo(
	//     () => ({
	//       // Add a new fuzzyTextFilterFn filter type.
	//       // fuzzyText: fuzzyTextFilterFn,
	//       // Or, override the default text filter to use
	//       // "startWith"
	//       text: (rows, id, filterValue) => {
	//         return rows.filter(row => {
	//           const rowValue = row.values[id]
	//           return rowValue !== undefined
	//             ? String(rowValue)
	//                 .toLowerCase()
	//                 .startsWith(String(filterValue).toLowerCase())
	//             : true
	//         })
	//       },
	//     }),
	//     []
	// )


	const defaultColumn = React.useMemo(
		() => ({
		  // Let's set up our default Filter UI
		  Filter: DefaultColumnFilter,
		}),
		[]
	)	

	const {
	    getTableProps,
	    getTableBodyProps,
	    headerGroups,
	    prepareRow,
	    page, // Instead of using 'rows', we'll use page,
	    // which has only the rows for the active page

	    // Pagination Props
	    // The rest of these things are super handy, too ;)
	    canPreviousPage,
	    canNextPage,
	    pageOptions,
	    pageCount,
	    gotoPage,
	    nextPage,
	    previousPage,
	    setPageSize,
	    state: { pageIndex, pageSize, globalFilter },		

	    // Search / Filtering Props
	    preGlobalFilteredRows,
	    setGlobalFilter,	    

	} = useTable(
		{
			columns,
			data,
			initialState: { pageindex: 2 },	
			defaultColumn,
			// filterTypes,
		},
		useFilters,
		useGlobalFilter,
		useSortBy,
		usePagination
	)


    // Render the UI for your table
	return (
	    <>
	      <div className="float-right">
          	<GlobalFilter
           		preGlobalFilteredRows={preGlobalFilteredRows}
            	globalFilter={globalFilter}
            	setGlobalFilter={setGlobalFilter}
          	/>
	      </div>
	      <table {...getTableProps()} className="table mt-4 mb-3">
	        <thead>
	          {headerGroups.map(headerGroup => (
	            <tr {...headerGroup.getHeaderGroupProps()}>
	              {headerGroup.headers.map(column => (
	                <th {...column.getHeaderProps(column.getSortByToggleProps())} style={{ verticalAlign: 'middle', cursor: 'pointer' }}>
	                	{column.render('Header')}
		                <span>
		                  &nbsp; {column.isSorted ? (column.isSortedDesc ? <FontAwesomeIcon icon={faCaretUp} /> : <FontAwesomeIcon icon={faCaretDown} /> ) : ''}
		                </span>
	                    <div>{column.canFilter ? column.render('Filter') : null}</div>
	                </th>
	              ))}
	            </tr>
	          ))}
	        </thead>
	        <tbody {...getTableBodyProps()}>
	          {page.map((row, i) => {
	            prepareRow(row)
	            return (
	              <tr {...row.getRowProps()}>
	                {row.cells.map(cell => {
	                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
	                })}
	              </tr>
	            )
	          })}
	        </tbody>
	      </table>
	      {/* 
	        Pagination can be built however you'd like. 
	        This is just a very basic UI implementation:
	      */}
	      <div className="d-flex justify-content-end align-items-center mb-4 mt-3">
	        <select
	          className="custom-select custom-select-sm mr-3"
	          style={{ width: 'auto', borderRadius: '8px', cursor: 'pointer', borderColor: '#EAE6DE' }}
	          value={pageSize}
	          onChange={e => {
	            setPageSize(Number(e.target.value))
	          }}
	        >
	          {[10, 20, 30, 40, 50].map(pageSize => (
	            <option key={pageSize} value={pageSize}>
	              Tampilkan {pageSize} baris
	            </option>
	          ))}
	        </select>
			
			<div className="pagination-container d-flex align-items-center bg-white shadow-sm p-1" style={{ borderRadius: '12px', border: '1px solid #EAE6DE' }}>
				<button 
					className={`btn btn-sm ${canPreviousPage ? 'btn-light' : 'btn-white text-muted'} border-0`} 
					style={{ borderRadius: '8px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }} 
					onClick={() => gotoPage(0)} 
					disabled={!canPreviousPage}
					title="First Page"
				>
					<FontAwesomeIcon icon={faAngleDoubleLeft} />
				</button>
				<button 
					className={`btn btn-sm ${canPreviousPage ? 'btn-light' : 'btn-white text-muted'} border-0 mx-1`} 
					style={{ borderRadius: '8px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }} 
					onClick={() => previousPage()} 
					disabled={!canPreviousPage}
					title="Previous Page"
				>
					<FontAwesomeIcon icon={faAngleLeft} />
				</button>
				
				<span className="mx-3 font-weight-bold" style={{ fontSize: '14px', color: 'var(--text-main)' }}>
					Halaman <span className="text-primary">{pageIndex + 1}</span> dari {pageOptions.length}
				</span>
				
				<button 
					className={`btn btn-sm ${canNextPage ? 'btn-light' : 'btn-white text-muted'} border-0 mx-1`} 
					style={{ borderRadius: '8px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }} 
					onClick={() => nextPage()} 
					disabled={!canNextPage}
					title="Next Page"
				>
					<FontAwesomeIcon icon={faAngleRight} />
				</button>
				<button 
					className={`btn btn-sm ${canNextPage ? 'btn-light' : 'btn-white text-muted'} border-0`} 
					style={{ borderRadius: '8px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }} 
					onClick={() => gotoPage(pageCount - 1)} 
					disabled={!canNextPage}
					title="Last Page"
				>
					<FontAwesomeIcon icon={faAngleDoubleRight} />
				</button>
			</div>
	      </div>
	    </>
	)
}