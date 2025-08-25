package com.bbapi.money_api.service;

import java.time.LocalDateTime;
import java.util.List;

import com.bbapi.money_api.entity.NetWorth;

public interface NetWorthService {

    public List<NetWorth> getAllNetWorths();
    public NetWorth getNetWorthById(LocalDateTime id);
    public NetWorth addNetWorth(NetWorth netWorth);
    // public NetWorth updateNetWorth(NetWorth netWorth);
    public void deleteNetWorth(LocalDateTime id);    
    public void deleteAllNetWorthsNewerThan(LocalDateTime date);
} 
