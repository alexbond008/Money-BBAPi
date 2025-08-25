package com.bbapi.money_api.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bbapi.money_api.entity.CashWorth;
import com.bbapi.money_api.entity.NetWorth;
import com.bbapi.money_api.service.NetWorthService;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;



@CrossOrigin
@RestController
@RequestMapping("/netWorth")
public class NetWorthController {

    private final NetWorthService netWorthService;

    public NetWorthController(NetWorthService netWorthService) {
        this.netWorthService = netWorthService;
    }

    @GetMapping()
    public List<NetWorth> getAllNetWorths() {
        return netWorthService.getAllNetWorths();
    }

    @GetMapping("/{id}")
    public NetWorth getNetWorthById(@PathVariable("id") LocalDateTime id) {
        return netWorthService.getNetWorthById(id);
    }

    @GetMapping("/latest")
    public NetWorth getLatest() {
        return netWorthService.getLatestNetWorth();
    }

    @PostMapping()
    public NetWorth addNetWorth(@RequestBody NetWorth entity) {
        return netWorthService.addNetWorth(entity);
    }

    // @PutMapping("/{id}")
    // public NetWorth updateNetWorth(@PathVariable LocalDateTime id, @RequestBody NetWorth entity) {
    //
    // }

    @DeleteMapping("/{id}")
    public void deleteNetWorth(@PathVariable LocalDateTime id) {
        netWorthService.deleteNetWorth(id);
    }
    
}
