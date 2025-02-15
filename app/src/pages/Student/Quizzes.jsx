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

export const Quizzes = ({apiManager}) => {
	const navigate = useNavigate();
	let { courseID } = useParams();
	let { semID }    = useParams();
	const [course, setCourse] = useState({});

	const [quizzes, setQuizzes] = useState(null);

	useEffect(()=>{
		setCourse({...course, 'isLoading':true});
		apiManager.request(`/course/getCourse?courseID=${courseID}`)
		.catch(error => { navigate(`/dialog?title=ERROR&message=${error}`); })
		.then(data => {
			const _course = {...course};
			_course.courseName = data.courseName;
			_course.courseID   = data.courseID;
			_course.semID      = semID;
			setCourse(_course);
			apiManager.selectingCourseName = _course.courseName;
		});

		apiManager.request(`/student/getQuizzesByCourseBySem?semID=${semID}&courseID=${courseID}`)
		.catch(error => { navigate(`/dialog?title=ERROR&message=${error}`); })
		.then(data => {
			setQuizzes(data.filter(quiz => { return quiz.publishStatus === true }));
		});
	},[]);
	return (
		<Flex bg='gray.50'>
			<Sidebar>
				<SidebarButton variant="outline" onClick={()=>{ navigate('/student/'); }}>All Courses</SidebarButton>
				<SidebarButton onClick={()=>{ navigate(`/student/${semID}/course/${courseID}`); }}>Syllabus</SidebarButton>
				<SidebarButton onClick={()=>{ navigate(`/student/${semID}/course/${courseID}/announcements`); }}>Announcements</SidebarButton>
				<SidebarButton onClick={()=>{ navigate(`/student/${semID}/course/${courseID}/assignments`); }}>Assignments</SidebarButton>
				<SidebarButton onClick={()=>{ navigate(`/student/${semID}/course/${courseID}/quizzes`); }} variant='solid'>Quizzes</SidebarButton>
				<SidebarButton onClick={()=>{ navigate(`/student/${semID}/course/${courseID}/grades`); }}>Grades</SidebarButton>
			</Sidebar>
			<MainContainer title="Quizzes" subtitle={course?.courseName ?? "Loading.."}>
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
									(<Tr><Td colSpan="100%">No Quiz Found</Td></Tr>):
									(quizzes.map(quiz => (
										<TableRow key={quiz.quizID} onClick={()=>{ navigate(`/student/${semID}/course/${course.courseID}/quiz/${quiz.quizID}`); }}>
											<Td>{quiz.quizName}</Td>
											<Td>{(new Date(quiz.dueDate)).toLocaleString()}</Td>
											<Td>{quiz.content.length === 0 ? "No Submission":"Submitted"}</Td>
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