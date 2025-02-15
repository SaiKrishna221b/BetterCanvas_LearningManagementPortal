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

export const Quiz = ({apiManager}) => {
	const navigate = useNavigate();
	let { courseID } = useParams();
	let { semID }    = useParams();
	let { quizID }   = useParams();
	const [course, setCourse] = useState({});

	const [quiz, setQuiz] = useState(null);

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
			const _quiz = data.filter(quiz => { return String(quiz.quizID) === quizID })[0];
			setQuiz(_quiz);
		});
	},[]);
	return (
		<Flex bg='gray.50'>
			<Sidebar>
				<SidebarButton onClick={()=>{ navigate(`/student/${semID}/course/${courseID}/quizzes`); }} variant='outline'>All Quizzes</SidebarButton>
			</Sidebar>
			<MainContainer title={`Quiz - ${quiz?.quizName ?? "Loading..."}`} subtitle={course?.courseName ?? "Loading.."}>
			<Card variant='outline'>
				<CardBody>
					<Stack divider={<StackDivider />} spacing='4'>
						<Box>
							<Heading size='xs' textTransform='uppercase'>
								Summary
							</Heading>
							<Text pt='2' fontSize='sm'>
								{quiz?.content ?? "Loading..."}
							</Text>
						</Box>
						<Box>
							<Heading size='xs' textTransform='uppercase'>Due</Heading>
							<Text pt='2' fontSize='sm'>{(new Date(quiz?.dueDate)).toLocaleString()}</Text>
						</Box>
						<Box>
							<Heading size='xs' textTransform='uppercase'>Duration</Heading>
							<Text pt='2' fontSize='sm'>{quiz?.duration ?? "Loading..."}</Text>
						</Box>
						<Box>
							<Heading size='xs' textTransform='uppercase'>Total Points</Heading>
							<Text pt='2' fontSize='sm'>{quiz?.totalPoints ?? "Loading..."} point{quiz?.totalPoints > 1 ? "s":""}</Text>
						</Box>
						<Box>
							<Button colorScheme='purple'>Start</Button>
						</Box>
					</Stack>
				</CardBody>
			</Card>
			</MainContainer>
		</Flex>
		
	)
}