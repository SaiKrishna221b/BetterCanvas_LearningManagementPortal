import React from 'react';

import {
	Tr,
	Td,
} from '@chakra-ui/react'
import { Loading } from './Loading';

const TableRow = (props) => {
	if(props.onClick != null) return (<Tr _hover={{ bg:"gray.100", cursor:"pointer" }} {...props}>{props.children}</Tr>)
	return (<Tr {...props}>{props.children}</Tr>)
}

const TableRowLoading = (props) => {
	return (<Tr><Td colSpan="100%"><Loading /></Td></Tr>)
}

export {
	TableRow,
	TableRowLoading,
}
