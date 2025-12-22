package com.alura.hackatonAlura.infra.security;

import com.alura.hackatonAlura.domain.user.User;
import com.alura.hackatonAlura.domain.user.UserRepository;
import com.alura.hackatonAlura.domain.user.Rol;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(SecurityFilter.class);

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UserRepository usuarioRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String token = recuperarToken(request);

        if (token != null) {
            try {
                String usuario = tokenService.getSubject(token);
                logger.debug("Token present, subject={}", usuario);
                User user = usuarioRepository.findByUser(usuario);

                // If user not present in DB (test mode), build a lightweight User from token claims
                if (user == null) {
                    logger.debug("User not found in DB for subject={}", usuario);
                    try {
                        String rolClaim = tokenService.getRole(token);
                        logger.debug("Role claim from token: {}", rolClaim);
                        Rol rol = rolClaim != null ? Rol.valueOf(rolClaim) : Rol.USER;
                        user = new User(null, usuario, "", rol);
                        logger.debug("Built temporary user from token: {} with role {}", usuario, rol);
                    } catch (Exception ex) {
                        logger.warn("Failed to build user from token claims", ex);
                        // If anything fails building a user from token, clear context and continue
                        SecurityContextHolder.clearContext();
                        filterChain.doFilter(request, response);
                        return;
                    }
                }

                var authentication = new UsernamePasswordAuthenticationToken(
                        user, null, user.getAuthorities()
                );

                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (Exception e) {
                logger.warn("Error validating token", e);
                SecurityContextHolder.clearContext();
            }
        }

        filterChain.doFilter(request, response);
    }

    private String recuperarToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header == null) return null;
        logger.debug("Raw Authorization header: {}", header);
        // Try to extract a well-formed JWT (3 base64url parts separated by two dots)
        Pattern p = Pattern.compile("([A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+)");
        Matcher m = p.matcher(header);
        if (m.find()) {
            String token = m.group(1);
            logger.debug("Extracted token via regex: {}", token);
            return token.trim();
        }
        // Fallback: remove common prefix and trim
        if (header.toLowerCase().startsWith("bearer ")) {
            return header.substring(7).trim();
        }
        return header.trim();
    }
}

