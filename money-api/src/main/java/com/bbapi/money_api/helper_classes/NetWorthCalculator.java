package com.bbapi.money_api.helper_classes;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import com.bbapi.money_api.service.NetWorthService;
import com.bbapi.money_api.service.StockPriceService;

@Component
public class NetWorthCalculator {
        private NetWorthService netWorthService;
        private StockPriceService stockPriceService;
        // private HistoryItemService historyItemService;

        private Logger logger = LoggerFactory.getLogger(NetWorthCalculator.class);

        public NetWorthCalculator(NetWorthService netWorthService, StockPriceService stockPriceService) {
            this.netWorthService = netWorthService;
            this.stockPriceService = stockPriceService;
        }

        @EventListener(ApplicationReadyEvent.class)
        public void doSomethingAfterStartup() {
            netWorthService.getAllNetWorths();
            stockPriceService.getAllStockPrices();
        logger.info("App started;");
    }
}
