import { useState } from "react";
import Hero from "@/components/Hero";
import SearchInput from "@/components/SearchInput";
import ResultsDisplay from "@/components/ResultsDisplay";
import { toast } from "sonner";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleSearch = async (query: string, image?: File) => {
    setIsLoading(true);
    setResults(null);

    try {
      // TODO: Implement actual API call to Gemini AI via edge function
      // For now, showing mock data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResults = {
        originalMedicine: query || "Detected Medicine from Image",
        alternatives: [
          {
            name: "Generic Alternative A",
            activeIngredient: "Same Active Compound",
            dosage: "500mg",
            manufacturer: "Generic Pharma Co.",
            notes: "Cost-effective alternative with same efficacy",
            similarity: "95% Match"
          },
          {
            name: "Brand Alternative B",
            activeIngredient: "Similar Compound",
            dosage: "500mg",
            manufacturer: "Leading Pharma",
            notes: "Widely available in most pharmacies",
            similarity: "88% Match"
          },
          {
            name: "Generic Alternative C",
            activeIngredient: "Alternative Formula",
            dosage: "250mg x 2",
            manufacturer: "Trust Pharma",
            notes: "Different dosing schedule, similar results",
            similarity: "82% Match"
          }
        ]
      };

      setResults(mockResults);
      toast.success("Analysis complete! Found alternatives.");
    } catch (error) {
      toast.error("Failed to analyze. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary">
      <Hero />
      
      <main className="container mx-auto max-w-4xl px-4 py-12">
        <SearchInput onSearch={handleSearch} isLoading={isLoading} />
        
        {results && (
          <div className="mt-8">
            <ResultsDisplay 
              originalMedicine={results.originalMedicine}
              alternatives={results.alternatives}
            />
          </div>
        )}
      </main>

      <footer className="border-t border-border mt-20 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Data sourced from DrugBank.com • AI-powered analysis by Gemini</p>
          <p className="mt-2">This tool is for informational purposes only. Always consult a healthcare professional.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
