package com.rubixcube.edusphere.controller;


import com.rubixcube.edusphere.config.JwtValidator;
import com.rubixcube.edusphere.model.*;
import com.rubixcube.edusphere.service.*;
import com.rubixcube.edusphere.service.SubmissionService;
import com.rubixcube.edusphere.util.Utility;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/student")
public class StudentController {
    private static final Logger LOGGER = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private StudentService studentService;

    @Autowired
    private JwtValidator jwtValidator;

    @Autowired
    private CoursesPerSemService coursesPerSemService;

    @Autowired
    private EnrollmentService enrollmentService;

    @Autowired
    private CoursesService coursesService;

    @Autowired
    Utility utility;

    @Autowired
    QuizService quizService;

    @Autowired
    AssignmentService assignmentService;

    @Autowired
    SubmissionService submissionService;

    @Autowired
    GradeService gradeService;

    @Autowired
    AnnouncementsService announcementsService;

    @GetMapping("/getStudent")
    public ResponseEntity<Student> getStudentDetails(@RequestParam Long studentID, @RequestHeader (name="Authorization") String authorizationHeader) {

        String token = authorizationHeader.substring(7);

        Student student = null;
        try {
            //Authenticate user session
            if (jwtValidator.validateToken(token)) {
                if (studentID != null) {
                    student = studentService.getStudentDetails(studentID);
                }
                else{
                    LOGGER.error("getStudentDetails: StudentID is null");
                }
            }

            else{
                LOGGER.error("getStudentDetails: Jwt Token not valid");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
        }
        catch(Exception e) {
            LOGGER.error(e.getMessage());
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(student);

    }

    /* API to fetch course details for a student for a semester */
    @GetMapping("/getCoursesByStudentBySem")
    public ResponseEntity<List<Courses>> getStudentDetails(@RequestParam Long studentID, @RequestParam String semID,
                                                           @RequestHeader (name="Authorization") String authorizationHeader) {

        String token = authorizationHeader.substring(7);

        List<Courses> courses = null;
        try {
            //Authenticate user session
            if (jwtValidator.validateToken(token)) {
                if (studentID != null && semID != null) {
                    //Fetch courses by semID and studentID
                    List<Long> courseIDs = enrollmentService.getCourseIdsByStudentBySem(semID,studentID);
                    //Fetch courses by courseID
                    courses = coursesService.getCoursesByCourseID(courseIDs);
                }
            }
            else
            {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
        }
        catch(Exception e) {
            LOGGER.error(e.getMessage());
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(courses);

    }

    /* API to view course content if published */
    @GetMapping("/getCourseContentBySem")
    public ResponseEntity<String> getCourseContent(@RequestParam String semID, @RequestParam Long courseID,
                                                   @RequestHeader (name="Authorization") String authorizationHeader) {

        String courseContent = null;
        try {
            //Authenticate user session
            if (jwtValidator.validateToken(utility.getJwtToken(authorizationHeader))) {
                if (courseID != null && semID != null) {
                    //Fetch published quizzes by semID and courseID
                    courseContent = coursesPerSemService.findCourseContentBySem(semID,courseID);
                }
            }
            else
            {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
        }
        catch(Exception e) {
            LOGGER.error(e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        return ResponseEntity.ok(courseContent);

    }

    /* API to view published quizzes */
    @GetMapping("/getQuizzesByCourseBySem")
    public ResponseEntity<List<Quizzes>> getPublishedQuizzes(@RequestParam String semID, @RequestParam Long courseID,
                                                             @RequestHeader (name="Authorization") String authorizationHeader) {

        List<Quizzes> quizzes = null;
        try {
            //Authenticate user session
            if (jwtValidator.validateToken(utility.getJwtToken(authorizationHeader))) {
                if (courseID != null && semID != null) {
                    //Fetch published quizzes by semID and courseID
                    quizzes = quizService.getQuizzesBySemByCourse(semID,courseID);
                }
            }
            else
            {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
        }
        catch(Exception e) {
            LOGGER.error(e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        return ResponseEntity.ok(quizzes);

    }

    /* API to view published assignments */
    @GetMapping("/getAssignmentsByCourseBySem")
    public ResponseEntity<List<Assignments>> getPublishedAssignments(@RequestParam String semID, @RequestParam Long courseID,
                                                                     @RequestHeader (name="Authorization") String authorizationHeader) {

        List<Assignments> assignments = null;
        try {
            //Authenticate user session
            if (jwtValidator.validateToken(utility.getJwtToken(authorizationHeader))) {
                if (courseID != null && semID != null) {
                    //Fetch published quizzes by semID and courseID
                    assignments = assignmentService.getAssignmentBySemByCourse(semID,courseID);
                }
            }
            else
            {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
        }
        catch(Exception e) {
            LOGGER.error(e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        return ResponseEntity.ok(assignments);

    }

    /* API to view submissions by course by sem */
    @GetMapping("/getSubmissionByCourseBySem")
    public ResponseEntity<List<Submission>> getSubmissionsByCourseBySem(@RequestParam Long studentID, @RequestParam String semID,
                                                                        @RequestParam Long courseID,
                                                                        @RequestHeader (name="Authorization") String authorizationHeader) {
        List<Submission> submissions = null;
        try {
            //Authenticate user session
            if (jwtValidator.validateToken(utility.getJwtToken(authorizationHeader))) {
                if (courseID != null && semID != null && studentID != null) {
                    //Fetch all submissions for that course
                    submissions = submissionService.findAllSubmissionsByCourseBySem(studentID,semID,courseID);
                }
            }
            else
            {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
        }
        catch(Exception e) {
            LOGGER.error(e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        return ResponseEntity.ok(submissions);

    }

    /* API to view grades by course by sem */
    @GetMapping("/getGradesByCourseBySem")
    public ResponseEntity<Grades> getGradesByCourseBySem(@RequestParam Long studentID, @RequestParam String semID,
                                                         @RequestParam Long courseID, @RequestHeader (name="Authorization") String authorizationHeader) {
        Grades grades = null;
        try {
            //Authenticate user session
            if (jwtValidator.validateToken(utility.getJwtToken(authorizationHeader))) {
                if (courseID != null && semID != null && studentID != null) {
                    //Fetch grade for that course
                    grades = gradeService.findGradesByCourseBySem(studentID,semID,courseID);
                }
            }
            else
            {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
        }
        catch(Exception e) {
            LOGGER.error(e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        return ResponseEntity.ok(grades);

    }

    /* API to set student profile information */
    @PostMapping("/setStudentProfileInfo")
    public ResponseEntity<Student> setStudentProfileInfo(@RequestBody Student student,
                                                         @RequestHeader (name="Authorization") String authorizationHeader) {

        Student student1 = null;
        try {
            //Authenticate user session
            if (jwtValidator.validateToken(utility.getJwtToken(authorizationHeader))) {
                if (student != null) {
                    //Fetch student for that studentID
                    student1 = studentService.getStudentDetails(student.getStudentID());
                    student1.setContact(student.getContact());
                    student1.setName(student.getName());
                    student1.setEmailID(student.getEmailID());

                    student1 = studentService.saveStudentDetails(student);
                }
            }
            else
            {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
        }
        catch(Exception e) {
            LOGGER.error(e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        return ResponseEntity.ok(student1);

    }

    /* API to see announcements */
    @GetMapping("/getAnnouncementsByCourseBySem")
    public ResponseEntity<List<Announcements>> setStudentProfileInfo(@RequestParam String semID, @RequestParam Long courseID,
                                                                     @RequestHeader (name="Authorization") String authorizationHeader) {

        List<Announcements> announcements = null;
        try {
            //Authenticate user session
            if (jwtValidator.validateToken(utility.getJwtToken(authorizationHeader))) {
                if (semID != null && courseID != null) {
                    //Fetch Announcements for that course
                    announcements = announcementsService.getAnnouncementsBySemAndCourse(semID, courseID);
                }
            }
            else
            {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
        }
        catch(Exception e) {
            LOGGER.error(e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        return ResponseEntity.ok(announcements);

    }


}
