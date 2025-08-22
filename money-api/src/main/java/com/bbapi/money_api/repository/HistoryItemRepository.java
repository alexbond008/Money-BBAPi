package com.bbapi.money_api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bbapi.money_api.entity.HistoryItem;

@Repository
public interface HistoryItemRepository extends JpaRepository<HistoryItem, Long> {
    
}
