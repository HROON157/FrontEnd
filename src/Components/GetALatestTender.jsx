import React, { useState, useEffect } from 'react';
import FAQS from '../Pages/FAQS';
import axios from 'axios';
import { Helmet } from 'react-helmet';
const GetALatestTender = () => {
  const [formData, setFormData] = useState({
    userName: '',
    phoneNumber: '',
    email: '',
    company: '',
    category: ''
  });

  const [statusMessage, setStatusMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/categories');
        if (response.status === 200) {
          setCategories(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const validateForm = () => {
    const newErrors = {};
    if (!formData.userName) newErrors.userName = 'Name is required';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone Number is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.company) newErrors.company = 'Company Name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        const response = await axios.post('http://localhost:5000/subscriptions', formData);
        if (response.status === 200) {
          setStatusMessage('Form submitted successfully!');
          setFormData({ userName: '', phoneNumber: '', email: '', company: '', category: '' });
          setErrors({});
        }
      } catch (error) {
        setStatusMessage('Error submitting form. Please try again.');
      }
    }
  };

  return (
    <div className="container mt-5 py-5">
    <Helmet>
    <title>Contact US | Bismillah Tender</title>
    <meta name="description" content="Get in touch with Bismillah Tender. Use our contact form, email, or phone to reach out with questions or requests about tender opportunities in Pakistan." />
    </Helmet>
      <div>
        <h1 className="customColorForm text-center">Get In Touch</h1>
      </div>
      {statusMessage && <div className="alert alert-success">{statusMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group p-3 mt-5">
          <div className="row">
            <div className="col-md-6 col-lg-6 col-6">
              <input
                type="text"
                className="form-control"
                name="userName"
                placeholder="Name"
                value={formData.userName}
                onChange={handleChange}
              />
              {errors.userName && <small className="text-danger">{errors.userName}</small>}
            </div>
            <div className="col-md-6 col-lg-6 col-6">
              <input
                type="text"
                className="form-control"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
              {errors.phoneNumber && <small className="text-danger">{errors.phoneNumber}</small>}
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-md-6 col-lg-6 col-6">
              <input
                type="email"
                className="form-control"
                name="email"
                placeholder="E-Mail"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <small className="text-danger">{errors.email}</small>}
            </div>
            <div className="col-md-6 col-lg-6 col-6">
              <input
                type="text"
                className="form-control"
                name="company"
                placeholder="Company Name"
                value={formData.company}
                onChange={handleChange}
              />
              {errors.company && <small className="text-danger">{errors.company}</small>}
            </div>
          </div>
        </div>

        <div className="row mt-3 p-3">
          <div className="col-md-6 col-lg-6 col-6">
            <select
              className="form-control"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                  </option>
              ))}
            </select>
            {errors.category && <small className="text-danger">{errors.category}</small>}
          </div>
        </div>
        <div className="p-3 mt-2">
          <button className=" customButton btn rounded pill" type="submit">Submit</button>
        </div>
      </form>
      <div className='d-flex justify-content-center'>
        <FAQS/>
      </div>
    </div>
  );
};

export default GetALatestTender;
