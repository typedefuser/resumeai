package com.backend.resumeai.embedding;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.azure.AzureOpenAiEmbeddingModel;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.store.embedding.pinecone.PineconeEmbeddingStore;
import dev.langchain4j.store.embedding.pinecone.PineconeServerlessIndexConfig;

@Configuration
public class EmbeddingConfig {

    @Value("${langchain4j.azure-open-ai.embedding-model.api-key}")
    private String azureApiKey;

    @Value("${langchain4j.azure-open-ai.embedding-model.deployment-name}")
    private String deploymentName;

    @Value("${langchain4j.azure-open-ai.embedding-model.endpoint}")
    private String endpoint;

    @Value("${langchain4j.azure-open-ai.embedding-model.api-version}")
    private String serviceVersion;

    @Value("${pinecone.api-key}")
    private String pineconeApiKey;

    @Value("${pinecone.index-name}")
    private String indexName;

    @Bean
    public EmbeddingModel embeddingModel() {
        return AzureOpenAiEmbeddingModel.builder()
                .apiKey(azureApiKey)
                .endpoint(endpoint)
                .deploymentName(deploymentName)
                .serviceVersion(serviceVersion)
                .logRequestsAndResponses(true)
                .build();
    }

    @Bean
    public EmbeddingStore<TextSegment> embeddingStore(EmbeddingModel embeddingModel) {
        return PineconeEmbeddingStore.builder()
                .apiKey(pineconeApiKey)
                .index(indexName)
                .nameSpace("resumeindex") // Use a consistent identifier
                .createIndex(PineconeServerlessIndexConfig.builder()
                        .cloud("AWS")
                        .region("us-east-1")
                        .dimension(1536)
                        .build())
                .build();
    }
}
