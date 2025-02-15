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
	Input,
	Button,
} from '@chakra-ui/react'
import { useNavigate, useParams } from 'react-router-dom';
import { Sidebar, SidebarButton } from '../../components/Sidebar';
import MainContainer from '../../components/Container';

export const Announcements = ({apiManager}) => {
	const navigate = useNavigate();
	let { coursesPerSemId } = useParams();
	let { semID }    = useParams();

	const [coursesPerSem, setCoursesPerSem] = useState({});

	const [announcements, setAnnouncements] = useState(null);

	const [newAnnouncement, setNewAnnouncement] = useState(null);
	const [isCreating, setIsCreating] = useState(false);

	function loadAnnouncements(coursesPerSem){
		apiManager.request(`/faculty/getAnnouncementIdBySemidAndCourseID?semID=${semID}&courseID=${coursesPerSem.course.courseID}`)
		.catch(error => { navigate(`/dialog?title=ERROR&message=${error}`); })
		.then(data => {
			console.log(data);
			setAnnouncements(data);
		});
	}

	function createAnnouncement(content){
		setIsCreating(true);
		apiManager.request(`/faculty/createAnnouncement?semID=${semID}&courseID=${coursesPerSem.course.courseID}`, 'POST', content)
		.catch(error => { navigate(`/dialog?title=ERROR&message=${error}`); })
		.then(data => {
			console.log(data);
			const _announcements = [...announcements];
			_announcements.push(data);
			setAnnouncements(_announcements);
			setNewAnnouncement(null);
			setIsCreating(false);
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

			loadAnnouncements(_coursesPerSem);
		});
	},[]);

	return (
		<Flex bg='gray.50'>
			<Sidebar>
				<SidebarButton variant="outline" onClick={()=>{ navigate('/faculty/'); }}>All Courses</SidebarButton>
				<SidebarButton onClick={()=>{ navigate(`/faculty/${semID}/course/${coursesPerSemId}`); }}>Syllabus</SidebarButton>
				<SidebarButton onClick={()=>{ navigate(`/faculty/${semID}/course/${coursesPerSemId}/announcements`); }} variant='solid'>Announcements</SidebarButton>
				<SidebarButton onClick={()=>{ navigate(`/faculty/${semID}/course/${coursesPerSemId}/assignments`); }}>Assignments</SidebarButton>
				<SidebarButton onClick={()=>{ navigate(`/faculty/${semID}/course/${coursesPerSemId}/quizzes`); }}>Quizzes</SidebarButton>
				<SidebarButton onClick={()=>{ navigate(`/faculty/${semID}/course/${coursesPerSemId}/students`); }}>Students</SidebarButton>
			</Sidebar>
			<MainContainer title="Announcements" subtitle={coursesPerSem?.course?.courseName ?? "Loading.."}>
			<Card variant='outline' mb={3}>
				<CardBody>
					<Input mt={2} focusBorderColor='purple.600' placeholder="A new announcement description" onChange={(e)=>{ setNewAnnouncement(e.target.value) }} />
					<Button mt={2} size="sm" onClick={()=>{ createAnnouncement(newAnnouncement) }} isDisabled={isCreating}>{isCreating ? "Posting...":"Post"}</Button>
				</CardBody>
			</Card>
			<Card variant='outline'>
				<TableContainer>
					<Table variant='simple'>
						<Thead>
							<Tr>
								{/* <Th>Timestamp</Th> */}
								<Th>Announcements</Th>
							</Tr>
						</Thead>
						<Tbody>
						{announcements==null ?
								<TableRowLoading />:
								(announcements.length===0 ?
									(<Tr><Td colSpan="100%">No Announcement Found</Td></Tr>):
									(announcements.sort((a,b) => { return a.announcementID < b.announcementID }).map(announcement => (
										<TableRow key={announcement.announcementID}>
											{/* <Td>{(new Date(announcement.announcementDate)).toLocaleString()}</Td> */}
											<Td>{announcement.description}</Td>
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
