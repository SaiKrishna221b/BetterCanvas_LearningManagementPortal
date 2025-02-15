import React from 'react';

import {
	Container,
	Text,
	Flex,
	Box
} from '@chakra-ui/react'

const MainContainer = ({ title, subtitle, children }) => {
		return (
			// <Container ml='250px' maxW='container.sm' pt={4}>
			<Box ml='250px' w='full'>
				<Container maxW='container.md' minH='100vh' pt={4}>
					<Flex h={85} alignItems='center' direction='column' >
						<Text fontSize='lg' fontWeight='medium' color='purple.800' whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis' w='full'>{subtitle}</Text>
						<Text fontSize='4xl' fontWeight='bold' color='purple.800' whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis' w='full' textTransform='capitalize'>{title}</Text>
					</Flex>
					<Box
						pt={2}
						>
						{children}
					</Box>
				</Container>
			</Box>
			
		)
}

export default MainContainer;