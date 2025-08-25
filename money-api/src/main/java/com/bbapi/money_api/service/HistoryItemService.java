package com.bbapi.money_api.service;
import java.util.Date;
import java.util.List;

import com.bbapi.money_api.entity.HistoryItem;
import com.bbapi.money_api.entity.HistoryItemId;

public interface HistoryItemService {

    public List<HistoryItem> getAllHistoryItems();
    public HistoryItem getHistoryItemById(String ticker, Date timestamp);

    public HistoryItem addHistoryItem(HistoryItem historyItem);

    public List<HistoryItem> getAllCashHistoryItems();

    public List<HistoryItem> getAllCashHistoryItemsOlderThan(Date date);

    public void deleteHistoryItem(HistoryItemId id);

    public List<HistoryItem> getAllHistoryItemsOlderThan(Date date);

}
