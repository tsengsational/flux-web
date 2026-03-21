console.log('[Slug Hook] Extension module loaded');

export default ({ filter }) => {
  console.log('[Slug Hook] Registering filters...');

  const config = {
    productions: ['title'],
    events: ['title'],
    posts: ['title'],
    pages: ['title'],
    venues: ['name'],
    people: ['first_name', 'last_name']
  };

  function generateSlug(payload, collection) {
    const sources = config[collection];
    if (!sources) return;

    // Only generate if we have at least one source field in the payload
    // and the slug itself is not being set manually
    const sourceText = sources.map(s => payload[s]).filter(Boolean).join(' ');
    
    // Check if slug is present in payload (even if empty string)
    // If it's undefined, it wasn't sent, so we fill it.
    if (sourceText && payload.slug === undefined) {
      console.log(`[Slug Hook] Generating slug for ${collection} from: "${sourceText}"`);
      let slug = sourceText
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/[-\s]+/g, '-');

      const MAX_LENGTH = 50;
      if (slug.length > MAX_LENGTH) {
        let lastDash = slug.lastIndexOf('-', MAX_LENGTH);
        slug = lastDash > 0 ? slug.substring(0, lastDash) : slug.substring(0, MAX_LENGTH);
      }
      console.log(`[Slug Hook] Result: "${slug}"`);
      payload.slug = slug;
    }
  }

  // Use a wildcard filter if supported, or individual ones
  Object.keys(config).forEach((collection) => {
    filter(`${collection}.items.create`, (payload) => {
      console.log(`[Slug Hook] Create trigger for ${collection}`);
      generateSlug(payload, collection);
      return payload;
    });

    filter(`${collection}.items.update`, (payload) => {
      console.log(`[Slug Hook] Update trigger for ${collection}`);
      generateSlug(payload, collection);
      return payload;
    });
  });
};
