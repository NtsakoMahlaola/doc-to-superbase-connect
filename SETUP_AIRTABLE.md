# Airtable Setup Instructions

## 1. Create Airtable Account
- Go to [airtable.com](https://airtable.com) and create a free account

## 2. Create a Base
- Click "Create a base" -> "Start from scratch"
- Name it "Job Applications" or similar

## 3. Set Up Your Table
Create a table called "Applications" with these fields:

| Field Name | Field Type |
|------------|------------|
| Name | Single line text |
| Email | Email |
| Student Number | Single line text |
| Phone | Phone number |
| Position Applied For | Single line text |
| Leadership | Long text |
| Education | Long text |
| Why Interested | Long text |
| File Name | Single line text |
| Created At | Date (with time) |

## 4. Get Your API Credentials

### Get API Key:
1. Go to [airtable.com/create/tokens](https://airtable.com/create/tokens)
2. Click "Create new token"
3. Give it a name like "Job Applications"
4. Set scope to "data.records:read" and "data.records:write"
5. Select your base under "Access"
6. Copy the generated token

### Get Base ID:
1. Go to [airtable.com/api](https://airtable.com/api)
2. Select your base
3. The Base ID will be shown (starts with "app...")

## 5. Update Your Code
In `src/lib/airtable.ts`, replace:
- `YOUR_AIRTABLE_API_KEY` with your API token
- `YOUR_BASE_ID` with your Base ID

## 6. Access Your Admin Dashboard
- Visit `/admin` in your app to view all applications
- Data will be stored permanently in Airtable
- You can also view/manage data directly in Airtable

## Benefits:
- ✅ Permanent storage (data persists even after browser closes)
- ✅ Easy to view applications in spreadsheet format
- ✅ Can export data to Excel/CSV
- ✅ Multiple people can access the data
- ✅ Free tier supports up to 1,200 records per base