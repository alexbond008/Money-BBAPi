package com.bbapi.money_api.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.bbapi.money_api.entity.StockPrice;
@Repository
public interface StockPriceRepository extends JpaRepository<StockPrice, Long> {
    
}
