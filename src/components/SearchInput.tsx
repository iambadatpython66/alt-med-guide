import { useState } from "react";
import { Upload, Search, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface SearchInputProps {
  onSearch: (query: string, image?: File) => void;
  isLoading: boolean;
}

const SearchInput = ({ onSearch, isLoading }: SearchInputProps) => {
  const [searchText, setSearchText] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image size should be less than 10MB");
        return;
      }
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSearch = () => {
    if (!searchText.trim()) {
      toast.error("Please enter a medicine name");
      return;
    }
    onSearch(searchText);
  };

  const handleImageSearch = () => {
    if (!selectedImage) {
      toast.error("Please upload an image");
      return;
    }
    onSearch("", selectedImage);
  };

  return (
    <Card className="p-6 shadow-[var(--shadow-card)] border-border/50">
      <Tabs defaultValue="text" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="text" className="gap-2">
            <Search className="w-4 h-4" />
            Search by Name
          </TabsTrigger>
          <TabsTrigger value="image" className="gap-2">
            <ImageIcon className="w-4 h-4" />
            Upload Image
          </TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="space-y-4">
          <div className="flex gap-3">
            <Input
              type="text"
              placeholder="Enter medicine name (e.g., Aspirin, Paracetamol)"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 h-12 text-base"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSearch} 
              className="h-12 px-6 gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              Search
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="image" className="space-y-4">
          <div className="space-y-4">
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-secondary/50 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="h-32 object-contain rounded-lg mb-2" />
                ) : (
                  <>
                    <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                  </>
                )}
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isLoading}
              />
            </label>
            
            <Button 
              onClick={handleImageSearch}
              className="w-full h-12 gap-2"
              disabled={!selectedImage || isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              Analyze Image
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default SearchInput;
