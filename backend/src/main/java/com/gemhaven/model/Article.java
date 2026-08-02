package com.gemhaven.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "articles")
public class Article {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, unique = true, length = 200)
    private String slug;

    @NotBlank
    @Column(nullable = false)
    private String title;

    @Column(length = 100)
    private String category;

    @Column(columnDefinition = "TEXT")
    private String excerpt;

    /** Frontend field name is "coverImage" (not coverImageUrl) */
    @Column(name = "cover_image")
    private String coverImage;

    @Column(length = 100)
    private String author;

    @Column(name = "published_date")
    private LocalDate publishedDate;

    /** Stored as a display string e.g. "5 min read" matching frontend shape */
    @Column(name = "read_time", length = 30)
    private String readTime;

    @Column(nullable = false)
    private Boolean featured = false;

    /**
     * JSONB array of content blocks matching frontend shape:
     * [{type: 'paragraph'|'heading'|'quote'|'image', value, url, caption}]
     */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "content_blocks", columnDefinition = "jsonb")
    private String contentBlocks;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    public Article() {}

    // ─── Getters & Setters ────────────────────────────────────────────────────

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getExcerpt() { return excerpt; }
    public void setExcerpt(String excerpt) { this.excerpt = excerpt; }

    public String getCoverImage() { return coverImage; }
    public void setCoverImage(String coverImage) { this.coverImage = coverImage; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public LocalDate getPublishedDate() { return publishedDate; }
    public void setPublishedDate(LocalDate publishedDate) { this.publishedDate = publishedDate; }

    public String getReadTime() { return readTime; }
    public void setReadTime(String readTime) { this.readTime = readTime; }

    public Boolean getFeatured() { return featured; }
    public void setFeatured(Boolean featured) { this.featured = featured; }

    public String getContentBlocks() { return contentBlocks; }
    public void setContentBlocks(String contentBlocks) { this.contentBlocks = contentBlocks; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}
