package com.bbapi.money_api.helper_classes;

public class PortfolioItem {
    private String ticker;
    private int quantity;
    private Integer avgPrice;
    private Integer currentPrice;

    public PortfolioItem() {
    }

    public PortfolioItem(String ticker, int quantity, Integer avgPrice, Integer currentPrice) {
        this.ticker = ticker;
        this.quantity = quantity;
        this.avgPrice = avgPrice;
        this.currentPrice = currentPrice;
    }
    
    public String getTicker() {
        return ticker;
    }
    public void setTicker(String ticker) {
        this.ticker = ticker;
    }
    public int getQuantity() {
        return quantity;
    }
    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
    public Integer getAvgPrice() {
        return avgPrice;
    }
    public void setAvgPrice(Integer avgPrice) {
        this.avgPrice = avgPrice;
    }
    public Integer getCurrentPrice() {
        return currentPrice;
    }
    public void setCurrentPrice(Integer currentPrice) {
        this.currentPrice = currentPrice;
    }


    
}
