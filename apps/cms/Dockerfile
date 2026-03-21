FROM directus/directus:11.5

RUN corepack enable \
    && corepack prepare pnpm@9.15.0 --activate \
    && pnpm install @directus/storage-driver-s3

# Copy custom extensions (surgically to avoid wiping existing ones)
# We copy the specific hook folder instead of the parent extensions folder
COPY extensions/hooks/slug-generator/ /directus/extensions/hooks/slug-generator/

# Debug: list everything to see where extensions ended up
RUN ls -laR /directus/extensions/hooks

# Expose default Directus port
EXPOSE 8055

# The official image already sets the entrypoint to `npx directus`
# Railway will inject env vars at runtime — no .env file needed

