package com.alura.hackatonAlura.domain.usuario;

public record UserResponse(
        Long id,
        String fullName,
        String email,
        Status status,
        Role role) {

}
