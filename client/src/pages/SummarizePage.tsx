import { useState } from "react";
import { useDocuments } from "@/contexts/DocumentContext";
import Dropzone from "@/components/Dropzone";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Download, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface SummaryPoint {
  text: string;
}

interface SummaryResult {
  title: string;
  fileType: string;
  pages: number;
  points: SummaryPoint[];
  themes: string[];
}

const SummarizePage = () => {
  const { documents } = useDocuments();
  const [selectedDocId, setSelectedDocId] = useState<string>("");
  const [summaryLength, setSummaryLength] = useState<number>(3);
  const [summaryFocus, setSummaryFocus] = useState<string>("key-points");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [summary, setSummary] = useState<SummaryResult | null>(null);
  const { toast } = useToast();

  const lengthLabels = ["Very Short", "Short", "Medium", "Long", "Very Long"];

  const generateSummary = () => {
    // Validate that a document is selected
    if (!selectedDocId && documents.length > 0) {
      toast({
        variant: "destructive",
        title: "No document selected",
        description: "Please select a document to summarize."
      });
      return;
    }
    
    // Find selected document
    const selectedDoc = documents.find(doc => doc.id === selectedDocId);
    
    setIsGenerating(true);
    setSummary(null);
    
    // Simulate progress updates
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 15) + 5;
      if (currentProgress > 100) currentProgress = 100;
      setProgress(currentProgress);
      
      if (currentProgress === 100) {
        clearInterval(progressInterval);
        
        // After "processing" is complete, show the mock summary
        setTimeout(() => {
          const mockSummary: SummaryResult = {
            title: selectedDoc?.name || "Document",
            fileType: selectedDoc?.type.toUpperCase() || "PDF",
            pages: 15,
            points: [
              { text: "Q1 revenue increased by 15% compared to previous quarter, primarily driven by expansion in international markets and introduction of new product lines." },
              { text: "Operating expenses reduced by 8% due to cost-saving initiatives and improved operational efficiency in manufacturing processes." },
              { text: "Customer acquisition costs decreased by 12% while customer retention rate improved to 89%, indicating successful marketing strategy adjustments." },
              { text: "Projected financial growth for Q2 estimates a 10-12% increase in revenue, contingent on market conditions and successful product launches." }
            ],
            themes: ["Revenue Growth", "Cost Optimization", "Market Expansion", "Customer Retention", "Operational Efficiency"]
          };
          
          setSummary(mockSummary);
          setIsGenerating(false);
        }, 500);
      }
    }, 300);
  };

  const copyToClipboard = () => {
    if (!summary) return;
    
    let summaryText = `Summary of ${summary.title}\n\n`;
    summaryText += `Key Points:\n`;
    summary.points.forEach((point, idx) => {
      summaryText += `${idx + 1}. ${point.text}\n`;
    });
    summaryText += `\nKey Themes: ${summary.themes.join(", ")}`;
    
    navigator.clipboard.writeText(summaryText);
    toast({
      title: "Summary copied to clipboard",
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Summarize Documents</h3>
        <p className="text-muted-foreground">AI-powered summarization helps extract key points from documents</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Document Selection */}
        <div>
          <div className="bg-gray-800 rounded-lg p-5 mb-4">
            <h4 className="font-medium mb-3">Select Document</h4>
            
            <div className="mb-4">
              <p className="text-sm mb-2">Choose from your uploaded documents</p>
              <Select value={selectedDocId} onValueChange={setSelectedDocId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a document" />
                </SelectTrigger>
                <SelectContent>
                  {documents.length === 0 ? (
                    <SelectItem value="none" disabled>No documents available</SelectItem>
                  ) : (
                    documents.map(doc => (
                      <SelectItem key={doc.id} value={doc.id}>
                        {doc.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <p className="text-sm mb-2">Or upload a new document</p>
              <Dropzone className="py-4 min-h-[120px]" />
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-5">
            <h4 className="font-medium mb-3">Summarization Options</h4>
            
            <div className="mb-4">
              <Label className="block text-sm mb-2">Summary Length</Label>
              <div className="space-y-4">
                <Slider 
                  value={[summaryLength]} 
                  min={1} 
                  max={5} 
                  step={1} 
                  onValueChange={(value) => setSummaryLength(value[0])}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  {lengthLabels.map((label, idx) => (
                    <span key={idx} className={idx + 1 === summaryLength ? "font-medium text-primary" : ""}>
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <Label className="block text-sm mb-2">Focus On</Label>
              <RadioGroup value={summaryFocus} onValueChange={setSummaryFocus} className="grid grid-cols-2 gap-2">
                <div className="flex items-center p-2 border border-gray-700 rounded-md hover:border-primary">
                  <RadioGroupItem value="key-points" id="key-points" className="mr-2" />
                  <Label htmlFor="key-points" className="text-sm">Key Points</Label>
                </div>
                <div className="flex items-center p-2 border border-gray-700 rounded-md hover:border-primary">
                  <RadioGroupItem value="concepts" id="concepts" className="mr-2" />
                  <Label htmlFor="concepts" className="text-sm">Concepts</Label>
                </div>
                <div className="flex items-center p-2 border border-gray-700 rounded-md hover:border-primary">
                  <RadioGroupItem value="action-items" id="action-items" className="mr-2" />
                  <Label htmlFor="action-items" className="text-sm">Action Items</Label>
                </div>
                <div className="flex items-center p-2 border border-gray-700 rounded-md hover:border-primary">
                  <RadioGroupItem value="statistics" id="statistics" className="mr-2" />
                  <Label htmlFor="statistics" className="text-sm">Statistics</Label>
                </div>
              </RadioGroup>
            </div>
            
            <Button
              className="w-full"
              onClick={generateSummary}
              disabled={isGenerating || (documents.length === 0 && !selectedDocId)}
            >
              {isGenerating ? "Generating..." : "Generate Summary"}
            </Button>
          </div>
        </div>
        
        {/* Summary Output */}
        <div className="bg-gray-800 rounded-lg p-5">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium">Summary Output</h4>
            {summary && (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={copyToClipboard}
                  className="text-muted-foreground hover:text-foreground rounded-full"
                >
                  <Copy className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground rounded-full"
                >
                  <Download className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>
          
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="mb-4 animate-spin h-8 w-8 border-4 border-primary border-opacity-50 rounded-full border-t-primary"></div>
              <p className="text-muted-foreground">Analyzing document and generating summary...</p>
              <div className="progress-bar mt-4 w-3/4">
                <Progress value={progress} className="h-1" />
              </div>
            </div>
          ) : summary ? (
            <div id="summary-output">
              {/* Document Info */}
              <div className="mb-4 pb-4 border-b border-gray-700">
                <h5 className="font-medium mb-1">{summary.title}</h5>
                <p className="text-sm text-muted-foreground">
                  {summary.fileType} • {summary.pages} pages • Summarized just now
                </p>
              </div>
              
              {/* Summary Content */}
              <div className="mb-6">
                <h5 className="font-medium mb-3 text-primary">Key Points</h5>
                <ul className="space-y-3">
                  {summary.points.map((point, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary flex-shrink-0 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span>{point.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Key Themes */}
              <div>
                <h5 className="font-medium mb-3 text-primary">Key Themes</h5>
                <div className="flex flex-wrap gap-2">
                  {summary.themes.map((theme, idx) => (
                    <Badge key={idx} variant="outline" className="bg-primary bg-opacity-10 text-primary">
                      {theme}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center h-60">
              <p className="text-muted-foreground mb-2">Select a document and click "Generate Summary"</p>
              <p className="text-sm text-muted-foreground">
                The AI will analyze the document and generate a concise summary with key points.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummarizePage;
