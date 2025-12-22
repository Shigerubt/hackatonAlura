package com.alura.hackatonAlura.infra.exceptions;

public class ValidacionDeIntegridad extends RuntimeException {
    public ValidacionDeIntegridad(String string) {
        super(string);
    }
}
