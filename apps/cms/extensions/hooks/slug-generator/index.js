export default ({ filter }) => {
  const collections = [
    { name: 'productions', source: ['title'] },
    { name: 'events', source: ['title'] },
    { name: 'posts', source: ['title'] },
    { name: 'pages', source: ['title'] },
    { name: 'venues', source: ['name'] },
    { name: 'people', source: ['first_name', 'last_name'] }
  ];

  function generateSlug(payload, sources, existingSlug) {
    const sourceText = sources.map(s => payload[s]).filter(Boolean).join(' ');
    
    if (sourceText && !existingSlug) {
      let slug = sourceText
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove punctuation
        .trim()
        .replace(/[-\s]+/g, '-'); // Kebab-case and whitespace to dashes

      const MAX_LENGTH = 50;
      if (slug.length > MAX_LENGTH) {
        // Find last dash within the limit to avoid cutting words
        let lastDash = slug.lastIndexOf('-', MAX_LENGTH);
        if (lastDash > 0) {
          slug = slug.substring(0, lastDash);
        } else {
          // If no dash found, just hard cap
          slug = slug.substring(0, MAX_LENGTH);
        }
      }
      return slug;
    }
    return existingSlug;
  }

  collections.forEach(({ name, source }) => {
    filter(`${name}.items.create`, (payload) => {
      payload.slug = generateSlug(payload, source, payload.slug);
      return payload;
    });

    filter(`${name}.items.update`, (payload) => {
      payload.slug = generateSlug(payload, source, payload.slug);
      return payload;
    });
  });
};
