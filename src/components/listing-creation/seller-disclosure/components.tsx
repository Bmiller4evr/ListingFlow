import { Button } from "../../ui/button";
import { Info } from "lucide-react";
import { YNUButtonProps, DefinitionBoxProps } from "./types";

export const YNUButton = ({ value, currentValue, onChange, type }: YNUButtonProps) => {
  const isSelected = currentValue === type;
  const getButtonClass = () => {
    if (!isSelected) return 'border-border bg-background text-foreground hover:bg-muted';
    switch (type) {
      case 'Y': return 'border-green-500 bg-green-500 text-white';
      case 'N': return 'border-red-500 bg-red-500 text-white';
      case 'U': return 'border-amber-500 bg-amber-500 text-white';
      default: return 'border-border bg-background text-foreground';
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={`w-8 h-8 p-0 ${getButtonClass()}`}
      onClick={() => onChange(isSelected ? null : type)}
    >
      {type}
    </Button>
  );
};

export const DefinitionBox = ({ title, children }: DefinitionBoxProps) => (
  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mb-4">
    <div className="flex items-start gap-3">
      <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
      <div>
        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">{title}</h4>
        <div className="text-sm text-blue-700 dark:text-blue-300">{children}</div>
      </div>
    </div>
  </div>
);