package com.bbapi.money_api.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bbapi.money_api.entity.HistoryItem;
import com.bbapi.money_api.helper_classes.PortfolioItem;
import com.bbapi.money_api.repository.HistoryItemRepository;
import com.bbapi.money_api.repository.StockPriceRepository;

@Service
public class PortfolioServiceImpl implements PortfolioService {
    @Autowired
    private HistoryItemRepository historyItemRepository;
    private StockPriceRepository stockPriceRepository;

    private Logger logger = LoggerFactory.getLogger(PortfolioServiceImpl.class);

    public PortfolioServiceImpl(HistoryItemRepository historyItemRepository, StockPriceRepository stockPriceRepository) {
        this.stockPriceRepository = stockPriceRepository;
        this.historyItemRepository = historyItemRepository;
    }

    @Override
    public List<PortfolioItem> getAllPortfolioItems() {
        List<HistoryItem> historyItems = historyItemRepository.findAll();
        List<PortfolioItem> portfolioItems = new ArrayList<>();
        String[] tickers = {"AAPL", "META", "NVDA", "MSFT", "AMZN"};
        for (String ticker : tickers) {
            logger.info("Processing ticker: " + ticker);
            Integer currentPrice = stockPriceRepository.findLatestById(ticker, new Date()).orElse(null).getPrice();
            int totalQuantity = 0;
            int totalSpent = 0;
            for (HistoryItem item : historyItems) {
                logger.info("Checking history item: " + item.getTicker() + " with quantity " + item.getQuantity() + " and price " + item.getPrice());
                if (item.getTicker().equals(ticker)) {
                    if (item.getQuantity()>0) {
                        totalQuantity += item.getQuantity();
                        totalSpent += item.getPrice() * item.getQuantity();
                    } else if (item.getQuantity()<0) {
                        totalQuantity -= item.getQuantity();
                        totalSpent -= item.getPrice() * item.getQuantity();
                    }
                }
            }
            if (totalQuantity > 0) {
                int avgPrice = totalSpent / totalQuantity;
                PortfolioItem portfolioItem = new PortfolioItem(ticker, totalQuantity, avgPrice, currentPrice);
                portfolioItems.add(portfolioItem);
            }
        }
        return portfolioItems;
    }
    
}
