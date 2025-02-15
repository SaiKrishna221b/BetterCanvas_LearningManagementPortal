package com.rubixcube.edusphere.controller;

import com.rubixcube.edusphere.config.JwtResponse;
import com.rubixcube.edusphere.config.JwtTokenProvider;
import com.rubixcube.edusphere.config.JwtValidator;
import com.rubixcube.edusphere.model.User;
import com.rubixcube.edusphere.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("api/v1/")
public class UserController {
    private static final Logger LOGGER = LoggerFactory.getLogger(UserController.class);

    private final UserService userService;

    private final JwtTokenProvider jwtTokenProvider;


    @Autowired
    public UserController(UserService userService, JwtTokenProvider jwtTokenProvider) {
        this.userService = userService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {

        try {
            User userDetails = userService.loginUser(user);

            if(userDetails!=null) {

                String jwtToken = jwtTokenProvider.generateToken(String.valueOf(userDetails.getUserID()));

                JwtResponse jwtResponse = new JwtResponse(jwtToken);
                System.out.println("Jwt response = " + jwtResponse.getToken());

                return ResponseEntity.ok(jwtResponse);
            }
        } catch (Exception e) {
            LOGGER.error(e.getMessage());
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.notFound().build();
    }
}
