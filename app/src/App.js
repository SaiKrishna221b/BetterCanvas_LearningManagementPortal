import './App.css';
import './pages/Base/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';

import Home from "./pages/Base/Home";
import Login from "./pages/User/Login";
import Logout from "./pages/User/Logout";
import Account from './pages/User/Account';

import { DialogPage } from './pages/Base/DialogPage';
import ApiManager from './utilities/ApiManager';

import * as StudentPage from './pages/Student';
import * as FacultyPage from './pages/Faculty';
import * as AdminPage   from './pages/Admin';

const App = () => {
	const apiManager = new ApiManager();
	return (
		<Router>
			<Routes>
				<Route path="*" element={<DialogPage title="404 Page Not Found" message={`Sorry, the url (${window.location.href}) does not exist.`} />}/>
				<Route path="/dialog" element={<DialogPage />}/>

				<Route path="/user/login" element={<Login apiManager={apiManager} />} />
				<Route path="/user/logout" element={<Logout />} />
				<Route path="/user/account" element={<PrivateRoute element={<Account apiManager={apiManager} />} />} />

				<Route path="/"                                                                element={<PrivateRoute element={<Home apiManager={apiManager} />} />} />

				<Route path="/student"                                                         element={<PrivateRoute element={<StudentPage.Home apiManager={apiManager} />} />} />
				<Route path="/student/:semID/course/:courseID/"                                element={<PrivateRoute element={<StudentPage.Syllabus apiManager={apiManager} />} />} />
				<Route path="/student/:semID/course/:courseID/announcements"                   element={<PrivateRoute element={<StudentPage.Announcements apiManager={apiManager} />} />} />
				<Route path="/student/:semID/course/:courseID/assignments"                     element={<PrivateRoute element={<StudentPage.Assignments apiManager={apiManager} />} />} />
				<Route path="/student/:semID/course/:courseID/assignment/:assignmentID"        element={<PrivateRoute element={<StudentPage.Assignment apiManager={apiManager} />} />} />
				<Route path="/student/:semID/course/:courseID/quizzes"                         element={<PrivateRoute element={<StudentPage.Quizzes apiManager={apiManager} />} />} />
				<Route path="/student/:semID/course/:courseID/quiz/:quizID"                    element={<PrivateRoute element={<StudentPage.Quiz apiManager={apiManager} />} />} />
				<Route path="/student/:semID/course/:courseID/grades"                          element={<PrivateRoute element={<StudentPage.Grades apiManager={apiManager} />} />} />

				<Route path="/faculty"                                                         element={<PrivateRoute element={<FacultyPage.Home apiManager={apiManager} />} />} />
				<Route path="/faculty/:semID/course/:coursesPerSemId/"                         element={<PrivateRoute element={<FacultyPage.Syllabus apiManager={apiManager} />} />} />
				<Route path="/faculty/:semID/course/:coursesPerSemId/announcements"            element={<PrivateRoute element={<FacultyPage.Announcements apiManager={apiManager} />} />} />
				<Route path="/faculty/:semID/course/:coursesPerSemId/assignments"              element={<PrivateRoute element={<FacultyPage.Assignments apiManager={apiManager} />} />} />
				<Route path="/faculty/:semID/course/:coursesPerSemId/assignment/:assignmentID" element={<PrivateRoute element={<FacultyPage.Assignment apiManager={apiManager} />} />} />
				<Route path="/faculty/:semID/course/:coursesPerSemId/quizzes"                  element={<PrivateRoute element={<FacultyPage.Quizzes apiManager={apiManager} />} />} />
				<Route path="/faculty/:semID/course/:coursesPerSemId/quiz/:quizID"             element={<PrivateRoute element={<FacultyPage.Quiz apiManager={apiManager} />} />} />
				<Route path="/faculty/:semID/course/:coursesPerSemId/students"                 element={<PrivateRoute element={<FacultyPage.Students apiManager={apiManager} />} />} />

				<Route path="/admin"                                                           element={<PrivateRoute element={<AdminPage.Home apiManager={apiManager} />} />} />


			</Routes>
		</Router>
	);
};

export default App;
