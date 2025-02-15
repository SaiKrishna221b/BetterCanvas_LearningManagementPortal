import React from 'react';
import EduSphere_logo from '../../assets/EduSphere_logo.png';

import {
	Button,
		Card,
		CardHeader,
		Heading,
		CardBody,
		Stack,
		StackDivider,
		Box,
		Text,
		Container,
		Center,
		FormControl,
		FormLabel,
		Input,
		FormHelperText,
		FormErrorMessage,
		Image,
		Link,
} from '@chakra-ui/react'

export const DialogPage = ({title, message}) => {
	const queryParameters = new URLSearchParams(window.location.search)
	if(queryParameters.has("title"))   title = queryParameters.get("title");
	if(queryParameters.has("message")) message = queryParameters.get("message");
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
								</Box>
								<Box>
									<Heading size='xs' textTransform='uppercase'>{title}</Heading>
									<Text pt='2' fontSize='sm'>{message}</Text>
								</Box>
								<Box>
									<Link color='purple.600' href='/'>← go back to homepage</Link>
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