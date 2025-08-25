package com.bbapi.money_api.service;

import java.time.LocalDateTime;
import java.util.List;

import com.bbapi.money_api.entity.NetWorth;

public interface CashService {
    public static final String CASH_TICKER = "MONEY";

    public List<NetWorth> getAllCashEntries();
    public NetWorth addCash(NetWorth netWorth);
    public NetWorth getCashById(LocalDateTime id);
    // public NetWorth updateNetWorth(NetWorth netWorth);
    public void deleteCash(LocalDateTime id);    
} 
