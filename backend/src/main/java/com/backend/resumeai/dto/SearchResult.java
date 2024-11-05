package com.backend.resumeai.dto;


public class SearchResult {
    private String text;
    private double score;

    // Constructor
    public SearchResult(String text, double score) {
        this.text = text;
        this.score = score;
    }

    // Getters
    public String getText() {
        return text;
    }

    public double getScore() {
        return score;
    }
}
