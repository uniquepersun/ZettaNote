# Production Dockerfile - serves pre-built Vite app with serve
FROM node:20-alpine

WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Copy pre-built files (built by GitHub Actions)
COPY dist ./dist

# Expose port 3000
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Serve the app on port 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
