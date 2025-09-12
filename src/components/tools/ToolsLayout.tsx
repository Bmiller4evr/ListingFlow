import { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";

interface ToolsLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  onBackClick: () => void;
}

export function ToolsLayout({ title, description, children, onBackClick }: ToolsLayoutProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <Button 
        variant="ghost" 
        className="mb-4 pl-0 flex items-center"
        onClick={onBackClick}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Button>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      
      {children}
    </div>
  );
}