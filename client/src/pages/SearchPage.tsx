import { useState, useEffect } from "react";
import { useDocuments } from "@/contexts/DocumentContext";
import DocumentCard from "@/components/DocumentCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter, Search, HelpCircle } from "lucide-react";
import { performSemanticSearch } from "@/lib/utils/mockNLP";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SearchResult extends Document {
  relevance: number;
  matchedText: string;
}

const SearchPage = () => {
  const { documents } = useDocuments();
  const [searchTerm, setSearchTerm] = useState("");
  const [fileTypeFilter, setFileTypeFilter] = useState<string>("all");
  const [semanticSearch, setSemanticSearch] = useState(true);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // Use setTimeout to simulate search delay
    setTimeout(() => {
      const filtered = documents.filter(
        doc => fileTypeFilter === "all" || doc.type === fileTypeFilter
      );
      
      const results = performSemanticSearch(
        filtered, 
        searchTerm, 
        semanticSearch
      );
      
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
  };

  // Perform search when search term, filter, or semantic search option changes
  useEffect(() => {
    if (searchTerm.trim()) {
      handleSearch();
    }
  }, [fileTypeFilter, semanticSearch]);

  // Handle search input with debounce
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm.trim()) {
        handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Search Documents</h3>
        <p className="text-muted-foreground">NLP-powered search finds related concepts and synonyms</p>
      </div>
      
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Input
                type="text"
                className="pl-10"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Select value={fileTypeFilter} onValueChange={setFileTypeFilter}>
              <SelectTrigger className="min-w-[120px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="docx">DOCX</SelectItem>
                <SelectItem value="txt">TXT</SelectItem>
                <SelectItem value="pptx">PPTX</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="flex items-center gap-1">
              <Filter className="h-5 w-5" />
              Filters
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="semantic-search" 
              checked={semanticSearch}
              onCheckedChange={(checked) => setSemanticSearch(checked as boolean)}
            />
            <label 
              htmlFor="semantic-search" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Semantic Search
            </label>
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-5 w-5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Semantic Search uses NLP to find documents with synonyms and related concepts, 
                  not just exact keyword matches.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      {/* Search Results */}
      <div>
        <div className="mb-3 flex justify-between items-center">
          <h3 className="text-lg font-medium">Search Results</h3>
          {searchTerm && (
            <p className="text-sm text-muted-foreground">
              {searchResults.length} results for <span className="text-primary">"{searchTerm}"</span>
            </p>
          )}
        </div>
        
        {isSearching ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-opacity-50 rounded-full border-t-primary"></div>
          </div>
        ) : searchTerm ? (
          searchResults.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No matching documents found.</p>
            </div>
          ) : (
            searchResults.map((result) => (
              <DocumentCard
                key={result.id}
                document={result}
                isSearchResult={true}
                onView={(id) => console.log("View", id)}
              />
            ))
          )
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>Enter a search term to find documents.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
