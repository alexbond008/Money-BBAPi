package com.bbapi.money_api.repository;

import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bbapi.money_api.entity.NetWorth;

@Repository
public interface CashRepository extends JpaRepository<NetWorth, LocalDateTime> {

    
}
