package com.backend.resumeai.dto;

public class EmbeddingResult {
    private boolean success;
    private String message;
    private String embeddingString;

    public EmbeddingResult(boolean success, String message, String embeddingString) {
        this.success = success;
        this.message = message;
        this.embeddingString = embeddingString;
    }

    public boolean isSuccess() {
        return success;
    }
}
