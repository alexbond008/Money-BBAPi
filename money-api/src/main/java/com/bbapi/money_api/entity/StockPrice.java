package com.bbapi.money_api.entity;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
@Entity
@IdClass(StockPriceId.class)
public class StockPrice {    
    private Integer price;
    @Id
    private String ticker;
    @Id
    private Date timestamp;

    public StockPrice() {
    }

    public StockPrice(Integer price, String ticker, Date timestamp) {
        this.price = price;
        this.ticker = ticker;
        this.timestamp = timestamp;
    }

// getters and setters
    public Integer getPrice() {
        return price;
    }
    public void setPrice(Integer price) {
        this.price = price;
    }
    public String getTicker() {
        return ticker;
    }
    public void setTicker(String ticker) {
        this.ticker = ticker;
    }
    public Date getTimestamp() {
        return timestamp;
    }
    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }

}