FROM directus/directus:11.5

# Install the S3 storage driver for Cloudflare R2 (S3-compatible)
RUN corepack enable \
    && corepack prepare pnpm@9.15.0 --activate \
    && pnpm install @directus/storage-driver-s3 directus-extension-editorjs

# Expose default Directus port
EXPOSE 8055

# The official image already sets the entrypoint to `npx directus`
# Railway will inject env vars at runtime — no .env file needed

