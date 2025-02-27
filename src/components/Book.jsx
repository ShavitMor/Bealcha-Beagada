import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Diamond, ChevronDown, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import { FaArrowUp, FaCopyright } from 'react-icons/fa6';
import { Link } from 'react-scroll';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/fonts.css';
import whatsappIcon from '../images/WhatsApp.webp';
import SEO from '../components/SEO';
import { allProjects } from './export';

// Hebrew text normalization function that removes nikkud (vowel marks)
const normalizeHebrewText = (text) => {
  if (!text) return '';
  
  // Remove all Hebrew nikkud (vowel points) and other diacritical marks
  return text.normalize('NFD')
    .replace(/[\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7]/g, '')
    .normalize('NFC');
};

// Helper functions (unchanged)
const groupContentBySubject = (data) => {
  const subjects = [];
  let currentSubject = null;
  let currentContent = [];

  data.forEach(item => {
    if (item.type === 'subject') {
      if (currentSubject) {
        subjects.push({
          id: subjects.length + 1,
          title: currentSubject,
          content: currentContent
        });
        currentContent = [];
      }
      currentSubject = item.title.trim();
    } else {
      currentContent.push(item);
    }
  });

  if (currentSubject) {
    subjects.push({
      id: subjects.length + 1,
      title: currentSubject,
      content: currentContent
    });
  }

  return subjects;
};

// Updated highlightText function with nikkud normalization
const highlightText = (text, query) => {
  if (!query || query.trim() === '') {
    return text;
  }
  
  // Normalize both the text and the query for searching
  const normalizedText = normalizeHebrewText(text);
  const normalizedQuery = normalizeHebrewText(query.toLowerCase());
  
  // If there's no match using normalized text, fall back to original method
  if (!normalizedText.toLowerCase().includes(normalizedQuery)) {
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() 
        ? <mark key={i} className="bg-yellow-200 px-0.5 rounded">{part}</mark> 
        : part
    );
  }
  
  // Create a mapping between normalized text and original text positions
  const positionMap = [];
  let normalizedPos = 0;
  
  for (let originalPos = 0; originalPos < text.length; originalPos++) {
    const char = text[originalPos];
    // If this character is not a nikkud mark, it maps to a position in the normalized text
    if (!/[\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7]/.test(char)) {
      positionMap[normalizedPos] = originalPos;
      normalizedPos++;
    }
  }
  
  // Find all matches in the normalized text
  const matches = [];
  let searchPos = 0;
  
  while (true) {
    const matchPos = normalizedText.toLowerCase().indexOf(normalizedQuery, searchPos);
    if (matchPos === -1) break;
    
    matches.push({
      start: matchPos,
      end: matchPos + normalizedQuery.length
    });
    
    searchPos = matchPos + 1; // Move past this match to find the next one
  }
  
  // Convert the matches in normalized space to matches in original text space
  const originalMatches = matches.map(match => ({
    start: positionMap[match.start],
    // Find the end position by looking for the next available mapping after match.end - 1
    end: findEndPosition(positionMap, match.end - 1, text.length)
  }));
  
  // Build the result with highlighted segments
  let result = [];
  let lastEnd = 0;
  
  for (const match of originalMatches) {
    // Add text before this match
    if (match.start > lastEnd) {
      result.push(text.substring(lastEnd, match.start));
    }
    
    // Add the highlighted match
    result.push(
      <mark key={`mark-${match.start}`} className="bg-yellow-200 px-0.5 rounded">
        {text.substring(match.start, match.end + 1)}
      </mark>
    );
    
    lastEnd = match.end + 1;
  }
  
  // Add any remaining text
  if (lastEnd < text.length) {
    result.push(text.substring(lastEnd));
  }
  
  return result;
};

