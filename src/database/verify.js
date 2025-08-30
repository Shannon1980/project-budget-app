import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const sql = neon(process.env.REACT_APP_NEON_DATABASE_URL);

export const verifyDatabase = async () => {
  try {
    console.log('�� Verifying database setup...');
    
    // Check if tables exist
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    
    console.log('📋 Tables found:');
    tables.forEach(table => {
      console.log(`  ✅ ${table.table_name}`);
    });
    
    // Check table structures
    const expectedTables = ['employees', 'project_data', 'monthly_adjustments', 'users', 'forecast_scenarios'];
    
    for (const tableName of expectedTables) {
      const columns = await sql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = ${tableName}
        ORDER BY ordinal_position
      `;
      
      console.log(`\n📊 ${tableName} structure:`);
      columns.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type}`);
      });
    }
    
    console.log('\n✅ Database verification completed!');
    return { success: true };
  } catch (error) {
    console.error('❌ Error verifying database:', error);
    return { success: false, error: error.message };
  }
};

// Run verification if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  verifyDatabase()
    .then(result => {
      if (result.success) {
        console.log('🎉 Database verification completed!');
        process.exit(0);
      } else {
        console.error('💥 Database verification failed:', result.error);
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('💥 Unexpected error:', error);
      process.exit(1);
    });
}
