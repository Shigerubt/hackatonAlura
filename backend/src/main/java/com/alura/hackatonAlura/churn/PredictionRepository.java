package com.alura.hackatonAlura.churn;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PredictionRepository extends JpaRepository<Prediction, Long> {
    long count();
    long countByPrevision(String prevision);

    @Query("""
    select p.riskLevel, count(p)
    from Prediction p
    group by p.riskLevel
""")
    List<Object[]> countByRisk();

    List<Prediction> findTop20ByOrderByProbabilidadDesc();

    @Modifying
    @Transactional
    @Query("DELETE FROM Prediction p")
    void deleteAllPredictions();

}

