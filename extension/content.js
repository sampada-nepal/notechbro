const TECHBRO_KEYWORDS = [
  'synergy', 'disrupt', 'pivot', 'leverage', 'bandwidth', 'ideate',
  'growth hacking', 'low-hanging fruit', 'move fast and break things',
  'paradigm shift', 'scalable', 'vertical', 'horizontal', 'ecosystem',
  'deep dive', 'thought leadership', 'value proposition', 'blockchain',
  'web3', 'metaverse', 'AI-powered', 'machine learning', 'big data',
  'cloud native', 'agile', 'scrum', 'MVP', 'roadmap', 'burn rate',
  'unicorn', 'dogfooding', 'blitzscaling', 'onboard', 'offboard',
  'deck', 'runway', 'traction', 'user journey', 'pain point',
  'solutioneering', 'frictionless', 'hyper-growth',
  'innovate', 'optimize', 'monetize', 'gamify', 
  'stickiness', 'engagement', 'north star metric', 'OKR', 'KPI',
  'ROI', 'acquisition', 'retention', 'churn', 'funnel', 'A/B test',
  'iterate', 'lean startup', 'bootstrapped', 'venture capital',
  'angel investor', 'seed round', 'series A', 'exit strategy',
  'exit event', 'burn down chart', 'sprint', 'standup', 'retrospective',
  'devops', 'microservices', 'containerization', 'serverless',
  'data-driven', 'actionable insights', 'holistic approach', 'synergistic',
  'core competency', 'best practices', 'value-add', 'circle back',
  'touch base', 'align', 'sync up', 'deep dive', 'double-click',
  'move the needle', 'impact', 'optimize for', 'bandwidth constraints',
  'thought leader', 'evangelist', 'influencer marketing', 'content strategy',
  'digital transformation', 'customer-centric', 'user experience',
  'backend', 'frontend', 'full-stack', 'API-first', 'open source',
  'proprietary', 'enterprise-grade', 'mission-critical', 'robust',
  'seamless', 'cutting-edge', 'next-gen', 'future-proof', 'bleeding edge', 
  'VC-backed', 'technical founder', 'founding engineer', 'ngmi', 'pmf', 'linkedin',
  'paid users', 'MRR', 'cursor for',
];

async function turnIntoPirateSpeak(text) {
  try {
    const prompt = `Translate the following "techbro" tweet into authentic pirate speak. Keep the translation concise and capture the essence of the original tweet's meaning, but in a pirate style. Do not add any introductory or concluding phrases, just the pirate translation.
    
    Original Tweet: "${text}"
    
    Pirate Translation:`;

    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });

    const payload = {
      contents: chatHistory,
      generationConfig: {
        temperature: 0.9,
        topP: 1,
        topK: 1,
      },
    };

    const apiKeyResponse = await fetch('https://api-key-worker.sampadaa.workers.dev/get-gemini-api-key', {
      method: 'GET'
    });

    if (!apiKeyResponse.ok) {
      console.error('Failed to get API key:', apiKeyResponse.status);
      return `Arrr, me API key fetch failed! (${apiKeyResponse.status})`;
    }

    const apiKeyData = await apiKeyResponse.json();
    const apiKey = apiKeyData.apiKey;

    if (!apiKey) {
      console.error('No API key received');
      return "Shiver me timbers, no API key found!";
    }

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', response.status, errorData);
      return `Arrr, me API call failed! (${response.status})`;
    }
    
    const result = await response.json();

    if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
      return result.candidates[0].content.parts[0].text;
    } else {
      console.warn('Gemini API response structure unexpected:', result);
      return "Shiver me timbers, couldn't translate that one, matey!";
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return `Blimey! A storm hit me translator! (${error.message})`;
  }
}

function isTechbroTweet(text) {
  const lowerText = text.toLowerCase();
  return TECHBRO_KEYWORDS.some(keyword => lowerText.includes(keyword.toLowerCase()));
}

