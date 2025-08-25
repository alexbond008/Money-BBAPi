package com.bbapi.money_api.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "cash_worth")
public class CashWorth {

    @Id
    @Column(nullable = false)
    private LocalDateTime calculatedAt;

    private Integer amount;

    public CashWorth() {}

    public CashWorth(LocalDateTime calculatedAt, Integer amount) {
        this.calculatedAt = calculatedAt;
        this.amount = amount;
    }

    public LocalDateTime getCalculatedAt() { return calculatedAt; }
    public void setCalculatedAt(LocalDateTime calculatedAt) { this.calculatedAt = calculatedAt; }
    public Integer getAmount() { return amount; }
    public void setAmount(Integer amount) { this.amount = amount; }
}
