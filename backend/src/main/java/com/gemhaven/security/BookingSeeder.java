package com.gemhaven.security;

import com.gemhaven.model.Booking;
import com.gemhaven.model.MiningPlot;
import com.gemhaven.model.User;
import com.gemhaven.repository.BookingRepository;
import com.gemhaven.repository.MiningPlotRepository;
import com.gemhaven.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Component
@Order(3)
public class BookingSeeder implements CommandLineRunner {

    private final BookingRepository bookingRepository;
    private final MiningPlotRepository miningPlotRepository;
    private final UserRepository userRepository;

    public BookingSeeder(BookingRepository bookingRepository, MiningPlotRepository miningPlotRepository, UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.miningPlotRepository = miningPlotRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (bookingRepository.count() == 0) {
            System.out.println("[INFO] Seeding initial site visit bookings...");
            
            Optional<User> buyerOpt = userRepository.findByEmail("buyer@gemhaven.com");
            if (buyerOpt.isEmpty()) {
                System.out.println("[WARN] Default buyer not found. Cannot seed bookings.");
                return;
            }
            User buyer = buyerOpt.get();

            List<MiningPlot> plots = miningPlotRepository.findAll();
            if (plots.isEmpty()) {
                System.out.println("[WARN] No mining plots found. Cannot seed bookings.");
                return;
            }

            List<Booking> bookings = new ArrayList<>();

            // Seed a PENDING booking
            Booking b1 = new Booking();
            b1.setLandPlot(plots.get(0));
            b1.setUser(buyer);
            b1.setFullName(buyer.getFullName());
            b1.setEmail(buyer.getEmail());
            b1.setPhone("+94 77 123 4567");
            b1.setPreferredVisitDate(LocalDate.now().plusDays(5));
            b1.setNumVisitors(2);
            b1.setMessage("I would like to bring a geologist with me.");
            b1.setStatus(Booking.BookingStatus.PENDING);
            bookings.add(b1);

            // Seed a CONFIRMED booking
            if (plots.size() > 1) {
                Booking b2 = new Booking();
                b2.setLandPlot(plots.get(1));
                b2.setUser(buyer);
                b2.setFullName("John Doe");
                b2.setEmail("johndoe@example.com");
                b2.setPhone("+94 77 987 6543");
                b2.setPreferredVisitDate(LocalDate.now().plusDays(2));
                b2.setNumVisitors(1);
                b2.setMessage("Please provide a guide for the site.");
                b2.setStatus(Booking.BookingStatus.CONFIRMED);
                bookings.add(b2);
            }

            bookingRepository.saveAll(bookings);
            System.out.println("[INFO] " + bookings.size() + " bookings seeded successfully.");
        } else {
            System.out.println("[INFO] Bookings already exist. Skipping seed.");
        }
    }
}
