package com.gemhaven.security;

import com.gemhaven.model.Auction;
import com.gemhaven.model.Gemstone;
import com.gemhaven.model.MiningPlot;
import com.gemhaven.repository.AuctionRepository;
import com.gemhaven.repository.GemstoneRepository;
import com.gemhaven.repository.MiningPlotRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
@Order(2)
public class DataSeeder implements CommandLineRunner {

    private final GemstoneRepository gemstoneRepository;
    private final AuctionRepository auctionRepository;
    private final MiningPlotRepository miningPlotRepository;

    public DataSeeder(GemstoneRepository gemstoneRepository, AuctionRepository auctionRepository, MiningPlotRepository miningPlotRepository) {
        this.gemstoneRepository = gemstoneRepository;
        this.auctionRepository = auctionRepository;
        this.miningPlotRepository = miningPlotRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (miningPlotRepository.count() == 0) {
            System.out.println("[INFO] Seeding initial mining land plots...");
            List<MiningPlot> plots = new ArrayList<>();

            MiningPlot p1 = new MiningPlot();
            p1.setName("Ratnapura Blue Vein Plot");
            p1.setRegion("Ratnapura");
            p1.setSizePerch(BigDecimal.valueOf(120));
            p1.setSizeAcres(BigDecimal.valueOf(0.75));
            p1.setYieldPotential("High (Sapphire Focus)");
            p1.setStatus(MiningPlot.PlotStatus.AVAILABLE);
            p1.setImages(List.of("/images/land/river_valley.png", "/images/land/rocky_ridge.png"));
            p1.setSurveyDate(LocalDate.of(2025, 11, 12));
            p1.setSoilComposition("Alluvial gravel (illam) rich in corundum");
            p1.setHistoricalYieldData("Historically produced fine Ceylon sapphires in 1990s adjacent plots.");
            p1.setDescription("A prime unmined plot located in the heart of Ratnapura's traditional gem-bearing region. Extensive geological surveys indicate a high probability of sapphire-rich alluvial deposits at a depth of 15-20 meters.");
            p1.setCoordinates("6°41'02.0\"N 80°23'49.2\"E");
            plots.add(p1);

            MiningPlot p2 = new MiningPlot();
            p2.setName("Pelmadulla Ruby Ridge");
            p2.setRegion("Pelmadulla");
            p2.setSizePerch(BigDecimal.valueOf(240));
            p2.setSizeAcres(BigDecimal.valueOf(1.5));
            p2.setYieldPotential("Medium-High");
            p2.setStatus(MiningPlot.PlotStatus.RESERVED);
            p2.setImages(List.of("/images/land/rocky_ridge.png"));
            p2.setSurveyDate(LocalDate.of(2026, 1, 5));
            p2.setSoilComposition("Residual soil over crystalline limestone");
            p2.setHistoricalYieldData("Known for producing star rubies and spinel.");
            p2.setDescription("An elevated plot situated on a crystalline limestone ridge in Pelmadulla. The site shows strong indications of ruby and spinel formations in the residual soil layer.");
            p2.setCoordinates("6°37'15.5\"N 80°32'10.1\"E");
            plots.add(p2);

            MiningPlot p3 = new MiningPlot();
            p3.setName("Elahera Green Valley Site");
            p3.setRegion("Elahera");
            p3.setSizePerch(BigDecimal.valueOf(80));
            p3.setSizeAcres(BigDecimal.valueOf(0.5));
            p3.setYieldPotential("High (Tourmaline/Garnet)");
            p3.setStatus(MiningPlot.PlotStatus.AVAILABLE);
            p3.setImages(List.of("/images/land/river_valley.png"));
            p3.setSurveyDate(LocalDate.of(2026, 3, 20));
            p3.setSoilComposition("Metamorphic rock debris and clay");
            p3.setHistoricalYieldData("Consistent yield of tourmaline, garnet, and occasional sapphires.");
            p3.setDescription("A compact but highly promising plot in the renowned Elahera gem field. This region is famous for its vibrant tourmalines and garnets.");
            p3.setCoordinates("7°45'30.0\"N 80°48'12.4\"E");
            plots.add(p3);

            MiningPlot p4 = new MiningPlot();
            p4.setName("Opanayake Deep Seam");
            p4.setRegion("Opanayake");
            p4.setSizePerch(BigDecimal.valueOf(400));
            p4.setSizeAcres(BigDecimal.valueOf(2.5));
            p4.setYieldPotential("Very High (Mixed Corundum)");
            p4.setStatus(MiningPlot.PlotStatus.UNDER_SURVEY);
            p4.setImages(List.of("/images/land/deep_mine.png", "/images/land/rocky_ridge.png"));
            p4.setSurveyDate(LocalDate.of(2026, 6, 15));
            p4.setSoilComposition("Deep alluvial sedimentary layers");
            p4.setHistoricalYieldData("Adjacent plots have yielded museum-quality padparadscha sapphires.");
            p4.setDescription("A large-scale operation site currently undergoing deep seismic and geological surveying. Initial test pits reveal rich gem-bearing gravels at a depth of 30 meters.");
            p4.setCoordinates("6°35'40.2\"N 80°38'55.8\"E");
            plots.add(p4);

            miningPlotRepository.saveAll(plots);
            System.out.println("[INFO] " + plots.size() + " mining land plots seeded successfully.");
        }

        if (gemstoneRepository.count() == 0) {
            System.out.println("[INFO] Seeding initial gemstone database...");
            List<Gemstone> gems = new ArrayList<>();

            gems.add(createGem("Burmese Pigeon Blood Ruby", "Ruby", 3.21, "GIA-2024-087431", "GIA", 1850000, "VS1", "Oval", "Mogok, Myanmar", "#B91C1C", "Pigeon Blood Red", "An exceptional Burmese ruby of the finest pigeon blood hue, sourced from the legendary Mogok valley. GIA certified with no heat treatment — a rarity in today's market.", "/images/gems/ruby.png"));
            gems.add(createGem("Ceylon Royal Blue Sapphire", "Sapphire", 5.14, "GRS-2023-112908", "GRS", 3200000, "VVS2", "Cushion", "Ratnapura, Sri Lanka", "#1D4ED8", "Royal Blue", "A prized royal blue sapphire from the gem fields of Ratnapura, bearing the intense velvety hue synonymous with Ceylon stones. Unheated, GRS certified.", "/images/gems/sapphire.png"));
            gems.add(createGem("Colombian Vivid Green Emerald", "Emerald", 2.87, "CDTEC-2024-005512", "CDTEC", 2450000, "SI1", "Emerald", "Muzo, Colombia", "#15803D", "Vivid Green", "Muzo origin vivid green emerald exhibiting the classic warm saturation unique to Colombian stones. Minor natural inclusions — a hallmark of genuine unheated Muzo material.", "/images/gems/emerald.png"));
            gems.add(createGem("Padparadscha Sapphire", "Sapphire", 1.92, "GIA-2024-054209", "GIA", 4800000, "VVS1", "Oval", "Ratnapura, Sri Lanka", "#EA580C", "Lotus Pink-Orange", "An exceptionally rare Padparadscha sapphire exhibiting the delicate salmon-pink hue reminiscent of a lotus blossom. Certified unheated — among the rarest of all sapphire varieties.", "/images/gems/topaz.png"));
            gems.add(createGem("Alexandrite Cat's Eye", "Alexandrite", 2.10, "GRS-2023-078342", "GRS", 6700000, "VVS2", "Cat's Eye", "Hematita, Brazil", "#065F46", "Colour-Change Green / Red", "A Brazilian alexandrite with pronounced colour change — vivid green under daylight, raspberry red under incandescent light — combined with a sharp cat's eye phenomenon.", "/images/gems/emerald.png"));
            gems.add(createGem("Kashmiri Blue Sapphire", "Sapphire", 4.05, "GIA-2022-031187", "GIA", 12500000, "VS2", "Cushion", "Kashmir, India", "#1E40AF", "Kashmir Cornflower Blue", "The holy grail of sapphires — a Kashmir origin cushion cut with the legendary velvety cornflower blue. GIA certified, unheated. Fewer than 1% of sapphires carry a Kashmir origin report.", "/images/gems/sapphire.png"));
            gems.add(createGem("Mozambique Paraiba Tourmaline", "Tourmaline", 1.55, "GRS-2024-098001", "GRS", 2100000, "VVS1", "Oval", "Mozambique", "#0891B2", "Neon Electric Blue", "A copper-bearing Paraíba-type tourmaline from Mozambique radiating an electric neon glow. GRS confirmed copper-bearing origin — the source of its extraordinary luminescence.", "/images/gems/paraiba.png"));
            gems.add(createGem("Yellow Ceylon Sapphire", "Sapphire", 6.80, "GIA-2023-064418", "GIA", 980000, "VS1", "Cushion", "Ratnapura, Sri Lanka", "#D97706", "Golden Yellow", "A rich golden-yellow Ceylon sapphire of superb clarity and lively brilliance. Unheated, GIA certified — an undervalued collector's gem of pure Sri Lankan origin.", "/images/gems/topaz.png"));
            gems.add(createGem("Tanzanian Tsavorite Garnet", "Garnet", 3.44, "SSEF-2024-011754", "SSEF", 1150000, "VS1", "Oval", "Merelani, Tanzania", "#16A34A", "Vivid Chrome Green", "A fine Merelani tsavorite garnet with saturated chrome-green colour rivalling the finest emeralds — without inclusions. SSEF certified with an exceptional colour grade.", "/images/gems/emerald.png"));
            gems.add(createGem("Burmese Blue Spinel", "Spinel", 4.22, "GRS-2023-055609", "GRS", 1620000, "VVS1", "Cushion", "Mogok, Myanmar", "#2563EB", "Cobalt Blue", "A cobalt-blue Mogok spinel — one of the most sought-after collector gems, prized for its saturated blue and exceptional brilliance. GRS certified cobalt-bearing.", "/images/gems/sapphire.png"));
            gems.add(createGem("Rhodolite Garnet", "Garnet", 5.60, "GIA-2024-041230", "GIA", 420000, "VVS2", "Oval", "Umba Valley, Tanzania", "#9D174D", "Raspberry Pink", "A vibrant raspberry-rose rhodolite garnet from the Umba Valley with excellent transparency and life. An accessible luxury gem of outstanding colour saturation.", "/images/gems/ruby.png"));
            gems.add(createGem("Imperial Topaz", "Topaz", 8.15, "GRS-2022-088314", "GRS", 760000, "IF", "Oval", "Ouro Preto, Brazil", "#C2410C", "Imperial Orange", "A true imperial topaz — the rarest colour variant, a warm peachy-orange — from the historic Ouro Preto deposit in Brazil. Internally flawless. An heirloom-quality stone.", "/images/gems/topaz.png"));

            gemstoneRepository.saveAll(gems);
            System.out.println("[INFO] " + gems.size() + " gemstones seeded successfully.");

            if (auctionRepository.count() == 0) {
                System.out.println("[INFO] Seeding initial auctions...");
                List<Auction> auctions = new ArrayList<>();
                auctions.add(createAuction(gems.get(0), 1200000, 50000, LocalDateTime.now().plusHours(2), Auction.AuctionStatus.LIVE, 1240000.0));
                auctions.add(createAuction(gems.get(1), 2500000, 100000, LocalDateTime.now().plusHours(4), Auction.AuctionStatus.LIVE, 2890000.0));
                auctions.add(createAuction(gems.get(2), 2000000, 50000, LocalDateTime.now().plusDays(1), Auction.AuctionStatus.SCHEDULED, null));
                auctions.add(createAuction(gems.get(3), 4000000, 150000, LocalDateTime.now().plusHours(1), Auction.AuctionStatus.LIVE, 4150000.0));
                auctionRepository.saveAll(auctions);
                System.out.println("[INFO] " + auctions.size() + " auctions seeded successfully.");
            }
        } else {
            System.out.println("[INFO] Gemstones already exist. Skipping seed.");
        }
    }

