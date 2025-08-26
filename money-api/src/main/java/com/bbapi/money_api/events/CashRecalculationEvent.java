package com.bbapi.money_api.events;

import org.springframework.context.ApplicationEvent;

public class CashRecalculationEvent extends ApplicationEvent {
    private final String trigger;

    public CashRecalculationEvent(Object source, String trigger) {
        super(source);
        this.trigger = trigger;
    }

    public String getTrigger() {
        return trigger;
    }
}