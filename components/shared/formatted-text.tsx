'use client';

import React from 'react';

interface FormattedTextProps {
  text: string;
  className?: string;
}

interface TextBlock {
  type: 'paragraph' | 'bullet-list' | 'letter-list';
  items: string[];
}

function parseText(text: string): TextBlock[] {
  const lines = text.split('\n');
  const blocks: TextBlock[] = [];
  let currentBlock: TextBlock | null = null;

  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Skip empty lines - they end the current block
    if (!trimmedLine) {
      if (currentBlock) {
        blocks.push(currentBlock);
        currentBlock = null;
      }
      continue;
    }

    // Check for bullet points (lines starting with -)
    if (trimmedLine.startsWith('- ')) {
      const content = trimmedLine.slice(2).trim();
      if (currentBlock?.type === 'bullet-list') {
        currentBlock.items.push(content);
      } else {
        if (currentBlock) blocks.push(currentBlock);
        currentBlock = { type: 'bullet-list', items: [content] };
      }
      continue;
    }

    // Check for lettered lists (a), b), c), etc.)
    const letterMatch = trimmedLine.match(/^([a-z])\)\s+(.+)/i);
    if (letterMatch) {
      const content = letterMatch[2].trim();
      if (currentBlock?.type === 'letter-list') {
        currentBlock.items.push(content);
      } else {
        if (currentBlock) blocks.push(currentBlock);
        currentBlock = { type: 'letter-list', items: [content] };
      }
      continue;
    }

    // Regular paragraph text
    if (currentBlock?.type === 'paragraph') {
      // Append to existing paragraph with a space
      currentBlock.items[0] = currentBlock.items[0] + ' ' + trimmedLine;
    } else {
      if (currentBlock) blocks.push(currentBlock);
      currentBlock = { type: 'paragraph', items: [trimmedLine] };
    }
  }

  // Don't forget the last block
  if (currentBlock) {
    blocks.push(currentBlock);
  }

  return blocks;
}

export function FormattedText({ text, className = '' }: FormattedTextProps) {
  const blocks = parseText(text);

  return (
    <div className={`space-y-4 ${className}`}>
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'paragraph':
            return (
              <p key={index} className="text-foreground leading-relaxed">
                {block.items[0]}
              </p>
            );
          
          case 'bullet-list':
            return (
              <ul key={index} className="list-disc pl-6 space-y-2 text-foreground">
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            );
          
          case 'letter-list':
            return (
              <ol key={index} className="list-[lower-alpha] pl-6 space-y-2 text-foreground">
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ol>
            );
          
          default:
            return null;
        }
      })}
    </div>
  );
}

