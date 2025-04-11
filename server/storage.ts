import { 
  users, type User, type InsertUser,
  documents, type Document, type InsertDocument
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Document operations
  getDocuments(): Promise<Document[]>;
  getDocumentById(id: number): Promise<Document | undefined>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocument(id: number, document: Partial<InsertDocument>): Promise<Document | undefined>;
  deleteDocument(id: number): Promise<boolean>;
  
  // Search operations
  searchDocuments(query: string, semanticSearch?: boolean): Promise<Document[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private documents: Map<number, Document>;
  private userCurrentId: number;
  private documentCurrentId: number;

  constructor() {
    this.users = new Map();
    this.documents = new Map();
    this.userCurrentId = 1;
    this.documentCurrentId = 1;
    
    // Add some mock documents
    this.createDocument({
      name: "Q1 Financial Report 2023.pdf",
      type: "pdf",
      size: 2.4 * 1024 * 1024,
      content: "This document contains financial growth analysis for Q1 2023. Revenue increased by 15% compared to previous quarter. Market expansion led to economic growth across all sectors.",
    });
    
    this.createDocument({
      name: "Project Proposal.docx",
      type: "docx",
      size: 1.8 * 1024 * 1024,
      content: "Detailed proposal for the new market expansion project. Includes budget allocation, resource requirements, and expected revenue increase.",
    });
    
    this.createDocument({
      name: "Sales Presentation.pptx",
      type: "pptx",
      size: 5.1 * 1024 * 1024,
      content: "Quarterly sales presentation showing financial growth, customer acquisition metrics, and revenue projections.",
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Document methods
  async getDocuments(): Promise<Document[]> {
    return Array.from(this.documents.values());
  }

  async getDocumentById(id: number): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = this.documentCurrentId++;
    const document: Document = { 
      ...insertDocument, 
      id, 
      uploadDate: new Date() 
    };
    this.documents.set(id, document);
    return document;
  }

  async updateDocument(id: number, updateData: Partial<InsertDocument>): Promise<Document | undefined> {
    const document = this.documents.get(id);
    if (!document) return undefined;
    
    const updatedDocument = { ...document, ...updateData };
    this.documents.set(id, updatedDocument);
    return updatedDocument;
  }

  async deleteDocument(id: number): Promise<boolean> {
    return this.documents.delete(id);
  }

  // Search operations
  async searchDocuments(query: string, semanticSearch: boolean = true): Promise<Document[]> {
    const allDocuments = Array.from(this.documents.values());
    const queryLower = query.toLowerCase();
    
    // Simple search implementation
    // In a real app, this would use a more sophisticated NLP approach
    const results = allDocuments.filter(doc => {
      const content = (doc.content || '').toLowerCase();
      const name = doc.name.toLowerCase();
      
      // Exact match
      if (content.includes(queryLower) || name.includes(queryLower)) {
        return true;
      }
      
      // Semantic search (simple implementation)
      if (semanticSearch) {
        // Check for related terms (very simplified)
        const semanticKeywords: Record<string, string[]> = {
          'financial': ['revenue', 'monetary', 'economic', 'fiscal'],
          'growth': ['increase', 'expansion', 'development', 'rise'],
          'report': ['document', 'analysis', 'assessment'],
          'data': ['information', 'statistics', 'metrics'],
          'market': ['industry', 'sector', 'business']
        };
        
        // Check if any of the query words have semantic matches
        const queryWords = queryLower.split(/\s+/);
        return queryWords.some(word => {
          const relatedTerms = semanticKeywords[word] || [];
          return relatedTerms.some(term => 
            content.includes(term) || name.includes(term)
          );
        });
      }
      
      return false;
    });
    
    return results;
  }
}

export const storage = new MemStorage();
