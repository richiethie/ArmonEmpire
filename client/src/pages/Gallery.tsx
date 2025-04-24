import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import fade from '../assets/img/fade.jpg';
// Define TypeScript interfaces
interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  caption: string;
}

const Gallery: React.FC = () => {
  // Sample gallery images - replace these URLs with your actual barbershop images
  const galleryImages: GalleryImage[] = [
    { id: 1, src: fade, alt: "Classic haircut style", caption: "Classic Cut" },
    { id: 2, src: fade, alt: "Modern fade haircut", caption: "Modern Fade" },
    { id: 3, src: fade, alt: "Beard trim service", caption: "Beard Trim" },
    { id: 4, src: fade, alt: "Straight razor shave", caption: "Straight Razor Shave" },
    { id: 5, src: fade, alt: "Shop interior", caption: "Our Shop" },
    { id: 6, src: fade, alt: "Barber tools", caption: "Professional Tools" },
    { id: 7, src: fade, alt: "Hair styling result", caption: "Style Finishing" },
    { id: 8, src: fade, alt: "Customer experience", caption: "Customer Experience" }
  ];

  // State for lightbox functionality
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);

  // Open lightbox with selected image
  const openLightbox = (image: GalleryImage): void => {
    setSelectedImage(image);
    setLightboxOpen(true);
  };

  // Close lightbox
  const closeLightbox = (): void => {
    setLightboxOpen(false);
  };

  // Navigate to next image in lightbox
  const nextImage = (): void => {
    if (!selectedImage) return;
    const currentIndex = galleryImages.findIndex(img => img.id === selectedImage.id);
    const nextIndex = (currentIndex + 1) % galleryImages.length;
    setSelectedImage(galleryImages[nextIndex]);
  };

  // Navigate to previous image in lightbox
  const prevImage = (): void => {
    if (!selectedImage) return;
    const currentIndex = galleryImages.findIndex(img => img.id === selectedImage.id);
    const prevIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    setSelectedImage(galleryImages[prevIndex]);
  };

  return (
    <>
        <Header />
        <div className="bg-black text-white py-12 px-4 md:px-8 min-h-screen">
        {/* Gallery Header */}
        <div className="text-center my-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Our Gallery</h2>
            <div className="w-24 h-1 bg-white mx-auto"></div>
            <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            A showcase of our finest haircuts, beard trims, and styling work. Every cut tells a story.
            </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.map((image) => (
            <div 
                key={image.id} 
                className="relative overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-105"
                onClick={() => openLightbox(image)}
            >
                <img 
                src={image.src} 
                alt={image.alt}
                className="w-full h-64 object-cover filter grayscale hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end opacity-0 group-hover:opacity-50 transition-opacity duration-300">
                <div className="p-4 w-full">
                    <h3 className="text-white font-bold text-lg">{image.caption}</h3>
                </div>
                </div>
            </div>
            ))}
        </div>

        {/* Lightbox */}
        {lightboxOpen && selectedImage && (
            <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl w-full mx-auto">
                {/* Close button */}
                <button 
                onClick={closeLightbox}
                className="absolute top-4 right-4 text-white p-2 hover:bg-white hover:bg-opacity-20 rounded-full z-10"
                aria-label="Close lightbox"
                >
                <X size={24} />
                </button>
                
                {/* Navigation buttons */}
                <button 
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-2 hover:bg-white hover:bg-opacity-20 rounded-full"
                aria-label="Previous image"
                >
                <ChevronLeft size={28} />
                </button>
                
                <button 
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-2 hover:bg-white hover:bg-opacity-20 rounded-full"
                aria-label="Next image"
                >
                <ChevronRight size={28} />
                </button>
                
                {/* Image container */}
                <div className="w-full">
                <img 
                    src={selectedImage.src} 
                    alt={selectedImage.alt} 
                    className="mx-auto max-h-screen object-contain"
                />
                <div className="text-center mt-4">
                    <h3 className="text-white text-xl font-bold">{selectedImage.caption}</h3>
                </div>
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