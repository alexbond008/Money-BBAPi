package com.bbapi.money_api.repository;

import java.util.Date;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.bbapi.money_api.entity.HistoryItem;
import com.bbapi.money_api.entity.HistoryItemId;
import com.bbapi.money_api.entity.StockPrice;

@Repository
public interface HistoryItemRepository extends JpaRepository<HistoryItem, HistoryItemId> {
    @Query("SELECT hi FROM HistoryItem hi WHERE hi.id.ticker = :ticker AND hi.id.timestamp = :timestamp")
    HistoryItem findById(String ticker, Date timestamp);
}
