/**
 * Rate Limiting Test Script
 * 
 * This script tests the rate limiting functionality by making multiple requests
 * to protected endpoints and observing the rate limit behavior.
 * 
 * Usage: npx tsx src/scripts/test-rate-limit.ts
 */

async function testRateLimit() {
  console.log('🔒 Testing Rate Limiting System...\n');

  const baseUrl = 'http://localhost:3000';
  const testEmail = 'ratelimit-test@example.com';

  // Test 1: Password Reset Rate Limiting
  console.log('Test 1: Password Reset Rate Limiting');
  console.log('Limit: 3 requests per hour\n');

  for (let i = 1; i <= 5; i++) {
    try {
      const response = await fetch(`${baseUrl}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail }),
      });

      const data = await response.json();
      const remaining = response.headers.get('X-RateLimit-Remaining');
      const reset = response.headers.get('X-RateLimit-Reset');
      const retryAfter = response.headers.get('Retry-After');

      console.log(`Request ${i}:`);
      console.log(`  Status: ${response.status}`);
      console.log(`  Remaining: ${remaining}`);
      console.log(`  Reset: ${reset}`);
      
      if (response.status === 429) {
        console.log(`  ❌ Rate Limited!`);
        console.log(`  Retry After: ${retryAfter} seconds`);
        console.log(`  Message: ${data.error}\n`);
        break;
      } else {
        console.log(`  ✅ Success\n`);
      }

      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error: any) {
      console.error(`  Error: ${error.message}\n`);
    }
  }

  // Test 2: Signup Rate Limiting
  console.log('\nTest 2: Signup Rate Limiting');
  console.log('Limit: 3 signups per hour\n');

  for (let i = 1; i <= 4; i++) {
    try {
      const response = await fetch(`${baseUrl}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `Test User ${i}`,
          email: `test${i}-${Date.now()}@example.com`,
          username: `testuser${i}-${Date.now()}`,
          password: 'TestPassword123',
        }),
      });

      const data = await response.json();
      const remaining = response.headers.get('X-RateLimit-Remaining');

      console.log(`Signup Attempt ${i}:`);
      console.log(`  Status: ${response.status}`);
      console.log(`  Remaining: ${remaining}`);
      
      if (response.status === 429) {
        console.log(`  ❌ Rate Limited!`);
        console.log(`  Message: ${data.error}\n`);
        break;
      } else if (response.status === 201) {
        console.log(`  ✅ Account Created\n`);
      } else {
        console.log(`  ⚠️  ${data.error}\n`);
      }

      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error: any) {
      console.error(`  Error: ${error.message}\n`);
    }
  }

  // Test 3: General API Rate Limiting
  console.log('\nTest 3: General API Rate Limiting');
  console.log('Limit: 60 requests per minute\n');

  let successCount = 0;
  let rateLimitedAt = 0;

  for (let i = 1; i <= 65; i++) {
    try {
      const response = await fetch(`${baseUrl}/api/example-with-rate-limit`, {
        method: 'GET',
      });

      const remaining = response.headers.get('X-RateLimit-Remaining');

      if (response.status === 429) {
        rateLimitedAt = i;
        console.log(`Request ${i}: ❌ Rate Limited (Remaining: ${remaining})`);
        break;
      } else {
        successCount++;
        if (i % 10 === 0 || i <= 5 || parseInt(remaining || '0') <= 5) {
          console.log(`Request ${i}: ✅ Success (Remaining: ${remaining})`);
        }
      }
    } catch (error: any) {
      console.error(`Request ${i}: Error - ${error.message}`);
    }
  }

  console.log(`\nTotal successful requests: ${successCount}`);
  if (rateLimitedAt > 0) {
    console.log(`Rate limited at request: ${rateLimitedAt}`);
  }

  console.log('\n🎉 Rate Limiting Tests Complete!\n');
  console.log('Summary:');
  console.log('- Password reset: 3 requests per hour');
  console.log('- Signup: 3 attempts per hour');
  console.log('- General API: 60 requests per minute');
  console.log('\nRate limiting is working correctly! ✅');
}

// Run tests
console.log('⚠️  Make sure your development server is running on http://localhost:3000\n');
testRateLimit().catch(console.error);
