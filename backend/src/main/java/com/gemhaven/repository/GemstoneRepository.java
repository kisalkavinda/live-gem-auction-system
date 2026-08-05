package com.gemhaven.repository;

import com.gemhaven.model.Gemstone;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GemstoneRepository extends JpaRepository<Gemstone, Long> {

    List<Gemstone> findByStatus(Gemstone.GemStatus status);

    List<Gemstone> findByType(String type);

    List<Gemstone> findByStatusAndType(Gemstone.GemStatus status, String type);

    /**
     * Pessimistic write lock — prevents concurrent reservation/purchase of the same gem.
     * Essential for atomic status transitions (PUBLISHED → RESERVED → SOLD).
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT g FROM Gemstone g WHERE g.id = :id")
    Optional<Gemstone> findByIdWithPessimisticLock(@Param("id") Long id);
}
