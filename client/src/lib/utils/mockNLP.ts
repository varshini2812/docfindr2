import { Document } from "@/components/DocumentCard";

// Sample synonyms and related concepts for common terms
interface KeywordMap {
  [key: string]: string[];
}

const synonymsMap: KeywordMap = {
  "financial": ["monetary", "fiscal", "economic", "revenue", "budgetary"],
  "growth": ["increase", "expansion", "development", "rise", "gain"],
  "report": ["document", "analysis", "assessment", "evaluation", "review"],
  "market": ["industry", "sector", "business", "commercial", "trade"],
  "research": ["study", "investigation", "analysis", "examination", "survey"],
  "data": ["information", "statistics", "figures", "metrics", "records"],
  "customer": ["client", "consumer", "user", "buyer", "patron"],
  "product": ["item", "merchandise", "goods", "commodity", "offering"],
  "sales": ["revenue", "income", "earnings", "turnover", "proceeds"],
  "strategy": ["plan", "approach", "method", "tactic", "procedure"],
  "innovation": ["invention", "creation", "advancement", "breakthrough", "development"],
  "technology": ["tech", "digital", "electronic", "IT", "computing"],
  "performance": ["achievement", "accomplishment", "result", "output", "efficiency"],
  "improvement": ["enhancement", "upgrade", "advancement", "progress", "refinement"],
  "challenge": ["problem", "difficulty", "obstacle", "issue", "hurdle"]
};

const relatedConceptsMap: KeywordMap = {
  "financial": ["profit", "investment", "cash flow", "assets", "capital"],
  "growth": ["profit margin", "market share", "scaling", "trajectory", "upward trend"],
  "report": ["findings", "conclusions", "recommendations", "insights", "summary"],
  "market": ["competition", "demand", "supply", "consumer behavior", "trends"],
  "research": ["methodology", "findings", "hypothesis", "data collection", "literature"],
  "data": ["analysis", "collection", "interpretation", "visualization", "insights"],
  "customer": ["satisfaction", "experience", "retention", "acquisition", "feedback"],
  "product": ["development", "design", "features", "quality", "lifecycle"],
  "sales": ["marketing", "conversion", "pipeline", "forecast", "quota"],
  "strategy": ["vision", "goals", "objectives", "implementation", "execution"],
  "innovation": ["disruption", "creativity", "R&D", "patents", "intellectual property"],
  "technology": ["software", "hardware", "infrastructure", "platform", "solution"],
  "performance": ["KPI", "metrics", "benchmark", "evaluation", "assessment"],
  "improvement": ["optimization", "streamlining", "iteration", "incremental change", "transformation"],
  "challenge": ["risk", "threat", "weakness", "limitation", "constraint"]
};

/**
 * Expand search terms with synonyms and related concepts
 * @param searchTerm The original search term
 * @param includeRelatedConcepts Whether to include related concepts
 * @returns Array of expanded search terms
 */
export const expandSearchTerms = (
  searchTerm: string,
  includeRelatedConcepts: boolean = true
): string[] => {
  const terms = searchTerm.toLowerCase().split(/\s+/);
  const expandedTerms = new Set<string>(terms);
  
  terms.forEach(term => {
    // Add original term
    expandedTerms.add(term);
    
    // Add synonyms
    if (synonymsMap[term]) {
      synonymsMap[term].forEach(synonym => expandedTerms.add(synonym));
    }
    
    // Add related concepts if enabled
    if (includeRelatedConcepts && relatedConceptsMap[term]) {
      relatedConceptsMap[term].forEach(concept => expandedTerms.add(concept));
    }
  });
  
  return Array.from(expandedTerms);
};

/**
 * Calculate relevance score for a document based on search terms
 * @param document The document to score
 * @param searchTerms Array of search terms
 * @returns Score between 0-100
 */
