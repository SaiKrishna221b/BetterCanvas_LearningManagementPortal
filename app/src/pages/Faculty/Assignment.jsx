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
	Button,
	Input,
	Textarea,
	Select,
	useDisclosure,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
} from '@chakra-ui/react'
import { useNavigate, useParams } from 'react-router-dom';
import { Sidebar, SidebarButton } from '../../components/Sidebar';
import MainContainer from '../../components/Container';

export const Assignment = ({apiManager}) => {
	const navigate = useNavigate();
	let { coursesPerSemId } = useParams();
	let { semID }    = useParams();
	let { assignmentID } = useParams();

	const [coursesPerSem, setCoursesPerSem] = useState({});

	const [isNew, setIsNew] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	const [assignment, setAssignment] = useState(null);

	function loadAssignment(coursesPerSem){
		apiManager.request(`/faculty/getAssignmentDetailsBySemidCourseid?semID=${semID}&courseID=${coursesPerSem.course.courseID}`)
		.catch(error => { navigate(`/dialog?title=ERROR&message=${error}`); })
		.then(data => {
			const _assignment = data.filter(assignment => { return String(assignment.assignmentID) === assignmentID })[0]
			console.log(_assignment);
			setAssignment(_assignment);
		});
	}

	function updateAssignment(){
		setIsSaving(true);
		if(isNew){
			apiManager.request(`/faculty/addAssignment?semID=${semID}&courseID=${coursesPerSem.course.courseID}`,'POST',assignment)
				.catch(error => { navigate(`/dialog?title=ERROR&message=${error}`); })
				.then(data => {
					setIsSaving(false);
					console.log(data);
					navigate(`/faculty/${semID}/course/${coursesPerSemId}/assignments`);
				});
		}else{
			apiManager.request(`/faculty/updateAssignment`,'POST',assignment)
				.catch(error => { navigate(`/dialog?title=ERROR&message=${error}`); })
				.then(data => {
					setIsSaving(false);
					console.log(data);
					window.location.reload();
				});
		}
	}

	const [students, setStudents] = useState(null);
	
	function loadStudentSubmission(coursesPerSem, student, index, students){
		apiManager.request(`/faculty/getSubmissionDetails?studentID=${student.studentID}&semID=${semID}&courseID=${coursesPerSem.course.courseID}`)
		.catch(error => { navigate(`/dialog?title=ERROR&message=${error}`); })
		.then(data => {
			const _students = [...students];
			const filteredSubmission = data.filter(submission => { return String(submission.assignment.assignmentID) === assignmentID })
			if(filteredSubmission.length !== 0){
				_students[index].submission = filteredSubmission[0] ?? null
			}
			console.log(`loadStudentSubmission ${index}`, data, filteredSubmission);
			_students[index].isLoading = false
			setStudents(_students);
		});
	}
	function loadStudents(coursesPerSem){
		apiManager.request(`/faculty/getStudentIDandNameBySemidCourseid?semID=${semID}&courseID=${coursesPerSem.course.courseID}`)
		.catch(error => { navigate(`/dialog?title=ERROR&message=${error}`); })
		.then(data => {
			const _students = data.map(x => { return {
				studentID: x[0],
				name: x[1],
				isLoading: true,
			} });
			_students.forEach((student, index) => {
				loadStudentSubmission(coursesPerSem, student, index, _students);
			})
			console.log(_students);
			setStudents(_students);
		});
	}

	const { isOpen, onOpen, onClose } = useDisclosure()
	const [viewingSubmission, setViewingSubmission] = useState(null);
	const [isGradeAssigning, setIsGradeAssigning] = useState(false);
	function assignGrade(submissionID, pointScored){
		setIsGradeAssigning(true);
		apiManager.request(`/faculty/gradeSubmission?submissionID=${submissionID}&pointScored=${pointScored}`, 'POST')
		.catch(error => { navigate(`/dialog?title=ERROR&message=${error}`); })
		.then(data => {
			setIsGradeAssigning(false);
			onClose();
			const _students = [...students];
			const index = _students.findIndex(student => student.studentID === String(data.student.studentID));
			console.log(index, data);
			_students[index].submission = data;
			setStudents(_students);
		});
	}

	useEffect(()=>{
		if(assignmentID === 'new'){
			setIsNew(true);
			setAssignment({
				assignmentName: "New Assignment",
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

			if(assignmentID !== 'new'){
				loadAssignment(_coursesPerSem);
				loadStudents(_coursesPerSem);
			}
		});
	},[]);
	return (
		<Flex bg='gray.50'>
			<Sidebar>
				<SidebarButton onClick={()=>{ navigate(`/faculty/${semID}/course/${coursesPerSemId}/assignments`); }} variant='outline'>All Assignments</SidebarButton>
			</Sidebar>
			<MainContainer title={`Assignment - ${assignment?.assignmentName ?? "Loading..."}`} subtitle={coursesPerSem?.course?.courseName ?? "Loading.."}>
			<Card variant='outline'>
				<CardBody>
					<Stack divider={<StackDivider />} spacing='4'>
						<Box>
							<Heading size='xs' textTransform='uppercase'>Name</Heading>
							<Input mt={2} focusBorderColor='purple.600' placeholder="Name" value={assignment?.assignmentName ?? "Loading..."} onChange={(e)=>{ setAssignment({...assignment, 'assignmentName':e.target.value}) }} isDisabled={assignment?.content == null} />
						</Box>
						<Box>
							<Heading size='xs' textTransform='uppercase'>Summary</Heading>
							<Textarea mt={2} focusBorderColor='purple.600' placeholder='Summary' value={assignment?.content ?? "Loading..."} onChange={(e)=>{ setAssignment({...assignment, 'content':e.target.value}) }} isDisabled={assignment?.content == null} />
						</Box>
						<Box>
							<Heading size='xs' textTransform='uppercase'>Due</Heading>
							<Input mt={2} type='datetime-local' focusBorderColor='purple.600' placeholder="Due" value={assignment?.dueDate ?? "Loading..."} onChange={(e)=>{ setAssignment({...assignment, 'dueDate':e.target.value}) }} isDisabled={assignment?.content == null} />
						</Box>
						<Box>
							<Heading size='xs' textTransform='uppercase'>Total Points</Heading>
							<Input mt={2} type='number' focusBorderColor='purple.600' placeholder="Points" value={assignment?.totalPoints ?? "Loading..."} onChange={(e)=>{ setAssignment({...assignment, 'totalPoints':Number(e.target.value)}) }} isDisabled={assignment?.content == null} />
						</Box>
						<Box>
							<Heading size='xs' textTransform='uppercase'>Status</Heading>
							<Select mt={2} focusBorderColor='purple.600' value={assignment?.publishStatus} onChange={(e)=>{ setAssignment({...assignment, 'publishStatus':e.target.value==='true'}) }} isDisabled={assignment?.content == null}>
								<option value={true}>Published</option>
								<option value={false}>Unpublished</option>
							</Select>
						</Box>
						<Box>
							<Button colorScheme='purple' onClick={()=>{ updateAssignment(); }} isDisabled={isSaving}>{isNew ? (isSaving?"Creating...":"Create"):(isSaving?"Saving...":"Save")}</Button>
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
									<Th>Grade</Th>
									<Th>Action</Th>
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
												{/* <Td>{student.submission != null ? (<Box>
													<Text>{student.submission.pointScored}</Text>
													</Box>):<></>}
												</Td> */}
												<Td>{student.isLoading ? "Loading...":(student.submission == null ? "No Submission":(
													<Text>{student.submission.pointScored}/{student.submission.assignment?.totalPoints}</Text>
												))}</Td>
												<Td>{student.isLoading ? "Loading...":(student.submission == null ? "":(
													<Button size='sm' onClick={()=>{
														setViewingSubmission(student.submission);
														onOpen();
													}}>Assign</Button>
												))}</Td>
											</TableRow>
										)))
									)
								}
							</Tbody>
						</Table>
					</TableContainer>
				</Card>
				</>):<></>}

				<Modal isOpen={isOpen} onClose={onClose}>
					<ModalOverlay />
					<ModalContent>
						<ModalHeader>Student Submission</ModalHeader>
						<ModalCloseButton />
						<ModalBody>
							<Stack divider={<StackDivider />} spacing='4'>
								<Box>
									<Heading size='xs' textTransform='uppercase'>Submission</Heading>
									<Text pt='2' fontSize='sm'>{viewingSubmission?.submissionContent}</Text>
								</Box>
								<Box>
									<Heading size='xs' textTransform='uppercase'>Submitted</Heading>
									<Text pt='2' fontSize='sm'>{(new Date(viewingSubmission?.submissionDate)).toLocaleString()}</Text>
								</Box>
								<Box>
									<Heading size='xs' textTransform='uppercase'>Grade</Heading>
									<Input mt={2} type='number' focusBorderColor='purple.600' placeholder="Points" value={viewingSubmission?.pointScored ?? "Loading..."} onChange={(e)=>{ setViewingSubmission({...viewingSubmission, pointScored:e.target.value}) }} />
								</Box>
							</Stack>
						</ModalBody>
						<ModalFooter>
							<Button colorScheme='purple' mr={3} onClick={()=>{assignGrade(viewingSubmission?.submissionID, viewingSubmission?.pointScored)}} isDisabled={isGradeAssigning}>{isGradeAssigning ? "Assigning...":"Assign"}</Button>
							<Button colorScheme='purple' onClick={onClose} variant='outline'>Close</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>
			
			</MainContainer>
		</Flex>
		
	)
}