package com.gemhaven.service;

import com.gemhaven.model.Gemstone;
import com.gemhaven.model.User;
import com.gemhaven.repository.GemstoneRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@SuppressWarnings("null")
public class GemstoneService {

    private final GemstoneRepository gemstoneRepository;

    public GemstoneService(GemstoneRepository gemstoneRepository) {
        this.gemstoneRepository = gemstoneRepository;
    }

    public List<Gemstone> getAll(String type, String clarity, String sort,
                                  Gemstone.ReservationStatus status) {
        List<Gemstone> gems;
        if (type != null && !type.isBlank()) {
            gems = gemstoneRepository.findByReservationStatusAndType(status, type);
        } else {
            gems = gemstoneRepository.findByReservationStatus(status);
        }

        // Clarity filter (in-memory — small dataset)
        if (clarity != null && !clarity.isBlank()) {
            gems = gems.stream()
                    .filter(g -> clarity.equals(g.getClarity()))
                    .toList();
        }

        // Sort
        if ("price-asc".equals(sort)) {
            gems = gems.stream()
                    .sorted((a, b) -> a.getPrice().compareTo(b.getPrice()))
                    .toList();
        } else if ("price-desc".equals(sort)) {
            gems = gems.stream()
                    .sorted((a, b) -> b.getPrice().compareTo(a.getPrice()))
                    .toList();
        }

        return gems;
    }

    public Gemstone getById(Long id) {
        return gemstoneRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Gemstone not found: " + id));
    }

    public Gemstone create(Gemstone gemstone) {
        gemstone.setReservationStatus(Gemstone.ReservationStatus.DRAFT);
        return gemstoneRepository.save(gemstone);
    }

    public Gemstone update(Long id, Gemstone updated) {
        Gemstone existing = getById(id);
        existing.setName(updated.getName());
        existing.setType(updated.getType());
        existing.setCaratWeight(updated.getCaratWeight());
        existing.setCut(updated.getCut());
        existing.setColor(updated.getColor());
        existing.setColorName(updated.getColorName());
        existing.setClarity(updated.getClarity());
        existing.setOrigin(updated.getOrigin());
        existing.setCertNumber(updated.getCertNumber());
        existing.setCertAuthority(updated.getCertAuthority());
        existing.setCertificationPdfUrl(updated.getCertificationPdfUrl());
        existing.setPrice(updated.getPrice());
        existing.setDescription(updated.getDescription());
        existing.setImageUrl(updated.getImageUrl());
        return gemstoneRepository.save(existing);
    }

    public void delete(Long id) {
        gemstoneRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Gemstone not found: " + id));
        gemstoneRepository.deleteById(id);
    }

    @Transactional
    public Gemstone publish(Long id) {
        Gemstone gem = gemstoneRepository.findByIdWithPessimisticLock(id)
                .orElseThrow(() -> new IllegalArgumentException("Gemstone not found: " + id));
        if (gem.getReservationStatus() != Gemstone.ReservationStatus.DRAFT) {
            throw new IllegalStateException("Only DRAFT gems can be published.");
        }
        gem.setReservationStatus(Gemstone.ReservationStatus.PUBLISHED);
        return gemstoneRepository.save(gem);
    }

    @Transactional
    public Gemstone purchase(Long id, User buyer) {
        Gemstone gem = gemstoneRepository.findByIdWithPessimisticLock(id)
                .orElseThrow(() -> new IllegalArgumentException("Gemstone not found: " + id));
        if (gem.getReservationStatus() != Gemstone.ReservationStatus.PUBLISHED) {
            throw new IllegalStateException("Gemstone is not available for purchase.");
        }
        gem.setReservationStatus(Gemstone.ReservationStatus.SOLD);
        gem.setOwner(buyer);
        return gemstoneRepository.save(gem);
    }
}
