import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pill, AlertCircle, CheckCircle2, Info } from "lucide-react";

interface Alternative {
  name: string;
  activeIngredient: string;
  dosage?: string;
  manufacturer?: string;
  notes?: string;
  similarity: string;
}

interface ResultsDisplayProps {
  originalMedicine: string;
  alternatives: Alternative[];
}

const ResultsDisplay = ({ originalMedicine, alternatives }: ResultsDisplayProps) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-primary/10">
            <Pill className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">Original Medicine</h3>
            <p className="text-2xl font-bold text-primary">{originalMedicine}</p>
          </div>
        </div>
      </Card>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold">Alternative Medicines</h3>
          <Badge variant="secondary" className="ml-auto">
            {alternatives.length} Found
          </Badge>
        </div>

        <div className="grid gap-4">
          {alternatives.map((alt, index) => (
            <Card 
              key={index} 
              className="p-5 hover:shadow-[var(--shadow-soft)] transition-shadow duration-300 border-border/50"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-1">{alt.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Active: <span className="font-medium text-foreground">{alt.activeIngredient}</span>
                  </p>
                </div>
                <Badge variant="outline" className="border-primary/30 text-primary">
                  {alt.similarity}
                </Badge>
              </div>

              {alt.dosage && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Info className="w-4 h-4" />
                  <span>Dosage: {alt.dosage}</span>
                </div>
              )}

              {alt.manufacturer && (
                <p className="text-sm text-muted-foreground mb-2">
                  Manufacturer: <span className="font-medium">{alt.manufacturer}</span>
                </p>
              )}

              {alt.notes && (
                <div className="mt-3 p-3 bg-secondary rounded-lg">
                  <div className="flex gap-2">
                    <AlertCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">{alt.notes}</p>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      <Card className="p-4 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-900 dark:text-amber-100">
            <p className="font-semibold mb-1">Medical Disclaimer</p>
            <p>Always consult with a healthcare professional before switching medications. This tool provides informational suggestions only.</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ResultsDisplay;
