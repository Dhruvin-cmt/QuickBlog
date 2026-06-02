import { ArrowLeft, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchBlogById } from "../../api/blog";
import { useNavigate, useParams } from "react-router-dom";
import { formattedDate } from "../../utils/formatDate";
import BlogView from "../../components/Blog/BlogView";
import { CategoryMeta } from "../../shared/category";
import FullScreenLoader from "../../components/ScreenLoader";
import Footer from "../../layout/Footer";
import BlogNotFound from "../../components/Blog/BlogNotFound";
import CommentForm from "../../form/CommentForm";
import { getComment } from "../../api/comment";
import Button from "../../ui/Button";
import { socket } from "../../socket/socket";
import type { comment, commentResponse } from "../../types/commenttype";
import { getErrorMessage } from "../../utils/getErrorMessage";
import type { blogType } from "../../types/blogtype";

export default function SingleBlogPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [content, setContent] = useState<blogType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<commentResponse>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        if(!id) {
          setError("Blog ID is missing")
          return
        }

        const res = (await getComment(id, page)).data.data;

        setComments((prev: commentResponse) => {
          const map = new Map<string, comment>();

          [...prev, ...res.loadedComments].forEach((c) => {
            map.set(c.commentId, c);
          });

          return Array.from(map.values());
        });

        setHasMore(res.hasMore);
      } catch (error) {
        setError(getErrorMessage(error));
      }
    };

    fetchComments();
  }, [page, id]);

  useEffect(() => {
    const fetchOneBlog = async () => {
      try {
        if(!id) {
          setError("Blog ID is missing")
          return
        }

        const res = (await fetchBlogById(id)).data.data;

        setContent(res);
      } catch (error) {
        setError(getErrorMessage(error));
      }
    };

    fetchOneBlog();
  }, [id]);

  useEffect(() => {
    if (!id || !socket) return;

    socket.emit("post:join", id);

    const handleJoin = (data : string) => console.log(data);

    socket.on("joined", handleJoin);

    return () => {
      socket.off("joined", handleJoin);
    };
  }, [id]);

  useEffect(() => {
    if (!socket) return;

    const handler = (data : comment) => {
      setComments((prev) => {
        const exists = prev.some((c) => c.commentId === data.commentId);

        if (exists) return prev;

        return [data, ...prev];
      });

      setContent((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          commentsCount: prev.commentsCount + 1,
        };
      });
    };

    socket.on("comment:receive", handler);

    return () => {
      socket.off("comment:receive", handler);
    };
  }, []);

  if (error) {
    return <BlogNotFound error={error} />;
  }

  if (!content) {
    return (
      <FullScreenLoader text="This Blogs might stays within your mind..." />
    );
  }

  return (
    <div className="min-h-screen bg-(--bg) text-(--text) flex flex-col overflow-x-hidden">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex-1">
        {/* TOP ACTIONS */}
        <div className="mb-6 sm:mb-8">
          {/* BACK BUTTON */}
          <Button
            onClick={() => navigate(-1)}
            className="
              flex items-center gap-2
              px-4 py-2
              rounded-lg
              border border-(--border)
              hover:bg-white/5
              transition
              cursor-pointer
              text-sm sm:text-base
            "
          >
            <ArrowLeft size={18} />
            Back
          </Button>
        </div>

        {/* Title */}
        <h1
          className="
            text-2xl sm:text-3xl lg:text-4xl
            font-bold
            leading-tight sm:leading-snug
            mb-6
            break-words
          "
        >
          {content.title}
        </h1>

        {/* Author section */}
        <div
          className="
            flex flex-col gap-4
            sm:flex-row sm:items-center sm:justify-between
            mb-8 sm:mb-10
            border-t border-(--border)
            pt-5 sm:pt-6
          "
        >
          {/* Author */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 min-w-0">
            {/* Avatar */}
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gray-700 flex items-center justify-center shrink-0">
              <UserRound size={20} />
            </div>

            {/* User Info */}
            <div className="min-w-0">
              <p className="text-sm sm:text-base font-semibold text-(--text) truncate">
                John Doe
              </p>

              <p className="text-xs sm:text-sm text-gray-500">
                Author
              </p>
            </div>

            {/* Category */}
            {(() => {
              const meta = CategoryMeta[content.category];
              const Icon = meta.icon;

              return (
                <div
                  className="
                    flex items-center gap-2
                    px-2 py-1
                    rounded-md border
                    text-xs
                    whitespace-nowrap
                  "
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

                  <span>
                    {content.category.replaceAll("_", " ")}
                  </span>
                </div>
              );
            })()}
          </div>

          {/* Date */}
          <div className="text-xs sm:text-sm text-(--muted)">
            {formattedDate(new Date(content.createdAt))}
          </div>
        </div>

        {/* Blog content */}
        <div
          className="
            prose prose-invert
            prose-sm sm:prose-base lg:prose-lg
            max-w-none
            mb-10
            overflow-hidden
            break-words
          "
        >
          <BlogView content={content.body} />
        </div>

        {/* Comments heading */}
        <h2
          className="
            text-xl sm:text-2xl
            font-semibold
            mt-10
            mb-4
            border-t border-(--border)
            pt-5 sm:pt-6
          "
        >
          {content?.commentsCount} Comments
        </h2>

        {/* Write Comment */}
        <div className="border-t border-(--border) pt-5 sm:pt-6 mb-8">
          <div className="flex gap-3 items-start">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center shrink-0">
              <UserRound size={18} />
            </div>

            {/* Input */}
            <div className="flex-1 min-w-0">
              <CommentForm postId={content?.postId} />
            </div>
          </div>
        </div>

        {/* Comments list */}
        <div className="divide-y divide-(--border)">
          {comments.length > 0 &&
            comments?.map((cmt) => (
              <div key={cmt.commentId} className="py-5">
                {/* User + time */}
                <div
                  className="
                    flex flex-wrap items-center
                    gap-2
                    text-xs sm:text-sm
                    text-(--muted)
                    mb-2
                  "
                >
                  {/* Avatar */}
                  <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-xs shrink-0">
                    {cmt.user.firstName?.[0]}
                    {cmt.user.lastName?.[0]}
                  </div>

                  {/* Name */}
                  <span className="text-white font-medium break-words">
                    {cmt.user.firstName} {cmt.user.lastName}
                  </span>

                  <span className="text-gray-500 hidden sm:inline">
                    •
                  </span>

                  {/* Date */}
                  <span className="break-words">
                    {formattedDate(new Date(cmt.createdAt))}
                  </span>
                </div>

                {/* Comment text */}
                <p
                  className="
                    text-gray-300
                    leading-relaxed
                    pl-0 sm:pl-9
                    text-sm sm:text-base
                    wrap-break-word
                  "
                >
                  {cmt.message}
                </p>
              </div>
            ))}
        </div>

        {/* Load more */}
        {hasMore && (
          <div className="flex justify-center mt-6 sm:mt-8">
            <Button
              onClick={() => setPage((prev) => prev + 1)}
              className="
                w-full sm:w-auto
                px-5 py-2.5
                rounded-lg
                border border-(--border)
                hover:bg-white/5
                transition-colors
                cursor-pointer
                text-sm sm:text-base
              "
            >
              Load More Comments
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}