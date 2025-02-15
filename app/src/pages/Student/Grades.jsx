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

export const Grades = ({apiManager}) => {
	const navigate = useNavigate();
	let { courseID } = useParams();
	let { semID }    = useParams();
	const [course, setCourse] = useState({});

	const [submissions, setSubmissions] = useState(null);

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

		apiManager.request(`/student/getSubmissionByCourseBySem?studentID=${apiManager.getUserInfo().studentID}&semID=${semID}&courseID=${courseID}`)
		.catch(error => { navigate(`/dialog?title=ERROR&message=${error}`); })
		.then(data => {
			console.log(data);
			setSubmissions(data);
		});

	},[]);
	return (
		<Flex bg='gray.50'>
			<Sidebar>
				<SidebarButton variant="outline" onClick={()=>{ navigate('/student/'); }}>All Courses</SidebarButton>
				<SidebarButton onClick={()=>{ navigate(`/student/${semID}/course/${courseID}`); }}>Syllabus</SidebarButton>
				<SidebarButton onClick={()=>{ navigate(`/student/${semID}/course/${courseID}/announcements`); }}>Announcements</SidebarButton>
				<SidebarButton onClick={()=>{ navigate(`/student/${semID}/course/${courseID}/assignments`); }}>Assignments</SidebarButton>
				<SidebarButton onClick={()=>{ navigate(`/student/${semID}/course/${courseID}/quizzes`); }}>Quizzes</SidebarButton>
				<SidebarButton onClick={()=>{ navigate(`/student/${semID}/course/${courseID}/grades`); }} variant='solid'>Grades</SidebarButton>
			</Sidebar>
			<MainContainer title="Grades" subtitle={course?.courseName ?? "Loading.."}>
			<Card variant='outline'>
				<TableContainer>
					<Table variant='simple'>
						<Thead>
							<Tr>
								<Th>Name</Th>
								<Th>Due</Th>
								<Th>Grade</Th>
							</Tr>
						</Thead>
						<Tbody>
						{submissions==null ?
								<TableRowLoading />:
								(submissions.length===0 ?
									(<Tr><Td colSpan="100%">No Grade Found</Td></Tr>):
									(submissions.map(submission => (
										<TableRow key={submission.assignment.assignmentID}>
											<Td>{submission.assignment.assignmentName}</Td>
											<Td>{(new Date(submission.assignment.dueDate)).toLocaleString()}</Td>
											<Td>{submission.pointScored}/{submission.assignment.totalPoints} ({(submission.pointScored/submission.assignment.totalPoints*100).toFixed(2)}%)</Td>
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