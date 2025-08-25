package com.bbapi.money_api.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bbapi.money_api.entity.NetWorth;
import com.bbapi.money_api.service.CashService;
import com.bbapi.money_api.service.NetWorthService;

@CrossOrigin
@RestController
@RequestMapping("/cash")
public class CashController {
    
    private final CashService cashService;

    public CashController(CashService cashService) {
        this.cashService = cashService;
    }

    @GetMapping()
    public List<NetWorth> getAllCash() {
        return cashService.getAllCashEntries();
    }

    @GetMapping("/{id}")
    public NetWorth getCashById(@RequestParam LocalDateTime id) {
        return cashService.getCashById(id);
    }

    @PostMapping(path = "/add")
    public NetWorth addCash(@RequestBody NetWorth entity) {
        return cashService.addCash(entity);
    }



    @DeleteMapping("/{id}")
    public void deletCash(@PathVariable LocalDateTime id) {
        cashService.deleteCash(id);
    }

}
