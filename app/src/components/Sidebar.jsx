import React from 'react';
import EduSphere_logo from '../assets/EduSphere_logo.png';

import {
	Box,
	Stack,
	Image,
	Divider,
	Button,
	Text,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';
import { getUserInfo } from '../utilities/authService';

const SidebarButton = (props) => {
	return (<Button colorScheme='purple' variant={props.variant ?? 'ghost'} w='full' {...props}>{props.children}</Button>)
}

const Sidebar = ({ children }) => {
	const navigate = useNavigate();
	const userInfo = getUserInfo();

	return (
		<Box width={250} minH="100vh" maxH="100vh" bg="white" position='fixed' color='purple.800' >
			<Stack spacing={3} direction='column' align='center' pt={4} px={4} >
				<Image src={EduSphere_logo} height={85} />
				<Divider />
				<Stack
					spacing={0}
					direction='column'
					align='center'
					w='full'
					h='full'
					pt={3}
					overflow='auto'
					>
					<Text fontSize='lg' fontWeight='medium'>{userInfo.name}</Text>
					<Text fontSize='xs' fontWeight='normal' mt={2} textTransform="capitalize">{userInfo.type}</Text>
					{userInfo.type === 'student' ? (<Button colorScheme='purple' variant='ghost' w='full' mt={3} onClick={()=>{navigate('/user/account')}}>Account</Button>):(<></>)}
				</Stack>
				<Divider />
				{ children }
				<Stack
					spacing={3}
					w='100%'
					position='absolute'
					bottom={0}
					px={4}
					py={4}
					bg='white'
					>
					<Divider />
					<Button colorScheme='purple' variant='ghost' w='full' onClick={()=>{navigate('/user/logout')}}>Logout</Button>
				</Stack>
			</Stack>

		</Box>
	)
}

export {
	SidebarButton,
	Sidebar,
}

