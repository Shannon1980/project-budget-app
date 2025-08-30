import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const sql = neon(process.env.REACT_APP_NEON_DATABASE_URL);

export const testConnection = async () => {
  try {
    console.log('🔌 Testing database connection...');
    
    // Simple query to test connection
    const result = await sql`SELECT NOW() as current_time, version() as postgres_version`;
    
    console.log('✅ Connection successful!');
    console.log(`📅 Current time: ${result[0].current_time}`);
    console.log(`�� PostgreSQL version: ${result[0].postgres_version}`);
    
    return { success: true };
  } catch (error) {
    console.error('❌ Connection failed:', error);
    return { success: false, error: error.message };
  }
};

// Run test if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testConnection()
    .then(result => {
      if (result.success) {
        console.log('🎉 Connection test passed!');
        process.exit(0);
      } else {
        console.error('💥 Connection test failed:', result.error);
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('💥 Unexpected error:', error);
      process.exit(1);
    });
}
