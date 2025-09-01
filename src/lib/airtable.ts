// Airtable API configuration
const AIRTABLE_API_KEY = 'YOUR_AIRTABLE_API_KEY'; // Replace with your API key
const AIRTABLE_BASE_ID = 'YOUR_BASE_ID'; // Replace with your base ID
const AIRTABLE_TABLE_NAME = 'Applications'; // Your table name

export interface ApplicationData {
  name: string;
  email: string;
  studentNumber?: string;
  phone?: string;
  position_applied_for?: string;
  leadership?: string[];
  education?: string[];
  why_interested?: string;
  file_name?: string;
  created_at?: string;
}

export async function saveApplicationToAirtable(data: ApplicationData) {
  try {
    const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fields: {
          Name: data.name,
          Email: data.email,
          'Student Number': data.studentNumber || '',
          Phone: data.phone || '',
          'Position Applied For': data.position_applied_for || '',
          Leadership: data.leadership ? data.leadership.join(', ') : '',
          Education: data.education ? data.education.join(', ') : '',
          'Why Interested': data.why_interested || '',
          'File Name': data.file_name || '',
          'Created At': new Date().toISOString()
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return { success: true, id: result.id };
  } catch (error) {
    console.error('Error saving to Airtable:', error);
    throw error;
  }
}

export async function getApplicationsFromAirtable() {
  try {
    const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.records.map((record: any) => ({
      id: record.id,
      ...record.fields,
      created_at: record.fields['Created At']
    }));
  } catch (error) {
    console.error('Error fetching from Airtable:', error);
    throw error;
  }
}