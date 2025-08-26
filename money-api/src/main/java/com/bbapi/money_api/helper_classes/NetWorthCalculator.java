package com.bbapi.money_api.helper_classes;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import com.bbapi.money_api.entity.HistoryItem;
import com.bbapi.money_api.entity.NetWorth;
import com.bbapi.money_api.entity.StockPriceId;
import com.bbapi.money_api.service.CashService;
import com.bbapi.money_api.service.HistoryItemService;
import com.bbapi.money_api.service.NetWorthService;
import com.bbapi.money_api.service.StockPriceService;

@Component
public class NetWorthCalculator {
        private NetWorthService netWorthService;
        private StockPriceService stockPriceService;
        private HistoryItemService historyItemService;

        private Logger logger = LoggerFactory.getLogger(NetWorthCalculator.class);

        public NetWorthCalculator(NetWorthService netWorthService, StockPriceService stockPriceService,
                HistoryItemService historyItemService) {
            this.netWorthService = netWorthService;
            this.stockPriceService = stockPriceService;
            this.historyItemService = historyItemService;
        }

        @EventListener(ApplicationReadyEvent.class)
        public void doSomethingAfterStartup() {
            calculateNetWorth(new GregorianCalendar(2024,8,7));
        }

        public void calculateNetWorth(Calendar startDate) {
            netWorthService.deleteAllNetWorthsNewerThan(LocalDateTime.ofInstant(startDate.toInstant(), ZoneId.systemDefault()));
            Calendar currentDate = new GregorianCalendar();
            Calendar i = new GregorianCalendar(startDate.get(Calendar.YEAR),startDate.get(Calendar.MONTH),startDate.get(Calendar.DAY_OF_MONTH));
            do {
                List<HistoryItem> historyItems = historyItemService.getAllHistoryItemsOlderThan(i.getTime());
                Map<String, List<HistoryItem>> groupedByTicker = historyItems.stream().collect(Collectors.groupingBy(HistoryItem::getTicker));
                Integer currentNetWorth = 0;
                for (String key : groupedByTicker.keySet()) {
                    if (key.equals(CashService.CASH_TICKER)) {
                        //currentNetWorth += groupedByTicker.get(key).stream().mapToInt(HistoryItem::getQuantity).sum();
                        continue;
                    }
                    Integer quantity = groupedByTicker.get(key).stream().mapToInt(HistoryItem::getQuantity).sum();
                    Integer price  = stockPriceService.getLatestStockPriceById(new StockPriceId(key, i.getTime())).getPrice();
                    currentNetWorth += quantity*price;
                    // logger.info(key+" : "+quantity+" * "+price+" = "+(quantity*price));
                    // for (HistoryItem historyItem : groupedByTicker.get(key).stream().sorted((h1, h2) -> h2.getTimestamp().compareTo(h1.getTimestamp())).collect(Collectors.toList())) {
                    //     logger.info(key+historyItem.getTimestamp().toString());
                        
                    // }
                    
                }
                netWorthService.addNetWorth(new NetWorth(LocalDateTime.ofInstant(i.toInstant(), ZoneId.systemDefault()), currentNetWorth));
                // logger.info(groupedByTicker.toString());
                if(ChronoUnit.DAYS.between(i.toInstant(), currentDate.toInstant())<2){i.add(Calendar.MINUTE, 15);}
                else if(ChronoUnit.DAYS.between(i.toInstant(), currentDate.toInstant())<7){i.add(Calendar.HOUR, 4);}
                else if(ChronoUnit.DAYS.between(i.toInstant(), currentDate.toInstant())<30){i.add(Calendar.DAY_OF_YEAR, 1);}
                else{ i.add(Calendar.DAY_OF_YEAR, 7); }
            } while (i.before(currentDate));
            
            
            
            // netWorthService.getAllNetWorths();
            // stockPriceService.getAllStockPrices();
            // List<HistoryItem> historyItemService.getAllHistoryItemsOlderThan(startDate.getTime());
        logger.info("Net Worth started;");
        // logger.info(historyItemService.getAllHistoryItemsOlderThan(currentDate.getTime()).toString());
    }
}
