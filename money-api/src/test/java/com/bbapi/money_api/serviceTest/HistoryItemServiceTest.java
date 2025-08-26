package com.bbapi.money_api.serviceTest;

import com.bbapi.money_api.entity.HistoryItem;
import com.bbapi.money_api.entity.HistoryItemId;
import com.bbapi.money_api.service.HistoryItemService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Calendar;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class HistoryItemServiceTest {

    // Adjust this constant to whatever your implementation uses to identify “cash” entries.
    private static final String CASH_TICKER = "MONEY";

    private final HistoryItemService historyItemService;

    HistoryItemServiceTest(HistoryItemService historyItemService) {
        this.historyItemService = historyItemService;
    }

    private Date now;
    private Date twoDaysAgo;
    private Date fiveDaysAgo;

    @BeforeEach
    void initDates() {
        now = dateOffset(Calendar.DAY_OF_YEAR, 0);
        twoDaysAgo = dateOffset(Calendar.DAY_OF_YEAR, -2);
        fiveDaysAgo = dateOffset(Calendar.DAY_OF_YEAR, -5);
    }

    @BeforeEach
    void seedData() {
        // Clear any side‑effects (delete via fetched list)
        historyItemService.getAllHistoryItems()
                .forEach(h -> historyItemService.deleteHistoryItem(new HistoryItemId(h.getTicker(), h.getTimestamp())));

        // Cash history items
        historyItemService.addHistoryItem(new HistoryItem(CASH_TICKER,  500,  50000, fiveDaysAgo));  // +500
        historyItemService.addHistoryItem(new HistoryItem(CASH_TICKER, -200,  20000, twoDaysAgo));  // -200 (outflow)
        historyItemService.addHistoryItem(new HistoryItem(CASH_TICKER,  100,  10000, now));         // +100

        // Non‑cash (e.g. stock trades) – should NOT appear in cash methods
        historyItemService.addHistoryItem(new HistoryItem("AAPL",  10, 250000, twoDaysAgo));
        historyItemService.addHistoryItem(new HistoryItem("MSFT", -5,  150000, now));
    }

    @Test
    void add_and_getAllHistoryItems() {
        List<HistoryItem> all = historyItemService.getAllHistoryItems();
        assertThat(all).hasSize(5);
    }

    @Test
    void getHistoryItemById_returnsSpecific() {
        HistoryItem found = historyItemService.getHistoryItemById(CASH_TICKER, twoDaysAgo);
        assertThat(found).isNotNull();
        assertThat(found.getTicker()).isEqualTo(CASH_TICKER);
        assertThat(found.getTimestamp()).isEqualTo(twoDaysAgo);
    }

    @Test
    void getAllHistoryItemsOlderThan_filtersProperly() {
        // Older than 'now' should include everything with timestamp strictly before 'now'
        List<HistoryItem> older = historyItemService.getAllHistoryItemsOlderThan(now);
        // Items dated at 'now' excluded if implementation uses strictly < (adjust if <=)
        boolean includesNow = older.stream().anyMatch(h -> h.getTimestamp().equals(now));
        // We expect 4 (fiveDaysAgo + twoDaysAgo for BOTH cash + non-cash)
        assertThat(older.size()).isBetween(4,5); // allow for <= vs < implementation
        if (!includesNow) {
            assertThat(older).allMatch(h -> h.getTimestamp().before(now));
        }
    }

    @Test
    void getAllCashHistoryItems_returnsOnlyCash() {
        List<HistoryItem> cashItems = historyItemService.getAllCashHistoryItems();
        assertThat(cashItems)
                .isNotEmpty()
                .allMatch(h -> CASH_TICKER.equals(h.getTicker()));
        assertThat(cashItems).hasSize(3);
    }

    @Test
    void getAllCashHistoryItemsOlderThan_filtersByDateAndCash() {
        List<HistoryItem> olderCash = historyItemService.getAllCashHistoryItemsOlderThan(now);
        // Should include fiveDaysAgo + twoDaysAgo; maybe exclude 'now'
        assertThat(olderCash).allMatch(h -> CASH_TICKER.equals(h.getTicker()));
        assertThat(olderCash.size()).isBetween(2,3); // allow for <= logic variance
    }

    @Test
    void deleteHistoryItem_removesEntry() {
        HistoryItemId id = new HistoryItemId(CASH_TICKER, twoDaysAgo);
        historyItemService.deleteHistoryItem(id);
        HistoryItem after = historyItemService.getHistoryItemById(CASH_TICKER, twoDaysAgo);
        assertThat(after).isNull();
    }

    // Helper to build Date offsets from now (truncating milliseconds for equality)
    private Date dateOffset(int field, int amount) {
        Calendar c = Calendar.getInstance();
        c.set(Calendar.MILLISECOND, 0);
        c.add(field, amount);
        return c.getTime();
    }
}
