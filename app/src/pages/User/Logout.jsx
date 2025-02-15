import React, { useEffect } from 'react';

import { logout } from '../../utilities/authService';
import { useNavigate } from "react-router-dom";

import { DialogPage } from '../Base/DialogPage';

const App = () => {
	const navigate = useNavigate();
	useEffect(() => {
		document.title = 'Logout';
		logout();
		navigate("/");
	}, []);
	return (<DialogPage title="Logout" message="Logging you out..." />);
};

export default App;
