import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

// Images
import cut1 from '../assets/haircut/cut1.jpeg';
import cut2 from '../assets/haircut/cut2.jpeg';
import cut3 from '../assets/haircut/cut3.jpg';
import cut4 from '../assets/haircut/cut4.jpeg';

// Videos  (⚠️ MOV works in Safari; for broad support convert to .mp4 or .webm)
import cutvid1 from '../assets/haircut/cutvid1.mov';
import cutvid2 from '../assets/haircut/cutvid2.mov';
import cutvid3 from '../assets/haircut/cutvid3.mov';
import cutvid4 from '../assets/haircut/cutvid4.mov';

/* ---------- Types ---------- */
type MediaType = 'image' | 'video';

interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  caption: string;
  type: MediaType;
}

/* ---------- Component ---------- */
const Gallery: React.FC = () => {
  const galleryItems: GalleryItem[] = [
    { id: 1, src: cut1, alt: 'Classic haircut style', caption: 'Classic Cut', type: 'image' },
    { id: 2, src: cut2, alt: 'Modern fade haircut', caption: 'Modern Fade', type: 'image' },
    { id: 3, src: cut3, alt: 'Beard trim service', caption: 'Beard Trim', type: 'image' },
    { id: 4, src: cut4, alt: 'Straight razor shave', caption: 'Straight Razor Shave', type: 'image' },
    { id: 5, src: cutvid1, alt: 'Shop interior', caption: 'Our Shop', type: 'video' },
    { id: 6, src: cutvid2, alt: 'Barber tools', caption: 'Professional Tools', type: 'video' },
    { id: 7, src: cutvid3, alt: 'Hair styling result', caption: 'Style Finishing', type: 'video' },
    { id: 8, src: cutvid4, alt: 'Customer experience', caption: 'Customer Experience', type: 'video' },
  ];

  const [selected, setSelected]   = useState<GalleryItem | null>(null);
  const [open,      setOpen]      = useState(false);

  const openBox  = (item: GalleryItem) => { setSelected(item); setOpen(true); };
  const closeBox = () => setOpen(false);

  const next = () => {
    if (!selected) return;
    const idx = galleryItems.findIndex(i => i.id === selected.id);
    setSelected(galleryItems[(idx + 1) % galleryItems.length]);
  };

  const prev = () => {
    if (!selected) return;
    const idx = galleryItems.findIndex(i => i.id === selected.id);
    setSelected(galleryItems[(idx - 1 + galleryItems.length) % galleryItems.length]);
  };

  return (
    <>
      <Header />
      <div className="bg-black text-white py-12 px-4 md:px-8 min-h-screen">
        {/* Header */}
        <div className="text-center my-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-2">Our Gallery</h2>
          <div className="w-24 h-1 bg-white mx-auto" />
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            A showcase of our finest haircuts, beard trims, and styling work. Every cut tells a story.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryItems.map(item => (
            <div
              key={item.id}
              className="relative overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-105"
              onClick={() => openBox(item)}
            >
              {item.type === 'image' ? (
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-64 object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              ) : (
                <video
                  src={item.src}
                  muted
                  playsInline
                  loop
                  className="w-full h-64 object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              )}
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end opacity-0 group-hover:opacity-50 transition-opacity duration-300">
                <div className="p-4 w-full">
                  <h3 className="text-white font-bold text-lg">{item.caption}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Light-box */}
        {open && selected && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl w-full mx-auto">
              <button onClick={closeBox} className="absolute top-4 right-4 z-20 text-white p-2 hover:bg-white hover:bg-opacity-20 rounded-full">
                <X size={24} />
              </button>
              <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white p-2 hover:bg-white hover:bg-opacity-20 rounded-full">
                <ChevronLeft size={28} />
              </button>
              <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white p-2 hover:bg-white hover:bg-opacity-20 rounded-full">
                <ChevronRight size={28} />
              </button>

              <div className="w-full">
                {selected.type === 'image' ? (
                  <img src={selected.src} alt={selected.alt} className="mx-auto max-h-screen object-contain" />
                ) : (
                  <div className="relative w-full flex justify-center">
                    <video
                      src={selected.src}
                      controls
                      autoPlay
                      muted
                      className="pointer-events-auto max-h-screen object-contain"
                    />
                  </div>
                )}
                {/* <div className="text-center mt-4">
                  <h3 className="text-white text-xl font-bold">{selected.caption}</h3>
                </div> */}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Gallery;
