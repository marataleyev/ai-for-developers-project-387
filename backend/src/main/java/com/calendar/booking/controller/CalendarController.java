package com.calendar.booking.controller;

import com.calendar.booking.dto.SlotDTO;
import com.calendar.booking.service.CalendarService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/calendar")
@RequiredArgsConstructor
public class CalendarController {
    
    private final CalendarService calendarService;
    
    @GetMapping("/slots")
    public ResponseEntity<List<SlotDTO>> getSlots(
            @RequestParam String eventTypeId,
            @RequestParam Instant from,
            @RequestParam Instant to) {
        return ResponseEntity.ok(calendarService.getSlots(eventTypeId, from, to));
    }
}
