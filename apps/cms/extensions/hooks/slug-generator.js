console.log('[Slug Hook] Extension module loaded');

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

  const sourceText = sources.map(s => payload[s]).filter(Boolean).join(' ');
  
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

export default ({ filter }) => {
  console.log('[Slug Hook] Registering filters...');

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
