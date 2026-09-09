import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Image as ImageIcon, 
  Search, 
  Filter, 
  Plus, 
  FolderPlus, 
  Trash2, 
  Edit3, 
  Eye, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  ExternalLink, 
  ArrowLeft, 
  ChevronRight, 
  X, 
  Upload, 
  Star, 
  Calendar, 
  Folder, 
  Download, 
  Copy, 
  Check, 
  Grid, 
  ListFilter,
  Maximize2,
  RefreshCw,
  SlidersHorizontal,
  FileImage,
  UploadCloud
} from 'lucide-react';
import initialGalleryData from '../../data/galleryData.json';

const STORAGE_KEY = 'stphilos_gallery_cms_v1';

export default function AdminGalleryManagerPage() {
  // Persistence state
  const [albums, setAlbums] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load gallery from storage:', e);
    }
    return initialGalleryData.albums || [];
  });

  const [activeTab, setActiveTab] = useState('albums'); // 'albums', 'all_photos'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'photos_desc', 'title_asc'
  
  // Selected Album for inspection / editing
  const [currentAlbum, setCurrentAlbum] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [copiedUrl, setCopiedUrl] = useState('');

  // Modals
  const [isCreateAlbumOpen, setIsCreateAlbumOpen] = useState(false);
  const [isEditAlbumOpen, setIsEditAlbumOpen] = useState(false);
  const [isAddPhotosOpen, setIsAddPhotosOpen] = useState(false);
  const [feedback, setFeedback] = useState('');

  // Dropzone drag-over state
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFilesList, setUploadedFilesList] = useState([]); // Array of { name, size, dataUrl }
  const [coverPhotoIndex, setCoverPhotoIndex] = useState(0);

  // Forms
  const [newAlbumForm, setNewAlbumForm] = useState({
    title: '',
    category: 'events',
    categoryLabel: 'Events & Fests',
    year: '2026',
    cover: ''
  });

  const [editAlbumForm, setEditAlbumForm] = useState({
    id: '',
    title: '',
    category: 'events',
    categoryLabel: 'Events & Fests',
    year: '2026',
    cover: ''
  });

  const fileInputRef = useRef(null);
  const addPhotosInputRef = useRef(null);
  const [addPhotosList, setAddPhotosList] = useState([]);

  // Save changes to localStorage
  const saveAlbums = (updatedAlbums) => {
    setAlbums(updatedAlbums);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAlbums));
    } catch (e) {
      console.warn('Failed to persist gallery changes:', e);
    }
  };

  const showFeedback = (msg) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(''), 4000);
  };

  // Sync currentAlbum when albums state changes
  useEffect(() => {
    if (currentAlbum) {
      const updated = albums.find(a => a.id === currentAlbum.id || a.slug === currentAlbum.slug);
      if (updated) setCurrentAlbum(updated);
    }
  }, [albums]);

  // Categories config
  const categories = [
    { id: 'all', label: 'All Albums' },
    { id: 'events', label: 'Events & Fests' },
    { id: 'academics', label: 'Academics & Seminars' },
    { id: 'sports', label: 'Sports & Athletics' },
    { id: 'cultural', label: 'Cultural & Heritage' },
    { id: 'outreach', label: 'Campus Life & Community' }
  ];

  // Stats calculation
  const totalAlbumsCount = albums.length;
  const totalPhotosCount = useMemo(() => {
    return albums.reduce((sum, a) => sum + (a.images?.length || 0), 0);
  }, [albums]);

  // Filtered & Sorted Albums
  const filteredAlbums = useMemo(() => {
    return albums
      .filter((a) => {
        const matchesCategory = selectedCategory === 'all' || a.category === selectedCategory;
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch = !q || 
          (a.title || '').toLowerCase().includes(q) ||
          (a.year || '').toLowerCase().includes(q) ||
          (a.categoryLabel || '').toLowerCase().includes(q);
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return (b.year || '0').localeCompare(a.year || '0');
        if (sortBy === 'oldest') return (a.year || '0').localeCompare(b.year || '0');
        if (sortBy === 'photos_desc') return (b.images?.length || 0) - (a.images?.length || 0);
        if (sortBy === 'title_asc') return (a.title || '').localeCompare(b.title || '');
        return 0;
      });
  }, [albums, selectedCategory, searchQuery, sortBy]);

  // Flattened All Photos
  const allFlattenedPhotos = useMemo(() => {
    const list = [];
    albums.forEach((album) => {
      (album.images || []).forEach((imgUrl, idx) => {
        list.push({
          url: imgUrl,
          albumId: album.id,
          albumTitle: album.title,
          albumSlug: album.slug,
          category: album.category,
          year: album.year,
          index: idx
        });
      });
    });
    return list;
  }, [albums]);

  const filteredAllPhotos = useMemo(() => {
    return allFlattenedPhotos.filter((p) => {
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        p.albumTitle.toLowerCase().includes(q) ||
        p.url.toLowerCase().includes(q) ||
        (p.year && p.year.includes(q));
      return matchCat && matchSearch;
    });
  }, [allFlattenedPhotos, selectedCategory, searchQuery]);

  // Process selected or dropped files into Base64 DataURLs
  const processFiles = (files, targetStateSetter) => {
    const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (validFiles.length === 0) {
      alert('Please select valid image files (JPG, PNG, WebP, etc.)');
      return;
    }

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        targetStateSetter((prev) => [
          ...prev,
          {
            name: file.name,
            size: Math.round(file.size / 1024),
            dataUrl: event.target.result
          }
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Drag and Drop handlers for Create Album
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDropCreate = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files, setUploadedFilesList);
    }
  };

  const handleDropAdd = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files, setAddPhotosList);
    }
  };

  // Create Album
  const handleCreateAlbum = (e) => {
    e.preventDefault();
    if (!newAlbumForm.title.trim()) {
      alert('Please enter an album title');
      return;
    }

    const slug = newAlbumForm.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const catObj = categories.find(c => c.id === newAlbumForm.category) || categories[1];
    
    // Collect all uploaded images
    const imagesArray = uploadedFilesList.map(item => item.dataUrl);
    const coverImage = (uploadedFilesList[coverPhotoIndex] && uploadedFilesList[coverPhotoIndex].dataUrl) ||
                       imagesArray[0] || 
                       newAlbumForm.cover || 
                       '/assets/banner-college.jpg';

    const newAlbum = {
      id: `alb_${Date.now()}`,
      slug: slug || `album-${Date.now()}`,
      title: newAlbumForm.title.trim(),
      category: newAlbumForm.category,
      categoryLabel: catObj.label,
      year: newAlbumForm.year || '2026',
      sourceUrl: `https://stphilos.ac.in/${slug}/`,
      cover: coverImage,
      imageCount: imagesArray.length,
      images: imagesArray
    };

    saveAlbums([newAlbum, ...albums]);
    setIsCreateAlbumOpen(false);
    setNewAlbumForm({
      title: '',
      category: 'events',
      categoryLabel: 'Events & Fests',
      year: '2026',
      cover: ''
    });
    setUploadedFilesList([]);
    setCoverPhotoIndex(0);
    showFeedback(`✓ Album "${newAlbum.title}" created with ${imagesArray.length} photographs!`);
  };

  // Edit Album Details
  const handleSaveAlbumEdit = (e) => {
    e.preventDefault();
    if (!editAlbumForm.title.trim()) return;

    const catObj = categories.find(c => c.id === editAlbumForm.category) || categories[1];

    const updated = albums.map(a => {
      if (a.id === editAlbumForm.id) {
        return {
          ...a,
          title: editAlbumForm.title.trim(),
          category: editAlbumForm.category,
          categoryLabel: catObj.label,
          year: editAlbumForm.year,
          cover: editAlbumForm.cover || a.cover
        };
      }
      return a;
    });

    saveAlbums(updated);
    setIsEditAlbumOpen(false);
    showFeedback('✓ Album details updated successfully!');
  };

  // Delete Album
  const handleDeleteAlbum = (album) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${album.title}" and its ${album.images?.length || 0} photos?`)) {
      return;
    }
    const updated = albums.filter(a => a.id !== album.id);
    saveAlbums(updated);
    if (currentAlbum?.id === album.id) {
      setCurrentAlbum(null);
    }
    showFeedback(`✓ Album "${album.title}" deleted.`);
  };

  // Add Photos to Album
  const handleAddPhotosToAlbum = (e) => {
    e.preventDefault();
    if (!currentAlbum) return;

    const newUrls = addPhotosList.map(item => item.dataUrl);

    if (newUrls.length === 0) {
      alert('Please drop or select at least one photo to upload');
      return;
    }

    const updatedImages = [...(currentAlbum.images || []), ...newUrls];
    const updatedAlbum = {
      ...currentAlbum,
      images: updatedImages,
      imageCount: updatedImages.length,
      cover: currentAlbum.cover || newUrls[0]
    };

    const updatedAlbums = albums.map(a => a.id === currentAlbum.id ? updatedAlbum : a);
    saveAlbums(updatedAlbums);
    setCurrentAlbum(updatedAlbum);
    setIsAddPhotosOpen(false);
    setAddPhotosList([]);
    showFeedback(`✓ Added ${newUrls.length} photograph(s) to "${currentAlbum.title}".`);
  };

  // Set Photo as Cover
  const handleSetAsCover = (imgUrl) => {
    if (!currentAlbum) return;
    const updatedAlbum = {
      ...currentAlbum,
      cover: imgUrl
    };
    const updatedAlbums = albums.map(a => a.id === currentAlbum.id ? updatedAlbum : a);
    saveAlbums(updatedAlbums);
    setCurrentAlbum(updatedAlbum);
    showFeedback('⭐ Set photo as album cover thumbnail!');
  };

  // Delete Individual Photo
  const handleDeletePhoto = (imgIndex) => {
    if (!currentAlbum) return;
    if (!window.confirm('Remove this photo from the album?')) return;

    const updatedImages = currentAlbum.images.filter((_, idx) => idx !== imgIndex);
    const updatedAlbum = {
      ...currentAlbum,
      images: updatedImages,
      imageCount: updatedImages.length,
      cover: currentAlbum.cover === currentAlbum.images[imgIndex] ? (updatedImages[0] || '') : currentAlbum.cover
    };

    const updatedAlbums = albums.map(a => a.id === currentAlbum.id ? updatedAlbum : a);
    saveAlbums(updatedAlbums);
    setCurrentAlbum(updatedAlbum);
    showFeedback('✓ Photo removed from album.');
  };

  // Copy Link Helper
  const copyPhotoLink = (url) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(''), 2000);
  };

  // Reset to Factory Seed
  const handleResetToDefaults = () => {
    if (window.confirm('Reset gallery library to official default dataset (86 albums, 1,763 photos)?')) {
      localStorage.removeItem(STORAGE_KEY);
      setAlbums(initialGalleryData.albums || []);
      setCurrentAlbum(null);
      showFeedback('✓ Restored official gallery manifest dataset!');
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* 1. TOP METRONIC CMS HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold font-mono text-slate-700 uppercase tracking-wider bg-slate-100 px-2.5 py-0.5 rounded-full">
              Metronic Media Hub
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              1,763 Verified Images Synced
            </span>
          </div>
          <h1 className="font-extrabold text-2xl sm:text-3xl text-[#191d28] tracking-tight">
            Photo Gallery & Media Asset Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-2xl leading-relaxed">
            Drag & drop new photos, organize event albums, set cover thumbnails, and manage campus media assets.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleResetToDefaults}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center space-x-1.5 cursor-pointer"
            title="Reset to factory dataset"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>

          <a
            href="/gallery"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors inline-flex items-center space-x-1.5"
          >
            <span>Live Gallery</span>
            <ExternalLink className="w-3.5 h-3.5 ml-1" />
          </a>

          <button
            onClick={() => {
              setUploadedFilesList([]);
              setCoverPhotoIndex(0);
              setIsCreateAlbumOpen(true);
            }}
            className="bg-[#18191f] hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold inline-flex items-center space-x-1.5 shadow-xs cursor-pointer transition-all"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload & Create Album</span>
          </button>
        </div>
      </div>

      {/* FEEDBACK TOAST */}
      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedback}</span>
          </div>
          <button onClick={() => setFeedback('')} className="p-1 text-emerald-600 hover:text-emerald-900 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. STATS OVERVIEW METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-50/80 border border-slate-200/60 p-4 rounded-2xl space-y-1 shadow-xs hover:border-slate-300 transition-colors">
          <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Total Albums</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#191d28] font-mono">{totalAlbumsCount}</p>
          <span className="text-[10px] text-slate-400">Organized event collections</span>
        </div>
        <div className="bg-slate-50/80 border border-slate-200/60 p-4 rounded-2xl space-y-1 shadow-xs hover:border-slate-300 transition-colors">
          <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Total Photographs</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#191d28] font-mono">{totalPhotosCount}</p>
          <span className="text-[10px] text-slate-400">High-resolution campus assets</span>
        </div>
        <div className="bg-slate-50/80 border border-slate-200/60 p-4 rounded-2xl space-y-1 shadow-xs hover:border-slate-300 transition-colors">
          <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Event Categories</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#191d28] font-mono">5 Streams</p>
          <span className="text-[10px] text-slate-400">Academics, Sports, Fests</span>
        </div>
        <div className="bg-slate-50/80 border border-slate-200/60 p-4 rounded-2xl space-y-1 shadow-xs hover:border-slate-300 transition-colors">
          <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Current Filter Match</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-mono">
            {activeTab === 'albums' ? filteredAlbums.length : filteredAllPhotos.length}
          </p>
          <span className="text-[10px] text-slate-400">{activeTab === 'albums' ? 'Albums' : 'Individual Photos'}</span>
        </div>
      </div>

      {/* 3. ALBUM INSPECTOR VIEW (IF AN ALBUM IS CURRENTLY OPENED) */}
      {currentAlbum ? (
        <div className="space-y-6 animate-fadeIn">
          {/* Breadcrumb Header */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <button
                onClick={() => setCurrentAlbum(null)}
                className="inline-flex items-center text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                <span>Back to All Albums</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setEditAlbumForm({
                      id: currentAlbum.id,
                      title: currentAlbum.title,
                      category: currentAlbum.category,
                      categoryLabel: currentAlbum.categoryLabel,
                      year: currentAlbum.year || '2026',
                      cover: currentAlbum.cover
                    });
                    setIsEditAlbumOpen(true);
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors inline-flex items-center space-x-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Edit Info</span>
                </button>

                <button
                  onClick={() => {
                    setAddPhotosList([]);
                    setIsAddPhotosOpen(true);
                  }}
                  className="bg-[#18191f] hover:bg-black text-white px-3.5 py-1.5 rounded-xl text-xs font-bold inline-flex items-center space-x-1.5 cursor-pointer transition-all"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Drop & Upload Photos</span>
                </button>

                <button
                  onClick={() => handleDeleteAlbum(currentAlbum)}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold transition-colors inline-flex items-center space-x-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Album</span>
                </button>
              </div>
            </div>

            {/* Album Header Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shrink-0 relative">
                <img
                  src={currentAlbum.cover || (currentAlbum.images && currentAlbum.images[0]) || '/assets/banner-college.jpg'}
                  alt={currentAlbum.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/assets/banner-college.jpg';
                  }}
                />
                <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-mono font-bold px-1 rounded">
                  COVER
                </span>
              </div>
              
              <div className="space-y-1 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 font-mono text-[10px] font-bold rounded-full uppercase border border-slate-200">
                    {currentAlbum.categoryLabel || currentAlbum.category}
                  </span>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-mono text-[10px] font-bold rounded">
                    Year: {currentAlbum.year || '2026'}
                  </span>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-800 font-mono text-[10px] font-bold rounded border border-slate-200">
                    {currentAlbum.images?.length || 0} Photographs
                  </span>
                </div>
                <h2 className="font-extrabold text-xl sm:text-2xl text-[#191d28]">
                  {currentAlbum.title}
                </h2>
                <p className="text-xs text-slate-500 font-mono">
                  Slug: <span className="text-slate-700 font-semibold">{currentAlbum.slug}</span> · Source: {currentAlbum.sourceUrl || 'College Official Media'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Drop Zone inside Album */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                processFiles(e.dataTransfer.files, (newItems) => {
                  const urls = newItems.map(i => i.dataUrl);
                  const updatedImages = [...(currentAlbum.images || []), ...urls];
                  const updatedAlbum = {
                    ...currentAlbum,
                    images: updatedImages,
                    imageCount: updatedImages.length,
                    cover: currentAlbum.cover || urls[0]
                  };
                  const updatedAlbums = albums.map(a => a.id === currentAlbum.id ? updatedAlbum : a);
                  saveAlbums(updatedAlbums);
                  setCurrentAlbum(updatedAlbum);
                  showFeedback(`✓ Uploaded ${urls.length} photo(s) directly to album!`);
                });
              }
            }}
            onClick={() => addPhotosInputRef.current?.click()}
            className={`p-6 rounded-2xl border-2 border-dashed transition-all text-center cursor-pointer flex flex-col items-center justify-center space-y-2 ${
              isDragging
                ? 'border-slate-800 bg-slate-100 scale-[1.01]'
                : 'border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50/80'
            }`}
          >
            <input
              ref={addPhotosInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  processFiles(e.target.files, (newItems) => {
                    const urls = newItems.map(i => i.dataUrl);
                    const updatedImages = [...(currentAlbum.images || []), ...urls];
                    const updatedAlbum = {
                      ...currentAlbum,
                      images: updatedImages,
                      imageCount: updatedImages.length,
                      cover: currentAlbum.cover || urls[0]
                    };
                    const updatedAlbums = albums.map(a => a.id === currentAlbum.id ? updatedAlbum : a);
                    saveAlbums(updatedAlbums);
                    setCurrentAlbum(updatedAlbum);
                    showFeedback(`✓ Uploaded ${urls.length} photo(s) directly to album!`);
                  });
                }
              }}
            />
            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">
                Drag & drop photos here or <span className="text-slate-900 underline">browse files to upload</span>
              </p>
              <p className="text-[10px] text-slate-500">Supports JPG, PNG, WebP, GIF (Multiple files supported)</p>
            </div>
          </div>

          {/* Album Photos Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-lg text-[#191d28]">
                Photographs in this Album ({currentAlbum.images?.length || 0})
              </h3>
              <p className="text-xs text-slate-500">Click any photo to preview, set as cover, or remove.</p>
            </div>

            {(!currentAlbum.images || currentAlbum.images.length === 0) ? (
              <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-300 text-center space-y-3">
                <ImageIcon className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="font-bold text-base text-slate-800">This album is currently empty</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Drag and drop files above or click the button below to upload photos.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {currentAlbum.images.map((imgUrl, idx) => {
                  const isCover = currentAlbum.cover === imgUrl;
                  const isCopied = copiedUrl === imgUrl;
                  return (
                    <div
                      key={idx}
                      className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all group flex flex-col justify-between relative"
                    >
                      {/* Image Thumbnail Container */}
                      <div 
                        onClick={() => setLightboxImage(imgUrl)}
                        className="aspect-square bg-slate-900 relative overflow-hidden cursor-pointer"
                      >
                        <img
                          src={imgUrl}
                          alt={`${currentAlbum.title} ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = '/assets/banner-college.jpg';
                          }}
                        />

                        {/* Top Indicators */}
                        <div className="absolute top-1.5 left-1.5 right-1.5 flex items-center justify-between pointer-events-none">
                          <span className="bg-black/70 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded">
                            #{String(idx + 1).padStart(3, '0')}
                          </span>
                          {isCover && (
                            <span className="bg-[#18191f] text-white font-mono text-[9px] font-extrabold px-1.5 py-0.5 rounded flex items-center shadow-xs">
                              <Star className="w-2.5 h-2.5 mr-0.5 fill-current" />
                              COVER
                            </span>
                          )}
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="bg-white text-slate-900 text-[10px] font-bold px-2 py-1 rounded-full flex items-center space-x-1 shadow-sm">
                            <Maximize2 className="w-3 h-3" />
                            <span>Preview</span>
                          </span>
                        </div>
                      </div>

                      {/* Photo Footer Actions */}
                      <div className="p-2 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-1">
                        <button
                          onClick={() => handleSetAsCover(imgUrl)}
                          disabled={isCover}
                          className={`p-1.5 rounded text-[10px] font-bold flex items-center space-x-1 transition-colors ${
                            isCover
                              ? 'text-slate-900 font-extrabold cursor-default'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200 cursor-pointer'
                          }`}
                          title={isCover ? 'Current Cover Image' : 'Set as Album Cover'}
                        >
                          <Star className={`w-3.5 h-3.5 ${isCover ? 'fill-current text-slate-900' : ''}`} />
                          <span className="hidden sm:inline">{isCover ? 'Cover' : 'Set Cover'}</span>
                        </button>

                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => copyPhotoLink(imgUrl)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors"
                            title="Copy image link"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => handleDeletePhoto(idx)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                            title="Delete photo from album"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* 4. MAIN ALBUMS CATALOG & ALL PHOTOS BROWSER */
        <div className="space-y-6">
          
          {/* Controls Bar: Navigation Tabs, Category Selector & Search */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-100 pb-3">
              {/* Primary View Toggle */}
              <div className="inline-flex p-1 bg-slate-100/80 border border-slate-200/60 rounded-2xl space-x-1 text-xs font-bold font-sans">
                <button
                  onClick={() => setActiveTab('albums')}
                  className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
                    activeTab === 'albums'
                      ? 'bg-[#18191f] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Folder className="w-3.5 h-3.5" />
                  <span>Albums Catalogue ({albums.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('all_photos')}
                  className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
                    activeTab === 'all_photos'
                      ? 'bg-[#18191f] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span>All Media Assets ({totalPhotosCount})</span>
                </button>
              </div>

              {/* Search Box */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={activeTab === 'albums' ? 'Search album title, year...' : 'Search photo filenames...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-slate-900 focus:bg-white transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Filter Pills & Sort Selector */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex flex-wrap items-center gap-1.5">
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#18191f] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {activeTab === 'albums' && (
                <div className="flex items-center space-x-2 text-xs text-slate-500">
                  <span className="font-semibold">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#1C5496]"
                  >
                    <option value="newest">Newest Year</option>
                    <option value="oldest">Oldest Year</option>
                    <option value="photos_desc">Most Photos</option>
                    <option value="title_asc">Title (A-Z)</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* TAB 1: ALBUMS CATALOGUE GRID */}
          {activeTab === 'albums' && (
            <div className="space-y-4">
              {filteredAlbums.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
                  <Folder className="w-12 h-12 text-slate-300 mx-auto" />
                  <h4 className="font-extrabold text-base text-[#191d28]">No photo albums match your search</h4>
                  <p className="text-xs text-slate-500">Try adjusting your search query or selecting "All Albums".</p>
                  <button
                    onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredAlbums.map((album) => {
                    const coverImg = album.cover || (album.images && album.images[0]) || '/assets/banner-college.jpg';
                    return (
                      <div
                        key={album.id}
                        className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
                      >
                        {/* Album Cover Container */}
                        <div 
                          onClick={() => setCurrentAlbum(album)}
                          className="aspect-[16/10] bg-slate-900 relative overflow-hidden cursor-pointer"
                        >
                          <img
                            src={coverImg}
                            alt={album.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                            onError={(e) => {
                              e.target.src = '/assets/banner-college.jpg';
                            }}
                          />

                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                          {/* Top Badges */}
                          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                            <span className="bg-[#18191f]/90 text-white text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-lg uppercase tracking-wider backdrop-blur-xs border border-white/10">
                              {album.categoryLabel || album.category}
                            </span>
                            {album.year && (
                              <span className="bg-black/60 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg backdrop-blur-xs">
                                {album.year}
                              </span>
                            )}
                          </div>

                          {/* Bottom Count inside Photo */}
                          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white">
                            <span className="text-[11px] font-mono font-bold flex items-center bg-black/50 px-2 py-0.5 rounded-lg backdrop-blur-xs">
                              <ImageIcon className="w-3 h-3 mr-1 text-slate-300" />
                              {album.images?.length || album.imageCount || 0} Photos
                            </span>
                            <span className="text-[10px] text-slate-200 group-hover:text-white transition-colors flex items-center font-bold">
                              <span>Open</span>
                              <ChevronRight className="w-3 h-3 ml-0.5" />
                            </span>
                          </div>
                        </div>

                        {/* Album Metadata & Action Footer */}
                        <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                          <div className="space-y-1">
                            <h3 
                              onClick={() => setCurrentAlbum(album)}
                              className="font-extrabold text-base text-[#191d28] group-hover:text-slate-900 transition-colors line-clamp-2 cursor-pointer leading-snug"
                            >
                              {album.title}
                            </h3>
                            <p className="text-[11px] font-mono text-slate-500 truncate">
                              /{album.slug}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                            <button
                              onClick={() => setCurrentAlbum(album)}
                              className="bg-[#18191f] hover:bg-black text-white text-xs font-bold px-3 py-1.5 rounded-xl inline-flex items-center space-x-1 flex-1 justify-center cursor-pointer transition-all shadow-xs"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Manage Photos</span>
                            </button>

                            <button
                              onClick={() => {
                                setEditAlbumForm({
                                  id: album.id,
                                  title: album.title,
                                  category: album.category,
                                  categoryLabel: album.categoryLabel,
                                  year: album.year || '2026',
                                  cover: album.cover
                                });
                                setIsEditAlbumOpen(true);
                              }}
                              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                              title="Edit album metadata"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDeleteAlbum(album)}
                              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete album"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ALL PHOTOS MIGRATED BROWSER */}
          {activeTab === 'all_photos' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Showing {filteredAllPhotos.length} photographs across all campus albums</span>
                <span className="font-mono font-semibold text-slate-400">Click to preview in high resolution</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {filteredAllPhotos.slice(0, 96).map((photo, pIdx) => (
                  <div
                    key={pIdx}
                    onClick={() => setLightboxImage(photo.url)}
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all group cursor-pointer"
                  >
                    <div className="aspect-square bg-slate-900 relative overflow-hidden">
                      <img
                        src={photo.url}
                        alt={photo.albumTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = '/assets/banner-college.jpg';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end">
                        <p className="text-[10px] text-white font-bold truncate">{photo.albumTitle}</p>
                        <p className="text-[9px] text-white/80 font-mono">{photo.year || '2026'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* 5. LIGHTBOX MODAL */}
      {lightboxImage && (
        <div 
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col items-center"
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-3 right-3 z-10 p-2 bg-black/60 hover:bg-black/90 text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-2 max-h-[75vh] flex items-center justify-center overflow-auto">
              <img
                src={lightboxImage}
                alt="Enlarged Preview"
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
                onError={(e) => {
                  e.target.src = '/assets/banner-college.jpg';
                }}
              />
            </div>

            <div className="w-full p-4 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
              <span className="font-mono truncate max-w-md">{lightboxImage.startsWith('data:') ? 'Local Uploaded Asset' : lightboxImage}</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => copyPhotoLink(lightboxImage)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold flex items-center space-x-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedUrl === lightboxImage ? 'Copied!' : 'Copy Path'}</span>
                </button>
                <a
                  href={lightboxImage}
                  download="stphilos-photo.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white hover:bg-slate-100 text-slate-900 px-3.5 py-1.5 rounded-lg font-bold flex items-center space-x-1 cursor-pointer transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Photo</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. CREATE NEW ALBUM MODAL (WITH DRAG & DROP + FILE PICKER) */}
      {isCreateAlbumOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 my-8 max-h-[90vh] overflow-y-auto text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-xl text-[#191d28] flex items-center space-x-2">
                <FolderPlus className="w-5 h-5 text-slate-800" />
                <span>Create New Photo Album</span>
              </h3>
              <button
                onClick={() => setIsCreateAlbumOpen(false)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAlbum} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Album Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual Sports Meet 2026"
                  value={newAlbumForm.title}
                  onChange={(e) => setNewAlbumForm({ ...newAlbumForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 focus:bg-white text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Category Stream</label>
                  <select
                    value={newAlbumForm.category}
                    onChange={(e) => setNewAlbumForm({ ...newAlbumForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 focus:bg-white text-slate-900 font-medium"
                  >
                    {categories.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Academic Year</label>
                  <input
                    type="text"
                    placeholder="2026"
                    value={newAlbumForm.year}
                    onChange={(e) => setNewAlbumForm({ ...newAlbumForm, year: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              {/* DRAG & DROP / FILE BROWSER UPLOAD ZONE */}
              <div className="space-y-2">
                <label className="font-bold text-slate-700 flex items-center justify-between">
                  <span>Upload Album Photographs</span>
                  <span className="text-[11px] text-slate-500 font-semibold">
                    {uploadedFilesList.length} photo(s) selected
                  </span>
                </label>

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDropCreate}
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-6 rounded-2xl border-2 border-dashed transition-all text-center cursor-pointer flex flex-col items-center justify-center space-y-2 ${
                    isDragging
                      ? 'border-slate-800 bg-slate-100 scale-[1.01]'
                      : 'border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        processFiles(e.target.files, setUploadedFilesList);
                      }
                    }}
                  />
                  <div className="w-12 h-12 rounded-full bg-white shadow-xs border border-slate-200 text-slate-700 flex items-center justify-center">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Drag and drop photos here, or <span className="text-slate-900 underline">browse your files</span>
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Select multiple images (PNG, JPG, JPEG, WebP, GIF)
                    </p>
                  </div>
                </div>

                {/* Selected Image Preview Strip */}
                {uploadedFilesList.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <p className="text-[11px] font-bold text-slate-600">
                      Selected Photos Preview (Click ⭐ on a photo to set as album cover):
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
                      {uploadedFilesList.map((fileItem, idx) => {
                        const isCover = coverPhotoIndex === idx;
                        return (
                          <div
                            key={idx}
                            className={`relative aspect-square rounded-lg overflow-hidden border-2 bg-slate-900 group ${
                              isCover ? 'border-slate-900 ring-2 ring-slate-900/40' : 'border-slate-200'
                            }`}
                          >
                            <img
                              src={fileItem.dataUrl}
                              alt={fileItem.name}
                              className="w-full h-full object-cover"
                            />
                            
                            {/* Star Cover Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCoverPhotoIndex(idx);
                              }}
                              className={`absolute top-1 left-1 p-1 rounded-md text-[9px] font-bold flex items-center ${
                                isCover
                                  ? 'bg-white text-slate-900 shadow-xs'
                                  : 'bg-black/60 text-white hover:bg-black/80'
                              }`}
                              title={isCover ? 'Cover Photo' : 'Set as Cover'}
                            >
                              <Star className={`w-3 h-3 ${isCover ? 'fill-current' : ''}`} />
                            </button>

                            {/* Remove button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setUploadedFilesList(prev => prev.filter((_, i) => i !== idx));
                                if (coverPhotoIndex === idx) setCoverPhotoIndex(0);
                              }}
                              className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-rose-600 text-white rounded-md transition-colors"
                              title="Remove photo"
                            >
                              <X className="w-3 h-3" />
                            </button>

                            <div className="absolute bottom-0 inset-x-0 bg-black/70 p-1 text-[9px] text-white truncate text-center">
                              {fileItem.name}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateAlbumOpen(false);
                    setUploadedFilesList([]);
                  }}
                  className="px-4 py-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 font-bold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#18191f] hover:bg-black text-white px-5 py-2.5 rounded-xl font-bold shadow-xs flex items-center space-x-1.5 cursor-pointer transition-all"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Save & Publish Album</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. EDIT ALBUM MODAL */}
      {isEditAlbumOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-xl text-[#191d28] flex items-center space-x-2">
                <Edit3 className="w-5 h-5 text-slate-800" />
                <span>Edit Album Details</span>
              </h3>
              <button
                onClick={() => setIsEditAlbumOpen(false)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAlbumEdit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Album Title</label>
                <input
                  type="text"
                  required
                  value={editAlbumForm.title}
                  onChange={(e) => setEditAlbumForm({ ...editAlbumForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 focus:bg-white text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Category Stream</label>
                  <select
                    value={editAlbumForm.category}
                    onChange={(e) => setEditAlbumForm({ ...editAlbumForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 focus:bg-white text-slate-900 font-medium"
                  >
                    {categories.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Year</label>
                  <input
                    type="text"
                    value={editAlbumForm.year}
                    onChange={(e) => setEditAlbumForm({ ...editAlbumForm, year: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Cover Image URL / Path</label>
                <input
                  type="text"
                  value={editAlbumForm.cover}
                  onChange={(e) => setEditAlbumForm({ ...editAlbumForm, cover: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 focus:bg-white text-slate-900 font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditAlbumOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 font-bold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#18191f] hover:bg-black text-white px-5 py-2.5 rounded-xl font-bold shadow-xs cursor-pointer transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. ADD PHOTOS MODAL (WITH DRAG & DROP + FILE PICKER) */}
      {isAddPhotosOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 my-8 max-h-[90vh] overflow-y-auto text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-xl text-[#191d28] flex items-center space-x-2">
                <UploadCloud className="w-5 h-5 text-slate-800" />
                <span>Upload Photos to "{currentAlbum?.title}"</span>
              </h3>
              <button
                onClick={() => {
                  setIsAddPhotosOpen(false);
                  setAddPhotosList([]);
                }}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPhotosToAlbum} className="space-y-4 text-xs">
              
              {/* Dropzone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDropAdd}
                onClick={() => addPhotosInputRef.current?.click()}
                className={`p-6 rounded-2xl border-2 border-dashed transition-all text-center cursor-pointer flex flex-col items-center justify-center space-y-2 ${
                  isDragging
                    ? 'border-slate-800 bg-slate-100 scale-[1.01]'
                    : 'border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100'
                }`}
              >
                <input
                  ref={addPhotosInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      processFiles(e.target.files, setAddPhotosList);
                    }
                  }}
                />
                <div className="w-12 h-12 rounded-full bg-white shadow-xs border border-slate-200 text-slate-700 flex items-center justify-center">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Drag and drop photos here, or <span className="text-slate-900 underline">browse files</span>
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Select one or more images from your device
                  </p>
                </div>
              </div>

              {/* Previews */}
              {addPhotosList.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[11px] font-bold text-slate-600">
                    Ready to Upload ({addPhotosList.length} files):
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
                    {addPhotosList.map((fileItem, idx) => (
                      <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-900 group">
                        <img src={fileItem.dataUrl} alt={fileItem.name} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setAddPhotosList(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-rose-600 text-white rounded-md transition-colors cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <div className="absolute bottom-0 inset-x-0 bg-black/70 p-1 text-[9px] text-white truncate text-center">
                          {fileItem.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddPhotosOpen(false);
                    setAddPhotosList([]);
                  }}
                  className="px-4 py-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 font-bold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addPhotosList.length === 0}
                  className="bg-[#18191f] hover:bg-black text-white px-5 py-2.5 rounded-xl font-bold shadow-xs flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer transition-all"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Save & Append to Album</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
