package com.backend.resumeai.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.embedding.EmbeddingResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.Map;

@RestController
public class EmbeddingController {

    private static final Logger logger = LoggerFactory.getLogger(EmbeddingController.class);

    private final EmbeddingModel embeddingModel;

    @Autowired
    public EmbeddingController(@Qualifier("azureOpenAiEmbeddingModel") EmbeddingModel embeddingModel) {
        this.embeddingModel = embeddingModel;
    }

    @GetMapping("/ai/embedding")
    @ResponseBody
    public Map<String, EmbeddingResponse> embed(@RequestParam(value = "input", defaultValue = "Tell me a joke") String message) {

        logger.info("Received request to /ai/embedding with input: {}", message);

        try {
            EmbeddingResponse embeddingResponse = this.embeddingModel.embedForResponse(List.of(message));

            logger.info("Embedding response: {}", embeddingResponse);

            return Map.of("embedding", embeddingResponse);
        } catch (Exception e) {
            logger.error("Error generating embedding: {}", e.getMessage(), e);
            throw e;
        }
    }
}
