import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getApplicationsFromAirtable } from '@/lib/airtable';
import { toast } from '@/hooks/use-toast';

export default function AdminDashboard() {
  const [applications, setApplications] = useState<any[]>([]);
  const [localApplications, setLocalApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<any>(null);

  useEffect(() => {
    loadApplications();
    loadLocalApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const apps = await getApplicationsFromAirtable();
      setApplications(apps);
    } catch (error) {
      console.error('Error loading from Airtable:', error);
      toast({
        title: "Airtable Connection Failed",
        description: "Could not load applications from Airtable. Check your API configuration.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadLocalApplications = () => {
    const localApps = JSON.parse(localStorage.getItem('applications') || '[]');
    setLocalApplications(localApps);
  };

  const allApplications = [...applications, ...localApplications];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">Loading applications...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Application Dashboard</h1>
        
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{allApplications.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Airtable Storage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">{applications.length}</p>
              <p className="text-sm text-muted-foreground">Permanently stored</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Local Storage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-orange-600">{localApplications.length}</p>
              <p className="text-sm text-muted-foreground">Browser only</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Applications</CardTitle>
            <Button onClick={loadApplications} variant="outline">Refresh</Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Student Number</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Storage</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allApplications.map((app, index) => (
                  <TableRow key={app.id || index}>
                    <TableCell>{app.Name || app.name}</TableCell>
                    <TableCell>{app['Student Number'] || app.studentNumber || 'N/A'}</TableCell>
                    <TableCell>{app['Position Applied For'] || app.position_applied_for || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={applications.includes(app) ? "default" : "secondary"}>
                        {applications.includes(app) ? "Airtable" : "Local"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(app['Created At'] || app.created_at || app.submittedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedApp(app)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {allApplications.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No applications found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Application Details Modal */}
        {selectedApp && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Application Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold">Name</h3>
                  <p>{selectedApp.Name || selectedApp.name}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p>{selectedApp.Email || selectedApp.email}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Student Number</h3>
                  <p>{selectedApp['Student Number'] || selectedApp.studentNumber || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Phone</h3>
                  <p>{selectedApp.Phone || selectedApp.phone || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Position Applied For</h3>
                  <p>{selectedApp['Position Applied For'] || selectedApp.position_applied_for || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Leadership Experience</h3>
                  <div className="bg-muted p-3 rounded">
                    {(() => {
                      const leadership = selectedApp.Leadership || selectedApp.leadership;
                      if (typeof leadership === 'string') {
                        return leadership.split(', ').map((item: string, i: number) => (
                          <div key={i}>• {item}</div>
                        ));
                      } else if (Array.isArray(leadership)) {
                        return leadership.map((item: string, i: number) => (
                          <div key={i}>• {item}</div>
                        ));
                      }
                      return 'N/A';
                    })()}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">Education</h3>
                  <div className="bg-muted p-3 rounded">
                    {(() => {
                      const education = selectedApp.Education || selectedApp.education;
                      if (typeof education === 'string') {
                        return education.split(', ').map((item: string, i: number) => (
                          <div key={i}>• {item}</div>
                        ));
                      } else if (Array.isArray(education)) {
                        return education.map((item: string, i: number) => (
                          <div key={i}>• {item}</div>
                        ));
                      }
                      return 'N/A';
                    })()}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">Why Interested</h3>
                  <div className="bg-muted p-3 rounded whitespace-pre-line">
                    {selectedApp['Why Interested'] || selectedApp.why_interested || 'N/A'}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">Uploaded File</h3>
                  <p>{selectedApp['File Name'] || selectedApp.file_name || 'No file uploaded'}</p>
                </div>
                <div className="flex justify-end pt-4">
                  <Button 
                    variant="outline"
                    onClick={() => setSelectedApp(null)}
                  >
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}