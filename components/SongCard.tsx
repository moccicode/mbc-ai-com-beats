
import React from 'react';
import { Song } from '../types';

interface SongCardProps {
  song: Song;
  index: number;
}

const SongCard: React.FC<SongCardProps> = ({ song, index }) => {
  const youtubeLink = `https://www.youtube.com/results?search_query=${encodeURIComponent(song.artist + ' ' + song.title)}`;

  return (
    <a 
      href={youtubeLink}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-white border border-pink-100 rounded-3xl p-5 shadow-sm hover:shadow-lg hover:border-pink-300 transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-400 group-hover:bg-pink-100 group-hover:text-pink-500 transition-colors">
          <span className="text-xl font-extrabold">{index + 1}</span>
        </div>
        
        <div className="flex-grow">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-bold text-gray-800 group-hover:text-pink-600 truncate mr-2">
              {song.title}
            </h3>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
              song.isKorean ? 'bg-pink-100 text-pink-600' : 'bg-purple-100 text-purple-600'
            }`}>
              {song.isKorean ? 'K-Music' : 'Global'}
            </span>
          </div>
          <p className="text-sm font-semibold text-gray-500 mb-2">{song.artist}</p>
          <div className="flex items-center text-xs text-pink-300">
            <i className="fas fa-heart mr-2 text-[10px]"></i>
            <span className="italic font-medium">{song.reason}</span>
          </div>
        </div>

        <div className="flex-shrink-0 self-center">
          <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-all shadow-sm">
            <i className="fab fa-youtube text-lg"></i>
          </div>
        </div>
      </div>
    </a>
  );
};

export default SongCard;
