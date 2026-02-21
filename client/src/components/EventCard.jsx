import React, { useState } from 'react';
import { Calendar, MapPin, ChevronRight, Share2, Heart, ExternalLink } from 'lucide-react';

const EventCard = ({ event, onGetTickets, index }) => {
    const [liked, setLiked] = useState(false);

    return (
        <div
            className="group relative flex flex-col rounded-[2.5rem] bg-bg-card border border-white/5 overflow-hidden transition-all duration-500 hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-8 fill-mode-both"
            style={{ animationDelay: `${index * 80}ms` }}
        >
            {/* Image Container */}
            <div className="relative h-60 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-transparent to-transparent z-10 opacity-70"></div>

                {/* Category Badge */}
                <div className="absolute top-5 left-5 z-20 flex gap-2 flex-wrap">
                    {(event.category || []).slice(0, 2).map((cat, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-full bg-indigo-600/90 backdrop-blur-md text-[9px] font-black text-white uppercase tracking-widest border border-white/10">
                            {cat}
                        </span>
                    ))}
                    {(!event.category || event.category.length === 0) && (
                        <span className="px-3 py-1.5 rounded-full bg-indigo-600/90 backdrop-blur-md text-[9px] font-black text-white uppercase tracking-widest border border-white/10">
                            Featured
                        </span>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="absolute top-5 right-5 z-20 flex gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
                        className={`p-2.5 rounded-full backdrop-blur-md border border-white/10 transition-all ${liked ? 'bg-rose-500 text-white' : 'bg-white/10 text-white hover:bg-rose-500'}`}
                    >
                        <Heart size={15} className={liked ? 'fill-white' : ''} />
                    </button>
                    <a
                        href={event.originalUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="p-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white hover:text-black transition-all"
                        title="View Original Source"
                    >
                        <ExternalLink size={15} />
                    </a>
                </div>

                <img
                    src={event.imageUrl || 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=800&q=80'}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=800&q=80'; }}
                />
            </div>

            {/* Content Body */}
            <div className="flex-1 p-7 flex flex-col">
                <div className="flex-1">
                    {/* Date + City */}
                    <div className="flex items-center gap-3 text-indigo-400 mb-3 flex-wrap">
                        <div className="flex items-center gap-1 text-[11px] font-black uppercase tracking-widest">
                            <Calendar size={13} className="mb-0.5" />
                            <span>{event.date || 'Date TBA'}</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-white/20"></div>
                        <div className="flex items-center gap-1 text-[11px] font-black uppercase tracking-widest">
                            <MapPin size={13} className="mb-0.5" />
                            <span>{event.city}</span>
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-black text-white mb-3 line-clamp-2 leading-tight transition-colors group-hover:text-indigo-400 tracking-tight">
                        {event.title}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-500 text-sm font-medium line-clamp-2 leading-relaxed mb-4">
                        {event.summary || event.description || 'No description available for this experience.'}
                    </p>
                </div>

                {/* Footer */}
                <div className="pt-5 border-t border-white/5 flex items-center justify-between">
                    <div className="min-w-0 flex-1 mr-4">
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Venue</p>
                        <p className="text-sm font-black text-slate-300 truncate">{event.venue || 'Venue TBA'}</p>
                        <p className="text-[9px] font-black text-slate-700 uppercase tracking-wider mt-1 truncate">
                            via {event.sourceName}
                        </p>
                    </div>

                    <button
                        onClick={onGetTickets}
                        className="flex-shrink-0 flex items-center gap-2 group/btn bg-white text-black px-5 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all shadow-lg active:scale-95"
                    >
                        GET TICKETS
                        <ChevronRight size={15} className="transition-transform group-hover/btn:translate-x-1" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