export const calculateRelevanceScore = (
  document: Document,
  searchTerms: string[]
): number => {
  // In a real implementation, this would use more sophisticated methods
  // like TF-IDF, word embeddings, etc.
  
  const docContent = (document.content || document.name).toLowerCase();
  const docWords = docContent.split(/\s+/);
  
  let matches = 0;
  let exactMatches = 0;
  
  searchTerms.forEach(term => {
    if (docContent.includes(term)) {
      matches++;
      
      // Count exact matches (the original search terms) with higher weight
      if (term === searchTerms[0]) {
        exactMatches++;
      }
    }
  });
  
  // Calculate score based on matches and document length
  // Higher weight for exact matches
  const score = Math.min(
    100,
    ((matches / searchTerms.length) * 60) + 
    ((exactMatches / searchTerms.length) * 40)
  );
  
  // Add some randomness to make it more realistic
  return Math.round(score * (0.9 + Math.random() * 0.2));
};

/**
 * Highlight matched terms in text
 * @param text Original text
 * @param searchTerms Terms to highlight
 * @returns HTML with highlighted terms
 */
export const highlightMatches = (
  text: string,
  searchTerms: string[],
  originalTerm: string
): string => {
  let result = text;
  
  // Highlight exact matches of the original search term
  const originalRegex = new RegExp(`(${originalTerm})`, 'gi');
  result = result.replace(originalRegex, '<span class="text-primary">$1</span>');
  
  // Highlight expanded terms (synonyms and related concepts)
  searchTerms.forEach(term => {
    if (term !== originalTerm) {
      const regex = new RegExp(`(${term})`, 'gi');
      result = result.replace(regex, '<span class="bg-yellow-400 bg-opacity-30 px-1 rounded text-yellow-200">$1</span>');
    }
  });
  
  return result;
};

/**
 * Extract context around matched terms
 * @param text Full document text
 * @param searchTerms Terms to find context for
 * @returns Text snippet with context
 */
export const extractContext = (
  text: string,
  searchTerms: string[]
): string => {
  const words = text.split(/\s+/);
  const contextSize = 10; // Words before and after match
  
  for (const term of searchTerms) {
    const lowerTerm = term.toLowerCase();
    for (let i = 0; i < words.length; i++) {
      if (words[i].toLowerCase().includes(lowerTerm)) {
        const start = Math.max(0, i - contextSize);
        const end = Math.min(words.length, i + contextSize + 1);
        return words.slice(start, end).join(' ') + '...';
      }
    }
  }
  
  // If no matches, return beginning of text
  return words.slice(0, 20).join(' ') + '...';
};

/**
 * Perform semantic search on documents
 * @param documents Array of documents to search
 * @param searchTerm The search term
 * @param semanticSearch Whether to use semantic search (synonyms/related concepts)
 * @returns Array of search results with relevance scores
 */
export const performSemanticSearch = (
  documents: Document[],
  searchTerm: string,
  semanticSearch: boolean = true
): Document[] => {
  // Get expanded search terms
  const expandedTerms = semanticSearch 
    ? expandSearchTerms(searchTerm, true)
    : [searchTerm.toLowerCase()];
  
  // Calculate relevance for each document
  const results = documents.map(doc => {
    // For demo purposes, create content if not present
    const content = doc.content || `This is sample content for ${doc.name} that might contain terms like ${searchTerm}, financial growth, revenue increase, and economic expansion.`;
    
    // Calculate relevance score
    const relevance = calculateRelevanceScore({ ...doc, content }, expandedTerms);
    
    // Only include documents with some relevance
    if (relevance > 0) {
      // Get context snippet with highlighted matches
      const contextSnippet = extractContext(content, expandedTerms);
      const highlightedText = highlightMatches(contextSnippet, expandedTerms, searchTerm);
      
      return {
        ...doc,
        relevance,
        matchedText: highlightedText,
      };
    }
    
    return { ...doc, relevance: 0, matchedText: '' };
  });
  
  // Filter out irrelevant results and sort by relevance
  return results
    .filter(doc => doc.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance);
};
