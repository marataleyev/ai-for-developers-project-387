package com.calendar.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SlotDTO {
    private Instant startTime;
    private Instant endTime;
    private Boolean isAvailable;
}
