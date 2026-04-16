console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}


let pages = [
    { url: '.', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'resume/', title: 'Resume' },
    { url: 'contact/', title: 'Contact' },
    { url: 'https://github.com/nithyanair1234', title: 'Profile' },
  ];
  
  // 2. Detect environment (Local vs GitHub Pages)
  // Replace "portfolio" with your actual repo name!
  const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
    ? "/" 
    : "/portfolio/"; // Must match your GitHub repo name exactly!
  
  // 3. Create the Nav container
  let nav = document.createElement('nav');
  document.body.prepend(nav);
  
  // 4. Loop and build the links
  for (let p of pages) {
    let url = p.url;
    let title = p.title;
  
    // Adjust URL for local vs live
    url = !url.startsWith('http') ? BASE_PATH + url : url;
  
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
  
    // Highlight current page
    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add('current');
    }
  
    // Open external links in new tab
    if (a.host !== location.host) {
      a.target = "_blank";
    }
  
    nav.append(a);
  }