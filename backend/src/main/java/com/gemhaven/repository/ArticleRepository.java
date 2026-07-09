package com.gemhaven.repository;

import com.gemhaven.model.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {

    Optional<Article> findBySlug(String slug);

    List<Article> findByCategory(String category);

    List<Article> findByFeaturedTrue();

    List<Article> findByCategoryOrderByPublishedDateDesc(String category);
}
