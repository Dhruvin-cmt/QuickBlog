import { useEffect, useState } from "react";
import { fetchFilteredBlog } from "../../api/blog";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Funnel,
  Heart,
  MessageCircleMore,
  User,
  X,
} from "lucide-react";
import { formattedDate } from "../../utils/formatDate";
import { extractText } from "../../utils/extractText";
import { Category, CategoryMeta } from "../../shared/category";
import Button from "../../ui/Button";
import FullScreenLoader from "../../components/ScreenLoader";
import Footer from "../../layout/Footer";
import { showError } from "../../utils/toast";
import Input from "../../ui/Input";
import { getErrorMessage } from "../../utils/getErrorMessage";
import type { blogType } from "../../types/blogtype";

export default function BloglistPage() {
  const [search, setSearch] = useState<string>("");
  const [blogs, setBlogs] = useState<blogType[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openDrower, setOpenDrower] = useState<boolean>(false);
  const [category, setCategory] = useState<keyof typeof CategoryMeta | "">("");
  const limit = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const filtered = async () => {
      try {
        const res = (await fetchFilteredBlog(page, search, category)).data.data;
        setBlogs(res.cleanBlogs);
        setTotalPages(Math.ceil(res.totalDocs / limit));
      } catch (error) {
        showError(getErrorMessage(error));
      }
    };
    filtered();
  }, [category, search, page]);

  if (!blogs) {
    return <FullScreenLoader text="Fetching Blogs for you..." />;
  }

  const visiblePages = Array.from(
    { length: totalPages },
    (_, i) => i + 1
  ).filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1);

  return (
    <div className="min-h-screen flex flex-col bg-(--bg) text-(--text)">
      <div className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex-1">
          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 leading-tight">
            Discover Insights & Stories
          </h1>

          <p className="text-(--muted) mb-6 text-sm sm:text-base">
            Explore articles, tutorials, and thoughts shared by developers and
            writers.
          </p>

          {/* Search + Filter */}
          <div className="flex items-start gap-3 mb-6">
            {/* Search */}
            <div className="flex-1 min-w-0">
              <Input
                type="text"
                placeholder="Search blogs..."
                value={search}
                onChange={(e) => {
                  setPage(1);
                  setSearch(e.target.value);
                }}
              />
            </div>

            {/* Filter */}
            <div className="relative shrink-0">
              {/* Trigger */}
              <Button
                onClick={() => setOpenDrower((prev) => !prev)}
                className="
      h-12
      w-12
      flex
      items-center
      justify-center
      border border-(--border)
      rounded-md
      bg-(--surface-2)
      cursor-pointer
    "
              >
                <Funnel className="text-(--muted)" size={18} />
              </Button>

              {/* Dropdown */}
              {openDrower && (
                <div
                  className="
        absolute
        right-0
        top-14
        z-50

        w-56
        max-w-[85vw]

        bg-(--surface-2)
        border border-(--border)
        rounded-md
        shadow-lg

        max-h-64
        overflow-y-auto
        no-scrollbar
      "
                >
                  {Category.map((cat) => {
                    const Icon = CategoryMeta[cat].icon;
                    const iconColor = CategoryMeta[cat].color;

                    return (
                      <Button
                        type="button"
                        key={cat}
                        onClick={() => {
                          setCategory(cat);
                          setPage(1);
                          setOpenDrower(false);
                        }}
                        className={`
              w-full
              flex
              items-center
              gap-2
              px-3
              py-3
              text-sm
              transition
              hover:bg-gray-800
              cursor-pointer
              bg-(--surface)

              ${category === cat ? "bg-white/10" : ""}
            `}
                      >
                        <Icon size={16} style={{ color: iconColor }} />

                        <span className="truncate">
                          {cat.replaceAll("_", " ")}
                        </span>
                      </Button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Selected Filters */}
          {category &&
            (() => {
              const meta = CategoryMeta[category];
              const Icon = meta.icon;

              return (
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <div
                    className="
                      inline-flex
                      items-center
                      gap-2
                      px-2
                      py-1
                      rounded-md
                      border
                      text-sm
                      cursor-pointer
                      transition
                    "
                    style={{
                      backgroundColor: meta.bg,
                      borderColor: meta.border,
                      color: meta.color,
                    }}
                  >
                    <Icon
                      size={15}
                      style={{
                        color: meta.color,
                      }}
                    />

                    <span className="capitalize">
                      {category.replaceAll("_", " ")}
                    </span>

                    <Button
                      onClick={() => {
                        setCategory("");
                        setPage(1);
                      }}
                      className="
                        flex
                        items-center
                        justify-center
                        rounded-full
                        hover:bg-black/10
                        transition
                        cursor-pointer
                      "
                    >
                      <X size={14} />
                    </Button>
                  </div>
                </div>
              );
            })()}

          {/* Blog List */}
          <div>
            {blogs.map((blog) => (
              <div
                key={blog.postId}
                onClick={() => navigate(`/blog/${blog.postId}`)}
                className="
                  cursor-pointer
                  border-b border-b-(--border)
                  py-5 sm:py-6
                  px-1 sm:px-2
                  hover:border-(--primary)
                  transition
                "
              >
                {/* Meta Row */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-(--text) mb-4">
                  {/* Left */}
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    {/* Author */}
                    <div className="flex items-center gap-2 min-w-0">
                      <User size={14} />

                      <span className="truncate">
                        {blog?.author?.firstName} {blog?.author?.lastName}
                      </span>
                    </div>

                    {/* Category */}
                    {(() => {
                      const meta = CategoryMeta[blog.category];
                      const Icon = meta.icon;

                      return (
                        <div
                          className="flex items-center gap-2 px-2 py-1 rounded-md border text-xs whitespace-nowrap"
                          style={{
                            backgroundColor: meta.bg,
                            borderColor: meta.border,
                            color: meta.color,
                          }}
                        >
                          <Icon
                            size={14}
                            style={{
                              color: meta.color,
                              backgroundColor: meta.bg,
                            }}
                          />

                          <span>{blog.category.replaceAll("_", " ")}</span>
                        </div>
                      );
                    })()}

                    {/* Updated */}
                    {blog.createdAt !== blog.updatedAt && (
                      <div className="text-(--muted) italic text-xs sm:text-sm">
                        Updated on: {formattedDate(new Date(blog.updatedAt))}
                      </div>
                    )}
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-1 text-xs sm:text-sm text-(--muted)">
                    <Calendar size={14} />

                    {formattedDate(new Date(blog.createdAt))}
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-lg sm:text-xl font-semibold text-(--text) mb-2 transition leading-snug">
                  {blog.title}
                </h2>

                {/* Preview */}
                <p className="text-(--muted) line-clamp-2 mb-3 text-sm sm:text-base leading-relaxed">
                  {extractText(blog.body)}
                </p>

                {/* Footer */}
                <div className="text-[color-mix(in_srgb,var(--text),transparent_40%)] text-md flex gap-3">
                  <div className="flex items-center gap-2">
                    <MessageCircleMore size={14} />
                    {blog.commentsCount}
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart size={14} />
                    {blog.commentsCount}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {blogs.length !== 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mt-8 sm:mt-10 px-2">
              {/* Prev */}
              <Button
                label="Prev"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="
                px-3 py-2
                rounded-md
                border border-(--border)
                text-sm
                disabled:opacity-40
                cursor-pointer
              "
              />

              {/* Pages */}
              {visiblePages.map((pageNumber, index) => {
                const prev = visiblePages[index - 1];

                return (
                  <div key={pageNumber} className="flex items-center gap-2">
                    {/* Dots */}
                    {prev && pageNumber - prev > 1 && (
                      <span className="text-(--muted)">...</span>
                    )}

                    <Button
                      label={pageNumber.toString()}
                      onClick={() => setPage(pageNumber)}
                      className={`
                      min-w-10
                      px-3 py-2
                      rounded-md
                      text-sm
                      border
                      transition
                      cursor-pointer
                      ${
                        page === pageNumber
                          ? "bg-(--primary) text-white border-(--primary)"
                          : "border-(--border) hover:bg-white/5"
                      }
                    `}
                    />
                  </div>
                );
              })}

              {/* Next */}
              <Button
                label="Next"
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="
                px-3 py-2
                rounded-md
                border border-(--border)
                text-sm
                disabled:opacity-40
                cursor-pointer
              "
              />
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
