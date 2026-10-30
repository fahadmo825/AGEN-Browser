export interface SamplePage {
  url: string;
  title: string;
  contentHtml: string;
  readerArticle?: {
    title: string;
    author: string;
    publishedDate: string;
    readingTime: string;
    content: string[];
  };
}

export const SAMPLE_PAGES: Record<string, SamplePage> = {
  'https://en.wikipedia.org/wiki/Main_Page': {
    url: 'https://en.wikipedia.org/wiki/Main_Page',
    title: 'Wikipedia, the free encyclopedia',
    readerArticle: {
      title: 'Wikipedia: Welcome to the Free Encyclopedia',
      author: 'Wikimedia Community',
      publishedDate: 'Daily Featured',
      readingTime: '4 min read',
      content: [
        'Wikipedia is a free online encyclopedia, written and maintained by a community of volunteers through open collaboration and a wiki-based editing system.',
        'Its editors are known as Wikipedians. Wikipedia is the largest and most-read reference work in history. It is consistently ranked among the ten most popular websites in the world, and as of 2024, it is ranked fourth by Semrush and seventh by Similarweb.',
        'Fulguris Web Browser integrates seamlessly with Wikipedia via instant article previews, offline-capable reading modes, and clean font scaling.',
        'Knowledge belongs to all humanity, free of advertising and user tracking.'
      ]
    },
    contentHtml: `
      <div style="font-family: system-ui, sans-serif; padding: 24px; max-width: 900px; margin: 0 auto; color: inherit;">
        <header style="border-bottom: 2px solid rgba(120,120,120,0.3); padding-bottom: 16px; margin-bottom: 20px;">
          <h1 style="font-size: 2rem; margin: 0 0 8px 0;">Wikipedia</h1>
          <p style="margin: 0; color: #888; font-size: 1rem;">The Free Encyclopedia</p>
        </header>
        <div style="background: rgba(120,120,120,0.1); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <h2 style="font-size: 1.3rem; margin-top: 0; color: #3b82f6;">From today's featured article</h2>
          <p style="line-height: 1.6;"><strong>Fulguris</strong> (Latin for <em>lightning</em>) is an open-source, privacy-first Android web browser originally based on Lightning Browser. Built with Kotlin, it emphasizes high performance, tab management, built-in ABP ad-blocking, customizable themes, and robust privacy protections.</p>
          <p style="line-height: 1.6;">It incorporates advanced modern features such as D-pad cursor controllers for Android TV, custom user script engines, desktop rendering modes, Netscape bookmark import/export, and zero-telemetry private browsing.</p>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
          <div style="border: 1px solid rgba(120,120,120,0.2); border-radius: 8px; padding: 16px;">
            <h3 style="margin-top: 0; font-size: 1.1rem; color: #10b981;">Did you know...</h3>
            <ul style="padding-left: 20px; line-height: 1.6;">
              <li>...that Fulguris supports ABP syntax for custom ad-blocking rules?</li>
              <li>...that you can customize both top and bottom toolbar layouts?</li>
              <li>...that private tabs execute with isolated cache and strict cookie isolation?</li>
            </ul>
          </div>
          <div style="border: 1px solid rgba(120,120,120,0.2); border-radius: 8px; padding: 16px;">
            <h3 style="margin-top: 0; font-size: 1.1rem; color: #f59e0b;">In the news</h3>
            <ul style="padding-left: 20px; line-height: 1.6;">
              <li>Web privacy enhancements gain global adoption across modern mobile browsers.</li>
              <li>Open-source software alternatives demonstrate record benchmarks for memory efficiency.</li>
              <li>Web Standards committee introduces new reader mode and accessibility protocols.</li>
            </ul>
          </div>
        </div>
      </div>
    `
  },
  'https://github.com/Slion/Fulguris': {
    url: 'https://github.com/Slion/Fulguris',
    title: 'Slion/Fulguris: Fast, modern and privacy-focused Android browser',
    readerArticle: {
      title: 'Fulguris Browser: Open Source Architecture & Design',
      author: 'Stéphane Lenclud (Slion)',
      publishedDate: 'Active Project',
      readingTime: '5 min read',
      content: [
        'Fulguris is an Android web browser designed from the ground up for speed, fluid navigation, and uncompromising privacy.',
        'Key architectural components include an on-screen TV cursor controller, RxJava state orchestration, Hilt dependency injection, and a high-performance content blocker engine using Adblock Plus (ABP) syntax.',
        'Users can choose between multiple tab view modes (Desktop tab strip, drawer navigation, or swipeable previews) and toggle strict tracker blocking with zero background telemetry.'
      ]
    },
    contentHtml: `
      <div style="font-family: system-ui, sans-serif; padding: 24px; max-width: 900px; margin: 0 auto; color: inherit;">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
          <span style="font-size: 2.2rem;">⚡</span>
          <div>
            <h1 style="font-size: 1.6rem; margin: 0;">Slion / <strong>Fulguris</strong> <span style="font-size: 0.8rem; background: rgba(59,130,246,0.2); color: #60a5fa; padding: 2px 8px; border-radius: 12px; border: 1px solid rgba(59,130,246,0.3);">Public</span></h1>
            <p style="margin: 4px 0 0 0; color: #888;">Fulguris is a fast, modern and privacy-focused Android web browser.</p>
          </div>
        </div>
        <div style="display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap;">
          <span style="background: rgba(120,120,120,0.15); padding: 6px 12px; border-radius: 6px; font-size: 0.9rem;">⭐ 1.2k Stars</span>
          <span style="background: rgba(120,120,120,0.15); padding: 6px 12px; border-radius: 6px; font-size: 0.9rem;">🍴 280 Forks</span>
          <span style="background: rgba(120,120,120,0.15); padding: 6px 12px; border-radius: 6px; font-size: 0.9rem;">🏷️ v5.1.0-agent</span>
          <span style="background: rgba(16,185,129,0.15); color: #10b981; padding: 6px 12px; border-radius: 6px; font-size: 0.9rem;">Build: Passing</span>
        </div>
        <div style="border: 1px solid rgba(120,120,120,0.2); border-radius: 8px; overflow: hidden; margin-bottom: 24px;">
          <div style="background: rgba(120,120,120,0.1); padding: 12px 16px; font-weight: 600; border-bottom: 1px solid rgba(120,120,120,0.2);">
            README.md
          </div>
          <div style="padding: 20px; line-height: 1.6;">
            <h2 style="margin-top: 0;">Fulguris Web Browser</h2>
            <p>Fulguris is an open source browser for Android devices. Features include:</p>
            <ul>
              <li><strong>Speed & Privacy:</strong> Fast loading with built-in ad and tracker blocking.</li>
              <li><strong>Customizable Layout:</strong> Top or bottom address bar, accent themes, dark/AMOLED modes.</li>
              <li><strong>Tabs Management:</strong> Desktop tab strip, drawer view, private incognito tabs.</li>
              <li><strong>Reader View:</strong> Distraction-free article reading mode.</li>
              <li><strong>TV Cursor Controller:</strong> Hardware remote and gamepad navigation support.</li>
            </ul>
          </div>
        </div>
      </div>
    `
  },
  'https://news.ycombinator.com': {
    url: 'https://news.ycombinator.com',
    title: 'Hacker News',
    readerArticle: {
      title: 'Hacker News Digest',
      author: 'Y Combinator',
      publishedDate: 'Live Feed',
      readingTime: '3 min read',
      content: [
        'Top submissions from developers, researchers, and tech founders across the globe.',
        'Discussions include browser engine optimizations, compiler benchmarks, local AI inference, and decentralized web standards.'
      ]
    },
    contentHtml: `
      <div style="font-family: Verdana, Geneva, sans-serif; padding: 16px; max-width: 900px; margin: 0 auto; color: inherit; background: rgba(255, 102, 0, 0.05); border-radius: 8px;">
        <header style="background: #ff6600; color: #222; padding: 8px 12px; border-radius: 4px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <strong style="border: 1px solid white; padding: 1px 6px; color: white;">Y</strong>
            <span style="font-weight: bold; font-size: 1.1rem; color: #111;">Hacker News</span>
            <span style="font-size: 0.85rem; margin-left: 12px;">new | past | comments | ask | show | jobs | submit</span>
          </div>
        </header>
        <ol style="padding-left: 24px; line-height: 1.8;">
          <li style="margin-bottom: 10px;">
            <a href="#" style="color: #3b82f6; text-decoration: none; font-weight: 500;">Fulguris: Fast, modern and privacy-focused Android browser</a>
            <span style="font-size: 0.8rem; color: #888;"> (github.com/Slion/Fulguris)</span>
            <div style="font-size: 0.75rem; color: #777;">452 points by slion 4 hours ago | 128 comments</div>
          </li>
          <li style="margin-bottom: 10px;">
            <a href="#" style="color: #3b82f6; text-decoration: none; font-weight: 500;">Show HN: Web Browser architecture running inside AI Studio</a>
            <span style="font-size: 0.8rem; color: #888;"> (aistudio.google.com)</span>
            <div style="font-size: 0.75rem; color: #777;">289 points by webdev 2 hours ago | 64 comments</div>
          </li>
          <li style="margin-bottom: 10px;">
            <a href="#" style="color: #3b82f6; text-decoration: none; font-weight: 500;">Why Reader Mode is essential for accessible mobile web browsing</a>
            <span style="font-size: 0.8rem; color: #888;"> (w3.org)</span>
            <div style="font-size: 0.75rem; color: #777;">182 points by accessibility_advocate 5 hours ago | 42 comments</div>
          </li>
          <li style="margin-bottom: 10px;">
            <a href="#" style="color: #3b82f6; text-decoration: none; font-weight: 500;">Ad-blocking benchmarks: Evaluating CPU & memory reduction on mobile</a>
            <span style="font-size: 0.8rem; color: #888;"> (eff.org)</span>
            <div style="font-size: 0.75rem; color: #777;">512 points by privacy_researcher 7 hours ago | 203 comments</div>
          </li>
        </ol>
      </div>
    `
  }
};

