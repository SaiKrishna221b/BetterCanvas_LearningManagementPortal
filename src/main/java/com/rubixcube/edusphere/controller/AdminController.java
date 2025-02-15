package com.rubixcube.edusphere.controller;


import com.rubixcube.edusphere.config.JwtValidator;
import com.rubixcube.edusphere.model.*;
import com.rubixcube.edusphere.service.*;
import com.rubixcube.edusphere.util.Utility;
import lombok.experimental.UtilityClass;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/admin")
public class AdminController {

    private static final Logger LOGGER = LoggerFactory.getLogger(AdminController.class);

    @Autowired
    JwtValidator jwtValidator;

    @Autowired
    AdminService adminService;

    @Autowired
    CoursesPerSemService coursesPerSemService;

    @Autowired
    CoursesService coursesService;

    @Autowired
    SemesterService semesterService;

    @Autowired
    FacultyService facultyService;

    @Autowired
    StudentService studentService;

    @Autowired
    EnrollmentService enrollmentService;

    @Autowired
    Utility utility;

    @GetMapping("/getAdmin")
    public ResponseEntity<Admin> getAdminDetails(@RequestParam Long adminID, @RequestHeader(name="Authorization") String authorizationHeader) {

        String token = authorizationHeader.substring(7);

        Admin admin = null;
        try {
            //Authenticate admin session
            if (jwtValidator.validateToken(token)) {
                if (adminID != null) {
                    admin = adminService.getAdminDetails(adminID);
                }
            }
        }
        catch(Exception e) {
            LOGGER.error(e.getMessage());
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(admin);

    }

    /* Get all faculties by Sem */
    @GetMapping("/getFacultiesBySem")
    public ResponseEntity<List<Faculty>> getFacultiesBySem(@RequestParam String semID, @RequestHeader(name="Authorization") String authorizationHeader) {


        List<Faculty> faculties = null;
        List<Long> facultyIDs = null;
        try {
            //Authenticate admin session
            if (jwtValidator.validateToken(utility.getJwtToken(authorizationHeader))) {
                if (semID != null) {
                    facultyIDs = coursesPerSemService.getFacultiesIdBySem(semID);
                }

                faculties = facultyService.getFacultiesByIDs(facultyIDs);

            }
        }
        catch(Exception e) {
            LOGGER.error(e.getMessage());
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(faculties);

    }

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
                    courses = coursesPerSemService.getCoursesByFacultyBySem(semID, facultyID);

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

    /* API to assign a course to a faculty for a new semester */
    @PostMapping("/assignCourseToFaculty")
    public ResponseEntity<CoursesPerSem> assignCourseToFaculty(@RequestParam Long courseID, @RequestParam Long facultyID,
                                                        @RequestParam String semID,
                                                        @RequestHeader(name="Authorization") String authorizationHeader) {

        String token = authorizationHeader.substring(7);

        CoursesPerSem coursesPerSem = null;
        try {
            //Authenticate admin session
            if (jwtValidator.validateToken(token)) {
                if (courseID != null && facultyID!=null && semID!=null) {

                    //Get the existing coursePerSem record
                    coursesPerSem = coursesPerSemService.getCoursePerSemBySemByCourse(semID,courseID);
                    Faculty faculty = facultyService.getFacultyByFacultyID(facultyID);
                    coursesPerSem.setFaculty(faculty);
                    //assign the course to faculty for a coursePerSem
                    coursesPerSem  = coursesPerSemService.assignCourseToFaculty(coursesPerSem);
                }
            }
            else
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        catch(Exception e) {
            LOGGER.error(e.getMessage());
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(coursesPerSem);
    }

    /* API to view student list for each course */
    @GetMapping("/getStudentListByCourseBySem")
    public ResponseEntity<List<Student>> getStudentsByCourseBySem(@RequestParam Long courseID, @RequestParam String semID,
                                                            @RequestHeader(name="Authorization") String authorizationHeader) {

        String token = authorizationHeader.substring(7);

        List<Student> students = null;

        try {
            //Authenticate admin session
            if (jwtValidator.validateToken(token)) {
                if (courseID != null && semID!=null) {
                  //  long coursePerSemID = coursesPerSemService.getIdByCourseAndSem(courseID,semID);
                    List<Long> studentIDs = enrollmentService.getStudentIDsByCourseBySem(courseID,semID);
                    students = studentService.getStudentsByIDs(studentIDs);
                }
            }
            else
                return ResponseEntity.badRequest().build();
        }
        catch(Exception e) {
            LOGGER.error(e.getMessage());
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(students);
    }

}
