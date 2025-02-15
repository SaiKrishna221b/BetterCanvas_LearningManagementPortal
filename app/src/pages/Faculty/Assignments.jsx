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

export const Assignments = ({apiManager}) => {
	const navigate = useNavigate();
	let { coursesPerSemId } = useParams();
	let { semID }    = useParams();

	const [coursesPerSem, setCoursesPerSem] = useState({});

	const [assignments, setAssignments] = useState(null);

	function loadAssignments(coursesPerSem){
		apiManager.request(`/faculty/getAssignmentDetailsBySemidCourseid?semID=${semID}&courseID=${coursesPerSem.course.courseID}`)
		.catch(error => { navigate(`/dialog?title=ERROR&message=${error}`); })
		.then(data => {
			console.log(data);
			setAssignments(data);
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

			loadAssignments(_coursesPerSem);
		});
	},[]);
	return (
		<Flex bg='gray.50'>
			<Sidebar>
			<SidebarButton variant="outline" onClick={()=>{ navigate('/faculty/'); }}>All Courses</SidebarButton>
				<SidebarButton onClick={()=>{ navigate(`/faculty/${semID}/course/${coursesPerSemId}`); }}>Syllabus</SidebarButton>
				<SidebarButton onClick={()=>{ navigate(`/faculty/${semID}/course/${coursesPerSemId}/announcements`); }}>Announcements</SidebarButton>
				<SidebarButton onClick={()=>{ navigate(`/faculty/${semID}/course/${coursesPerSemId}/assignments`); }} variant='solid'>Assignments</SidebarButton>
				<SidebarButton onClick={()=>{ navigate(`/faculty/${semID}/course/${coursesPerSemId}/quizzes`); }}>Quizzes</SidebarButton>
				<SidebarButton onClick={()=>{ navigate(`/faculty/${semID}/course/${coursesPerSemId}/students`); }}>Students</SidebarButton>
			</Sidebar>
			<MainContainer title="Assignments" subtitle={coursesPerSem?.course?.courseName ?? "Loading.."}>
			<Card variant='outline' mb={2}>
				<CardBody>
					<Button onClick={()=>{ navigate(`/faculty/${semID}/course/${coursesPerSemId}/assignment/new`); }}>Add a new assignment</Button>
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
						{assignments==null ?
								<TableRowLoading />:
								(assignments.length===0 ?
									(<Tr><Td colSpan="100%">No Assignment Found</Td></Tr>):
									(assignments.map(assignment => (
										<TableRow key={assignment.assignmentID} onClick={()=>{ navigate(`/faculty/${semID}/course/${coursesPerSemId}/assignment/${assignment.assignmentID}`); }}>
											<Td>{assignment.assignmentName}</Td>
											<Td>{(new Date(assignment.dueDate)).toLocaleString()}</Td>
											<Td>{assignment.publishStatus ? "Published":"Unpublished"}</Td>
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
