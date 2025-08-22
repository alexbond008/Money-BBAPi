package com.bbapi.money_api.service;

import java.util.List;

import com.bbapi.money_api.entity.StockPrice;
import com.bbapi.money_api.entity.StockPriceId;

public interface StockPriceService {

    public List<StockPrice> getAllStockPrices();
    public StockPrice getStockPriceById(StockPriceId id);
    public StockPrice getLatestStockPriceById(StockPriceId id);
    public StockPrice addStockPrice(StockPrice stockPrice);

    // public StockPrice updateStockPrice(StockPrice stockPrice);

    public void deleteStockPrice(StockPriceId id);
} 
