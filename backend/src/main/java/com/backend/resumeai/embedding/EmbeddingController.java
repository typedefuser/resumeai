package com.backend.resumeai.embedding;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.backend.resumeai.dto.EmbeddingResult;
import com.backend.resumeai.dto.SearchResult;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/embeddings")
public class EmbeddingController {

    private final EmbeddingService embeddingService;

    public EmbeddingController(EmbeddingService embeddingService) {
        this.embeddingService = embeddingService;
    }

    @PostMapping("/embed-and-save")
    public ResponseEntity<EmbeddingResult> embedAndSave(@RequestParam String text) {
        if (text == null || text.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(
                    new EmbeddingResult(false, "Text cannot be empty", null)
            );
        }

        EmbeddingResult result = embeddingService.saveVector(text);
        return result.isSuccess()
                ? ResponseEntity.ok(result)
                : ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
    }

    @GetMapping("/search")
    public ResponseEntity<List<SearchResult>> search(
            @RequestParam String query,
            @RequestParam(defaultValue = "5") int maxResults) {
        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        List<SearchResult> results = embeddingService.searchSimilarTexts(query, maxResults);
        return ResponseEntity.ok(results);
    }
}