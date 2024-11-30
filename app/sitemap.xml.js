// /pages/sitemap.xml.js
export async function getServerSideProps({ res }) {
    const baseUrl = 'https://pdfcat.robod.in/'; // Replace with your actual domain
  
    const staticPaths = [
      `${baseUrl}/`,
      // `${baseUrl}/about`,
      // `${baseUrl}/contact`,
      // Add any other static routes here
    ];
  
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${staticPaths
          .map((url) => `<url><loc>${url}</loc></url>`)
          .join('')}
      </urlset>`;
  
    res.setHeader('Content-Type', 'text/xml');
    res.write(sitemap);
    res.end();
  
    return { props: {} };
  }
  
  export default function SiteMap() {
    return null;
  }
  