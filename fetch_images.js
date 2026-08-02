const gems = [
  'Ruby', 
  'Sapphire', 
  'Emerald', 
  'Padparadscha', 
  'Alexandrite', 
  'Tourmaline', 
  'Spinel', 
  'Rhodolite', 
  'Imperial Topaz',
  'Garnet'
];
const urls = {};
async function run() {
  for (const g of gems) {
    const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&titles=${encodeURIComponent(g)}&pithumbsize=600&format=json`);
    const data = await res.json();
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];
    if (pageId !== '-1' && pages[pageId].thumbnail) {
      urls[g] = pages[pageId].thumbnail.source;
    } else {
      urls[g] = 'Not found';
    }
  }
  console.log(JSON.stringify(urls, null, 2));
}
run();
