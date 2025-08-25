package com.bbapi.money_api.controller;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bbapi.money_api.entity.HistoryItem;
import com.bbapi.money_api.entity.HistoryItemId;
import com.bbapi.money_api.helper_classes.NetWorthCalculator;
import com.bbapi.money_api.service.HistoryItemService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;


@CrossOrigin
@RestController
@RequestMapping("/historyItem")
public class HistoryItemController {

    private final HistoryItemService historyItemService;
    private final NetWorthCalculator netWorthCalculator;

    public HistoryItemController(HistoryItemService historyItemService, NetWorthCalculator netWorthCalculator) {
        this.historyItemService = historyItemService;
        this.netWorthCalculator = netWorthCalculator;
    }

    @GetMapping()
    public List<HistoryItem> getAllHistoryItems() {
        return historyItemService.getAllHistoryItems();
    }

    @GetMapping("/{ticker}/{timestamp}")
    public HistoryItem getHistoryItemById(@PathVariable String ticker,  @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date timestamp) {
        return historyItemService.getHistoryItemById(ticker, timestamp);
    }

    @PostMapping()
        public ResponseEntity<HistoryItem> addHistoryItem(@RequestBody HistoryItem entity) {
        HistoryItem saved = historyItemService.addHistoryItem(entity);
        Calendar cal = Calendar.getInstance();
        cal.setTime(entity.getTimestamp());
        netWorthCalculator.calculateNetWorth(cal);
        return ResponseEntity.status(201).body(saved);
    }

    //updateHistoryItem

    @DeleteMapping("/{id}")
    public void deleteHistoryItem(@PathVariable HistoryItemId id) {
        historyItemService.deleteHistoryItem(id);
    }

    
    
}
