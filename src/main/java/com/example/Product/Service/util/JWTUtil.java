package com.example.Product.Service.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JWTUtil {
    public final String SECRET = "hQ3QF4x9dS2b8kP7rVu1XyZc5N0gWmR4tLq8aS9jF2kE7uB1cT6yVwP3mH4rJ0sD";
    public final SecretKey KEY = Keys.hmacShaKeyFor(SECRET.getBytes());
    public String generateToken(String username){
        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 10))
                .signWith(KEY)
                .compact();
    }

    public String extractUsername(String token) {
        Claims body = Jwts.parser()
                .verifyWith(KEY)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return body.getSubject();
    }

    public boolean isExpired(String token, String username) {
        Claims body = Jwts.parser()
                .verifyWith(KEY)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return !(body.getSubject().equals(username) && body.getExpiration().after(new Date()));

    }
}
