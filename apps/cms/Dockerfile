FROM directus/directus:11.5

RUN corepack enable \
    && corepack prepare pnpm@9.15.0 --activate \
    && pnpm install @directus/storage-driver-s3

# Copy custom extensions with correct ownership for Directus
# The official image uses the 'node' user
COPY --chown=node:node extensions/ /directus/extensions/

# Verify final location
RUN ls -laR /directus/extensions/hooks

# Expose default Directus port
EXPOSE 8055

# The official image already sets the entrypoint to `npx directus`
# Railway will inject env vars at runtime — no .env file needed

