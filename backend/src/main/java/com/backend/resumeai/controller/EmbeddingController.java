package com.backend.resumeai.controller;

import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.model.azure.AzureOpenAiEmbeddingModel;
import dev.langchain4j.model.output.Response;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class EmbeddingController {

    private final AzureOpenAiEmbeddingModel model;

    // Constructor-based dependency injection
    public EmbeddingController(
            @Value("${langchain4j.azure-open-ai.embedding-model.api-key}") String apiKey,
            @Value("${langchain4j.azure-open-ai.embedding-model.deployment-name}") String deploymentName,
            @Value("${langchain4j.azure-open-ai.embedding-model.endpoint}") String endpoint,
            @Value("${langchain4j.azure-open-ai.embedding-model.api-version}") String serviceVersion ){

        this.model = AzureOpenAiEmbeddingModel.builder()
                .apiKey(apiKey)
                .endpoint(endpoint)
                .deploymentName(deploymentName)
                .serviceVersion(serviceVersion)
                .logRequestsAndResponses(true)
                .build();
    }

    @PostMapping("/embed")
    public ResponseEntity<String> embedSentence(
            @RequestParam(defaultValue = "Please embed this sentence.") String sentence) {

        // Validate the input sentence if necessary
        if (sentence == null || sentence.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // Call the model to embed the sentence
        Response<Embedding> response = model.embed(sentence);

        // Check for the content in the response
        if (response.content() != null) {
            Embedding embedding = response.content();
            return ResponseEntity.ok(embedding.toString());
        } else {
            // Handle cases where the content might be null or other issues
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);  // Or handle as needed
        }
    }
}