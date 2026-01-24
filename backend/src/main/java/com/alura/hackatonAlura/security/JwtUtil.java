package com.alura.hackatonAlura.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

@Component
public class JwtUtil {

    private final String secret;
    private final long expirationMinutes;

    public JwtUtil(
            @Value("${jwt.secret:}") String jwtSecret,
            @Value("${api.security.secret:}") String apiSecuritySecret,
            @Value("${jwt.expiration-minutes:120}") long expirationMinutes
    ) {
        this.secret = (jwtSecret != null && !jwtSecret.isBlank()) ? jwtSecret : apiSecuritySecret;
        this.expirationMinutes = expirationMinutes;
    }

    private Key key() {
        byte[] bytes = secret.length() >= 32 ? secret.getBytes(StandardCharsets.UTF_8) : Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(bytes);
    }

    public String generateToken(String subject, Map<String, Object> claims) {
        Instant now = Instant.now();
        Instant exp = now.plusSeconds(expirationMinutes * 60);
        return Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(exp))
                .addClaims(claims)
                .signWith(key())
                .compact();
    }

    public Claims parseToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key()).build()
                .parseClaimsJws(token).getBody();
    }

    public String getSubject(String token) {
        return parseToken(token).getSubject();
    }
}
