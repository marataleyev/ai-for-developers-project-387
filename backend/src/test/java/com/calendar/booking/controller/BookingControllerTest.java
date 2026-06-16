package com.calendar.booking.controller;

import com.calendar.booking.exception.SlotUnavailableException;
import com.calendar.booking.model.Booking;
import com.calendar.booking.service.BookingService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Duration;
import java.time.Instant;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(BookingController.class)
class BookingControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private BookingService bookingService;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Test
    void create_ShouldReturn200_WhenBookingValid() throws Exception {
        Booking booking = new Booking();
        booking.setEventTypeId("1");
        booking.setStartTime(Instant.now().plus(Duration.ofDays(1)));
        booking.setGuestName("John");
        booking.setGuestEmail("john@example.com");
        
        when(bookingService.create(any())).thenReturn(booking);
        
        mockMvc.perform(post("/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(booking)))
                .andExpect(status().isOk());
    }
    
    @Test
    void create_ShouldReturn409_WhenSlotUnavailable() throws Exception {
        Booking booking = new Booking();
        booking.setEventTypeId("1");
        booking.setStartTime(Instant.now().plus(Duration.ofDays(1)));
        booking.setGuestName("John");
        booking.setGuestEmail("john@example.com");
        
        when(bookingService.create(any())).thenThrow(new SlotUnavailableException("Slot unavailable"));
        
        mockMvc.perform(post("/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(booking)))
                .andExpect(status().isConflict());
    }
}