// Helper function to find the end position in original text
function findEndPosition(positionMap, normalizedEndPos, textLength) {
  // Find the original position corresponding to the end of the match
  const originalEnd = positionMap[normalizedEndPos];
  
  // If we found a mapping, use it
  if (originalEnd !== undefined) {
    return originalEnd;
  }
  
  // If we didn't find a direct mapping (possibly due to nikkud at the end)
  // search backward until we find a valid mapping
  for (let i = normalizedEndPos - 1; i >= 0; i--) {
    if (positionMap[i] !== undefined) {
      // Find all nikkud marks after this position
      for (let j = positionMap[i] + 1; j < textLength; j++) {
        // If we find a non-nikkud character, stop
        if (!/[\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7]/.test(text[j])) {
          return j - 1;
        }
      }
      // If we only have nikkud until the end of the text
      return textLength - 1;
    }
  }
  
  // Fallback if we can't find a sensible position
  return textLength - 1;
}
const TextSpan = ({ item, searchQuery = '' }) => {
  let className = "text-gray-800 font-[sblFont]";

  switch (item.font_size) {
    case "14px":
      className += " text-sm text-gray-600";
      break;
    case "7pt":
      className += " text-sm text-gray-600";
      break;
    case "8pt":
      className += " text-l text-gray-600";
      break;
    case "8.5pt":
      className += " text-xl text-gray-700";
      break;
    case "17px":
      className += " text-lg text-gray-700";
    default:
      className += " text-2xl";
  }

  if (item.font_size === "14px") {
    return (
      <span className={className}>
        {item.bold ? <strong> {highlightText(item.text, searchQuery)} </strong> : highlightText(item.text, searchQuery)}
      </span>
    );
  }

  if (item.text === '\n') {
    return (
      <>
        <br/>
        <br/>
      </>
    );
  }

  // Updated regex that excludes periods inside parentheses and brackets
  // and periods followed by quotation marks
  const splitText = (text) => {
    const parts = [];
    let currentPart = '';
    let insideParens = 0;
    let insideBrackets = 0;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      currentPart += char;

      // Track nested parentheses and brackets
      if (char === '(' || char === '[') {
        if (char === '(') insideParens++;
        if (char === '[') insideBrackets++;
      } else if (char === ')' || char === ']') {
        if (char === ')') insideParens--;
        if (char === ']') insideBrackets--;
      } else if (char === '.' && 
                 i < text.length - 1 && 
                 text[i + 1] !== '.' && // not an ellipsis
                 text[i + 1] !== '"' && // not followed by a double quote
                 text[i + 1] !== "'" && // not followed by a single quote
                 insideParens === 0 && 
                 insideBrackets === 0) {
        // Only split on periods that are:
        // 1. Not inside parentheses or brackets
        // 2. Not part of an ellipsis
        // 3. Not followed by quotes
        // 4. Not the last character
        parts.push(currentPart);
        currentPart = '';
      }
    }

    if (currentPart) {
      parts.push(currentPart);
    }

    return parts.filter(part => part.trim() !== '');
  };

  const parts = item.text.split('\n').reduce((acc, part) => {
    if (part.trim() === '') {
      acc.push('\n');
    } else {
      acc.push(...splitText(part));
    }
    return acc;
  }, []);

  return (
    <span className={className}>
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          {part === '\n' ? (
            <br />
          ) : (
            item.bold ? 
              <strong> {highlightText(part.trim(), searchQuery)} </strong> : 
              highlightText(part.trim(), searchQuery)
          )}
          {part.endsWith('.') && 
           !part.endsWith('."') && 
           !part.endsWith(".'") && 
           index < parts.length - 1 && 
           <br />}
        </React.Fragment>
      ))}
    </span>
  );
};

