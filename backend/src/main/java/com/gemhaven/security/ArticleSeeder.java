package com.gemhaven.security;

import com.gemhaven.model.Article;
import com.gemhaven.repository.ArticleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Component
@Order(4)
public class ArticleSeeder implements CommandLineRunner {

    private final ArticleRepository articleRepository;

    public ArticleSeeder(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (articleRepository.count() == 0) {
            System.out.println("[INFO] Seeding initial Knowledge Hub articles...");
            List<Article> articles = new ArrayList<>();

            // 1. Pigeon Blood Ruby
            articles.add(createArticle(
                    "understanding-the-pigeon-blood-ruby",
                    "Understanding the \"Pigeon Blood\" Ruby",
                    "Gem History",
                    "The story behind the most coveted color in the world of rubies and why Mogok remains the undisputed king of origin.",
                    "/images/knowledge/ruby.png",
                    "Dr. Alistair Vance",
                    LocalDate.of(2024, 5, 12),
                    "6 min read",
                    true,
                    "[{\"type\":\"paragraph\",\"value\":\"For centuries, the term \\\"pigeon blood\\\" has been whispered in the gem trade with a mix of reverence and awe. But what exactly defines this elusive colour, and why does it command such a premium at international auctions?\"},{\"type\":\"heading\",\"value\":\"The Origins of the Term\"},{\"type\":\"paragraph\",\"value\":\"The origin of the phrase is deeply rooted in Burmese folklore. Traditionally, it refers to the colour of the first two drops of blood from a freshly killed pigeon. While the imagery is visceral, it accurately captures the vivid, slightly purplish-red hue that is the hallmark of the finest rubies.\"},{\"type\":\"quote\",\"value\":\"To hold a true pigeon blood ruby is to hold a glowing ember that refuses to be extinguished.\"},{\"type\":\"paragraph\",\"value\":\"What sets true pigeon blood rubies apart is their strong red fluorescence under ultraviolet light—a natural phenomenon caused by high chromium content and low iron. This fluorescence gives the stone an inner glow, making it appear as if it is illuminated from within, even under normal daylight.\"},{\"type\":\"heading\",\"value\":\"The Mogok Connection\"},{\"type\":\"paragraph\",\"value\":\"While beautiful rubies are mined in Mozambique, Madagascar, and Vietnam, the standard-bearer remains the Mogok Valley in Myanmar (Burma). The unique geology of Mogok, a collision of marble and metamorphic rock, provides the perfect recipe for chromium-rich corundum with minimal iron.\"},{\"type\":\"image\",\"url\":\"/images/knowledge/ruby-2.png\",\"caption\":\"A stunning example of an unheated Burmese ruby.\"},{\"type\":\"paragraph\",\"value\":\"When evaluating a pigeon blood ruby, always demand certification from a reputable laboratory like GRS, GIA, or SSEF. Only these institutions have the strict colour-grading criteria necessary to append the coveted \\\"Pigeon Blood\\\" descriptor to a certification.\"}]"
            ));

            // 2. Certification & Grading
            articles.add(createArticle(
                    "the-importance-of-independent-certification",
                    "The Importance of Independent Certification",
                    "Certification & Grading",
                    "Why relying on a single origin report is no longer enough in the modern era of gemology.",
                    "/images/knowledge/cert.png",
                    "Elena Rostova",
                    LocalDate.of(2024, 4, 28),
                    "4 min read",
                    false,
                    "[{\"type\":\"paragraph\",\"value\":\"In the high-stakes world of fine gemstone investment, trust is paramount. However, trust should always be verified. The bedrock of this verification is the independent gemological report.\"},{\"type\":\"heading\",\"value\":\"Why Certification Matters\"},{\"type\":\"paragraph\",\"value\":\"A certificate from a recognized laboratory—such as the Gemological Institute of America (GIA), the Swiss Gemmological Institute (SSEF), or GemResearch Swisslab (GRS)—serves as a stone's passport. It confirms its identity, weight, dimensions, and most importantly, any treatments it has undergone.\"},{\"type\":\"quote\",\"value\":\"The difference between an unheated sapphire and a heated one can mean a price variance of over 300%. A certificate is your only absolute defense.\"},{\"type\":\"paragraph\",\"value\":\"As treatment technologies become more sophisticated (such as beryllium diffusion or high-pressure high-temperature treatments), the naked eye, and even the standard jeweler's loupe, are no longer sufficient.\"}]"
            ));

            // 3. Ceylon Sapphires
            articles.add(createArticle(
                    "navigating-ceylon-sapphires",
                    "Navigating the World of Ceylon Sapphires",
                    "Buying Guide",
                    "A comprehensive guide to selecting the perfect Sri Lankan sapphire, from cornflower blue to padparadscha.",
                    "/images/knowledge/sapphire.png",
                    "Sunil Weeraratne",
                    LocalDate.of(2024, 3, 15),
                    "8 min read",
                    true,
                    "[{\"type\":\"paragraph\",\"value\":\"Sri Lanka, historically known as Ceylon, is one of the world's oldest and most prolific sources of fine sapphires. Known as the \\\"Island of Gems,\\\" its gravels have yielded some of the largest and most famous sapphires in history.\"},{\"type\":\"heading\",\"value\":\"The Spectrum of Ceylon Blues\"},{\"type\":\"paragraph\",\"value\":\"Unlike the dark, inky blues often associated with Australian or Thai sapphires, Ceylon sapphires are celebrated for their bright, luminous hues. The most sought-after colors are \\\"Cornflower Blue\\\" (a bright, vivid blue with a hint of violet) and \\\"Royal Blue\\\" (a deep, highly saturated blue).\"},{\"type\":\"quote\",\"value\":\"A fine Ceylon sapphire doesn't just reflect light; it dances with it.\"},{\"type\":\"paragraph\",\"value\":\"Beyond blue, Sri Lanka is the primary source of the extraordinarily rare Padparadscha sapphire—a delicate balance of pink and orange, named after the lotus flower.\"}]"
            ));

            // 4. Artisanal Mining
            articles.add(createArticle(
                    "the-ethics-of-artisanal-mining",
                    "The Ethics and Impact of Artisanal Mining",
                    "Mining & Origin",
                    "How traditional mining practices in Sri Lanka protect the environment and support local communities.",
                    "/images/knowledge/mining-1.jpg",
                    "Dr. Alistair Vance",
                    LocalDate.of(2024, 2, 10),
                    "5 min read",
                    false,
                    "[{\"type\":\"paragraph\",\"value\":\"In an era where \\\"conflict-free\\\" and \\\"sustainable\\\" are crucial factors for luxury buyers, Sri Lanka's gem mining industry stands out as a unique model of traditional, ethical extraction.\"},{\"type\":\"image\",\"url\":\"/images/knowledge/mining-2.jpg\",\"caption\":\"A mining team gathers around a traditionally woven \\\"kulla\\\" basket used to transport gem-bearing gravel from the pit.\"},{\"type\":\"heading\",\"value\":\"The \\\"Patal\\\" System\"},{\"type\":\"paragraph\",\"value\":\"Mining in Sri Lanka is largely artisanal. The traditional pit mining method, known as \\\"Patal,\\\" involves sinking vertical shafts into the gem-bearing gravel (illam). This method is highly regulated by the government to prevent environmental degradation.\"},{\"type\":\"image\",\"url\":\"/images/knowledge/mining-3.jpg\",\"caption\":\"Freshly extracted gravel is inspected before being carried to a nearby stream for washing.\"},{\"type\":\"paragraph\",\"value\":\"Once the illam is brought to the surface, it must be washed to remove clay and silt, revealing any gem rough hidden within. This is traditionally done by hand in a nearby river or stream.\"},{\"type\":\"image\",\"url\":\"/images/knowledge/mining-1.jpg\",\"caption\":\"Miners use flat, woven \\\"wallam\\\" sieves to wash and sort gravel in a stream — a technique passed down through generations.\"},{\"type\":\"paragraph\",\"value\":\"Furthermore, the proceeds of a find are traditionally split among the workers, the land owner, and the financier, ensuring that the wealth generated by the land directly benefits the local community.\"},{\"type\":\"image\",\"url\":\"/images/knowledge/mining-4.jpg\",\"caption\":\"Two miners sort through washed gravel by hand, searching for gem rough.\"}]"
            ));

            // 5. Colored Gemstones vs Diamonds
            articles.add(createArticle(
                    "investing-in-colored-gemstones",
                    "Investing in Colored Gemstones vs. Diamonds",
                    "Buying Guide",
                    "An analytical look at the rising market value of colored stones over the past decade.",
                    "/images/knowledge/diamand vs gems.png",
                    "Elena Rostova",
                    LocalDate.of(2024, 1, 22),
                    "7 min read",
                    false,
                    "[{\"type\":\"paragraph\",\"value\":\"For generations, white diamonds were the undisputed champions of the gemstone investment world. However, the last two decades have seen a dramatic shift in collector focus toward exceptional colored gemstones.\"},{\"type\":\"heading\",\"value\":\"The Rarity Factor\"},{\"type\":\"paragraph\",\"value\":\"The simple truth driving the colored gemstone market is rarity. A high-quality, unheated, three-carat Burmese ruby is exponentially rarer than a three-carat, D-flawless diamond. As supply from historical mines depletes, the value of these unheated natural wonders continues to soar.\"}]"
            ));

            // 6. Emerald Enhancements
            articles.add(createArticle(
                    "understanding-emerald-enhancements",
                    "Understanding Emerald Enhancements",
                    "Certification & Grading",
                    "Demystifying oiling, resin treatments, and what is considered acceptable in high-end emeralds.",
                    "/images/knowledge/emerald.png",
                    "Dr. Alistair Vance",
                    LocalDate.of(2023, 11, 5),
                    "5 min read",
                    false,
                    "[{\"type\":\"paragraph\",\"value\":\"Emeralds are uniquely prone to surface-reaching fractures. Because of this, it has been standard practice for centuries to treat rough emeralds with oil (like cedarwood oil) to improve their clarity.\"},{\"type\":\"heading\",\"value\":\"Acceptable vs. Unacceptable Treatments\"},{\"type\":\"paragraph\",\"value\":\"Minor to moderate oiling with natural cedarwood oil is entirely accepted in the trade. However, treatments involving colored oils or synthetic resins (like Opticon) are frowned upon in the high-end market.\"}]"
            ));

            // 7. Lost Mines of Kashmir
            articles.add(createArticle(
                    "the-lost-mines-of-kashmir",
                    "The Lost Mines of Kashmir",
                    "Gem History",
                    "The brief, legendary history of the sapphire mines that set the benchmark for blue forever.",
                    "/images/knowledge/kashmir-sapphire-mines.png",
                    "Sunil Weeraratne",
                    LocalDate.of(2023, 9, 18),
                    "6 min read",
                    false,
                    "[{\"type\":\"paragraph\",\"value\":\"In 1881, a landslide in the Zanskar range of the Himalayas revealed a pocket of sapphires the likes of which the world had never seen. The stones possessed a velvety, \\\"cornflower\\\" blue that seemed unaffected by changes in lighting.\"},{\"type\":\"quote\",\"value\":\"A Kashmir sapphire does not ask for attention; it demands it with quiet, undeniable authority.\"},{\"type\":\"paragraph\",\"value\":\"The original mines were largely exhausted within a decade. Today, a certified Kashmir sapphire is a multi-million dollar auction headliner, representing the absolute pinnacle of sapphire collecting.\"}]"
            ));

            // 8. How to Read a GRS Report
            articles.add(createArticle(
                    "how-to-read-a-grs-report",
                    "How to Read a GRS Report",
                    "Certification & Grading",
                    "A practical breakdown of the GemResearch Swisslab certification terminology.",
                    "/images/knowledge/cert.png",
                    "Elena Rostova",
                    LocalDate.of(2023, 8, 30),
                    "4 min read",
                    false,
                    "[{\"type\":\"paragraph\",\"value\":\"GemResearch Swisslab (GRS) is one of the most respected colored stone laboratories in the world, particularly famous for creating industry-standard color terms like \\\"Pigeon Blood\\\" and \\\"Muzo Green\\\".\"},{\"type\":\"heading\",\"value\":\"Deciphering the Comments Section\"},{\"type\":\"paragraph\",\"value\":\"The most critical section of any GRS report is the \\\"Comments\\\" field. An entry of \\\"No indication of thermal treatment\\\" is the golden phrase every investor looks for. If the stone is heated, it will be clearly denoted as \\\"H\\\" (heated), with further sub-grades indicating the presence of residues.\"}]"
            ));

            articleRepository.saveAll(articles);
            System.out.println("[INFO] " + articles.size() + " Knowledge Hub articles seeded successfully.");
        }
    }

    private Article createArticle(String slug, String title, String category, String excerpt,
                                  String coverImage, String author, LocalDate publishedDate,
                                  String readTime, Boolean featured, String contentBlocks) {
        Article a = new Article();
        a.setSlug(slug);
        a.setTitle(title);
        a.setCategory(category);
        a.setExcerpt(excerpt);
        a.setCoverImage(coverImage);
        a.setAuthor(author);
        a.setPublishedDate(publishedDate);
        a.setReadTime(readTime);
        a.setFeatured(featured != null ? featured : false);
        a.setContentBlocks(contentBlocks);
        return a;
    }
}
