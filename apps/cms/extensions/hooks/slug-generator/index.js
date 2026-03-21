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
      console.log(`[Slug Hook] Generating slug from: "${sourceText}"`);
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
      return slug;
    }
    return existingSlug;
  }

  collections.forEach(({ name, source }) => {
    filter(`${name}.items.create`, (payload) => {
      console.log(`[Slug Hook] Create trigger for ${name}`);
      payload.slug = generateSlug(payload, source, payload.slug);
      return payload;
    });

    filter(`${name}.items.update`, (payload, meta) => {
      console.log(`[Slug Hook] Update trigger for ${name}`);
      payload.slug = generateSlug(payload, source, payload.slug);
      return payload;
    });
  });
};
