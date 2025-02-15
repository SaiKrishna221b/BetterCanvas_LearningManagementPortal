import React from 'react';

import {
	Box,
	CircularProgress,
} from '@chakra-ui/react'

export const Loading = (props) => {
	return (<Box {...props} ><CircularProgress isIndeterminate color='purple.500' size='30px' mr={3} />{props.text ?? "Loading..."}</Box>)
}