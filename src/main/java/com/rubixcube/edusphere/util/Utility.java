package com.rubixcube.edusphere.util;


import org.springframework.stereotype.Component;

@Component
public class Utility {

    public String getJwtToken(String authorizationHeader) {
        return authorizationHeader.substring(7);
    }
}