const Paragraph = ({ content, searchQuery = '' }) => {
  const isStory = content.type === "story";

  const formatTextForWhatsApp = (description) => {
    let formattedText = '';
    
    description?.forEach((item, index) => {
      if (item.text === '\n') {
        formattedText += '\n\n';
        return;
      }

      // Split text by periods and line breaks, preserving them
      const parts = item.text.split(/(\n|(?<=\.)(?!\.|\n|\)))/).filter(part => part !== '');
      
      parts.forEach(part => {
        if (part === '\n') {
          formattedText += '\n\n';
        } else {
          // Add bold markdown for WhatsApp if needed
          const formattedPart = item.bold ? `*${part.trim()}*` : part.trim();
          formattedText += formattedPart;
          
          // Add line breaks after periods
          if (part.endsWith('.')) {
            formattedText += '\n';
          }
        }
      });

      // Add space between different text items if not already ending with a line break
      if (index < description.length - 1 && !formattedText.endsWith('\n')) {
        formattedText += ' ';
      }
    });

    formattedText += '\n\nכל ההלכות באתר : https://bealaha-beagada.com//';

    return formattedText;
  };

  const handleShare = () => {
    const title = `*${content.title}*\n\n`;
    const formattedText = formatTextForWhatsApp(content.description);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + formattedText)}`;
    window.open(whatsappUrl, "_blank");
  };

 
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative"
    >
      <div className={`relative mt-8 p-6 rounded-lg shadow-lg text-right ${isStory ? 'bg-indigo-50' : 'bg-white'} border-2 ${isStory ? 'border-indigo-200' : 'border-yellow-200'}`}>
        {/* Icon at the top */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className={`p-2 rounded-full ${isStory ? 'bg-indigo-100' : 'bg-yellow-100'}`}>
            {isStory ? <Book className="w-6 h-6 text-indigo-600" /> : <Diamond className="w-6 h-6 text-yellow-600" />}
          </div>
        </div>

        {/* Title */}
        <h3 className={`text-2xl font-bold mb-3 ${isStory ? 'text-indigo-800' : 'text-yellow-800'}`}>
          {content.title && highlightText(content.title, searchQuery)}
        </h3>

        {/* Content */}
        <div className="text-gray-800 leading-relaxed">
          {content.description?.map((item, index) => (
            <TextSpan key={index} item={item} searchQuery={searchQuery} />
          ))}
        </div>

        {/* WhatsApp Share Button */}
        <button 
          onClick={handleShare} 
          className="absolute bottom-2 left-2 flex items-center gap-2 p-2 text-green-600 hover:text-green-800"
        >
          <img src={whatsappIcon} alt="Share on WhatsApp" className="w-8 h-8" />
        </button>
      </div>

      {/* Decorative line */}
      <motion.div className="flex items-center space-x-4 my-4 flex-row-reverse" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className={`h-px bg-gradient-to-r from-transparent ${isStory ? 'via-indigo-500' : 'via-white'} to-transparent flex-grow`} />
        <div className={`w-2 h-2 rounded-full ${isStory ? 'bg-indigo-500' : 'bg-white'} animate-pulse`} />
        <div className={`h-px bg-gradient-to-r from-transparent ${isStory ? 'via-indigo-500' : 'via-white'} to-transparent flex-grow`} />
      </motion.div>
    </motion.div>
  );
};

const ReadingPage = () => {
  const { bookTitle } = useParams();
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedTopicIndex, setSelectedTopicIndex] = useState(0);
  const [isTopicsOpen, setIsTopicsOpen] = useState(false);
  const [data, setData] = useState([]);
  const [topics, setTopics] = useState([]);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchFilter, setSearchFilter] = useState('all'); // 'all', 'alaha', 'story'

  // Load data and restore last position
  useEffect(() => {
    const loadData = async () => {
      try {
        const jsonData = await import(`../data/${bookTitle}.json`);
        setData(jsonData.default);
        
        // Group data into topics
        const groupedTopics = groupContentBySubject(jsonData.default);
        setTopics(groupedTopics);
        
        // Restore last position from localStorage
        const savedState = localStorage.getItem(`book_${bookTitle}_position`);
        if (savedState) {
          try {
            const { topicIndex } = JSON.parse(savedState);
            
            // Make sure the saved index is valid
            if (topicIndex >= 0 && topicIndex < groupedTopics.length) {
              setSelectedTopic(groupedTopics[topicIndex]);
              setSelectedTopicIndex(topicIndex);
              
              // Scroll to top after a small delay to ensure rendering is complete
              setTimeout(scrollToTop, 100);
            } else {
              // If invalid index, default to first topic
              setSelectedTopic(groupedTopics[0]);
              setSelectedTopicIndex(0);
            }
          } catch (error) {
            console.error("Error parsing saved position:", error);
            // Default to first topic on error
            if (groupedTopics.length > 0) {
              setSelectedTopic(groupedTopics[0]);
              setSelectedTopicIndex(0);
            }
          }
        } else if (groupedTopics.length > 0) {
          // No saved state, default to first topic
          setSelectedTopic(groupedTopics[0]);
          setSelectedTopicIndex(0);
        }
      } catch (error) {
        console.error("Failed to load JSON data:", error);
      }
    };

    loadData();
  }, [bookTitle]);

  // Save position to localStorage whenever it changes
  useEffect(() => {
    if (selectedTopic && !isSearching) {
      const stateToSave = {
        topicIndex: selectedTopicIndex,
        topicId: selectedTopic.id,
        topicTitle: selectedTopic.title
      };
      
      localStorage.setItem(`book_${bookTitle}_position`, JSON.stringify(stateToSave));
    }
  }, [selectedTopic, selectedTopicIndex, bookTitle, isSearching]);

  // Updated search function that supports searching with or without nikkud
  const performSearch = (data, query, filter) => {
    if (query.trim() === '') {
      return [];
    }

    const results = [];
    const normalizedQuery = normalizeHebrewText(query.toLowerCase());

    // Search through all items
    data.forEach(item => {
      if (item.type === 'alaha' || item.type === 'story') {
        // Skip items that don't match the filter
        if (filter !== 'all' && item.type !== filter) {
          return;
        }
        
        // Check title
        if (item.title && normalizeHebrewText(item.title.toLowerCase()).includes(normalizedQuery)) {
          results.push(item);
          return;
        }
        
        // Check description content
        if (item.description && Array.isArray(item.description)) {
          const hasMatch = item.description.some(descItem => 
            descItem.text && normalizeHebrewText(descItem.text.toLowerCase()).includes(normalizedQuery)
          );
          
          if (hasMatch && !results.includes(item)) {
            results.push(item);
          }
        }
      }
    });

    return results;
  };

  // Effect for search with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim() === '') {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      const results = performSearch(data, searchQuery, searchFilter);
      setSearchResults(results);
    }, 300); // 300ms debounce delay

    return () => clearTimeout(timer);
  }, [searchQuery, data, searchFilter]);

  // Enhanced scrollToTop function
  const scrollToTop = () => {
    // First try to use smooth scroll behavior
    try {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    } catch (error) {
      // Fallback for older browsers
      window.scrollTo(0, 0);
    }

    // Additional fallback using scroll element
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0; // For Safari
  };
  
  // Enhanced scrollToTop function
  const scrollToTop2 = () => {
    // First try to use smooth scroll behavior
    try {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    } catch (error) {
      // Fallback for older browsers
      window.scrollTo(0, 0);
    }
  };

  // Updated topic selection handler
  const handleTopicSelect = (topic, index) => {
    // First update the state
    setSelectedTopic(topic);
    setSelectedTopicIndex(index);
    setIsTopicsOpen(false);
    
    // Then scroll to top with a slight delay to ensure state updates have processed
    setTimeout(scrollToTop, 100);
  };

  const handlePrevTopic = () => {
    const newIndex = Math.max(0, selectedTopicIndex - 1);
    handleTopicSelect(topics[newIndex], newIndex);
  };

  const handleNextTopic = () => {
    const newIndex = Math.min(topics.length - 1, selectedTopicIndex + 1);
    handleTopicSelect(topics[newIndex], newIndex);
  };

  // Reset search
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  };

  const project = allProjects.find(p => p.title === bookTitle);
  const backgroundColor = project ? project.color : "rgb(255, 255, 255)";

  return (
    <>
      <SEO 
        title={`הלכות ${bookTitle}`}
        description={`הלכות ${bookTitle} לקריאה. ${selectedTopic?.title || 'בהלכה ובאגדה '}`}
        keywords={`${bookTitle},הלכות ${bookTitle}, בהלכה ובאגדה ${bookTitle}, ${selectedTopic?.title || 'ספרים'}`}
        canonicalUrl={`https://bealaha-beagada.com/reading/${bookTitle}`}
      />
      <>
        <Header />
        <div className="min-h-screen p-8" style={{ background: `linear-gradient(to bottom left, ${backgroundColor}, rgb(244, 239, 248))` }}>
          <div className="max-w-3xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h1 className="text-5xl font-[sblFont] font-bold text-gray-800 mb-4">{bookTitle}</h1>
              
              {/* Search input */}
              <div className="relative mb-6 mt-6 max-w-md mx-auto">
                <div className="flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="חפש בתוכן..."
                    className="w-full px-4 py-2 pr-10 rounded-lg border-2 border-yellow-200 text-right"
                    dir="rtl"
                  />
                  <div className="absolute left-3 flex items-center">
                    {searchQuery ? (
                      <X 
                        className="h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-600"
                        onClick={clearSearch}
                      />
                    ) : (
                      <Search className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
                
                {/* Search filters */}
                {isSearching && (
                  <div className="flex justify-center mt-2 gap-2 text-sm">
                    <button 
                      onClick={() => setSearchFilter('all')}
                      className={`px-3 py-1 rounded ${searchFilter === 'all' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
                    >
                      הכל
                    </button>
                    <button 
                      onClick={() => setSearchFilter('alaha')}
                      className={`px-3 py-1 rounded ${searchFilter === 'alaha' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
                    >
                      הלכות
                    </button>
                    <button 
                      onClick={() => setSearchFilter('story')}
                      className={`px-3 py-1 rounded ${searchFilter === 'story' ? 'bg-indigo-500 text-white' : 'bg-gray-200'}`}
                    >
                      סיפורים
                    </button>
                  </div>
                )}
              </div>
              
              {!isSearching && (
                <h2 className="text-2xl font-semibold text-gray-700">
                  {selectedTopic ? selectedTopic.title : "בחר נושא"}
                </h2>
              )}

              {!isSearching && (
                <motion.div 
                  className="cursor-pointer flex items-center justify-center mt-2"
                  onClick={() => setIsTopicsOpen(!isTopicsOpen)}
                  whileHover={{ scale: 1.05 }}
                >
                  <ChevronDown 
                    className={`transform transition-transform ${isTopicsOpen ? 'rotate-180' : ''}`}
                    size={24}
                  />
                </motion.div>
              )}
            </motion.div>

            {/* Display search results or regular content */}
            {isSearching ? (
              <div className="space-y-4">
                <motion.h2 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-2xl font-semibold text-gray-700 text-center mb-4"
                >
                  {searchResults.length > 0 
                    ? `נמצאו ${searchResults.length} תוצאות עבור "${searchQuery}"`
                    : `לא נמצאו תוצאות עבור "${searchQuery}"`}
                </motion.h2>
                
                {searchResults.map((item, index) => (
                  <Paragraph key={index} content={item} searchQuery={searchQuery} />
                ))}
                
                {searchResults.length > 0 && (
                  <motion.button 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={clearSearch}
                    className="px-6 py-3 mx-auto block rounded-lg bg-yellow-600 text-white hover:bg-yellow-700 transition-colors"
                  >
                    חזור לתצוגה רגילה
                  </motion.button>
                )}
              </div>
            ) : (
              <>
                {/* Topics list accordion */}
                <AnimatePresence>
                  {isTopicsOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex justify-center gap-4 mb-8 flex-wrap"
                    >
                      {topics.map((topic, index) => (
                        <motion.button
                          key={topic.id}
                          onClick={() => handleTopicSelect(topic, index)}
                          className={`px-6 py-3 rounded-lg text-lg ${
                            selectedTopic?.id === topic.id 
                              ? 'bg-yellow-600 text-white' 
                              : 'bg-white text-gray-800 hover:bg-yellow-50'
                          } shadow-md transition-colors`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {topic.title}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Selected topic content */}
                <AnimatePresence mode="wait">
                  {selectedTopic ? (
                    <motion.div
                      key={selectedTopic.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-4"
                    >
                      {selectedTopic.content.map((item, index) => (
                        <Paragraph key={index} content={item} />
                      ))}

                      <motion.div 
                        className="flex justify-between items-center mt-8 px-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <motion.button
                          onClick={handlePrevTopic}
                          disabled={selectedTopicIndex === 0}
                          className={`flex items-center gap-2 px-6 py-3 rounded-lg ${
                            selectedTopicIndex === 0 
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : 'bg-white text-gray-800 hover:bg-yellow-50'
                          } shadow-md transition-colors`}
                          whileHover={selectedTopicIndex !== 0 ? { scale: 1.05 } : {}}
                          whileTap={selectedTopicIndex !== 0 ? { scale: 0.95 } : {}}
                        >
                          <ChevronRight size={24} />
                          הקודם
                        </motion.button>

                        <motion.button
                          onClick={handleNextTopic}
                          disabled={selectedTopicIndex === topics.length - 1}
                          className={`flex items-center gap-2 px-6 py-3 rounded-lg ${
                            selectedTopicIndex === topics.length - 1
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : 'bg-white text-gray-800 hover:bg-yellow-50'
                          } shadow-md transition-colors`}
                          whileHover={selectedTopicIndex !== topics.length - 1 ? { scale: 1.05 } : {}}
                          whileTap={selectedTopicIndex !== topics.length - 1 ? { scale: 0.95 } : {}}
                        >
                          הבא
                          <ChevronLeft size={24} />
                        </motion.button>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center text-gray-600"
                    >
                      בחר נושא מהרשימה למעלה
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>
        </div>

        <div
          id='icon-box'
          className='bg-yellow-500 text-black p-3 rounded-full hover:bg-black hover:text-white cursor-pointer fixed lg:bottom-2 bottom-2 right-6 flex justify-center items-center'
        >
          <div
            onClick={scrollToTop2}
            className="flex justify-center items-center cursor-pointer"
          >
            <FaArrowUp className="text-2xl" />
          </div>
        </div>
      </>
    </>
  );
};

export default ReadingPage;