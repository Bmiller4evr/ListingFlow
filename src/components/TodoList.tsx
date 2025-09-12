import { useState, useEffect } from "react";
import { 
  CheckSquare, Search, 
  CheckCircle, Circle, Upload,
  Building, Home, CalendarDays, FileText, ClipboardCheck, Tag
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { mockTodoItems, TodoItem } from "../data/calendarMock";
import { mockListings } from "../data/mockData";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { FileUpload } from "./ui/file-upload";
import { useIsMobile } from "./ui/use-mobile";
import { toast } from "sonner@2.0.3";

export function TodoList() {
  const isMobile = useIsMobile();
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<TodoItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedTodoForUpload, setSelectedTodoForUpload] = useState<TodoItem | null>(null);

  // Initialize todos from mock data
  useEffect(() => {
    setTodos(mockTodoItems);
    setFilteredTodos(mockTodoItems);
    
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Apply search filter and default sorting by due date
  useEffect(() => {
    let filtered = todos;
    
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(todo => 
        todo.title.toLowerCase().includes(term) || 
        (todo.description && todo.description.toLowerCase().includes(term)) ||
        (todo.propertyAddress && todo.propertyAddress.toLowerCase().includes(term))
      );
    }
    
    // Sort by completion status first (completed items at bottom), then by due date
    filtered = [...filtered].sort((a, b) => {
      // First, sort by completion status (uncompleted first)
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      // Then sort by due date (with overdue and today first)
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
    
    setFilteredTodos(filtered);
  }, [todos, searchTerm]);

  // Toggle completion status of a todo
  const toggleTodoStatus = (todoId: string) => {
    setTodos(prevTodos => 
      prevTodos.map(todo => 
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };





  // Handle opening upload dialog for document todos
  const handleUploadDocument = (todo: TodoItem) => {
    setSelectedTodoForUpload(todo);
    setShowUploadDialog(true);
  };

  // Handle file upload completion
  const handleFileUpload = (file: File | null) => {
    if (file && selectedTodoForUpload) {
      toast.success(`${file.name} uploaded successfully!`);
      
      // Mark the todo as completed
      toggleTodoStatus(selectedTodoForUpload.id);
      
      // Close dialog
      setShowUploadDialog(false);
      setSelectedTodoForUpload(null);
    }
  };

  // Get category badge and icon
  const getCategoryBadge = (category: string | undefined) => {
    if (!category) return null;
    
    switch (category) {
      case 'document':
        return (
          <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/20 gap-1">
            <FileText className="h-3 w-3" />
            Document
          </Badge>
        );
      case 'inspection':
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20 gap-1">
            <ClipboardCheck className="h-3 w-3" />
            Inspection
          </Badge>
        );
      case 'offer':
        return (
          <Badge variant="outline" className="bg-sky-500/10 text-sky-600 border-sky-500/20 gap-1">
            <FileText className="h-3 w-3" />
            Offer
          </Badge>
        );
      case 'closing':
        return (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 gap-1">
            <Building className="h-3 w-3" />
            Closing
          </Badge>
        );
      case 'general':
        return (
          <Badge variant="outline" className="bg-gray-500/10 text-gray-600 border-gray-500/20 gap-1">
            <Tag className="h-3 w-3" />
            General
          </Badge>
        );
      default:
        return null;
    }
  };

  // Format due date
  const formatDueDate = (dateString: string | undefined) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    const today = new Date("2025-05-31"); // Using the specified date as "today"
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    if (date < today) {
      return (
        <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 gap-1">
          <CalendarDays className="h-3 w-3" />
          Overdue
        </Badge>
      );
    } else if (date < tomorrow) {
      return (
        <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 gap-1">
          <CalendarDays className="h-3 w-3" />
          Today
        </Badge>
      );
    } else if (date < nextWeek) {
      return (
        <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 gap-1">
          <CalendarDays className="h-3 w-3" />
          {date.toLocaleDateString('en-US', { weekday: 'short' })}
        </Badge>
      );
    }
    
    return (
      <Badge variant="outline" className="bg-muted-foreground/10 text-muted-foreground gap-1">
        <CalendarDays className="h-3 w-3" />
        {date.toLocaleDateString()}
      </Badge>
    );
  };





  return (
    <div>
      <Card>
        <CardHeader className="pb-3">
          <div className={`${isMobile ? 'space-y-4' : 'flex justify-between items-center'}`}>
            <CardTitle className={isMobile ? 'text-center' : ''}>
              All Tasks
            </CardTitle>
            
            {/* Mobile Layout: Search only */}
            {isMobile ? (
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Search tasks..." 
                  className="pl-9 w-full h-12"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            ) : (
              /* Desktop Layout: Search only */
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Search tasks..." 
                  className="pl-9 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            )}
          </div>
          <CardDescription className="pt-1">
            {filteredTodos.length} {filteredTodos.length === 1 ? 'task' : 'tasks'} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-muted-foreground">Loading tasks...</p>
            </div>
          ) : filteredTodos.length === 0 ? (
            <div className="text-center py-12 border rounded-lg">
              <CheckSquare className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">No tasks found</p>
              {searchTerm && (
                <p className="text-sm text-muted-foreground">Try adjusting your search</p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTodos.map((todo) => (
                <div key={todo.id} className={`border ${isMobile ? 'p-3' : 'p-4'} rounded-lg ${todo.completed ? 'bg-muted/30' : ''}`}>
                  <div className={`${isMobile ? 'space-y-3' : 'flex items-start gap-3'}`}>
                    {/* Mobile: Horizontal layout for checkbox, title, and delete */}
                    {isMobile ? (
                      <>
                        <div className="flex items-start gap-3">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="rounded-full mt-0.5 p-0 h-6 w-6"
                            onClick={() => toggleTodoStatus(todo.id)}
                          >
                            {todo.completed ? (
                              <CheckCircle className="h-6 w-6 text-green-500" />
                            ) : (
                              <Circle className="h-6 w-6 text-muted-foreground/70" />
                            )}
                          </Button>
                          
                          <div className="flex-1">
                            <h4 className={`${todo.completed ? 'text-muted-foreground' : ''}`}>
                              {todo.title}
                            </h4>
                          </div>
                          

                        </div>
                        
                        {/* Mobile: Stack badges and description */}
                        <div className="ml-9 space-y-2">
                          {todo.description && (
                            <p className={`text-sm ${todo.completed ? 'text-muted-foreground/70' : 'text-muted-foreground'}`}>
                              {todo.description}
                            </p>
                          )}
                          
                          <div className="flex flex-wrap gap-2">
                            {todo.dueDate && formatDueDate(todo.dueDate)}
                            {getCategoryBadge(todo.category)}
                          </div>
                          
                          <div className="flex items-center gap-x-4 gap-y-1 flex-wrap text-sm text-muted-foreground">
                            {todo.propertyAddress && (
                              <div className="flex items-center gap-1">
                                <Home className="h-3.5 w-3.5" />
                                <span>{todo.propertyAddress.split(",")[0]}</span>
                              </div>
                            )}
                            
                            {todo.dueDate && (
                              <div className="flex items-center gap-1">
                                <CalendarDays className="h-3.5 w-3.5" />
                                <span>
                                  {new Date(todo.dueDate).toLocaleDateString()} 
                                  {todo.dueDate.includes("T") && ` at ${new Date(todo.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                                </span>
                              </div>
                            )}
                            
                            {todo.assignedTo && (
                              <div className="flex items-center gap-1">
                                <span>Assigned to {todo.assignedTo}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      /* Desktop: Original layout */
                      <>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="rounded-full mt-0.5 p-0 h-5 w-5"
                          onClick={() => toggleTodoStatus(todo.id)}
                        >
                          {todo.completed ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground/70" />
                          )}
                        </Button>
                        
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h4 className={`${todo.completed ? 'text-muted-foreground' : ''}`}>
                              {todo.title}
                            </h4>
                            {todo.dueDate && formatDueDate(todo.dueDate)}
                            {getCategoryBadge(todo.category)}
                          </div>
                          
                          {todo.description && (
                            <p className={`text-sm mb-2 ${todo.completed ? 'text-muted-foreground/70' : 'text-muted-foreground'}`}>
                              {todo.description}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-x-4 gap-y-1 flex-wrap text-sm text-muted-foreground">
                            {todo.propertyAddress && (
                              <div className="flex items-center gap-1">
                                <Home className="h-3.5 w-3.5" />
                                <span>{todo.propertyAddress.split(",")[0]}</span>
                              </div>
                            )}
                            
                            {todo.dueDate && (
                              <div className="flex items-center gap-1">
                                <CalendarDays className="h-3.5 w-3.5" />
                                <span>
                                  {new Date(todo.dueDate).toLocaleDateString()} 
                                  {todo.dueDate.includes("T") && ` at ${new Date(todo.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                                </span>
                              </div>
                            )}
                            
                            {todo.assignedTo && (
                              <div className="flex items-center gap-1">
                                <span>Assigned to {todo.assignedTo}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {/* Desktop Upload Button for Document Tasks */}
                          {todo.category === 'document' && !todo.completed && (
                            <Button 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUploadDocument(todo);
                              }}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Upload
                            </Button>
                          )}

                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
              )}
        </CardContent>
      </Card>

      {/* Document Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              {selectedTodoForUpload && (
                <>Upload documents for: <strong>{selectedTodoForUpload.title}</strong></>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <FileUpload
              onFileChange={handleFileUpload}
              acceptedFileTypes="application/pdf,image/*,.doc,.docx"
              maxSizeMB={10}
              buttonLabel="Choose Document"
              description="PDF, images, or Word documents up to 10MB"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}