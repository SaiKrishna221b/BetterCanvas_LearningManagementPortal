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
	Text,
} from '@chakra-ui/react'
import { useNavigate, useParams } from 'react-router-dom';
import { Sidebar, SidebarButton } from '../../components/Sidebar';
import MainContainer from '../../components/Container';

export const Assignments = ({apiManager}) => {
	const navigate = useNavigate();
	let { courseID } = useParams();
	let { semID }    = useParams();
	const [course, setCourse] = useState({});

	const [assignments, setAssignments] = useState(null);

	function loadStudentSubmission(assignmant, index, assignments){
		apiManager.request(`/faculty/getSubmissionDetails?studentID=${apiManager.getUserInfo().studentID}&semID=${semID}&courseID=${courseID}`)
		.catch(error => { navigate(`/dialog?title=ERROR&message=${error}`); })
		.then(data => {
			const _assignments = [...assignments];
			const filteredSubmission = data.filter(submission => { return String(submission.assignment.assignmentID) === String(assignmant.assignmentID) })
			if(filteredSubmission.length !== 0){
				_assignments[index].submission = filteredSubmission[0] ?? null
			}
			console.log(`loadStudentSubmission ${index}`, data, filteredSubmission);
			_assignments[index].isLoading = false
			setAssignments(_assignments);
		});
	}

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

		apiManager.request(`/student/getAssignmentsByCourseBySem?semID=${semID}&courseID=${courseID}`)
		.catch(error => { navigate(`/dialog?title=ERROR&message=${error}`); })
		.then(data => {
			const _assignments = [...data].map(assignment => {
				return {...assignment, isLoading: true};
			});
			_assignments.forEach((assignment, index)=>{
				loadStudentSubmission(assignment, index, _assignments);
			})
			setAssignments(_assignments);
		});
	},[]);
	return (
		<Flex bg='gray.50'>
			<Sidebar>
				<SidebarButton variant="outline" onClick={()=>{ navigate('/student/'); }}>All Courses</SidebarButton>
				<SidebarButton onClick={()=>{ navigate(`/student/${semID}/course/${courseID}`); }}>Syllabus</SidebarButton>
				<SidebarButton onClick={()=>{ navigate(`/student/${semID}/course/${courseID}/announcements`); }}>Announcements</SidebarButton>
				<SidebarButton onClick={()=>{ navigate(`/student/${semID}/course/${courseID}/assignments`); }} variant='solid'>Assignments</SidebarButton>
				<SidebarButton onClick={()=>{ navigate(`/student/${semID}/course/${courseID}/quizzes`); }}>Quizzes</SidebarButton>
				<SidebarButton onClick={()=>{ navigate(`/student/${semID}/course/${courseID}/grades`); }}>Grades</SidebarButton>
			</Sidebar>
			<MainContainer title="Assignments" subtitle={course?.courseName ?? "Loading.."}>
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
									(assignments.filter(assignment => { return assignment.publishStatus === true }).map(assignment => (
										<TableRow key={assignment.assignmentID} onClick={()=>{ navigate(`/student/${semID}/course/${course.courseID}/assignment/${assignment.assignmentID}`); }}>
											<Td>{assignment.assignmentName}</Td>
											<Td>{(new Date(assignment.dueDate)).toLocaleString()}</Td>
											<Td>{assignment.isLoading ? "Loading...":(assignment.submission == null ? "No Submission":"Submitted")}</Td>
											{/* <Td>{assignment.isLoading ? "Loading...":(assignment.submission == null ? "No Submission":(
													<Text>{assignment.submission.pointScored}/{assignment.submission.assignment?.totalPoints}</Text>
												))}</Td> */}
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
