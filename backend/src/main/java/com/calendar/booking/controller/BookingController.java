package com.calendar.booking.controller;

import com.calendar.booking.model.Booking;
import com.calendar.booking.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
public class BookingController {
    
    private final BookingService bookingService;
    
    @GetMapping
    public ResponseEntity<List<Booking>> getAll() {
        return ResponseEntity.ok(bookingService.getAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Booking> getById(@PathVariable String id) {
        return ResponseEntity.ok(bookingService.getById(id));
    }
    
    @PostMapping
    public ResponseEntity<Booking> create(@RequestBody Booking booking) {
        return ResponseEntity.ok(bookingService.create(booking));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        bookingService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
