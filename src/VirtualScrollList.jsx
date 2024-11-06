import { useState, useEffect, useRef } from 'react';

const VirtualScrollList = ({ items, itemHeight, containerHeight }) => {
  const containerRef = useRef(null);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(Math.ceil(containerHeight / itemHeight));

  // Обработчик скроллинга
  const handleScroll = () => {
    const scrollTop = containerRef.current.scrollTop;
    const newStartIndex = Math.floor(scrollTop / itemHeight);
    const newEndIndex = Math.min(
      items.length - 1,
      newStartIndex + Math.ceil(containerHeight / itemHeight)
    );

    setStartIndex(newStartIndex);
    setEndIndex(newEndIndex);
  };

  useEffect(() => {
    const container = containerRef.current;
    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Элементы в видимой области
  const visibleItems = items.slice(startIndex, endIndex + 1);

  // Пустое пространство сверху и снизу, чтобы создать эффект полного списка
  const topPaddingHeight = startIndex * itemHeight;
  const bottomPaddingHeight = (items.length - endIndex - 1) * itemHeight;

  return (
    <div
      ref={containerRef}
      style={{
        height: `${containerHeight}px`,
        overflowY: 'auto',
        position: 'relative',
      }}
    >
      <div style={{ height: `${topPaddingHeight}px` }} />
      {visibleItems.map((item, index) => (
        <div
          key={startIndex + index}
          style={{
            height: `${itemHeight}px`,
            boxSizing: 'border-box',
            borderBottom: '1px solid #ccc',
            padding: '10px',
          }}
        >
          {item}
        </div>
      ))}
      <div style={{ height: `${bottomPaddingHeight}px` }} />
    </div>
  );
};

export default VirtualScrollList;