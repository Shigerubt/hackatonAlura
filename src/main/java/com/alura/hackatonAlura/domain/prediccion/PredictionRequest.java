package com.alura.hackatonAlura.domain.prediccion;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PredictionRequest(
        @NotNull
        @Min(0)
        @JsonProperty("contract_months")
        Integer contractMonths,

        @NotNull
        @Min(0)
        @JsonProperty("payment_delays")
        Integer paymentDelays,

        @NotNull
        @Min(0)
        @JsonProperty("monthly_usage")
        Double monthlyUsage,

        @NotBlank
        @JsonProperty("plan")
        String plan
) {
}
