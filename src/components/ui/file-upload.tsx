import { ChangeEvent, forwardRef, useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { cn } from "./utils";
import { Upload, X, File, CheckCircle2 } from "lucide-react";

export interface FileUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onFileChange: (file: File | null) => void;
  acceptedFileTypes?: string;
  maxSizeMB?: number;
  currentFile?: File | null;
  className?: string;
  buttonLabel?: string;
  description?: string;
  error?: string;
  showPreview?: boolean;
}

export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  (
    {
      onFileChange,
      acceptedFileTypes = "application/pdf,image/*",
      maxSizeMB = 10,
      currentFile = null,
      className,
      buttonLabel = "Upload File",
      description = "PDF or image files up to 10MB",
      error,
      showPreview = true,
      ...props
    },
    ref
  ) => {
    const [dragActive, setDragActive] = useState(false);
    const [fileError, setFileError] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(currentFile);

    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    const validateFile = (file: File): boolean => {
      if (!acceptedFileTypes.includes(file.type.split('/')[0]) && 
          !acceptedFileTypes.includes(file.type)) {
        setFileError("File type not supported");
        return false;
      }

      if (file.size > maxSizeBytes) {
        setFileError(`File size exceeds ${maxSizeMB}MB limit`);
        return false;
      }

      setFileError(null);
      return true;
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0] || null;
      if (selectedFile) {
        if (validateFile(selectedFile)) {
          setFile(selectedFile);
          onFileChange(selectedFile);
        } else {
          onFileChange(null);
          e.target.value = "";
        }
      }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const droppedFile = e.dataTransfer.files?.[0];
      if (droppedFile) {
        if (validateFile(droppedFile)) {
          setFile(droppedFile);
          onFileChange(droppedFile);
        }
      }
    };

    const handleRemoveFile = () => {
      setFile(null);
      onFileChange(null);
      setFileError(null);
      // Reset the input value so the same file can be uploaded again
      const inputElement = document.getElementById(props.id || "file-upload") as HTMLInputElement;
      if (inputElement) {
        inputElement.value = "";
      }
    };

    // Format file size for display
    const formatFileSize = (bytes: number): string => {
      if (bytes < 1024) return bytes + ' B';
      const kb = bytes / 1024;
      if (kb < 1024) return kb.toFixed(1) + ' KB';
      const mb = kb / 1024;
      return mb.toFixed(1) + ' MB';
    };

    const getFileIcon = (fileName: string) => {
      const extension = fileName.split('.').pop()?.toLowerCase();
      
      if (extension === 'pdf') {
        return <File className="h-6 w-6 text-red-500" />;
      } else if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(extension || '')) {
        return <File className="h-6 w-6 text-blue-500" />;
      } else {
        return <File className="h-6 w-6 text-gray-500" />;
      }
    };

    return (
      <div className={cn("space-y-2", className)}>
        {!file ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
              dragActive
                ? "border-primary bg-primary/5"
                : "border-muted hover:border-muted-foreground/50",
              fileError && "border-destructive"
            )}
          >
            <Input
              id={props.id || "file-upload"}
              ref={ref}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept={acceptedFileTypes}
              {...props}
            />
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <div className="space-y-2">
              <label
                htmlFor={props.id || "file-upload"}
                className="block cursor-pointer bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm text-center mx-auto w-fit"
              >
                {buttonLabel}
              </label>
              <p className="text-xs text-muted-foreground">
                Drag and drop or {description}
              </p>
            </div>
          </div>
        ) : (
          showPreview && (
            <div className="flex items-center justify-between border rounded-md p-3 bg-accent/30">
              <div className="flex items-center gap-3">
                {getFileIcon(file.name)}
                <div className="overflow-hidden">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleRemoveFile}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove file</span>
                </Button>
              </div>
            </div>
          )
        )}
        {(fileError || error) && (
          <p className="text-destructive text-xs mt-1">{fileError || error}</p>
        )}
      </div>
    );
  }
);

FileUpload.displayName = "FileUpload";