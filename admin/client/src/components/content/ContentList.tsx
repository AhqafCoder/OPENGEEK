import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { FileText, Search, Plus, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';

interface ContentItem {
  id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

const ContentList = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // In a real implementation, you would call your actual API endpoint
        const response = await axios.get('/api/content');
        if (response.data.success) {
          setContent(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const filteredContent = content.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <FileText className="h-6 w-6 mr-2" />
          <h1 className="text-3xl font-bold">Content Management</h1>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Content
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Content Items</CardTitle>
          <CardDescription>
            Manage your platform content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center py-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">Loading content...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContent.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(item.updated_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="mr-2">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentList;
