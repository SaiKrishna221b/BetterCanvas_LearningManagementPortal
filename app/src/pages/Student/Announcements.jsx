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
} from '@chakra-ui/react'
import { useNavigate, useParams } from 'react-router-dom';
import { Sidebar, SidebarButton } from '../../components/Sidebar';
import MainContainer from '../../components/Container';

export const Announcements = ({apiManager}) => {
	const navigate = useNavigate();
	let { courseID } = useParams();
	let { semID }    = useParams();
	const [course, setCourse] = useState({});

	const [announcements, setAnnouncements] = useState(null);

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

		apiManager.request(`/faculty/getAnnouncementIdBySemidAndCourseID?semID=${semID}&courseID=${courseID}`)
		.catch(error => { navigate(`/dialog?title=ERROR&message=${error}`); })
		.then(data => {
			console.log(data);
			setAnnouncements(data);
		});
	},[]);
	return (
		<Flex bg='gray.50'>
			<Sidebar>
				<SidebarButton variant="outline" onClick={()=>{ navigate('/student/'); }}>All Courses</SidebarButton>
				<SidebarButton onClick={()=>{ navigate(`/student/${semID}/course/${courseID}`); }}>Syllabus</SidebarButton>
				<SidebarButton onClick={()=>{ navigate(`/student/${semID}/course/${courseID}/announcements`); }} variant='solid'>Announcements</SidebarButton>
				<SidebarButton onClick={()=>{ navigate(`/student/${semID}/course/${courseID}/assignments`); }}>Assignments</SidebarButton>
				<SidebarButton onClick={()=>{ navigate(`/student/${semID}/course/${courseID}/quizzes`); }}>Quizzes</SidebarButton>
				<SidebarButton onClick={()=>{ navigate(`/student/${semID}/course/${courseID}/grades`); }}>Grades</SidebarButton>
			</Sidebar>
			<MainContainer title="Announcements" subtitle={course?.courseName ?? "Loading.."}>
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
