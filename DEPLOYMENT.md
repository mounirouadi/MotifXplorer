# 🚀 MotifXplorer Deployment Guide

## Pre-Deployment Checklist

✅ All features implemented and tested
✅ `.gitignore` configured to exclude unnecessary files
✅ Environment variables documented in `.env.example`
✅ Reverse proxy configured for HTTPS compatibility
✅ Debug mode for faster builds

---

## Production Server Details

**Server IP:** `134.129.255.146`

**Important:** The application code doesn't need the IP address. It uses relative paths (`/api/*`) that work on any domain/IP.

---

## Deployment Steps


```bash
# Clone repository
git clone https://github.com/yourusername/MotifXplorer.git
cd MotifXplorer

# Copy genome files (if you have them)
# This avoids downloading 9.5GB
mkdir -p backend/reference_genomes
# Copy hg19.fa, hg38.fa, MM9.fa to backend/reference_genomes/

# Create .env file for production
cp .env.example .env
nano .env  # Set DEBUG_MODE=true if you copied genome files

# Build and start
DEBUG_MODE=true docker compose up -d --build
```

### 3. Configure Domain/HTTPS

Your hosting provider should:
- Point your domain to `134.129.255.146:3000`
- Handle SSL/HTTPS termination
- Route HTTPS traffic to port 3000

**Example nginx config at hosting level:**
```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://134.129.255.146:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## Port Configuration

| Service | Internal Port | External Port | Accessible From |
|---------|---------------|---------------|-----------------|
| nginx | 80 | 3000 | Internet |
| frontend | 3001 | - | Internal only |
| backend | 4000 | - | Internal only |

**Only port 3000 needs to be accessible from outside.**

---

## Environment Variables

Create `.env` file on production server:

```bash
# For fresh deployment (will download genomes - slow!)
DEBUG_MODE=false

# For deployment with pre-copied genomes (fast!)
DEBUG_MODE=true
```

---

## Reference Genomes

The application requires these genome files in `backend/reference_genomes/`:
- `hg19.fa` (~3GB)
- `hg38.fa` (~3.1GB)
- `MM9.fa` (~2.6GB)

**Options:**

1. **Auto-download (slow):**
   - Set `DEBUG_MODE=false`
   - First build will download all genomes
   
2. **Pre-copy (recommended):**
   - Copy genome files to `backend/reference_genomes/` before building
   - Set `DEBUG_MODE=true`
   - Much faster builds!

---

## Verify Deployment

After deployment, verify:

```bash
# Check containers are running
docker compose ps

# All 3 should show "Up"
# - motifxplorer-nginx-1
# - motifxplorer-frontend-1
# - motifxplorer-backend-1

# Check logs
docker compose logs

# Test API
curl http://localhost:3000
# Should return HTML

curl http://localhost:3000/api/
# Should return 404 (expected for root API endpoint)
```

---

## Testing with HTTPS Domain

Once deployed at `https://yourdomain.com`:

1. Open browser to `https://yourdomain.com`
2. Upload a BED file
3. Select reference genome
4. Process
5. **Verify in browser console:**
   - API calls should be `https://yourdomain.com/api/*`
   - **NO** mixed content errors ✅

---

## Troubleshooting

### Container Keeps Restarting
```bash
docker compose logs [service-name]
# Check error messages
```

### Can't Access from Outside
- Verify port 3000 is open on server firewall
- Check hosting provider routes domain to port 3000

### Mixed Content Errors
- Verify your domain uses HTTPS
- Check browser console for exact error
- API calls should use HTTPS, not HTTP

### Slow Performance
- Use `DEBUG_MODE=true` with pre-copied genomes
- Increase Docker memory allocation if needed

---

## Rollback

If something goes wrong:

```bash
# Stop containers
docker compose down

# Check previous commits
git log

# Rollback to previous version
git checkout [commit-hash]

# Rebuild
docker compose up -d --build
```

---

## Updating After Deployment

```bash
# On production server
cd MotifXplorer

# Pull latest changes
git pull origin main

# Rebuild only changed services
docker compose up -d --build

# Or rebuild everything
docker compose down
docker compose up -d --build
```

---

## Security Notes

- ✅ Backend and frontend are internal only (not exposed)
- ✅ Only nginx is accessible on port 3000
- ✅ All traffic routes through reverse proxy
- ✅ Session cleanup runs automatically
- ⚠️ For production, consider:
  - Rate limiting on nginx
  - User authentication if needed
  - Regular backups of genome files

---

## Support

For issues, check:
1. Container logs: `docker compose logs`
2. Browser console (F12) for frontend errors
3. Backend logs for API errors

Good luck with your deployment! 🚀
