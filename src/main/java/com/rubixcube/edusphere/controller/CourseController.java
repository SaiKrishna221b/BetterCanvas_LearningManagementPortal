package com.rubixcube.edusphere.controller;


import com.rubixcube.edusphere.config.JwtValidator;
import com.rubixcube.edusphere.model.Courses;
import com.rubixcube.edusphere.model.Student;
import com.rubixcube.edusphere.service.CoursesPerSemService;
import com.rubixcube.edusphere.service.CoursesService;
import com.rubixcube.edusphere.service.EnrollmentService;
import com.rubixcube.edusphere.service.StudentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/course")
public class CourseController {
    private static final Logger LOGGER = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private CoursesService coursesService;

    @Autowired
    private JwtValidator jwtValidator;

    @GetMapping("/getCourse")
    public ResponseEntity<Courses> getCourse(@RequestParam Long courseID, @RequestHeader (name="Authorization") String authorizationHeader) {

        String token = authorizationHeader.substring(7);

        Courses course = null;
        try {
            //Authenticate user session
            if (jwtValidator.validateToken(token)) {
                if (courseID != null) {
                    course = coursesService.getCourseByCourseID(courseID);
                }
                else{
                    LOGGER.error("getCourse: courseID is null");
                }
            }

            else{
                LOGGER.error("getCourse: Jwt Token not valid");
            }
        }
        catch(Exception e) {
            LOGGER.error(e.getMessage());
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(course);
    }


}
