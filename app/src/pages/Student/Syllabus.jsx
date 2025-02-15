import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
	CardBody,
	Text,
	Flex,
	Card,
	Stack,
	StackDivider,
	Box,
} from '@chakra-ui/react'

import { Loading } from '../../components/Loading';
import { Sidebar, SidebarButton } from '../../components/Sidebar';
import MainContainer from '../../components/Container';

export const Syllabus = ({apiManager}) => {
	const navigate = useNavigate();
	let { courseID } = useParams();
	let { semID }    = useParams();

	const [course, setCourse] = useState({});

	const [syllabusContent, setSyllabusContent] = useState(null);
	function loadSyllabus(course){
		apiManager.request(`/faculty/getSyllabusContentBySemidAndCourseID?semID=${semID}&courseID=${course.courseID}`)
		// .catch(error => { navigate(`/dialog?title=ERROR&message=${error}`); })
		.catch(error => console.warn(error))
		.then(data => {
			console.log(data);
			setSyllabusContent(data.content ?? "No Syllabus");
		});
	}

	useEffect(()=>{
		setCourse({...course, 'isLoading':true});
		apiManager.request(`/course/getCourse?courseID=${courseID}`)
		.catch(error => { navigate(`/dialog?title=ERROR&message=${error}`); })
		.then(data => {
			console.log(data);
			const _course = {...course};
			_course.courseName = data.courseName;
			_course.courseID   = data.courseID;
			_course.semID      = semID;
			setCourse(_course);
			apiManager.selectingCourseName = _course.courseName;

			loadSyllabus(_course);
		});

		apiManager.request(`/student/getCoursesByStudentBySem?studentID=${apiManager.getUserInfo().studentID}&semID=${semID}`)
			.catch(error => { navigate(`/dialog?title=ERROR&message=${error}`); })
			.then(data => {
				console.log(data);
			});
	},[]);
	return (
		<Flex bg='gray.50'>
			<Sidebar>
				<SidebarButton variant="outline" onClick={()=>{ navigate('/student/'); }}>All Courses</SidebarButton>
				<SidebarButton onClick={()=>{ navigate(`/student/${semID}/course/${courseID}`); }} variant='solid'>Syllabus</SidebarButton>
				<SidebarButton onClick={()=>{ navigate(`/student/${semID}/course/${courseID}/announcements`); }}>Announcements</SidebarButton>
				<SidebarButton onClick={()=>{ navigate(`/student/${semID}/course/${courseID}/assignments`); }}>Assignments</SidebarButton>
				<SidebarButton onClick={()=>{ navigate(`/student/${semID}/course/${courseID}/quizzes`); }}>Quizzes</SidebarButton>
				<SidebarButton onClick={()=>{ navigate(`/student/${semID}/course/${courseID}/grades`); }}>Grades</SidebarButton>
			</Sidebar>
			<MainContainer title="Syllabus" subtitle={course?.courseName ?? "Loading..."}>
			<Card variant='outline'>
				<CardBody>
					{course.isLoading?(<Loading />) : 
					(<Stack divider={<StackDivider />} spacing='4'>
						<Text>Welcome to course {course?.courseName} (ID: {course?.courseID})</Text>
						<Box>
							{syllabusContent == null ? (<Loading mt={2} />):(<>
								<Text fontSize='sm'>{syllabusContent}</Text>
							</>)}
						</Box>
						{/* <Box>
							<Heading size='xs' textTransform='uppercase'>Semester</Heading>
							<Text pt='2' fontSize='sm'>{coursesPerSem?.sem?.semID} ({(new Date(coursesPerSem?.sem?.semStartDate)).toLocaleDateString()} - {(new Date(coursesPerSem?.sem?.semEndDate)).toLocaleDateString()})</Text>
						</Box> */}
					</Stack>)}
				</CardBody>
				
			</Card>
			</MainContainer>
		</Flex>
		
	)
}
