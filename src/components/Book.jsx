import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Diamond, ChevronDown,ChevronLeft,ChevronRight} from 'lucide-react';
import { FaArrowUp, FaCopyright } from 'react-icons/fa6';
import { Link } from 'react-scroll';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/fonts.css';
import whatsappIcon from '../images/WhatsApp.webp';
import SEO from '../components/SEO';

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

const TextSpan = ({ item }) => {
  let className = "text-gray-800 font-[sblFont]";

  switch (item.font_size) {
    case "14px":
      className += " text-sm text-gray-600";
      break;
    case "15px":
      className += " text-sm text-gray-600";
      break;
    case "16px":
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
        {item.bold ? <strong> {item.text} </strong> : item.text}
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
            item.bold ? <strong> {part.trim()} </strong> : part.trim()
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

const Paragraph = ({ content }) => {
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

    formattedText += '\n\nכל ההלכות באתר : https://bealcha-ve-beagada.netlify.app/';

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
          {content.title}
        </h3>

        {/* Content */}
        <div className="text-gray-800 leading-relaxed">
          {content.description?.map((item, index) => (
            <TextSpan key={index} item={item} />
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
        <div className={`h-px bg-gradient-to-r from-transparent ${isStory ? 'via-indigo-500' : 'via-yellow-500'} to-transparent flex-grow`} />
        <div className={`w-2 h-2 rounded-full ${isStory ? 'bg-indigo-500' : 'bg-yellow-500'} animate-pulse`} />
        <div className={`h-px bg-gradient-to-r from-transparent ${isStory ? 'via-indigo-500' : 'via-yellow-500'} to-transparent flex-grow`} />
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

  useEffect(() => {
    const loadData = async () => {
      try {
        const jsonData = await import(`../data/${bookTitle}.json`);
        setData(jsonData.default);
      } catch (error) {
        console.error("Failed to load JSON data:", error);
      }
    };

    loadData();
  }, [bookTitle]);

  const topics = groupContentBySubject(data);

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

  // Add scroll to top when component mounts
  useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <>
    <SEO 
        title={`הלכות ${bookTitle}`}
        description={`הלכות ${bookTitle} לקריאה. ${selectedTopic?.title || 'בהלכה ובאגדה '}`}
        keywords={`${bookTitle},הלכות ${bookTitle}, בהלכה ובאגדה ${bookTitle}, ${selectedTopic?.title || 'ספרים'}`}
        canonicalUrl={`https://bealcha-ve-beagada.netlify.app//reading/${bookTitle}`}
      />
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-purple-50 p-8">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-5xl font-[sblFont] font-bold text-gray-800 mb-4">{bookTitle}</h1>
            
            <h2 className="text-2xl font-semibold text-gray-700">
              {selectedTopic ? selectedTopic.title : "בחר נושא"}
            </h2>

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
          </motion.div>

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