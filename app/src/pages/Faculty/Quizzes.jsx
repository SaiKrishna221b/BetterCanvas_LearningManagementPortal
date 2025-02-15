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
	CardBody,
	Button,
} from '@chakra-ui/react'
import { useNavigate, useParams } from 'react-router-dom';
import { Sidebar, SidebarButton } from '../../components/Sidebar';
import MainContainer from '../../components/Container';

export const Quizzes = ({apiManager}) => {
	const navigate = useNavigate();
	let { coursesPerSemId } = useParams();
	let { semID }    = useParams();

	const [coursesPerSem, setCoursesPerSem] = useState({});

	const [quizzes, setQuizzes] = useState(null);

	function loadQuizzes(coursesPerSem){
		apiManager.request(`/faculty/getQuizDetailsBySemidCourseid?semID=${semID}&courseID=${coursesPerSem?.course?.courseID}`)
		.catch(error => { navigate(`/dialog?title=ERROR&message=${error}`); })
		.then(data => {
			console.log(data);
			setQuizzes(data);
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

			loadQuizzes(_coursesPerSem);
		});
	},[]);

	return (
		<Flex bg='gray.50'>
			<Sidebar>
				<SidebarButton variant="outline" onClick={()=>{ navigate('/faculty/'); }}>All Courses</SidebarButton>
				<SidebarButton onClick={()=>{ navigate(`/faculty/${semID}/course/${coursesPerSemId}`); }}>Syllabus</SidebarButton>
				<SidebarButton onClick={()=>{ navigate(`/faculty/${semID}/course/${coursesPerSemId}/announcements`); }}>Announcements</SidebarButton>
				<SidebarButton onClick={()=>{ navigate(`/faculty/${semID}/course/${coursesPerSemId}/assignments`); }}>Assignments</SidebarButton>
				<SidebarButton onClick={()=>{ navigate(`/faculty/${semID}/course/${coursesPerSemId}/quizzes`); }} variant='solid'>Quizzes</SidebarButton>
				<SidebarButton onClick={()=>{ navigate(`/faculty/${semID}/course/${coursesPerSemId}/students`); }}>Students</SidebarButton>
			</Sidebar>
			<MainContainer title="Quizzes" subtitle={coursesPerSem?.course?.courseName ?? "Loading.."}>
			<Card variant='outline' mb={2}>
				<CardBody>
					<Button onClick={()=>{ navigate(`/faculty/${semID}/course/${coursesPerSemId}/quiz/new`); }}>Add a new quiz</Button>
				</CardBody>
			</Card>
			<Card variant='outline'>
				<TableContainer>
					<Table variant='simple'>
						<Thead>
							<Tr>
								<Th>Name</Th>
								<Th>Due</Th>
								<Th>Status</Th>
							</Tr>
						</Thead>
						<Tbody>
						{quizzes==null ?
								<TableRowLoading />:
								(quizzes.length===0 ?
									(<Tr><Td colSpan="100%">No Assignment Found</Td></Tr>):
									(quizzes.map(quiz => (
										<TableRow key={quiz.quizID} onClick={()=>{ navigate(`/faculty/${semID}/course/${coursesPerSemId}/quiz/${quiz.quizID}`); }}>
											<Td>{quiz.quizName}</Td>
											<Td>{(new Date(quiz.dueDate)).toLocaleString()}</Td>
											<Td>{quiz.publishStatus ? "Published":"Unpublished"}</Td>
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