import React, { useEffect, useState } from 'react';
import { login, logout, setUserInfo } from '../../utilities/authService';
import { useNavigate } from 'react-router-dom';
import EduSphere_logo from '../../assets/EduSphere_logo.png';

import {
	Button,
	Card,
	CardHeader,
	CardBody,
	Stack,
	StackDivider,
	Box,
	Text,
	Container,
	Center,
	FormControl,
	Input,
	FormErrorMessage,
	Flex,
	Heading,
	HStack,
} from '@chakra-ui/react'

const Account = ({apiManager}) => {
	const navigate = useNavigate();

	const [isSaving, setIsSaving] = useState(false);

	const [name, setName] = useState(apiManager.getUserInfo().name);
	const [contact, setContact] = useState(apiManager.getUserInfo().contact);
	const [email, setEmail] = useState(apiManager.getUserInfo().emailID);

	function saveUserInfo(){
		setIsSaving(true);
		const content = {
			"studentID": apiManager.getUserInfo().studentID,
			"name": name,
			"emailID": email,
			"contact": contact
		}
		apiManager.request(`/student/setStudentProfileInfo`, 'POST', content)
		.catch(error => { navigate(`/dialog?title=ERROR&message=${error}`); })
		.then(data => {
			setUserInfo(data);
			setIsSaving(false);
		});
	}

	useEffect(()=>{
		if(apiManager.getUserInfo().type !== "student"){
			navigate("/");
		}
	}, []);

	return (
		<Container>
			<Center h='100vh'>
				<Stack direction='column' align='center' spacing={3}>
					<Card>
						<CardHeader>
							<Heading size='md'>Account Information</Heading>
						</CardHeader>
						<CardBody>
							<Stack divider={<StackDivider />} spacing='4'>
								<Box>
									<Heading size='xs' textTransform='uppercase'>Name</Heading>
									<Input mt='2' value={name} onChange={(e)=>{ setName(e.target.value); }} isDisabled={true} />
								</Box>
								<Box>
									<Heading size='xs' textTransform='uppercase'>Email</Heading>
									<Input mt='2' value={email} onChange={(e)=>{ setEmail(e.target.value); }} />
								</Box>
								<Box>
									<Heading size='xs' textTransform='uppercase'>Contact</Heading>
									<Input mt='2' value={contact} onChange={(e)=>{ setContact(e.target.value); }} />
								</Box>
								<HStack spacing={2}>
									<Button flex={1} onClick={()=>{ navigate("/"); }}>Back</Button>
									<Button flex={1} colorScheme='purple' onClick={()=>{ saveUserInfo(); }} isDisabled={isSaving}>{isSaving ? "Saving...":"Save"}</Button>
								</HStack>
							</Stack>
						</CardBody>
					</Card>
					<Text color="gray.300" fontSize="sm">Copyright © 2024 RubixCube</Text>
				</Stack>
			</Center>
		</Container>
	);
};

export default Account;