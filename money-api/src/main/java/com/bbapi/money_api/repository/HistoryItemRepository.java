package com.bbapi.money_api.repository;

import java.util.Date;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.bbapi.money_api.entity.HistoryItem;
import com.bbapi.money_api.entity.HistoryItemId;

@Repository
public interface HistoryItemRepository extends JpaRepository<HistoryItem, HistoryItemId> {
    @Query("SELECT hi FROM HistoryItem hi WHERE hi.id.ticker = :ticker AND hi.id.timestamp = :timestamp")
    HistoryItem findById(String ticker, Date timestamp);
    
    @Query("SELECT h FROM HistoryItem h WHERE h.timestamp <= ?1 GROUP BY h.ticker, h.timestamp HAVING SUM(h.quantity)>0") 
    public List<HistoryItem> getOlderThan(java.util.Date date);

    @Query("SELECT h FROM HistoryItem h WHERE h.ticker = :string")
    public List<HistoryItem> findByTicker(String string);

    @Query("SELECT h FROM HistoryItem h WHERE h.ticker = 'MONEY' AND h.timestamp <= ?1 GROUP BY h.ticker, h.timestamp HAVING SUM(h.quantity)>0")
    public List<HistoryItem> getCashOlderThan(java.util.Date date);
}
