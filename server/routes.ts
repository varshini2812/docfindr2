import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertDocumentSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const apiRouter = express.Router();
  
  // GET all documents
  apiRouter.get("/documents", async (req, res) => {
    const documents = await storage.getDocuments();
    res.json(documents);
  });
  
  // GET a single document by id
  apiRouter.get("/documents/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid document ID" });
    }
    
    const document = await storage.getDocumentById(id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }
    
    res.json(document);
  });
  
  // POST a new document
  apiRouter.post("/documents", async (req, res) => {
    try {
      const documentData = insertDocumentSchema.parse(req.body);
      const newDocument = await storage.createDocument(documentData);
      res.status(201).json(newDocument);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid document data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating document" });
    }
  });
  
  // DELETE a document
  apiRouter.delete("/documents/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid document ID" });
    }
    
    const success = await storage.deleteDocument(id);
    if (!success) {
      return res.status(404).json({ message: "Document not found" });
    }
    
    res.status(204).send();
  });
  
  // PATCH/UPDATE a document
  apiRouter.patch("/documents/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid document ID" });
    }
    
    try {
      const updateData = insertDocumentSchema.partial().parse(req.body);
      const updatedDocument = await storage.updateDocument(id, updateData);
      
      if (!updatedDocument) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      res.json(updatedDocument);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid update data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating document" });
    }
  });
  
  // Search documents
  apiRouter.get("/search", async (req, res) => {
    const query = req.query.q as string;
    const semanticSearch = req.query.semantic !== 'false'; // Default to true
    
    if (!query || query.trim().length === 0) {
      return res.status(400).json({ message: "Search query cannot be empty" });
    }
    
    const results = await storage.searchDocuments(query, semanticSearch);
    res.json(results);
  });
  
  // Register the API routes
  app.use("/api", apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}
