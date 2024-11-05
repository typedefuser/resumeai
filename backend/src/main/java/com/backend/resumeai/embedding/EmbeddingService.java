package com.backend.resumeai.embedding;

import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.output.Response;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.EmbeddingSearchRequest;
import dev.langchain4j.store.embedding.EmbeddingSearchResult;

import com.backend.resumeai.dto.EmbeddingResult;
import com.backend.resumeai.dto.SearchResult;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing text embeddings and similarity searches using LangChain4j.
 */
@Service
public class EmbeddingService {
    private static final Logger log = LoggerFactory.getLogger(EmbeddingService.class);

    private final EmbeddingModel embeddingModel;
    private final EmbeddingStore<TextSegment> embeddingStore;

    public EmbeddingService(EmbeddingModel embeddingModel, EmbeddingStore<TextSegment> embeddingStore) {
        this.embeddingModel = embeddingModel;
        this.embeddingStore = embeddingStore;
    }

    /**
     * Generates and saves an embedding vector for the provided text.
     *
     * @param text The text to generate an embedding for
     * @return EmbeddingResult containing the operation status and result
     * @throws IllegalArgumentException if text is null or empty
     */
    public EmbeddingResult saveVector(String text) {
        validateText(text); // Validate input text

        try {
            TextSegment segment = TextSegment.from(text);
            Response<Embedding> response = embeddingModel.embed(segment.text());

            if (response == null || response.content() == null) {
                log.error("Embedding model returned invalid response for text: {}", text);
                return new EmbeddingResult(false, "Failed to generate embedding", null);
            }

            embeddingStore.add(response.content(), segment);
            log.debug("Successfully saved embedding for text of length: {}", text.length());
            return new EmbeddingResult(true, "Vector saved successfully", response.content().toString());

        } catch (Exception e) {
            log.error("Error saving vector for text: {}", text, e);
            return new EmbeddingResult(false, "Error saving vector: " + e.getMessage(), null);
        }
    }

    /**
     * Searches for similar texts based on the provided query text.
     *
     * @param queryText The text to find similarities for
     * @param maxResults Maximum number of results to return
     * @return List of SearchResult containing similar texts and their similarity scores
     * @throws IllegalArgumentException if queryText is null or empty or maxResults is less than 1
     */
    public List<SearchResult> searchSimilarTexts(String queryText, int maxResults) {
        validateQuery(queryText, maxResults); // Validate input query

        try {
            Response<Embedding> queryResponse = embeddingModel.embed(queryText);

            if (queryResponse == null || queryResponse.content() == null) {
                log.error("Failed to generate embedding for query text: {}", queryText);
                return Collections.emptyList();
            }

            EmbeddingSearchRequest searchRequest = EmbeddingSearchRequest.builder()
                    .queryEmbedding(queryResponse.content())
                    .maxResults(maxResults)
                    .build();

            EmbeddingSearchResult<TextSegment> searchResult = embeddingStore.search(searchRequest);
            log.debug("Found {} similar texts for query", searchResult.matches().size());

            return searchResult.matches().stream()
                    .map(match -> new SearchResult(match.embedded().text(), match.score()))
                    .collect(Collectors.toList());

        } catch (Exception e) {
            log.error("Error searching for similar texts for query: {}", queryText, e);
            return Collections.emptyList();
        }
    }

    /**
     * Validates the input text.
     *
     * @param text The text to validate
     * @throws IllegalArgumentException if text is null or empty
     */
    private void validateText(String text) {
        if (!StringUtils.hasText(text)) {
            log.warn("Empty or null text provided to saveVector");
            throw new IllegalArgumentException("Text cannot be null or empty");
        }
    }

    /**
     * Validates the input query and maxResults.
     *
     * @param queryText The query text to validate
     * @param maxResults The maximum number of results to validate
     * @throws IllegalArgumentException if queryText is null or empty or maxResults is less than 1
     */
    private void validateQuery(String queryText, int maxResults) {
        if (!StringUtils.hasText(queryText)) {
            log.warn("Empty or null query text provided to searchSimilarTexts");
            throw new IllegalArgumentException("Query text cannot be null or empty");
        }
        if (maxResults < 1) {
            log.warn("Invalid maxResults value provided: {}", maxResults);
            throw new IllegalArgumentException("maxResults must be greater than 0");
        }
    }
}
