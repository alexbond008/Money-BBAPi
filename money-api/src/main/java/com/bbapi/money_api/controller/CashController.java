package com.bbapi.money_api.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bbapi.money_api.entity.CashWorth;
import com.bbapi.money_api.service.CashService;

@CrossOrigin
@RestController
@RequestMapping("/cash")
public class CashController {
    
    private final CashService cashService;

    public CashController(CashService cashService) {
        this.cashService = cashService;
    }

    @GetMapping()
    public List<CashWorth> getAllCash() {
        return cashService.getAllCashEntries();
    }

    @GetMapping("/{id}")
    public CashWorth getCashById(@PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime id) {
        return cashService.getCashById(id);
    }

    @GetMapping("/latest/{id}")
    public CashWorth getLatestCashById(@PathVariable LocalDateTime id) {
        return cashService.getLatestCashById(id);
    }

    @PostMapping(path = "/add")
    public CashWorth addCash(@RequestBody CashWorth entity) {
        return cashService.addCash(entity);
    }



    @DeleteMapping("/{id}")
    public void deletCash(@PathVariable LocalDateTime id) {
        cashService.deleteCash(id);
    }

}
