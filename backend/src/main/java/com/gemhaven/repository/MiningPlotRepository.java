package com.gemhaven.repository;

import com.gemhaven.model.MiningPlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MiningPlotRepository extends JpaRepository<MiningPlot, Long> {

    List<MiningPlot> findByRegion(String region);

    List<MiningPlot> findByStatus(MiningPlot.PlotStatus status);

    List<MiningPlot> findByRegionAndStatus(String region, MiningPlot.PlotStatus status);
}
