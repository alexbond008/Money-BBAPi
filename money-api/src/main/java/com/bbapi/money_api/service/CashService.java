package com.bbapi.money_api.service;

import java.time.LocalDateTime;
import java.util.List;

import com.bbapi.money_api.entity.CashWorth;

public interface CashService {
    public static final String CASH_TICKER = "MONEY";

    public List<CashWorth> getAllCashEntries();
    public CashWorth addCash(CashWorth CashWorth);
    public CashWorth getCashById(LocalDateTime id);
    // public CashWorth updateNetWorth(CashWorth CashWorth);
    public void deleteCash(LocalDateTime id);    
} 
