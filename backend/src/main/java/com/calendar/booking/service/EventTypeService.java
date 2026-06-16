package com.calendar.booking.service;

import com.calendar.booking.model.EventType;
import com.calendar.booking.repository.EventTypeRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventTypeService {
    
    private final EventTypeRepository eventTypeRepository;
    
    public List<EventType> getAll() {
        return eventTypeRepository.findAll();
    }
    
    public EventType getById(String id) {
        return eventTypeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Event type not found: " + id));
    }
    
    public EventType create(EventType eventType) {
        return eventTypeRepository.save(eventType);
    }
}
