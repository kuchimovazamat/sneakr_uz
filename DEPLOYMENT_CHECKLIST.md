# Pre-Deployment Checklist

## Code Preparation

- [x] Updated `requirements.txt` with production dependencies (gunicorn, whitenoise, dj-database-url)
- [x] Created `build.sh` script for Render
- [x] Created `render.yaml` blueprint configuration
- [x] Updated `settings.py` with production configurations
- [x] Added WhiteNoise middleware for static files
- [x] Configured DATABASE_URL support
- [x] Added security settings for production
- [x] Updated frontend API URL to use environment variable
- [x] Created `.env.example` file

## Git Repository

- [ ] Commit all changes
  ```bash
  git add .
  git commit -m "Prepare for Render deployment"
  ```
- [ ] Push to GitHub/GitLab
  ```bash
  git push origin main
  ```

## Render Setup

### Database
- [ ] Create PostgreSQL database on Render
- [ ] Note down the Internal Database URL
- [ ] Verify database is in the same region as your web service

### Backend Service
- [ ] Create Web Service
- [ ] Connect Git repository
- [ ] Set Root Directory: `backend`
- [ ] Set Build Command: `./build.sh`
- [ ] Set Start Command: `gunicorn config.wsgi:application`
- [ ] Set Python Version: `3.14.2`

### Backend Environment Variables
- [ ] `SECRET_KEY` - Generate random key or let Render auto-generate
- [ ] `DEBUG` - Set to `False`
- [ ] `DATABASE_URL` - Paste from PostgreSQL service
- [ ] `ALLOWED_HOSTS` - Add your backend URL (e.g., `lovable-backend.onrender.com`)
- [ ] `CORS_ALLOWED_ORIGINS` - Add frontend URL (e.g., `https://lovable-frontend.onrender.com`)
- [ ] `TZ` - Set timezone (e.g., `Asia/Tashkent` or `UTC`)

### Frontend Service
- [ ] Create Static Site
- [ ] Connect Git repository
- [ ] Set Build Command: `npm install && npm run build`
- [ ] Set Publish Directory: `dist`

### Frontend Environment Variables
- [ ] `VITE_API_URL` - Set to backend URL (e.g., `https://lovable-backend.onrender.com/api`)
- [ ] `NODE_VERSION` - Set to `18`

## Post-Deployment

### Initial Setup
- [ ] Wait for services to deploy (check build logs)
- [ ] Verify backend is running (visit `/admin/`)
- [ ] Verify frontend is accessible

### Database Setup
- [ ] Connect to backend service shell
- [ ] Run migrations: `python manage.py migrate`
- [ ] Create superuser: `python manage.py createsuperuser`
  - Username: `azamat`
  - Password: Choose a strong password

### Data Migration
- [ ] Log in to admin panel
- [ ] Create brands
- [ ] Upload products with images
- [ ] Test order creation

### Testing
- [ ] Test frontend loads correctly
- [ ] Test API endpoints work
- [ ] Test product listing
- [ ] Test product detail pages
- [ ] Test checkout flow
- [ ] Test admin panel access
- [ ] Test image uploads
- [ ] Test order creation and admin display

### CORS Configuration
- [ ] Verify CORS_ALLOWED_ORIGINS includes frontend URL
- [ ] Test API calls from frontend (check browser console)
- [ ] Fix any CORS errors

## Media Files (Important!)

Render uses ephemeral storage - uploaded files will be deleted on each deploy.

Choose one option:

### Option A: Cloudinary (Recommended)
- [ ] Sign up at https://cloudinary.com
- [ ] Install: `pip install cloudinary django-cloudinary-storage`
- [ ] Update `requirements.txt`
- [ ] Configure in `settings.py`
- [ ] Set environment variables: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- [ ] Redeploy

### Option B: AWS S3
- [ ] Create S3 bucket
- [ ] Install: `pip install django-storages boto3`
- [ ] Configure in `settings.py`
- [ ] Set AWS credentials in environment variables
- [ ] Redeploy

### Option C: Render Disks (Paid)
- [ ] Upgrade to paid plan
- [ ] Add disk in Render dashboard
- [ ] Mount at `/opt/render/project/src/backend/media`
- [ ] Restart service

## Performance Optimization

- [ ] Enable database connection pooling
- [ ] Set up CDN for static files (optional)
- [ ] Configure browser caching
- [ ] Add database indexes for frequently queried fields
- [ ] Consider upgrading to paid tier for always-on service

## Monitoring & Maintenance

- [ ] Set up email alerts in Render dashboard
- [ ] Bookmark service logs URL
- [ ] Set up external monitoring (UptimeRobot, etc.)
- [ ] Schedule regular database backups
- [ ] Document admin credentials securely

## Custom Domain (Optional)

- [ ] Purchase domain
- [ ] Add custom domain in Render
- [ ] Update DNS records
- [ ] Update `ALLOWED_HOSTS`
- [ ] Update `CORS_ALLOWED_ORIGINS`
- [ ] Wait for SSL certificate provisioning

## Security Review

- [ ] Verify `DEBUG=False` in production
- [ ] Verify `SECRET_KEY` is strong and secret
- [ ] Verify HTTPS is enforced
- [ ] Review CORS settings
- [ ] Review ALLOWED_HOSTS
- [ ] Enable CSRF protection (default)
- [ ] Review admin panel access

## Documentation

- [ ] Update README with deployment info
- [ ] Document environment variables
- [ ] Document deployment process
- [ ] Share access with team members

## Rollback Plan

If something goes wrong:

1. Check build logs in Render dashboard
2. Check runtime logs for errors
3. Verify all environment variables are set correctly
4. Roll back to previous deployment in Render
5. Fix issues locally and redeploy

## Common Issues & Solutions

### Build fails
- Check `build.sh` is executable
- Verify all dependencies in `requirements.txt`
- Check Python version matches

### Database errors
- Verify `DATABASE_URL` is correct
- Check database service is running
- Ensure same region for web service and database

### Static files not loading
- Check `collectstatic` runs in build script
- Verify WhiteNoise is installed and configured
- Check STATIC_ROOT and STATIC_URL settings

### CORS errors
- Add frontend URL to `CORS_ALLOWED_ORIGINS`
- Include `https://` protocol
- Restart backend service

### Images not displaying
- Implement persistent storage (Cloudinary/S3/Disks)
- Check MEDIA_URL and MEDIA_ROOT settings
- Verify image upload permissions

## Success Criteria

✅ All checks complete when:
- [ ] Frontend loads without errors
- [ ] Products display with images
- [ ] Checkout creates orders successfully
- [ ] Orders appear in admin panel
- [ ] Admin can upload new products
- [ ] No CORS errors in browser console
- [ ] SSL certificate is active (HTTPS)
- [ ] All environment variables configured
- [ ] Media files persist after deployment

---

**Estimated Setup Time**: 30-60 minutes
**Next Steps**: Follow DEPLOYMENT.md for detailed instructions
