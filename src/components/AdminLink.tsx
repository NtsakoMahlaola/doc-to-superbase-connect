import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminLink = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    const password = prompt("Enter admin password:");
    if (password === "rchAdmin@2026") {
      navigate("/admin");
    } else {
      alert("Incorrect password!");
    }
  };

  return (
    <div className="fixed bottom-4 right-4">
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleClick}
        className="bg-background/80 backdrop-blur-sm border shadow-lg hover:shadow-xl transition-shadow"
      >
        <Shield className="w-4 h-4 mr-2" />
        Admin Dashboard
      </Button>
    </div>
  );
};
