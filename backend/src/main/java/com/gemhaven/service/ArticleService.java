package com.gemhaven.service;

import com.gemhaven.model.Article;
import com.gemhaven.repository.ArticleRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@SuppressWarnings("null")
public class ArticleService {

    private final ArticleRepository articleRepository;

    public ArticleService(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    public List<Article> getAll(String category, Boolean featured) {
        if (Boolean.TRUE.equals(featured)) {
            return articleRepository.findByFeaturedTrue();
        }
        if (category != null && !category.isBlank()) {
            return articleRepository.findByCategoryOrderByPublishedDateDesc(category);
        }
        return articleRepository.findAll();
    }

    public Article getBySlug(String slug) {
        return articleRepository.findBySlug(slug)
                .orElseThrow(() -> new IllegalArgumentException("Article not found: " + slug));
    }

    public Article create(Article article) {
        return articleRepository.save(article);
    }

    @Transactional
    public Article update(Long id, Article updated) {
        Article existing = articleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Article not found: " + id));
        existing.setSlug(updated.getSlug());
        existing.setTitle(updated.getTitle());
        existing.setCategory(updated.getCategory());
        existing.setExcerpt(updated.getExcerpt());
        existing.setCoverImage(updated.getCoverImage());
        existing.setAuthor(updated.getAuthor());
        existing.setPublishedDate(updated.getPublishedDate());
        existing.setReadTime(updated.getReadTime());
        existing.setFeatured(updated.getFeatured());
        existing.setContentBlocks(updated.getContentBlocks());
        return articleRepository.save(existing);
    }

    public void delete(Long id) {
        articleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Article not found: " + id));
        articleRepository.deleteById(id);
    }
}
