package com.bbapi.money_api.service;
import java.util.Date;
import java.util.List;

import com.bbapi.money_api.entity.HistoryItem;
import com.bbapi.money_api.entity.HistoryItemId;

public interface HistoryItemService {

    public List<HistoryItem> getAllHistoryItems();
    public HistoryItem getHistoryItemById(HistoryItemId id);

    public HistoryItem addHistoryItem(HistoryItem historyItem);

    // public String updateHistoryItem(String historyItem);

    public void deleteHistoryItem(HistoryItemId id);

    public List<HistoryItem> getAllHistoryItemsOlderThan(Date date);

}
