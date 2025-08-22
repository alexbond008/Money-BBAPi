package com.bbapi.money_api.repository;

import org.springframework.stereotype.Repository;

import java.util.Date;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.bbapi.money_api.entity.StockPrice;
import com.bbapi.money_api.entity.StockPriceId;
@Repository
public interface StockPriceRepository extends JpaRepository<StockPrice,StockPriceId> {
    

    @Query("SELECT s FROM StockPrice s WHERE s.ticker = ?1 AND s.timestamp <= ?2 ORDER BY s.timestamp DESC LIMIT 1")
    public java.util.Optional<StockPrice> findLatestById(String ticker, Date timestamp);
}
