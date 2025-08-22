package com.bbapi.money_api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bbapi.money_api.entity.NetWorth;

@Repository
public interface NetWorthRepository extends JpaRepository<NetWorth, Long>{
    
}
