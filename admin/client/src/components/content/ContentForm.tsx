import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import axios from 'axios';

interface ContentFormProps {
  content?: {
    id: number;
    title: string;
    description: string;
  };
  isEditing?: boolean;
}

const ContentForm = ({ content, isEditing = false }: ContentFormProps) => {
  const [title, setTitle] = useState(content?.title || '');
  const [description, setDescription] = useState(content?.description || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEditing && content) {
        // Update existing content
        const response = await axios.put(`/api/content/${content.id}`, {
          title,
          description
        });
        
        if (response.data.success) {
          navigate('/admin/content');
        } else {
          setError(response.data.message);
        }
      } else {
        // Create new content
        const response = await axios.post('/api/content', {
          title,
          description
        });
        
        if (response.data.success) {
          navigate('/admin/content');
        } else {
          setError(response.data.message);
        }
      }
    } catch (err) {
      setError('Operation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Content' : 'Add Content'}</CardTitle>
          <CardDescription>
            {isEditing ? 'Update content details' : 'Create new content'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            
            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : (isEditing ? 'Update Content' : 'Add Content')}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/admin/content')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentForm;
