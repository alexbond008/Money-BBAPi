package com.bbapi.money_api.entity;

import java.util.Date;

import jakarta.persistence.Entity;

@Entity
public class HistoryItem {
    private String ticker;
    private Integer quantity;
    private Integer price;
    private Date timestamp;

    public HistoryItem() {
    }

    public HistoryItem(String ticker, Integer quantity, Integer price, Date timestamp) {
        this.ticker = ticker;
        this.quantity = quantity;
        this.price = price;
        this.timestamp = timestamp;
    }

    // getters and setters
    public String getTicker() {
        return ticker;
    }

    public void setTicker(String ticker) {
        this.ticker = ticker;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }
    
}
