package com.bbapi.money_api.entity;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;

@Entity
@IdClass(HistoryItemId.class)
public class HistoryItem {
    @Id
    private String ticker;
    private Integer quantity;
    private Integer price;
    @Id
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
