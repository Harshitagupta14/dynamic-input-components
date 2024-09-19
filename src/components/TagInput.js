import React, { useRef, useState } from 'react';

const tagSuggestions = ['React', 'Next.js', 'Tailwind', 'JavaScript', 'CSS'];

const TagInput = () => {
  const [inputValue, setInputValue] = useState('');
  const [content, setContent] = useState([]);
  const inputRef = useRef(null);

  // Handle text change
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    const cursorPosition = inputRef.current.selectionStart;

    if (e.key === 'Backspace') {
      if (cursorPosition === 0 && inputValue === '' && content.length > 0) {
        const lastItem = content[content.length - 1];
        //If last item is tag then remove tag
        if (lastItem.type === 'tag') {
          e.preventDefault();
          setContent(content.slice(0, -1));
        } else if (lastItem.type === 'text') { // If last item is text then remove text one by one character
          e.preventDefault();
          const updatedText = lastItem.value.slice(0, -1);
          console.log(updatedText, 'updatedText');
          if (updatedText === '') {
            setContent(content.slice(0, -1));
          } else {
            const updatedContent = [...content];
            updatedContent[content.length - 1] = { ...lastItem, value: updatedText };
            setContent(updatedContent);
          }
        }
      }
    }

    // Handle Enter to add regular text
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      e.preventDefault();
      insertText(inputValue.trim());
    }
  };


  // Insert text at the current cursor position
  const insertText = (text) => {
    const cursorPosition = inputRef.current.selectionStart;
    const currentEnteredText = inputValue.slice(0, cursorPosition);

    const updatedContent = [
      ...content,
      { type: 'text', value: currentEnteredText },
      { type: 'tag', value: text }
    ];

    setContent(updatedContent);
    setInputValue('');
    //Focus again on input
    inputRef.current.focus();
  };

  // Insert clicked tag from the suggestion list
  const insertTagAtCursor = (tag) => {
    const cursorPosition = inputRef.current.selectionStart;
    const currentInputVal = inputValue.slice(0, cursorPosition);

    const updatedContent = [
      ...content,
      { type: 'text', value: currentInputVal },
      { type: 'tag', value: tag },
    ];

    setContent(updatedContent);
    setInputValue('');
    inputRef.current.focus();
  };

  // Delete clicked tag
  const deleteTag = (indexToDelete) => {
    const updatedContent = content.filter((_, index) => index !== indexToDelete);
    setContent(updatedContent);
  };

  return (
    <div className="p-4">
      <div
        className="border p-2 w-full items-center"
        onClick={() => inputRef.current.focus()}
      >
        {
          content.map((item, index) => {
            if (item.type === 'text') {
              return <span key={index}>{item.value}</span>;
            } else if (item.type === 'tag') {
              return (
                <span key={index} className="mr-3 bg-gray-200 p-2 rounded-full">
                  {item.value}
                  <button className="ml-1 w-6 h-6 bg-gray-800 text-white rounded-full items-center justify-center" onClick={() => deleteTag(index)}>
                    &times;
                  </button>
                </span>
              );
            }
          })
        }
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="outline-none"
          placeholder="Type here"
        />
      </div>

      {/* Suggested Tags */}
      <div className="mt-4 space-x-2">
        {tagSuggestions.map((tag) => (
          <button
            key={tag}
            className="bg-gray-200 text-gray-800 px-2 py-1 rounded"
            onClick={() => insertTagAtCursor(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TagInput;