    private Gemstone createGem(String name, String type, double carat, String cert, String auth, double price, String clarity, String cut, String origin, String color, String colorName, String desc, String img) {
        Gemstone g = new Gemstone();
        g.setName(name);
        g.setType(type);
        g.setCaratWeight(BigDecimal.valueOf(carat));
        g.setCertNumber(cert);
        g.setCertAuthority(auth);
        g.setPrice(BigDecimal.valueOf(price));
        g.setClarity(clarity);
        g.setCut(cut);
        g.setOrigin(origin);
        g.setColor(color);
        g.setColorName(colorName);
        g.setDescription(desc);
        g.setImageUrl(img);
        g.setReservationStatus(Gemstone.ReservationStatus.PUBLISHED); // Set to PUBLISHED so they appear in Shop
        return g;
    }

    private Auction createAuction(Gemstone gem, double startingPrice, double minIncrement, LocalDateTime endTime, Auction.AuctionStatus status, Double currentBid) {
        Auction a = new Auction();
        a.setGemstone(gem);
        a.setStartingPrice(BigDecimal.valueOf(startingPrice));
        a.setMinIncrement(BigDecimal.valueOf(minIncrement));
        a.setEndTime(endTime);
        a.setStatus(status);
        if (currentBid != null && currentBid > 0) {
            a.setCurrentBid(BigDecimal.valueOf(currentBid));
        }
        return a;
    }
}
