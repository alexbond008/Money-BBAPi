package com.bbapi.money_api.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.bbapi.money_api.entity.StockPrice;
import com.bbapi.money_api.entity.StockPriceId;
import com.bbapi.money_api.repository.StockPriceRepository;

@Service
public class StockPriceServiceImpl implements StockPriceService {

    private StockPriceRepository stockPriceRepository;

    public StockPriceServiceImpl(StockPriceRepository stockPriceRepository) {
        this.stockPriceRepository = stockPriceRepository;
    }

    @Override
    public List<StockPrice> getAllStockPrices() {
        return stockPriceRepository.findAll();
    }

    @Override
    public StockPrice getStockPriceById(StockPriceId id) {
        return stockPriceRepository.findById(id).orElse(null);
    }

    @Override
    public StockPrice getLatestStockPriceById(StockPriceId id) {
        return stockPriceRepository.findLatestById(id.getTicker(), id.getTimestamp()).orElse(null);
    }

    @Override
    public StockPrice addStockPrice(StockPrice stockPrice) {
        return stockPriceRepository.save(stockPrice);
    }

    // @Override
    // public StockPrice updateStockPrice(StockPrice stockPrice) {
    //     return stockPriceRepository.save(stockPrice);
    // }

    @Override
    public void deleteStockPrice(StockPriceId id) {
        stockPriceRepository.deleteById(id);
    }

}
