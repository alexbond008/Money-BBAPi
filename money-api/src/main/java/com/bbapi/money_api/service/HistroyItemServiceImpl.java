package com.bbapi.money_api.service;

import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Service;

import com.bbapi.money_api.entity.HistoryItem;
import com.bbapi.money_api.entity.HistoryItemId;
import com.bbapi.money_api.repository.HistoryItemRepository;

@Service
public class HistroyItemServiceImpl implements HistoryItemService {
    
    private HistoryItemRepository historyItemRepository;

    public HistroyItemServiceImpl(HistoryItemRepository historyItemRepository) {
        this.historyItemRepository = historyItemRepository;
    }

    @Override
    public List<HistoryItem> getAllHistoryItems() {
        return historyItemRepository.findAll();
    }
    @Override
    public HistoryItem getHistoryItemById(HistoryItemId id) {
        return historyItemRepository.findById(id).orElse(null);
    }

    @Override
    public HistoryItem addHistoryItem(HistoryItem historyItem) {
        return historyItemRepository.save(historyItem);
    }

    @Override
    public void deleteHistoryItem(HistoryItemId id) {
        historyItemRepository.deleteById(id);
    }

    @Override
    public List<HistoryItem> getAllHistoryItemsOlderThan(Date date) {
        return historyItemRepository.getOlderThan(date);    
    }
}
