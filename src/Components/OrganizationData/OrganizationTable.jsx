import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import BaseUrl from '../../api/BaseUrl';

const OrganizationTable = () => {
    const Base_Url = BaseUrl();
    const [organization, setOrganization] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const organizationPerPage = 25;

    const fetchOrganizations = async () => {
        try {
            const response = await axios.get(`${Base_Url}/organizations`, {
                params: { page: currentPage, limit: organizationPerPage },
            });
            const data = response.data.data || [];
            const sortedOrganizations = data.sort((a, b) => b.id - a.id);
            setOrganization(sortedOrganizations);
            const total = response.data.totalRecords || 0; 
            setOrganization(sortedOrganizations);   
            setOrganization(data);
            setTotalRecords(total); 
            setLoading(false);
        } catch (error) {
            console.error('Error fetching organizations:', error.response || error.message || error);
            setError('Failed to fetch organizations. Please try again later.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrganizations();
    }, [currentPage]); 

    const indexOfLastOrg = currentPage * organizationPerPage;
    const indexOfFirstOrg = indexOfLastOrg - organizationPerPage;

    const filteredOrganization = organization.filter(org => 
        org.name && org.name.toLowerCase().includes(search.toLowerCase())
    );

    const currentOrganization = filteredOrganization.slice(indexOfFirstOrg, indexOfLastOrg);
    const totalPages = Math.ceil(totalRecords / organizationPerPage); 

    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const handleSearchQuery = (event) => {
        setSearch(event.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="container my-5">
            <h2 className="text-center fw-bold mb-4">Tender By Organizations</h2>
            <div className='d-flex justify-content-center'>
                <input 
                    type="text" 
                    placeholder='Search organizations for tenders' 
                    value={search} 
                    onChange={handleSearchQuery}
                    className='mb-3 p-2 w-50 rounded-lg shadow-sm form-control'
                />
            </div>

            {loading ? (
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : error ? (
                <div className="alert alert-danger text-center" role="alert">
                    {error}
                </div>
            ) : (
                <>
                    <div className='p-3 container shadow-lg d-flex justify-content-center flex-column table-data'>
                        <table className="table table-responsive">
                            <thead>
                                <tr>
                                    <th style={{ width: '90%' }}>Title</th>
                                    <th style={{ width: '10%' }}>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentOrganization.map((org) => (
                                    <tr key={org.id}>
                                        <td style={{ width: '70%' }}>{org.name}</td>
                                        <td style={{ width: '30%' }}>
                                            <Link
                                                to={`/OrganizationDetails/${org.name}`}
                                                rel="noopener noreferrer"
                                                className='text-decoration-none'
                                            >
                                                <button className='details-btn'>
                                                    Detail
                                                </button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <nav>
                            <ul className="pagination justify-content-center">
                                <li className={`page-item ${currentPage === 1 && 'disabled'} mx-5`}>
                                    <button
                                        className="details-btn mx-1"
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </button>
                                </li>
                                <li className="page-item">
                                    <span className="mx-1 fw-bold">
                                        Page {currentPage} of {totalPages} || Total Organizations = {totalRecords}
                                    </span>
                                </li>
                                <li className={`page-item ${currentPage === totalPages && 'disabled'} mx-5`}>
                                    <button
                                        className="details-btn mx-1"
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </>
            )}
        </div>
    );
};

export default OrganizationTable;
