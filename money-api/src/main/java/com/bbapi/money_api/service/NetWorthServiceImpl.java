package com.bbapi.money_api.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

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
        return netWorthRepository.save(netWorth);
    }

    // @Override
    // public NetWorth updateNetWorth(NetWorth netWorth) {
        
    // }

    @Override
    public void deleteNetWorth(LocalDateTime id) {
        netWorthRepository.deleteById(id);
    }

    
}
