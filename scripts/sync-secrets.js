#!/usr/bin/env node

import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

/**
 * Sync local .dev.vars secrets to Cloudflare Workers
 */
async function syncSecrets() {
  const devVarsPath = path.join(process.cwd(), '.dev.vars');
  
  // Check if .dev.vars file exists
  if (!fs.existsSync(devVarsPath)) {
    console.error('❌ .dev.vars file not found');
    console.log('💡 Please run: npm run dev:setup');
    process.exit(1);
  }

  try {
    // Read .dev.vars file
    const devVarsContent = fs.readFileSync(devVarsPath, 'utf8');
    const lines = devVarsContent.split('\n').filter(line => 
      line.trim() && !line.trim().startsWith('#')
    );

    if (lines.length === 0) {
      console.log('⚠️  No secrets found in .dev.vars file');
      return;
    }

    console.log('🔄 Starting to sync secrets to Cloudflare Workers...\n');

    let successCount = 0;
    let errorCount = 0;

    for (const line of lines) {
      const [key, ...valueParts] = line.split('=');
      const value = valueParts.join('='); // Handle values containing = character

      if (!key || !value) {
        console.log(`⚠️  Skipping invalid line: ${line}`);
        continue;
      }

      const secretName = key.trim();
      let secretValue = value.trim();

      // Override ENVIRONMENT to 'production' for production deployment
      if (secretName === 'ENVIRONMENT') {
        secretValue = 'production';
        console.log(`📤 Syncing secret: ${secretName} (overriding to 'production')`);
      } else {
        console.log(`📤 Syncing secret: ${secretName}`);
      }

      try {
        // Use wrangler secret put command
        execSync(`echo "${secretValue}" | wrangler secret put "${secretName}"`, {
          stdio: ['pipe', 'pipe', 'pipe'],
          encoding: 'utf8'
        });
        
        console.log(`✅ ${secretName} synced successfully`);
        successCount++;
      } catch (error) {
        console.error(`❌ ${secretName} sync failed:`, error.message);
        errorCount++;
      }
    }

    console.log('\n📊 Sync results:');
    console.log(`✅ Success: ${successCount}`);
    console.log(`❌ Failed: ${errorCount}`);

    if (successCount > 0) {
      console.log('\n🎉 Secrets sync completed!');
      console.log('💡 You can run `npm run secrets:list` to view secrets in Cloudflare Workers');
    }

  } catch (error) {
    console.error('❌ Error during sync process:', error.message);
    process.exit(1);
  }
}

// Run sync
syncSecrets();
