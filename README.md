# Respublica Application Portal

A modern web application for managing job applications, built with Next.js, TypeScript, and SQLite.

## Features

- Multi-step application form
- File upload functionality
- Responsive design with Tailwind CSS
- Form validation
- Database integration with SQLite
- Server-side API endpoints

## Prerequisites

- Node.js 18+ and npm
- Git

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd doc-to-hire
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```env
   DATABASE_URL=file:./applications.db
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`

## Project Structure

```
.
├── public/             # Static files
├── src/
│   ├── app/           # Next.js app directory
│   ├── components/     # React components
│   ├── lib/           # Utility functions and database config
│   └── styles/        # Global styles
├── .env               # Environment variables
├── package.json       # Project dependencies
└── README.md          # This file
```

## Testing

To test the application:

1. **File System Access Test**
   - Visit `http://localhost:3000/check-fs.html`
   - Click the "Test File System Access" button

2. **Database Test**
   - Send a POST request to `/api/test-db`
   - This will test database connectivity and return test data

## Deployment

### Prerequisites for Production
- Ensure all environment variables are properly set
- Set `NODE_ENV=production` in your production environment
- Configure a reverse proxy (like Nginx) for better performance

### Deployment Options

1. **Vercel** (Recommended for Next.js)
   - Push your code to a Git repository
   - Import the project in Vercel
   - Configure environment variables in the Vercel dashboard

2. **Self-hosted**
   - Build the application: `npm run build`
   - Start the production server: `npm run start`
   - The application will be available on port 3000 by default

## Troubleshooting

- **Database Connection Issues**
  - Verify the database file has proper read/write permissions
  - Check that the database file exists in the correct location
  - Ensure no other process is locking the database file

- **File Upload Issues**
  - Verify the uploads directory has proper write permissions
  - Check the maximum file size limit in your server configuration

## Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
