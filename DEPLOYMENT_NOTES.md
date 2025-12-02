# Deployment Notes

## Fixing @vercel/og Deployment Error

If you encounter this error during deployment:
```
Error: Cannot find module '/var/task/node_modules/next/dist/compiled/@vercel/og/index.node.js'
```

### Solution 1: Clear Git Cache (Recommended First Step)

Sometimes Vercel's build cache can cause issues. Clear it by:

1. **In Vercel Dashboard:**
   - Go to your project settings
   - Navigate to "Build & Development Settings"
   - Click "Clear Build Cache" or "Redeploy" with "Clear cache and redeploy"

2. **Or via Git:**
   ```bash
   # Clear Next.js cache locally
   rm -rf .next
   
   # Commit and push (this will trigger a fresh build)
   git add .
   git commit -m "Clear build cache"
   git push
   ```

### Solution 2: Verify Configuration

The `next.config.ts` has been configured with `outputFileTracingIncludes` to ensure `@vercel/og` is properly included in the deployment bundle.

### Solution 3: Verify Package Installation

Ensure `@vercel/og` is properly installed:

```bash
npm install @vercel/og@^0.8.5
```

### Solution 4: Check Runtime Configuration

The OG route (`app/api/og/route.tsx`) is correctly configured with:
- `export const runtime = 'nodejs';` - Required for @vercel/og

### If Issues Persist

1. **Check Vercel Build Logs:**
   - Look for any warnings about missing modules
   - Check if the build is using the correct Node.js version (should be 18.x or 20.x)

2. **Verify Package.json:**
   - Ensure `@vercel/og` is in `dependencies` (not `devDependencies`)
   - Current version: `"@vercel/og": "^0.8.5"`

3. **Try Explicit Installation:**
   ```bash
   npm install --save @vercel/og@0.8.5
   ```

4. **Check Node.js Version:**
   - In Vercel project settings, ensure Node.js version is 18.x or 20.x
   - `@vercel/og` requires a compatible Node.js version

## Current Configuration

- ✅ `next.config.ts` includes `outputFileTracingIncludes` for `/api/og`
- ✅ OG route has `runtime = 'nodejs'`
- ✅ `@vercel/og` is in dependencies
- ✅ Build passes locally

## Testing After Deployment

After deploying, test the OG image generation:
1. Visit: `https://your-domain.com/api/og`
2. Should return an image (not an error)
3. Check Vercel function logs for any runtime errors

