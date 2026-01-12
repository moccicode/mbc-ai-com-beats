
import React, { useState, useCallback, useEffect } from 'react';
import { getMusicRecommendations } from './geminiService';
import { Song, LoadingState, RecommendationResponse } from './types';
import SongCard from './components/SongCard';

const App: React.FC = () => {
  const [theme, setTheme] = useState('');
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = useCallback(async (selectedTheme: string) => {
    if (!selectedTheme.trim()) return;
    
    setLoadingState(LoadingState.LOADING);
    setError(null);
    
    try {
      const data = await getMusicRecommendations(selectedTheme);
      setRecommendations(data);
      setLoadingState(LoadingState.SUCCESS);
    } catch (err) {
      console.error(err);
      setError('추천을 가져오는 데 실패했습니다. 다시 시도해 주세요.');
      setLoadingState(LoadingState.ERROR);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRecommendations(theme);
  };

  const handleRefresh = () => {
    fetchRecommendations(theme);
  };

  const presetThemes = ['달콤한 로맨스', '봄날의 벚꽃 감성', '사랑스러운 아이돌 노래', '잔잔한 어쿠스틱', '활기찬 아침 팝송'];

  return (
    <div className="min-h-screen bg-[#fff5f7] text-gray-800 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-lg border-b border-pink-50">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-pink-500 rounded-2xl flex items-center justify-center shadow-pink-200 shadow-lg">
              <i className="fas fa-heart text-white text-sm"></i>
            </div>
            <h1 className="text-xl font-extrabold tracking-tight">
              LOVELY <span className="text-pink-500">VIBES</span>
            </h1>
          </div>
          {loadingState === LoadingState.SUCCESS && (
            <button 
              onClick={handleRefresh}
              className="p-2.5 text-pink-400 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-all"
              title="다시 추천받기"
            >
              <i className={`fas fa-magic ${loadingState === LoadingState.LOADING ? 'animate-pulse' : ''}`}></i>
            </button>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 pt-10">
        {/* Search Section */}
        <section className="mb-12 text-center">
          <h2 className="text-3xl font-extrabold mb-3 leading-tight pink-gradient-text">
            포근한 출근길,<br />
            어떤 설렘을 들을까요?
          </h2>
          <p className="text-pink-300 mb-8 text-sm font-bold tracking-wide">
            ♥ 매일 아침 전해지는 7가지 음악 선물 ♥
          </p>

          <form onSubmit={handleSearch} className="relative mb-6 max-w-lg mx-auto">
            <input 
              type="text" 
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="좋아하는 무드나 장르를 적어주세요!"
              className="w-full bg-white border-2 border-pink-100 focus:border-pink-400 rounded-3xl py-4.5 pl-7 pr-20 outline-none transition-all font-semibold shadow-sm focus:shadow-pink-100"
            />
            <button 
              type="submit"
              disabled={loadingState === LoadingState.LOADING || !theme.trim()}
              className="absolute right-2 top-2 bottom-2 bg-pink-500 text-white px-6 rounded-2xl font-extrabold hover:bg-pink-600 active:scale-95 transition-all disabled:bg-pink-200 shadow-md shadow-pink-200"
            >
              {loadingState === LoadingState.LOADING ? <i className="fas fa-heart animate-beat inline-block"></i> : '보내기'}
            </button>
          </form>

          <div className="flex flex-wrap justify-center gap-2">
            {presetThemes.map(t => (
              <button 
                key={t}
                onClick={() => { setTheme(t); fetchRecommendations(t); }}
                className="text-xs font-bold px-4 py-2 rounded-full bg-white border border-pink-100 text-pink-400 hover:bg-pink-50 hover:border-pink-300 transition-all shadow-sm"
              >
                # {t}
              </button>
            ))}
          </div>
        </section>

        {/* Results Section */}
        {loadingState === LoadingState.LOADING && (
          <div className="flex flex-col items-center justify-center py-20 space-y-6">
            <div className="relative">
               <div className="w-16 h-16 border-4 border-pink-100 border-t-pink-500 rounded-full animate-spin"></div>
               <i className="fas fa-heart absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-pink-500 animate-pulse"></i>
            </div>
            <p className="text-pink-400 font-bold tracking-tight">당신만을 위한 플레이리스트를 준비하고 있어요...</p>
          </div>
        )}

        {error && (
          <div className="bg-rose-50 text-rose-600 p-5 rounded-3xl flex items-center gap-4 mb-8 border border-rose-100">
            <i className="fas fa-heart-broken text-lg"></i>
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        {loadingState === LoadingState.SUCCESS && recommendations && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col items-center gap-2 text-center">
              <span className="bg-pink-500 text-white px-4 py-1 rounded-full font-black text-xs shadow-lg shadow-pink-100">TODAY'S 7 SONGS</span>
              <h3 className="text-2xl font-black text-gray-800 tracking-tight">{recommendations.themeDescription}</h3>
            </div>
            
            <div className="grid gap-5">
              {recommendations.songs.map((song, idx) => (
                <SongCard key={`${song.title}-${idx}`} song={song} index={idx} />
              ))}
            </div>

            <div className="pt-10 flex justify-center pb-10">
              <button 
                onClick={handleRefresh}
                className="flex items-center gap-3 bg-white text-pink-500 px-10 py-4 rounded-full font-black hover:bg-pink-50 hover:shadow-xl transition-all border-2 border-pink-100 shadow-lg shadow-pink-50"
              >
                <i className="fas fa-redo-alt"></i>
                다른 추천도 받아볼까요?
              </button>
            </div>
          </div>
        )}

        {loadingState === LoadingState.IDLE && (
          <div className="py-24 text-center">
            <div className="mb-8 inline-flex w-28 h-28 bg-white rounded-full items-center justify-center text-pink-100 shadow-inner relative">
              <i className="fas fa-music text-5xl"></i>
              <i className="fas fa-heart absolute -top-2 -right-2 text-pink-400 text-2xl animate-bounce"></i>
            </div>
            <p className="text-pink-200 font-black text-lg">오늘 아침을 빛낼 음악을 찾아봐요!</p>
          </div>
        )}
      </main>

      {/* Footer info */}
      <footer className="fixed bottom-0 left-0 right-0 p-6 flex justify-center pointer-events-none">
         <div className="bg-white/90 border border-pink-100 text-pink-500 px-6 py-3 rounded-full text-[10px] font-black tracking-[0.2em] pointer-events-auto shadow-xl backdrop-blur-sm">
           MADE WITH LOVE BY GEMINI
         </div>
      </footer>
      
      <style>{`
        @keyframes beat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        .animate-beat {
          animation: beat 1s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default App;
