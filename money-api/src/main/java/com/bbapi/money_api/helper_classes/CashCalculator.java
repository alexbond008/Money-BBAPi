package com.bbapi.money_api.helper_classes;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

import com.bbapi.money_api.entity.HistoryItem;
import com.bbapi.money_api.entity.NetWorth;
import com.bbapi.money_api.service.CashService;
import com.bbapi.money_api.service.HistoryItemService;

public class CashCalculator {
        private CashService cashService;

        private HistoryItemService historyItemService;

        private Logger logger = LoggerFactory.getLogger(CashCalculator.class);


        @EventListener(ApplicationReadyEvent.class)
        public void doSomethingAfterStartup() {

            Calendar startDate = new GregorianCalendar(2024,8,7);
            Calendar currentDate = new GregorianCalendar();
            Calendar i = new GregorianCalendar(startDate.get(Calendar.YEAR),startDate.get(Calendar.MONTH),startDate.get(Calendar.DAY_OF_MONTH));
            do {
                List<HistoryItem> historyItems = historyItemService.getAllCashHistoryItemsOlderThan(i.getTime());
                Integer currentCash = 0;
                for (HistoryItem historyItem : historyItems) {
                    currentCash += historyItem.getQuantity();
                }
                cashService.addCash(new NetWorth(LocalDateTime.ofInstant(i.toInstant(), ZoneId.systemDefault()), currentCash));
                // logger.info(groupedByTicker.toString());
                i.add(Calendar.WEEK_OF_YEAR, 1);
            } while (i.before(currentDate));
            
            
            
            // netWorthService.getAllNetWorths();
            // stockPriceService.getAllStockPrices();
            // List<HistoryItem> historyItemService.getAllHistoryItemsOlderThan(startDate.getTime());
        logger.info("App started;");
        // logger.info(historyItemService.getAllHistoryItemsOlderThan(currentDate.getTime()).toString());
    }
}
