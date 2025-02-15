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

	const [semesters, setSemesters] = useState({});
	const [selectingSemester, setSelectingSemester] = useState(null);

	function selectSemester(semesterID, _semesters=semesters){
		setSelectingSemester(semesterID);
		if(_semesters[semesterID].courses.length === 0){
			apiManager.request(`/faculty/getCoursesByFacultyBySem?facultyID=${apiManager.getUserInfo().facultyID}&semID=${semesterID}`)
			.catch(error => { navigate(`/dialog?title=ERROR&message=${error}`); })
			.then(data => {
				_semesters[semesterID].courses = data ?? [];
				setSemesters(_semesters)
			});
		}
	}

	useEffect(() => {
		document.title = 'Home';

		apiManager.request(`/faculty/getSemIDsByFacultyID?facultyID=${apiManager.getUserInfo().facultyID}`)
			.catch(error => { navigate(`/dialog?title=ERROR&message=${error}`); })
			.then(data => {
				let _semesters = {...semesters};
				data.forEach(semesterID => {
					_semesters[semesterID] = {courses:[]}
				});
				setSemesters(_semesters);

				// setSelectingSemester(Object.keys(_semesters)[0]);
				selectSemester(Object.keys(_semesters)[0], _semesters);
			});

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
								<Th>Status</Th>
							</Tr>
						</Thead>
						<Tbody>
							{selectingSemester == null ? <Tr><Td colSpan='100%'>No semester selected</Td></Tr>:<></>}
							{semesters[selectingSemester]?.courses.length === 0 ?
									(<TableRowLoading />):
									(semesters[selectingSemester]?.courses.map(course => (
										<TableRow key={course.coursesPerSemId} onClick={()=>{ navigate(`/faculty/${selectingSemester}/course/${course.coursesPerSemId}`); }}>
											<Td>{course.course.courseID}</Td>
											<Td>{course.course.courseName}</Td>
											<Td>{course.publishStatus ? "Published":"Unpublished"}</Td>
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