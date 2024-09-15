
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import BaseUrl from '../api/BaseUrl';

export default function TenderByCity() {
    const Base_Url = BaseUrl();
    const [Cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCities = async () => {
        try {
            const response = await axios.get(`${Base_Url}/cities`);
            const data = response.data.data;
            const sortedData = data.sort((a,b)=>b.id - a.id)
            setCities(sortedData);
            setCities(data.slice(0, 6)); // Limiting to 6 Cities
            setLoading(false);
        } catch (error) {
            console.error('Error fetching Cities:', error);
            setLoading(false); 
        }
    }

    useEffect(() => {
        fetchCities();
    }, []);

    return (
        <div>
            <h2 className='text-center fw-bolder'>
                Tender By Cities
            </h2>
            <div className='container-fluid pt-5 pb-5'>
                <div className="row d-flex justify-content-center align-items-center gap-3 tenderByRows">
                    {loading ? (
                        Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} className="col-md-3 col-12">
                                <p className="text-center shadow-lg rounded-sm p-3 placeholder-glow">
                                    <span className="placeholder col-12"></span>
                                </p>
                            </div>
                        ))
                    ) : (
                        Cities.map((city, index) => (
                            <div key={index} className="col-md-3 col-12">
                                <Link to={`/detail_cities/${(city.name)}`} className='text-decoration-none text-dark'>
                                    <p className="text-center shadow-lg rounded-sm p-3">
                                        {city.name.slice(0, 27)}
                                    </p>
                                </Link>
                            </div>
                        ))
                    )}
                    <div className="text-center">
                        <Link to="/cities" className="btn customButton rounded-pill text-decoration-none">
                            View Cities
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
