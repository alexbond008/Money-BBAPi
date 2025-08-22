package com.bbapi.money_api.service;

import java.util.List;
import com.bbapi.money_api.helper_classes.PortfolioItem;

public interface PortfolioService {
    List<PortfolioItem> getAllPortfolioItems();
}
