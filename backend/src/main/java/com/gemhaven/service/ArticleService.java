package com.gemhaven.service;

import com.gemhaven.model.Article;
import com.gemhaven.repository.ArticleRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Comparator;
import java.util.Locale;
import java.util.Objects;

@Service
@SuppressWarnings("null")
public class ArticleService {

    private final ArticleRepository articleRepository;

    public ArticleService(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    public List<Article> getAll(String category, Boolean featured, String search) {
        String normalizedCategory = category == null ? "" : category.trim();
        String query = search == null ? "" : search.trim().toLowerCase(Locale.ROOT);

        return articleRepository.findAll().stream()
                .filter(article -> normalizedCategory.isEmpty()
                        || "All".equalsIgnoreCase(normalizedCategory)
                        || normalizedCategory.equalsIgnoreCase(article.getCategory()))
                .filter(article -> featured == null
                        || Objects.equals(featured, article.getFeatured()))
                .filter(article -> query.isEmpty()
                        || containsIgnoreCase(article.getTitle(), query)
                        || containsIgnoreCase(article.getExcerpt(), query)
                        || containsIgnoreCase(article.getAuthor(), query)
                        || containsIgnoreCase(article.getCategory(), query))
                .sorted(Comparator.comparing(Article::getPublishedDate,
                        Comparator.nullsLast(Comparator.reverseOrder())))
                .toList();
    }

    private boolean containsIgnoreCase(String value, String query) {
        return value != null && value.toLowerCase(Locale.ROOT).contains(query);
    }

    public Article getById(Long id) {
        return articleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Article not found with id: " + id));
    }

    public Article getBySlug(String slug) {
        return articleRepository.findBySlug(slug)
                .orElseThrow(() -> new IllegalArgumentException("Article not found: " + slug));
    }

    public Article create(Article article) {
        if (article.getSlug() == null || article.getSlug().isBlank()) {
            String baseSlug = article.getTitle() != null
                    ? article.getTitle().toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("(^-|-$)", "")
                    : "article-" + System.currentTimeMillis();
            String slug = baseSlug;
            int counter = 1;
            while (articleRepository.findBySlug(slug).isPresent()) {
                slug = baseSlug + "-" + counter++;
            }
            article.setSlug(slug);
        }
        if (article.getPublishedDate() == null) {
            article.setPublishedDate(java.time.LocalDate.now());
        }
        if (article.getReadTime() == null || article.getReadTime().isBlank()) {
            article.setReadTime("5 min read");
        }
        return articleRepository.save(article);
    }

    @Transactional
    public Article update(Long id, Article updated) {
        Article existing = articleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Article not found: " + id));
        if (updated.getSlug() != null && !updated.getSlug().isBlank()) {
            existing.setSlug(updated.getSlug());
        }
        if (updated.getTitle() != null) existing.setTitle(updated.getTitle());
        if (updated.getCategory() != null) existing.setCategory(updated.getCategory());
        if (updated.getExcerpt() != null) existing.setExcerpt(updated.getExcerpt());
        if (updated.getCoverImage() != null) existing.setCoverImage(updated.getCoverImage());
        if (updated.getAuthor() != null) existing.setAuthor(updated.getAuthor());
        if (updated.getPublishedDate() != null) existing.setPublishedDate(updated.getPublishedDate());
        if (updated.getReadTime() != null) existing.setReadTime(updated.getReadTime());
        if (updated.getFeatured() != null) existing.setFeatured(updated.getFeatured());
        if (updated.getContentBlocks() != null) existing.setContentBlocks(updated.getContentBlocks());
        return articleRepository.save(existing);
    }

    public void delete(Long id) {
        Article existing = articleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Article not found: " + id));
        articleRepository.delete(existing);
    }
}
