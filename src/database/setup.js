import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const sql = neon(process.env.REACT_APP_NEON_DATABASE_URL);

export const setupDatabase = async () => {
  try {
    console.log('🚀 Setting up database schema...');
    
    // Read schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        console.log(`Executing: ${statement.substring(0, 50)}...`);
        await sql`${statement}`;
      }
    }
    
    console.log('✅ Database schema setup completed successfully!');
    return { success: true };
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    return { success: false, error: error.message };
  }
};

// Run setup if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupDatabase()
    .then(result => {
      if (result.success) {
        console.log('🎉 Database setup completed!');
        process.exit(0);
      } else {
        console.error('💥 Database setup failed:', result.error);
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('💥 Unexpected error:', error);
      process.exit(1);
    });
}
