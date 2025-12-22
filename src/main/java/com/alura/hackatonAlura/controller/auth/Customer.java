package com.alura.hackatonAlura.controller.auth;

import lombok.Getter;


@Getter

public class Customer {

    private int tiempoContratoMeses;
    private int retrasosPago;
    private double usoMensual;
    private String plan;

    public Customer(int tiempoContratoMeses, int retrasosPago, double usoMensual, String plan) {

        if (tiempoContratoMeses < 0) throw new IllegalArgumentException("Tiempo de contrato invalido");
        if (retrasosPago < 0) throw new IllegalArgumentException("Retrasos de pago invalido");
        if (usoMensual < 0) throw new IllegalArgumentException("Uso mensual invalido");
        if (plan == null || plan.isBlank()) throw new IllegalArgumentException("El plan es necesario");


        this.tiempoContratoMeses = tiempoContratoMeses;
        this.retrasosPago = retrasosPago;
        this.usoMensual = usoMensual;
        this.plan = plan;
    }
}