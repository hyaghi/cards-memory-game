
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Star, Clock, Tag, Archive, Trash2, Search, X, Filter, ChevronDown } from 'lucide-react';
import { useGmail } from '@/hooks/useGmail';
import Card from '@/components/common/Card';
import EmptyState from '@/components/common/EmptyState';
import Loading from '@/components/common/Loading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const EmailList = () => {
  const { 
    emails, 
    unreadEmails, 
    importantEmails, 
    isLoading, 
    markAsRead, 
    markAsImportant,
    archiveEmail,
    deleteEmail,
    refreshEmails 
  } = useGmail();
  
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const filter = searchParams.get('filter');
    if (filter === 'unread') setActiveTab('unread');
    else if (filter === 'important') setActiveTab('important');
    else setActiveTab('all');
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    if (value === 'all') {
      searchParams.delete('filter');
    } else {
      searchParams.set('filter', value);
    }
    
    setSearchParams(searchParams);
  };

  const filteredEmails = () => {
    let filtered = emails;
    
    if (activeTab === 'unread') filtered = unreadEmails;
    else if (activeTab === 'important') filtered = importantEmails;
    
    if (searchQuery) {
      return filtered?.filter(email => 
        email.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.snippet?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.from?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.from?.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  };

  const toggleEmailSelection = (id: string) => {
    setSelectedEmails(prev => 
      prev.includes(id) 
        ? prev.filter(emailId => emailId !== id) 
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedEmails.length === filteredEmails()?.length) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(filteredEmails()?.map(email => email.id) || []);
    }
  };

  const handleBatchAction = (action: 'read' | 'important' | 'archive' | 'delete') => {
    if (selectedEmails.length === 0) return;
    
    selectedEmails.forEach(id => {
      switch (action) {
        case 'read':
          markAsRead(id);
          break;
        case 'important':
          markAsImportant(id);
          break;
        case 'archive':
          archiveEmail(id);
          break;
        case 'delete':
          deleteEmail(id);
          break;
      }
    });
    
    setSelectedEmails([]);
  };

  if (isLoading) {
    return <Loading className="h-64" text="Loading your emails..." />;
  }

  return (
    <div className="w-full animate-fade-in">
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="w-full md:w-auto">
          <h1 className="text-2xl font-semibold mb-1">Emails</h1>
          <p className="text-sm text-muted-foreground">
            {filteredEmails()?.length} {activeTab === 'all' ? 'emails' : activeTab === 'unread' ? 'unread' : 'important'}
          </p>
        </div>
        
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search emails..." 
              className="pl-9 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => refreshEmails()}
              title="Refresh"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.8883 13.5C21.1645 18.3113 17.013 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C16.1031 2 19.6431 4.45712 21.346 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 8H21.4C21.7314 8 22 7.73137 22 7.4V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Button>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" title="Filter">
                  <Filter className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="space-y-4">
                  <h3 className="font-medium">Filter emails</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="unread" />
                      <label htmlFor="unread" className="text-sm cursor-pointer">Unread only</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="important" />
                      <label htmlFor="important" className="text-sm cursor-pointer">Important only</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="attachments" />
                      <label htmlFor="attachments" className="text-sm cursor-pointer">With attachments</label>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm">Reset</Button>
                    <Button size="sm">Apply</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="important">Important</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          {renderEmailList()}
        </TabsContent>
        <TabsContent value="unread" className="mt-0">
          {renderEmailList()}
        </TabsContent>
        <TabsContent value="important" className="mt-0">
          {renderEmailList()}
        </TabsContent>
      </Tabs>
    </div>
  );

  function renderEmailList() {
    const emailsToRender = filteredEmails();
    
    if (!emailsToRender || emailsToRender.length === 0) {
      return (
        <EmptyState 
          icon={<Mail />}
          title="No emails found"
          description={
            searchQuery 
              ? "Try adjusting your search query" 
              : activeTab === 'unread' 
                ? "You've read all your emails" 
                : activeTab === 'important' 
                  ? "No important emails"
                  : "Your inbox is empty"
          }
        />
      );
    }
    
    return (
      <>
        {selectedEmails.length > 0 && (
          <div className="flex items-center gap-3 mb-4 p-2 rounded-md bg-muted animate-slide-up">
            <span className="text-sm">{selectedEmails.length} selected</span>
            <div className="flex-1"></div>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleBatchAction('read')}
                title="Mark as read"
              >
                <Mail className="h-4 w-4 mr-1" />
                <span>Read</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleBatchAction('important')}
                title="Mark as important"
              >
                <Star className="h-4 w-4 mr-1" />
                <span>Important</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleBatchAction('archive')}
                title="Archive"
              >
                <Archive className="h-4 w-4 mr-1" />
                <span>Archive</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => handleBatchAction('delete')}
                title="Delete"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                <span>Delete</span>
              </Button>
            </div>
          </div>
        )}
      
        <div className="border border-border rounded-md overflow-hidden">
          <div className="flex items-center p-3 bg-muted/50 border-b border-border">
            <div className="flex items-center">
              <Checkbox 
                checked={selectedEmails.length > 0 && selectedEmails.length === emailsToRender.length}
                onCheckedChange={handleSelectAll}
                className="mr-2 h-4 w-4"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={handleSelectAll}>
                    {selectedEmails.length === emailsToRender.length ? 'Deselect all' : 'Select all'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedEmails([])}>
                    Clear selection
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="ml-4 text-xs text-muted-foreground hidden md:block">
              Showing {emailsToRender.length} {emailsToRender.length === 1 ? 'email' : 'emails'}
            </div>
          </div>
          
          <div className="divide-y divide-border">
            {emailsToRender.map((email) => (
              <div 
                key={email.id} 
                className="flex hover:bg-muted/30 transition-colors"
              >
                <div className="p-4 flex items-center">
                  <Checkbox 
                    checked={selectedEmails.includes(email.id)}
                    onCheckedChange={() => toggleEmailSelection(email.id)}
                    className="h-4 w-4"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                
                <div 
                  className="flex-1 flex items-start py-4 pr-4 cursor-pointer"
                  onClick={() => navigate(`/emails?id=${email.id}`)}
                >
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <p className={`font-medium text-sm ${!email.read ? 'font-semibold' : ''}`}>
                        {email.from?.name || email.from?.email}
                      </p>
                      <div className="ml-auto flex items-center gap-1">
                        <span className="text-xs text-muted-foreground">
                          {new Date(email.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                        {email.important && (
                          <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                        )}
                      </div>
                    </div>
                    <h3 className={`text-sm mb-1 ${!email.read ? 'font-medium' : ''}`}>
                      {email.subject}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-1">{email.snippet}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }
};

export default EmailList;
