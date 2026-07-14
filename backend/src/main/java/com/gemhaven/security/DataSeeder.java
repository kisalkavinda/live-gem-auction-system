package com.gemhaven.security;

import com.gemhaven.model.Gemstone;
import com.gemhaven.repository.GemstoneRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Component
@Order(2)
public class DataSeeder implements CommandLineRunner {

    private final GemstoneRepository gemstoneRepository;

    public DataSeeder(GemstoneRepository gemstoneRepository) {
        this.gemstoneRepository = gemstoneRepository;
    }

    @Override
    public void run(String... args) throws Exception {
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
}
