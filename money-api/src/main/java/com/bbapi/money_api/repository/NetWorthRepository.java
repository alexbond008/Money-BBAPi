package com.bbapi.money_api.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.bbapi.money_api.entity.HistoryItem;
import com.bbapi.money_api.entity.NetWorth;

import jakarta.transaction.Transactional;

@Repository
public interface NetWorthRepository extends JpaRepository<NetWorth, LocalDateTime>{
    
    @Transactional
    @Modifying
    @Query("DELETE FROM NetWorth n WHERE n.calculatedAt >= ?1") 
    public void deleteAllNewerThan(LocalDateTime date);

    
    Optional<NetWorth> findTopByOrderByCalculatedAtDesc();
}
