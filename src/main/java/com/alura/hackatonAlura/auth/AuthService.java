package com.alura.hackatonAlura.auth;

import com.alura.hackatonAlura.user.User;
import com.alura.hackatonAlura.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Locale;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UserResponse register(RegisterRequest request) {
        String emailLower = request.email().toLowerCase(Locale.ROOT).trim();
        if (userRepository.existsByEmail(emailLower)) {
            throw new IllegalArgumentException("Email already in use");
        }

        String hashed = passwordEncoder.encode(request.password());

        User user = new User();
        user.setEmail(emailLower);
        user.setPasswordHash(hashed);
        user.setFullName(request.fullName());
        user.setRoles("USER");

        User saved = userRepository.save(user);
        return new UserResponse(saved.getId(), saved.getEmail(), saved.getFullName(), saved.getRoles());
    }
}
