import React, { useState } from 'react';
import { login, setUserInfo } from '../../utilities/authService';
import { useNavigate } from 'react-router-dom';
import EduSphere_logo from '../../assets/EduSphere_logo.png';

import {
	Button,
    Card,
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
    Image,
} from '@chakra-ui/react'

const Login = ({apiManager}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        setError('');
        setLoading(true);
        try {
            // Simulate API call for authentication
            const response = await fetch('http://localhost:8001/api/v1/login', {
                method: 'POST',
               // credentials: 'include', // Include cookies
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({ userID: username, password: password })
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);

                const authToken = data.token; // Assuming the API returns a token
                login(authToken); // Store token in localStorage

                if(username.startsWith("1")){
                    await apiManager.request(`/student/getStudent?studentID=${username}`)
                        .then(data => {
                            setUserInfo(data);
                        })
                }else if(username.startsWith("2")){
                    await apiManager.request(`/faculty/getFaculty?facultyID=${username}`)
                        .then(data => {
                            setUserInfo(data);
                        })
                }else if(username.startsWith("3")){
                    await apiManager.request(`/admin/getAdmin?adminID=${username}`)
                        .then(data => {
                            setUserInfo(data);
                        })
                }

                navigate('/');
            } else {
                // Handle authentication error
                console.error('Login failed');
                setError('Invalid credentials. Please try again.'); // Example error message
                setLoading(false);
            }
        } catch (error) {
            console.error('Login failed', error);
            setError('Invalid credentials. Please try again.'); // Example error message
            setLoading(false);
        }
    };

    return (
        <Container>
            <Center h='100vh'>
                <Stack direction='column' align='center' spacing={3}>
                    <Card>
                        <CardBody>
                            <Stack divider={<StackDivider />} spacing='4'>
                                <Box>
                                    <Center>
                                        <Image src={EduSphere_logo} height={100} />
                                    </Center>
                                    <FormControl isInvalid={error} mt={8}>
                                        <Stack spacing='2'>
                                            <Input size='lg' focusBorderColor='purple.500' placeholder='User ID'  type='text' onChange={(e) => setUsername(e.target.value)} />
                                            <Input size='lg' focusBorderColor='purple.500' placeholder='Password' type='password' onChange={(e) => setPassword(e.target.value)} />
                                            <FormErrorMessage>{error}</FormErrorMessage>
                                            <Button colorScheme='purple' size='lg' onClick={handleLogin} disabled={loading}>{loading ? 'Logging in...' : 'Login'}</Button>
                                        </Stack>
                                    </FormControl>
                                </Box>
                            </Stack>
                        </CardBody>
                    </Card>
                    <Text color="gray.300" fontSize="sm">Copyright © 2024 RubixCube</Text>
                </Stack>
            </Center>
        </Container>
    );
};

export default Login;