package com.gemhaven.repository;

import com.gemhaven.model.Booking;
import com.gemhaven.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByLandPlot_Id(Long landPlotId);

    void deleteByLandPlot_Id(Long landPlotId);

    List<Booking> findByStatus(Booking.BookingStatus status);

    List<Booking> findByUser(User user);

    long countByUser(User user);
}
