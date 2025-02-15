import React, { useEffect, useState } from 'react';

import { Text, Link } from '@chakra-ui/react';

import { getUserInfo } from '../../utilities/authService';
import { useNavigate } from 'react-router-dom';

const Home = ({apiManager}) => {
	const navigate = useNavigate();
	const [redirectingURL, setRedirectingURL] = useState('');
	
	useEffect(() => {
		document.title = 'Home';
		let url = '';
		if(getUserInfo().type === 'student'){
			url = '/student';
			setRedirectingURL(url);
		}
		else if(getUserInfo().type === 'faculty'){
			url = '/faculty';
			setRedirectingURL(url);
		}
		else if(getUserInfo().type === 'admin'){
			url = '/admin';
			setRedirectingURL(url);
		}
		else{
			url = '/dialog?title=ERROR&message=Invalid user information';
		}
		navigate(url);
	}, []);

	return (
		<>
			<Text>
				Redirecting you to the {getUserInfo().type} homepage ... {' '}
				<Link color='purple.600' href={redirectingURL}>
					(go to {window.location.href}{redirectingURL})
				</Link>
			</Text>
		</>
	)
}

export default Home;