import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utilities/authService';

const PrivateRoute = ({ element }) => {
    if(isAuthenticated()) return (<>{element}</>);
    return (<Navigate to="/user/login" replace />);
};

export default PrivateRoute;
