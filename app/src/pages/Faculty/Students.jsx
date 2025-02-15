import React, { useEffect, useState } from 'react';

import { TableRow, TableRowLoading } from '../../components/TableRow';
import {
	TableContainer,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Flex,
	Card,
} from '@chakra-ui/react'
import { useNavigate, useParams } from 'react-router-dom';
import { Sidebar, SidebarButton } from '../../components/Sidebar';
import MainContainer from '../../components/Container';

export const Students = ({apiManager}) => {
	const navigate = useNavigate();
	let { coursesPerSemId } = useParams();
	let { semID }    = useParams();

	const [coursesPerSem, setCoursesPerSem] = useState({});

	const [students, setStudents] = useState(null);

	function loadStudents(coursesPerSem){
		apiManager.request(`/faculty/getStudentIDandNameBySemidCourseid?semID=${semID}&courseID=${coursesPerSem.course.courseID}`)
		.catch(error => { navigate(`/dialog?title=ERROR&message=${error}`); })
		.then(data => {
			console.log(data);
			setStudents(data);
		});
	}

	useEffect(()=>{
		setCoursesPerSem({...coursesPerSem, 'isLoading':true});
		apiManager.request(`/faculty/getCoursesByFacultyBySem?facultyID=${apiManager.getUserInfo().facultyID}&semID=${semID}`)
		.catch(error => { navigate(`/dialog?title=ERROR&message=${error}`); })
		.then(data => {
			const _coursesPerSem = data.filter(coursesPerSem => {return String(coursesPerSem.coursesPerSemId) === coursesPerSemId})[0];
			setCoursesPerSem(_coursesPerSem);
			console.log(_coursesPerSem);

			loadStudents(_coursesPerSem);
		});
	},[]);
	return (
		<Flex bg='gray.50'>
			<Sidebar>
			<SidebarButton variant="outline" onClick={()=>{ navigate('/faculty/'); }}>All Courses</SidebarButton>
				<SidebarButton onClick={()=>{ navigate(`/faculty/${semID}/course/${coursesPerSemId}`); }}>Syllabus</SidebarButton>
				<SidebarButton onClick={()=>{ navigate(`/faculty/${semID}/course/${coursesPerSemId}/announcements`); }}>Announcements</SidebarButton>
				<SidebarButton onClick={()=>{ navigate(`/faculty/${semID}/course/${coursesPerSemId}/assignments`); }}>Assignments</SidebarButton>
				<SidebarButton onClick={()=>{ navigate(`/faculty/${semID}/course/${coursesPerSemId}/quizzes`); }}>Quizzes</SidebarButton>
				<SidebarButton onClick={()=>{ navigate(`/faculty/${semID}/course/${coursesPerSemId}/students`); }} variant='solid'>Students</SidebarButton>
			</Sidebar>
			<MainContainer title="Students" subtitle={coursesPerSem?.course?.courseName ?? "Loading.."}>
			<Card variant='outline'>
				<TableContainer>
					<Table variant='simple'>
						<Thead>
							<Tr>
								<Th>Student ID</Th>
								<Th>Name</Th>
							</Tr>
						</Thead>
						<Tbody>
							{students==null ?
								<TableRowLoading />:
								(students.length===0 ?
									(<Tr><Td colSpan="100%">No Student Found</Td></Tr>):
									(students.map(student => (
										<TableRow key={student[0]}>
											<Td>{student[0]}</Td>
											<Td>{student[1]}</Td>
										</TableRow>
									)))
								)
							}
						</Tbody>
					</Table>
				</TableContainer>
			</Card>
			</MainContainer>
		</Flex>
		
	)
}