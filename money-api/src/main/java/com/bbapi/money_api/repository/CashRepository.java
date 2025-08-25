package com.bbapi.money_api.repository;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bbapi.money_api.entity.CashWorth;

@Repository
public interface CashRepository extends JpaRepository<CashWorth, LocalDateTime> {

    // Latest snapshot <= given time
    @Query("SELECT c FROM CashWorth c WHERE c.calculatedAt <= :date ORDER BY c.calculatedAt DESC")
    Optional<CashWorth> findLatestById(@Param("date") LocalDateTime date);

    // Absolute latest (used for fallback)
    Optional<CashWorth> findTopByOrderByCalculatedAtDesc();

}
