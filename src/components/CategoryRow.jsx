import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ChannelCard from './ChannelCard';

export default function CategoryRow({
  title,
  channels,
  onPlayChannel,
  isFavorite,
  onToggleFavorite
}) {
  const containerRef = useRef(null);

  const handleScroll = (direction) => {
    if (containerRef.current) {
      const { scrollLeft, clientWidth } = containerRef.current;
      const scrollAmount = clientWidth * 0.75;
      containerRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!channels || channels.length === 0) return null;

  return (
    <div className="category-row">
      <div className="row-header">
        <h3 className="row-title">
          {title} <span className="row-count">({channels.length})</span>
        </h3>
      </div>

      <div className="carousel-wrapper">
        <button
          className="carousel-btn left"
          onClick={() => handleScroll('left')}
          aria-label="Scroll left"
        >
          <ChevronLeft size={28} />
        </button>

        <div className="carousel-container no-scrollbar" ref={containerRef}>
          {channels.map((channel) => (
            <ChannelCard
              key={channel.id}
              channel={channel}
              onPlayChannel={onPlayChannel}
              isFavorite={isFavorite}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>

        <button
          className="carousel-btn right"
          onClick={() => handleScroll('right')}
          aria-label="Scroll right"
        >
          <ChevronRight size={28} />
        </button>
      </div>
    </div>
  );
}
