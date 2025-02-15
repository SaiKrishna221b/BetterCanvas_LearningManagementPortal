package com.rubixcube.edusphere.config;

import com.rubixcube.edusphere.controller.UserController;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.security.Key;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtValidator {

    private static final Logger LOGGER = LoggerFactory.getLogger(JwtValidator.class);

    @Value("${jwt.secret}")
    private String secretKey;

    public boolean validateToken(String token) {
        try {
            Key hmacKey = new SecretKeySpec(Base64.getDecoder().decode(secretKey),
                    SignatureAlgorithm.HS256.getJcaName());
               Jwts.parser()
                    .setSigningKey(hmacKey)
                    .build()
                    .parseClaimsJws(token);

                return true;
        } catch (Exception e) {
            LOGGER.error(e.getMessage());
            return false;
        }
    }
}
