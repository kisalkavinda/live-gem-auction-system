package com.gemhaven.service;

import com.gemhaven.model.Booking;
import com.gemhaven.model.MiningPlot;
import com.gemhaven.model.User;
import com.gemhaven.repository.BookingRepository;
import com.gemhaven.repository.MiningPlotRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@SuppressWarnings("null")
public class LandService {

    private final MiningPlotRepository miningPlotRepository;
    private final BookingRepository bookingRepository;

    public LandService(MiningPlotRepository miningPlotRepository, BookingRepository bookingRepository) {
        this.miningPlotRepository = miningPlotRepository;
        this.bookingRepository = bookingRepository;
    }

    public List<MiningPlot> getAll(String region, MiningPlot.PlotStatus status,
                                    BigDecimal minAcres, BigDecimal maxAcres, String sort) {
        List<MiningPlot> plots;

        if (region != null && !region.isBlank() && status != null) {
            plots = miningPlotRepository.findByRegionAndStatus(region, status);
        } else if (region != null && !region.isBlank()) {
            plots = miningPlotRepository.findByRegion(region);
        } else if (status != null) {
            plots = miningPlotRepository.findByStatus(status);
        } else {
            plots = miningPlotRepository.findAll();
        }

        if (minAcres != null) {
            plots = plots.stream().filter(p -> p.getSizeAcres() != null &&
                    p.getSizeAcres().compareTo(minAcres) >= 0).toList();
        }
        if (maxAcres != null) {
            plots = plots.stream().filter(p -> p.getSizeAcres() != null &&
                    p.getSizeAcres().compareTo(maxAcres) <= 0).toList();
        }

        if ("size-asc".equals(sort)) {
            plots = plots.stream().sorted((a, b) ->
                    a.getSizeAcres() == null ? 1 : a.getSizeAcres().compareTo(b.getSizeAcres())).toList();
        } else if ("size-desc".equals(sort)) {
            plots = plots.stream().sorted((a, b) ->
                    b.getSizeAcres() == null ? 1 : b.getSizeAcres().compareTo(a.getSizeAcres())).toList();
        }

        return plots;
    }

    public MiningPlot getById(Long id) {
        return miningPlotRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Land plot not found: " + id));
    }

    public MiningPlot create(MiningPlot plot) {
        return miningPlotRepository.save(plot);
    }

    @Transactional
    public MiningPlot update(Long id, MiningPlot updated) {
        MiningPlot existing = getById(id);
        existing.setName(updated.getName());
        existing.setRegion(updated.getRegion());
        existing.setSizePerch(updated.getSizePerch());
        existing.setSizeAcres(updated.getSizeAcres());
        existing.setYieldPotential(updated.getYieldPotential());
        existing.setYieldEstimate(updated.getYieldEstimate());
        existing.setStatus(updated.getStatus());
        existing.setImages(updated.getImages());
        existing.setSurveyDate(updated.getSurveyDate());
        existing.setSoilComposition(updated.getSoilComposition());
        existing.setHistoricalYieldData(updated.getHistoricalYieldData());
        existing.setDescription(updated.getDescription());
        existing.setCoordinates(updated.getCoordinates());
        existing.setGeologicalData(updated.getGeologicalData());
        return miningPlotRepository.save(existing);
    }

    public void delete(Long id) {
        miningPlotRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Land plot not found: " + id));
        miningPlotRepository.deleteById(id);
    }

    // ─── Bookings ─────────────────────────────────────────────────────────────

    @Transactional
    public Booking submitBooking(Long landPlotId, Booking booking, User authenticatedUser) {
        MiningPlot plot = getById(landPlotId);
        booking.setLandPlot(plot);
        booking.setUser(authenticatedUser);
        booking.setStatus(Booking.BookingStatus.PENDING);
        return bookingRepository.save(booking);
    }

    public List<Booking> getAllBookings(Booking.BookingStatus status) {
        if (status != null) {
            return bookingRepository.findByStatus(status);
        }
        return bookingRepository.findAll();
    }

    @Transactional
    public Booking updateBookingStatus(Long bookingId, Booking.BookingStatus newStatus) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found: " + bookingId));
        booking.setStatus(newStatus);
        return bookingRepository.save(booking);
    }
}
