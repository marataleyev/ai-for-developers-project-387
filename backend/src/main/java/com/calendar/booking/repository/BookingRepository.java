package com.calendar.booking.repository;

import com.calendar.booking.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, String> {
    Optional<Booking> findByStartTime(Instant startTime);
    List<Booking> findByStartTimeBetween(Instant from, Instant to);
    List<Booking> findByStartTimeLessThanAndEndTimeGreaterThan(Instant end, Instant start);
}
