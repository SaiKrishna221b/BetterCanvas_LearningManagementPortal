package com.rubixcube.edusphere.controller;

import com.rubixcube.edusphere.config.JwtValidator;
import com.rubixcube.edusphere.model.*;
import com.rubixcube.edusphere.service.*;
import com.rubixcube.edusphere.service.impl.CoursesPerSemServiceImpl;

import com.rubixcube.edusphere.util.Utility;
import org.hibernate.sql.ast.tree.update.Assignment;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.sql.Timestamp;


@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/faculty")
public class FacultyController {
    
    private static final Logger LOGGER = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private JwtValidator jwtValidator;

    @Autowired
    FacultyService facultyService;

    @Autowired
    CoursesService coursesService;

    @Autowired
    SemesterService semesterService;

    @Autowired
    CoursesPerSemService coursesPerSemService;

    @Autowired
    StudentService studentService;

    @Autowired
    EnrollmentService enrollmentService;

    @Autowired
    SyllabusService syllabusService;

    @Autowired
    AnnouncementsService announcementsService;

    @Autowired
    SubmissionService submissionService;

    @Autowired
    AssignmentService assignmentService;

    @Autowired
    QuizService quizService;
    @Autowired
    private Utility utility;

    @GetMapping("/getFaculty")
    public ResponseEntity<Faculty> getFacultyDetails(@RequestParam Long facultyID, @RequestHeader(name="Authorization") String authorizationHeader) {

        String token = authorizationHeader.substring(7);

        Faculty faculty = null;
        try {
            // Authenticate Faculty session
            if (jwtValidator.validateToken(token)) {
                if (facultyID != null) {
                    faculty = facultyService.getFacultyByFacultyID(facultyID);
                } else {
                    LOGGER.error("getFacultyDetails: FacultyID is null");
                }
            } else {
                LOGGER.error("getFacultyDetails: Jwt Token not valid");
            }
        } catch (Exception e) {
            LOGGER.error(e.getMessage());
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(faculty);
    }

    
    /* F 1.1 GET API to get the list of semesterIDs  by FacultyID (complete, tested)*/
    @GetMapping("/getSemIDsByFacultyID")
    public ResponseEntity<List<String>> getSemIDsByFacultyID(@RequestParam Long facultyID, 
                                                @RequestHeader(name="Authorization") String authorizationHeader) {

        String token = authorizationHeader.substring(7);

        List<String> sems = null;

        try {
            // Authenticate Faculty session
            if (jwtValidator.validateToken(token)) {
                if (facultyID != null) {
                    sems = coursesPerSemService.getSemIDsByFacultyID(facultyID);
                }
                else{
                    LOGGER.error("getSemIDsByFacultyID: FacultyID is null");
                }
            }
            else
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        catch(Exception e) {
            LOGGER.error(e.getMessage());
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(sems);
    }


    /* F 1.2  GET API to get the list of courses taught by FacultyID AND SemID (complete, tested).*/
    @GetMapping("/getCoursesByFacultyBySem")
    private ResponseEntity<List<CoursesPerSem>> getCoursesByFacultyBySem(@RequestParam String semID, @RequestParam Long facultyID,
                                                                         @RequestHeader(name="Authorization") String authorizationHeader) {

        String token = authorizationHeader.substring(7);

        List<CoursesPerSem> courses = null;

        try {
            //Authenticate session
            if (jwtValidator.validateToken(token)) {
                if (semID != null && facultyID != null) {
                    //Get courses for a faculty for a sem
                    courses = coursesPerSemService.getCoursesByFacultyBySem(semID,facultyID);
                  
                }
            }
            else
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        catch(Exception e) {
            LOGGER.error(e.getMessage());
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(courses);
    }


    /* F 2.1 GET Syllabus content by semid, courseid (complete,tested)*/
    @GetMapping("/getSyllabusContentBySemidAndCourseID")
    private ResponseEntity<String> getSyllabusContentBySemIDandCourseID(@RequestParam String semID, @RequestParam Long courseID,
                                                                         @RequestHeader(name="Authorization") String authorizationHeader) {

        String token = authorizationHeader.substring(7);
        String content=null;

        try {
            //Authenticate session
            if (jwtValidator.validateToken(token)) {
                if (semID != null && courseID != null) {
                    
                        content= syllabusService.getSyllabusContentBySemIDandCourseID(semID, courseID);

                }
            }
            else
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        catch(Exception e) {
            LOGGER.error(e.getMessage());
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(content);
    }


    /* 2.2 POST API to publish content in SyllabusModel for a given SemID and CourseID (complete, Tested) */
    @PostMapping("/updateSyllabusContent")
    public ResponseEntity<Syllabus> updateSyllabusContent(@RequestParam String semID, @RequestParam Long courseID, @RequestBody String content,
                                                      @RequestHeader(name="Authorization") String authorizationHeader) {

        String token = authorizationHeader.substring(7);
        Syllabus syllabus=null;

        try {
            // Authenticate session
            if (jwtValidator.validateToken(token)) {
                if (semID != null && courseID != null && content != null) {
                    // Call service method to create syllabus content

                    syllabus=syllabusService.getSyllabusObject(semID, courseID);

                    if(syllabus==null){
                        syllabus = new Syllabus();
                        syllabus.setSem(new Semester(semID, null, null));
                        syllabus.setCourses(new Courses(courseID, null));

                    }

                    syllabus.setContent(content);
                    syllabus = syllabusService.updateSyllabusContent(syllabus);

                    if (syllabus!=null) {
                        return ResponseEntity.ok(syllabus);
                    } else {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // HTTP status code 500
                    }
                } else {
                    return ResponseEntity.badRequest().build(); // HTTP status code 400
                }
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build(); // HTTP status code 403
            }
        } catch(Exception e) {
            LOGGER.error(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // HTTP status code 500
        }
    }

    /* 3. Get AnnouncementIDs by Semid and CourseId (complete, tested) */
    @GetMapping("/getAnnouncementIdBySemidAndCourseID")
    private ResponseEntity<List<Announcements>>getAnnouncementIdBySemidAndCourseID(@RequestParam String semID, @RequestParam Long courseID,
                                                                        @RequestHeader(name="Authorization") String authorizationHeader) {

        String token = authorizationHeader.substring(7);
        List<Announcements> ann=null;

        try {
            //Authenticate session
            if (jwtValidator.validateToken(token)) {
                if (semID != null && courseID != null) {

                    ann= announcementsService.getAnnouncementsBySemidAndCourseid(semID,courseID);

                }
            }
            else
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        catch(Exception e) {
            LOGGER.error(e.getMessage());
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(ann);
    }


    /* 4. Post new Announcement Description by semid, courseid (complete, tested)    */
    @PostMapping("/createAnnouncement")
    public ResponseEntity<Announcements>createAnnouncement(@RequestParam String semID, @RequestParam Long courseID, @RequestBody String description,
                                                          @RequestHeader(name="Authorization") String authorizationHeader) {

        String token = authorizationHeader.substring(7);
        Announcements announcement=null;
        try {
            // Authenticate session
            if (jwtValidator.validateToken(token)) {
                if (semID != null && courseID != null && description != null) {
                    // Call service method to create syllabus content

                    announcement=new Announcements();

                    announcement.setSem(new Semester(semID,null,null));
                    announcement.setCourses(new Courses(courseID,null));
                    announcement.setDescription(description);

                    announcement = announcementsService.createNewAnnouncement(announcement);
                    if (announcement!=null) {
                        return ResponseEntity.ok(announcement);
                    } else {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // HTTP status code 500
                    }
                } else {
                    return ResponseEntity.badRequest().build(); // HTTP status code 400
                }
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build(); // HTTP status code 403
            }
        } catch(Exception e) {
            LOGGER.error(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // HTTP status code 500
        }
    }


    /* 5. Get StudentID, Name by semid and courseid (complete,tested)*/
    @GetMapping("/getStudentIDandNameBySemidCourseid")
    private ResponseEntity<List<List<String>>>getStudentIDandNameBySemidCourseid(@RequestParam String semID, @RequestParam Long courseID,
                                                                            @RequestHeader(name="Authorization") String authorizationHeader) {

        String token = authorizationHeader.substring(7);
        List<List<String>> details=null;

        try {
            //Authenticate session
            if (jwtValidator.validateToken(token)) {
                if (semID != null && courseID != null) {

                    details= enrollmentService.getStudentDetails(semID,courseID);

                }
            }
            else
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        catch(Exception e) {
            LOGGER.error(e.getMessage());
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(details);
    }

    /* 6. Get Assignment/Quiz Name, Due, pointsScored, Total points by studentid, semid, courseid Returns AssignmentName, Due, scored,total(complete, tested)*/
    @GetMapping("/getSubmissionDetails")
    private ResponseEntity<List<Submission>>getSubmissionDetails(@RequestParam Long studentID, @RequestParam String semID,
                                                                 @RequestParam Long courseID,
                                                                 @RequestHeader(name="Authorization") String authorizationHeader) {

        String token = authorizationHeader.substring(7);
        List<Submission> submissions = null;

        try {
            //Authenticate session
            if (jwtValidator.validateToken(token)) {
                if (semID != null && courseID != null) {

                    submissions = submissionService.findAllSubmissionsByCourseBySem(studentID, semID, courseID);

                }
            } else
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (Exception e) {
            LOGGER.error(e.getMessage());
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(submissions);
    }

    /* 7. Get List of ALL(published/unpublished)Assignments object with all the fields of the table (complete, tested)*/
    @GetMapping("/getAssignmentDetailsBySemidCourseid")
    private ResponseEntity<List<Assignments>>getAssignmentDetailsBySemidCourseid(@RequestParam String semID, @RequestParam Long courseID,
                                                                   @RequestHeader(name="Authorization") String authorizationHeader) {

        String token = authorizationHeader.substring(7);
        List<Assignments> details = null;

        try {
            //Authenticate session
            if (jwtValidator.validateToken(token)) {
                if (semID != null && courseID != null) {

                    details = assignmentService.getAssignmentDetails( semID, courseID);

                }
            } else
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (Exception e) {
            LOGGER.error(e.getMessage());
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(details);
    }

    /* 8. View Quizzes (complete, tested)*/
    @GetMapping("/getQuizDetailsBySemidCourseid")
    private ResponseEntity<List<Quizzes>>getQuizDetailsBySemidCourseid(@RequestParam String semID, @RequestParam Long courseID,
                                                                                 @RequestHeader(name="Authorization") String authorizationHeader) {

        String token = authorizationHeader.substring(7);
        List<Quizzes> details = null;

        try {
            //Authenticate session
            if (jwtValidator.validateToken(token)) {
                if (semID != null && courseID != null) {

                    details = quizService.getQuizDetails( semID, courseID);

                }
            } else
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (Exception e) {
            LOGGER.error(e.getMessage());
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(details);
    }

    /* 9 Add Assignment (dueDate,uploadDate not handled on backend)- All else working, tested)*/
    @PostMapping("/addAssignment")
    private ResponseEntity<Assignments>addAssignment(@RequestBody Assignments assignments,
                                                     @RequestParam String semID,
                                                     @RequestParam Long courseID,
                                                     @RequestHeader(name="Authorization") String authorizationHeader) {


        Assignments assignment = new Assignments();

        try {
            //Authenticate session
            if(jwtValidator.validateToken(utility.getJwtToken(authorizationHeader))){
                if (assignments != null && semID !=null && courseID != null) {

                    Semester sem = semesterService.getSemesterBySemID( semID);
                    Courses course = coursesService.getCourseByCourseID(courseID);
                    assignment.setSem(sem);
                    assignment.setCourses(course);
                    assignment.setAssignmentName(assignments.getAssignmentName());
                    assignment.setContent(assignments.getContent());
                    assignment.setTotalPoints(assignments.getTotalPoints());
                    assignment.setPublishStatus(assignments.isPublishStatus());
                    assignment.setUploadDate(assignments.getUploadDate());
                    assignment.setDueDate(assignments.getDueDate());

                    assignment=assignmentService.createAssignment(assignment);
                }
            } else
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (Exception e) {
            LOGGER.error(e.getMessage());
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(assignment);
    }

    /* 10 Add Quiz (dueDate,uploadDate not handled on backend)- All else working, tested)*/
    @PostMapping("/addQuizzes")
    private ResponseEntity<Quizzes>addQuizzes(@RequestParam("semID") String semID,
                                              @RequestParam("courseID") Long courseID,
                                              @RequestBody Quizzes quizzes,
                                              @RequestHeader(name="Authorization") String authorizationHeader)
    {

        String token = authorizationHeader.substring(7);

        Quizzes quiz = new Quizzes();

        try {
            //Authenticate session
            if (jwtValidator.validateToken(token)) {
                if (semID != null && courseID != null && quizzes != null) {


                    Semester sem = semesterService.getSemesterBySemID( semID);
                    Courses course = coursesService.getCourseByCourseID(courseID);

                    quiz.setSem(sem);
                    quiz.setCourses(course);
                    quiz.setQuizName(quizzes.getQuizName());
                    quiz.setDueDate(quizzes.getDueDate());
                    quiz.setStartDateTime(quizzes.getStartDateTime());
                    quiz.setDuration(quizzes.getDuration());
                    quiz.setQuestions(quizzes.getQuestions());
                    quiz.setInstructions(quizzes.getInstructions());
                    quiz.setContent(quizzes.getContent());
                    quiz.setTotalPoints(quizzes.getTotalPoints());
                    quiz.setPublishStatus(quizzes.isPublishStatus());

                    quiz=quizService.createQuiz(quiz);
                }
            } else
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (Exception e) {
            LOGGER.error(e.getMessage());
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(quiz);
    }

    /*11. assign Grade  (complete, tested)  */
    @PostMapping("/gradeSubmission")
    private ResponseEntity<Submission>gradeSubmission(@RequestParam("submissionID") Long submissionID,
                                                      @RequestParam("pointScored") double pointScored,
                                                      @RequestHeader(name="Authorization") String authorizationHeader) {

        Submission submission = submissionService.findSubmissionById(submissionID);

        try {
            if(jwtValidator.validateToken(utility.getJwtToken(authorizationHeader))){


                if(submissionID != null && pointScored>=0 ){

                    submission.setPointScored(pointScored);
                    submission=submissionService.gradeSubmission(submission);

                }else {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).build();

                }
            }

        } catch (Exception e) {
            LOGGER.error(e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        }


        return ResponseEntity.ok(submission);
    }

    /* API to publish a course*/
    @PostMapping("/publishCourse")
    private ResponseEntity<CoursesPerSem> publishCourse(@RequestParam String semID,
                                                                         @RequestParam Long courseID,
                                                                         @RequestHeader(name="Authorization") String authorizationHeader) {


        CoursesPerSem coursesPerSem = null;

        try {
            //Authenticate session
            if(jwtValidator.validateToken(utility.getJwtToken(authorizationHeader))){
                if (semID != null && courseID!=null) {
                    //Get the exiting row
                    coursesPerSem = coursesPerSemService.getCoursePerSemBySemByCourse(semID,courseID);
                    if(coursesPerSem!=null) {
                        coursesPerSem.setPublishStatus(true);
                        coursesPerSemService.saveCoursesPerSem(coursesPerSem);
                    }

                }
            }
            else
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        catch(Exception e) {
            LOGGER.error(e.getMessage());
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(coursesPerSem);
    }

    /* API to update Assignment */
    @PostMapping("/updateAssignment")
    public ResponseEntity<Assignments>updateAssignment(@RequestBody Assignments assignments,
                                                     @RequestHeader(name="Authorization") String authorizationHeader) {


        Assignments updatedAssignment = null;

        try {
            //Authenticate session
            if(jwtValidator.validateToken(utility.getJwtToken(authorizationHeader))){
                if(assignments != null) {

                    //fetch the existing assignment
                    updatedAssignment = assignmentService.getAssignmentByID(assignments.getAssignmentID());

                    updatedAssignment.setPublishStatus(assignments.isPublishStatus());
                    updatedAssignment.setTotalPoints(assignments.getTotalPoints());
                    updatedAssignment.setDueDate(assignments.getDueDate());
                    updatedAssignment.setContent(assignments.getContent());
                    updatedAssignment.setAssignmentName(assignments.getAssignmentName());
                    updatedAssignment.setUploadDate(assignments.getUploadDate());

                    //persist updated assignment in db
                    assignmentService.createAssignment(updatedAssignment);
                }
            } else
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (Exception e) {
            LOGGER.error(e.getMessage());
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedAssignment);
    }

    /* API to update Quizzes */
    @PostMapping("/updateQuizzes")
    public ResponseEntity<Quizzes>updateQuiz(@RequestBody Quizzes quizzes,
                                                    @RequestHeader(name="Authorization") String authorizationHeader) {


        Quizzes updatedQuiz = null;

        try {
            //Authenticate session
            if(jwtValidator.validateToken(utility.getJwtToken(authorizationHeader))){
                if(quizzes != null) {

                    //fetch the existing quiz
                    updatedQuiz = quizService.getQuizById(quizzes.getQuizID());

                    updatedQuiz.setContent(quizzes.getContent());
                    updatedQuiz.setDuration(quizzes.getDuration());
                    updatedQuiz.setDueDate(quizzes.getDueDate());
                    updatedQuiz.setInstructions(quizzes.getInstructions());
                    updatedQuiz.setQuizName(quizzes.getQuizName());
                    updatedQuiz.setPublishStatus(quizzes.isPublishStatus());
                    updatedQuiz.setQuestions(quizzes.getQuestions());
                    updatedQuiz.setStartDateTime(quizzes.getStartDateTime());
                    updatedQuiz.setTotalPoints(quizzes.getTotalPoints());

                    //persist updated assignment in db
                    quizService.createQuiz(updatedQuiz);
                }
            } else
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (Exception e) {
            LOGGER.error(e.getMessage());
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedQuiz);
    }


}
