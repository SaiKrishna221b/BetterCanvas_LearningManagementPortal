import React, { useEffect, useState } from 'react';

import { Sidebar, SidebarButton } from '../../components/Sidebar';
import MainContainer from '../../components/Container';
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

import { useNavigate } from 'react-router-dom';

const Home = ({apiManager}) => {
	const navigate = useNavigate();

	const [semesters, setSemesters] = useState([
		'Fall 2023',
		'Spring 2024',
	]);
	const [faculties, setFaculties] = useState([]);
	const [coursesPerSem, setCoursesPerSem] = useState(null);

	const [selectingSemID, setSelectingSemID] = useState(semesters[0]);
	const [selectingFacultyID, setSelectingFacultyID] = useState("");

	function loadFaculties(semID, facultyID=null){
		setCoursesPerSem(null);
		apiManager.request(`/admin/getFacultiesBySem?semID=${semID}`)
		.catch(error => { navigate(`/dialog?title=ERROR&message=${error}`); })
		.then(data => {
			const _faculties = data;
			console.log(_faculties);
			setFaculties(_faculties);
			if(data.length !== 0){
				const _facultyID = facultyID ?? String(_faculties[0].facultyID);
				setSelectingFacultyID(_facultyID);
				loadCourses(_facultyID);
			}
		});
	}

	function loadCourses(facultyID){
		setCoursesPerSem(null);
		apiManager.request(`/admin/getCoursesByFacultyBySem?semID=${selectingSemID}&facultyID=${facultyID}`)
		.catch(error => { navigate(`/dialog?title=ERROR&message=${error}`); })
		.then(data => {
			const _coursesPerSem = data;
			console.log(_coursesPerSem);
			setCoursesPerSem(_coursesPerSem);
		});
	}

	function loadStudents(coursePerSem){
		apiManager.request(`/admin/getStudentListByCourseBySem?semID=${selectingSemID}&courseID=${coursePerSem.course.courseID}`)
		.catch(error => { navigate(`/dialog?title=ERROR&message=${error}`); })
		.then(data => {
			console.log('loadStudents',data);
			setViewingCoursePerSem({...coursePerSem, students:data});
		});
	}

	const { isOpen, onOpen, onClose } = useDisclosure()
	const [viewingCoursePerSem, setViewingCoursePerSem] = useState(null);
	const [isAssigning, setIsAssigning] = useState(false);
	function assignFaculty(facultyID){
		setIsAssigning(true);
		apiManager.request(`/admin/assignCourseToFaculty?semID=${selectingSemID}&courseID=${viewingCoursePerSem.course.courseID}&facultyID=${facultyID}`, 'POST')
		.catch(error => { navigate(`/dialog?title=ERROR&message=${error}`); })
		.then(data => {
			setIsAssigning(false);
			window.location.reload();
		});
	}

	useEffect(() => {
		document.title = 'Home';
		loadFaculties(selectingSemID);
	}, []);

	return (
		<Flex bg='gray.50'>
			<Sidebar>
				{/* {Object.keys(semesters).map(semesterId => <SidebarButton key={semesterId} variant={semesterId===selectingSemester ? "solid":"ghost"} onClick={()=>{selectSemester(semesterId)}}>{semesterId}</SidebarButton>)} */}
			</Sidebar>
			<MainContainer title="Courses" subtitle={`${selectingSemID} for ${ faculties.find(faculty => String(faculty.facultyID) === selectingFacultyID)?.name }`}>
			<Card variant='outline'>
				<CardBody>
					<Select mt={2} focusBorderColor='purple.600' value={selectingSemID} onChange={(e)=>{
						const semID = e.target.value;
						setSelectingSemID(semID);
						loadFaculties(semID,selectingFacultyID);
						}}>
						{semesters.map(semID => <option key={semID} value={semID}>{semID}</option>)}
					</Select>
					<Select mt={2} focusBorderColor='purple.600' value={selectingFacultyID} onChange={(e)=>{
						const facultyID = e.target.value;
						setSelectingFacultyID(facultyID);
						loadCourses(facultyID);
						}}>
						{faculties.map(faculty => <option key={faculty.facultyID} value={faculty.facultyID}>{faculty.name}</option>)}
					</Select>
				</CardBody>
			</Card>
			<Card variant='outline' mt={3}>
				<TableContainer>
					<Table variant='simple'>
						<Thead>
							<Tr>
								<Th>ID</Th>
								<Th>Name</Th>
								<Th>Status</Th>
								<Th>Action</Th>
							</Tr>
						</Thead>
						<Tbody>
						{coursesPerSem == null ?
								(<TableRowLoading />):
								(coursesPerSem.length === 0 ?
									(<Tr><Td colSpan="100%">No Course</Td></Tr>):
									(coursesPerSem.map(coursePerSem => (
										<TableRow key={coursePerSem.course.courseID}>
											<Td>{coursePerSem.course.courseID}</Td>
											<Td>{coursePerSem.course.courseName}</Td>
											<Td>{coursePerSem.publishStatus ? "Published":"Unpublish"}</Td>
											<Td>
												<Button size='sm' onClick={()=>{
														setViewingCoursePerSem(coursePerSem);
														loadStudents(coursePerSem);
														onOpen();
													}}>View</Button>
											</Td>
										</TableRow>
									)))
								)
							}
						</Tbody>
					</Table>
				</TableContainer>
			</Card>

			<Modal isOpen={isOpen} onClose={onClose}>
					<ModalOverlay />
					<ModalContent>
						<ModalHeader>Course Detail</ModalHeader>
						<ModalCloseButton />
						<ModalBody>
							<Stack divider={<StackDivider />} spacing='4'>
								<Box>
									<Heading size='xs' textTransform='uppercase'>Course</Heading>
									<Text pt='2' fontSize='sm'>(ID: {viewingCoursePerSem?.course.courseID}) {viewingCoursePerSem?.course.courseName}</Text>
								</Box>
								<Box>
									<Heading size='xs' textTransform='uppercase'>Semester</Heading>
									<Text pt='2' fontSize='sm'>{viewingCoursePerSem?.sem?.semID} ({(new Date(viewingCoursePerSem?.sem?.semStartDate)).toLocaleDateString()} - {(new Date(viewingCoursePerSem?.sem?.semEndDate)).toLocaleDateString()})</Text>
								</Box>
								<Box>
									<Heading size='xs' textTransform='uppercase'>Faculty</Heading>
									<Select mt={2} focusBorderColor='purple.600' value={viewingCoursePerSem?.faculty.facultyID} onChange={(e)=>{
										const facultyID = e.target.value;
										setViewingCoursePerSem({
											...viewingCoursePerSem,
											faculty:{
												facultyID: facultyID,
											}
										});
										// setSelectingFacultyID(facultyID);
										// loadCourses(facultyID);
										}}>
										{faculties.map(faculty => <option key={faculty.facultyID} value={faculty.facultyID}>{faculty.name}</option>)}
									</Select>
									<Button mt={2} size='sm' variant='outline' colorScheme='purple' onClick={()=>{assignFaculty(viewingCoursePerSem?.faculty.facultyID)}} isDisabled={isAssigning}>{isAssigning ? "Saving...":"Save"}</Button>
								</Box>
								<Box>
									{/* <Heading size='xs' textTransform='uppercase'>Students</Heading> */}
									<TableContainer>
										<Table variant='simple'>
											<Thead>
												<Tr>
													<Th>Student ID</Th>
													<Th>Name</Th>
												</Tr>
											</Thead>
											<Tbody>
												{viewingCoursePerSem?.students==null ?
													<TableRowLoading />:
													(viewingCoursePerSem?.students.length===0 ?
														(<Tr><Td colSpan="100%">No Student Found</Td></Tr>):
														(viewingCoursePerSem?.students.map(student => (
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
								</Box>
							</Stack>
						</ModalBody>
						<ModalFooter>
							<Button colorScheme='purple' onClick={onClose}>Close</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>



			</MainContainer>
		</Flex>
	)
}

export default Home;