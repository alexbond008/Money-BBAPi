package com.bbapi.money_api.entity;

import java.util.Date;

import jakarta.persistence.Entity;
@Entity

public class NetWorth {
    private Date timeStamp;
    private Integer NetWorth;

    public NetWorth() {
    }

    public NetWorth(Date timeStamp, Integer netWorth) {
        this.timeStamp = timeStamp;
        NetWorth = netWorth;
    }

    public Date getTimeStamp() {
        return timeStamp;
    }

    public void setTimeStamp(Date timeStamp) {
        this.timeStamp = timeStamp;
    }

    public Integer getNetWorth() {
        return NetWorth;
    }

    public void setNetWorth(Integer netWorth) {
        NetWorth = netWorth;
    }
    
}

