const fs = require('fs');

// Read the SideNavigation.tsx file
const filePath = 'src/components/layout/SideNavigation.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Add a simple child entry to the Asset Press navigation item
if (!content.includes('isOpen: expandedItems.includes(\'Asset Press\'),')) {
  // Add isOpen property to Asset Press
  content = content.replace(
    /name: 'Asset Press',[\s\S]*?current: location\.pathname === '\/asset-press',\s*badge: 'Beta',/g,
    `name: 'Asset Press',
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
      current: location.pathname === '/asset-press' || location.pathname === '/asset-marketplace',
      badge: 'Beta',
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
        },`
  );
  
  // Now move the Asset Marketplace entry into the Asset Press children array
  // Find and remove the entire Asset Marketplace block
  const marketplacePattern = /\{[\s\S]*?name: 'Asset Marketplace',[\s\S]*?\},/;
  const marketplaceMatch = content.match(marketplacePattern);
  
  if (marketplaceMatch) {
    const marketplaceBlock = marketplaceMatch[0];
    
    // Replace the href in the marketplaceBlock
    const updatedMarketplaceBlock = marketplaceBlock.replace(
      /href: getAssetMarketplacePath\(\),/g,
      `href: '/asset-marketplace',`
    ).replace(
      /onClick: \(\) => \{[\s\S]*?navigate\(path\);[\s\S]*?\},/g,
      `onClick: () => {
        console.log('Navigating to Asset Marketplace - DEBUG LOG');
        navigate('/asset-marketplace');
      },`
    ).replace(
      /current:[\s\S]*?'\/asset-marketplace'\),/g,
      `current: location.pathname === '/asset-marketplace',`
    );
    
    // Remove the original Asset Marketplace navigation item
    content = content.replace(marketplacePattern, '');
    
    // Add the updated Asset Marketplace item as a child to Asset Press
    content = content.replace(
      /current: location\.pathname === '\/asset-press',\s*},/,
      `current: location.pathname === '/asset-press',
        },
        ${updatedMarketplaceBlock}`
    );
  }
}

// Write the updated content back to the file
fs.writeFileSync(filePath, content, 'utf8');
console.log('Navigation updated successfully!'); 