package com.bbapi.money_api.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.bbapi.money_api.entity.CashWorth;
import com.bbapi.money_api.repository.CashRepository;
@Service
public class CashServiceImpl implements CashService{
     
    private CashRepository cashRepository;
    
    public CashServiceImpl(CashRepository cashRepository) {
        this.cashRepository = cashRepository;

    }

    @Override
    public List<CashWorth> getAllCashEntries() {
        return cashRepository.findAll();
    }

    @Override
    public CashWorth addCash(CashWorth cashWorth) {
        return cashRepository.save(cashWorth);
    }

    @Override
    public CashWorth getCashById(LocalDateTime id) {
        return cashRepository.findById(id).orElse(null);
    }

    @Override
    public void deleteCash(LocalDateTime id) {
        cashRepository.deleteById(id);
    }

    @Override
    public CashWorth getLatestCashById(LocalDateTime id) {
        // try <= given timestamp, else absolute latest
        return cashRepository.findLatestById(id)
                .orElseGet(() -> cashRepository.findTopByOrderByCalculatedAtDesc().orElse(null));
    }

    @Override
    public CashWorth getLatestCash() {
        return cashRepository.findTopByOrderByCalculatedAtDesc().orElse(null);
    }

    @Override
    public void deleteAllCash() {
        cashRepository.deleteAll();
    }
}
