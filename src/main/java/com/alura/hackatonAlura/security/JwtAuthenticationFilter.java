package com.alura.hackatonAlura.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String uri = request.getRequestURI();
        String raw = request.getHeader("Authorization");
        if (raw == null) {
            log.debug("No Authorization header for {}", uri);
        }
        String token = extractToken(raw);
        if (token != null) {
            try {
                Claims claims = jwtUtil.parseToken(token);
                String username = claims.getSubject();

                String rolesClaim = claims.get("roles", String.class);
                if (rolesClaim == null || rolesClaim.isBlank()) {
                    String singleRole = claims.get("rol", String.class);
                    rolesClaim = (singleRole == null || singleRole.isBlank()) ? "USER" : singleRole;
                }

                List<SimpleGrantedAuthority> authorities = Arrays.stream(rolesClaim.split(","))
                        .map(String::trim)
                        .filter(s -> !s.isEmpty())
                        .map(r -> r.startsWith("ROLE_") ? r : "ROLE_" + r)
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList());

                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(username, null, authorities);
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
                log.debug("JWT ok for {} (sub={}, roles={})", uri, username, rolesClaim);
            } catch (ExpiredJwtException e) {
                request.setAttribute("jwt_error", "expired");
                log.warn("JWT expired for {}: {}", uri, e.getMessage());
                SecurityContextHolder.clearContext();
            } catch (JwtException | IllegalArgumentException e) {
                request.setAttribute("jwt_error", "invalid");
                log.warn("JWT invalid for {}: {}", uri, e.getMessage());
                SecurityContextHolder.clearContext();
            }
        }

        chain.doFilter(request, response);
    }

    private String extractToken(String header) {
        if (header == null) return null;
        Pattern p = Pattern.compile("([A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+)");
        Matcher m = p.matcher(header);
        if (m.find()) {
            return m.group(1).trim();
        }
        if (header.toLowerCase().startsWith("bearer ")) {
            return header.substring(7).trim();
        }
        return header.trim();
    }
}
