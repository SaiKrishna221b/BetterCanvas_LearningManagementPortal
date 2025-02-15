import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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
	Textarea,
} from '@chakra-ui/react'

import { Loading } from '../../components/Loading';
import { Sidebar, SidebarButton } from '../../components/Sidebar';
import MainContainer from '../../components/Container';

export const Syllabus = ({apiManager}) => {
	const navigate = useNavigate();
	let { coursesPerSemId } = useParams();
	let { semID }    = useParams();

	const [coursesPerSem, setCoursesPerSem] = useState({});

	const [syllabusContent, setSyllabusContent] = useState(null);
	function loadSyllabus(coursesPerSem){
		apiManager.request(`/faculty/getSyllabusContentBySemidAndCourseID?semID=${semID}&courseID=${coursesPerSem.course.courseID}`)
		.catch(error => { navigate(`/dialog?title=ERROR&message=${error}`); })
		.then(data => {
			console.log(`syllabus: ${data.content ?? "(No Syllabus)"}`);
			setSyllabusContent(data.content ?? "");
		});
	}
	function saveSyllabus(){
		const _content = {
			"content": syllabusContent
		};
		setSyllabusContent(null);
		apiManager.request(`/faculty/updateSyllabusContent?semID=${semID}&courseID=${coursesPerSem.course.courseID}`, 'POST', _content)
		.catch(error => { navigate(`/dialog?title=ERROR&message=${error}`); })
		.then(data => {
			console.log(data);
			setSyllabusContent(JSON.parse(data.content).content);
		});
	}

	const [isPublishing, setIsPublishing] = useState(false);
	function publishCourse(){
		setIsPublishing(true);
		apiManager.request(`/faculty/publishCourse?semID=${semID}&courseID=${coursesPerSem.course.courseID}`, 'POST')
		.catch(error => { navigate(`/dialog?title=ERROR&message=${error}`); })
		.then(data => {
			console.log(data);
			setCoursesPerSem({...coursesPerSem, 'publishStatus':true});
			setIsPublishing(false);
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

			loadSyllabus(_coursesPerSem);
		});
	},[]);
	return (
		<Flex bg='gray.50'>
			<Sidebar>
				<SidebarButton variant="outline" onClick={()=>{ navigate('/faculty/'); }}>All Courses</SidebarButton>
				<SidebarButton onClick={()=>{ navigate(`/faculty/${semID}/course/${coursesPerSemId}`); }} variant='solid'>Syllabus</SidebarButton>
				<SidebarButton onClick={()=>{ navigate(`/faculty/${semID}/course/${coursesPerSemId}/announcements`); }}>Announcements</SidebarButton>
				<SidebarButton onClick={()=>{ navigate(`/faculty/${semID}/course/${coursesPerSemId}/assignments`); }}>Assignments</SidebarButton>
				<SidebarButton onClick={()=>{ navigate(`/faculty/${semID}/course/${coursesPerSemId}/quizzes`); }}>Quizzes</SidebarButton>
				<SidebarButton onClick={()=>{ navigate(`/faculty/${semID}/course/${coursesPerSemId}/students`); }}>Students</SidebarButton>
			</Sidebar>
			<MainContainer title="Syllabus" subtitle={coursesPerSem?.course?.courseName ?? "Loading..."}>
			<Card variant='outline'>
				<CardBody>
					{coursesPerSem.isLoading?(<Loading />) : 
					(<Stack divider={<StackDivider />} spacing='4'>
						<Text>Welcome to course {coursesPerSem?.course?.courseName} (ID: {coursesPerSem?.course?.courseID})</Text>
						<Box>
							<Heading size='xs' textTransform='uppercase'>Semester</Heading>
							<Text pt='2' fontSize='sm'>{coursesPerSem?.sem?.semID} ({(new Date(coursesPerSem?.sem?.semStartDate)).toLocaleDateString()} - {(new Date(coursesPerSem?.sem?.semEndDate)).toLocaleDateString()})</Text>
						</Box>
						<Box>
							<Heading size='xs' textTransform='uppercase'>Syllabus</Heading>
							{/* <Text pt='2' fontSize='sm'>{"No Syllabus"}</Text> */}
							{syllabusContent == null ? (<Loading mt={2} />):(<>
									<Textarea mt={2} focusBorderColor='purple.600' placeholder='Syllabus Content' value={syllabusContent} onChange={(e)=>{ setSyllabusContent(e.target.value); }} />
									<Button mt={2} colorScheme='purple' variant='outline' size='sm' onClick={()=>{ saveSyllabus(); }}>Save</Button>
								</>)}
							
						</Box>
						<Box>
							<Heading size='xs' textTransform='uppercase'>Status</Heading>
							<Text pt='2' fontSize='sm'>{coursesPerSem?.publishStatus ? "Published":"Unpublished"}</Text>
							{coursesPerSem?.publishStatus === false ? <Button mt='2' colorScheme='purple' variant='outline' size='sm' onClick={()=>{ publishCourse(); }} isDisabled={isPublishing}>{isPublishing ? "Publishing...":"Publish"}</Button>:<></>}
						</Box>
					</Stack>)}
				</CardBody>
			</Card>
			</MainContainer>
		</Flex>
		
	)
}
