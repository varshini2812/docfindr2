import { 
  users, type User, type InsertUser,
  documents, type Document, type InsertDocument
} from "@shared/schema";

import * as fs from "fs";
import * as path from "path";

// Interface for storage operations
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getDocuments(): Promise<Document[]>;
  getDocumentById(id: number): Promise<Document | undefined>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocument(id: number, document: Partial<InsertDocument>): Promise<Document | undefined>;
  deleteDocument(id: number): Promise<boolean>;
  searchDocuments(query: string, semanticSearch?: boolean): Promise<Document[]>;
  summarizeDocument(id: number): Promise<string | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private documents: Map<number, Document> = new Map();
  private userCurrentId = 1;
  private documentCurrentId = 1;

  constructor() {
    this.createDocument({
      name: "ASE UNIT I.docx",
      type: "docx",
      size: 150 * 1024, // Approximate size
      content: `UNIT I\n\nBasic Statistics and Random Variables\n\nMeasures of central tendency: Mean, Median, Mode\n\nMoment, Skewness & Kurtosis\n\nRandom Variables - Discrete & Continuous\n\nProbability mass function and density functions\n\nConstants of random variables (Mean, Variance, Moments about mean)\n\nConcepts of Bivariate distributions\n\nCovariance`
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.username === username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const newUser: User = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }

  async getDocuments(): Promise<Document[]> {
    return Array.from(this.documents.values());
  }

  async getDocumentById(id: number): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async createDocument(document: InsertDocument): Promise<Document> {
    const id = this.documentCurrentId++;
    const newDoc: Document = { ...document, id, uploadDate: new Date() };
    this.documents.set(id, newDoc);
    return newDoc;
  }

  async updateDocument(id: number, updateData: Partial<InsertDocument>): Promise<Document | undefined> {
    const doc = this.documents.get(id);
    if (!doc) return undefined;
    const updatedDoc = { ...doc, ...updateData };
    this.documents.set(id, updatedDoc);
    return updatedDoc;
  }

  async deleteDocument(id: number): Promise<boolean> {
    return this.documents.delete(id);
  }

  async searchDocuments(query: string, semanticSearch: boolean = true): Promise<Document[]> {
    const allDocs = Array.from(this.documents.values());
    const queryLower = query.toLowerCase();

    const results = allDocs.filter(doc => {
      const content = (doc.content || '').toLowerCase();
      const name = doc.name.toLowerCase();

      if (content.includes(queryLower) || name.includes(queryLower)) return true;

      if (semanticSearch) {
        const semanticKeywords: Record<string, string[]> = {
          'statistics': ['mean', 'variance', 'probability'],
          'distribution': ['skewness', 'kurtosis', 'moment'],
          'random': ['discrete', 'continuous'],
          'organization': ['bus', 'register', 'instruction', 'control unit'],
          'rtl': ['register transfer language', 'register operations', 'control function', 'microoperations']
        };

        const queryWords = queryLower.split(/\s+/);
        return queryWords.some(word => {
          const related = semanticKeywords[word] || [];
          return related.some(term => content.includes(term) || name.includes(term));
        });
      }

      return false;
    });

    return results;
  }

  async summarizeDocument(id: number): Promise<string | undefined> {
    const doc = this.documents.get(id);
    if (!doc) return undefined;

    const content = doc.content.toLowerCase();

    const summaryPatterns: { keywords: string[], summary: string }[] = [
      {
        keywords: ["register transfer language", "rtl", "register operations", "common bus"],
        summary: `This document covers the Register Transfer Language (RTL), its symbolic representation, and applications in digital computer systems. It includes concepts of register operations, control functions, timing diagrams, memory transfer, common bus systems, arithmetic and logic operations, microoperations, and shift operations. It also introduces computer data representation formats including binary, octal, hexadecimal systems, and fixed/floating point arithmetic.`
      },
      {
        keywords: ["statistics", "mean", "variance", "skewness", "kurtosis"],
        summary: `This unit introduces basic concepts in statistics including measures of central tendency (mean, median, mode), distribution features like skewness and kurtosis, and types of random variables. It explains PMFs and PDFs, and covers constants such as mean and variance. It also touches on bivariate distributions and covariance.`
      }
    ];

    for (const pattern of summaryPatterns) {
      if (pattern.keywords.some(kw => content.includes(kw))) {
        return `Summary of ${doc.name}:\n\n${pattern.summary}`;
      }
    }

    return `No summary available for ${doc.name}.`;
  }
}

export const storage = new MemStorage();
