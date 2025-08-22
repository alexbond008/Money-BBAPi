package com.bbapi.money_api.repository;

import org.springframework.stereotype.Repository;

import java.util.Date;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.bbapi.money_api.entity.StockPrice;
import com.bbapi.money_api.entity.StockPriceId;
@Repository
public interface StockPriceRepository extends JpaRepository<StockPrice,StockPriceId> {
    
    // TODO: check this sql query
    @Query("SELECT sp FROM StockPrice sp WHERE sp.id.ticker = :ticker AND sp.id.timestamp = :timestamp")
    StockPrice findById(String ticker, Date timestamp);
}
