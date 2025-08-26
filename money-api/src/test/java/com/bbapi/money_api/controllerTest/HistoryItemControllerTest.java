package com.bbapi.money_api.controllerTest;

import com.bbapi.money_api.controller.HistoryItemController;
import com.bbapi.money_api.entity.HistoryItem;
import com.bbapi.money_api.entity.HistoryItemId;
import com.bbapi.money_api.helper_classes.CashCalculator;
import com.bbapi.money_api.helper_classes.NetWorthCalculator;
import com.bbapi.money_api.service.HistoryItemService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;

import java.time.Instant;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.TimeZone;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * MVC tests (HTTP layer) + one direct method test for delete (composite id binding not exposed via path easily).
 */
@WebMvcTest(controllers = HistoryItemController.class)
class HistoryItemControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private HistoryItemService historyItemService;

    @MockBean
    private NetWorthCalculator netWorthCalculator;

    @MockBean
    private CashCalculator cashCalculator;

    private HistoryItem sample;
    private Date sampleDate;

    @BeforeEach
    void setup() {
        sampleDate = Date.from(Instant.parse("2025-08-26T09:47:01Z"));
        sample = new HistoryItem("AAPL", 10, 12345, sampleDate);
    }

    @Test
    void getAllHistoryItems_returnsList() throws Exception {
        when(historyItemService.getAllHistoryItems()).thenReturn(Arrays.asList(sample));

        mockMvc.perform(get("/historyItem"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].ticker").value("AAPL"))
                .andExpect(jsonPath("$[0].price").value(12345))
                .andExpect(jsonPath("$[0].quantity").value(10));

        verify(historyItemService).getAllHistoryItems();
        verifyNoInteractions(netWorthCalculator, cashCalculator);
    }

    @Test
    void getHistoryItemById_returnsItem() throws Exception {
        when(historyItemService.getHistoryItemById(eq("AAPL"), any(Date.class))).thenReturn(sample);

        mockMvc.perform(get("/historyItem/AAPL/2025-08-26T09:47:01Z"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.ticker").value("AAPL"))
                .andExpect(jsonPath("$.price").value(12345));

        verify(historyItemService).getHistoryItemById(eq("AAPL"), any(Date.class));
    }


    @Test
    void deleteHistoryItem_callsService_directInvocation() {
        // Direct method call (path binding for composite id not practical)
        HistoryItemId id = new HistoryItemId("AAPL", sampleDate);
        HistoryItemController controller = new HistoryItemController(historyItemService, netWorthCalculator, cashCalculator);
        controller.deleteHistoryItem(id);
        verify(historyItemService).deleteHistoryItem(id);
        verifyNoInteractions(netWorthCalculator, cashCalculator);
    }
}
