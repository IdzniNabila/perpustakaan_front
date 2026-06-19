import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutAPI } from '../../actions/auth';
import jwt from 'jwt-decode';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartPie, faBook, faSync, faUsers, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const token = useSelector(state => state.auth.token);
    const dispatch = useDispatch();
    const history = useHistory();

    let jwtDecode;
    if (isAuthenticated && token) {
        try {
            jwtDecode = jwt(token);
        } catch (e) {
            // ignore invalid token
        }
    }

    const handleLogout = () => {
        dispatch(logoutAPI())
            .then(() => {
                history.push('/');
            });
    };

    return (
        <div className="sidebar shadow-sm">
            <div className="sidebar-brand">
                <span className="mr-2" role="img" aria-label="books">📚</span>
                <span>Athenaeum</span>
            </div>
            <ul className="sidebar-menu">
                <li className="sidebar-item">
                    <NavLink to="/dashboard" className="sidebar-link" activeClassName="active">
                        <FontAwesomeIcon icon={faChartPie} className="mr-3" />
                        Dashboard
                    </NavLink>
                </li>
                <li className="sidebar-item">
                    <NavLink to="/book" className="sidebar-link" activeClassName="active">
                        <FontAwesomeIcon icon={faBook} className="mr-3" />
                        Catalog (Buku)
                    </NavLink>
                </li>
                {isAuthenticated && jwtDecode && jwtDecode.role === 'admin' && (
                    <>
                        <li className="sidebar-item">
                            <NavLink to="/peminjaman" className="sidebar-link" activeClassName="active">
                                <FontAwesomeIcon icon={faSync} className="mr-3" />
                                Circulation
                            </NavLink>
                        </li>
                        <li className="sidebar-item">
                            <NavLink to="/user" className="sidebar-link" activeClassName="active">
                                <FontAwesomeIcon icon={faUsers} className="mr-3" />
                                Activity (User)
                            </NavLink>
                        </li>
                    </>
                )}
            </ul>
            <div className="sidebar-footer border-top pt-3">
                <div className="d-flex align-items-center justify-content-between">
                     <div>
                        <div className="font-weight-bold text-truncate" style={{ fontSize: '14px', maxWidth: '140px' }}>
                            {isAuthenticated && jwtDecode ? jwtDecode.name : 'Guest'}
                        </div>
                        <div className="text-muted" style={{ fontSize: '12px' }}>
                            {isAuthenticated && jwtDecode && jwtDecode.role === 'admin' ? 'Librarian' : 'Visitor'}
                        </div>
                    </div>
                    <button onClick={handleLogout} className="btn btn-sm btn-outline-danger" title="Logout">
                        <FontAwesomeIcon icon={faSignOutAlt} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
