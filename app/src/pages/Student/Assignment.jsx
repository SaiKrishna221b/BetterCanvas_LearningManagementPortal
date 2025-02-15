import React, { useEffect, useState } from 'react';

import { TableRow, TableRowLoading } from '../../components/TableRow';
import {
	Flex,
	Card,
	CardHeader,
	CardBody,
	Stack,
	StackDivider,
	Box,
	Heading,
	Text,
	Button,
} from '@chakra-ui/react'
import { useNavigate, useParams } from 'react-router-dom';
import { Sidebar, SidebarButton } from '../../components/Sidebar';
import MainContainer from '../../components/Container';

export const Assignment = ({apiManager}) => {
	const navigate = useNavigate();
	let { courseID }     = useParams();
	let { semID }        = useParams();
	let { assignmentID } = useParams();
	const [course, setCourse] = useState({});

	const [assignment, setAssignment] = useState(null);

	function loadStudentSubmission(assignmant){
		apiManager.request(`/faculty/getSubmissionDetails?studentID=${apiManager.getUserInfo().studentID}&semID=${semID}&courseID=${courseID}`)
		.catch(error => { navigate(`/dialog?title=ERROR&message=${error}`); })
		.then(data => {
			const _assignment = {...assignmant};
			const filteredSubmission = data.filter(submission => { return String(submission.assignment.assignmentID) === String(assignmant.assignmentID) })
			if(filteredSubmission.length !== 0){
				_assignment.submission = filteredSubmission[0] ?? null
			}
			console.log(`loadStudentSubmission`, data, filteredSubmission);
			_assignment.isLoading = false
			setAssignment(_assignment);
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
			console.log(data);
			const _assignment = data.filter(assignment => { return String(assignment.assignmentID) === assignmentID })[0];
			loadStudentSubmission(_assignment);
			setAssignment(_assignment);
		});
	},[]);
	return (
		<Flex bg='gray.50'>
			<Sidebar>
				<SidebarButton onClick={()=>{ navigate(`/student/${semID}/course/${courseID}/assignments`); }} variant='outline'>All Assignments</SidebarButton>
			</Sidebar>
			<MainContainer title={`Assignment - ${assignment?.assignmentName ?? "Loading..."}`} subtitle={course?.courseName ?? "Loading.."}>
			<Card variant='outline'>
				<CardBody>
					<Stack divider={<StackDivider />} spacing='4'>
						<Box>
							<Heading size='xs' textTransform='uppercase'>
								Summary
							</Heading>
							<Text pt='2' fontSize='sm'>
								{assignment?.content ?? "Loading..."}
							</Text>
						</Box>
						<Box>
							<Heading size='xs' textTransform='uppercase'>Due</Heading>
							<Text pt='2' fontSize='sm'>{(new Date(assignment?.dueDate)).toLocaleString()}</Text>
						</Box>
						<Box>
							<Heading size='xs' textTransform='uppercase'>Total Points</Heading>
							<Text pt='2' fontSize='sm'>{assignment?.totalPoints ?? "Loading..."} point{assignment?.totalPoints > 1 ? "s":""}</Text>
						</Box>
						<Box>
							<Button colorScheme='purple' isDisabled={assignment?.submission != null}>{assignment?.submission != null ? "Submitted":"Start"}</Button>
						</Box>
					</Stack>
				</CardBody>
			</Card>
			</MainContainer>
		</Flex>
		
	)
}