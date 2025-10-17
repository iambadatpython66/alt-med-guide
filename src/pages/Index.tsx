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
      let requestBody: any = {};

      if (image) {
        // Convert image to base64
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(image);
        });
        
        const base64 = await base64Promise;
        requestBody.imageBase64 = base64;
      } else {
        requestBody.medicineName = query;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-medicine`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      const result = await response.json();
      setResults(result);
      toast.success("Analysis complete! Found alternatives.");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to analyze";
      toast.error(errorMessage);
      console.error('Analysis error:', error);
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
