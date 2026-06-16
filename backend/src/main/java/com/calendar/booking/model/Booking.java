package com.calendar.booking.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table(name = "booking")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {
    @Id
    private String id;
    
    private String eventTypeId;
    
    private Instant startTime;
    
    private Instant endTime;
    
    private String guestName;
    
    private String guestEmail;
    
    private Instant createdAt;
}
