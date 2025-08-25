package com.bbapi.money_api.service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Service;

import com.bbapi.money_api.entity.CashWorth;
import com.bbapi.money_api.entity.NetWorth;
import com.bbapi.money_api.repository.NetWorthRepository;

@Service
public class NetWorthServiceImpl implements NetWorthService {

    private NetWorthRepository netWorthRepository;

    public NetWorthServiceImpl(NetWorthRepository netWorthRepository) {
        this.netWorthRepository = netWorthRepository;
    }

    @Override
    public List<NetWorth> getAllNetWorths() {
        return netWorthRepository.findAll();
    }

    @Override
    public NetWorth getNetWorthById(LocalDateTime id) {
        return netWorthRepository.findById(id).orElse(null);
    }

    @Override
    public NetWorth addNetWorth(NetWorth netWorth) {
        if (netWorth.getCalculatedAt() == null) {
            throw new IllegalArgumentException("calculatedAt (id) must not be null");
        }
        return netWorthRepository.save(netWorth);
    }

    // @Override
    // public NetWorth updateNetWorth(NetWorth netWorth) {
        
    // }

    @Override
    public void deleteNetWorth(LocalDateTime id) {
        netWorthRepository.deleteById(id);
    }

    @Override
    public void deleteAllNetWorthsNewerThan(LocalDateTime date) {
        netWorthRepository.deleteAllNewerThan(date);
    }

    @Override
    public NetWorth getLatestNetWorth() {
        return netWorthRepository.findTopByOrderByCalculatedAtDesc().orElse(null);
    }
}