export function getSamplePage(urlOrQuery: string): SamplePage {
  // Check exact url
  if (SAMPLE_PAGES[urlOrQuery]) {
    return SAMPLE_PAGES[urlOrQuery];
  }

  // Check normalized url
  const trimmed = urlOrQuery.trim();
  for (const [key, val] of Object.entries(SAMPLE_PAGES)) {
    if (key.includes(trimmed) || trimmed.includes(key)) {
      return val;
    }
  }

  // Is search query
  const isSearch = !trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.includes('.');
  const title = isSearch ? `Search results for "${trimmed}"` : (trimmed.replace(/^https?:\/\//, '').split('/')[0] || 'Web Page');

  const contentHtml = `
    <div style="font-family: system-ui, sans-serif; padding: 24px; max-width: 900px; margin: 0 auto; color: inherit;">
      <header style="border-bottom: 1px solid rgba(120,120,120,0.2); padding-bottom: 16px; margin-bottom: 24px;">
        <div style="display: inline-block; background: rgba(59,130,246,0.15); color: #3b82f6; padding: 4px 10px; border-radius: 16px; font-size: 0.85rem; font-weight: 600; margin-bottom: 8px;">
          ${isSearch ? 'Web Search Result' : 'Rendered Web Document'}
        </div>
        <h1 style="font-size: 1.8rem; margin: 0 0 8px 0;">${title}</h1>
        <p style="margin: 0; color: #888; font-size: 0.9rem; word-break: break-all;">${trimmed}</p>
      </header>

      <div style="background: rgba(120,120,120,0.08); border-radius: 12px; padding: 20px; margin-bottom: 24px; border: 1px solid rgba(120,120,120,0.15);">
        <h2 style="font-size: 1.2rem; margin-top: 0; display: flex; align-items: center; gap: 8px;">
          <span>🛡️</span> Privacy Shield Protected
        </h2>
        <p style="line-height: 1.6; margin-bottom: 0;">
          Fulguris ABP engine scanned this page. 3 potential tracking beacons and 1 advertising script were prevented from executing.
        </p>
      </div>

      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="padding: 16px; border: 1px solid rgba(120,120,120,0.2); border-radius: 8px;">
          <h3 style="margin: 0 0 6px 0; font-size: 1.1rem; color: #3b82f6;">Primary Article: Overview & Summary</h3>
          <p style="margin: 0; line-height: 1.6; color: #999;">
            You are browsing <strong>${trimmed}</strong> through the Fulguris sandboxed rendering engine. The document has been parsed and verified safe. Use the toolbar menu to toggle Reader Mode, inspect source code, or adjust zoom and theme settings.
          </p>
        </div>

        <div style="padding: 16px; border: 1px solid rgba(120,120,120,0.2); border-radius: 8px;">
          <h3 style="margin: 0 0 6px 0; font-size: 1.1rem; color: #10b981;">Relevant Highlights & Key Takeaways</h3>
          <p style="margin: 0; line-height: 1.6; color: #999;">
            This page responds to custom user agents and full desktop viewport switching. You can also export this session into your bookmarks or save it for offline reading.
          </p>
        </div>
      </div>
    </div>
  `;

  return {
    url: trimmed.startsWith('http') ? trimmed : `https://duckduckgo.com/?q=${encodeURIComponent(trimmed)}`,
    title,
    readerArticle: {
      title,
      author: 'Web Article',
      publishedDate: new Date().toLocaleDateString(),
      readingTime: '2 min read',
      content: [
        `This is a clean, distraction-free reader representation of ${title}.`,
        'Fulguris extracts the primary readable content from the web page, stripping away clutter, banner advertisements, sidebars, and trackers.',
        'You can customize typography size, background color (sepia, dark, light), and contrast for optimal reading comfort.'
      ]
    },
    contentHtml
  };
}
