// /pages/robots.txt.js
export function getServerSideProps({ res }) {
    const robotsContent = `User-agent: *
  Allow: /
  Sitemap: https://pdfcat.robod.in/sitemap.xml`;
  
    res.setHeader('Content-Type', 'text/plain');
    res.write(robotsContent);
    res.end();
  
    return { props: {} };
  }
  
  export default function Robots() {
    return null;
  }
  