import React, { useEffect, useState } from 'react';

import { TableRow, TableRowLoading } from '../../components/TableRow';
import {
	Flex,
	Card,
	CardBody,
	Stack,
	StackDivider,
	Box,
	Heading,
	Text,
	TableContainer,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Input,
	Textarea,
	Select,
	Button,
} from '@chakra-ui/react'
import { useNavigate, useParams } from 'react-router-dom';
import { Sidebar, SidebarButton } from '../../components/Sidebar';
import MainContainer from '../../components/Container';

export const Quiz = ({apiManager}) => {
	const navigate = useNavigate();
	let { coursesPerSemId } = useParams();
	let { semID }    = useParams();
	let { quizID }   = useParams();

	const [coursesPerSem, setCoursesPerSem] = useState({});

	const [isNew, setIsNew] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	const [quiz, setQuiz] = useState(null);

	function loadQuizzes(coursesPerSem){
		apiManager.request(`/faculty/getQuizDetailsBySemidCourseid?semID=${semID}&courseID=${coursesPerSem?.course?.courseID}`)
		.catch(error => { navigate(`/dialog?title=ERROR&message=${error}`); })
		.then(data => {
			const _quiz = data.filter(quiz => { return String(quiz.quizID) === quizID })[0]
			console.log(_quiz);
			setQuiz(_quiz);
		});
	}

	function updateQuiz(){
		setIsSaving(true);
		console.log('updateQuiz', quiz);
		if(isNew){
			apiManager.request(`/faculty/addQuizzes?semID=${semID}&courseID=${coursesPerSem.course.courseID}`,'POST',quiz)
				.catch(error => { navigate(`/dialog?title=ERROR&message=${error}`); })
				.then(data => {
					setIsSaving(false);
					console.log(data);
					navigate(`/faculty/${semID}/course/${coursesPerSemId}/quizzes`);
				});
		}else{
			apiManager.request(`/faculty/updateQuizzes`,'POST',quiz)
				.catch(error => { navigate(`/dialog?title=ERROR&message=${error}`); })
				.then(data => {
					setIsSaving(false);
					console.log(data);
				});
		}
	}

	const [students, setStudents] = useState(null);

	function loadStudents(coursesPerSem){
		apiManager.request(`/faculty/getStudentIDandNameBySemidCourseid?semID=${semID}&courseID=${coursesPerSem.course.courseID}`)
		.catch(error => { navigate(`/dialog?title=ERROR&message=${error}`); })
		.then(data => {
			const _student = data.map(x => { return {
				studentID: x[0],
				name: x[1],
			} });
			console.log(_student);
			setStudents(_student);
		});
	}

	useEffect(()=>{
		if(quizID === 'new'){
			setIsNew(true);
			setQuiz({
				quizName: "New quiz",
				content: "",
				dueDate: (new Date()).toISOString(),
				totalPoints: null,
				publishStatus: false,
			});
		}

		setCoursesPerSem({...coursesPerSem, 'isLoading':true});
		apiManager.request(`/faculty/getCoursesByFacultyBySem?facultyID=${apiManager.getUserInfo().facultyID}&semID=${semID}`)
		.catch(error => { navigate(`/dialog?title=ERROR&message=${error}`); })
		.then(data => {
			const _coursesPerSem = data.filter(coursesPerSem => {return String(coursesPerSem.coursesPerSemId) === coursesPerSemId})[0];
			setCoursesPerSem(_coursesPerSem);
			console.log(_coursesPerSem);

			if(quizID !== 'new'){
				loadQuizzes(_coursesPerSem);
				loadStudents(_coursesPerSem);
			}
		});
	},[]);

	return (
		<Flex bg='gray.50'>
			<Sidebar>
				<SidebarButton onClick={()=>{ navigate(`/faculty/${semID}/course/${coursesPerSemId}/quizzes`); }} variant='outline'>All Quizzes</SidebarButton>
			</Sidebar>
			<MainContainer title={`Quiz - ${quiz?.quizName ?? "Loading..."}`} subtitle={coursesPerSem?.course?.courseName ?? "Loading.."}>
			<Card variant='outline'>
				<CardBody>
					<Stack divider={<StackDivider />} spacing='4'>
						<Box>
							<Heading size='xs' textTransform='uppercase'>Name</Heading>
							<Input mt={2} focusBorderColor='purple.600' placeholder="Name" value={quiz?.quizName ?? "Loading..."} onChange={(e)=>{ setQuiz({...quiz, 'quizName':e.target.value}) }}  isDisabled={quiz?.content == null} />
						</Box>
						<Box>
							<Heading size='xs' textTransform='uppercase'>Summary</Heading>
							<Textarea mt={2} focusBorderColor='purple.600' placeholder='Summary' value={quiz?.content ?? "Loading..."} onChange={(e)=>{ setQuiz({...quiz, 'content':e.target.value}) }}  isDisabled={quiz?.content == null} />
						</Box>
						<Box>
							<Heading size='xs' textTransform='uppercase'>Due</Heading>
							<Input mt={2} type='datetime-local' focusBorderColor='purple.600' placeholder="Due" value={quiz?.dueDate ?? "Loading..."} onChange={(e)=>{ setQuiz({...quiz, 'dueDate':e.target.value}) }}  isDisabled={quiz?.content == null} />
						</Box>
						<Box>
							<Heading size='xs' textTransform='uppercase'>Total Points</Heading>
							<Input mt={2} type='number' focusBorderColor='purple.600' placeholder="Points" value={quiz?.totalPoints ?? "Loading..."} onChange={(e)=>{ setQuiz({...quiz, 'totalPoints':Number(e.target.value)}) }}  isDisabled={quiz?.content == null} />
						</Box>
						<Box>
							<Heading size='xs' textTransform='uppercase'>Status</Heading>
							<Select mt={2} focusBorderColor='purple.600' value={quiz?.publishStatus} onChange={(e)=>{ setQuiz({...quiz, 'publishStatus':e.target.value==='true'}) }} isDisabled={quiz?.content == null}>
								<option value={true}>Published</option>
								<option value={false}>Unpublished</option>
							</Select>
						</Box>
						<Box>
							<Button colorScheme='purple' onClick={()=>{ updateQuiz(); }} isDisabled={isSaving}>{isNew ? (isSaving?"Creating...":"Create"):(isSaving?"Saving...":"Save")}</Button>
						</Box>
					</Stack>
				</CardBody>
			</Card>
			{ isNew === false ? (<>
				<Heading mt={6} color='purple.800'>Students</Heading>
				<Card variant='outline' mt={3} mb={10}>
					<TableContainer>
						<Table variant='simple'>
							<Thead>
								<Tr>
									<Th>Student ID</Th>
									<Th>Name</Th>
									<Th>Status</Th>
								</Tr>
							</Thead>
							<Tbody>
								{students==null ?
									<TableRowLoading />:
									(students.length===0 ?
										(<Tr><Td colSpan="100%">No Student Found</Td></Tr>):
										(students.map(student => (
											<TableRow key={student.studentID}>
												<Td>{student.studentID}</Td>
												<Td>{student.name}</Td>
											</TableRow>
										)))
									)
								}
							</Tbody>
						</Table>
					</TableContainer>
				</Card>
			</>):<></>}
			</MainContainer>
		</Flex>
		
	)
}