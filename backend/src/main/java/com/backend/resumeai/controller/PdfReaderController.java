package com.backend.resumeai.controller;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.ai.document.Document;
import org.springframework.ai.reader.pdf.PagePdfDocumentReader;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/pdf")
public class PdfReaderController {

    // Handles multipart/form-data requests with file upload
    @PostMapping(value = "/read", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> readPdfMultipart(@RequestParam("file") MultipartFile file) {
        try {
            // Process the file as MultipartFile
            File tempFile = File.createTempFile("temp", ".pdf");
            file.transferTo(tempFile);

            Map<String, Object> result = processPdf(tempFile);

            tempFile.delete();
            return ResponseEntity.ok(result);

        } catch (IOException e) {
            return handlePdfProcessingError(e);
        }
    }



    @PostMapping(value = "/read", consumes = {MediaType.APPLICATION_OCTET_STREAM_VALUE, MediaType.APPLICATION_PDF_VALUE})
    public ResponseEntity<Map<String, Object>> readPdfBytes(@RequestBody byte[] fileData) {
        if (fileData == null || fileData.length == 0) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Empty file data"));
        }

        File tempFile = null;
        try {
            // Create temp file in system temp directory
            tempFile = File.createTempFile("pdf_", ".pdf");

            // Write the byte array directly to the temp file
            try (FileOutputStream fos = new FileOutputStream(tempFile)) {
                fos.write(fileData);
                fos.flush();
            }

            // Create FileSystemResource from the temp file
            FileSystemResource resource = new FileSystemResource(tempFile);

            // Use Spring AI's PagePdfDocumentReader with Resource
            PagePdfDocumentReader pdfReader = new PagePdfDocumentReader(resource);
            List<Document> documents = pdfReader.get();

            Map<String, Object> result = new HashMap<>();
            result.put("pages", documents.size());
            result.put("content", documents.stream()
                    .map(Document::getContent)
                    .collect(Collectors.toList()));

            return ResponseEntity.ok(result);

        } catch (IOException e) {
            return handlePdfProcessingError(e);
        } finally {
            // Clean up temp file
            if (tempFile != null && tempFile.exists()) {
                tempFile.delete();
            }
        }
    }

    // Shared method to process PDF file
    private Map<String, Object> processPdf(File tempFile) throws IOException {
        PagePdfDocumentReader pdfReader = new PagePdfDocumentReader(String.valueOf(tempFile));
        List<Document> documents = pdfReader.get();

        Map<String, Object> result = new HashMap<>();
        List<Map<String, Object>> pages = new ArrayList<>();

        for (int i = 0; i < documents.size(); i++) {
            Document doc = documents.get(i);
            Map<String, Object> pageData = new HashMap<>();
            pageData.put("pageNumber", i + 1);
            pageData.put("content", doc.getContent());
            pageData.put("metadata", doc.getMetadata());
            pages.add(pageData);
        }

        result.put("totalPages", documents.size());
        result.put("pages", pages);

        return result;
    }

    // Error handling method
    private ResponseEntity<Map<String, Object>> handlePdfProcessingError(IOException e) {
        Map<String, Object> error = new HashMap<>();
        error.put("error", "Failed to process PDF: " + e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
