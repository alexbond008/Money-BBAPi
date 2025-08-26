package com.bbapi.money_api.controller;

import java.util.Date;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bbapi.money_api.entity.StockPrice;
import com.bbapi.money_api.entity.StockPriceId;
import com.bbapi.money_api.service.StockPriceService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;





@CrossOrigin
@RestController
@RequestMapping("/stockPrice")
public class StockPriceController {

    private final StockPriceService stockPriceService;

    public StockPriceController(StockPriceService stockPriceService) {
        this.stockPriceService = stockPriceService;
    }

    @GetMapping()
    public List<StockPrice> getAllStockPrices() {
        return stockPriceService.getAllStockPrices();
    }

    @GetMapping("/latest")
    public List<StockPrice> getLatestStockPrices() {
        return stockPriceService.getLatestStockPrices();
    }

    @GetMapping("path")
    public String getMethodName(@RequestParam String param) {
        return new String();
    }
    

    @GetMapping("/{ticker}/{timestamp}")
    public StockPrice getStockPriceById(@PathVariable String ticker, @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date timestamp) {
        return stockPriceService.getStockPriceById(ticker, timestamp);
    }

    @PostMapping()
    public StockPrice addStockPrice(@RequestBody StockPrice entity) {
        return stockPriceService.addStockPrice(entity);
    }

    @DeleteMapping("/{id}")
    public void deleteStockPrice(@PathVariable StockPriceId id) {
        stockPriceService.deleteStockPrice(id);
    }
    
    
    
}
