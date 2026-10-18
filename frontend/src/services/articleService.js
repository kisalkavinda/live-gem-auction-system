import apiClient from './apiClient';

const SAVED_ARTICLES_KEY = 'gemhaven_saved_articles';

export function normalizeArticle(article) {
  if (!article) return null;

  let content = article.content;
  if (!Array.isArray(content)) {
    if (typeof article.contentBlocks === 'string') {
      try {
        content = JSON.parse(article.contentBlocks);
      } catch (error) {
        throw new Error('Article content blocks contain invalid JSON.', { cause: error });
      }
    } else if (Array.isArray(article.contentBlocks)) {
      content = article.contentBlocks;
    } else {
      content = [];
    }
  }

  return {
    ...article,
    content,
    coverImage: article.coverImage || '/images/knowledge/ruby.png',
    author: article.author || 'GemHaven Gemological Editorial',
    publishedDate: article.publishedDate || article.createdAt,
    readTime: article.readTime || '5 min read',
    category: article.category || 'Gem History',
  };
}

export async function fetchArticles(filters = {}) {
  const params = {};
  if (filters.category && filters.category !== 'All') {
    params.category = filters.category;
  }
  if (filters.featured !== undefined) {
    params.featured = filters.featured;
  }
  if (filters.search?.trim()) {
    params.search = filters.search.trim();
  }

  const response = await apiClient.get('/articles', { params });
  if (!Array.isArray(response.data)) {
    throw new Error('The articles API returned an invalid response.');
  }
  return response.data.map(normalizeArticle);
}

export async function fetchArticleBySlug(slug) {
  try {
    const response = await apiClient.get(`/articles/${encodeURIComponent(slug)}`);
    return normalizeArticle(response.data);
  } catch (error) {
    if (error.response?.status === 404) return null;
    throw error;
  }
}

export function getSavedArticleIds() {
  try {
    const stored = localStorage.getItem(SAVED_ARTICLES_KEY);
    const ids = stored ? JSON.parse(stored) : [];
    return Array.isArray(ids) ? ids.map(String) : [];
  } catch (error) {
    console.error('Could not read saved articles:', error);
    return [];
  }
}

export function toggleSavedArticle(id) {
  const articleId = String(id);
  const savedIds = getSavedArticleIds();
  const nextSavedIds = savedIds.includes(articleId)
    ? savedIds.filter(savedId => savedId !== articleId)
    : [...savedIds, articleId];
  localStorage.setItem(SAVED_ARTICLES_KEY, JSON.stringify(nextSavedIds));
  return nextSavedIds;
}
