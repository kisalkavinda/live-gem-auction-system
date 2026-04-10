package com.gemhaven.repository;

import com.gemhaven.model.Gemstone;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface GemstoneRepository extends JpaRepository<Gemstone, Long> {

    // Pessimistic Write Lock ensures no two transactions can read/verify the status concurrently
    // Essential for the O2O Strategy reserving a gemstone
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT g FROM Gemstone g WHERE g.id = :id")
    Optional<Gemstone> findByIdWithPessimisticLock(@Param("id") Long id);
}
