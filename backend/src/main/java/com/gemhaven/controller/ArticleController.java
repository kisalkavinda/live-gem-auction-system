package com.gemhaven.controller;

import com.gemhaven.model.Article;
import com.gemhaven.service.ArticleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/articles")
public class ArticleController {

    private final ArticleService articleService;

    public ArticleController(ArticleService articleService) {
        this.articleService = articleService;
    }

    /** GET /api/articles?category=&featured= */
    @GetMapping
    public ResponseEntity<List<Article>> getAll(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Boolean featured
    ) {
        return ResponseEntity.ok(articleService.getAll(category, featured));
    }

    /** GET /api/articles/{slug} */
    @GetMapping("/{slug}")
    public ResponseEntity<Article> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(articleService.getBySlug(slug));
    }

    /** POST /api/articles — ADMIN only */
    @PostMapping
    public ResponseEntity<Article> create(@RequestBody Article article) {
        return ResponseEntity.status(HttpStatus.CREATED).body(articleService.create(article));
    }

    /** PUT /api/articles/{id} — ADMIN only */
    @PutMapping("/{id}")
    public ResponseEntity<Article> update(@PathVariable Long id, @RequestBody Article article) {
        return ResponseEntity.ok(articleService.update(id, article));
    }

    /** DELETE /api/articles/{id} — ADMIN only */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Boolean>> delete(@PathVariable Long id) {
        articleService.delete(id);
        return ResponseEntity.ok(Map.of("deleted", true));
    }
}
