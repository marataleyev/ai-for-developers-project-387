package com.calendar.booking.service;

import com.calendar.booking.dto.SlotDTO;
import com.calendar.booking.model.Booking;
import com.calendar.booking.model.EventType;
import com.calendar.booking.repository.BookingRepository;
import com.calendar.booking.repository.EventTypeRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CalendarService {
    
    private final EventTypeRepository eventTypeRepository;
    private final BookingRepository bookingRepository;
    
    public List<SlotDTO> getSlots(String eventTypeId, Instant from, Instant to) {
        EventType eventType = eventTypeRepository.findById(eventTypeId)
                .orElseThrow(() -> new EntityNotFoundException("Event type not found: " + eventTypeId));
        
        List<Booking> existingBookings = bookingRepository.findByStartTimeBetween(from, to);
        
        List<SlotDTO> slots = new ArrayList<>();
        Instant current = from;
        
        while (current.isBefore(to) || current.equals(to)) {
            Instant end = current.plus(Duration.ofMinutes(eventType.getDuration()));
            Instant slotStart = current;
            
            // A slot is unavailable if it overlaps any existing booking's interval:
            // existing.startTime < slot.end AND existing.endTime > slot.start
            boolean isAvailable = existingBookings.stream()
                    .noneMatch(booking -> booking.getStartTime().isBefore(end)
                            && booking.getEndTime().isAfter(slotStart));
            
            slots.add(new SlotDTO(slotStart, end, isAvailable));
            current = end;
        }
        
        return slots;
    }
}
