package com.bbapi.money_api.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bbapi.money_api.entity.StockPrice;
import com.bbapi.money_api.entity.StockPriceId;
import com.bbapi.money_api.service.StockPriceService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;




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

    @GetMapping("/{id}")
    public StockPrice getStockPriceById(@RequestParam StockPriceId id) {
        return stockPriceService.getStockPriceById(id);
    }

    @PostMapping()
    public StockPrice addStockPrice(@RequestBody StockPrice entity) {
        return stockPriceService.addStockPrice(entity);
    }

    // @PutMapping("/{id}")
    // public StockPrice updateStockPrice(@PathVariable StockPriceId id, @RequestBody StockPrice entity) {
        
    // }

    @DeleteMapping("/{id}")
    public void deleteStockPrice(@PathVariable StockPriceId id) {
        stockPriceService.deleteStockPrice(id);
    }
    
    
    
}
