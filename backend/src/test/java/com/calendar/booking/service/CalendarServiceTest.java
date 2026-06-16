package com.calendar.booking.service;

import com.calendar.booking.dto.SlotDTO;
import com.calendar.booking.model.Booking;
import com.calendar.booking.model.EventType;
import com.calendar.booking.repository.BookingRepository;
import com.calendar.booking.repository.EventTypeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Duration;
import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CalendarServiceTest {
    
    @Mock
    private EventTypeRepository eventTypeRepository;
    
    @Mock
    private BookingRepository bookingRepository;
    
    @InjectMocks
    private CalendarService calendarService;
    
    private EventType eventType;
    private Instant from;
    private Instant to;
    
    @BeforeEach
    void setUp() {
        eventType = new EventType("1", "Test", 30, "Description");
        from = Instant.now();
        to = from.plus(Duration.ofHours(2));
    }
    
    @Test
    void getSlots_ShouldReturnAvailableSlots() {
        when(eventTypeRepository.findById("1")).thenReturn(Optional.of(eventType));
        when(bookingRepository.findByStartTimeBetween(from, to)).thenReturn(Collections.emptyList());
        
        List<SlotDTO> slots = calendarService.getSlots("1", from, to);
        
        assertNotNull(slots);
        assertFalse(slots.isEmpty());
        assertTrue(slots.get(0).getIsAvailable());
    }
    
    @Test
    void getSlots_ShouldMarkBookedSlotsAsUnavailable() {
        Booking booking = new Booking("1", "1", from, from.plus(Duration.ofMinutes(30)), "Guest", "email@test.com", Instant.now());
        
        when(eventTypeRepository.findById("1")).thenReturn(Optional.of(eventType));
        when(bookingRepository.findByStartTimeBetween(from, to)).thenReturn(List.of(booking));
        
        List<SlotDTO> slots = calendarService.getSlots("1", from, to);
        
        assertNotNull(slots);
        assertFalse(slots.isEmpty());
        assertFalse(slots.get(0).getIsAvailable());
    }
}
