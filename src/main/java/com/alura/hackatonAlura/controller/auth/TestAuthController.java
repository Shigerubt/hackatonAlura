package com.alura.hackatonAlura.controller.auth;

import com.alura.hackatonAlura.domain.user.Rol;
import com.alura.hackatonAlura.domain.user.User;
import com.alura.hackatonAlura.infra.security.DatosJWToken;
import com.alura.hackatonAlura.infra.security.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/login")
public class TestAuthController {

    @Autowired
    private TokenService tokenService;

    // Endpoint de prueba para entornos sin base de datos.
    // Usa credenciales: user=test, password=test
    @PostMapping("/test")
    public ResponseEntity<DatosJWToken> testLogin(@RequestBody LoginRequest data) {
        if (data == null || data.user() == null) return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        if (!"test".equals(data.user()) || !"test".equals(data.password())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        var user = new User(1L, data.user(), "", Rol.USER);
        var jwt = tokenService.generarToken(user);
        return ResponseEntity.ok(new DatosJWToken(jwt));
    }

    public static record LoginRequest(String user, String password) { }
}
