package com.calendar.booking.service;

import com.calendar.booking.exception.SlotUnavailableException;
import com.calendar.booking.model.Booking;
import com.calendar.booking.model.EventType;
import com.calendar.booking.repository.BookingRepository;
import com.calendar.booking.repository.EventTypeRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookingService {
    
    private final BookingRepository bookingRepository;
    private final EventTypeRepository eventTypeRepository;
    
    public List<Booking> getAll() {
        return bookingRepository.findAll();
    }
    
    public Booking getById(String id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Booking not found: " + id));
    }
    
    public Booking create(Booking booking) {
        // Validate event type exists
        EventType eventType = eventTypeRepository.findById(booking.getEventTypeId())
                .orElseThrow(() -> new EntityNotFoundException("Event type not found: " + booking.getEventTypeId()));
        
        // Validate start time is within 14 days window
        Instant now = Instant.now();
        Instant maxDate = now.plus(Duration.ofDays(14));
        if (booking.getStartTime().isBefore(now) || booking.getStartTime().isAfter(maxDate)) {
            throw new IllegalArgumentException("Booking must be within the next 14 days");
        }
        
        // Check slot availability
        if (bookingRepository.findByStartTime(booking.getStartTime()).isPresent()) {
            throw new SlotUnavailableException("This slot is already booked");
        }
        
        // Set derived fields
        booking.setId(UUID.randomUUID().toString());
        booking.setEndTime(booking.getStartTime().plus(Duration.ofMinutes(eventType.getDuration())));
        booking.setCreatedAt(Instant.now());
        
        return bookingRepository.save(booking);
    }
    
    public void delete(String id) {
        if (!bookingRepository.existsById(id)) {
            throw new EntityNotFoundException("Booking not found: " + id);
        }
        bookingRepository.deleteById(id);
    }
}
