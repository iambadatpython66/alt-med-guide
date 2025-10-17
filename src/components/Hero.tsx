import { Pill } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-secondary py-20 px-4">
      <div className="container mx-auto max-w-5xl text-center">
        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 backdrop-blur-sm">
          <Pill className="w-10 h-10 text-primary" />
        </div>
        
        <h1 className="mb-6 text-5xl md:text-6xl font-bold tracking-tight text-foreground">
          Find Medicine Alternatives
          <span className="block mt-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Powered by AI
          </span>
        </h1>
        
        <p className="mb-8 text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Upload a photo of your medication or search by name. Our AI will instantly find safe, 
          effective alternatives using comprehensive pharmaceutical data.
        </p>

        <div className="flex flex-wrap gap-4 justify-center text-sm text-muted-foreground">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card shadow-sm">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <span>AI-Powered Analysis</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card shadow-sm">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <span>Verified Database</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card shadow-sm">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <span>Instant Results</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
