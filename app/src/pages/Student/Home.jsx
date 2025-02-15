import React, { useEffect, useState } from 'react';

import { Sidebar, SidebarButton } from '../../components/Sidebar';
import MainContainer from '../../components/Container';
import { TableRow, TableRowLoading } from '../../components/TableRow';
import {
	Flex,
	Card,
	TableContainer,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
} from '@chakra-ui/react'

import { useNavigate } from 'react-router-dom';

const Home = ({apiManager}) => {
	const navigate = useNavigate();

	const [semesters, setSemesters] = useState({
		'Fall 2023':   {courses:[]},
		'Spring 2024': {courses:[]}
	});
	const [selectingSemester, setSelectingSemester] = useState(Object.keys(semesters)[0]);

	function selectSemester(semesterID){
		setSelectingSemester(semesterID);
		if(semesters[semesterID].courses.length === 0){
			apiManager.request(`/student/getCoursesByStudentBySem?studentID=${apiManager.getUserInfo().studentID}&semID=${semesterID}`)
			.catch(error => { navigate(`/dialog?title=ERROR&message=${error}`); })
			.then(data => {
				let _semesters = {...semesters};
				_semesters[semesterID].courses = data ?? [];
				setSemesters(_semesters)
			});
		}
	}

	useEffect(() => {
		document.title = 'Home';
		selectSemester(Object.keys(semesters)[0]);
	}, []);

	return (
		<Flex bg='gray.50'>
			<Sidebar>
				{Object.keys(semesters).map(semesterId => <SidebarButton key={semesterId} variant={semesterId===selectingSemester ? "solid":"ghost"} onClick={()=>{selectSemester(semesterId)}}>{semesterId}</SidebarButton>)}
			</Sidebar>
			<MainContainer title="Courses" subtitle={selectingSemester}>
			<Card variant='outline'>
				<TableContainer>
					<Table variant='simple'>
						<Thead>
							<Tr>
								<Th>ID</Th>
								<Th>Name</Th>
							</Tr>
						</Thead>
						<Tbody>
						{semesters[selectingSemester].courses.length === 0 ?
								(<TableRowLoading />):
								(semesters[selectingSemester].courses.map(course => (
									<TableRow key={course.courseID} onClick={()=>{ navigate(`/student/${selectingSemester}/course/${course.courseID}`); }}>
										<Td>{course.courseID}</Td>
										<Td>{course.courseName}</Td>
									</TableRow>
								)))
							}
						</Tbody>
					</Table>
				</TableContainer>
			</Card>
			</MainContainer>
		</Flex>
	)
}

export default Home;