async function processTweetElement(tweetElement) {
  console.log('Processing tweet element:', tweetElement);
  
  const tweetTextContainer = tweetElement.querySelector('[data-testid="tweetText"]');
  if (!tweetTextContainer) {
    console.log('No tweet text container found, skipping.');
    return;
  }

  const originalText = tweetTextContainer.textContent.trim();
  if (!originalText) {
    console.log('No text content found, skipping.');
    return;
  }

  if (!isTechbroTweet(originalText)) {
    console.log('Not a techbro tweet, skipping.');
    return;
  }

  const originalHTML = tweetTextContainer.innerHTML;
  const pirateText = await turnIntoPirateSpeak(originalText);
  
  originalContentMap.set(tweetElement, { 
    html: originalHTML, 
    text: originalText,
    pirateText: pirateText 
  });

  processedTweetElements.add(tweetElement);
  tweetTextContainer.innerHTML = pirateText;
  addRevertButton(tweetElement);  
}

const processedTweetElements = new WeakSet();

const originalContentMap = new WeakMap();

function addRevertButton(tweetElement) {
  console.log('Attempting to add revert button to tweetElement:', tweetElement);
  if (tweetElement.querySelector('.revert-pirate-button')) {
    console.log('Revert button already exists, skipping.');
    return;
  }

  const button = document.createElement('button');
  button.textContent = '↺';
  button.className = 'revert-pirate-button';
  button.style.cssText = `
    background-color: #1DA1F2;
    color: white;
    border: none;
    border-radius: 50%;
    padding: 4px;
    font-size: 12px;
    cursor: pointer;
    opacity: 0.8;
    transition: opacity 0.2s ease-in-out;
    z-index: 9999;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 8px;
    right: 8px;
    font-weight: bold;
  `;
  button.onmouseover = () => button.style.opacity = '1';
  button.onmouseout = () => button.style.opacity = '0.8';

  button.addEventListener('click', (event) => {
    event.stopPropagation();
    console.log('Toggle button clicked for tweet:', tweetElement);
    toggleTweet(tweetElement);
  });

  tweetElement.style.position = 'relative';
  tweetElement.appendChild(button);
  
  console.log('Button added to tweet element.');
}

function toggleTweet(tweetElement) {
  console.log('Attempting to toggle tweet:', tweetElement);
  const tweetTextContainer = tweetElement.querySelector('[data-testid="tweetText"]');
  if (!tweetTextContainer) {
    console.warn('No tweet text container found.');
    return;
  }

  const storedContent = originalContentMap.get(tweetElement);
  const button = tweetElement.querySelector('.revert-pirate-button');
  
  if (!storedContent) {
    console.warn('No stored content found for tweet.');
    return;
  }

  const currentText = tweetTextContainer.innerHTML;
  const isCurrentlyPirate = currentText !== storedContent.html;

  if (isCurrentlyPirate) {
    tweetTextContainer.innerHTML = storedContent.html;
    button.textContent = '🏴‍☠️';
    console.log('Tweet text restored to original.');
  } else {
    tweetTextContainer.innerHTML = storedContent.pirateText;
    button.textContent = '↺';
    console.log('Tweet text changed to pirate.');
  }
}

function debounce(func, delay) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
}

const observeTweets = debounce(async () => {
  console.log('Observing tweets...');
  const tweetElements = document.querySelectorAll('article[data-testid="tweet"]');
  console.log(`Found ${tweetElements.length} tweet elements.`);

  const tweetsToProcess = [];
  tweetElements.forEach(tweetElement => {
    if (!processedTweetElements.has(tweetElement)) {
      tweetsToProcess.push(tweetElement);
    }
  });
  console.log(`Found ${tweetsToProcess.length} new tweets to process.`);

  const BATCH_SIZE = 3;
  for (let i = 0; i < tweetsToProcess.length; i += BATCH_SIZE) {
    const batch = tweetsToProcess.slice(i, i + BATCH_SIZE);
    console.log(`Processing batch of ${batch.length} tweets.`);
    if (typeof processTweetElement !== 'function') {
      console.error('CRITICAL ERROR: processTweetElement is not a function! Type:', typeof processTweetElement);
      return; 
    }
    try {
      await Promise.all(batch.map(tweet => processTweetElement(tweet))); 
      console.log('Batch processing complete.');
    } catch (e) {
      console.error('Error during batch processing of tweets:', e);
    }
  }
}, 500);

const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    if (mutation.addedNodes.length > 0) {
      observeTweets();
    }
  });
});

console.log('Starting MutationObserver...');
observer.observe(document.body, { childList: true, subtree: true });

console.log('Running initial tweet observation...');
observeTweets();