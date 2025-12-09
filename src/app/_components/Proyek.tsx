"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";

// Icons
import { FaReact, FaNodeJs } from "react-icons/fa";
import { SiFlutter, SiExpress, SiTailwindcss, SiPython } from "react-icons/si";

interface Proyek {
  _id?: string;
  title: string;
  description: string;
  image?: string; // diasumsikan string URL (File tidak direkomendasikan di client-side rendering)
  technologies: string[];
  oldprice: string;
  price: string;
  category: string;
}

const categories: string[] = ["All", "Website", "Joki Skripsi", "Mobile"];

const categoryColors: { [key: string]: string } = {
  All: "bg-blue-300 border-2 border-blue-500 text-blue-900",
  Website: "bg-red-300 border-2 border-red-500 text-red-900",
  "Joki Skripsi": "bg-yellow-200 border-2 border-yellow-400 text-yellow-700",
  Mobile: "bg-green-200 border-2 border-green-400 text-green-700",
};

// Map tech → icon
const normalizeTech = (tech: string) => tech.replace(/\s+/g, "").toLowerCase();
const techIcons: { [key: string]: React.ReactNode } = {
  react: <FaReact className="inline mr-1 size-4" />,
  reactjs: <FaReact className="inline mr-1 size-4" />,
  node: <FaNodeJs className="inline mr-1 size-4" />,
  nodejs: <FaNodeJs className="inline mr-1 size-4" />,
  express: <SiExpress className="inline mr-1 size-4" />,
  expressjs: <SiExpress className="inline mr-1 size-4" />,
  flutter: <SiFlutter className="inline mr-1 size-4" />,
  tailwind: <SiTailwindcss className="inline mr-1 size-4" />,
  tailwindcss: <SiTailwindcss className="inline mr-1 size-4" />,
  python: <SiPython className="inline mr-1 size-4" />,
};

const ProjectList: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [proyeks, setProyeks] = useState<Proyek[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    AOS.init({ duration: 500, once: true });
  }, []);

  useEffect(() => {
    const fetchProyeks = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/proyek");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const result = await res.json();
        const proyeksData = Array.isArray(result.data) ? result.data : [];
        setProyeks(proyeksData);
      } catch (err) {
        setError("Gagal memuat data proyek. Coba lagi nanti.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProyeks();
  }, []);

  const filteredProjects =
    selectedCategory === "All"
      ? proyeks
      : proyeks.filter((proyek) => proyek.category === selectedCategory);

  return (
    <div
      className="min-h-screen flex flex-col items-center px-2 py-24"
      id="proyek"
    >
      <h1
        className="dark:text-white text-black text-center text-2xl font-bold mb-4"
        data-aos="fade-up"
      >
        Kami Punya Proyek Siap Pakai
      </h1>
      <p
        className="dark:text-white text-black text-center mb-6 max-w-2xl"
        data-aos="fade-up"
      >
        Telusuri proyek terbaru kami, temukan proyek siap pakai sesuai kebutuhanmu untuk mendapatkan harga lebih murah dan penyelesaian lebih cepat!
      </p>

      {/* Filter Kategori */}
      <div
        className="flex flex-wrap justify-center gap-4 mb-8 px-2"
        data-aos="fade-up"
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`py-2 px-4 rounded-lg transition-colors font-semibold text-sm md:text-base ${
              selectedCategory === category
                ? categoryColors[category] || "bg-gray-300"
                : "dark:bg-[#0a2615] bg-white border dark:border-white/10 border-gray-300 dark:text-white text-black shadow-xl"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-400 text-center">Memuat proyek...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl"
          data-aos="fade-up"
        >
          {filteredProjects.length > 0 ? (
            filteredProjects.map((proyek, index) => (
              <motion.div
                key={proyek._id || index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className="relative bg-white dark:bg-[#0a2615] border dark:border-white/10 border-gray-300 shadow-[0_10px_30px_rgba(0,0,0,0.1)] p-4 rounded-lg overflow-hidden"
              >
                {/* Background SVG (opsional — aktifkan jika ada file) */}
                {/* <div className="absolute inset-0 z-0 bg-[url('/green_stars.png')] bg-top bg-no-repeat bg-contain opacity-20 pointer-events-none" /> */}

                <div className="relative z-10 flex flex-col h-full">
                  {/* Gambar */}
                  {proyek.image ? (
                    <div className="w-full h-40 overflow-hidden rounded-lg mb-4">
                      <Image
                        src={proyek.image}
                        alt={proyek.title}
                        width={320}
                        height={160}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">No Image</span>
                    </div>
                  )}

                  {/* Konten */}
                  <div className="flex flex-col flex-grow">
                    <h3 className="font-bold text-lg dark:text-white text-black mb-2">
                      {proyek.title}
                    </h3>
                    <p className="text-sm dark:text-gray-300 text-gray-700 mb-4 line-clamp-3">
                      {proyek.description}
                    </p>

                    {/* Teknologi */}
                    <div className="flex flex-wrap gap-2 my-2">
                      {proyek.technologies.map((tech, idx) => {
                        const normalized = normalizeTech(tech);
                        return (
                          <span
                            key={idx}
                            className="bg-gradient-to-r from-green-200 to-lime-200 text-black border border-white/10 py-1 px-3 rounded-full text-xs flex items-center"
                          >
                            {techIcons[normalized] || null}
                            <span className="ml-1">{tech}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Footer: harga */}
                  <div className="mt-auto pt-2">
                    <hr className="border border-gray-300 dark:border-gray-600 mb-3" />
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Proyek Siap Pakai
                      </span>
                      <div className="text-right">
                        <span className="block text-xs text-gray-500 dark:text-gray-400 line-through">
                          Rp {proyek.oldprice}
                        </span>
                        <span className="block font-bold text-lg text-green-600 dark:text-green-400">
                          Rp {proyek.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="col-span-full text-gray-400 text-center">
              Tidak ada proyek dalam kategori ini.
            </p>
          )}
        </div>
      )}

      <div className="mt-8">
        <a
          href="#"
          className="text-green-500 hover:text-green-600 dark:hover:text-green-300 font-medium"
        >
          Lihat semua proyek →
        </a>
      </div>
    </div>
  );
};

export default ProjectList;