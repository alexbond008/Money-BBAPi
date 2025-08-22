package com.bbapi.money_api.service;

import java.util.List;

import com.bbapi.money_api.entity.HistoryItem;
import com.bbapi.money_api.helper_classes.PortfolioItem;
import com.bbapi.money_api.repository.HistoryItemRepository;

public class PortfolioServiceImpl implements PortfolioService {

    private HistoryItemRepository historyItemRepository;

    @Override
    public List<PortfolioItem> getAllPortfolioItems() {
        List<HistoryItem> historyItems = historyItemRepository.findAll();
        String[] tickers = {"AAPL"};
        Integer currentPrice = 150; // This should be fetched from a real-time stock price service
        for (String ticker : tickers) {
            int totalQuantity = 0;
            int totalSpent = 0;
            for (HistoryItem item : historyItems) {
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
                return List.of(portfolioItem);
            }
        }
        return List.of();
    }
    
}
