package com.bbapi.money_api.repository;

import java.time.LocalDateTime;
import java.util.Date;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.bbapi.money_api.entity.CashWorth;
import com.bbapi.money_api.entity.StockPrice;

@Repository
public interface CashRepository extends JpaRepository<CashWorth, LocalDateTime> {
    @Query  ("SELECT c FROM CashWorth c WHERE c.calculatedAt <= :tDate ORDER BY c.calculatedAt DESC")
    public java.util.Optional<CashWorth> findLatestById(LocalDateTime date);
}
