package com.bbapi.money_api.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.bbapi.money_api.entity.NetWorth;
import com.bbapi.money_api.repository.CashRepository;
@Service
public class CashServiceImpl implements CashService{
     
    private CashRepository cashRepository;
    
    public CashServiceImpl(CashRepository cashRepository) {
        this.cashRepository = cashRepository;

    }

    @Override
    public List<NetWorth> getAllCashEntries() {
        return cashRepository.findAll();
    }

    @Override
    public NetWorth addCash(NetWorth netWorth) {
        return cashRepository.save(netWorth);
    }

    @Override
    public NetWorth getCashById(LocalDateTime id) {
        return cashRepository.findById(id).orElse(null);
    }

    @Override
    public void deleteCash(LocalDateTime id) {
        cashRepository.deleteById(id);
    }

    

    
}
