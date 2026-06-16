package com.calendar.booking.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "event_type")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventType {
    @Id
    private String id;
    
    private String title;
    
    private Integer duration;
    
    private String description;
}
