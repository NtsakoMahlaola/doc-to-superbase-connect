import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export const AdminLink = () => {
  return (
    <Link to="/admin" className="fixed bottom-4 right-4">
      <Button 
        variant="outline" 
        size="sm"
        className="bg-background/80 backdrop-blur-sm border shadow-lg hover:shadow-xl transition-shadow"
      >
        <Shield className="w-4 h-4 mr-2" />
        Admin Dashboard
      </Button>
    </Link>
  );
};