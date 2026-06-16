package com.calendar.booking.controller;

import com.calendar.booking.model.EventType;
import com.calendar.booking.service.EventTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/event-types")
@RequiredArgsConstructor
public class EventTypeController {
    
    private final EventTypeService eventTypeService;
    
    @GetMapping
    public ResponseEntity<List<EventType>> getAll() {
        return ResponseEntity.ok(eventTypeService.getAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<EventType> getById(@PathVariable String id) {
        return ResponseEntity.ok(eventTypeService.getById(id));
    }
    
    @PostMapping
    public ResponseEntity<EventType> create(@RequestBody EventType eventType) {
        return ResponseEntity.ok(eventTypeService.create(eventType));
    }
}
