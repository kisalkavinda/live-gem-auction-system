package com.gemhaven.repository;

import com.gemhaven.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByStatus(Reservation.ReservationStatus status);

    List<Reservation> findAllByOrderByCreatedAtDesc();

    List<Reservation> findByUserIdOrderByCreatedAtDesc(Long userId);
}
