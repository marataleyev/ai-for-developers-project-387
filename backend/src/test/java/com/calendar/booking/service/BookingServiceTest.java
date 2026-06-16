package com.calendar.booking.service;

import com.calendar.booking.exception.SlotUnavailableException;
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
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {
    
    @Mock
    private BookingRepository bookingRepository;
    
    @Mock
    private EventTypeRepository eventTypeRepository;
    
    @InjectMocks
    private BookingService bookingService;
    
    private EventType eventType;
    private Booking booking;
    
    @BeforeEach
    void setUp() {
        eventType = new EventType("1", "Test", 30, "Description");
        booking = new Booking();
        booking.setEventTypeId("1");
        booking.setStartTime(Instant.now().plus(Duration.ofDays(1)));
        booking.setGuestName("John");
        booking.setGuestEmail("john@example.com");
    }
    
    @Test
    void create_ShouldSaveBooking_WhenSlotAvailable() {
        when(eventTypeRepository.findById("1")).thenReturn(Optional.of(eventType));
        when(bookingRepository.findByStartTimeLessThanAndEndTimeGreaterThan(any(), any()))
                .thenReturn(Collections.emptyList());
        when(bookingRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        
        Booking result = bookingService.create(booking);
        
        assertNotNull(result.getId());
        assertNotNull(result.getEndTime());
        assertNotNull(result.getCreatedAt());
        verify(bookingRepository).save(any());
    }
    
    @Test
    void create_ShouldThrow_WhenSlotUnavailable() {
        when(eventTypeRepository.findById("1")).thenReturn(Optional.of(eventType));
        when(bookingRepository.findByStartTimeLessThanAndEndTimeGreaterThan(any(), any()))
                .thenReturn(List.of(new Booking()));
        
        assertThrows(SlotUnavailableException.class, () -> bookingService.create(booking));
    }
    
    @Test
    void delete_ShouldDeleteBooking() {
        when(bookingRepository.existsById("1")).thenReturn(true);
        
        assertDoesNotThrow(() -> bookingService.delete("1"));
        verify(bookingRepository).deleteById("1");
    }
}
