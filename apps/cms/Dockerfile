FROM directus/directus:11.5

RUN corepack enable \
    && corepack prepare pnpm@9.15.0 --activate \
    && pnpm install @directus/storage-driver-s3

# Copy custom extensions with correct ownership for Directus
# We use the single-file hook format for maximum compatibility
COPY --chown=node:node extensions/hooks/slug-generator.js /directus/extensions/hooks/slug-generator.js

# Debug: Verifying location in the container
RUN ls -la /directus/extensions/hooks/

# Expose default Directus port
EXPOSE 8055

# The official image already sets the entrypoint to `npx directus`
# Railway will inject env vars at runtime — no .env file needed

