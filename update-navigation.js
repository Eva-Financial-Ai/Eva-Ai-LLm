const fs = require('fs');
const path = require('path');

// Read the file
const filePath = path.join(__dirname, 'src', 'components', 'layout', 'SideNavigation.tsx');
const content = fs.readFileSync(filePath, 'utf8');

// Find the Asset Press navigation item
const assetPressPattern = /\{\s*name:\s*'Asset Press',\s*href:/;
const startIndex = content.search(assetPressPattern);

if (startIndex === -1) {
  console.error('Asset Press navigation item not found');
  process.exit(1);
}

// Find the closing bracket for the Asset Press object
let depth = 0;
let closingIndex = startIndex;
let inString = false;
let stringChar = '';

for (let i = startIndex; i < content.length; i++) {
  const char = content[i];
  
  // Handle string literals
  if ((char === "'" || char === '"') && (i === 0 || content[i - 1] !== '\\')) {
    if (!inString) {
      inString = true;
      stringChar = char;
    } else if (char === stringChar) {
      inString = false;
    }
  }
  
  if (!inString) {
    if (char === '{') {
      depth++;
    } else if (char === '}') {
      depth--;
      if (depth === 0) {
        closingIndex = i + 1;
        break;
      }
    }
  }
}

// The next item should be after the comma following the closing bracket
const afterAssetPress = content.indexOf(',', closingIndex);

// Check if the Asset Press item already has children array
const hasChildren = content.substring(startIndex, closingIndex).includes('children:');

// Prepare the updated navigation item
let updatedContent;

if (hasChildren) {
  // Insert Asset Marketplace as a child item
  const childrenStartIndex = content.indexOf('children:', startIndex);
  const childrenArrayStartIndex = content.indexOf('[', childrenStartIndex);
  const childrenArrayEndIndex = content.indexOf(']', childrenArrayStartIndex);
  
  const childrenContent = content.substring(childrenArrayStartIndex + 1, childrenArrayEndIndex);
  
  const updatedChildrenContent = `${childrenContent}
    {
      name: 'Asset Marketplace',
      href: '/asset-marketplace',
      onClick: () => {
        console.log('Navigating to Asset Marketplace - DEBUG LOG');
        navigate('/asset-marketplace');
      },
      icon: active => (
        <svg
          className={\`h-5 w-5 \${active ? 'text-primary-600' : 'text-gray-600'}\`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
      current: location.pathname === '/asset-marketplace',
    },`;
  
  updatedContent = 
    content.substring(0, childrenArrayStartIndex + 1) + 
    updatedChildrenContent + 
    content.substring(childrenArrayEndIndex);
} else {
  // Add a children array to the Asset Press item
  const assetPressContent = content.substring(startIndex, closingIndex);
  const lastPropEndIndex = assetPressContent.lastIndexOf(',');
  
  const updatedAssetPressContent = 
    assetPressContent.substring(0, lastPropEndIndex + 1) + 
    `
      isOpen: expandedItems.includes('Asset Press'),
      children: [
        {
          name: 'Asset Press',
          href: '/asset-press',
          onClick: () => {
            console.log('Navigating to Asset Press - DEBUG LOG');
            navigate('/asset-press');
          },
          icon: active => (
            <svg
              className={\`h-5 w-5 \${active ? 'text-primary-600' : 'text-gray-600'}\`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
              />
            </svg>
          ),
          current: location.pathname === '/asset-press',
        },
        {
          name: 'Asset Marketplace',
          href: '/asset-marketplace',
          onClick: () => {
            console.log('Navigating to Asset Marketplace - DEBUG LOG');
            navigate('/asset-marketplace');
          },
          icon: active => (
            <svg
              className={\`h-5 w-5 \${active ? 'text-primary-600' : 'text-gray-600'}\`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          ),
          current: location.pathname === '/asset-marketplace',
        }
      ],` + 
    assetPressContent.substring(lastPropEndIndex + 1);
  
  updatedContent = 
    content.substring(0, startIndex) + 
    updatedAssetPressContent + 
    content.substring(closingIndex);
}

// Update the current property to include /asset-marketplace
updatedContent = updatedContent.replace(
  /current: location\.pathname === '\/asset-press'/,
  "current: location.pathname === '/asset-press' || location.pathname === '/asset-marketplace'"
);

// Write the updated content back to the file
fs.writeFileSync(filePath, updatedContent, 'utf8');

console.log('Navigation updated successfully!'); 