import { useCallback, useEffect, useState } from "react";
import { Plus, Eye, FileText, EyeOff, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { myBlogs, removeBlog, updateblog } from "../api/blog";
import Button from "../ui/Button";
import { CategoryMeta } from "../../../shared/category";
import { showError, showSuccess } from "../utils/toast";
import type { blogType } from "../types/blogtype";
import AuthorDashboardSkeleton from "../components/skeletons/AuthorDashboardSkeleton";
import { getErrorMessage } from "../utils/getErrorMessage";

export default function AuthorDashboard() {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [userBlogs, setUserBlogs] = useState<blogType[] | null>(null);
  const [blogDetails, setBlogDetails] = useState({
    totalPages: 1,
    totalBlogs: 0,
  });
  const [unpublished, setUnpublished] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchMyBlogs = useCallback(async () => {
    try {
      const res = (await myBlogs(page)).data.data;

      setUserBlogs(res.cleanBlogs);
      setUnpublished(res.Unpublished);
      setBlogDetails({
        totalPages: Math.ceil(res.totalDocs / res.limit),
        totalBlogs: res.totalDocs,
      });
    } catch (error) {
      showError(getErrorMessage(error));
    }
  }, [page]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    fetchMyBlogs();
  }, [fetchMyBlogs]);

  if (!userBlogs) {
    return <AuthorDashboardSkeleton />;
  }

  const handleDelete = async (id: string) => {
    try {
      await removeBlog(id);
      fetchMyBlogs();
      showSuccess("Blog Deleted Succusfully");
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  const handlePublish = async (id: string, status: boolean) => {
    try {
      await updateblog({ isPublished: !status }, id);
      setUserBlogs((prev) => {
        if (!prev) return null;

        return prev.map((blog) => {
          if (blog.postId === id) {
            return {
              ...blog,
              isPublished: !status,
            };
          }

          return blog;
        });
      });
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  const visiblePages = Array.from(
    { length: blogDetails.totalPages },
    (_, i) => i + 1
  ).filter(
    (p) => p === 1 || p === blogDetails.totalPages || Math.abs(p - page) <= 1
  );

  return (
    <div className="h-screen bg-(--bg) flex p-10 text-(--text) overflow-hidden">
      {/* ================= MAIN ================= */}
      <div className="flex-1 p-8 flex flex-col">
        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            {
              label: "Total Blogs",
              value: blogDetails.totalBlogs,
              icon: FileText,
            },
            {
              label: "Published",
              value: blogDetails.totalBlogs - unpublished,
              icon: Eye,
            },
            { label: "Drafts", value: unpublished, icon: EyeOff },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-(--surface) border border-(--border) rounded-xl p-5"
            >
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <item.icon size={16} />
                {item.label}
              </div>
              <p className="text-2xl font-bold mt-3">{item.value}</p>
            </div>
          ))}
        </div>

        {/* ================= POSTS ================= */}
        <div className="lg:col-span-8 flex flex-1 flex-col bg-(--surface) border border-(--border) rounded-(--radius) overflow-hidden">
          {/* ================= TOP HEADER ================= */}
          <div className="p-4 flex justify-between items-center border-b border-(--border)">
            <h2 className="text-xl">Your Posts</h2>
            <span className="text-xs text-(--muted)">
              {userBlogs.length} articles
            </span>
          </div>

          {/* ================= SCROLL WRAPPER ================= */}
          <div className="flex-1">
            {userBlogs.length !== 0 ? (
              <table className="w-full text-left border-separate border-spacing-0">
                {/* ================= TABLE HEADER ================= */}
                <thead className="sticky top-0 z-20">
                  <tr className="bg-(--bg) border-b border-(--border) ">
                    <th className="px-4 py-5">No.</th>
                    <th className="px-4 py-5">Title</th>
                    <th className="px-4 py-5">Category</th>
                    <th className="px-4 py-5">Created On</th>
                    <th className="px-4 py-5">Last Updated</th>
                    <th className="px-4 py-5">Status</th>
                    <th className="px-4 py-5 text-center">Actions</th>
                  </tr>
                </thead>

                {/* ================= BODY ================= */}
                <tbody>
                  {userBlogs.map((blog, index) => {
                    const category =
                      CategoryMeta[blog.category as keyof typeof CategoryMeta];

                    return (
                      <tr
                        key={blog.postId}
                        onClick={() => navigate(`/blog/${blog.postId}`)}
                        className="group border-b border-(--border) hover:bg-(--surface-hover) transition cursor-pointer"
                      >
                        <td className="px-4 py-5 pl-5 text-sm flex justify-start">
                          {(page - 1) * 7 + index + 1}
                        </td>

                        <td className="px-4 py-5 text-sm font-medium">
                          {blog.title}
                        </td>

                        <td className="px-4 py-5 text-sm">
                          <div
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium"
                            style={{
                              backgroundColor: category.bg,
                              border: `1px solid ${category.border}`,
                              color: category.color,
                            }}
                          >
                            <category.icon size={14} />
                            {blog.category.replace("_", " ")}
                          </div>
                        </td>

                        <td className="px-4 py-5 text-sm text-(--muted)">
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </td>

                        <td className="px-4 py-5 text-sm text-(--muted)">
                          {new Date(
                            blog.updatedAt || blog.createdAt
                          ).toLocaleDateString()}
                        </td>

                        <td className="px-4 py-5 text-sm w-40">
                          <span
                            className={`px-2 py-1 rounded-md text-xs font-medium ${
                              blog.isPublished
                                ? "bg-green-500/10 text-green-400"
                                : "bg-yellow-500/10 text-yellow-400"
                            }`}
                          >
                            {blog.isPublished ? "Published" : "Unpublished"}
                          </span>
                        </td>

                        <td className="px-4 py-5 text-right align-middle w-28">
                          <div className="flex items-center justify-end">
                            <div className="flex items-center gap-2">
                              <div className="relative group/tooltip">
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePublish(
                                      blog.postId,
                                      blog.isPublished
                                    );
                                  }}
                                  className={`h-8 w-8 flex items-center justify-center rounded-lg transition text-(--muted) cursor-pointer
                                          ${
                                            blog.isPublished
                                              ? "hover:text-yellow-500 hover:bg-yellow-500/10"
                                              : "hover:text-green-500 hover:bg-green-500/10"
                                          }`}
                                >
                                  {blog.isPublished ? (
                                    <EyeOff size={16} />
                                  ) : (
                                    <Eye size={16} />
                                  )}
                                </Button>

                                <span className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black px-2 py-1 text-xs text-white opacity-0 group-hover/tooltip:opacity-100 transition pointer-events-none">
                                  {blog.isPublished ? "Unpublish" : "Publish"}
                                </span>
                              </div>
                              {/* EDIT */}
                              <div className="relative group/edit">
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/blog/publish/${blog.postId}`, {
                                      state: { from: location.pathname },
                                    });
                                  }}
                                  className="h-8 w-8 flex items-center justify-center rounded-lg text-(--muted) hover:text-blue-500 hover:bg-blue-500/10 transition cursor-pointer"
                                >
                                  <Pencil size={16} />
                                </Button>
                                <span className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black px-2 py-1 text-xs text-white opacity-0 group-hover/edit:opacity-100 transition pointer-events-none">
                                  Edit
                                </span>
                              </div>

                              {/* DELETE */}
                              <div className="relative group/delete">
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setIsModalOpen(true);
                                    setDeleteId(blog.postId);
                                  }}
                                  className="h-8 w-8 flex items-center justify-center rounded-lg text-(--muted) hover:text-red-500 hover:bg-red-500/10 transition cursor-pointer"
                                >
                                  <Trash2 size={16} />
                                </Button>

                                <span className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black px-2 py-1 text-xs text-white opacity-0 group-hover/delete:opacity-100 transition pointer-events-none">
                                  Delete
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
                {/* ICON CONTAINER */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-2xl" />

                  <div className="relative h-20 w-20 rounded-2xl border border-blue-500/20 bg-linear-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
                    <FileText
                      size={36}
                      className="text-blue-400"
                      strokeWidth={1.8}
                    />
                  </div>
                </div>

                {/* HEADING */}
                <h2 className="text-2xl font-semibold mb-3">
                  No posts published yet
                </h2>

                {/* DESCRIPTION */}
                <p className="max-w-md text-(--muted) text-sm leading-relaxed mb-8">
                  Start sharing your thoughts, ideas, and experiences with the
                  world. Create your first article and begin building your
                  audience today.
                </p>

                {/* CTA BUTTON */}
                <Button
                  onClick={() => navigate("/blog/publish")}
                  className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-(--primary) shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                >
                  <Plus size={18} />
                  Published Your First Post
                </Button>
              </div>
            )}
          </div>

          {userBlogs.length !== 0 && (
            <div className="border-t border-(--border) px-4 py-4 flex justify-center gap-2 bg-(--surface)">
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
                onClick={() =>
                  setPage((p) => Math.min(p + 1, blogDetails.totalPages))
                }
                disabled={page === blogDetails.totalPages}
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="relative w-105 min-h-57.5 bg-(--bg) border border-(--border) rounded-2xl p-6 shadow-2xl flex flex-col justify-between">
            {/* CLOSE BUTTON */}
            <Button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 h-8 w-8 flex items-center justify-center rounded-full text-(--muted) hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              ✕
            </Button>

            {/* CONTENT */}
            <div>
              <h2 className="text-xl font-semibold mb-8">Delete Blog Post</h2>

              <p className="text-sm text-(--muted) leading-relaxed">
                Are you sure you want to delete this blog post? This action is
                permanent and cannot be undone.
              </p>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 mt-6">
              <Button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-md text-sm border border-(--border) hover:bg-white/5 transition cursor-pointer"
              >
                Cancel
              </Button>

              <Button
                onClick={() => {
                  if (!deleteId) return;
                  handleDelete(deleteId);
                  setIsModalOpen(false);
                  setDeleteId(null);
                }}
                className="px-4 py-2 rounded-md text-sm bg-red-600 hover:bg-red-700 text-white transition cursor-pointer"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
