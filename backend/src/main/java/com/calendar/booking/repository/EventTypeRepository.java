package com.calendar.booking.repository;

import com.calendar.booking.model.EventType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventTypeRepository extends JpaRepository<EventType, String> {
}
