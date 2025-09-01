'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function AdminPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<any>(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const response = await fetch('/api/applications');
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = (filePath: string, fileName: string) => {
    // In a real app, you'd serve the file from your server
    alert(`Would download file: ${filePath}`);
  };

  if (loading) {
    return <div className="p-8">Loading applications...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Applications</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>All Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell>{app.name}</TableCell>
                  <TableCell>{app.email}</TableCell>
                  <TableCell>{app.position || 'N/A'}</TableCell>
                  <TableCell>{new Date(app.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedApp(app)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {applications.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Application Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">Name</h3>
                <p>{selectedApp.name}</p>
              </div>
              <div>
                <h3 className="font-semibold">Email</h3>
                <p>{selectedApp.email}</p>
              </div>
              <div>
                <h3 className="font-semibold">Student Number</h3>
                <p>{selectedApp.student_number || 'N/A'}</p>
              </div>
              <div>
                <h3 className="font-semibold">Phone</h3>
                <p>{selectedApp.phone || 'N/A'}</p>
              </div>
              <div>
                <h3 className="font-semibold">Position Applied For</h3>
                <p>{selectedApp.position || 'N/A'}</p>
              </div>
              <div>
                <h3 className="font-semibold">Leadership Experience</h3>
                <ul className="list-disc pl-5">
                  {JSON.parse(selectedApp.leadership || '[]').map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold">Education</h3>
                <ul className="list-disc pl-5">
                  {JSON.parse(selectedApp.education || '[]').map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold">Why Interested</h3>
                <p className="whitespace-pre-line">{selectedApp.why_interested || 'N/A'}</p>
              </div>
              <div>
                <Button 
                  variant="outline"
                  onClick={() => downloadFile(selectedApp.file_path, `application_${selectedApp.id}.pdf`)}
                >
                  Download Application File
                </Button>
              </div>
              <div className="flex justify-end">
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
  );
}
