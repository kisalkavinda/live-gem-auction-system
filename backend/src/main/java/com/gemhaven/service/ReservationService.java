package com.gemhaven.service;

import com.gemhaven.model.Gemstone;
import com.gemhaven.model.Reservation;
import com.gemhaven.model.User;
import com.gemhaven.repository.GemstoneRepository;
import com.gemhaven.repository.ReservationRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@SuppressWarnings("null")
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final GemstoneRepository gemstoneRepository;

    public ReservationService(ReservationRepository reservationRepository,
                              GemstoneRepository gemstoneRepository) {
        this.reservationRepository = reservationRepository;
        this.gemstoneRepository = gemstoneRepository;
    }

    @Transactional
    public Reservation createReservation(Reservation reservation, Long gemId, User user) {
        Gemstone gemstone = gemstoneRepository.findById(gemId)
                .orElseThrow(() -> new IllegalArgumentException("Gemstone not found with ID: " + gemId));

        if (reservation.getTotalAmount() == null || reservation.getTotalAmount().compareTo(BigDecimal.ZERO) == 0) {
            if (gemstone.getPrice() != null) {
                reservation.setTotalAmount(gemstone.getPrice());
            } else {
                reservation.setTotalAmount(BigDecimal.ZERO);
            }
        }

        // Update gemstone lifecycle status to RESERVED
        gemstone.setStatus(Gemstone.GemStatus.RESERVED);
        if (user != null) {
            gemstone.setOwner(user);
        }
        gemstoneRepository.save(gemstone);

        reservation.setGemstone(gemstone);
        if (user != null) {
            reservation.setUser(user);
        }
        if (reservation.getStatus() == null) {
            reservation.setStatus(Reservation.ReservationStatus.CONFIRMED);
        }

        return reservationRepository.save(reservation);
    }

    public List<Reservation> getAllReservations(Reservation.ReservationStatus status) {
        if (status != null) {
            return reservationRepository.findByStatus(status);
        }
        return reservationRepository.findAllByOrderByCreatedAtDesc();
    }

    public Reservation getById(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found with ID: " + id));
    }

    @Transactional
    public Reservation updateStatus(Long id, Reservation.ReservationStatus status) {
        Reservation reservation = getById(id);
        reservation.setStatus(status);

        // If cancelled, revert gem status to PUBLISHED
        if (status == Reservation.ReservationStatus.CANCELLED && reservation.getGemstone() != null) {
            Gemstone gem = reservation.getGemstone();
            gem.setStatus(Gemstone.GemStatus.PUBLISHED);
            gemstoneRepository.save(gem);
        } else if (status == Reservation.ReservationStatus.COMPLETED && reservation.getGemstone() != null) {
            Gemstone gem = reservation.getGemstone();
            gem.setStatus(Gemstone.GemStatus.SOLD);
            gemstoneRepository.save(gem);
        }

        return reservationRepository.save(reservation);
    }
}
